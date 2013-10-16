<?php /* Smarty version Smarty-3.1.11, created on 2012-10-04 14:46:49
         compiled from "/home/jramirezv/ccafs-climate.org/templates/secondary-menu.tpl" */ ?>
<?php /*%%SmartyHeaderCode:461930556506e03c99664c8-77439642%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    'b91cab4584baade4726e4a0e676926177daa20e3' => 
    array (
      0 => '/home/jramirezv/ccafs-climate.org/templates/secondary-menu.tpl',
      1 => 1348181812,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '461930556506e03c99664c8-77439642',
  'function' => 
  array (
  ),
  'variables' => 
  array (
    'current' => 0,
  ),
  'has_nocache_code' => false,
  'version' => 'Smarty-3.1.11',
  'unifunc' => 'content_506e03c9a06347_11035249',
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_506e03c9a06347_11035249')) {function content_506e03c9a06347_11035249($_smarty_tpl) {?><nav id="secondary-menu">
    <ul id="navlist">
        <li <?php if ($_smarty_tpl->tpl_vars['current']->value=='contact'){?>class="current"<?php }?>><a href="/contact/">Contact</a></li>
        <li <?php if ($_smarty_tpl->tpl_vars['current']->value=='about'){?>class="current"<?php }?>><a href="/about/">About Us</a></li>
    </ul>
</nav><?php }} ?>