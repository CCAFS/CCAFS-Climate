<?php /* Smarty version Smarty-3.1.11, created on 2012-10-04 18:14:38
         compiled from "/home/jramirezv/ccafs-climate.org/templates/statistical_downscaling_climgen.tpl" */ ?>
<?php /*%%SmartyHeaderCode:1634264253506e347e5131f8-70812395%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '4ec09ff75e8274b015418e271144f854e3d31ba8' => 
    array (
      0 => '/home/jramirezv/ccafs-climate.org/templates/statistical_downscaling_climgen.tpl',
      1 => 1349187962,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '1634264253506e347e5131f8-70812395',
  'function' => 
  array (
  ),
  'has_nocache_code' => false,
  'version' => 'Smarty-3.1.11',
  'unifunc' => 'content_506e347e649b73_33405979',
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_506e347e649b73_33405979')) {function content_506e347e649b73_33405979($_smarty_tpl) {?><?php echo $_smarty_tpl->getSubTemplate ('head.tpl', $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array('pageTitle'=>"Statistical Downscaling (Climgen) - CCAFS Climate",'pageDescription'=>"Downscaled future climate data using the Climgen pattern scaling method.",'keywords'=>"Climgen,pattern scaling,climate change,IPCC,projections"), 0);?>

<?php echo $_smarty_tpl->getSubTemplate ('header.tpl', $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array('current'=>"downscaling"), 0);?>

<div id="subheader-image">
    <img src="<?php echo @SMARTY_IMG_URI;?>
/ribbon_header_climgen.gif" />
</div>
<div id="content" class="downscaling_climgen">
    <h3>Statistical Downscaling (Climgen)</h3>
    <hr>
    <br>
    <h4>Method Description</h4>
    <p>
        ClimGen is a spatial climate scenario generator, designed to allow users to explore some of the uncertainties in future climate change at regional scales.
        ClimGen was developed by Tim Osborn (<a href="http://www.cru.uea.ac.uk">Climatic Research Unit</a>) and Tim Mitchell (<a href="http://www.tyndall.ac.uk">Tyndall Centre for Climate Change Research</a>), both in the School of Environmental Science, University of East Anglia, Norwich, UK.
    </p>
    <p>
        ClimGen is based on the so-called "pattern-scaling" approach to generating spatial climate change information for a given global-mean temperature change.
        The pattern-scaling approach relies on the assumption that the pattern of climate change (encompassing the geographical, seasonal and multi-variable structure) simulated by coupled atmosphere-ocean general circulation models (AOGCMs) is relatively constant (for a given AOGCM) under a range of rates and amounts of global warming, provided that the changes are expressed as change per unit Kelvin of global-mean temperature change.
        These normalised patterns of climate change do, however, show considerable variation between different AOGCMs, and it is this variation that ClimGen is principally designed to explore. Further scientific details are provided in the technical paper given below.
    </p>

    <p>
        From the AVOID project (funded by DEFRA, UK), CLIMGEN was used for A1B emission scenario. Th data provided here are the result of aplplying this downscaling method to 7 GCMs, as follows:
    </p>
    <ol>
        <li type="square">CCCMA-CGCM3.1</li>
        <li type="square">CSIRO-Mk3.0</li>
        <li type="square">IPSL-CM4</li>
        <li type="square">MPI-ECHAM5</li>
        <li type="square">NCAR-CCSM3.0</li>
        <li type="square">UKMO-HadCM3</li>
        <li type="square">UKMO-HadGEM1</li>
    </ol>
    <p>
        The datasets were provided as full 2006-2100 timeseries, at half-degree spatial resolution. We averaged those timeseries and calculated 7 different 30-year periods (for the 7 GCMs), so that a set of 49 future climate scenarios were generated (permutation of 7 GCMs and 7 time-slices).
    </p>
    <p align="center">
    <table id="projection_images">
        <tbody>
            <tr>
                <td>
                    <img border="0" name="graph_tyn_tmeanA1B" src="<?php echo @SMARTY_IMG_URI;?>
/graph_tyn_tmeanA1B.png" />
                    <img border="0" name="graph_tyninter_tmeanA1B" src="<?php echo @SMARTY_IMG_URI;?>
/graph_tyninter_tmeanA1B.png" />
                </td>
            </tr>
            <tr>
                <td>
                    <img border="0" name="graph_tyn_precA1B" src="<?php echo @SMARTY_IMG_URI;?>
/graph_tyn_precA1B.png" />
                    <img border="0" name="graph_tyninter_precA1B" src="<?php echo @SMARTY_IMG_URI;?>
/graph_tyninter_precA1B.png" />
                </td>
            </tr>
        </tbody>
    </table>
    <br>
    <b>Figure 1</b>. Projections of future global average annual precipitation and temperature for A1B scenarios from downscaled tyndall data.
    <p>
        <i>For more info see the <a href="<?php echo @SMARTY_DOCS_URI;?>
/Climgen-Downscaling-Tyndall.pdf">The CLIMGEN model; Downscaling Tyndall</a> document</i>.
    </p>
    <br>
    <div class="center">
        <a href="/data/">
            <img id="download_data_button" name="download_data_button" src="<?php echo @SMARTY_IMG_URI;?>
/download_data_button.png">
        </a>
    </div>
</div>

<?php echo $_smarty_tpl->getSubTemplate ('footer.tpl', $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>
<?php }} ?>