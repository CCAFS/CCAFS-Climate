<?php /* Smarty version Smarty-3.1.11, created on 2012-10-05 09:47:18
         compiled from "/home/jramirezv/ccafs-climate.org/templates/dynamical_downscaling.tpl" */ ?>
<?php /*%%SmartyHeaderCode:1660982461506f0f1672a059-96118451%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '0790b887863e0b27025c9fd9989dbf3af7f70cda' => 
    array (
      0 => '/home/jramirezv/ccafs-climate.org/templates/dynamical_downscaling.tpl',
      1 => 1349187250,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '1660982461506f0f1672a059-96118451',
  'function' => 
  array (
  ),
  'has_nocache_code' => false,
  'version' => 'Smarty-3.1.11',
  'unifunc' => 'content_506f0f168a37e2_47739772',
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_506f0f168a37e2_47739772')) {function content_506f0f168a37e2_47739772($_smarty_tpl) {?><?php echo $_smarty_tpl->getSubTemplate ('head.tpl', $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array('pageTitle'=>"Dynamical Downscaling (PRECIS) - CCAFS Climate",'pageDescription'=>"Downscaled future climate data using MetOffice's PRECIS regional climate model.",'keywords'=>"PRECIS,regional climate model,future projections,IPCC,MetOffice"), 0);?>

<?php echo $_smarty_tpl->getSubTemplate ('header.tpl', $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array('current'=>"downscaling"), 0);?>

<div id="subheader-image">
    <img src="<?php echo @SMARTY_IMG_URI;?>
/ribbon_header_rcm.gif" />
</div>
<div id="content" class="downscaling_dynamical">
    <h3>Dynamical Downscaling (PRECIS)</h3>
    <hr>
    <br>
    <h4>Method Description</h4>
    <p>
        A regional climate model (RCM) is a high resolution climate model that covers a limited area of the globe, typically 5,000 km x 5,000 km, with a typical horizontal resolution of 50 km.
        RCMs are based on physical laws represented by mathematical equations that are solved using a three-dimensional grid. Hence RCMs are comprehensive physical models, usually including the atmosphere and land surface components of the climate system, and containing representations of the important processes within the climate system (e.g., cloud, radiation, rainfall, soil hydrology).
        Many of these physical processes take place on much smaller spatial scales than the model grid and cannot be modelled and resolved explicitly. Their effects are taken into account using parametrizations, by which the process is represented by relationships between the area or time averaged effect of such sub-grid scale processes and the large scale flow.
    </p>

    <p>
        The <b>PRECIS climate model</b> (stands for "Providing REgional Climates for Impacts Studies") is an atmospheric and land surface model of limited area and high resolution which is locatable over any part of the globe.
        Dynamical flow, the atmospheric sulphur cycle, clouds and precipitation, radiative processes, the land surface and the deep soil are all described. Boundary conditions are required at the limits of the model's domain to provide the meteorological forcing for the RCM.
        Information about all the climate elements as they evolve through being modified by the processes 22 Generating high resolution climate change scenarios using PRECIS represented in the model is produced.
        For a detailed description of the model, please see the <a href="http://precis.metoffice.com/docs/PRECIS_Handbook.pdf">PRECIS Handbook, Jones et al (2004)</a>.
    </p>

    <p>
        At the moment, we are making a dynamic dowscaling for South American Andes . The region is contained in a grid of 150 x 150 at resolution 50 km (Figure 1). Are in process runs as follows:
    </p>
    <table id="table-downs-sa">
        <tbody>
            <tr>
                <td>
                    <table>
                        <tbody>
                            <tr>
                                <td><b><i>GCM</i></b></td>
                                <td><b><i>Scenario</i></b></td>
                                <td><b><i>Period</i></b></td>
                            </tr>
                            <tr>
                                <td><i>HadCM3Q0</i></td>
                                <td><i>SRES A1B</i></td>
                                <td><i>1950 - 2100</i></td>
                            </tr>
                            <tr>
                                <td><i>HadCM3Q3</i></td>
                                <td><i>SRES A1B</i></td>
                                <td><i>1950 - 2100</i></td>
                            </tr>
                            <tr>
                                <td align="center"><i>HadCM3Q16</i></td>
                                <td align="center"><i>SRES A1B</i></td>
                                <td align="center"><i>1950 - 2100</i></td>
                            </tr>
                            <tr>
                                <td><i>ECHAM4</i></td>
                                <td><i>SRES A2</i></td>
                                <td><i>1989 - 2100</i></td>
                            </tr>
                            <tr>
                                <td><i>ECHAM4</i></td>
                                <td><i>SRES B2</i></td>
                                <td><i>2069 - 2100</i></td>
                            </tr>
                            <tr>
                                <td><i>ECHAM5</i></td>
                                <td><i>SRES A1B</i></td>
                                <td><i>1950 - 2100</i></td>
                            </tr>
                            <tr>
                                <td><i>HadAM3P</i></td>
                                <td><i>Baseline</i></td>
                                <td><i>1960 - 1990</i></td>
                            </tr>
                            <tr>
                                <td><i>HadAM3P</i></td>
                                <td><i>SRES A2</i></td>
                                <td><i>2070 - 2100</i></td>
                            </tr>
                            <tr>
                                <td><i>HadAM3P</i></td>
                                <td><i>SRES B2</i></td>
                                <td><i>2070 - 2100</i></td>
                            </tr>
                            <tr>
                                <td><i>ERA40</i></td>
                                <td><i>Reanalisys</i></td>
                                <td><i>1957 - 2000</i></td>
                            </tr>
                            <tr>
                                <td><i>NCEP:R2</i></td>
                                <td><i>Reanalisys</i></td>
                                <td><i>1979 - 2005</i></td>
                            </tr>
                            <tr>
                                <td><i>ERA-Interim</i></td>
                                <td><i>Reanalisys</i></td>
                                <td><i>1988 - 1997</i></td>
                            </tr>
                            <tr>
                                <td><i>ERA15</i></td>
                                <td><i>Reanalisys</i></td>
                                <td><i>1979 - 1993</i></td>
                            </tr>
                        </tbody>
                    </table>
                </td>
                <td>
                    <img name="andes_precis" src="<?php echo @SMARTY_IMG_URI;?>
/andes_precis.png">
                    <br>
                    <b>Figure 1</b>. Procesing Zone, Latin American Andes.
                </td>
            </tr>
        </tbody>
    </table>

    <br>
    <br>
    <div class="center">
        <a href="/data/">
            <img src="<?php echo @SMARTY_IMG_URI;?>
/download_data_button.png">
        </a>
    </div>
</div>

<?php echo $_smarty_tpl->getSubTemplate ('footer.tpl', $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>
<?php }} ?>