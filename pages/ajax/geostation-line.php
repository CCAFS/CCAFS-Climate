<?php
require_once '../../config/db.php';
global $db;
$query = "SELECT id, name FROM station_category ORDER BY name";
$categories = $db->getAll($query);

$query = "SELECT id, name FROM station_institute ORDER BY name";
$institutes = $db->getAll($query);

$query = "SELECT id, name FROM station_type ORDER BY name";
$types = $db->getAll($query);
$id = $_REQUEST['id'];
?>
<tr>
  <td>
    <input id="code<?php echo $id?>" type="text" name="code<?php echo $id?>" />
  </td>
  <td>
    <select id="cat<?php echo $id?>" name="cat<?php echo $id?>">
      <option value="0">---</option>
      <?php foreach ($categories as $category): ?>
      <option value="<?php echo $category['id'] ?>"><?php echo $category['name'] ?></option>
      <?php endforeach; ?>
    </select>
  </td>
  <td>
    <select id="type<?php echo $id?>" name="type<?php echo $id?>">
      <option value="0">---</option>
      <?php foreach ($types as $type): ?>
      <option value="<?php echo $type['id'] ?>"><?php echo $type['name'] ?></option>
      <?php endforeach; ?>
    </select>
  </td>
  <td>
    <input id="name<?php echo $id?>" type="text" name="name<?php echo $id?>" />
  </td>
  <td>
    <input id="lon<?php echo $id?>" type="text" name="lon<?php echo $id?>" />
  </td>
  <td>
    <input id="lat<?php echo $id?>" type="text" name="lat<?php echo $id?>" />
  </td>
  <td>
    <input id="elev<?php echo $id?>" type="text" name="elev<?php echo $id?>" />
  </td>
  <td>
    <select id="ins<?php echo $id?>" name="ins<?php echo $id?>">
      <option value="0">---</option>
      <?php foreach ($institutes as $institute): ?>
      <option value="<?php echo $institute['id'] ?>"><?php echo $institute['name'] ?></option>
      <?php endforeach; ?>
    </select>
  </td>
  <td>
    <input id="url<?php echo $id?>" type="text" name="url<?php echo $id?>" />
  </td>
  <td>
    <input id="date<?php echo $id?>" type="text" name="date<?php echo $id?>" />
  </td>
  <td>
    <input id="vars<?php echo $id?>" type="text" name="vars<?php echo $id?>" />
  </td>
</tr>