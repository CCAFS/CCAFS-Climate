
{include file='head.tpl' jsIncludes=["jquery", "data", "tiptip","modernizr","icheck", "map"] pageTitle="Data - CCAFS Climate" pageDescription="High resolution climate change data for download, downscaled using different methods." keywords="IPCC,data,download,downscaling,high resolution,delta method,climate change,projections,MarkSim,MetOffice,PRECIS"}
{include file='header.tpl' current="data"}


<div id="subheader-image">
    <img src="{$smarty.const.SMARTY_IMG_URI}/ribbon_header_data_v2.gif" />
</div>


<div class="messagepop pop" id='frameMain_video' class="ui-widget-content" title="Tutorial CCAFS-Climate">
	<div id="content-video">
		<iframe id="playerID" width="100%" height="100%" src="http://www.youtube.com/embed/ubZ_d3X96tc">  </iframe>
	</div>
</div>	

<div id="content" class="data" style="margin-bottom:45px">
	<div style="height: 43px;">
		<div style="width:70%; float:left; height: 38px;" >
		 <h3>Spatial downscaling</h3>
		</div>
		
		<div style="width:30%; height: 30px;float:left; text-align: right; padding-top: 20px;">
			<div id="tutoVideo" style="width:44%; float:left">
			 <a href="/tutoVideo" id="tutoVideo"> <img src="{$smarty.const.SMARTY_IMG_URI}/Aqua-Play-icon.png" width="23" height="23" alt="Help" /></a>
			</div>
			<div id="tutoVideo" style="width:55%; float:right;; font-size: 13px; padding-top: 5px;">
				<a href="/tutoVideo" id="tutoVideo">How to download data</a>
			</div>
		 </div>
	</div>
	<hr>
    <br>
    <div id="browserWarning">
        <H5>Search engine no longer supports Internet Explorer versions 7 or 8.</H5>
        <P>We recommend upgrading to the latest <A href="https://ie.microsoft.com/">Internet Explorer</A>, <A href="https://chrome.google.com">Google Chrome</A>, or <A href="https://mozilla.org/firefox/">Firefox</A>.</P>
        <P>If you are using IE 9 or later, make sure you <A href="http://windows.microsoft.com/en-US/windows7/webpages-look-incorrect-in-Internet-Explorer">turn off "Compatibility View"</A>.</P>
    </div>
    <div id="search_form">
        <form method="GET" action="/file-list.php" TARGET="_blank" id="formSearch">

        <div id="side-left"> 
            <section class="ac-container">


                <div id="fileSet-filters" class="inputs-ac"> 
                    <span id="ac-1" class="inputs-ac selected" > </span>
                    <label class="inputs-ac" for="ac-1">File Set</label> 
                    <article class="ac-large">  
					
                        {assign var="category" value=$fileSets[0].category}
                        <div class="fileset-category">{$category}</div>		
						
                        {foreach from=$fileSets item=fileSet}
                            {if $category != $fileSet.category}
                                {assign var="category" value=$fileSet.category}
                                <div class="fileset-category">{$category}</div>
                            {else}
                            {/if}						
                            <img class="help_icon" id="help_icon_fileSet" src="{$smarty.const.SMARTY_IMG_URI}/help_icon.png" />
                            <input id="fileSet-{$fileSet['id']}" type="radio" name="fileSet" value="{$fileSet['id']}" /><label for="fileSet-{$fileSet['id']}">{$fileSet["name"]}</label><br> 
                        {/foreach} 
                    </article>
                    <input type="hidden" id="tile_name" name="tile_name" />
                </div>

                <div class="inputs-ac" id="scenario-filters">
                    <span id="ac-2" class="inputs-ac" > </span>
                    <label class="inputs-ac" for="ac-2">Scenario</label> 
                    <article class="ac-large">
                       {foreach from=$scenarios item=scenario}
                            <img class="help_icon" id="help_icon_scenarios[]" src="{$smarty.const.SMARTY_IMG_URI}/help_icon.png" />
                            <input id="scenario-{$scenario['id']}" type="checkbox" name="scenarios[]" value="{$scenario['id']}"><label for="scenario-{$scenario['id']}">{$scenario['name']}</label><br>
                        {/foreach}
                    </article>
                </div>

                <div class="inputs-ac" id="model-filters"> 
                    <span class="inputs-ac" id="ac-3" > </span>
                    <label  class="inputs-ac" for="ac-3">Model</label> 
                    <article class="ac-large2"> 
                                <img class="help_icon" id="help_icon_item-model" src="{$smarty.const.SMARTY_IMG_URI}/help_icon.png" />
                                <input type="checkbox" id="model-999" value="999">
                                <label for="model-999}">Select all options</label>
                            {foreach from=$models item=model}
                                <img class="help_icon" id="help_icon_item-model" src="{$smarty.const.SMARTY_IMG_URI}/help_icon.png" />
                                <input type="checkbox" id="model-{$model['id']}" name="model[]" value="{$model['id']}">
                                <label for="model-{$model['id']}">{$model['acronym']}</label>
                            {/foreach} 
                    </article>
                </div>
            </section>
        </div>
        <div id="side-right"> 
            <div id="side-right-top">
               <div id="extent-filters" class="bloc-e">
                    <div id="box"> Extent </div> 
                    {foreach from=$extents item=extent}
                    <div id="option">
                        <input tabindex="19" type="radio" id="extent-{$extent['id']}" name="extent" value="{$extent['id']}" />
                        <label for="extent-{$extent['id']}" class="extent">{$extent['name']}</label>
                    </div>
                    {/foreach} 
               </div> 

                <div id="format-filters" class="bloc-e">
                    <div id="box"> Format </div> 
                    {$isFirst = true}
                    {foreach from=$formats item=format}
                        <img class="help_icon" id="help_icon_format" src="{$smarty.const.SMARTY_IMG_URI}/help_icon.png" />
                        <input id="format-{$format['id']}" type="checkbox" name="formats[]" value="{$format['id']}" />
                        <label for="format-{$format['id']}" class="format">{$format["name"]}</label><br>
                        {$isFirst = false}
                    {/foreach}
               </div> 

               <div id="period-filters" class="bloc">
                    <div class="box-b"> Period </div> 
                    <div class="box-content">
                         <div id="dropdown-arrow"></div> 
                         <div id="drop-content">
                        {foreach from=$periods item=period}
                            <img class="help_icon" id="help_icon_period" src="{$smarty.const.SMARTY_IMG_URI}/help_icon.png" />
                            <input id="period-{$period['id']}" type="checkbox" name="period[]" value="{$period['id']}">
                            <label for="period-{$period['id']}" class="period[]">{$period['name']}</label><br>
                        {/foreach}
                        </div>
                    </div>
               </div>

                <div id="variable-filters" class="bloc">
                    <div class="box-b"> Variable </div> 
                    <div class="box-content"> 
                        <div id="dropdown-arrow"></div> 
                        <div id="drop-content">
                        {foreach from=$variables item=variable}
                            <img class="help_icon" id="help_icon_variable" src="{$smarty.const.SMARTY_IMG_URI}/help_icon.png" />
                            <input id="variable-{$variable['id']}" type="checkbox" name="variables[]" value="{$variable['id']}">
                            <label for="variable-{$variable['id']}" class="variables[]">{$variable['name']}</label><br>
                        {/foreach}
                        <input id="variable-9999" type="checkbox" name="variables[]" value="9999">
                        <label for="variable-9999" class="variables[]">Other</label><br>
                        </div>
                    </div>
               </div> 

                <div id="resolution-filters" class="bloc">
                    <div class="box-b"> Resolution </div> 
                    <div class="box-content"> 
                        <div id="dropdown-arrow"></div> 
                        <div id="drop-content">
                        {$isFirst = true}
                        {foreach from=$resolutions item=resolution}
                            <img class="help_icon" id="help_icon_resolution" src="{$smarty.const.SMARTY_IMG_URI}/help_icon.png" />
                            <input id="resolution-{$resolution['id']}" type="radio" name="resolution" value="{$resolution['id']}" />
                            <label for="resolution-{$resolution['id']}" class="resolution">{$resolution["name"]}</label><br>
                            {$isFirst = false}
                        {/foreach}
                        </div>
                    </div> 
               </div> 

               <div id="bloc-search">
						<!--<div id="filters-selected">
						</div>	-->		   
                        <div id="searchSubmit2"><button type="submit" id="searchSubmit" disabled="disabled">Search</button></div>
                        <label  id="searchlabel">
                            <span id="filesFound">0 files found</span>
                            <img class="loader" src="{$smarty.const.SMARTY_IMG_URI}/ajax-loader.gif" />
                        </label>
						<!--<input type="hidden" id="filesFound1" name="filesFound1" /> -->
                </div>
            </div>
            <div id="side-right-bottom">
                <div id="map-canvas"></div>
            </div>
        </div>
        </form>
    </div>

    <p>
	<div>
        <p>The data distributed here are in ARC GRID, and ARC ASCII format, in decimal degrees and datum WGS84. The Delta Method uses <a target="_blank" href="http://worldclim.com/current"><i>WorldClim v1.4</i></a> as the high resolution baseline. CCAFS and its partners have processed this data to provide seamless continuous future climate surfaces.
        Users are prohibited from any commercial, non-free resale, or redistribution without explicit written permission from CCAFS or the data-developing institutions.
        Users should acknowledge CCAFS as the source used in the creation of any reports, publications, new data sets, derived products, or services resulting from the use of this data set.
        For commercial access to the data, send requests to <a href="mailto:a.jarvis@cgiar.org">Andy Jarvis</a> at the International Center for Tropical Agriculture (CIAT).
        </p>
	</div>
    
         <div style="float:right;font-size:12px;padding-bottom:5px;margin-top:2px; height:10px">
		   <i>Last updated: 16 April 2015</i>
<!--          <script language="javascript"> 
            months = ['January', 'Febraury', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']; 
            var theDate = new Date(document.lastModified); 
            with (theDate) { 
            document.write("<i>Last updated: "+getDate()+' '+months[getMonth()]+' '+getFullYear()+"</i>") 
            } 
          </script> -->   		
		</div>   
		
    </p>
</div>




{include file='footer.tpl'}