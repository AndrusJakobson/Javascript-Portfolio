var startUrl = "../../../";
$("body").hide();
var timeout = null;

$(".firstViewContainer").click(function(){
    $(".firstViewContainer").removeClass("cursor");

    $("#leftHalf").animate({left: "-10vw"}, {
        duration: 1000
    });
    $("#rightHalf").animate({left: "10vw"}, {
        duration: 1000,
        complete: function(){
            $("#leftHalf").animate({left: "-50vw"}, 2000);
            $("#rightHalf").animate({left: "50vw"}, {
                duration:2000,
                complete: function(){
                    $(".firstViewContainer").remove();
                }
            });
        }
    });
});

$("body").on("click", ".disableParentClick", function(event){
    event.stopPropagation();
});

function addMainPage(contents){
    printRows(contents, $(".secondView"), 'mainPage', "content/");
    $("body").on('click', '.mainPage', function(){
        if(!classExists("active")){
            hasOnClickLoad($(this));
            $(".topView").removeClass('topView');
            $(".secondView").children(".close").removeClass("hidden");

            $(this).addClass('topView active');
            $(this).find("h1").removeClass("center");
            $(this).find(".innerContent").addClass('visibleContent').removeClass('noEvents');
        }else{
            closeActive();
        }
    });
}

function hasOnClickLoad(element){
    const contentDivs = element.find(".innerContent").children("div");
    const actionElement = getActionElement(contentDivs);

    if(isObjectEmpty(actionElement)){
        return false;
    }
    if(!hasContent(actionElement['element'])){
        generateSecondaryView(actionElement);
    }
}

function isObjectEmpty(element){
    return $.isEmptyObject(element);
}

function hasContent(element){
    return element.children().length != 0;
}

function generateSecondaryView(actionElement){
    const parentDiv = actionElement['element'];
    const folder = parentDiv.attr("folder");
    switch(actionElement['class']){
        case "gallery":
            generateGalleryView(parentDiv, folder);
            break;
        case "slideshow":
            generateSlideshowView(parentDiv, folder);
            generateSlideshowDetailView(parentDiv);
            break;
        case "multiPage":
            generateMultiPageView(parentDiv, folder);
            break;
        default:
            break;
    }
}

function generateMultiPageView(parentDiv, folder){
    getFiles(folder, function(files){
        let nextExtraClass = "";
        if(isOneOrLessItems(files)){
            nextExtraClass = "arrow-invisible";
        }
        parentDiv.prepend(        
            '<div class="arrow">' +
                '<span class="previous arrow-invisible">❮</span>' +
                '<span class="next ' + nextExtraClass + '">❯</span>' +
            '</div>'
        );
        $.each(files, function(key, fileName){
            const filePath = folder + "/" + fileName;
            $.ajax({
                url: filePath,
                async: false,
                success: function(fileData){
                    const backgroundColor = getPageBackgroundColor(parentDiv);
                    const divClass = firstMultiPageActiveClass(key);
                    parentDiv.append(
                        "<div style='background-color: " + backgroundColor + ";'" + divClass + ">" + fileData + "</div>"
                    )
                }
            });
        });
    });
}

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }


$("body").on("click", ".next:not(.arrow-invisible)", function(event){
    event.stopPropagation();
    const activePages = $(this).parent().siblings(".multiPage-active");
    const currentPage = activePages.last();
    const nextPage = currentPage.next();
    if(nextPage.next().length == 0){
        $(this).addClass("arrow-invisible");
    }
    nextPage.addClass("multiPage-active");
    $(this).siblings(".previous").removeClass("arrow-invisible");
});

$("body").on("click", ".previous:not(.arrow-invisible)", function(event){
    event.stopPropagation();
    const activePages = $(this).parent().siblings(".multiPage-active");
    const currentPage = activePages.last();


    if((activePages.length - 1) <= 1){
        $(this).addClass("arrow-invisible");
    }

    $(this).siblings(".next").removeClass("arrow-invisible");
    currentPage.removeClass("multiPage-active");
});

function firstMultiPageActiveClass(index){
    if(index == 0){
        return "class='multiPage-active'";
    }
    return "";
}

function isOneOrLessItems(items){
    return items.length <= 0
}

function generateSlideshowDetailView(parentDiv){
    parentDiv.prepend("<div style='background-color:" + getPageBackgroundColor(parentDiv) + ";' class='slideshow-detailView'></div>");
}

function getPageBackgroundColor(element){
    return element.closest(".mainPage").css("background-color");
}

function generateSlideshowView(parentDiv, folder){
    parentDiv.prepend("<div class='slideshow-content'></div>");

    const slidesContent = parentDiv.find(".slideshow-content");
    slidesContent.prepend("<div class='slideshow-allItems'></div>");

    const slideshowContent = slidesContent.find(".slideshow-allItems");
    slideshowContent.prepend("<div class='slideshow-item slideshow-empty'></div>");
    
    getFiles(folder, function(files){
        var images = new Array();
        var index = 0;
        $.each(files, function(key, fileName){
            const filePath = folder + "/" + fileName;
            $.ajax({
                url: filePath,
                success: function(fileData){                    
                    const title = getTitle(fileData);
                    const imagePath = title.attr("image");
                    const imageClass = getImageInitialClass(key);

                    const image =   $("<div folder='" + folder + "/" + fileName + "' class='slideshow-item'>" +
                                        "<img src='" + imagePath + "' alt='" + title.html() + "'/>" +
                                    "</div>");
                    images.push(image);
                    index++;                    
                    if(index == files.length){
                        insertImagesIntoView(slideshowContent, images);
                    }

                }
            });
        });
        // slideshowContent.append("<div class='slideshow-item slideshow-empty'></div>");
    });
}

function insertImagesIntoView(slideshowContent, images){
    console.log(images);
    $.each(images, function(key, image){
        image.addClass(getImageInitialClass(key));
        slideshowContent.append(image);
        console.log(image);
    });
    slideshowContent.append("<div class='slideshow-item slideshow-empty'></div>");
}

function getImageInitialClass(index){
    if(index == 0){
        return "slideshow-center normalScale";
    }
    return "";
}

function getFiles(directory, callback){
    $.ajax({
        url: "fileCount.php",
        data: {filePath: directory},
        method: "POST",
        success: function(data){
            const json = JSON.parse(data);
            if(json.status == 1){
                callback(json.files)
            }else{
                callback(0);
            }
        }
    })
}

function isDivEmpty(divObject){
    if(divObject.is(":empty")){
        return true;
    }
    return false;
}

$("body").on("click", ".slideshow-item", function(event){
    const currentSlide = $(this);
    if(!isDivEmpty(currentSlide)){
        event.stopPropagation();
        const slideContianer = currentSlide.parent();

        if(isAnimating(slideContianer)){
            return false;
        }

        if(isCenterSlide(currentSlide)){
            showSlideDetailView(currentSlide);
        }else if(isLeftSlide(currentSlide)){
            navigateToRight(currentSlide);
        }else if(isRightSlide(currentSlide)){
            navigateToLeft(currentSlide);
        }
    }
});

function isAnimating(element){
    return element.is(":animated");
}

function navigateToLeft(currentSlide){
    currentSlide.prev().removeClass("slideshow-center normalScale");
    const slideContainer = currentSlide.parent();
    const currentLeft = getLeft(slideContainer);
    const newLeft = (new Number(currentLeft) - 31.3333333) + "vw";
    slideContainer.animate({
        left: newLeft,
    }, 500, function(){
        currentSlide.addClass("slideshow-center normalScale");
    });

}

function getLeft(element){
    const leftInPx = element.css('left').replace("px", "");
    const vwValue = (100 / ($(window).width()));
    return (leftInPx * vwValue).toFixed(2);
}

function navigateToRight(currentSlide){
    currentSlide.next().removeClass("slideshow-center normalScale");
    const slideContainer = currentSlide.parent();
    const currentLeft = getLeft(slideContainer);
    const newLeft = (new Number(currentLeft) + 31.3333333) + "vw";
    slideContainer.animate({
        left: newLeft
    }, 500, function(){
        currentSlide.addClass("slideshow-center normalScale");
    });
}

function showSlideDetailView(currentSlide){
    const detailView = currentSlide.closest(".slideshow-content").siblings(".slideshow-detailView");
    const filePath = currentSlide.attr("folder");

    detailView.addClass("activeDetail");

    if(detailView.attr("folder") != filePath){
        detailView.empty();
        $.ajax({
            url: filePath,
            success: function(fileData){
                detailView.attr("folder", filePath);
                var content = getContent(fileData);
                detailView.prepend(content.get());
            }
        });
    }
}

$("body").on("click", ".activeDetail", function(event){
    event.stopPropagation();
    $(this).removeClass("activeDetail");
});


function getContent(fileData){
    return $($(fileData)[2]);
}

function isCenterSlide(clickedSlide){
    if(clickedSlide.hasClass("slideshow-center")){
        return true;
    }
    return false;
}

function isLeftSlide(clickedSlide){
    const nextSlide = clickedSlide.next(); 
    if(nextSlide.hasClass("slideshow-center")){
        return true;
    }
    return false;
}

function isRightSlide(clickedSlide){
    const previousSlide = clickedSlide.prev();
    if(previousSlide.hasClass("slideshow-center")){
        return true;
    }
    return false;
}

function generateGalleryView(parentDiv, folder){
    getFiles(folder, function(files){

        parentDiv.append(
            "<div class='disableParentClick gallery-naviagtion'></div>" +
            "<div class='disableParentClick gallery-group'>" +
                "<div class='gallery-content'></div>" +
            "</div>"
        );

        // parentDiv.append("<div class='row'>" +
        //     "<div class='disableParentClick col-sm-3 gallery-naviagtion'></div>" +
        //     "<div class='disableParentClick col-sm-9 gallery-group'>" +
        //         "<div class='gallery-content'></div>" +
        //     "</div>" +
        // "</div>");

        $.each(files, function(key, fileName){
            const filePath = folder + "/" + fileName;
            $.ajax({
                url: filePath,
                success: function(fileData){
                    var title = getTitle(fileData).addClass("navigation").attr("folder", filePath);
                    parentDiv.find(".gallery-naviagtion").prepend(title.get());
                }
            });
        });
    })
    navigationControls();
}

function getTitle(fileData){
    return $($(fileData)[0]);
}

function navigationControls(){
    $("body").on("click", ".navigation", function(){
        if(!$(this).hasClass("activeNavigation")){
            closeIframe();
            $(this).siblings().removeClass("activeNavigation");
            $(this).addClass("activeNavigation");
            const galleryContent = $(this).closest(".gallery-naviagtion").siblings().children();
            galleryContent.empty();
            const contentPath = $(this).attr("folder");
            $.ajax({
                url: contentPath,
                success: function(fileData){
                    const fileContent = $(fileData).children();
                    galleryContent.prepend(fileContent);
                }
            });
        }
    });
}

$("body").on("click", ".iframe", function(){
    const galleryContent = $(this).closest(".gallery-group");
    const iframeUrl = $(this).attr("iframe");
    galleryContent.append("<div class='iframe-content'>" +
        "<span class='close iframeClose'>❌</span>" +  
        "<iframe src=" + iframeUrl + "></iframe>" +
    "</div>");
});

function getActionElement(contentDivs){
    var actionElement = {};
    contentDivs.filter(".slideshow").each(function(key, element){
        actionElement["element"] = $(element);
        actionElement["class"] = "slideshow";
    });

    contentDivs.filter(".gallery").each(function(key, element){
        actionElement["element"] = $(element);
        actionElement["class"] = "gallery";
    });

    contentDivs.filter(".multiPage").each(function(key, element){
        actionElement["element"] = $(element);
        actionElement["class"] = "multiPage";
    });

    return actionElement;
}

$("body").on('click', '.close', function(){
    if($(this).hasClass("iframeClose")){
        closeIframe();
    }else{
        closeActive();
    }
});

function closeIframe(){
    $("body").find(".iframeClose").parent().remove();
}

function closeActive(){
    closeIframe();
    $(".active").find('.innerContent').removeClass('visibleContent').addClass('noEvents');
    $(".secondView").children(".close").addClass("hidden");
    $(".active").removeClass("active");
}

function classExists(className){
    return $("." + className)[0];
}