<?php /* Smarty version Smarty-3.1.11, created on 2013-07-24 10:09:03
         compiled from "/home/jramirezv/ccafs-climate.org/templates/pattern_scaling.tpl" */ ?>
<?php /*%%SmartyHeaderCode:1178906976506e3825aba552-32455879%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '4ccc40ae8516f280c4a4ed7d569b6f5c1156ba38' => 
    array (
      0 => '/home/jramirezv/ccafs-climate.org/templates/pattern_scaling.tpl',
      1 => 1374685740,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '1178906976506e3825aba552-32455879',
  'function' => 
  array (
  ),
  'version' => 'Smarty-3.1.11',
  'unifunc' => 'content_506e3825c16ec5_37118754',
  'variables' => 
  array (
    'resources' => 0,
    'resource' => 0,
  ),
  'has_nocache_code' => false,
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_506e3825c16ec5_37118754')) {function content_506e3825c16ec5_37118754($_smarty_tpl) {?><?php echo $_smarty_tpl->getSubTemplate ('head.tpl', $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array('jsIncludes'=>array("jquery","pattern_scaling"),'pageTitle'=>"Pattern Scaling MarkSim - CCAFS Climate",'pageDescription'=>"Downscaled future climate data using the MarkSim weather generator.",'keywords'=>"MarkSim,weather typing,IPCC,climate projections,climate change"), 0);?>

<?php echo $_smarty_tpl->getSubTemplate ('header.tpl', $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array('current'=>"downscaling"), 0);?>

<div id="subheader-image">
    <img src="<?php echo @SMARTY_IMG_URI;?>
/ribbon_header_ptscalims.gif" />
</div>
<div id="content" class="pattern_scaling">
    <h3>Pattern Scaling with MarkSim Weather Generator</h3>
    <hr>
    <br>
    <ul id="sections">
        <li><i><a href="#future_climate_data">Future climate data</a></i></li>
        <li><i><a href="#marksim_standalone">Standalone application</a></i></li>
        <li class="last"><i><a target="_blank" href="http://gismap.ciat.cgiar.org/MarkSimGCM">Online web application</a></i></li>
    </ul>
    <br><br>

    <h4>Method Description</h4>

    <p>
        Two different outputs are provided in this section:
    </p>
    <ol>
        <li>A <a href="#marksim_standalone">daily weather generator</a> accompanied by data for generating future characteristic weather series.</li>
        <li><a href="/data/">Future climatological data</a> derived from the application of the daily weather generator in (1).</li>
    </ol>
    <p>
        The input GCM data for the weather generator was produced using polynomial regressions (<a target="_blank" href="https://hc.box.com/shared/f2gk053td8"><i>see the report</i></a>) over up to 10 timeslices and 6 IPCC Fourth Assessment Report Global Circulation Models.
        The weather generator can thus be used to generate data for any future year between 2020 and 2100, whereas the future climatological data is only available for two time slices (2030 and 2050), and was produced using the stochastic generation of daily weather data and are to some extent characteristic of future climatologies.
    </p>
    <p>
        This work was developed by the theme 4 of the CGIAR Research Program on Climate Change, Agriculture and Food Security (CCAFS). (<i>For more info about themes, visit <a target="_blank" href="http://www.ccafs.cgiar.org">CCAFS</a> portal</i>).
    </p>
    <h4 id="marksim_standalone">MarkSim standalone for DSSAT users</h4>
    <img src="<?php echo @SMARTY_IMG_URI;?>
/icon_new.png">
    <p>
        Marksim standalone combines the basic routines from the original MarkSim version, produced at CIAT and distributed on CD (Jones et.al., 2002, <a target="_blank" href="http://gisweb.ciat.cgiar.org/marksim/download/Theory.pdf"><i>see the theory section</i></a>), and the new <a target="_blank" href="http://gismap.ciat.cgiar.org/MarkSimGCM">MarkSimGCM web application</a> (Jones et al. 2011, <a target="_blank" href="https://hc.box.com/shared/f2gk053td8"><i>see the full report</i></a>) that runs off Google Earth.
        The standalone version is designed for computer users that need to process a large amount of data. It eliminates their picking at a keyboard and abusing their eyesight by searching an on-screen map for the required data point. It uses the same six GCM model results as MarkSimGCM and the same three scenarios, along with an ensemble of the six.
    </p>
    <p>
        It is designed to be used with <a target="_blank" href="http://dssat.net">DSSAT</a> and so it uses CLI files (existing, or constructed by the user) to create new CLI files and WTG files for the simulated weather data under a range of GCMs and scenarios. The EXE runs from the DOS prompt (or a system program call). It will read a directory, work out a list of the CLI files in that directory, and create subdirectories for each CLI file.
        In each of these it will place up to 99 replicates of yearly weather data and a new CLI file describing the climate under the particular situation of GCM/scenario/year for which the user called.
    </p>
    <p>
        The executable program, the GCM data and the MarkSim standalone documentation are available in the following links (you must allow pop-up windows in your browser):
    </p>
    <br>
    <h4>Documentation</h4>
    <ul>
        <li>
            <a target="_blank" href="/downloads/docs/MarkSim_Standalone_Documentation.pdf">
                MarkSim standalone for DSSAT users -
                <img id="download_pdf_button" title="Download the document" src="<?php echo @SMARTY_IMG_URI;?>
/icon-pdf.png" />
                <span class="little">(36 KB)</span>
            </a>
        </li>
        <li>
            <a target="_blank" href="/downloads/docs/introduction_to_cli_panes.pdf">
                Introduction to CLI panes -
                <img id="download_pdf_button" title="Download the document" src="<?php echo @SMARTY_IMG_URI;?>
/icon-pdf.png" />
                <span class="little">(7 KB)</span>
            </a>
        </li>
    </ul>

    <h4 style="color: red">Resources</h4>
    <form action="/form.php" method="POST">
        <ul style="list-style: none;">
            <?php  $_smarty_tpl->tpl_vars['resource'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['resource']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['resources']->value; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['resource']->key => $_smarty_tpl->tpl_vars['resource']->value){
$_smarty_tpl->tpl_vars['resource']->_loop = true;
?>
                <li>
                    <input type="checkbox" name="download-files[]" id="option_1" class="checkbox-resource" value="<?php echo $_smarty_tpl->tpl_vars['resource']->value->id;?>
" />
                    <?php echo $_smarty_tpl->tpl_vars['resource']->value->description;?>
 -
                    <img src="<?php echo $_smarty_tpl->tpl_vars['resource']->value->iconUrl;?>
">
                    <span class="little">(<?php echo $_smarty_tpl->tpl_vars['resource']->value->size;?>
)</span>
                </li>
            <?php } ?>
            <input type="hidden" name="file-type" value="resource" />
            <div id="button_down_resc">
                <button id="download-button" type="submit" disabled="disabled">Download resources</button>
            </div>
        </ul>
    </form>

    <h4 id="future_climate_data">Future climate data</h4>
    <p>
        This dataset was generated by a generalized downscaling and data generation method that takes the outputs of a General Circulation Model and allows. Such data can then be used to drive any impacts model that requires daily (or otherwise aggregated) weather data.
        A subset of the climate models and scenario runs carried out for 2007's Fourth Assessment Report of the Intergovernmental Panel on Climate Change (IPCC) for two time slices (2030 and 2050) was used in this process.
        Find the full list of models and scenarios, assessment of the methods used, comments on the limitations of the data, and suggestions for further work at the full report before proceeding to downloading and using the dataset.
    </p>

    <h4>Credits</h4>
    <ol>
        <li type="square">
            <i>Peter G Jones</i>.
            <br>
            Waen Associates, Y Waen, Islaw'r Dref, Dolgellau, Gwynedd LL40 1TS Wales.
        </li>
        <li type="square">
            <i>Philip K Thornton</i>.
            <br>
            International Livestock Research Institute (ILRI), PO Box 30709, Nairobi 00100, Kenya.
        </li>
        <li type="square">
            <i>Jens Heinke</i>.
            <br>
            Potsdam Institute for Climate Impact Research (PIK), PO Box 60 12 03, 14412 Potsdam, Germany.
        </li>
    </ol>
    <p>
        Find the full list of models and scenarios, assessment of the methods used, comments on the limitations of the data, and suggestions for further work at the <a target="_blank" href="https://hc.box.net/shared/f2gk053td8">full report</a> and <a target="_blank" href="https://hc.box.net/shared/xc38lnbznn">disclaimers</a>.
    </p>
    <p>
        This work was supported by:
    </p>
    <ol>
        <li type="square">International Center for Tropical Agriculture (CIAT).</li>
        <li type="square">International Livestock Research Institute (ILRI).</li>
        <li type="square">Potsdam Institute for Climate Impact Research (PIK).</li>
        <li type="square">International Food Policy Research Institute (IFPRI)</li>
        <li type="square">CGIAR Challenge Program on Climate Change, Agriculture and Food Security (CCAFS).</li>
        <li type="square">HarvestChoice.</li>
        <li type="square">Integrated Pest Management Collaborative Research Support Program (IPM-CRSP).</li>
    </ol>
    <br>
    <div id="data_support">
        <h4>Data Support:</h4>    
        <h5>Carlos Navarro</h5>
        <span><a href="mailto:c.e.navarro@cgiar.org">c.e.navarro@cgiar.org</a></span>
    </div>
    <div class="center">
        <a href="/data/">
            <img name="download_data_button" src="<?php echo @SMARTY_IMG_URI;?>
/download_data_button.png">
        </a>
    </div>
</div>

<?php echo $_smarty_tpl->getSubTemplate ('footer.tpl', $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>

<?php }} ?>