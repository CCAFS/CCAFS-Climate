{include file='head.tpl' jsIncludes=['jquery'] pageTitle="Statistical Downscaling (Delta Method) - CCAFS Climate" pageDescription="Downscaled future climate data using the delta method." keywords="delta method,climate change,downscaling,high resolution,IPCC"}
{include file='header.tpl' current="downscaling"}
<div id="subheader-image">
    <img src="{$smarty.const.SMARTY_IMG_URI}/ribbon_header_stdown.gif" />
</div>
<div id="content" class="downscaling_delta">
    <h3>Statistical Downscaling (Delta Method) CMIP3 Data</h3>
    <hr>
    
    <p>
        <b>Method Description</b>
    </p>
    <p>
        Here we apply a downscaling method based on thin plate spline spatial interpolation of anomalies (deltas) of original GCM outputs.
        Anomalies are interpolated between GCM cell centroids and are then applied to a baseline climate given by a high resolution surface (<a target="_blank" href="http://worldclim.com/current"><i>WorldClim 1.4</i></a>; <a href="{$smarty.const.SMARTY_DOCS_URI}/worldclim_IJC.pdf">Hijmans et al., 2005</a>).
        The method makes the following gross assumptions:
    </p>
    <ol>
        <li>Changes in climates vary only over large distances (i.e. as large as GCM side cell size).</li>
        <li>Relationships between variables in the baseline ('current climates') are likely to be maintained towards the future.</li>
    </ol>
    <p>
        We acknowledge that these assumptions might not hold true in highly heterogeneous landscapes, where topography could cause considerable variations in anomalies (i.e. the Andes);
        however, the assumption is useful for relatively or very homogeneous areas such as the Sahara, the Amazon, and other global areas with homogeneous landscapes.
        The process consists in the following steps:
    </p>
    <ol>
        <li>Gathering of baseline data (current climates corresponding to WorldClim).</li>
        <li>Gathering of full GCM timeseries.</li>
        <li>Calculation of 30 year running averages for present day simulations (1961-1990) and 7 future periods.</li>
        <li>Calculation of anomalies as the absolute difference between future values in each of the 3 variables to be interpolated (minimum and maximum temperature, and total precipitation).</li>
        <li>Interpolation of these anomalies using centroids of GCM cells as points for interpolation.</li>
        <li>Addition of the interpolated surfaces to the current climates from WorldClim, using absolute sum for temperatures, and addition of relative changes for precipitation.</li>
        <li>Calculation of mean temperature as the average of maximum and minimum temperatures.</li>
    </ol>
    <p>
        WorldClim and full GCM timeseries are freely available in the internet, whilst all other calculations are carried out by means of Geographic Information Systems (GIS) software.
        Used formats are NetCDF (for GCM outputs), ESRI-GRID (for WorldClim and final downscaled data), and ESRI-ASCII grids for providing standard and easy-of-use outputs to potential users of the data.
    </p>

    <p>
        <i>For more info see the <a href="{$smarty.const.SMARTY_DOCS_URI}/Downscaling-WP-01.pdf">Downscaling Global Circulation Model Outputs: The Delta Method (PDF)</a> document</i>.
    </p>
    <table id="projections">
        <tbody>
            <tr>
                <td>
                    <img name="graph_down_precA1B" src="{$smarty.const.SMARTY_IMG_URI}/graph_down_precA1B.png" />
                    <img name="graph_down_tmeanA1B" src="{$smarty.const.SMARTY_IMG_URI}/graph_down_tmeanA1B.png" />
                </td>
            </tr>
        </tbody>
    </table>
    <br>
    <b>Figure 1</b>. Projections of future global average annual precipitation and temperature for A1B scenarios from donwscaled data.

    <p>
        <i>View all projections from spatial downscaled data, for <a href="{$smarty.const.SMARTY_DOCS_URI}/Disaggregation_Graphs_A1B.pdf">A1B</a>,
            <a href="{$smarty.const.SMARTY_DOCS_URI}/Disaggregation_Graphs_A2.pdf">A2A</a>,
            <a href="{$smarty.const.SMARTY_DOCS_URI}/Disaggregation_Graphs_B1.pdf">B1</a>
            scenarios
        </i>.
    </p>

    <p>
        <b>Emissions summaries</b>
    </p>

    <p>
        <b>A1</b>: Maximum energy requirements - emissions diferentiated dependent on fuel sources.
    </p>
    <ol>
        <li type="square"><b>A1Fl</b>: Fossil Intensive.</li>
        <li type="square"><b>A1T</b>: Technology development of non-fossil sources.</li>
        <li type="square"><b>A1B</b>: Balance across sources.</li>
    </ol>
    <b>B1</b>: Minimum energy requirements and emissions.
    <br><br>
    <b>A2</b>: High energy requirements - emissions less than A1Fl.
    <br><br>
    <b>B2</b>: Lower energy requirements - emissions greater than B1.
    <p></p>

    <p>
        If you need baseline data for this method see <a target="_blank" href="http://www.worldclim.org/current">WorldClim portal</a>.
    </p>
    <br>
	<div>
		<div class="center2">
			<a href="/data_spatial_downscaling/">
				<img id="download_data_button" name="download_data_button" src="{$smarty.const.SMARTY_IMG_URI}/download_data_button.png" />
			</a>
		</div>
		<div>
			<a href="{$smarty.const.SMARTY_DOCS_URI}/Downscaling-WP-01.pdf">
				<img id="download_data_button" name="download_data_button" src="{$smarty.const.SMARTY_IMG_URI}/doc_button.png" />
			</a>
		</div>
	 </div>


</div>

{include file='footer.tpl'}