<?php /* Smarty version Smarty-3.1.11, created on 2012-10-05 08:55:42
         compiled from "/home/jramirezv/ccafs-climate.org/templates/file-list.tpl" */ ?>
<?php /*%%SmartyHeaderCode:259642951506e05f04f7c51-98808105%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    'd629e13d8bb3fee3bb9e3f0cb7f452b2dba2ee5c' => 
    array (
      0 => '/home/jramirezv/ccafs-climate.org/templates/file-list.tpl',
      1 => 1349452536,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '259642951506e05f04f7c51-98808105',
  'function' => 
  array (
  ),
  'version' => 'Smarty-3.1.11',
  'unifunc' => 'content_506e05f05e05a7_91509635',
  'variables' => 
  array (
    'files' => 0,
    'file' => 0,
  ),
  'has_nocache_code' => false,
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_506e05f05e05a7_91509635')) {function content_506e05f05e05a7_91509635($_smarty_tpl) {?><?php echo $_smarty_tpl->getSubTemplate ('head.tpl', $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array('jsIncludes'=>array("jquery","file-list","tablesorter"),'pageTitle'=>"File List - CCAFS Climate",'pageDescription'=>"List of files available for download from CCAFS data portal.",'keywords'=>"files,download,CCAFS"), 0);?>

<?php echo $_smarty_tpl->getSubTemplate ('header.tpl', $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array('current'=>"data"), 0);?>

<div id="subheader-image">
    <img src="<?php echo @SMARTY_IMG_URI;?>
/ribbon_header_data.gif" />
</div>
<div id="content" class="file-list">
    <h3>File List</h3>
    <hr>
    <br>
    <p>
        Please select one or more files you want to download.
    </p>
    <form id="files-form" action="/form.php" method="POST">
        <table id="files-table" class="tablesorter">
            <thead>
                <tr>
                    <th><input type="checkbox" id="check-all" />Select All</th>
                    <th>File Name</th>
                    <th>File Set</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <?php  $_smarty_tpl->tpl_vars['file'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['file']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['files']->value; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['file']->key => $_smarty_tpl->tpl_vars['file']->value){
$_smarty_tpl->tpl_vars['file']->_loop = true;
?>
                    <tr>
                        <td>
                            <input class="checkbox-file" type="checkbox" name="download-files[]" value="<?php echo $_smarty_tpl->tpl_vars['file']->value["id"];?>
" />
                        </td>
                        <td><?php echo $_smarty_tpl->tpl_vars['file']->value['name'];?>
</td>
                        <td><?php echo $_smarty_tpl->tpl_vars['file']->value['fileset'];?>
</td>
                        <td><?php echo $_smarty_tpl->tpl_vars['file']->value['availability'];?>
</td>

                    </tr>
                <?php } ?>
            </tbody>
        </table>
        <input type="hidden" name="file-type" value="file" />
        <button id="download-button" type="submit" disabled="disabled">Generate Download Links</button>
    </form>
</div>
<?php echo $_smarty_tpl->getSubTemplate ('footer.tpl', $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>

<?php }} ?>