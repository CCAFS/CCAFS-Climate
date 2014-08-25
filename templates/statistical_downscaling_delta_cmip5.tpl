{include file='head.tpl' jsIncludes=[] pageTitle="Statistical Downscaling (Delta Method) - CCAFS Climate" pageDescription="Downscaled future climate data using the delta method." keywords="delta method,climate change,downscaling,high resolution,IPCC"}
{include file='header.tpl' current="downscaling"}
<div id="subheader-image">
    <img src="{$smarty.const.SMARTY_IMG_URI}/ribbon_header_stdown.gif" />
</div>
<div id="content" class="downscaling_delta">
    <h3>Statistical Downscaling (Delta Method) CMIP5 Data</h3>
    <hr>
    <b>Method Description</b>

    <p>
        Here we apply a downscaling method based on thin plate spline spatial interpolation of anomalies (deltas) of original GCM outputs.
        Anomalies are interpolated between GCM cell centroids and are then applied to a baseline climate given by a high resolution surface (<a href="{$smarty.const.SMARTY_DOCS_URI}/worldclim_IJC.pdf">WorldClim; Hijmans et al., 2005</a>).
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
    
    
    
    <p><b>CMIP5 - Coupled Model Intercomparison Project Phase 5</b> </p>
    <p>CMIP5 promotes a standard set of model simulations in order to:</p>
    <ul>
      <li>Evaluate how realistic the models are in simulating the recent past,</li>
      <li>Provide projections of future climate change on two time scales, near term (out to about 2035) and long term (out to 2100 and beyond), and</li>
      <li>Understand some of the factors responsible for differences in model projections, including quantifying some key feedbacks such as those involving clouds and the carbon cycle</li>
  </ul>
    <p>
        <b>Representative Concentration Pathways (RCP)</b>    </p>
  <p>The RCP database aims at documenting the emissions, concentrations, and land-cover change projections of the so-called &quot;Representative Concentration Pathways&quot; (RCPs). The Representative Concentration Pathways are based on selected scenarios from four modeling teams/models (NIES/AIM, IIASA/MESSAGE, PNNL/MiniCAM, and PBL/IMAGE). The RCPs are meant to serve as input for climate and atmospheric chemistry modeling as part of the preparatory phase for the development of new scenarios for the IPCC's Fifth Assessment Report and beyond. Further documentation can be found in the&nbsp;<a href="http://www.aimes.ucar.edu/docs/IPCC.meetingreport.final.pdf">IPCC Expert Meeting Report on New Scenarios (Noordwijkerhout report)</a>&nbsp;and the&nbsp;<a href="http://www.aimes.ucar.edu/docs/RCP_handshake.pdf">&quot;Representative Concentration Pathways (RCPs) Draft Handshake&quot;</a>.</p>
  <table id="projections">
    <tbody>
      <tr>
        <td><img src="{$smarty.const.SMARTY_IMG_URI}/graph_rcp26_prec.PNG" name="graph_down_precA1B" id="graph_down_precA1B" /> <img src="{$smarty.const.SMARTY_IMG_URI}/graph_rcp26_tmean.PNG" name="graph_down_tmeanA1B" id="graph_down_tmeanA1B" /> </td>
      </tr>
    </tbody>
  </table>
  <b>Figure 1</b>. Projections of future global average annual precipitation and temperature for RCP 2.6  from donwscaled data.

  <p>
        <b>RCP 2.6:</b>
    The emission pathway is representative for scenarios in the literature leading to very low greenhouse gas concentration levels. It is a so-called &quot;peak&quot; scenario: represents a strong mitigation scenario and is extended by assuming constant emissions after 2100 (including net negative CO2 emissions), leading to CO2 concentrations returning to 360 ppm by 2300.</p>
    <p><b>RCP 4.5:</b>  It is a stabilization scenario where total radiative forcing is stabilized before 2100 by employment of a range of technologies and strategies for reducing greenhouse gas emissions.</p>
  <p><b>RCP 6.0:</b>
    It is a stabilization scenario where total radiative forcing is stabilized after 2100 without overshoot by employment of a range of technologies and strategies for reducing greenhouse gas emissions.</p>
<p><b>RCP 8.5:</b>
  It is characterized by increasing greenhouse gas emissions over time representative for scenarios in the literature leading to high greenhouse gas concentration levels. The underlying scenario drivers and resulting development path are based on the A2r scenario detailed in Riahi et al. (2007).  </p>

<p> <i>View all projections from spatial downscaled data, for <a href="{$smarty.const.SMARTY_DOCS_URI}/Graphs_RCP26.pdf">RCP 2.6</a>, <a href="{$smarty.const.SMARTY_DOCS_URI}/Graphs_RCP45.pdf">RCP 4.5</a>, <a href="{$smarty.const.SMARTY_DOCS_URI}/Graphs_RCP60.pdf">RCP 6.0</a>, <a href="{$smarty.const.SMARTY_DOCS_URI}/Graphs_RCP85.pdf">RCP 8.5</a> rcps</i>. </p>
    <ol>
    <h4>More information:</h4>
    <ul>
<li>            
            <a target="_blank" href="http://cmip-pcmdi.llnl.gov/cmip5/forcing.html">
                CMIP5 - Modeling Info - Forcing Data<span class="little"></span></a>      </li>
      <li> <a target="_blank" href="http://tntcat.iiasa.ac.at:8787/RcpDb/dsd?Action=htmlpage&amp;page=welcome"> RCP Database (version 2.0)<span class="little"></span></a></li>
      <li><a target="_blank" href="http://www.pik-potsdam.de/~mmalte/rcps/">RCP Concentration Calculations and Data 
Final Version<span class="little"></span></a></li>
      <li><a target="_blank" href="http://download.springer.com/static/pdf/609/art%253A10.1007%252Fs10584-011-0156-z.pdf?auth66=1408801006_c1012c109d79de6a52a9ad2f38d76b0f&ext=.pdf">The RCP greenhouse gas concentrations
and their extensions from 1765 to 2300<span class="little"></span></a>
        <h4 style="color: red">&nbsp;</h4>
        <br>
      </li>
    </ul> 
    </ol>
<div class="center">
        <a href="/data.php">
            <img width="224" height="75" border="0" id="download_data_button" name="download_data_button" src="{$smarty.const.SMARTY_IMG_URI}/download_data_button.png">
        </a>
    </div>



</div>

{include file='footer.tpl'}