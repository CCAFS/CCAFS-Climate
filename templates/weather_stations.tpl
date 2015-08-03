{include file='head.tpl' jsIncludes=["jquery","station"] pageTitle="Weather stations- CCAFS Climate" pageDescription="Useful reading for understanding the CCAFS downscaled climate change projections." keywords="CCAFS,documentation,downscaling,climate change"}
{include file='header.tpl' current="data"}

<div id="subheader-image">
  <img src="{$smarty.const.SMARTY_IMG_URI}/ribbon_header_stations.gif" />
</div>
<div id="content" class="documentation">
  <h3>Weather Stations</h3>
  <hr>
  <iframe src="{$smarty.const.SMARTY_ROOT_URI}/stations/data-stations.php" width="836" height="650" frameBorder="0" scrolling="no" ></iframe>
</div>
{include file='footer.tpl'}