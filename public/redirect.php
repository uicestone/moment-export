<?php

$json = file_get_contents('./data/shorten_urls.json');
$shorten_urls = json_decode($json);
$hash = $_SERVER['QUERY_STRING'];
$url = $shorten_urls->$hash;

if (!$url) {
	exit('Url not found for hash ' . $hash . '.');
}

header('Location: ' . $url);
