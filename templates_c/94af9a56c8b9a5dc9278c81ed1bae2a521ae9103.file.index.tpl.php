<?php /* Smarty version Smarty-3.1.11, created on 2012-10-04 14:53:20
         compiled from "/home/jramirezv/ccafs-climate.org/templates/index.tpl" */ ?>
<?php /*%%SmartyHeaderCode:1045873619506e0550a134a7-43113949%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '94af9a56c8b9a5dc9278c81ed1bae2a521ae9103' => 
    array (
      0 => '/home/jramirezv/ccafs-climate.org/templates/index.tpl',
      1 => 1349369121,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '1045873619506e0550a134a7-43113949',
  'function' => 
  array (
  ),
  'has_nocache_code' => false,
  'version' => 'Smarty-3.1.11',
  'unifunc' => 'content_506e0550af3af0_24663236',
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_506e0550af3af0_24663236')) {function content_506e0550af3af0_24663236($_smarty_tpl) {?><?php echo $_smarty_tpl->getSubTemplate ('head.tpl', $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array('jsIncludes'=>array('jquery','index'),'pageTitle'=>"CCAFS Climate",'pageDescription'=>"Climate change downscaled data portal provided by CIAT and CCAFS.",'keywords'=>"downscaling,GCM,climate change,CIAT,CCAFS"), 0);?>

<?php echo $_smarty_tpl->getSubTemplate ('header.tpl', $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array('current'=>"home"), 0);?>


<div id="content" class="home">
    <table id="sections">
        <tbody>
            <tr>
                <td>
                    <a href="/spatial_downscaling/">
                        <div id="section">
                            <img class="color" src="<?php echo @SMARTY_IMG_URI;?>
/icon_spatial_downscaling.png" />
                        </div>
                    </a>
                </td>
                <td>
                    <a href="/spatial_disaggregation/">
                        <div id="section">
                            <img class="color" src="<?php echo @SMARTY_IMG_URI;?>
/icon_spatial_disaggregation.png">
                        </div>
                    </a>
                </td>
                <td>
                    <a href="/data/">
                        <div id="section">
                            <img class="color" src="<?php echo @SMARTY_IMG_URI;?>
/icon_data.png">
                        </div>
                    </a>
                </td>
                <td>
                    <a href="/documentation/">
                        <div id="section">
                            <img class="color" src="<?php echo @SMARTY_IMG_URI;?>
/icon_docs.png">
                        </div>
                    </a>
                </td>
                <td>
                    <a href="/links/">
                        <div id="section">
                            <img class="color" src="<?php echo @SMARTY_IMG_URI;?>
/icon_links.png">
                        </div>
                    </a>
                </td>
                <td>
                    <a href="/citations/">
                        <div id="section">
                            <img class="color" src="<?php echo @SMARTY_IMG_URI;?>
/icon_citations.png">
                        </div>
                    </a>
                </td>
                <td>
                    <a href="/contact/">
                        <div id="section">
                            <img class="color" src="<?php echo @SMARTY_IMG_URI;?>
/icon_contact.png">
                        </div>
                    </a>
                </td>
            </tr>
        </tbody>
    </table>
    <div id="content-description">
        <h4>Data Provided by the CGIAR Research Program on Climate Change, Agriculture and Food Security (CCAFS)</h4>
        <p>
            The data distributed here are in ARC GRID, and ARC ASCII format, in decimal degrees and datum WGS84. CCAFS and its partners have processed this data to provide seamless continuous future climate surfaces.
            Users are prohibited from any commercial, non-free resale, or redistribution without explicit written permission from CCAFS or the data-developing institutions.
            Users should acknowledge CCAFS as the source used in the creation of any reports, publications, new data sets, derived products, or services resulting from the use of this data set.
            For commercial access to the data, send requests to <a href="mailto:a.jarvis@cgiar.org">Andy Jarvis</a> at the International Center for Tropical Agriculture (CIAT).
        </p>
        <p>
            CCAFS provides these data without any warranty of any kind whatsoever, either express or implied, including warranties of merchantability and fitness for a particular purpose.
            CCAFS shall not be liable for incidental, consequential, or special damages arising out of the use of any data published here.
        </p>
    </div>
</div>
<?php echo $_smarty_tpl->getSubTemplate ('footer.tpl', $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>
<?php }} ?>