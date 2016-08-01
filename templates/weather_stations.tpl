{include file='head.tpl' jsIncludes=["jquery","station"] pageTitle="Weather stations- CCAFS Climate" pageDescription="Useful reading for understanding the CCAFS downscaled climate change projections." keywords="CCAFS,documentation,downscaling,climate change"}
{include file='header.tpl' current="data"}

<div id="subheader-image">
  <img src="{$smarty.const.SMARTY_IMG_URI}/header_ws_cinta.gif" />
</div>
<div id="content" class="documentation">
  <h3>Weather Stations</h3>
  <hr>
  <div>
	  <div id="loading" style=""><img style="" src="{$smarty.const.SMARTY_IMG_URI}/loading.gif" alt="Loader" /></div>
	  <iframe name="myFrame" id="myFrame" src="{$smarty.const.SMARTY_ROOT_URI}/stations/data-stations-test.php" width="836" height="650" frameBorder="0" scrolling="no" onload="document.getElementById('loading').style.display='none';"></iframe>
  </div>
  <p>
  <div>
    <p>
	The data distributed here are in text file format from weather stations data. CCAFS and its partners have developed this on live query and download interface to provide observational data for 
	CCAFS/CIAT/Partners related projects. Users are prohibited from any commercial, non-free resale, or redistribution without explicit written permission from CCAFS or the data-developing institutions. 
	Users should acknowledge CCAFS as the source used in the creation of any reports, publications, new data sets, derived products, or services resulting from the use of this data set. 
	For commercial access to the data, send requests to <a href="mailto:a.jarvis@cgiar.org">Andy Jarvis</a> at the International Center for Tropical Agriculture (CIAT).
    </p>
  </div>

  <div style="float:right;font-size:12px;padding-bottom:5px;margin-top:2px; height:10px">
    <i>Last updated: 16 April 2015</i>  		
  </div>   

</p>
</div>

{include file='footer.tpl'}