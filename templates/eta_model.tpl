{include file='head.tpl' jsIncludes=["jquery", "pattern_scaling"] pageTitle="Eta Model - CCAFS Climate" pageDescription="Downscaled future climate data using the MarkSim weather generator." keywords="MarkSim,weather typing,IPCC,climate projections,climate change"}
{include file='header.tpl' current="downscaling"}
<div id="subheader-image">
    <img src="{$smarty.const.SMARTY_IMG_URI}/ribbon_header_rcm.gif" /></div>
<div id="content" class="pattern_scaling">
    <h3>Dynamical Downscaling (Eta Model)</h3>
    <hr>
<br>

    <h4>Method Description</h4>

    <p>The Eta Model is a state-of-the-art atmospheric model used for research and operational purposes. The model is a descendent of the earlier HIBU (Hydrometeorological Institute and Belgrade University) model, developed in the seventies in the former Yugoslavia (the earliest reference being Mesinger and Janjic, 1974). In the eighties, the code has been upgraded to the Arakawa-style horizontal advection scheme of Janjic (1984), then rewritten to use the eta vertical coordinate (Mesinger et al. 1988), and subsequently, at NCEP, supplied with an advanced physics package (Janjic 1990, Mesinger and Lobocki 1991). It became officially operational at NCEP on 8 June 1993 (Black 1994). In its various versions, the model has been and/or is widely used in numerous countries, including Algeria, Argentina, Belgium, Brazil, Cameroon, China, Costa Rica, Cyprus, Czech Republic, Denmark, Egypt, Finland, Germany, Greece, Iceland, India, Israel, Italy, Malta, Tunisia, Turkey, Peru, Philippines, Serbia and Montenegro, South Africa, Spain, Sweden, and the United States (CPTEC, 2006).</p>
    <p>Major features of the Eta dynamical core are:&nbsp;<br />
      <br />
      - The eta vertical coordinate (Mesinger 1984), resulting in quasi-horizontal coordinate surfaces, and thus prevention of pressure-gradient force errors due to steep topography than can occur with terrain-following coordinates;&nbsp;<br />
      <br />
      - Forward-backward scheme for time differencing of the gravity-wave terms, modified so as to suppress separation of solutions on two C-subgrids of the model's E-grid (Mesinger 1974, Janjic, 1979);&nbsp;<br />
      <br />
      - The Arakawa approach in space differencing, with conservation of enstrophy and energy, as defined on the C-grid, in horizontal advection within the nondivergent barotropic part of the flow (Janjic 1984), thereby enforcing a strong constraint on the false systematic cascade of energy toward smaller scales;&nbsp;<br />
      <br />
      - Energy conservation in transformations between the potential and the kinetic energy in space differencing (Mesinger et al. 1988);&nbsp;<br />
      <br />
      - Option to run the model in a nonhydrostatic mode (Janjic et al. 2001);&nbsp;<br />
      <br />
      - Lateral boundary conditions are prescribed along a single outer line of grid points. All variables are prescribed at the inflow points; at the outflow points tangential velocity components are extrapolated from inside of the model domain, while other variables are prescribed. There is no boundary relaxation (Mesinger 1977).&nbsp;<br>
    </p>
  <ol>
    <h4>More information:</h4>
    <br><br>
    <ul>
        <li>            
            <a target="_blank" href="http://etamodel.cptec.inpe.br">
                http://etamodel.cptec.inpe.br/index.shtml<span class="little"></span></a>      </li>
        <li><a target="_blank" href="http://etamodel.cptec.inpe.br/~retamod/etadoc.pdf">Model equations and discretization<span class="little"></span></a></li>
        <li><a target="_blank" href="http://www.emc.ncep.noaa.gov/mmb/mmbpll/eta12tpb/">Model microphysics<span class="little"></span></a></li>
        <li><a target="_blank" href="ftp://ftp1.cptec.inpe.br/etamdl/Download/model/convection_essay_2008_rvsd_Mar_2011.pdf">An Essay on the Eta Cumulus Convection (BMJ) Scheme<span class="little"></span></a></li>
        <li><a target="_blank" href="http://etamodel.cptec.inpe.br/~retamod/mesinger_et_al_2012_MAP.pdf">An upgraded version of the Eta model<span class="little"></span></a></li>
        <li> <a target="_blank" href="http://etamodel.cptec.inpe.br/refer.shtml">References</a>
          <h4 style="color: red">&nbsp;</h4>
          <br>
        </li>
    </ul>
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
			<a href="http://etamodel.cptec.inpe.br">
				<img id="download_data_button" name="download_data_button" src="{$smarty.const.SMARTY_IMG_URI}/doc_button.png" />
			</a>
		</div>
	 </div>	
</div>

{include file='footer.tpl'}
