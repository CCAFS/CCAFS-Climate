<?php

require_once '../config/smarty.php';
require_once '../config/db.php';

/* recibir el campo oculto "file-type".
 * En caso de ser file, se hace el trato comun y corriente.
 * En caso de ser resource, se hace el trato como recurso.
 */
$fileType = isset($_POST["file-type"]) ? $_POST["file-type"] : null;

$filesToDownload = isset($_POST["download-files"]) ? $_POST["download-files"] : null;

if (!is_null($filesToDownload)) {
    $smarty->assign("downloads", json_encode($filesToDownload));
    $smarty->assign("fileType", $fileType);
    $smarty->display("form.tpl");
} else {
    $smarty->display("data.tpl");
}
?>
