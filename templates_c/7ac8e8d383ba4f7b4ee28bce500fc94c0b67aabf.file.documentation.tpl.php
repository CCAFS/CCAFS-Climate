<?php /* Smarty version Smarty-3.1.11, created on 2013-05-20 06:23:34
         compiled from "/home/jramirezv/ccafs-climate.org/templates/documentation.tpl" */ ?>
<?php /*%%SmartyHeaderCode:95250676506e0577065442-89852962%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '7ac8e8d383ba4f7b4ee28bce500fc94c0b67aabf' => 
    array (
      0 => '/home/jramirezv/ccafs-climate.org/templates/documentation.tpl',
      1 => 1369056211,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '95250676506e0577065442-89852962',
  'function' => 
  array (
  ),
  'version' => 'Smarty-3.1.11',
  'unifunc' => 'content_506e0577104693_68932726',
  'has_nocache_code' => false,
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_506e0577104693_68932726')) {function content_506e0577104693_68932726($_smarty_tpl) {?><?php echo $_smarty_tpl->getSubTemplate ('head.tpl', $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array('pageTitle'=>"Documentation- CCAFS Climate",'pageDescription'=>"Useful reading for understanding the CCAFS downscaled climate change projections.",'keywords'=>"CCAFS,documentation,downscaling,climate change"), 0);?>

<?php echo $_smarty_tpl->getSubTemplate ('header.tpl', $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array('current'=>"documentation"), 0);?>

<div id="subheader-image">
    <img src="<?php echo @SMARTY_IMG_URI;?>
/ribbon_header_docs.gif" />
</div>
<div id="content" class="documentation">
    <h3>Documentation</h3>
    <hr>
    <br>
    <h4>Useful documents</h4>
    <ul id="document-list" type="none">        
        <li type="square">
            <a href="<?php echo @SMARTY_DOCS_URI;?>
/Ramirez_Bueno-Cabrera_2009_tutorial_bcvars_creation.pdf">
                <img src="<?php echo @SMARTY_IMG_URI;?>
/icon-pdf.png" />
                Tutorial to generate 19 bioclimatic variables from monthly datasets.
            </a>
        </li>
        <ul>
            <li type="circle">
                <a href="<?php echo @SMARTY_DOCS_URI;?>
/bioclimatic-variables.pdf">
                    <img src="<?php echo @SMARTY_IMG_URI;?>
/icon-pdf.png" />
                    Abbreviations Used For Bioclimatic Variables.
                </a>
            </li>
        </ul>
        <li type="square">
            <a href="<?php echo @SMARTY_DOCS_URI;?>
/Downscaling-WP-01.pdf">
                <img src="<?php echo @SMARTY_IMG_URI;?>
/icon-pdf.png" />
                Downscaling Global Circulation Model Outputs: The Delta Method.
            </a>
        </li>
        <ul>
            <li type="circle">
                <a href="<?php echo @SMARTY_DOCS_URI;?>
/Data_source_and_process_flow_chart_CIAT_DELTA.pdf">
                    <img src="<?php echo @SMARTY_IMG_URI;?>
/icon-pdf.png" />
                    Data Source and Process flow chart Delta Method (Hiett M., 2011).
                </a>
            </li>
        </ul>
        <li type="square">
            <a href="<?php echo @SMARTY_DOCS_URI;?>
/Disaggregation-WP-02.pdf">
                <img src="<?php echo @SMARTY_IMG_URI;?>
/icon-pdf.png" />
                Disaggregation of Global Circulation Model Outputs.
            </a>
        </li>
        <li type="square">
            <a href="<?php echo @SMARTY_DOCS_URI;?>
/Climgen-Downscaling-Tyndall.pdf">
                <img src="<?php echo @SMARTY_IMG_URI;?>
/icon-pdf.png" />
                The CLIMGEN model: Downscaling Tyndall.
            </a>
        </li>
        <li type="square">
            <a href="<?php echo @SMARTY_DOCS_URI;?>
/worldclim_IJC.pdf">
                <img src="<?php echo @SMARTY_IMG_URI;?>
/icon-pdf.png" />
                Very high resolution interpolated climate surfaces for Global Land Areas.
            </a>
        </li>
        <ul>
            <li type="circle">
                <a href="<?php echo @SMARTY_DOCS_URI;?>
/Data_source_and_process_flow_chart_worldclim.pdf">
                    <img src="<?php echo @SMARTY_IMG_URI;?>
/icon-pdf.png" />
                    Data Source and Process flow chart WorldClim (Hiett M., 2011).
                </a>
            </li>
        </ul>
        <li type="square">
            <a href="http://www.metoffice.gov.uk/media/pdf/6/5/PRECIS_Handbook.pdf">
                <img src="<?php echo @SMARTY_IMG_URI;?>
/icon-pdf.png" />
                Generating High Resolution Climate Change Scenarios using PRECIS.
            </a>
        </li>
        <ul>
            <li type="circle">
                <a href="<?php echo @SMARTY_DOCS_URI;?>
/precis-variables.pdf">
                    <img src="<?php echo @SMARTY_IMG_URI;?>
/icon-pdf.png" />
                    Abbreviations Used For PRECIS Data.
                </a>
            </li>
        </ul>
        <li type="square">
            <a href="<?php echo @SMARTY_DOCS_URI;?>
/Generating_Characteristic_Daily_Weather_Data_using_Downscaled_Climate_Model_Data_Jones_Thornton_Heinke_2009.pdf">
                <img src="<?php echo @SMARTY_IMG_URI;?>
/icon-pdf.png" />
                Generating characteristic daily weather data using downscaled climate model data from IPCC's Fourth Assessment.
            </a>
        </li>
        <li type="square">
            <a href="<?php echo @SMARTY_DOCS_URI;?>
/MarkSim_Standalone_Documentation.pdf">
                <img src="<?php echo @SMARTY_IMG_URI;?>
/icon-pdf.png" />
                MarkSim standalone for DSSAT users (Jones et al., 2011).
            </a>
        </li>
        <li type="square">
            <a href="<?php echo @SMARTY_DOCS_URI;?>
/MarkSim_Generating_Downscaled_Weather_Data.pdf">
                <img src="<?php echo @SMARTY_IMG_URI;?>
/icon-pdf.png" />
                Generating downscaled weather data from a suite of climate models for agricultural modelling applications
            </a>
        </li>
    </ul>
</div>
<?php echo $_smarty_tpl->getSubTemplate ('footer.tpl', $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>
<?php }} ?>