{include file='head.tpl' jsIncludes=["jquery", "data", "tiptip"] pageTitle="Data - CCAFS Climate" pageDescription="High resolution climate change data for download, downscaled using different methods." keywords="IPCC,data,download,downscaling,high resolution,delta method,climate change,projections,MarkSim,MetOffice,PRECIS"}
{include file='header.tpl' current="data"}
<div id="subheader-image">
    <img src="{$smarty.const.SMARTY_IMG_URI}/ribbon_header_data.gif" />
</div>
<div id="content" class="data">
    <h3>Data</h3>
    <hr>
    <br>
    
    <span style="background-color: rgb(255, 162, 162); padding: 6px; margin-bottom: 22px; display: block;">Due to some technical problems, the data is temporally unavailable. Please come back in a couple of hours.</span>

    <div class="center">
        <img id="download_data_button" name="download_data_button" src="{$smarty.const.SMARTY_IMG_URI}/download_data_button.png">
    </div>
    <div id="search_form">
        <form method="GET" action="/file-list.php" id="formSearch">
            <table id="table_fields" class="table_form" style="display:none">
                <tbody>
                    <tr>
                        <!-- Method -->
                        <td class="option-name">
                            1. Method:
                        </td>
                        <td>
                            <select id="id_method" name="method" class="options">
                                <option selected="selected" value="">Select all</option>
                                {foreach from=$methods item=method}
                                    <option value='{$method["id"]}'>{$method["name"]}</option>
                                {/foreach}
                            </select>
                        </td>
                        <td>
                            <img class="help_icon" id="help_icon_method" src="{$smarty.const.SMARTY_IMG_URI}/help_icon.png" />
                            <img class="loader" src="{$smarty.const.SMARTY_IMG_URI}/ajax-loader.gif" />
                        </td>

                        <!-- Variable -->
                        <td class="option-name">
                            5. Variable:
                        </td>
                        <td>
                            <select id="id_variable" name="variable" class="options" >
                                <option value="" selected="selected">Select all</option>
                                {foreach from=$variables item=variable}
                                    <option value='{$variable["id"]}'>{$variable["name"]}</option>
                                {/foreach}
                            </select>
                        </td>
                        <td>
                            <img class="help_icon" id="help_icon_variable" src="{$smarty.const.SMARTY_IMG_URI}/help_icon.png" />
                            <img class="loader" src="{$smarty.const.SMARTY_IMG_URI}/ajax-loader.gif" />
                        </td>
                    </tr>
                    <tr>
                        <!-- Scenario -->
                        <td class="option-name">
                            2. Scenario:
                        </td>
                        <td>
                            <select id="id_scenario" name="scenario" class="options" >
                                <option value="" selected="selected">Select all</option>
                                {foreach from=$scenarios item=scenario}
                                    <option value='{$scenario["id"]}'>{$scenario["name"]}</option>
                                {/foreach}
                            </select>
                        </td>
                        <td>
                            <img class="help_icon" id="help_icon_scenario" src="{$smarty.const.SMARTY_IMG_URI}/help_icon.png" />
                            <img class="loader" src="{$smarty.const.SMARTY_IMG_URI}/ajax-loader.gif" />
                        </td>
                        <!-- Resolution -->
                        <td class="option-name">
                            6. Resolution:
                        </td>
                        <td>
                            <select id="id_resolution" name="resolution" class="options" >
                                <option value="" selected="selected">Select all</option>
                                {foreach from=$resolutions item=resolution}
                                    <option value='{$resolution["id"]}'>{$resolution["name"]}</option>
                                {/foreach}
                            </select>
                        </td>
                        <td>
                            <img class="help_icon" id="help_icon_resolution" src="{$smarty.const.SMARTY_IMG_URI}/help_icon.png" />
                            <img class="loader" src="{$smarty.const.SMARTY_IMG_URI}/ajax-loader.gif" />
                        </td>
                    </tr>
                    <tr>
                        <!-- Model -->
                        <td class="option-name">
                            3. Model:
                        </td>
                        <td>
                            <select id="id_model" name="model" class="options" >
                                <option value="" selected="selected">Select all</option>
                                {foreach from=$models item=model}
                                    <option value='{$model["id"]}'>{$model["acronym"]}</option>
                                {/foreach}
                            </select>
                        </td>
                        <td>
                            <img class="help_icon" id="help_icon_model" src="{$smarty.const.SMARTY_IMG_URI}/help_icon.png" />
                            <img class="loader" src="{$smarty.const.SMARTY_IMG_URI}/ajax-loader.gif" />
                        </td>
                        <!-- File Format -->
                        <td class="option-name">
                            7. File format:
                        </td>
                        <td>
                            <select id="id_format" name="format" class="options" >
                                <option value="" selected="selected">Select all</option>
                                {foreach from=$formats item=format}
                                    <option value='{$format["id"]}'>{$format["name"]}</option>
                                {/foreach}
                            </select>
                        </td>
                        <td>
                            <img class="help_icon" id="help_icon_format" src="{$smarty.const.SMARTY_IMG_URI}/help_icon.png" />
                            <img class="loader" src="{$smarty.const.SMARTY_IMG_URI}/ajax-loader.gif" />
                        </td>
                    </tr>
                    <tr>
                        <!-- Period -->
                        <td class="option-name">
                            4. Period:
                        </td>
                        <td>
                            <select id="id_period" name="period" class="options" >
                                <option value="" selected="selected">Select all</option>
                                {foreach from=$periods item=period}
                                    <option value='{$period["id"]}'>{$period["name"]}</option>
                                {/foreach}
                            </select>
                        </td>
                        <td>
                            <img class="help_icon" id="help_icon_period" src="{$smarty.const.SMARTY_IMG_URI}/help_icon.png" />
                            <img class="loader" src="{$smarty.const.SMARTY_IMG_URI}/ajax-loader.gif" />
                        </td>
                        <!-- Tile -->
                        <td class="option-name">
                            <!-- 8. Tile: -->
                        </td>
                        <td>
                            <!-- div id="link_image">
                                <select id="id_tile" name="tile" class="options" >
                                    <option value="">No tile</option>
                                </select>
                            </div -->
                        </td>
                        <td>
                            <!-- img class="help_icon" id="help_icon_tile" src="{$smarty.const.SMARTY_IMG_URI}/help_icon.png" />
                            <img class="loader" src="{$smarty.const.SMARTY_IMG_URI}/ajax-loader.gif" /-->
                        </td>
                    </tr>
                </tbody>
            </table>
            <br>
            <button type="submit" id="searchSubmit" disabled="disabled">Search</button>
            <span id="file-count" style="font-size: 12px;"></span>
        </form>
    </div>

    <p>
        The data distributed here are in ARC GRID, and ARC ASCII format, in decimal degrees and datum WGS84. CCAFS and its partners have processed this data to provide seamless continuous future climate surfaces.
        Users are prohibited from any commercial, non-free resale, or redistribution without explicit written permission from CCAFS or the data-developing institutions.
        Users should acknowledge CCAFS as the source used in the creation of any reports, publications, new data sets, derived products, or services resulting from the use of this data set.
        For commercial access to the data, send requests to <a href="mailto:a.jarvis@cgiar.org">Andy Jarvis</a> at the International Center for Tropical Agriculture (CIAT).
    </p>

</div>

{include file='footer.tpl'}