<?php   

function get_json_value($json,$key)
{
    $result = NULL;
    if(function_exists('json_decode')) {
        $jsonData = json_decode($json, TRUE);
        $result = $jsonData[0][$key];
    }
    return $result;
}

//database parameters
$user='user'; 
$pw='pass';
$db='sencha';
$table='states';
   
//make database connection
$connection = mysql_connect("localhost", $user, $pw) or
   die("Could not connect: " . mysql_error());
mysql_select_db($db) or die("Could not select database");

$task = ($_POST['task']) ? ($_POST['task']) : 'read';

//switchboard for the CRUD task requested
switch($task){
    case "read":
        showData('states');
        break;
    default:
        echo "{failure:true}";
        break;
}
    
function showData($table) 
{
    $start = (integer) (isset($_POST['start']) ? $_POST['start'] : $_GET['start']);
    $end = (integer) (isset($_POST['limit']) ? $_POST['limit'] : $_GET['limit']);  

    $sort = (isset($_POST['sort']) ? $_POST['sort'] : $_GET['sort']);
    
    $ord = get_json_value($sort,'property');
    $dir  = get_json_value($sort,'direction');

    $sql_count = 'SELECT * FROM ' . $table . ' ORDER BY ' . $ord .' '. $dir;
    $sql = $sql_count . ' LIMIT ' . $start . ', '. $end;
    
    $result_count = mysql_query($sql_count);
    $rows = mysql_num_rows($result_count);
    
    $result = mysql_query($sql);
    
    while($rec = mysql_fetch_array($result, MYSQL_ASSOC)){
        $arr[] = $rec;
    };

    $data = json_encode($arr);  //encode the data in json format
      
    echo $cb . '({"total":"' . $rows . '","data":' . $data . '})';
}

?>