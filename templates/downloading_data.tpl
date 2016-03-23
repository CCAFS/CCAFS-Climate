{include file='head.tpl' jsIncludes=['jquery', 'downscaling'] pageTitle="Spatial Downscaling Methods - CCAFS Climate" pageDescription="Statistically downscaled future climate projections from IPCC assessment reports." keywords="downscaling,projections,climate change,high resolution,IPCC,CCAFS"}
{include file='header.tpl' current="data"}
<div id="subheader-image">
    <img src="{$smarty.const.SMARTY_IMG_URI}/ribbon_down_data.gif" />
</div>
<div id="content" class="downscaling">
    <h3>Downloading data</h3>
    <hr>
    <br>
    <table width="100%" id="methods">
        <tr>
            <td width="50%" align="center">
                <a href="/data/" >
                    <div id="section">
                      <img src="{$smarty.const.SMARTY_IMG_URI}/1_data-01.png" />                    </div>
          </a>            </td>

            <td width="50%" align="center">                
            <a href="/data_bias_corrected/" >
                    <div id="section">
                      <img src="{$smarty.const.SMARTY_IMG_URI}/1_data-bc-03.png" />                     </div>
          </a></td>
      </tr>
		

		
        <tr>
            <td colspan="2" align="center">
                <a href="/weather_stations/" >
                    <div id="section">
                        <img src="{$smarty.const.SMARTY_IMG_URI}/1_data-stations-02.png" />                    </div>
          </a>            </td>
        </tr>
  </table>
</div>

{include file='footer.tpl'}