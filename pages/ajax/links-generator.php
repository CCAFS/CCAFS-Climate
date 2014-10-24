<?php

require_once '../../config/db.php';

$files = isset($_POST["files"]) ? $_POST["files"] : null;
$downloadId = isset($_POST["downloadId"]) ? $_POST["downloadId"] : null;


// fileType comes from hidden input in: file-list.tpl and pattern_scaling.tpl.
$fileType = isset($_POST["fileType"]) ? $_POST["fileType"] : null;


if (!is_null($files) && !is_null($downloadId) && !is_null($fileType)) {
    $links = array();
	$nfiles=count($files);
    foreach ($files as $fileId) {
        if($fileType == "file") {
            $fileName = registerFile($fileId, $downloadId,$nfiles);

        }
        if($fileType == "resource") {
            $fileName = registerResource($fileId, $downloadId);
        }
        //$link = generateLink($fileName);
        // Links are now generated directly from DAPA public link.        
        $link = new stdClass();
        $link->reference = LINKS_BASE_URI . $fileName;
        $arr = explode("/", $fileName);
        $fileName = $arr[count($arr) - 1];
        $link->name = $fileName;

        // --------------------------------------
        if (!is_null($link)) {
            array_push($links, $link);
        }
    }
    echo json_encode($links);
	
}

function registerResource($resourceId, $downloadId) {
    global $db;
    $query = "SELECT id, name, local_url FROM datasets_resource WHERE id = " . $resourceId;
    $resourceInfo = $db->GetRow($query);
    $query = "INSERT INTO datasets_downloadedresource (download_id, file_id) VALUES (" . $downloadId . ", " . $resourceId . ")";
    if ($db->Execute($query)) {
        return $resourceInfo["local_url"] . "/" . $resourceInfo["name"];
    }

    return null;
}

function registerFile($fileId, $downloadId,$nfiles) {
    global $db;
    $query = "SELECT id, name, local_url FROM datasets_file WHERE id = " . $fileId;
    $fileInfo = $db->GetRow($query);
	if ($nfiles<2000){
	    $queryLog = "INSERT INTO datasets_downloadedfile (download_id, file_id) VALUES (" . $downloadId . ", " . $fileId . ")";
		$db->Execute($queryLog);	
	}
    if ($db->Execute($query)){
        return $fileInfo["local_url"] . "/" . $fileInfo["name"];
    }
	
    return null;
}

function generateLink($file) {
    // $file example: /data/delta_method/sres_a1b/2020s/cccma_cgcm3_1/5min/cccma_cgcm3_1_sres_a1b_2020s_bio_5min_no_tile_asc.zip
    $currentTime = time();
    // getting last filename.
    // example: cccma_cgcm3_1_sres_a1b_2020s_bio_5min_no_tile_asc.zip
    $arr = explode("/", $file);
    $fileName = $arr[count($arr) - 1];
    // dividing file by extension
    // example: cccma_cgcm3_1_sres_a1b_2020s_bio_5min_no_tile_asc-123456789.zip
    $arr = explode(".", $fileName);
    $fileName = $arr[0] . "-" . $currentTime . "." . $arr[1];

    $absoluteTarget = DATA_DIR.$file;
    //$absoluteTarget = DATA_DIR . "/csiro_mk3_0_sres_a1b_2020s_bio_30s_no_tile_asc.zip";
    $absoluteSymbolicLink = LINKS_DIR . "/" . $fileName;
    $urlLink = LINKS_URI . "/" . $fileName;
    if (!file_exists($absoluteSymbolicLink) && symlink($absoluteTarget, $absoluteSymbolicLink)) {
        $link = new stdClass();
        $link->reference = $urlLink;
        $link->name = $fileName;
        return $link;
    }
    return null;
}

?>
