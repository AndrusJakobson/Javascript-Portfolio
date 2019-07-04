<?php
require_once('include/start.php');
?>
<html>
	<head>
		<link href="include/template/css/bootstrap.min.css" rel="stylesheet">
		<link href="include/template/css/style.css" rel="stylesheet">
		<meta name="viewport" content="width=device-width">
		<title>Andrus Jakobson Portfoolio</title>
	</head>
	<body>
		<div class="firstViewContainer cursor">
			<div class="firstView" id="leftHalf">
				<div>
					<h1 class="title">Andrus Jakobson</h1>
					<h2>Tarkvaraarendaja</h2>
					<p class="lowerOpacity">Alustamiseks vajutage kuhugi</p>
				</div>
			</div>
			<div class="firstView" id="rightHalf">
				<div>
					<h1 class="title">Andrus Jakobson</h1>
					<h2>Tarkvaraarendaja</h2>
					<p class="lowerOpacity">Alustamiseks vajutage kuhugi</p>
				</div>
			</div>
		</div>

		<div class="secondView">
			<span class="close hidden">❌</span>
		</div>

		<script src="include/template/plugins/jquery/jquery.min.js"></script>
		<script src="include/template/plugins/bootstrap/bootstrap.min.js"></script>
		<script src="include/template/js/custom.js"></script>
		<script src="include/template/js/divGenerator.js"></script>
		<script type="text/javascript">
			const content = <?= getFilesInDirectory("content"); ?>;
			addMainPage(content);
			$("body").fadeIn();
		</script>
	</body>
</html>