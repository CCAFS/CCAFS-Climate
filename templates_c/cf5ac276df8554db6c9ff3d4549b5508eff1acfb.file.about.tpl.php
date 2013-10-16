<?php /* Smarty version Smarty-3.1.11, created on 2013-10-16 18:59:10
         compiled from "D:\DESARROLLO\PHP\xampp\htdocs\CCAFS-Climate\templates\about.tpl" */ ?>
<?php /*%%SmartyHeaderCode:23300525ec5de975fc3-19927400%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    'cf5ac276df8554db6c9ff3d4549b5508eff1acfb' => 
    array (
      0 => 'D:\\DESARROLLO\\PHP\\xampp\\htdocs\\CCAFS-Climate\\templates\\about.tpl',
      1 => 1349454583,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '23300525ec5de975fc3-19927400',
  'function' => 
  array (
  ),
  'has_nocache_code' => false,
  'version' => 'Smarty-3.1.11',
  'unifunc' => 'content_525ec5dea1b8b3_92481483',
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_525ec5dea1b8b3_92481483')) {function content_525ec5dea1b8b3_92481483($_smarty_tpl) {?><?php echo $_smarty_tpl->getSubTemplate ('head.tpl', $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array('pageTitle'=>"About Us - CCAFS Climate",'pageDescription'=>"About the CCAFS team and downscaled datasets",'keywords'=>"CCAFS,about,information,description"), 0);?>

<?php echo $_smarty_tpl->getSubTemplate ('header.tpl', $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array('current'=>"about"), 0);?>

<div id="subheader-image">
    <img src="<?php echo @SMARTY_IMG_URI;?>
/ribbon_header_aboutus.gif" />
</div>
<div id="content" class="about">
    <h3>About Us</h3>
    <hr>
    <br>
    <p>
        The datasets contained in this website are part of the International Centre for Tropical Agriculture (CIAT) and The CGIAR Research Program on Climate Change, Agriculture and Food Security (CCAFS).
    </p>
    <p>
        CIAT is an agricultural research institution, focused on scientific solutions to hunger in the tropics. CIAT believe eco-efficient agriculture—developing sustainable methods of food production—is the best way to eradicate hunger and improve livelihoods in the region.  CIAT is a leading not-for-profit organization and we have been helping smallholders grow more food and earn more money for 40 years.
    </p>
    <p>
        CCAFS is a 10-year research initiative of the CGIAR and the Earth System Science Partnership (ESSP). The CCAFS program seeks to overcome the threats to agriculture and food security in a changing climate, exploring new ways of helping vulnerable rural communities adjust to global changes in climate. CCAFS brings together the world's best researchers in agricultural science, climate science, environmental and social sciences to identify and address the most important interactions, synergies and trade-offs between climate change and agriculture. CCAFS will thus define and implement a uniquely innovative and transformative research program that addresses agriculture in the context of climate variability, climate change and uncertainty about future climate conditions.
    </p>

    <h3>How to cite us?</h3>
    <p>Citation of the <a href="/statistical_downscaling_delta/">statistical downscaled delta method dataset</a> may be done as follows:</p>
    <ul>
        <li>Ramirez, J.; Jarvis, A. 2008. <b>High Resolution Statistically Downscaled Future Climate Surfaces</b>. International Center for Tropical Agriculture (CIAT); CGIAR Research Program on Climate Change, Agriculture and Food Security (CCAFS). Cali, Colombia.</li>
    </ul>
    <p>Citation of the <a href="/spatial_disaggregation/">spatial disaggregation method dataset</a> may be done as follows:</p>
    <ul>
        <li>Ramirez, J.; Jarvis, A. 2008. <b>Disaggregation of Global Circulation Model Outputs</b>. International Center for Tropical Agriculture (CIAT); CGIAR Research Program on Climate Change, Agriculture and Food Security (CCAFS). Cali, Colombia.</li>
    </ul>
    <p>Citation of the <a href="/pattern_scaling/">MarkSim pattern scaled dataset</a> may be done as follows:</p>
    <ul>
        <li>Jones, P.G.; Thornton, P.K.; Heinke, J. 2009. <b>Generating Characteristic daily weather data using downscaled climate model data from the IPCC's Fourth Assessment Report</b>. CGIAR Research Program on Climate Change, Agriculture and Food Security (CCAFS); Waen Associates; International Livestock Research Institute (ILRI); Potsdam Institute for Climate Impact Research (PIK).</li>
    </ul>
    <p>Citation of the <a href="/statistical_downscaling_climgen/">Statistical Downscaled Climgen method dataset</a> may be done as follows:</p>
    <ul>
        <li>Mitchell, T.D. and Osborn, T.J., 2005. <b>ClimGen: a flexible tool for generating monthly climate data sets and scenarios</b>. Tyndall Centre for Climate Change Research Working Paper.</li>
    </ul>
    <p>Citation of the <a href="/dynamical_downscaling/">Dynamical Downscaling RCMs PRECIS</a> may be done as follows:</p>
    <ul>
        <li>Jones, R., M. Noguer, et al. (2004). <b>Generating high resolution climate change scenarios using PRECIS</b>. Exeter, UK, Met Office Hadley Centre.</li>
    </ul>

</div>
<?php echo $_smarty_tpl->getSubTemplate ('footer.tpl', $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>
<?php }} ?>