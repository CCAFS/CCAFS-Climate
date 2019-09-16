{include file='head.tpl' jsIncludes=["jquery", "cimatewizard", "tiptip","modernizr","icheck", "map"] pageTitle="Data - CCAFS Climate" pageDescription="High resolution climate change data for download, downscaled using different methods." keywords="IPCC,data,download,downscaling,high resolution,delta method,climate change,projections,MarkSim,MetOffice,PRECIS"}
{include file='header.tpl' current="cimatewizard"}

<div id="subheader-image">
  <img src="{$smarty.const.SMARTY_IMG_URI}/ribbon_header_cw.fw.gif" />
</div>
<div id="content" class="documentation">
  <h3>Climate Wizard</h3>
  <hr>
  <div>
	  <div id="loading" style=""><img style="" src="{$smarty.const.SMARTY_IMG_URI}/loading.gif" alt="Loader" /></div>
	  <iframe name="myFrame" id="myFrame" src="https://climatewizard.ciat.cgiar.org/index_ar5_25km_test.html" width="936" height="1380" frameBorder="0" scrolling="no" onload="document.getElementById('loading').style.display='none';"></iframe>
  </div>
  <p>
  <div>
    <p>
	The data distributed here are in text file format from weather stations data. CCAFS and its partners have developed this on live query and download interface to provide observational data for 
	CCAFS/CIAT/Partners related projects. Users are prohibited from any commercial, non-free resale, or redistribution without explicit written permission from CCAFS or the data-developing institutions. 
	Users should acknowledge CCAFS as the source used in the creation of any reports, publications, new data sets, derived products, or services resulting from the use of this data set. 
	For commercial access to the data, send requests to <a href="mailto:a.jarvis@cgiar.org">Andy Jarvis</a> at the International Center for Tropical Agriculture (CIAT).
    </p>
	  <div style="float:right;font-size:12px;padding-bottom:5px; height:10px">
		<i>Last updated: 8 August 2016</i>  		
	  </div> 	
  </div>

  
<br>
</p>
</div>

{include file='footer.tpl'}