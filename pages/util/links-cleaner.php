<?php
/* CronJob must be configure as follow:
cd /home/jramirezv/ccafs-climate.org/config
php /home/jramirezv/ccafs-climate.org/pages/util/links-cleaner.php
 */
require_once 'config.php';

// handler for the directory.
$handler = opendir(LINKS_DIR);
while ($file = readdir($handler)) {
    // if file is symbolic link.
    if (is_link(LINKS_DIR . "/" . $file)) {
        // Split by (-) and (.).
        // File name example: csiro_mk3_0_sres_a1b_2030s_bio_5min_no_tile_asc-1349367643.zip
        $parts = preg_split("/[-.]/", $file);
        // Get the file number. Which is in its filename.
        $fileTime = (int) $parts[count($parts) - 2];
        $currentTime = (int) time();
        $elapsedTime = $currentTime - $fileTime;
        // 86400 = 60 * 60 * 24 (number of seconds in a day).
        $elapsedDays = $elapsedTime / 86400;
        echo LINK_DAYS;
        if ($elapsedDays > LINK_DAYS) {
            unlink(LINKS_DIR . "/" . $file);
        }
    }
}

// tidy up: close the handler
closedir($handler);
?>
