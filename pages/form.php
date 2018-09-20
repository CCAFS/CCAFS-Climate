<?php

require_once '../config/smarty.php';
require_once '../config/db.php';

/* recibir el campo oculto "file-type".
 * En caso de ser file, se hace el trato comun y corriente.
 * En caso de ser resource, se hace el trato como recurso.
 */
$fileType = isset($_REQUEST["file-type"]) ? $_REQUEST["file-type"] : null;
$filset = isset($_REQUEST["fileSet"]) ? $_REQUEST["fileSet"] : null;
$tileName = isset($_REQUEST["tile_name"]) ? $_REQUEST["tile_name"] : null;

$filesToDownload = isset($_REQUEST["download-files"]) ? $_REQUEST["download-files"] : null;

if (!is_null($filesToDownload)) {
    $smarty->assign("downloads", json_encode($filesToDownload));
    $smarty->assign("fileType", $fileType);
    $smarty->assign("filsetTem", $filset);
    $smarty->assign("tileName", $tileName);
    $smarty->display("form.tpl");
} else {
    $smarty->display("data.tpl");
}
?>
