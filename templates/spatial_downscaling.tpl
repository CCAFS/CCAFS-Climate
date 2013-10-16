{include file='head.tpl' jsIncludes=['jquery', 'downscaling'] pageTitle="Spatial Downscaling Methods - CCAFS Climate" pageDescription="Statistically downscaled future climate projections from IPCC assessment reports." keywords="downscaling,projections,climate change,high resolution,IPCC,CCAFS"}
{include file='header.tpl' current="downscaling"}
<div id="subheader-image">
    <img src="{$smarty.const.SMARTY_IMG_URI}/ribbon_header_down.gif" />
</div>
<div id="content" class="downscaling">
    <h3>Spatial Downscaling Methods</h3>
    <hr>
    <br>
    <table id="methods">
        <tr>
            <td>
                <a href="/statistical_downscaling_delta/" >
                    <div id="section">
                        <img src="{$smarty.const.SMARTY_IMG_URI}/logo_delta_method.png" />
                    </div>
                </a>
            </td>
            <td>
                <a href="/pattern_scaling/" >
                    <div id="section">
                        <img src="{$smarty.const.SMARTY_IMG_URI}/logo_marksim.png" />
                    </div>
                </a>
            </td>
        </tr>
        <tr>
            <td>
                <a href="/statistical_downscaling_climgen/" >
                    <div id="section">
                        <img src="{$smarty.const.SMARTY_IMG_URI}/logo_climgen.png" />
                    </div>
                </a>
            </td>
            <td>
                <a href="/dynamical_downscaling/" >
                    <div id="section">
                        <img src="{$smarty.const.SMARTY_IMG_URI}/logo_dynamical_downscaling.png" />
                    </div>
                </a>
            </td>
        </tr>
    </table>
</div>

{include file='footer.tpl'}