{include file='head.tpl' jsIncludes=["jquery","station"] pageTitle="Weather stations- CCAFS Climate" pageDescription="Useful reading for understanding the CCAFS downscaled climate change projections." keywords="CCAFS,documentation,downscaling,climate change"}
{include file='header.tpl' current="data"}
<link rel="stylesheet" href="http://yui.yahooapis.com/pure/0.6.0/pure-min.css">
{*<script src="http://code.highcharts.com/highcharts.js"></script>*}
<script src="http://code.highcharts.com/stock/highstock.js"></script>
<script src="http://code.highcharts.com/stock/modules/exporting.js"></script>
<div id="subheader-image">
  <img src="{$smarty.const.SMARTY_IMG_URI}/ribbon_header_docs.gif" />
</div>
<div id="content" class="documentation">
  <h3>Weather Stations</h3>
  <hr>
  <iframe src="http://172.22.52.48/CIAT/test/map/tree.php" width="836" height="720"></iframe>
</div>
{include file='footer.tpl'}