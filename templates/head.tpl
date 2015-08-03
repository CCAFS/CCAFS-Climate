<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html class="no-js" lang="en-US" dir="ltr" xmlns="http://www.w3.org/1999/xhtml">
    <head profile="http://gmpg.org/xfn/11">
        <title>{$pageTitle|default:'CCAFS Climate'}</title>
        <meta content="text/html; charset=UTF-8" http-equiv="content-type" />
        <meta name="description" content="{$pageDescription|default:'GCM Data Portal'}" />
        <meta name="keywords" content="{$keywords|default:'GCM,CIAT'}" />
        <meta name="robots" content="index, follow, archive" />
        <meta name="googlebot" content="index" />
        <!-- Stylesheets -->
        <!-- Main -->
        <link rel="stylesheet" type="text/css" href="{$smarty.const.SMARTY_CSS_URI}/main.css" media="screen" />
	{*<script src="{$smarty.const.SMARTY_JS_URI}/jquery/jquery-1.8.1.min.js"></script>	*}
        <!-- include specified javascripts -->
        {if $jsIncludes}
            {foreach from=$jsIncludes item=jsToInclude}
                {if $jsToInclude == "jquery"}
                    <script src="{$smarty.const.SMARTY_JS_URI}/jquery/jquery-1.8.1.min.js"></script>
                {elseif $jsToInclude == "icheck"}
                    <!-- Reference: customizable checkboxes and radio buttons http://damirfoy.com/iCheck/ -->
                    <script src="{$smarty.const.SMARTY_JS_URI}/iCheck/jquery.icheck.min.js?v=0.9.1"></script>
                    <link href="{$smarty.const.SMARTY_JS_URI}/iCheck/skins/minimal/_all.css" rel="stylesheet"> 
                    <link href="{$smarty.const.SMARTY_JS_URI}/iCheck/skins/line/_all.css" rel="stylesheet"> 
                    <link href="{$smarty.const.SMARTY_JS_URI}/iCheck/skins/flat/_all.css" rel="stylesheet">    
                {elseif $jsToInclude == "index"}
                    <link rel="stylesheet" type="text/css" href="{$smarty.const.SMARTY_CSS_URI}/modal-index.css" media="screen" /> 
                    <link rel="stylesheet" href="{$smarty.const.SMARTY_JS_URI}/Remodal-master/dist/jquery.remodal.css">
                    <script src="{$smarty.const.SMARTY_JS_URI}/Remodal-master/dist/jquery.remodal.min.js"></script>
                    <script src="{$smarty.const.SMARTY_JS_URI}/index.js"></script>
                {elseif $jsToInclude == "downscaling"}
                    <script src="{$smarty.const.SMARTY_JS_URI}/downscaling.js"></script>
                {elseif $jsToInclude == "pattern_scaling"}
                    <script src="{$smarty.const.SMARTY_JS_URI}/pattern_scaling.js"></script>
                {elseif $jsToInclude == "data"}
                    <script src="http://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js"></script>	
                    <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key={$smarty.const.GOOGLE_API_KEY}&sensor=false"></script>
                    <script src="{$smarty.const.SMARTY_JS_URI}/data.js"></script> 
                    <link rel="stylesheet" type="text/css" href="{$smarty.const.SMARTY_CSS_URI}/data.css" media="screen" /> 
                    <link rel="stylesheet" href="https://code.jquery.com/ui/1.11.3/themes/smoothness/jquery-ui.css">
                    <script src="http://code.jquery.com/jquery-1.7.2.min.js"></script>		
                    <script src="https://code.jquery.com/ui/1.11.3/jquery-ui.min.js"></script>							
                    <!--[if lte IE 8]>
                        <link rel="stylesheet" type="text/css" href="{$smarty.const.SMARTY_CSS_URI}/data-IE8.css" media="screen" />
                    <![endif]-->
                {elseif $jsToInclude == "dataBias"}
                    <script src="http://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js"></script>	
                    <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key={$smarty.const.GOOGLE_API_KEY}&sensor=false"></script>
                    <script src="{$smarty.const.SMARTY_JS_URI}/data_bias.js"></script> 
                    <link rel="stylesheet" type="text/css" href="{$smarty.const.SMARTY_CSS_URI}/data_bias.css" media="screen" /> 
                    <link rel="stylesheet" href="https://code.jquery.com/ui/1.11.3/themes/smoothness/jquery-ui.css">
                    <script src="http://code.jquery.com/jquery-1.7.2.min.js"></script>		
                    <script src="https://code.jquery.com/ui/1.11.3/jquery-ui.min.js"></script>							
                {elseif $jsToInclude == "bpopup"}
                    <!-- Reference http://dinbror.dk/bpopup/ -->
                    <script src="{$smarty.const.SMARTY_JS_URI}/bpopup/jquery.bpopup-0.7.0.min.js"></script>
                {elseif $jsToInclude == "tiptip"}
                    <!-- Reference: http://code.drewwilson.com/entry/tiptip-jquery-plugin -->
                    <script src="{$smarty.const.SMARTY_JS_URI}/TipTip-v1.3/jquery.tipTip.minified.js"></script>
                    <link rel="stylesheet" type="text/css" href="{$smarty.const.SMARTY_CSS_URI}/tipTip.css" />
                {elseif $jsToInclude == "form"}
                    <script src="{$smarty.const.SMARTY_JS_URI}/form.js"></script>
                {elseif $jsToInclude == "file-list"}
                    <script src="{$smarty.const.SMARTY_JS_URI}/file-list.js"></script>
                {elseif $jsToInclude == "tablesorter"}
                    <link rel="stylesheet" type="text/css" href="{$smarty.const.SMARTY_CSS_URI}/tablesorter.css" />
                    <script src="{$smarty.const.SMARTY_JS_URI}/tablesorter/jquery.tablesorter.min.js"></script>
                
                {elseif $jsToInclude == "modernizr"}
                    <!-- Reference: JavaScript library that detects HTML5 and CSS3 features in the user’s browser. http://modernizr.com/ -->
                    <script type="text/javascript" src="{$smarty.const.SMARTY_JS_URI}/Modernizr-2.0.6/modernizr.custom.23336.js"></script>
                
                {elseif $jsToInclude == "map"}		
                    <script src="http://geoxml3.googlecode.com/svn/branches/polys/geoxml3.js"></script>
                                        
                {elseif $jsToInclude == "station"}
                    {*<script src="{$smarty.const.SMARTY_JS_URI}/station.js"></script>
					<script>var 
						js_uri = '{$smarty.const.SMARTY_JS_URI}';
						icons_uri = '{$smarty.const.SMARTY_IMG_URI}/iconosGIS/';
					</script>
					<script type="text/javascript" src="{$smarty.const.SMARTY_JS_URI}/ext-4.2.2/examples/shared/include-ext.js?theme=neptune"></script>	
					<script src="{$smarty.const.SMARTY_JS_URI}/theme.js"></script>
					<script src="{$smarty.const.SMARTY_JS_URI}/OpenLayers-2.13.1/OpenLayers.js"></script>
					<script type="text/javascript" src="{$smarty.const.SMARTY_JS_URI}/loader.js"></script>
					<script type="text/javascript" src="{$smarty.const.SMARTY_JS_URI}/tree.js"></script>
					<script src="{$smarty.const.SMARTY_JS_URI}/countries.js" type="text/javascript"></script>		
					<script src="{$smarty.const.SMARTY_JS_URI}/stylesLayer.js" type="text/javascript"></script>		
					<script src="{$smarty.const.SMARTY_JS_URI}/layersOpenlayer.js" type="text/javascript"></script>		
					<script type="text/javascript" src="{$smarty.const.SMARTY_JS_URI}/ext-4.2.2/examples/shared/examples.js"></script>
					<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
					<script src="http://code.highcharts.com/stock/highstock.js"></script>
					<script src="http://code.highcharts.com/stock/modules/exporting.js"></script>
					<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDGkYt6T3eVNusLjkov8jmxdQGT2YuSgJw&sensor=false"></script>		

					<link rel="stylesheet" type="text/css" href="{$smarty.const.SMARTY_CSS_URI}/map.css" />
					<link rel="stylesheet" type="text/css" href="{$smarty.const.SMARTY_CSS_URI}/tabs.css" />
					<link rel="stylesheet" type="text/css" href="{$smarty.const.SMARTY_JS_URI}/ext-4.2.2/examples/ux/css/TabScrollerMenu.css" />
					<link href='http://fonts.googleapis.com/css?family=Oswald' rel='stylesheet' type='text/css'>
					<link rel="stylesheet" href="http://yui.yahooapis.com/pure/0.6.0/pure-min.css">*}

                {/if}
            {/foreach}
        {/if}



  
		
    </head> 
    <body>
	
	
	</body>
