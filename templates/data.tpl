{include file='head.tpl' jsIncludes=["jquery", "data", "tiptip"] pageTitle="Data - CCAFS Climate" pageDescription="High resolution climate change data for download, downscaled using different methods." keywords="IPCC,data,download,downscaling,high resolution,delta method,climate change,projections,MarkSim,MetOffice,PRECIS"}
{include file='header.tpl' current="data"}
<div id="subheader-image">
    <img src="{$smarty.const.SMARTY_IMG_URI}/ribbon_header_data.gif" />
</div>
<div id="content" class="data2">
    <h3>Data</h3>
    <hr>
    <br>

    <div class="center">
        <img id="download_data_button" name="download_data_button" src="{$smarty.const.SMARTY_IMG_URI}/download_data_button.png">
    </div>
    <div id="search_form">
        <form method="GET" action="/file-list2.php" id="formSearch">
            <table id="table_fields" class="table_form">
                <div id="div-fileSet">
                    <h4 class="left-title">File Set</h4>
                    <div class="form-options">
                        {$isFirst = true}
                        {foreach from=$fileSets item=fileSet}                            
                            <input id="fileSet-{$fileSet['id']}" type="radio" name="fileSet" value="{$fileSet['id']}" {if $isFirst}checked{/if}/><label for="fileSet-{$fileSet['id']}">{$fileSet["name"]}</label><br>
                            {$isFirst = false}
                        {/foreach}
                    </div>
                </div>
                <div id="div-period">
                    <h4 class="top-title">Period</h4>
                    <div class="form-options">                        
                        {foreach from=$periods item=period}
                            <input id="period-{$period['id']}" type="checkbox" name="periods[]" value="{$period['id']}"><label for="period-{$period['id']}">{$period['name']}</label><br>
                        {/foreach}
                    </div>
                </div>
                <div id="div-variable">
                    <h4 class="top-title">Variable</h4>
                    <div class="form-options">
                        {foreach from=$variables item=variable}
                            <input id="variable-{$variable['id']}" type="checkbox" name="variables[]" value="{$variable['id']}"><label for="variabe-{$variable['id']}">{$variable['name']}</label><br>
                        {/foreach}
                        <input id="variable-9999" type="checkbox" name="variables[]" value="9999"><label for="variable-9999">Other</label><br>
                    </div>
                </div>
                <div id="div-resolution">
                    <h4 class="top-title">Resolution</h4>
                    <div class="form-options">
                        {$isFirst = true}
                        {foreach from=$resolutions item=resolution}
                            <input id="resolution-{$resolution['id']}" type="radio" name="resolution" value="{$resolution['id']}" {if $isFirst}checked{/if}/><label for="resolution-{$resolution['id']}">{$resolution["name"]}</label><br>
                            {$isFirst = false}
                        {/foreach}
                    </div>
                </div>
                <div id="div-format">
                    <h4 class="top-title">Format</h4>
                    <div class="form-options">
                        {$isFirst = true}
                        {foreach from=$formats item=format}
                            <input id="format-{$format['id']}" type="radio" name="format" value="{$format['id']}" {if $isFirst}checked{/if}/><label for="format-{$format['id']}">{$format["name"]}</label><br>
                            {$isFirst = false}
                        {/foreach}
                    </div>
                </div>
                <div id="div-extent">
                    <h4 class="right-title">Extent</h4>
                    <div class="form-options">
                        <input id="extent-1" type="radio" name="extent" value="global" /><label for="extent-1">Global</label><br>
                        <input id="extent-2" type="radio" name="extent" value="regional" checked/><label for="extent-2">Regional</label><br>
                    </div>
                </div>
                <div id="div-scenario">
                    <h4 class="left-title">Scenario</h4>
                    <div class="form-options">
                        {foreach from=$scenarios item=scenario}
                            <input id="scenario-{$scenario['id']}" type="checkbox" name="scenarios[]" value="{$scenario['id']}"><label for="scenario-{$scenario['id']}">{$scenario['name']}</label><br>
                        {/foreach}
                    </div>
                </div>                
                <div id="div-tile">
                    <div id="buttons">
                        <label>0 files found</label>
                        <button type="submit" id="searchSubmit" disabled="disabled">Search</button>
                    </div>
                    <div id="map-canvas"></div>
                </div>
                <div id="div-model">
                    <h4 class="left-title">Model</h4>
                    <div class="form-options">
                        <select name=models size=12 multiple>
                            {foreach from=$models item=model}
                                <option name="{$model['acronym']}" value={$model['id']}>{$model['acronym']}</option>                                
                            {/foreach}
                        </select>
                    </div>
                </div>
            </table>
            <br>

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