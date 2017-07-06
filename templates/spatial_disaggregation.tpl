{include file='head.tpl' jsIncludes=['jquery', 'dissagregation'] pageTitle="Spatial Disaggregation - CCAFS Climate" pageDescription="Spatially disaggregated future climate projections from all IPCC assessment reports." keywords="IPCC,disaggregated,climate change,CMIP,projections,high resolution"}
{include file='header.tpl' current="dissagregation"}
<div id="subheader-image">
    <img src="{$smarty.const.SMARTY_IMG_URI}/ribbon_header_spdis.gif" />
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
        <li>Gathering of baseline data (current climates corresponding to <a target="_blank" href="http://worldclim.com/current"><i>WorldClim 1.4</i></a>).</li>
        <li>Gathering of full GCM timeseries.</li>
        <li>Calculation of 30 year running averages for present day simulations (1961-1990) and 7 future periods (2010-2039, 2020-2049, 2030-2059, 2040-2069, 2050-2079, 2060-2089, 2070-2099).</li>
        <li>Calculation of anomalies as the absolute difference between future values in each of the 3 variables to be disaggregated.</li>
        <li>Addition of anomalies surfaces to the current climates from WorldClim, using absolute sum for temperatures, and addition of relative changes for precipitation.</li>
        <li>Calculation of mean temperature as the average of maximum and minimum temperatures.</li>
    </ol>
    <p>
        <i>For more info see the <a href="{$smarty.const.SMARTY_DOCS_URI}/Disaggregation-WP-02.pdf">Disaggregation of Global Circulation Model Outputs (PDF)</a> document</i>.
    </p>
    <table id="circulation-model">
        <tbody>
            <tr>
                <td>
                    <img border="0" name="graph_diss_precA1B" src="{$smarty.const.SMARTY_IMG_URI}/graph_diss_precA1B.png" />
                    <img border="0" name="graph_diss_tmeanA1B" src="{$smarty.const.SMARTY_IMG_URI}/graph_diss_tmeanA1B.png" />
                </td>
            </tr>
        </tbody>
    </table>
    <br>
    <b>Figure 1</b>. Projections of future global average annual precipitation and temperature for A1B scenarios from disaggregated data.
    <p>
        <i>View all projections from spatial disaggregated data, for <a href="{$smarty.const.SMARTY_DOCS_URI}/Disaggregation_Graphs_A1B.pdf">A1B</a>, <a href="{$smarty.const.SMARTY_DOCS_URI}/Disaggregation_Graphs_A2.pdf">A2A</a>, <a href="{$smarty.const.SMARTY_DOCS_URI}/Disaggregation_Graphs_B1.pdf">B1</a> scenarios</i>.
    </p>
    <p>
        If you need baseline data for this method see <a target="_blank" href="http://www.worldclim.org/current">WorldClim 1.4 portal</a>.
    </p>
    <br>
	<div>
		<div class="center2">
			<a href="/data_spatial_downscaling/">
				<img id="download_data_button" name="download_data_button" src="{$smarty.const.SMARTY_IMG_URI}/download_data_button.png" />
			</a>
		</div>
		<div>
			<a href="{$smarty.const.SMARTY_DOCS_URI}/Disaggregation-WP-02.pdf">
				<img id="download_data_button" name="download_data_button" src="{$smarty.const.SMARTY_IMG_URI}/doc_button.png" />
			</a>
		</div>
	 </div>	
	
</div>

{include file='footer.tpl'}