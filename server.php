<?php

if ($_POST['type'] == 'save') {
	$ptsfile = "data/points.json";
	$pthfile = "data/paths.json";
	file_put_contents($ptsfile, $_POST['point']);
	file_put_contents($pthfile, $_POST['path']);
}