
{include file='head.tpl' jsIncludes=["jquery", "data", "tiptip","modernizr","icheck"] pageTitle="Data - CCAFS Climate" pageDescription="High resolution climate change data for download, downscaled using different methods." keywords="IPCC,data,download,downscaling,high resolution,delta method,climate change,projections,MarkSim,MetOffice,PRECIS"}
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

        <div id="side-left"> 
            <section class="ac-container">
                <div>
                    
                    <input id="ac-1" class="inputs-ac" name="accordion-1" type="radio" checked />
                    <label class="inputs-ac" for="ac-1">File Set</label>
                   
                    <article class="ac-large">

                         {$isFirst = true}

                        {foreach from=$fileSets item=fileSet}                            
                            <input id="fileSet-{$fileSet['id']}" type="radio" name="fileSet" value="{$fileSet['id']}" {if $isFirst}checked{/if}/><label for="fileSet-{$fileSet['id']}">{$fileSet["name"]}</label><br>
                            {$isFirst = false}
                        {/foreach}


                    </article>
                </div>
                <div class="inputs-ac">
                     
                    <input id="ac-2" class="inputs-ac" name="accordion-1" type="radio" />
                    <label class="inputs-ac" for="ac-2">Scenario</label>
                     
                    <article class="ac-large">
                       {foreach from=$scenarios item=scenario}
                            <input id="scenario-{$scenario['id']}" type="checkbox" name="scenarios[]" value="{$scenario['id']}"><label for="scenario-{$scenario['id']}">{$scenario['name']}</label><br>
                        {/foreach}
                    </article>
                </div>
                <div class="inputs-ac">
                     
                    <input class="inputs-ac" id="ac-3" name="accordion-1" type="radio"  />
                    <label  class="inputs-ac" for="ac-3">Model</label>
                    
                    <article class="ac-large2">
                       
                            {foreach from=$models item=model}
                            <input type="checkbox" id="line-checkbox-{$model['id']}" name="{$model['acronym']}" value="{$model['id']}">
                            <label for="line-checkbox-{$model['id']}">{$model['acronym']}</label>                         
                            {/foreach}
                        
                    </article>
                </div>
            </section>
        </div>
        <div id="side-right"> 
            <div id="side-right-top">
               <div id="bloc">
                    <div id="box"> Extend </div> 
                    <input tabindex="19" type="radio" id="line-radio-1" name="extent" value="global">
                    <label for="line-radio-1">Global</label><br> 
                    <input tabindex="19" type="radio" id="line-radio-2" name="extent" value="regional" checked>
                    <label for="line-radio-2">Regional</label><br> 
               </div> 
                <div id="bloc">
                    <div id="box"> Format </div> 
                    {$isFirst = true}
                        {foreach from=$formats item=format}
                            <input id="format-{$format['id']}" type="radio" name="format" value="{$format['id']}" {if $isFirst}checked{/if}/><label for="format-{$format['id']}">{$format["name"]}</label><br>
                            {$isFirst = false}
                        {/foreach}
               </div> 

                <div id="bloc">
                    <div id="box-b"> Period </div> 

                    <div id="box-content">  
                        
                         <div id="dropdown-arrow"></div> 
                         <div id="drop-content">
                        {foreach from=$periods item=period}
                            <input id="period-{$period['id']}" type="checkbox" name="periods[]" value="{$period['id']}"><label for="period-{$period['id']}">{$period['name']}</label><br>
                        {/foreach}
                        </div>
                    </div>
                    
               </div> 
                <div id="bloc">
                    <div id="box-b"> Variable </div> 
                    <div id="box-content"> 
                        <div id="dropdown-arrow"></div> 
                        <div id="drop-content">
                        {foreach from=$variables item=variable}
                            <input id="variable-{$variable['id']}" type="checkbox" name="variables[]" value="{$variable['id']}"><label for="variabe-{$variable['id']}">{$variable['name']}</label><br>
                        {/foreach}
                        <input id="variable-9999" type="checkbox" name="variables[]" value="9999"><label for="variable-9999">Other</label><br>
                        </div>
                    </div>
                    
               </div> 
                <div id="bloc">
                    <div id="box-b"> Resolution </div> 
                    <div id="box-content"> 
                        <div id="dropdown-arrow"></div> 
                        <div id="drop-content">
                        {$isFirst = true}
                        {foreach from=$resolutions item=resolution}
                            <input id="resolution-{$resolution['id']}" type="radio" name="resolution" value="{$resolution['id']}" {if $isFirst}checked{/if}/><label for="resolution-{$resolution['id']}">{$resolution["name"]}</label><br>
                            {$isFirst = false}
                        {/foreach}
                        </div>
                    </div> 
               </div> 
               <div id="bloc-search">
                        <label>0 files found</label>
                        <button type="submit" id="searchSubmit" disabled="disabled">Search</button>
                </div>
            </div>
            <div id="side-right-bottom">
                <div id="map-canvas">Zx</div>
            </div>
        </div>
    </div>

    <p>
        The data distributed here are in ARC GRID, and ARC ASCII format, in decimal degrees and datum WGS84. CCAFS and its partners have processed this data to provide seamless continuous future climate surfaces.
        Users are prohibited from any commercial, non-free resale, or redistribution without explicit written permission from CCAFS or the data-developing institutions.
        Users should acknowledge CCAFS as the source used in the creation of any reports, publications, new data sets, derived products, or services resulting from the use of this data set.
        For commercial access to the data, send requests to <a href="mailto:a.jarvis@cgiar.org">Andy Jarvis</a> at the International Center for Tropical Agriculture (CIAT).
    </p>

</div>

{include file='footer.tpl'}