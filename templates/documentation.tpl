{include file='head.tpl' jsIncludes=[] pageTitle="Documentation- CCAFS Climate" pageDescription="Useful reading for understanding the CCAFS downscaled climate change projections." keywords="CCAFS,documentation,downscaling,climate change"}
{include file='header.tpl' current="documentation"}
<div id="subheader-image">
    <img src="{$smarty.const.SMARTY_IMG_URI}/ribbon_header_docs.gif" />
</div>


<link rel="stylesheet" href="https://code.jquery.com/ui/1.11.3/themes/smoothness/jquery-ui.css">
<script src="http://code.jquery.com/jquery-1.7.2.min.js"></script>		
<script src="https://code.jquery.com/ui/1.11.3/jquery-ui.min.js"></script>		
<script type="text/javascript">
  $(document).ready(function(){
    var show; // declare variable to hold show/hide state

    $(".thebody").hide(); // hide articles at first
     
    $(".readme a").click(function(event){ // show/hide articles

      if (!show) { showhide($(this),"Hide video",true); } // show, change label
      else { showhide($(this),"Show video",false);
		$('#thebody').get(0).stopVideo();
	  } // or hide, change label

      return false; // u know: disable usual link click function

      function showhide(what,swaptext,swapstate){
        $(what).parents(".readme").next(".thebody").toggle('fast');
        $(what).text(swaptext);
        show = swapstate; // pass the current state to... oops! Fails if > 1 article showing...
      }
    });

  });
</script> 
	
<div id="content" class="documentation">
    <h3>Documentation</h3>
    <hr>
	 <br>
    <h4>Tutorial to download data from CCAFS-Climate</h4>

	<div class="readme">
		 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="" title="See video tutorial">Show video</a>
	</div>	
	<div id="thebody" class="thebody" style="display: block;width:800px;height:450px;">
		<iframe id="doctutoVideo" width="100%" height="100%" src="http://www.youtube.com/embed/ubZ_d3X96tc" style="padding-left:3%;border:hidden"> </iframe>
	</div>	
    <br>
    <h4>Useful documents</h4>
    <ul id="document-list" type="none"> 
		<li type="square">
			<a href="{$smarty.const.SMARTY_DOCS_URI}/BC_methods_explaining_v2.pdf">
				<img src="{$smarty.const.SMARTY_IMG_URI}/icon-pdf.png" />
				Bias-correction in the CCAFS-Climate Portal: A description of methodologies.
			</a>
		</li> 			
        <li type="square">
            <a href="{$smarty.const.SMARTY_DOCS_URI}/mapping_data_ccafs-climate.pdf">
                <img src="{$smarty.const.SMARTY_IMG_URI}/icon-pdf.png" />
                CCAFS Climate datasets map.
            </a>
        </li>    
        <li type="square">
            <a href="{$smarty.const.SMARTY_DOCS_URI}/Ramirez_Bueno-Cabrera_2009_tutorial_bcvars_creation.pdf">
                <img src="{$smarty.const.SMARTY_IMG_URI}/icon-pdf.png" />
                Tutorial to generate 19 bioclimatic variables from monthly datasets.
            </a>
        </li>
        <ul>
            <li type="circle">
                <a href="{$smarty.const.SMARTY_DOCS_URI}/bioclimatic-variables.pdf">
                    <img src="{$smarty.const.SMARTY_IMG_URI}/icon-pdf.png" />
                    Abbreviations Used For Bioclimatic Variables.
                </a>
            </li>
        </ul>
        <li type="square">
            <a href="{$smarty.const.SMARTY_DOCS_URI}/Downscaling-WP-01.pdf">
                <img src="{$smarty.const.SMARTY_IMG_URI}/icon-pdf.png" />
                Downscaling Global Circulation Model Outputs: The Delta Method.
            </a>
        </li>
        <ul>
            <li type="circle">
                <a href="{$smarty.const.SMARTY_DOCS_URI}/Data_source_and_process_flow_chart_CIAT_DELTA.pdf">
                    <img src="{$smarty.const.SMARTY_IMG_URI}/icon-pdf.png" />
                    Data Source and Process flow chart Delta Method (Hiett M., 2011).
                </a>
            </li>
            <li type="circle">
                <a href="{$smarty.const.SMARTY_DOCS_URI}/delta_disaggregation_variables.pdf">
                    <img src="{$smarty.const.SMARTY_IMG_URI}/icon-pdf.png" />
                    Abbreviations Used For Delta Method Downscaled and Disaggregation data.
                </a>
            </li>
        </ul>
        <li type="square">
            <a href="{$smarty.const.SMARTY_DOCS_URI}/Disaggregation-WP-02.pdf">
                <img src="{$smarty.const.SMARTY_IMG_URI}/icon-pdf.png" />
                Disaggregation of Global Circulation Model Outputs.
            </a>
        </li>
        <li type="square">
            <a href="{$smarty.const.SMARTY_DOCS_URI}/Climgen-Downscaling-Tyndall.pdf">
                <img src="{$smarty.const.SMARTY_IMG_URI}/icon-pdf.png" />
                The CLIMGEN model: Downscaling Tyndall.
            </a>
        </li>
        <li type="square">
            <a href="{$smarty.const.SMARTY_DOCS_URI}/worldclim_IJC.pdf">
                <img src="{$smarty.const.SMARTY_IMG_URI}/icon-pdf.png" />
                Very high resolution interpolated climate surfaces for Global Land Areas.
            </a>
        </li>                
        <li type="square">
            <a href="http://www.metoffice.gov.uk/media/pdf/6/5/PRECIS_Handbook.pdf">
                <img src="{$smarty.const.SMARTY_IMG_URI}/icon-pdf.png" />
                Generating High Resolution Climate Change Scenarios using PRECIS.
            </a>
        </li>
        <ul>
            <li type="circle">
                <a href="{$smarty.const.SMARTY_DOCS_URI}/precis-variables.pdf">
                    <img src="{$smarty.const.SMARTY_IMG_URI}/icon-pdf.png" />
                    Abbreviations Used For PRECIS Data.
                </a>
            </li>
        </ul>
        <li type="square">
            <a href="{$smarty.const.SMARTY_DOCS_URI}/Generating_Characteristic_Daily_Weather_Data_using_Downscaled_Climate_Model_Data_Jones_Thornton_Heinke_2009.pdf">
                <img src="{$smarty.const.SMARTY_IMG_URI}/icon-pdf.png" />
                Generating characteristic daily weather data using downscaled climate model data from IPCC's Fourth Assessment.
            </a>
        </li>
        <li type="square">
            <a href="{$smarty.const.SMARTY_DOCS_URI}/MarkSim_Standalone_Documentation.pdf">
                <img src="{$smarty.const.SMARTY_IMG_URI}/icon-pdf.png" />
                MarkSim standalone for DSSAT users (Jones et al., 2012).
            </a>
        </li>
        <li type="square">
            <a href="{$smarty.const.SMARTY_DOCS_URI}/MarkSim_Standalone_Documentation_v2.pdf">
                <img src="{$smarty.const.SMARTY_IMG_URI}/icon-pdf.png" />
                MarkSim standalone V2 for DSSAT users (Jones et al., 2013).
            </a>
        </li>		
        <li type="square">
            <a href="{$smarty.const.SMARTY_DOCS_URI}/MarkSim_Generating_Downscaled_Weather_Data.pdf">
                <img src="{$smarty.const.SMARTY_IMG_URI}/icon-pdf.png" />
                Generating downscaled weather data from a suite of climate models for agricultural modelling applications
            </a>
        </li>
    </ul>
</div>
{include file='footer.tpl'}