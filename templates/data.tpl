{include file='head.tpl' jsIncludes=['jquery', 'downscaling'] pageTitle="Data - CCAFS Climate" pageDescription="Statistically downscaled future climate projections from IPCC assessment reports." keywords="downscaling,projections,climate change,high resolution,IPCC,CCAFS"}
{include file='header.tpl' current="data"}
<div id="subheader-image">
    <img src="{$smarty.const.SMARTY_IMG_URI}/ribbon_header_data.gif" />
</div>
<div id="content" class="downscaling">
    <h3>Data</h3>
    <hr>
    <br>
    <table width="100%" id="methods">
        <tr>
            <td width="50%" align="center">
                <a href="/climatewizard/" >
                    <div id="section">
                        <img src="{$smarty.const.SMARTY_IMG_URI}/submenu-11.png" />                    </div>
				</a>            
		  </td>			
            <td width="50%" align="center">
				<a href="/data_bias_correction/" >
                    <div id="section">
                      <img src="{$smarty.const.SMARTY_IMG_URI}/submenu_m-09_v2-01.png" />                     </div>
				</a>
          
		  </td>


      </tr>
		

		
        <tr>
           <td width="50%" align="center">                
                <a href="/data_spatial_downscaling/" >
                    <div id="section">
                      <img src="{$smarty.const.SMARTY_IMG_URI}/submenu-10.png" />                    </div>
				</a>  
		  </td>		
            <td width="50%" align="center">
                <a href="/weather_stations/" >
                    <div id="section">
                        <img src="{$smarty.const.SMARTY_IMG_URI}/submenu-08_v2-01.png" />                    </div>
				</a>            
		  </td>
	  
        </tr>
  </table>
</div>

{include file='footer.tpl'}