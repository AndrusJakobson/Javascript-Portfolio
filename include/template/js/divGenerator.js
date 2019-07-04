function printRows(dataArray, location, extraClass = "", path = ""){
	var firstOfSqrtFamily = true;
	var groupCount = 1;
	for (var i = 1; i <= dataArray.length; i++) {
		if(isFirstOfSqrtFamily(i)){
			firstOfSqrtFamily = true;
		}
		if(firstOfSqrtFamily && getAfterPeriodNumber(Math.sqrt(i)) >= 0.6){
			firstOfSqrtFamily = false;
			groupCount++;
		}
	}

	var numberArray = [];
	for (var i = 0; i < groupCount; i++) {
		numberArray[i] = [];
	}

	var groupIndex = 0;
	for (var i = 0; i < dataArray.length; i++) {
		numberArray[groupIndex].push(dataArray[i]);
		if(groupCount > groupIndex + 1){
			groupIndex++;
		}else if(groupIndex + 1 == groupCount){
			groupIndex = 0;
		}
	}

	location.append(getTableRow(numberArray, extraClass));

	$.each($('.' + extraClass), function(key, value){
		const currentPage = $(this);
		const link = $(this).data("link");
		$(this).load(path + link, function(data){
			const backgroundAttribute = getBackgroundAttribute(data);
			if(backgroundAttribute != ""){
				currentPage.css("background-color", backgroundAttribute);
			}
			$('.' + extraClass).children("div").addClass("innerContent noEvents");
		});
	});
}

function getBackgroundAttribute(data){
	return $($(data)[0]).attr("background");
}

function generateHexCode(){
	const colorIndex = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "A", "B", "C", "D", "E", "F"];
	var colorCode = "#";
	for (var i = 0; i < 6; i++) {
		const index = getRandomInt(5) + 10;
		colorCode += colorIndex[index];
	}
	return colorCode;
}

function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
}

function getTableRow(dataArray, extraClass){	
	var rowString = "";
	for(var i = 0; i < dataArray.length; i++){
		for(var j = 0; j < dataArray[i].length; j++){
			const backgroundColor = generateHexCode();
			rowString += '<div class="title notSelectable center ' + extraClass + '" style="background-color:' + backgroundColor + '; ' + getWidth(i, j, dataArray) + '" data-link="' + dataArray[i][j] + '" ></div>';
		}
	}
	return rowString;
}

function getWidth(Yiteration, Xiteration, dataArray){
	const width = 100 / dataArray[Yiteration].length;
	const left = width * Xiteration;
	const height = 100 / dataArray.length;
	const top = height * Yiteration;	
	return "width: " + width + "vw; left: " + left + "vw; height: " + height + "vh; top: " + top + "vh;";
}

function getFileName(file){
	const extensionStart = file.indexOf(".");
	return file.substring(0, file.length);
}

function isFirstOfSqrtFamily(number){
	return Math.sqrt(number) % Math.floor(Math.sqrt(number)) == 0;
}

function getAfterPeriodNumber(number){
	return number - Math.floor(number);
}