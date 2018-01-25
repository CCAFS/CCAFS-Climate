{include file='head.tpl' jsIncludes=['jquery', 'dissagregation'] pageTitle="Bias Correction - CCAFS Climate" pageDescription="Spatially disaggregated future climate projections from all IPCC assessment reports." keywords="IPCC,disaggregated,climate change,CMIP,projections,high resolution"}
{include file='header.tpl' current="dissagregation"}
<div id="subheader-image">
    <img src="{$smarty.const.SMARTY_IMG_URI}/header_bc_cinta.gif" />
</div>
<div id="content" class="bias_correction">
    <h3>Bias-Correction </h3>
    <hr>
    <br>
    <h4>Method Description</h4>
    <p>
		Global Climate Models (GCMs) have been the primary source of information for constructing climate scenarios, and they provide the basis for climate change impacts assessments of climate change at all scales, from local to global. However, 
		impact studies rarely use GCM outputs directly because climate models exhibit systematic error (biases) due to the limited spatial resolution, simplified physics and thermodynamic processes, numerical schemes or incomplete knowledge 
		of climate system processes . Errors in GCM simulations relative to historical observations are large (<a href="http://iopscience.iop.org/article/10.1088/1748-9326/8/2/024018">Ramirez-Villegas et al. 2013</a>). Hence, it is important to bias-correct the raw climate model outputs in order to produce 
		climate projections that are better fit for agricultural modeling. 	
    </p>

    <p>
		Here we describe three different calibration approaches to produce reliable daily climate for future periods, employed in the new CCAFS Climate Bias Correction Section, as follows: 
    </p>
    <ol>
		<li><a href="#Bias_correction">Bias correction (or nudging)</a></li> 
		<li><a href="#Change_factor">Change factor</a></li> 
		<li><a href="#Quantile_Mapping">Quantile Mapping</a></li> 
    </ol>
    <p>
		In addition, briefly describe some <a href="#observational_datasets">observational datasets</a> relevant to agricultural modeling and employed as the historical observations for the calibration methods mentioned here.
    </p>
	<h4 id="Bias_correction">1. Bias Correction</h4>
    <p>
		The Bias Correction (BC) approach corrects the projected raw daily GCM output using the differences in the mean and variability between GCM and observations in a reference period (Figure 1).     
	</p>
	<div id="img_bc_big"> <img class="img_bc_big" border="0" name="bc_sq" src="{$smarty.const.SMARTY_IMG_URI}/cf_sq.jpg" />	</div>
	<p style="font-size: 14px;"><b>Figure 1</b>. Schematic of the bias correction methodology. BC uses raw model output for the future period, and corrects it using the differences (&Delta;) between historical reference data from the model and observations. 
	(O<sub>REF</sub> = observations in the historical reference period; T<sub>REF</sub> = GCM output from the historical reference period; T<sub>RAW</sub> = raw GCM output for the historical or future period; T<sub>BC</sub> = bias-corrected GCM output.)  </p>
	
	<p>If we assumed the variability as equal both for GCMs and observations, the daily data is simply shifted by the mean bias in the reference period (<a href="http://www.sciencedirect.com/science/article/pii/S0168192312001372">Hawkins et al., 2013</a>), thus:    </p>
	
	<div id="eq_bc">
		<table id="bc-eq">
			<tbody>
				<tr>
					<td>
						<img class="bc_img" border="0" name="bc_eq" src="{$smarty.const.SMARTY_IMG_URI}/bc_eq.jpg"/>
					</td>
					<td style="padding-top: 15px;padding-left: 20px;">
						<p><b>Eq. 1</b>
					</td>				
				</tr>
			</tbody>
		</table>
	</div>
	<p>However, it is possible to apply a more general form of this bias-correction method that corrects not only the mean values but also the temporal 
	variability of the model output in accordance with the observations (<a href="http://www.sciencedirect.com/science/article/pii/S0168192312001372">Hawkins et al., 2013; Ho et al., 2012</a>):</p>
	
		
	<div id="eq_bc">
		<table id="bc-eq">
			<tbody>
				<tr>
					<td>
						<img class="bc_img" border="0" name="bc_var_eq" src="{$smarty.const.SMARTY_IMG_URI}/bc_var_eq.jpg" />
					</td>
					<td style="padding-top: 15px;padding-left: 20px;">
						<p><b>Eq. 2</b>
					</td>				
				</tr>
			</tbody>
		</table>
	</div>	
	<p>
	where &sigma;<sub>T<sub>,</sub>REF</sub> and &sigma;<sub>o<sub>,</sub>REF</sub> represent the standard deviation in the reference period of the daily GCM output and observations, respectively. Note that this bias-correction procedure for the GCM output could be applied to correct both the historical and future periods.	
	</p>
	
	<h4 id="Change_factor">2. Change Factor</h4>
    <p>
		In the Change Factor (CF) approach the raw GCM outputs current values are subtracted from the future simulated values, resulting in &#8220;climate anomalies&#8221; which are then added to the present day observational dataset (<a href="http://onlinelibrary.wiley.com/doi/10.1890/09-0173.1/abstract">Tabor & Williams, 2010</a>).   
	</p>
	<div id="img_bc_big"> <img class="img_bc_big" border="0" name="cf_sq" src="{$smarty.const.SMARTY_IMG_URI}/bc_sq.jpg" />	</div>
	<p style="font-size: 14px;"><b>Figure 2</b>. 
		Schematic of the change factor methodology. CF uses present day observations, corrected using the differences (&Delta;) between present and future model data. (O<sub>REF</sub> = observations in the historical reference period; 
		T<sub>REF</sub> = GCM output from the historical reference period; T<sub>RAW</sub> = raw GCM output for the historical or future period; T<sub>BC</sub> = change factor-corrected GCM output.)	
	
	<p>When the daily variability is assumed of the same magnitude in the future and reference periods, the method is called &#8220;delta method&#8221;, and the corrected daily data is:</p>
	
	<div id="eq_bc">
		<table id="bc-eq">
			<tbody>
				<tr>
					<td>
						<img class="bc_img" border="0" name="cf_eq" src="{$smarty.const.SMARTY_IMG_URI}/cf_eq.jpg"/>
					</td>
					<td style="padding-top: 15px;padding-left: 20px;">
						<p><b>Eq. 3</b>
					</td>				
				</tr>
			</tbody>
		</table>
	</div>
	<p>But, the more general form considering changes in variance (<a href="http://journals.ametsoc.org/doi/abs/10.1175/2011BAMS3110.1">Ho et al., 2012</a>), is:</p>
		
	<div id="eq_bc">
		<table id="bc-eq">
			<tbody>
				<tr>
					<td>
						<img class="bc_img" border="0" name="cf_var_eq" src="{$smarty.const.SMARTY_IMG_URI}/cf_var_eq.png" />
					</td>
					<td style="padding-top: 15px;padding-left: 20px;">
						<p><b>Eq. 4</b>
					</td>				
				</tr>
			</tbody>
		</table>
	</div>	
	<p>
	where &sigma;<sub>T<sub>,</sub>RAW</sub> and &sigma;<sub>T<sub>,</sub>REF</sub> represent the standard deviation in the future period of the daily GCM output and observations, respectively. 
	</p>
	<h4 id="Quantile_Mapping">3. Quantile Mapping </h4>
	<p>
	The above-described methods work well for more non-stochastic variables (i.e. temperature). A more sophisticated approach for bias-correcting more stochastic variables (e.g. precipitation and solar radiation) is needed. This is because for example, GCM outputs are known to have a &quot;drizzle problem&quot;, that is, too many low-magnitude rain events as compared to observations (<a href="http://journals.ametsoc.org/doi/abs/10.1175/1520-0442(2003)016%3C3841%3ATSOOAS%3E2.0.CO%3B2">Gutowski et al., 2003</a>). Also, GCMs do not capture realistic interannual variability associated with events such as El Ni&#241;o and La Ni&#241;a. 
	</p>
	<p>
	In order to appropriately bias-correct GCM output for monthly totals and wet-day frequency, while ensuring realistic daily and interannual variability, we implemented the Quantile Mapping (QM) approach with the qmap library written for R statistical software (<a href="https://cran.r-project.org/web/packages/qmap/index.html">Gudmundsson, 2014</a>; <a href="http://www.hydrol-earth-syst-sci.net/16/3383/2012/">Gudmundsson et al., 2012</a>). The quantile mapping technique removes the systematic bias in the GCM simulations and has the benefit of accounting for GCM biases in all statistical moments, though, like all statistical downscaling approaches, it is assumed that biases relative to historical observations will be constant in the projection period (<a href="http://www.hydrol-earth-syst-sci.net/16/3309/2012/">Thrasher et al., 2012</a>).
	
	</p>
	
	<h4 id="observational_datasets">Observational Datasets </h4>
	<p>
	The methods described below must be applied to the historical observations to produce calibrated projections of future climate. Thus, we selected six widely used datasets that could be used to &quot;calibrate&quot; daily outputs of GCMs from the IPCC CMIP5. All datasets are bias-corrected versions of existing reanalysis datasets. A reanalysis involves reprocessing observational data spanning an extended historical period using a consistent analysis system, to produce a dataset that can be used for meteorological and climatological studies. In the Table 1 are described some characteristics of these datasets.	
	
	</p>

	<table class="obs_dataset_table" border="1" cellspacing="0" cellpadding="0" width="100%">
	  <tr>
		<td width="10%"><p><strong>Dataset</strong></p></td>
		<td width="32%"><p><strong>Based on</strong></p></td>
		<td width="18%"><p><strong>Period</strong></p></td>
		<td width="17%"><p><strong>Resolution</strong></p></td>
		<td width="21%"><p><strong>Main Reference</strong></p></td>
	  </tr>
	  <tr>
	  <tr>
		<td width="10%"><p>AgCFSR</p></td>
		<td width="32%"><p>The    Modern-Era Retrospective Analysis for Research and Applications (MERRA). </p></td>
		<td width="18%"><p>1980&#45;2010</p></td>
		<td width="17%"><p>0.25&#176; &#215 0.25&#176; </p></td>
		<td width="21%" ><p><a href="http://www.sciencedirect.com/science/article/pii/S0168192314002275">Ruane    et al. (2015)</a></p></td>
	  </tr>
	  <tr>
		<td width="10%"><p>AgMerra</p></td>
		<td width="32%"><p>The    Climate Forecast System Reanalysis (CFSR)</p></td>
		<td width="18%"><p>1980&#45;2010</p></td>
		<td width="17%"><p>0.25&#176; &#215 0.25&#176; </p></td>
		<td width="21%" ><p><a href="http://www.sciencedirect.com/science/article/pii/S0168192314002275">Ruane    et al. (2015)</a></p></td>
	  </tr>
	  <tr>
		<td width="10%"><p>GRASP</p></td>
		<td width="32%"><p>ERA-40<br />
		  JRA-25</p></td>
		<td width="18%"><p>1961&#45;2010</p></td>
		<td width="17%"><p>1.125&#176; &#215 1.125&#176; </p></td>
		<td width="21%" ><p><a href="http://onlinelibrary.wiley.com/doi/10.1002/2013JD020130/full">Iizumi et    al. (2014)</a></p></td>
	  </tr>
	  <tr>
		<td width="10%"><p>Princeton</p></td>
		<td width="32%"><p>Reanalysis-1</p></td>
		<td width="18%"><p>1948&#45;2008</p></td>
		<td width="17%"><p>0.25&#176; &#215 0.25&#176; </p></td>
		<td width="21%" ><p><a href="http://journals.ametsoc.org/doi/abs/10.1175/JCLI3790.1">Sheffield et    al. (2006)</a></p></td>
	  </tr>
	  <tr>
		<td width="10%"><p>WFD</p></td>
		<td width="32%"><p>ERA-40</p></td>
		<td width="18%"><p>1958&#45;2001</p></td>
		<td width="17%"><p>0.5&#176; &#215 0.5&#176; </p></td>
		<td width="21%" ><p><a href="http://journals.ametsoc.org/doi/abs/10.1175/2011JHM1369.1">Weedon et    al. (2011)</a></p></td>
	  </tr>
	  <tr>
		<td width="10%"><p>WFDEI</p></td>
		<td width="32%"><p>ERA-Interim </p></td>
		<td width="18%"><p>1979&#45;2009</p></td>
		<td width="17%"><p>0.5&#176; &#215 0.5&#176; </p></td>
		<td width="21%" ><p><a href="http://journals.ametsoc.org/doi/abs/10.1175/2011JHM1369.1">Weedon et    al. (2011)</a></p></td>
	  </tr>
	</table>

	<br>
	<div>
		<div class="center2">
			<a href="/data_bias_correction/">
				<img id="download_data_button" name="download_data_button" src="{$smarty.const.SMARTY_IMG_URI}/download_data_button.png" />
			</a>
		</div>
		<div>
			<a href="{$smarty.const.SMARTY_DOCS_URI}/BC_methods_explaining_v2.pdf">
				<img id="download_data_button" name="download_data_button" src="{$smarty.const.SMARTY_IMG_URI}/doc_button.png" />
			</a>
		</div>
	 </div>
</div>

{include file='footer.tpl'}
