<?php /* Smarty version Smarty-3.1.11, created on 2012-10-04 18:19:45
         compiled from "/home/jramirezv/ccafs-climate.org/templates/spatial_disaggregation.tpl" */ ?>
<?php /*%%SmartyHeaderCode:387365670506e35b12f18e2-48591873%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '7a713c75911c22c85a0e618cb38925f64e532783' => 
    array (
      0 => '/home/jramirezv/ccafs-climate.org/templates/spatial_disaggregation.tpl',
      1 => 1349187733,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '387365670506e35b12f18e2-48591873',
  'function' => 
  array (
  ),
  'has_nocache_code' => false,
  'version' => 'Smarty-3.1.11',
  'unifunc' => 'content_506e35b13a19e2_35327806',
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_506e35b13a19e2_35327806')) {function content_506e35b13a19e2_35327806($_smarty_tpl) {?><?php echo $_smarty_tpl->getSubTemplate ('head.tpl', $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array('pageTitle'=>"Spatial Disaggregation - CCAFS Climate",'pageDescription'=>"Spatially disaggregated future climate projections from all IPCC assessment reports.",'keywords'=>"IPCC,disaggregated,climate change,CMIP,projections,high resolution"), 0);?>

<?php echo $_smarty_tpl->getSubTemplate ('header.tpl', $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array('current'=>"dissagregation"), 0);?>

<div id="subheader-image">
    <img src="<?php echo @SMARTY_IMG_URI;?>
/ribbon_header_spdis.gif" />
</div>
<div id="content" class="disaggregation">
    <h3>Spatial Dissagregation</h3>
    <hr>
    <br>
    <h4>Method Description</h4>
    <p>
        Disaggregation provides an easy to apply and much rapid method for developing high resolution climate change surfaces for high resolution regional climate change impact assessment studies, with less likelihood of altering original GCM patterns.
        We applied spatial disaggregation to 24 different GCMs from the IPCC Fourth Assessment Report (2007), directly downloaded from the <a href="http://www.earthsystemgrid.org">Earth System Grid (ESG) data portal</a>, for the emission scenarios SRES-A1B (24 GCMs), SRES-A2 (19 GCMs), and SRES-B1 (20 GCMs), and for 7 different 30 year running mean periods.
        A total of 441 future climate scenarios were produced at four different spatial resolutions (30 arc-seconds, 2.5 arc-minutes, 5 arc-minutes, and 10 arc-minutes). Each climate scenario or dataset (SRES scenario - GCM timeslice) comparises 4 variables at a monthly time-step (mean, maximum, minimum temperature, and total precipitation) and a set of <a href="http://www.worldclim.org/bioclim">bioclimatic indices</a>.
    </p>

    <p>
        The process consists in the following steps:
    </p>
    <ol>
        <li>Gathering of baseline data (current climates corresponding to WorldClim).</li>
        <li>Gathering of full GCM timeseries.</li>
        <li>Calculation of 30 year running averages for present day simulations (1961-1990) and 7 future periods (2010-2039, 2020-2049, 2030-2059, 2040-2069, 2050-2079, 2060-2089, 2070-2099).</li>
        <li>Calculation of anomalies as the absolute difference between future values in each of the 3 variables to be disaggregated.</li>
        <li>Addition of anomalies surfaces to the current climates from WorldClim, using absolute sum for temperatures, and addition of relative changes for precipitation.</li>
        <li>Calculation of mean temperature as the average of maximum and minimum temperatures.</li>
    </ol>
    <p>
        <i>For more info see the <a href="<?php echo @SMARTY_DOCS_URI;?>
/Disaggregation-WP-02.pdf">Disaggregation of Global Circulation Model Outputs (PDF)</a> document</i>.
    </p>
    <table id="circulation-model">
        <tbody>
            <tr>
                <td>
                    <img border="0" name="graph_diss_precA1B" src="<?php echo @SMARTY_IMG_URI;?>
/graph_diss_precA1B.png" />
                    <img border="0" name="graph_diss_tmeanA1B" src="<?php echo @SMARTY_IMG_URI;?>
/graph_diss_tmeanA1B.png" />
                </td>
            </tr>
        </tbody>
    </table>
    <br>
    <b>Figure 1</b>. Projections of future global average annual precipitation and temperature for A1B scenarios from disaggregated data.
    <p>
        <i>View all projections from spatial disaggregated data, for <a href="<?php echo @SMARTY_DOCS_URI;?>
/Disaggregation_Graphs_A1B.pdf">A1B</a>, <a href="<?php echo @SMARTY_DOCS_URI;?>
/Disaggregation_Graphs_A2.pdf">A2A</a>, <a href="<?php echo @SMARTY_DOCS_URI;?>
/Disaggregation_Graphs_B1.pdf">B1</a> scenarios</i>.
    </p>
    <p>
        If you need baseline data for this method see <a target="_blank" href="http://www.worldclim.org/current">WorldClim portal</a>.
    </p>
    <br>
    <div class="center">
        <a href="/data/">
            <img id="download_data_button" name="download_data_button" src="<?php echo @SMARTY_IMG_URI;?>
/download_data_button.png" />
        </a>
    </div>
</div>

<?php echo $_smarty_tpl->getSubTemplate ('footer.tpl', $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>
<?php }} ?>