<?php /* Smarty version Smarty-3.1.11, created on 2013-10-25 21:09:01
         compiled from "D:\DESARROLLO\PHP\xampp\htdocs\CCAFS-Climate\templates\data.tpl" */ ?>
<?php /*%%SmartyHeaderCode:22936526ac1cd764d15-64999220%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '76b35c40006d84267d849bf649131900220bf297' => 
    array (
      0 => 'D:\\DESARROLLO\\PHP\\xampp\\htdocs\\CCAFS-Climate\\templates\\data.tpl',
      1 => 1378402616,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '22936526ac1cd764d15-64999220',
  'function' => 
  array (
  ),
  'variables' => 
  array (
    'methods' => 0,
    'method' => 0,
    'variables' => 0,
    'variable' => 0,
    'scenarios' => 0,
    'scenario' => 0,
    'resolutions' => 0,
    'resolution' => 0,
    'models' => 0,
    'model' => 0,
    'formats' => 0,
    'format' => 0,
    'periods' => 0,
    'period' => 0,
  ),
  'has_nocache_code' => false,
  'version' => 'Smarty-3.1.11',
  'unifunc' => 'content_526ac1cd8b9687_49737185',
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_526ac1cd8b9687_49737185')) {function content_526ac1cd8b9687_49737185($_smarty_tpl) {?><?php echo $_smarty_tpl->getSubTemplate ('head.tpl', $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array('jsIncludes'=>array("jquery","data","tiptip"),'pageTitle'=>"Data - CCAFS Climate",'pageDescription'=>"High resolution climate change data for download, downscaled using different methods.",'keywords'=>"IPCC,data,download,downscaling,high resolution,delta method,climate change,projections,MarkSim,MetOffice,PRECIS"), 0);?>

<?php echo $_smarty_tpl->getSubTemplate ('header.tpl', $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array('current'=>"data"), 0);?>

<div id="subheader-image">
    <img src="<?php echo @SMARTY_IMG_URI;?>
/ribbon_header_data.gif" />
</div>
<div id="content" class="data">
    <h3>Data</h3>
    <hr>
    <br>
    
    <!-- span style="background-color: rgb(255, 162, 162); padding: 6px; margin-bottom: 22px; display: block;">Due to some technical problems, the data is temporally unavailable. Please come back in a couple of hours.</span -->

    <div class="center">
        <img id="download_data_button" name="download_data_button" src="<?php echo @SMARTY_IMG_URI;?>
/download_data_button.png">
    </div>
    <div id="search_form">
        <form method="GET" action="/file-list.php" id="formSearch">
            <table id="table_fields" class="table_form">
                <tbody>
                    <tr>
                        <!-- Method -->
                        <td class="option-name">
                            1. Method:
                        </td>
                        <td>
                            <select id="id_method" name="method" class="options">
                                <option selected="selected" value="">Select all</option>
                                <?php  $_smarty_tpl->tpl_vars['method'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['method']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['methods']->value; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['method']->key => $_smarty_tpl->tpl_vars['method']->value){
$_smarty_tpl->tpl_vars['method']->_loop = true;
?>
                                    <option value='<?php echo $_smarty_tpl->tpl_vars['method']->value["id"];?>
'><?php echo $_smarty_tpl->tpl_vars['method']->value["name"];?>
</option>
                                <?php } ?>
                            </select>
                        </td>
                        <td>
                            <img class="help_icon" id="help_icon_method" src="<?php echo @SMARTY_IMG_URI;?>
/help_icon.png" />
                            <img class="loader" src="<?php echo @SMARTY_IMG_URI;?>
/ajax-loader.gif" />
                        </td>

                        <!-- Variable -->
                        <td class="option-name">
                            5. Variable:
                        </td>
                        <td>
                            <select id="id_variable" name="variable" class="options" >
                                <option value="" selected="selected">Select all</option>
                                <?php  $_smarty_tpl->tpl_vars['variable'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['variable']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['variables']->value; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['variable']->key => $_smarty_tpl->tpl_vars['variable']->value){
$_smarty_tpl->tpl_vars['variable']->_loop = true;
?>
                                    <option value='<?php echo $_smarty_tpl->tpl_vars['variable']->value["id"];?>
'><?php echo $_smarty_tpl->tpl_vars['variable']->value["name"];?>
</option>
                                <?php } ?>
                            </select>
                        </td>
                        <td>
                            <img class="help_icon" id="help_icon_variable" src="<?php echo @SMARTY_IMG_URI;?>
/help_icon.png" />
                            <img class="loader" src="<?php echo @SMARTY_IMG_URI;?>
/ajax-loader.gif" />
                        </td>
                    </tr>
                    <tr>
                        <!-- Scenario -->
                        <td class="option-name">
                            2. Scenario:
                        </td>
                        <td>
                            <select id="id_scenario" name="scenario" class="options" >
                                <option value="" selected="selected">Select all</option>
                                <?php  $_smarty_tpl->tpl_vars['scenario'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['scenario']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['scenarios']->value; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['scenario']->key => $_smarty_tpl->tpl_vars['scenario']->value){
$_smarty_tpl->tpl_vars['scenario']->_loop = true;
?>
                                    <option value='<?php echo $_smarty_tpl->tpl_vars['scenario']->value["id"];?>
'><?php echo $_smarty_tpl->tpl_vars['scenario']->value["name"];?>
</option>
                                <?php } ?>
                            </select>
                        </td>
                        <td>
                            <img class="help_icon" id="help_icon_scenario" src="<?php echo @SMARTY_IMG_URI;?>
/help_icon.png" />
                            <img class="loader" src="<?php echo @SMARTY_IMG_URI;?>
/ajax-loader.gif" />
                        </td>
                        <!-- Resolution -->
                        <td class="option-name">
                            6. Resolution:
                        </td>
                        <td>
                            <select id="id_resolution" name="resolution" class="options" >
                                <option value="" selected="selected">Select all</option>
                                <?php  $_smarty_tpl->tpl_vars['resolution'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['resolution']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['resolutions']->value; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['resolution']->key => $_smarty_tpl->tpl_vars['resolution']->value){
$_smarty_tpl->tpl_vars['resolution']->_loop = true;
?>
                                    <option value='<?php echo $_smarty_tpl->tpl_vars['resolution']->value["id"];?>
'><?php echo $_smarty_tpl->tpl_vars['resolution']->value["name"];?>
</option>
                                <?php } ?>
                            </select>
                        </td>
                        <td>
                            <img class="help_icon" id="help_icon_resolution" src="<?php echo @SMARTY_IMG_URI;?>
/help_icon.png" />
                            <img class="loader" src="<?php echo @SMARTY_IMG_URI;?>
/ajax-loader.gif" />
                        </td>
                    </tr>
                    <tr>
                        <!-- Model -->
                        <td class="option-name">
                            3. Model:
                        </td>
                        <td>
                            <select id="id_model" name="model" class="options" >
                                <option value="" selected="selected">Select all</option>
                                <?php  $_smarty_tpl->tpl_vars['model'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['model']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['models']->value; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['model']->key => $_smarty_tpl->tpl_vars['model']->value){
$_smarty_tpl->tpl_vars['model']->_loop = true;
?>
                                    <option value='<?php echo $_smarty_tpl->tpl_vars['model']->value["id"];?>
'><?php echo $_smarty_tpl->tpl_vars['model']->value["acronym"];?>
</option>
                                <?php } ?>
                            </select>
                        </td>
                        <td>
                            <img class="help_icon" id="help_icon_model" src="<?php echo @SMARTY_IMG_URI;?>
/help_icon.png" />
                            <img class="loader" src="<?php echo @SMARTY_IMG_URI;?>
/ajax-loader.gif" />
                        </td>
                        <!-- File Format -->
                        <td class="option-name">
                            7. File format:
                        </td>
                        <td>
                            <select id="id_format" name="format" class="options" >
                                <option value="" selected="selected">Select all</option>
                                <?php  $_smarty_tpl->tpl_vars['format'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['format']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['formats']->value; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['format']->key => $_smarty_tpl->tpl_vars['format']->value){
$_smarty_tpl->tpl_vars['format']->_loop = true;
?>
                                    <option value='<?php echo $_smarty_tpl->tpl_vars['format']->value["id"];?>
'><?php echo $_smarty_tpl->tpl_vars['format']->value["name"];?>
</option>
                                <?php } ?>
                            </select>
                        </td>
                        <td>
                            <img class="help_icon" id="help_icon_format" src="<?php echo @SMARTY_IMG_URI;?>
/help_icon.png" />
                            <img class="loader" src="<?php echo @SMARTY_IMG_URI;?>
/ajax-loader.gif" />
                        </td>
                    </tr>
                    <tr>
                        <!-- Period -->
                        <td class="option-name">
                            4. Period:
                        </td>
                        <td>
                            <select id="id_period" name="period" class="options" >
                                <option value="" selected="selected">Select all</option>
                                <?php  $_smarty_tpl->tpl_vars['period'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['period']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['periods']->value; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['period']->key => $_smarty_tpl->tpl_vars['period']->value){
$_smarty_tpl->tpl_vars['period']->_loop = true;
?>
                                    <option value='<?php echo $_smarty_tpl->tpl_vars['period']->value["id"];?>
'><?php echo $_smarty_tpl->tpl_vars['period']->value["name"];?>
</option>
                                <?php } ?>
                            </select>
                        </td>
                        <td>
                            <img class="help_icon" id="help_icon_period" src="<?php echo @SMARTY_IMG_URI;?>
/help_icon.png" />
                            <img class="loader" src="<?php echo @SMARTY_IMG_URI;?>
/ajax-loader.gif" />
                        </td>
                        <!-- Tile -->
                        <td class="option-name">
                            <!-- 8. Tile: -->
                        </td>
                        <td>
                            <!-- div id="link_image">
                                <select id="id_tile" name="tile" class="options" >
                                    <option value="">No tile</option>
                                </select>
                            </div -->
                        </td>
                        <td>
                            <!-- img class="help_icon" id="help_icon_tile" src="<?php echo @SMARTY_IMG_URI;?>
/help_icon.png" />
                            <img class="loader" src="<?php echo @SMARTY_IMG_URI;?>
/ajax-loader.gif" /-->
                        </td>
                    </tr>
                </tbody>
            </table>
            <br>
            <button type="submit" id="searchSubmit" disabled="disabled">Search</button>
            <span id="file-count" style="font-size: 12px;"></span>
        </form>
    </div>

    <p>
        The data distributed here are in ARC GRID, and ARC ASCII format, in decimal degrees and datum WGS84. CCAFS and its partners have processed this data to provide seamless continuous future climate surfaces.
        Users are prohibited from any commercial, non-free resale, or redistribution without explicit written permission from CCAFS or the data-developing institutions.
        Users should acknowledge CCAFS as the source used in the creation of any reports, publications, new data sets, derived products, or services resulting from the use of this data set.
        For commercial access to the data, send requests to <a href="mailto:a.jarvis@cgiar.org">Andy Jarvis</a> at the International Center for Tropical Agriculture (CIAT).
    </p>

</div>

<?php echo $_smarty_tpl->getSubTemplate ('footer.tpl', $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>
<?php }} ?>