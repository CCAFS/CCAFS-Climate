<?php /* Smarty version Smarty-3.1.11, created on 2012-10-04 14:46:49
         compiled from "/home/jramirezv/ccafs-climate.org/templates/menu.tpl" */ ?>
<?php /*%%SmartyHeaderCode:486068060506e03c9a08a80-37806291%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    'cc197945b3f567cc12c04456d229c91ba630f81a' => 
    array (
      0 => '/home/jramirezv/ccafs-climate.org/templates/menu.tpl',
      1 => 1348175279,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '486068060506e03c9a08a80-37806291',
  'function' => 
  array (
  ),
  'variables' => 
  array (
    'current' => 0,
  ),
  'has_nocache_code' => false,
  'version' => 'Smarty-3.1.11',
  'unifunc' => 'content_506e03c9a3d346_93497967',
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_506e03c9a3d346_93497967')) {function content_506e03c9a3d346_93497967($_smarty_tpl) {?><nav id="main-menu">
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