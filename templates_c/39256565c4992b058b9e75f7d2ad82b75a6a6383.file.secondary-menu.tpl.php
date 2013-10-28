<?php /* Smarty version Smarty-3.1.11, created on 2013-10-25 21:07:16
         compiled from "D:\DESARROLLO\PHP\xampp\htdocs\CCAFS-Climate\templates\secondary-menu.tpl" */ ?>
<?php /*%%SmartyHeaderCode:22991526ac164f0a2e0-49485057%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
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
  'nocache_hash' => '22991526ac164f0a2e0-49485057',
  'function' => 
  array (
  ),
  'variables' => 
  array (
    'current' => 0,
  ),
  'has_nocache_code' => false,
  'version' => 'Smarty-3.1.11',
  'unifunc' => 'content_526ac164f1a2e0_53219972',
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_526ac164f1a2e0_53219972')) {function content_526ac164f1a2e0_53219972($_smarty_tpl) {?><nav id="secondary-menu">
    <ul id="navlist">
        <li <?php if ($_smarty_tpl->tpl_vars['current']->value=='contact'){?>class="current"<?php }?>><a href="/contact/">Contact</a></li>
        <li <?php if ($_smarty_tpl->tpl_vars['current']->value=='about'){?>class="current"<?php }?>><a href="/about/">About Us</a></li>
    </ul>
</nav><?php }} ?>