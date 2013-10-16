<?php /* Smarty version Smarty-3.1.11, created on 2013-10-16 18:15:27
         compiled from "D:\DESARROLLO\PHP\xampp\htdocs\CCAFS-Climate\templates\menu.tpl" */ ?>
<?php /*%%SmartyHeaderCode:30003525ebb9f526ff5-21967186%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '7c780b7049d295e5fdb08d60237aa2a8034ee06c' => 
    array (
      0 => 'D:\\DESARROLLO\\PHP\\xampp\\htdocs\\CCAFS-Climate\\templates\\menu.tpl',
      1 => 1348175279,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '30003525ebb9f526ff5-21967186',
  'function' => 
  array (
  ),
  'variables' => 
  array (
    'current' => 0,
  ),
  'has_nocache_code' => false,
  'version' => 'Smarty-3.1.11',
  'unifunc' => 'content_525ebb9f54f097_04789251',
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_525ebb9f54f097_04789251')) {function content_525ebb9f54f097_04789251($_smarty_tpl) {?><nav id="main-menu">
    <ul id="navlist">
        <li <?php if ($_smarty_tpl->tpl_vars['current']->value=='home'){?>class="current"<?php }?>><a href="/">Home</a></li>
        <li <?php if ($_smarty_tpl->tpl_vars['current']->value=='downscaling'){?>class="current"<?php }?>><a href="/spatial_downscaling/">Spatial Downscaling</a></li>
        <li <?php if ($_smarty_tpl->tpl_vars['current']->value=='dissagregation'){?>class="current"<?php }?>><a href="/spatial_disaggregation/">Spatial Dissagregation</a></li>
        <li <?php if ($_smarty_tpl->tpl_vars['current']->value=='data'){?>class="current"<?php }?>><a href="/data/">Data</a></li>
        <li <?php if ($_smarty_tpl->tpl_vars['current']->value=='documentation'){?>class="current"<?php }?>><a href="/documentation/">Documentation</a></li>
        <li <?php if ($_smarty_tpl->tpl_vars['current']->value=='links'){?>class="current"<?php }?>><a href="/links/">Links</a></li>
        <li <?php if ($_smarty_tpl->tpl_vars['current']->value=='citations'){?>class="current"<?php }?>><a href="/citations/">Citations</a></li>
    </ul>
</nav><?php }} ?>