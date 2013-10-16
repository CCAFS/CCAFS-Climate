<?php /* Smarty version Smarty-3.1.11, created on 2013-05-07 05:52:54
         compiled from "/home/jramirezv/ccafs-climate.org/templates/data2.tpl" */ ?>
<?php /*%%SmartyHeaderCode:172810474516d7afd0bc092-53722614%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    'bd0069f0592348fa21c071fe03a59757fdaa94d0' => 
    array (
      0 => '/home/jramirezv/ccafs-climate.org/templates/data2.tpl',
      1 => 1367895262,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '172810474516d7afd0bc092-53722614',
  'function' => 
  array (
  ),
  'version' => 'Smarty-3.1.11',
  'unifunc' => 'content_516d7afd45c716_30117910',
  'variables' => 
  array (
    'fileSets' => 0,
    'fileSet' => 0,
    'isFirst' => 0,
    'periods' => 0,
    'period' => 0,
    'variables' => 0,
    'variable' => 0,
    'resolutions' => 0,
    'resolution' => 0,
    'formats' => 0,
    'format' => 0,
    'scenarios' => 0,
    'scenario' => 0,
    'models' => 0,
    'model' => 0,
  ),
  'has_nocache_code' => false,
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_516d7afd45c716_30117910')) {function content_516d7afd45c716_30117910($_smarty_tpl) {?><?php echo $_smarty_tpl->getSubTemplate ('head.tpl', $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array('jsIncludes'=>array("jquery","data2","tiptip"),'pageTitle'=>"Data - CCAFS Climate",'pageDescription'=>"High resolution climate change data for download, downscaled using different methods.",'keywords'=>"IPCC,data,download,downscaling,high resolution,delta method,climate change,projections,MarkSim,MetOffice,PRECIS"), 0);?>

<?php echo $_smarty_tpl->getSubTemplate ('header.tpl', $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array('current'=>"data"), 0);?>

<div id="subheader-image">
    <img src="<?php echo @SMARTY_IMG_URI;?>
/ribbon_header_data.gif" />
</div>
<div id="content" class="data2">
    <h3>Data</h3>
    <hr>
    <br>

    <div class="center">
        <img id="download_data_button" name="download_data_button" src="<?php echo @SMARTY_IMG_URI;?>
/download_data_button.png">
    </div>
    <div id="search_form">
        <form method="GET" action="/file-list2.php" id="formSearch">
            <table id="table_fields" class="table_form">
                <div id="div-fileSet">
                    <h4 class="left-title">File Set</h4>
                    <div class="form-options">
                        <?php $_smarty_tpl->tpl_vars['isFirst'] = new Smarty_variable(true, null, 0);?>
                        <?php  $_smarty_tpl->tpl_vars['fileSet'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['fileSet']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['fileSets']->value; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['fileSet']->key => $_smarty_tpl->tpl_vars['fileSet']->value){
$_smarty_tpl->tpl_vars['fileSet']->_loop = true;
?>                            
                            <input id="fileSet-<?php echo $_smarty_tpl->tpl_vars['fileSet']->value['id'];?>
" type="radio" name="fileSet" value="<?php echo $_smarty_tpl->tpl_vars['fileSet']->value['id'];?>
" <?php if ($_smarty_tpl->tpl_vars['isFirst']->value){?>checked<?php }?>/><label for="fileSet-<?php echo $_smarty_tpl->tpl_vars['fileSet']->value['id'];?>
"><?php echo $_smarty_tpl->tpl_vars['fileSet']->value["name"];?>
</label><br>
                            <?php $_smarty_tpl->tpl_vars['isFirst'] = new Smarty_variable(false, null, 0);?>
                        <?php } ?>
                    </div>
                </div>
                <div id="div-period">
                    <h4 class="top-title">Period</h4>
                    <div class="form-options">                        
                        <?php  $_smarty_tpl->tpl_vars['period'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['period']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['periods']->value; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['period']->key => $_smarty_tpl->tpl_vars['period']->value){
$_smarty_tpl->tpl_vars['period']->_loop = true;
?>
                            <input id="period-<?php echo $_smarty_tpl->tpl_vars['period']->value['id'];?>
" type="checkbox" name="periods[]" value="<?php echo $_smarty_tpl->tpl_vars['period']->value['id'];?>
"><label for="period-<?php echo $_smarty_tpl->tpl_vars['period']->value['id'];?>
"><?php echo $_smarty_tpl->tpl_vars['period']->value['name'];?>
</label><br>
                        <?php } ?>
                    </div>
                </div>
                <div id="div-variable">
                    <h4 class="top-title">Variable</h4>
                    <div class="form-options">
                        <?php  $_smarty_tpl->tpl_vars['variable'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['variable']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['variables']->value; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['variable']->key => $_smarty_tpl->tpl_vars['variable']->value){
$_smarty_tpl->tpl_vars['variable']->_loop = true;
?>
                            <input id="variable-<?php echo $_smarty_tpl->tpl_vars['variable']->value['id'];?>
" type="checkbox" name="variables[]" value="<?php echo $_smarty_tpl->tpl_vars['variable']->value['id'];?>
"><label for="variabe-<?php echo $_smarty_tpl->tpl_vars['variable']->value['id'];?>
"><?php echo $_smarty_tpl->tpl_vars['variable']->value['name'];?>
</label><br>
                        <?php } ?>
                        <input id="variable-9999" type="checkbox" name="variables[]" value="9999"><label for="variable-9999">Other</label><br>
                    </div>
                </div>
                <div id="div-resolution">
                    <h4 class="top-title">Resolution</h4>
                    <div class="form-options">
                        <?php $_smarty_tpl->tpl_vars['isFirst'] = new Smarty_variable(true, null, 0);?>
                        <?php  $_smarty_tpl->tpl_vars['resolution'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['resolution']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['resolutions']->value; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['resolution']->key => $_smarty_tpl->tpl_vars['resolution']->value){
$_smarty_tpl->tpl_vars['resolution']->_loop = true;
?>
                            <input id="resolution-<?php echo $_smarty_tpl->tpl_vars['resolution']->value['id'];?>
" type="radio" name="resolution" value="<?php echo $_smarty_tpl->tpl_vars['resolution']->value['id'];?>
" <?php if ($_smarty_tpl->tpl_vars['isFirst']->value){?>checked<?php }?>/><label for="resolution-<?php echo $_smarty_tpl->tpl_vars['resolution']->value['id'];?>
"><?php echo $_smarty_tpl->tpl_vars['resolution']->value["name"];?>
</label><br>
                            <?php $_smarty_tpl->tpl_vars['isFirst'] = new Smarty_variable(false, null, 0);?>
                        <?php } ?>
                    </div>
                </div>
                <div id="div-format">
                    <h4 class="top-title">Format</h4>
                    <div class="form-options">
                        <?php $_smarty_tpl->tpl_vars['isFirst'] = new Smarty_variable(true, null, 0);?>
                        <?php  $_smarty_tpl->tpl_vars['format'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['format']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['formats']->value; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['format']->key => $_smarty_tpl->tpl_vars['format']->value){
$_smarty_tpl->tpl_vars['format']->_loop = true;
?>
                            <input id="format-<?php echo $_smarty_tpl->tpl_vars['format']->value['id'];?>
" type="radio" name="format" value="<?php echo $_smarty_tpl->tpl_vars['format']->value['id'];?>
" <?php if ($_smarty_tpl->tpl_vars['isFirst']->value){?>checked<?php }?>/><label for="format-<?php echo $_smarty_tpl->tpl_vars['format']->value['id'];?>
"><?php echo $_smarty_tpl->tpl_vars['format']->value["name"];?>
</label><br>
                            <?php $_smarty_tpl->tpl_vars['isFirst'] = new Smarty_variable(false, null, 0);?>
                        <?php } ?>
                    </div>
                </div>
                <div id="div-extent">
                    <h4 class="right-title">Extent</h4>
                    <div class="form-options">
                        <input id="extent-1" type="radio" name="extent" value="global" /><label for="extent-1">Global</label><br>
                        <input id="extent-2" type="radio" name="extent" value="regional" checked/><label for="extent-2">Regional</label><br>
                    </div>
                </div>
                <div id="div-scenario">
                    <h4 class="left-title">Scenario</h4>
                    <div class="form-options">
                        <?php  $_smarty_tpl->tpl_vars['scenario'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['scenario']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['scenarios']->value; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['scenario']->key => $_smarty_tpl->tpl_vars['scenario']->value){
$_smarty_tpl->tpl_vars['scenario']->_loop = true;
?>
                            <input id="scenario-<?php echo $_smarty_tpl->tpl_vars['scenario']->value['id'];?>
" type="checkbox" name="scenarios[]" value="<?php echo $_smarty_tpl->tpl_vars['scenario']->value['id'];?>
"><label for="scenario-<?php echo $_smarty_tpl->tpl_vars['scenario']->value['id'];?>
"><?php echo $_smarty_tpl->tpl_vars['scenario']->value['name'];?>
</label><br>
                        <?php } ?>
                    </div>
                </div>                
                <div id="div-tile">
                    <div id="buttons">
                        <label>0 files found</label>
                        <button type="submit" id="searchSubmit" disabled="disabled">Search</button>
                    </div>
                    <div id="map-canvas"></div>
                </div>
                <div id="div-model">
                    <h4 class="left-title">Model</h4>
                    <div class="form-options">
                        <select name=models size=12 multiple>
                            <?php  $_smarty_tpl->tpl_vars['model'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['model']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['models']->value; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['model']->key => $_smarty_tpl->tpl_vars['model']->value){
$_smarty_tpl->tpl_vars['model']->_loop = true;
?>
                                <option name="<?php echo $_smarty_tpl->tpl_vars['model']->value['acronym'];?>
" value=<?php echo $_smarty_tpl->tpl_vars['model']->value['id'];?>
><?php echo $_smarty_tpl->tpl_vars['model']->value['acronym'];?>
</option>                                
                            <?php } ?>
                        </select>
                    </div>
                </div>
            </table>
            <br>

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