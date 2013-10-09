<?php 
//seeing if this works again & again!!!
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Methods', 'GET POST');
echo shell_exec('cd '.dirname(__FILE__).' && git pull origin master 2>&1');

