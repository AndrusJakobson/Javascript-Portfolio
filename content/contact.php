<h1 background="#584570">Kontakt</h1>
<div>
	<div class="contact col-lg-8 mx-auto disableParentClick">
		<div class="contact form-group floating-label-form-group controls">
			<label>Nimi</label>
			<input class="form-control" id="subject" type="text" placeholder="Nimi" >
			<p class="error error-subject"></p>
		</div>
		<div class="contact form-group floating-label-form-group controls">
			<label>Email Aadress</label>
			<input class="form-control" id="email" type="email" placeholder="Email Aadress">
			<p class="error error-email"></p>
		</div>
		<div class="contact form-group floating-label-form-group controls">
			<label>Sõnum</label>
			<textarea class="form-control" id="message" rows="5" placeholder="Sõnum"></textarea>
			<p class="error error-message"></p>
		</div>
		<div class="contact form-group floating-label-form-group controls">
			<label>Lisainfo</label>
			<p>Telefon: 56870866</p>
			<p>Meil: andrus.jakobson@ametikool.ee</p>
		</div>
		<br>
		<div class="contact form-group">
			<button type="button" class="btn btn-success btn-lg" id="sendMessageButton">Saada</button>
		</div>
	</div>
</div>

<script>
	$("body").on("click", ".contact .contact #sendMessageButton", function(){
		const subject = $("#subject").val();
		const email = $("#email").val();
		const message = $("#message").val();

		const validSubject = checkSubject();
		const validEmail = checkEmail();
		const validMessage = checkMessage();

		if(validSubject && validEmail && validMessage){
			$.post("sendMail.php", {subject: subject, email: email, message: message}, function(data){
				const json = JSON.parse(data);
				let message = "empty";
				if(json.status == 1){
					message = json.message;
				}
				console.log(message);
			});
		}
	});

	$("body").on("keyup", ".contact .contact #subject", function(){
		checkSubject();
	});

	$("body").on("keyup", ".contact .contact #email", function(){
		checkEmail();
	});

	$("body").on("keyup", ".contact .contact #message", function(){
		checkMessage();
	});

	function checkSubject(){
		console.log("checkSubject");
		const subject = $(".contact .contact #subject").val();
		const subjectError = $(".contact .contact #subject").siblings(".error-subject");
		if(subject != "" && subject.length >= 3){
			subjectError.empty();
			return true;
		}
		subjectError.text("Nimi peab olema vähemalt 3 tähte!");
		return false;
	}

	function checkEmail(){
		const email = $(".contact .contact #email").val();
		const emailError = $(".contact .contact #email").siblings(".error-email");
		if(validateEmail(email)){
			emailError.empty();
			return true;
		}
		emailError.text("Kehtetu meil!");
		return false;
	}

	function checkMessage(){
		const message = $(".contact .contact #message").val();
		const messageError = $(".contact .contact #message").siblings(".error-message");
		if(message != "" && message.length >= 10){
			messageError.empty();
			return true;
		}
		messageError.text("Sõnum peab olema vähemalt 10 tähte!");
		return false;
	}
</script>