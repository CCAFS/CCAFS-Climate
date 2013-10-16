<?php /* Smarty version Smarty-3.1.11, created on 2013-10-16 18:45:36
         compiled from "D:\DESARROLLO\PHP\xampp\htdocs\CCAFS-Climate\templates\header.tpl" */ ?>
<?php /*%%SmartyHeaderCode:8301525ebb9f4d7748-98548861%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    'e7891b364ee0f067e171db4ce1def33a06c3bf93' => 
    array (
      0 => 'D:\\DESARROLLO\\PHP\\xampp\\htdocs\\CCAFS-Climate\\templates\\header.tpl',
      1 => 1381941469,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '8301525ebb9f4d7748-98548861',
  'function' => 
  array (
  ),
  'version' => 'Smarty-3.1.11',
  'unifunc' => 'content_525ebb9f4e61b0_84332955',
  'has_nocache_code' => false,
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_525ebb9f4e61b0_84332955')) {function content_525ebb9f4e61b0_84332955($_smarty_tpl) {?><div class="container">
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