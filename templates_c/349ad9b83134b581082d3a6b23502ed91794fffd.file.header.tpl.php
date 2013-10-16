<?php /* Smarty version Smarty-3.1.11, created on 2012-10-04 14:46:49
         compiled from "/home/jramirezv/ccafs-climate.org/templates/header.tpl" */ ?>
<?php /*%%SmartyHeaderCode:342710397506e03c9959ce9-82302455%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '349ad9b83134b581082d3a6b23502ed91794fffd' => 
    array (
      0 => '/home/jramirezv/ccafs-climate.org/templates/header.tpl',
      1 => 1349379335,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '342710397506e03c9959ce9-82302455',
  'function' => 
  array (
  ),
  'has_nocache_code' => false,
  'version' => 'Smarty-3.1.11',
  'unifunc' => 'content_506e03c9964669_55463784',
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_506e03c9964669_55463784')) {function content_506e03c9964669_55463784($_smarty_tpl) {?><div class="container">
    <div class="wrapper">
        <?php echo $_smarty_tpl->getSubTemplate ('secondary-menu.tpl', $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array('current'=>((string)$_smarty_tpl->tpl_vars['current']->value)), 0);?>

        <header>
            <div id="logo">
                <a href="http://ccafs.cgiar.org" target="_BLANK">
                    <img class="logo" alt="Home" src="/theme/images/logo_ccafs.png">
                </a>
            </div>
        </header>
        <?php echo $_smarty_tpl->getSubTemplate ('menu.tpl', $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array('current'=>((string)$_smarty_tpl->tpl_vars['current']->value)), 0);?>


<?php }} ?>