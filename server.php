<?php

if ($_POST['type'] == 'save') {
	$ptsfile = "data/points.json";
	$pthfile = "data/paths.json";
	$objfile = "data/objects.json";
	file_put_contents($ptsfile, $_POST['point']);
	file_put_contents($pthfile, $_POST['path']);
	file_put_contents($objfile, $_POST['object']);
}