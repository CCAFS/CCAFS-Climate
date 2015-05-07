{include file='head.tpl' jsIncludes=["jquery","station"] pageTitle="Weather stations- CCAFS Climate" pageDescription="Useful reading for understanding the CCAFS downscaled climate change projections." keywords="CCAFS,documentation,downscaling,climate change"}
{include file='header.tpl' current="weather_stations"}
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
  <form id="stations-form" name="stations-form" class="pure-form pure-form-aligned">
    <fieldset>
      <div class="pure-control-group">
        <label for="state">Station</label>
        <select id="station" name="station" onchange="generateGraps()">
          {foreach from=$stations item=station}
            <option value='{$station['id']}'>{$station['name']}</option>
          {/foreach}
        </select>
      </div>
      <div class="pure-control-group">
        <label for="state">Period</label>
        <select id="period" name="period" onchange="generateGraps()">
          <option value='1'>Dayly</option>
          <option value='2'>Monthly</option>
          <option value='3'>Yearly</option>
        </select>
      </div>
      <div class="pure-controls">
{*        <button type="button" class="pure-button pure-button-primary" onclick="generateGraps()">Generate</button>*}
      </div>
    </fieldset>
  </form>
  <br>
{*  <h4>Graphics temperature</h4>*}
  <div id="temp">

  </div>
<br>
{*  <h4>Graphics precipitation</h4>*}
  <div id="prec">

  </div>
</div>
{include file='footer.tpl'}