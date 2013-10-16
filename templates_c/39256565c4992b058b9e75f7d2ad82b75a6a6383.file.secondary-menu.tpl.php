<?php /* Smarty version Smarty-3.1.11, created on 2013-10-16 18:15:27
         compiled from "D:\DESARROLLO\PHP\xampp\htdocs\CCAFS-Climate\templates\secondary-menu.tpl" */ ?>
<?php /*%%SmartyHeaderCode:13474525ebb9f4ffd02-02605538%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '39256565c4992b058b9e75f7d2ad82b75a6a6383' => 
    array (
      0 => 'D:\\DESARROLLO\\PHP\\xampp\\htdocs\\CCAFS-Climate\\templates\\secondary-menu.tpl',
      1 => 1348181812,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '13474525ebb9f4ffd02-02605538',
  'function' => 
  array (
  ),
  'variables' => 
  array (
    'current' => 0,
  ),
  'has_nocache_code' => false,
  'version' => 'Smarty-3.1.11',
  'unifunc' => 'content_525ebb9f50f8b7_59557146',
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_525ebb9f50f8b7_59557146')) {function content_525ebb9f50f8b7_59557146($_smarty_tpl) {?><nav id="secondary-menu">
    <ul id="navlist">
        <li <?php if ($_smarty_tpl->tpl_vars['current']->value=='contact'){?>class="current"<?php }?>><a href="/contact/">Contact</a></li>
        <li <?php if ($_smarty_tpl->tpl_vars['current']->value=='about'){?>class="current"<?php }?>><a href="/about/">About Us</a></li>
    </ul>
</nav><?php }} ?>