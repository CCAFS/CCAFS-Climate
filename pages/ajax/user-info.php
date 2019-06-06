<?php

require_once '../../config/db.php';

$context = isset($_REQUEST["context"]) ? $_REQUEST["context"] : null;
$filset = isset($_REQUEST["fileSet"]) ? $_REQUEST["fileSet"] : null;

if (!is_null($context)) {
    switch ($context) {
        case "user-info":
            getUserInfo();
            break;
        case "submit-user-anonymous":
            addUserInfoAnonymous();
            break;    
        case "submit-user":
            addUserInfo();
            break;
    }
}

function addUserInfoAnonymous() {
    global $db;
    $userId = isset($_REQUEST["userId"]) ? $_REQUEST["userId"] : null;
    $instituteName = isset($_REQUEST["instituteName"]) ? $_REQUEST["instituteName"] : null;
    $use = isset($_REQUEST["use"]) ? $_REQUEST["use"] : null;
    if (!is_null($instituteName) && !is_null($use)) { 
        // Now is an existing user.
        // lets insert the download information.
        $query = "INSERT INTO datasets_download (user_id, institute, intended_use, date)
                        VALUES ('$userId', '$instituteName', '$use', now())";
        if ($db->Execute($query)) {
            // figure out what was the download id inserted before.
            $query = "SELECT max(id) as id FROM datasets_download
                             WHERE user_id = " . $userId;
            $downloadId = $db->GetOne($query);
            if (is_numeric($downloadId)) {
                echo $downloadId;
            } else {
                echo "Error querying download id: " . $downloadId . " - " . $db->ErrorMsg();
            }
        } else {
            echo "Error inserting download information: " . $db->ErrorMsg();
        }
    } else {
        echo "NOT OK";
    }
}

function addUserInfo() {
    global $db;
    $userId = isset($_POST["userId"]) ? $_POST["userId"] : null;
    $email = isset($_POST["email"]) ? $_POST["email"] : null;
    $firstName = isset($_POST["firstName"]) ? $_POST["firstName"] : null;
    $lastName = isset($_POST["lastName"]) ? $_POST["lastName"] : null;
    $instituteName = isset($_POST["instituteName"]) ? $_POST["instituteName"] : null;
    $instituteRegions = isset($_POST["instituteRegions"]) ? $_POST["instituteRegions"] : null;
    $researchRegions = isset($_POST["researchRegions"]) ? $_POST["researchRegions"] : null;
    $use = isset($_POST["use"]) ? $_POST["use"] : null;
    if (!is_null($email) && !is_null($firstName) && !is_null($lastName) && !is_null($instituteName)
            && !is_null($instituteRegions) && !is_null($researchRegions) && !is_null($use)) {
        if ($userId < 0) {
            // is a new user?
            // Adding user to the database.
            $query = "INSERT INTO datasets_person (first_name, last_name, registered, email)
                VALUES ('$firstName', '$lastName', now(), '$email')";
            if ($db->Execute($query)) {
                // figure out what's his id.
                $query = "SELECT id FROM datasets_person WHERE email ='$email'";
                $userId = $db->GetOne($query); // false in case id was not found.
                if (!is_numeric($userId)) {
                    echo "Error querying user id: " . $userId . " - " . $db->ErrorMsg();
                }
            } else {
                echo "Error inserting user: " . $db->ErrorMsg();
            }
        }
        // Now is an existing user.
        // lets insert the download information.
        $query = "INSERT INTO datasets_download (user_id, institute, intended_use, date)
                        VALUES ('$userId', '$instituteName', '$use', now())";
        if ($db->Execute($query)) {
            // figure out what was the download id inserted before.
            $query = "SELECT max(id) as id FROM datasets_download
                             WHERE user_id = " . $userId;
            $downloadId = $db->GetOne($query);
            if (is_numeric($downloadId)) {
                // lets insert institute regions.
                $query = "INSERT INTO datasets_downloadinstitutelocation (download_id";
                foreach ($instituteRegions as $region) {
                    $query .= ", " . $region;
                }
                $query .= ") VALUES (" . $downloadId;
                foreach ($instituteRegions as $region) {
                    $query .= ", TRUE";
                }
                $query .= ")";
                if ($db->Execute($query)) {
                    // lets insert research regions.
                    $query = "INSERT INTO datasets_downloadresearchlocation (download_id";
                    foreach ($researchRegions as $region) {
                        $query .= ", " . $region;
                    }
                    $query .= ") VALUES (" . $downloadId;
                    foreach ($researchRegions as $region) {
                        $query .= ", TRUE";
                    }
                    $query .= ")";
                    if ($db->Execute($query)) {
                        echo $downloadId;
                    } else {
                        echo "Error inserting research regions: " . $db->ErrorMsg();
                    }
                } else {
                    echo "Error inserting institute regions: " . $db->ErrorMsg();
                }
            } else {
                echo "Error querying download id: " . $downloadId . " - " . $db->ErrorMsg();
            }
        } else {
            echo "Error inserting download information: " . $db->ErrorMsg();
        }
    } else {
        echo "NOT OK";
    }
}

function getUserInfo() {
    global $db;
    $email = $_POST["email"];
    if (isset($email) && $email != "") {
        $query = $db->Prepare("
        SELECT
        -- Person
        dp.id, dp.first_name, dp.last_name, dp.registered, dp.email,
        -- Download
        dd.institute, dd.date,
        -- Institute Locations
        ddi.africa as i_africa,
        ddi.asia as i_asia,
        ddi.oceania as i_oceania,
        ddi.central_america_caribbean as i_central_america_caribbean,
        ddi.europe as i_europe,
        ddi.middle_east_north_africa as i_middle_east_north_africa,
        ddi.north_america as i_north_america,
        ddi.south_america as i_south_america,
        -- Research Locations
        ddr.africa as r_africa,
        ddr.asia as r_asia,
        ddr.oceania as r_oceania,
        ddr.central_america_caribbean as r_central_america_caribbean,
        ddr.europe as r_europe,
        ddr.middle_east_north_africa as r_middle_east_north_africa,
        ddr.north_america as r_north_america,
        ddr.south_america as r_south_america
        FROM datasets_person dp, datasets_download dd, datasets_downloadresearchlocation ddr, datasets_downloadinstitutelocation ddi
        WHERE dp.email = ?
        AND dp.id = dd.user_id
        AND dd.id = ddr.download_id
        AND dd.id = ddi.download_id
        ORDER BY dd.id DESC limit 1;
        ");
        $result = $db->Execute($query, $email);
        // print_r($result->fields);

        $user = new stdClass();
        if ($result) {
            $user->userId = $result->fields["id"];
            $user->firstName = $result->fields["first_name"];
            $user->lastName = $result->fields["last_name"];
            $user->lastInstitute = $result->fields["institute"];
            $user->registered = $result->fields["registered"];
            $user->email = $result->fields["email"];
            $user->lastDownloadDate = $result->fields["date"];

            $user->instituteLocations = new stdClass();
            $user->instituteLocations->africa = $result->fields["i_africa"];
            $user->instituteLocations->asia = $result->fields["i_asia"];
            $user->instituteLocations->oceania = $result->fields["i_oceania"];
            $user->instituteLocations->centralAmericaCaribbean = $result->fields["i_central_america_caribbean"];
            $user->instituteLocations->europe = $result->fields["i_europe"];
            $user->instituteLocations->middleEasthNorthAfrica = $result->fields["i_middle_east_north_africa"];
            $user->instituteLocations->northAmerica = $result->fields["i_north_america"];
            $user->instituteLocations->southAmerica = $result->fields["i_south_america"];

//        $user->researchLocations = new stdClass();
//        $user->researchLocations->africa = $result->fields["r_africa"];
//        $user->researchLocations->asia = $result->fields["r_asia"];
//        $user->researchLocations->oceania = $result->fields["r_oceania"];
//        $user->researchLocations->centralAmericaCaribbean = $result->fields["r_central_america_caribbean"];
//        $user->researchLocations->europe = $result->fields["r_europe"];
//        $user->researchLocations->middleEasthNorthAfrica = $result->fields["r_middle_east_north_africa"];
//        $user->researchLocations->northAmerica = $result->fields["r_north_america"];
//        $user->researchLocations->southAmerica = $result->fields["r_south_america"];
        }
        echo json_encode($user);
    }
}

?>
