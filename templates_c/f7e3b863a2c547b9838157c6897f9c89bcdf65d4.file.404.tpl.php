<?php /* Smarty version Smarty-3.1.11, created on 2012-10-04 14:46:49
         compiled from "/home/jramirezv/ccafs-climate.org/templates/404.tpl" */ ?>
<?php /*%%SmartyHeaderCode:905365289506e03c96da642-07911057%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    'f7e3b863a2c547b9838157c6897f9c89bcdf65d4' => 
    array (
      0 => '/home/jramirezv/ccafs-climate.org/templates/404.tpl',
      1 => 1349188024,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '905365289506e03c96da642-07911057',
  'function' => 
  array (
  ),
  'has_nocache_code' => false,
  'version' => 'Smarty-3.1.11',
  'unifunc' => 'content_506e03c9873f16_22978296',
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_506e03c9873f16_22978296')) {function content_506e03c9873f16_22978296($_smarty_tpl) {?><?php echo $_smarty_tpl->getSubTemplate ('head.tpl', $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array('pageDescription'=>"Error",'keywords'=>"Error"), 0);?>

<?php echo $_smarty_tpl->getSubTemplate ('header.tpl', $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>

<h3 style="text-align: center; font-family: verdana">The page you're looking for doesn't exist.</h3>
<p style="text-align: center; font-family: verdana">Thank you for visiting CCAFS-Climate.org. We've recently launched a substantial website redesign and some of our pages may have moved.</p>
<img style="left: 50%; margin-left: 180px; top: 50%;" alt="" src="http://css-tricks.com/images/404.jpg">
<?php echo $_smarty_tpl->getSubTemplate ('footer.tpl', $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>
<?php }} ?>