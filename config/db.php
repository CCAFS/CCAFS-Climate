<?php

/**
 *
 * Author: Khurram Ijaz (khurram@renai-soft.com)
 * Company: Renaissance Software / Intellicomdevelopment.com (info@renai-soft.com)
 * All rights reserved.
 *
 * Edited by: Hector Tobon (htobon@gmail.com)
 * International Center for Tropical Agriculture (CIAT)
 *
 */
require_once dirname(__FILE__).'/'.'config.php';
require_once( LIB_DIR. '/adodb/adodb.inc.php' );

global $db;

$db = &ADONewConnection('mysql');
if (!$db) {
    //$log->error('Could not connect to the database.');
    exit;
}
$db->connect($infoDB['host'], $infoDB['username'], $infoDB['password'], $infoDB['db']);
if (!$db->IsConnected()) {
    $db->EXECUTE("set names 'utf8'");
    //$log->error('Could not connect to the database.');
    exit;
}


//$log->info('DB initialized successfully.');
?>
