<?php /* Smarty version Smarty-3.1.11, created on 2012-10-05 03:47:34
         compiled from "/home/jramirezv/ccafs-climate.org/templates/links.tpl" */ ?>
<?php /*%%SmartyHeaderCode:846479410506ebac6647277-81013029%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    'afd0d2bbe898ca40e90d78a2c031663a8577db75' => 
    array (
      0 => '/home/jramirezv/ccafs-climate.org/templates/links.tpl',
      1 => 1349187618,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '846479410506ebac6647277-81013029',
  'function' => 
  array (
  ),
  'has_nocache_code' => false,
  'version' => 'Smarty-3.1.11',
  'unifunc' => 'content_506ebac6863d41_81597538',
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_506ebac6863d41_81597538')) {function content_506ebac6863d41_81597538($_smarty_tpl) {?><?php echo $_smarty_tpl->getSubTemplate ('head.tpl', $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array('pageTitle'=>"Links - CCAFS Climate",'pageDescription'=>"Links to useful information, datasets and tools related to the CCAFS downscaled data.",'keywords'=>"CCAFS,tools,datases,downscaling"), 0);?>

<?php echo $_smarty_tpl->getSubTemplate ('header.tpl', $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array('current'=>"links"), 0);?>

<div id="subheader-image">
    <img src="<?php echo @SMARTY_IMG_URI;?>
/ribbon_header_links.gif" />
</div>
<div id="content" class="links">
    <h3>Links</h3>
    <hr>
    <br>
    <h4>Useful links</h4>

    <p>
        The above links are relevant to obtain or process data, and as support to the downscaling method used to develop the datasets used here:
    </p>
    <ul id="link-list">
        <li type="square">
            <a target="_blank" href="http://dapa.ciat.cgiar.org">
                The CIAT Decision and Policy Analysis (DAPA) program website.
            </a>
        </li>
        <li type="square">
            <a target="_blank" href="http://www.worldclim.org">
                The WorldClim dataset.
            </a>
        </li>
        <li type="square">
            <a target="_blank" href="http://srtm.csi.cgiar.org">
                Hole filled SRTM 90m resolution elevation dataset.
            </a>
        </li>
        <li type="square">
            <a target="_blank" href="http://cru.csi.cgiar.">
                CRU historical climate dataset.
            </a>
        </li>
        <li type="square">
            <a target="_blank" href="http://www.ipcc.ch/publications_and_data/publications_and_data_reports.shtml">
                IPCC fourth assessment report (AR4).
            </a>
        </li>
        <li type="square">
            <a target="_blank" href="http://www.ipcc-data.org">
                The IPCC data distribution centre.
            </a>
        </li>
        <li type="square">
            <a target="_blank" href="https://esg.llnl.gov:8443">
                The IPCC multimodel database (WCRP CMIP3 Multi-Model Data).
            </a>
        </li>
        <li type="square">
            <a target="_blank" href="http://www.diva-gis.org">
                The DIVA-GIS software website (latest version 7.1.7).
            </a>
        </li>
    </ul>
</div>
<?php echo $_smarty_tpl->getSubTemplate ('footer.tpl', $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>
<?php }} ?>