{include file='head.tpl' jsIncludes=['jquery', 'downscaling'] pageTitle="Methods - CCAFS Climate" pageDescription="Statistically downscaled future climate projections from IPCC assessment reports." keywords="downscaling,projections,climate change,high resolution,IPCC,CCAFS"}
{include file='header.tpl' current="methods"}
<div id="subheader-image">
    <img src="{$smarty.const.SMARTY_IMG_URI}/header_methods.gif" />
</div>
<div id="content" class="downscaling">
    <h3>Methods</h3>
    <hr>
    <br>
    <table width="100%" id="methods">
        <tr>
            <td width="50%" align="center">
                <a href="/bias_correction/" >
                    <div id="section">
                        <img src="{$smarty.const.SMARTY_IMG_URI}/submenu_m-09_v2-01.png" />                    </div>
					</a>   
					
           
			</td>

           <td width="50%" align="center">   
                <a href="/downscaling/" >
                    <div id="section">
                      <img src="{$smarty.const.SMARTY_IMG_URI}/submenu-10.png" />                    </div>
				</a> 		   

		  </td>
      </tr>
		
        <tr>
            <td colspan="2" align="center">
 				<a href="/spatial_disaggregation/" >
                    <div id="section">
                      <img src="{$smarty.const.SMARTY_IMG_URI}/submenu-06.png" />                     
					 </div>
				</a>      
			</td>
        </tr>
  </table>
</div>

{include file='footer.tpl'}