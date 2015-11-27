<?php
require_once '../../config/db.php';

// Where is this query coming from?
$section = $_GET["section"];
if (isset($_GET['section']) && $_GET['section'] != '') {
    switch ($section) {
        case "method":
            method($_GET['id']);
            break;
        case "scenario":
            scenario($_GET['id']);
            break;
        case "model":
            model($_GET['id']);
            break;
        case "period":
            period($_GET['id']);
            break;
        case "variable":
            variable($_GET['id']);
            break;
        case "resolution":
            resolution($_GET['id']);
            break;
        case "format":
            format($_GET['id']);
            break;
        case "tile":
            tile();
            break;
        case "observation" :
            observation($_GET['id']);
            break;
        default:
            break;
    }
}

function method($id) {
    global $db;
    $descriptionQuery = "SELECT description FROM datasets_method WHERE id = ".$id;
    $scenariosQuery = "SELECT DISTINCT ds.id, ds.name FROM datasets_scenario ds, datasets_file df
        WHERE df.scenario_id = ds.id AND df.method_id = ".$id;
    $result = new stdClass();
    $result->description = $db->getOne($descriptionQuery);
    $result->scenarios = $db->getAll($scenariosQuery);
    echo json_encode($result);
}
function scenario($id) {
    global $db;
    $descriptionQuery = "SELECT description FROM datasets_scenario WHERE id = ".$id;
    $modelsQuery = "SELECT DISTINCT dm.id, dm.name
        FROM datasets_model dm, datasets_file df
        WHERE df.model_id = dm.id
        AND df.scenario_id = ".$id;
    $result = new stdClass();
    $result->description = $db->getOne($descriptionQuery);
    $result->models = $db->getAll($modelsQuery);
    echo json_encode($result);
}
function model($id) {
    global $db;
    $descriptionQuery = "SELECT i.name as institute, m.atmosphere_resolution, m.ocean_resolution, m.references
        FROM datasets_model m, datasets_institute i
        WHERE m.institute_id = i.id
        AND m.id = ".$id;
    $periodsQuery = "SELECT DISTINCT dp.id, dp.name
        FROM datasets_period dp, datasets_file df
        WHERE df.period_id = dp.id
        AND df.model_id = ".$id;
    $result = new stdClass();
    $descriptions = $db->getRow($descriptionQuery);
    $result->institute = $descriptions["institute"];
    $result->atmosphereResolution = $descriptions["atmosphere_resolution"];
    $result->oceanResolution = $descriptions["ocean_resolution"];
    $result->references = $descriptions["references"];
    $result->periods = $db->getAll($periodsQuery);
    echo json_encode($result);
}
function period($id) {
    global $db;
    $descriptionQuery = "SELECT initial_year, final_year
        FROM datasets_period
        WHERE id = ".$id;
    $variablesQuery = "SELECT DISTINCT dv.id, dv.name
        FROM datasets_variable dv, datasets_file df
        WHERE df.variable_id = dv.id
        AND df.period_id = ".$id;
    $result = new stdClass();
    $descriptions = $db->getRow($descriptionQuery);
    $result->initialYear = $descriptions["initial_year"];
    $result->finalYear = $descriptions["final_year"];
    $result->variables = $db->getAll($variablesQuery);
    echo json_encode($result);
}
function variable($id) {
    global $db;
    $descriptionQuery = "SELECT description
        FROM datasets_variable
        WHERE id = ".$id;
    $resolutionsQuery = "SELECT DISTINCT dr.id, dr.name
        FROM datasets_resolution dr, datasets_file df
        WHERE df.resolution_id = dr.id
        AND df.variable_id = ".$id;
    $result = new stdClass();
    $result->description = $db->getOne($descriptionQuery);
    $result->resolutions = $db->getAll($resolutionsQuery);
    echo json_encode($result);
}
function resolution($id) {
    global $db;

    $formatsQuery = "SELECT DISTINCT dformat.id, dformat.name
        FROM datasets_format dformat, datasets_file df
        WHERE df.format_id = dformat.id
        AND df.resolution_id = ".$id;
    $result = new stdClass();
    $result->formats = $db->getAll($formatsQuery);
    echo json_encode($result);
}
function format($id) {
    global $db;
    $descriptionQuery = "SELECT description
        FROM datasets_format
        WHERE id = ".$id;
    // Coming soon. - When tiles come rdy.
    /*$tileQuery = "SELECT DISTINCT dt.id, dt.name
        FROM datasets_tile dt, datasets_file df
        WHERE df.tile_id = dt.id
        AND df.resolution_id = ".$id;*/
    $result = new stdClass();
    $result->description = $db->getOne($descriptionQuery);
    //$result->resolutions = $db->getAll($resolutionsQuery);
    echo json_encode($result);
}
function tile() {}
function observation($id) {
    global $db;

    $obsQuery = "SELECT obs.start_date, obs.end_date
        FROM datasets_observation_bias obs
        WHERE obs.id = ".$id;
    $result = new stdClass();
    $descriptions = $db->getRow($obsQuery);
    $result->startDate = $descriptions["start_date"];
    $result->endDate = $descriptions["end_date"];
    echo json_encode($result);
}

?>
