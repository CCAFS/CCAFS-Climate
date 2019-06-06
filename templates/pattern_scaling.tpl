{include file='head.tpl' jsIncludes=["jquery", "pattern_scaling"] pageTitle="Pattern Scaling MarkSim - CCAFS Climate" pageDescription="Downscaled future climate data using the MarkSim weather generator." keywords="MarkSim,weather typing,IPCC,climate projections,climate change"}
{include file='header.tpl' current="downscaling"}
<div id="subheader-image">
    <img src="{$smarty.const.SMARTY_IMG_URI}/ribbon_header_ptscalims_v2.gif" />
</div>
<div id="content" class="pattern_scaling">
    <h3>Weather Simulation with MarkSim</h3>
    <hr>
    <br><br>

    <h4>Method Description</h4>

    <p>
        Three different outputs are provided in this section:
    </p>
    <ol>
        <li><a href="#marksim_standalone">MarkSim standalone for DSSAT users</a>: A daily weather generator accompanied by data for generating future characteristic weather series.</li>
        <li><a href="#future_climate_data">Pattern Scaling (MarkSim) Data</a>: Future climatological data derived from the application of the daily weather generator.</li>
        <li><a href="#standard_version">MarkSim Standard Version</a>: The first version of MarkSim software and User Reference Manual.</li>
        <li><a href="#web_version">MarkSimGCM web application</a>: MarkSim application that runs off Google Earth.</li>
    </ol>
    <p>
        This work was developed by the theme 4 of the CGIAR Research Program on Climate Change, Agriculture and Food Security (CCAFS). (<i>For more info about themes, visit <a target="_blank" href="http://www.ccafs.cgiar.org">CCAFS</a> portal</i>), and was supported by:
    </p> 
    <ul>
      <li>International Center for Tropical Agriculture (CIAT).</li>
      <li>International Livestock Research Institute (ILRI).</li>
      <li>Potsdam Institute for Climate Impact Research (PIK).</li>
      <li>International Food Policy Research Institute (IFPRI)</li>
      <li>HarvestChoice.</li>
      <li>Integrated Pest Management Collaborative Research Support Program (IPM-CRSP).</li>
    </ul>
    <ol><li><h4 id="marksim_standalone">MarkSim standalone for DSSAT users</h4></li>
    <p>                Marksim standalone combines the basic routines from the original MarkSim version, produced at CIAT (<a href="#standard_version">see below</a>), and the new <a href="#web_version">MarkSimGCM web application</a> (Jones et al. 2011) that runs off Google Earth. 
        The standalone version is designed for computer users that need to process a large amount of data. It eliminates their picking at a keyboard and abusing their eyesight by searching an on-screen map for the required data point. It uses the same six GCM model results as MarkSimGCM and the same three scenarios, along with an ensemble of the six.
    </p>
    <p>
        It is designed to be used with <a target="_blank" href="http://dssat.net">DSSAT</a> and so it uses CLI files (existing, or constructed by the user) to create new CLI files and WTG files for the simulated weather data under a range of GCMs and scenarios. The EXE runs from the DOS prompt (or a system program call). It will read a directory, work out a list of the CLI files in that directory, and create subdirectories for each CLI file.
        In each of these it will place up to 99 replicates of yearly weather data and a new CLI file describing the climate under the particular situation of GCM/scenario/year for which the user called.
    </p>
    <p>
        A new version of MarkSim standalone (v. 2) was developed for the CMIP5 GCMs. The original MarkSim_Standalone used six GCMs from the fourth approximation of the IPCC(<a target="_blank" href="http://www.ipcc.ch/pdf/assessment-report/ar4/wg1/ar4_wg1_full_report.pdf"><i>see the full report</i></a>), the new one use 17 models from the CMIP5 range that were considered in the last IPCC report.
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
                <img id="download_pdf_button" title="Download the document" src="{$smarty.const.SMARTY_IMG_URI}/icon-pdf.png" />
                <span class="little">(36 KB)</span>                
            </a>
        </li>
        <li>
            <a target="_blank" href="/downloads/docs/MarkSim_Standalone_Documentation_v2.pdf">
                MarkSim standalone V2 for DSSAT users -
                <img id="download_pdf_button" title="Download the document" src="{$smarty.const.SMARTY_IMG_URI}/icon-pdf.png" />                
                <span class="little">(355 KB)</span>
                - <img class="new_item" title="New" src="{$smarty.const.SMARTY_IMG_URI}/icon_new.png" />
            </a>
        </li>
        <li>
            <a target="_blank" href="/downloads/docs/introduction_to_cli_panes.pdf">
                Introduction to CLI panes -
                <img id="download_pdf_button" title="Download the document" src="{$smarty.const.SMARTY_IMG_URI}/icon-pdf.png" />
                <span class="little">(7 KB)</span>
            </a>
        </li>
        <li>
            <a target="_blank" href="/downloads/docs/release_of_MarkSim_base_data_from_WorldClim_2.pdf">
                Release of MarkSim base data from WorldClim 2 -
                <img id="download_pdf_button" title="Download the document" src="{$smarty.const.SMARTY_IMG_URI}/icon-pdf.png" />
                <span class="little">(1239 KB)</span>
				- <img class="new_item" title="New" src="{$smarty.const.SMARTY_IMG_URI}/icon_new.png" />
            </a>
        </li>		
    </ul>

{*    <h4 style="color: red">Resources</h4>*}
    <form action="/form.php" method="POST">
      {foreach from=$resources item=resourceA key=keyr}
        <br>
        <h4>{$keyr}</h4>
        <ul style="list-style: none;">          
            {foreach from=$resourceA item=resource}
                <li>
                    <input type="checkbox" name="download-files[]" id="tile-{$resource->id}" class="checkbox-resource" value="{$resource->id}" />
                    {$resource->description} -
                    <img src="{$resource->iconUrl}">
                    <span class="little">({$resource->size})</span>
                    {if $resource->isNew == true}
                    - <img class="new_item" title="New" src="{$smarty.const.SMARTY_IMG_URI}/icon_new.png" />
                    {/if}
                </li>
            {/foreach}
          
        </ul>
        {/foreach}
			<input type="hidden" id="tile_name" name="tile_name" />
            <input type="hidden" name="file-type" value="resource" />
			<br>
			<ul style="">      
			<div id="map_canvas" style="display: none; width:610px; height:300px;"></div>
			</ul>
            <div id="button_down_resc">
                <button id="download-button" type="submit" disabled="disabled">Download resources</button>
            </div>
    </form>


	
    <br>
    <li><h4 id="future_climate_data">Pattern Scaling (MarkSim) Data</h4></li>
    <p>
        This dataset was generated by a generalized downscaling and data generation method that takes the outputs of a General Circulation Model and allows. Such data can then be used to drive any impacts model that requires daily (or otherwise aggregated) weather data.
        A subset of the climate models and scenario runs carried out for 2007's Fourth Assessment Report of the Intergovernmental Panel on Climate Change (IPCC) for two time slices (2030 and 2050) was used in this process.
        Find the full list of models and scenarios, assessment of the methods used, comments on the limitations of the data, and suggestions for further work at the full report before proceeding to downloading and using the dataset.
    </p>
    <p>
      Find the full list of models and scenarios, assessment of the methods used, comments on the limitations of the data, and suggestions for further work at the <a target="_blank" href="http://ccafs-climate.org/downloads/docs/MarkSim_Standalone_Documentation_v2.pdf"><i>full report</i></a> and disclaimers. To download see the <a href="http://www.ccafs-climate.org/data/">Data Section</a>.
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
    <br>
    <li><h4 id="standard_version">MarkSim standard version</h4></li>
    <p>
      MarkSim is a Windows application that will be installed from the .iso image (Jones et.al., 2002, <a href="{$smarty.const.SMARTY_DOCS_URI}/MarkSim-manual.pdf">see the User Reference Manual</a>) and registered automatically. MarkSim is a daily weather generator based on a third order Markov model for rainfall that is especially adapted to the tropics. It works from a set of interpolated climate surfaces to fit a Markov model to the estimated climate data. It uses a third order model with a special stochastic resampling of the model parameters to realistically simulate the rainfall and temperature variances for almost anywhere in the tropics. To see how it does this, consult the <a href="http://gisweb.ciat.cgiar.org/marksim/download/Theory.pdf">theory section</a>.
    </p>
    <p>
      For further information visit <a href="http://gisweb.ciat.cgiar.org/marksim">MarkSim CIAT product site</a>. 
    </p>
    <h4>Resources</h4>
    <form action="/form.php" method="POST">
        <ul style="list-style: none;">
            {foreach from=$resourcesMarksim item=resource}
                <li>
                    <input type="checkbox" name="download-files[]" id="option_1" class="checkbox-resourceR" value="{$resource->id}" />
                    {$resource->description} -
                    <img src="{$resource->iconUrl}">
                    <span class="little">({$resource->size})</span>
                    {if $resource->isNew == true}
                    - <img class="new_item" title="New" src="{$smarty.const.SMARTY_IMG_URI}/icon_new.png" />
                    {/if}
                </li>
            {/foreach}
            <input type="hidden" name="file-type" value="resource" />
            <div id="button_down_resc">
                <button id="download-buttonR" type="submit" disabled="disabled">Download resources</button>
            </div>
        </ul>
    </form>
    <br>
    <li><h4 id="web_version">MarkSimGCM web application</h4></li>
    <p>
      The <a href="http://gisweb.ciat.cgiar.org/MarkSimGCM/" target="_blank">MarkSimGCM web application</a> uses the well-known MarkSim application (<a href="http://dx.doi.org/10.2134/agronj2000.923445x">Jones & Thornton 2000</a>, <a href="{$smarty.const.SMARTY_DOCS_URI}/MarkSim-manual.pdf">Jones et al 2002</a>) working off a 30 arc-second climate surface derived from WorldClim (Hijmans et al 2005). Point and click on the map and up to 99 WTG files are prepared ready for use with <a href="http://icasa.net/dssat/index.html">DSSAT ®</a>. 
      Download and unpack to a directory on your machine and they are ready for use with the DSSAT4 crop modelling system (<a href="http://www.abe.ufl.edu/Faculty/jjones/ABE_5646/Xtra files/The DSSAT Cropping System Model.pdf">Jones et al 2003</a>).
    </p>
    </ol>    
    <br>
    <div id="data_support">
        <h4>Data Support:</h4>    
        <h5>Carlos Navarro</h5>
        <span><a href="mailto:c.e.navarro@cgiar.org">c.e.navarro@cgiar.org</a></span>
    </div>
	<div>
		<div class="center2">
			<a href="/data_spatial_downscaling/">
				<img id="download_data_button" name="download_data_button" src="{$smarty.const.SMARTY_IMG_URI}/download_data_button.png" />
			</a>
		</div>
		<div>
			<a href="{$smarty.const.SMARTY_DOCS_URI}/MarkSim_Standalone_Documentation_v2.pdf">
				<img id="download_data_button" name="download_data_button" src="{$smarty.const.SMARTY_IMG_URI}/doc_button.png" />
			</a>
		</div>
	 </div>	
</div>

{include file='footer.tpl'}
