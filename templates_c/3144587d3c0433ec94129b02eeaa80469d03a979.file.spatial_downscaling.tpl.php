<?php /* Smarty version Smarty-3.1.11, created on 2012-10-04 18:11:03
         compiled from "/home/jramirezv/ccafs-climate.org/templates/spatial_downscaling.tpl" */ ?>
<?php /*%%SmartyHeaderCode:939325089506e33a79eaf58-96523686%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '3144587d3c0433ec94129b02eeaa80469d03a979' => 
    array (
      0 => '/home/jramirezv/ccafs-climate.org/templates/spatial_downscaling.tpl',
      1 => 1349187796,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '939325089506e33a79eaf58-96523686',
  'function' => 
  array (
  ),
  'has_nocache_code' => false,
  'version' => 'Smarty-3.1.11',
  'unifunc' => 'content_506e33a7c27ce5_15318810',
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_506e33a7c27ce5_15318810')) {function content_506e33a7c27ce5_15318810($_smarty_tpl) {?><?php echo $_smarty_tpl->getSubTemplate ('head.tpl', $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array('jsIncludes'=>array('jquery','downscaling'),'pageTitle'=>"Spatial Downscaling Methods - CCAFS Climate",'pageDescription'=>"Statistically downscaled future climate projections from IPCC assessment reports.",'keywords'=>"downscaling,projections,climate change,high resolution,IPCC,CCAFS"), 0);?>

<?php echo $_smarty_tpl->getSubTemplate ('header.tpl', $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array('current'=>"downscaling"), 0);?>

<div id="subheader-image">
    <img src="<?php echo @SMARTY_IMG_URI;?>
/ribbon_header_down.gif" />
</div>
<div id="content" class="downscaling">
    <h3>Spatial Downscaling Methods</h3>
    <hr>
    <br>
    <table id="methods">
        <tr>
            <td>
                <a href="/statistical_downscaling_delta/" >
                    <div id="section">
                        <img src="<?php echo @SMARTY_IMG_URI;?>
/logo_delta_method.png" />
                    </div>
                </a>
            </td>
            <td>
                <a href="/pattern_scaling/" >
                    <div id="section">
                        <img src="<?php echo @SMARTY_IMG_URI;?>
/logo_marksim.png" />
                    </div>
                </a>
            </td>
        </tr>
        <tr>
            <td>
                <a href="/statistical_downscaling_climgen/" >
                    <div id="section">
                        <img src="<?php echo @SMARTY_IMG_URI;?>
/logo_climgen.png" />
                    </div>
                </a>
            </td>
            <td>
                <a href="/dynamical_downscaling/" >
                    <div id="section">
                        <img src="<?php echo @SMARTY_IMG_URI;?>
/logo_dynamical_downscaling.png" />
                    </div>
                </a>
            </td>
        </tr>
    </table>
</div>

<?php echo $_smarty_tpl->getSubTemplate ('footer.tpl', $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>
<?php }} ?>