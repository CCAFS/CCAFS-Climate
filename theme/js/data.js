
$(document).ready(function(){

  initializeICheckSettings();
  initializeMap();
  setPageEvents();
  
}); 

/**
 * This function initialize the settings for 
 * plugin iCheck, responsible to give style to
 * radioButtons and checkboxes.
 */
function initializeICheckSettings(){

  // initializing iCheck Settings

  $('.ac-large input').iCheck({
    checkboxClass: 'icheckbox_minimal',
    radioClass: 'iradio_minimal',
    increaseArea: '20%'
  });

  $('.ac-large2 input').each(function(){
    var self = $(this),
      label = self.next(),
      label_text = label.text();

    label.remove();
    self.iCheck({
      checkboxClass: 'icheckbox_line',
      radioClass: 'iradio_line',
      insert: '<div class="icheck_line-icon"></div>' + label_text
    });
  });

  $('#bloc input').iCheck({
    checkboxClass: 'icheckbox_flat',
    radioClass: 'iradio_flat'
  });
  $('#bloc-e input').iCheck({
    checkboxClass: 'icheckbox_flat',
    radioClass: 'iradio_flat'
  });

}

/**
 * This function set the events for the elements of the page.
 */
function setPageEvents(){

  $("input[name='fileSet']").on("ifToggled", deleteTileValue);
  $("input[name='fileSet']").on("ifChecked", getFilesInfo);
  $("input[name='scenarios\\[\\]']").on("ifToggled", getFilesInfo);
  $("input[name='model\\[\\]']").on("ifToggled", getFilesInfo);
  $("input[name='method']").on("ifToggled", getFilesInfo);
  $("input[name='extent']").on("ifToggled", getFilesInfo);
  $("input[name='formats\\[\\]']").on("ifToggled", getFilesInfo);
  $("input[name='period\\[\\]']").on("ifToggled", getFilesInfo);
  $("input[name='variables\\[\\]']").on("ifToggled", getFilesInfo);
  $("input[name='resolution']").on("ifToggled", getFilesInfo);

  // load on the map the selected layer(file set). 
  $("input[name='fileSet']").on('ifChecked', loadKmlOnMap); 
  // Select/De-select all option in model filter
  $("input#line-checkbox-999").on("ifToggled", selectAllOptionsEvent);
}

/* ******************************************************************************** */
//
//                               Data functions
//
// Functions below are in charge of get the user selections and calculate the 
// amount of files available.
//
/* ******************************************************************************** */

/**
 * deleteTileValue erase the id of the tile stored in 
 * the hidden input if exists
 */
function deleteTileValue(){
  $("#tile_name").attr("value", null);
}

/*
  This function checks if option "Select all options"
  in Model filter was pressed
 */
function selectAllOptionsEvent(evt){
  var element = evt.target;

  // Disable temporary the toggled event
  $("input[name='model\\[\\]']").off("ifToggled", getFilesInfo);

  if($(element).attr("checked") == "checked"){
    $("input[name='model\\[\\]']").iCheck('check');
  }else{
    $("input[name='model\\[\\]']").iCheck('uncheck');
  }

  // Enable again the toggled event
  $("input[name='model\\[\\]']").on("ifToggled", getFilesInfo);
  // Trigger the toggled event 
  $("input[name='model\\[\\]']").first().trigger("ifToggled");
}

function getFilesInfo(evt){
  var filterValues = getUserSelections($(evt.target).attr("name"));

  // Hide the help icon 
  if($(evt.target).parent().prev().hasClass("help_icon")){
    $(evt.target).parent().prev().hide();
  }

    $.ajax({
    type: "POST",
    dataType: "json",
    url: "/ajax/data-file-info.php",
    data: filterValues,
    beforeSend: function() {
      // Hide the help icon if exists
      var help_icon_element = $("#help_icon_"+$(evt.target).attr("name").replace('[', '').replace(']', ''));
      if($(help_icon_element).length > 0){
        $(help_icon_element).hide();
      }
      // Hide the files found text
      $("#filesFound").hide();
      // Show the loader gif
      $(".loader").show();
    },
    success: function(data) {
      $(".loader").hide();
      
      if(data != null){
        if(data.filesFound < 0) {
            $("#filesFound").text("0 files found");
            $("#searchSubmit").attr("disabled", "disabled");
            $("#searchSubmit").addClass("disable");
        } else {
            if(data.filesFound == 0) {
                $("#searchSubmit").attr("disabled", "disabled");
                $("#searchSubmit").addClass("disable"); 
            } else {
                $("#searchSubmit").removeAttr("disabled");
                $("#searchSubmit").removeClass("disable"); 
            }
            // update files found text
            if (data.filesFound == 1) {
                $("#filesFound").text("1 file found");
            }else {
                $("#filesFound").text(data.filesFound+" files found");
            }

            // Show filter description if exists 
            $.each(data.description, function(id, descriptionText){
              if(descriptionText != null){
                var elementId = $(evt.target).attr("id");
                var elementIdPrefix = elementId.substring(0, elementId.lastIndexOf("-")+1);

                var helpIcon =  $("#"+elementIdPrefix +id).parent().prev().show();
                $(helpIcon).attr("title", descriptionText);
                $(helpIcon).tipTip({
                    activation: "click",
                    keepAlive: true,
                    maxWidth: "400px",
                    defaultPosition: "right"
                });
                
              }
            });
        }
      }else{
          $("#filesFound").text("0 files found");
          $("#searchSubmit").attr("disabled", "disabled");
          $("#searchSubmit").addClass("disable"); 
      }
      $("#filesFound").show();
    }
  });
}

/**
 * This function return all the options selected by the user in 
 * an object.
 * 
 * @param  sectionName - Name of the filter that trigger the event
 * @return an object with the values selected by the user.
 */
function getUserSelections(filterName){
  var scenarios, model, period, tileNameVal;

  scenarios = getArrayValues( $("[name='scenarios\\[\\]']:checked") );
  model = getArrayValues( $("input[name='model\\[\\]']:checked") );
  period = getArrayValues( $("input[name='period\\[\\]']:checked") );
  variables = getArrayValues( $("input[name='variables\\[\\]']:checked") ); 
  formats = getArrayValues( $("input[name='formats\\[\\]']:checked") ); 
  tileNameVal = (  $("#tile_name").val() == "" ) ? undefined : "'" + $("#tile_name").val() + "'";

  var data = {
    methodId: $("input[name='method']:checked").val(),
    modelId: model,
    extendId: $("input[name='extent']:checked").val(),
    formatId: formats,
    scenarioId: scenarios,
    periodId: period,
    variableId: variables,
    resolutionId: $("input[name='resolution']:checked").val(),
    filesetId: $("input[name='fileSet']:checked").val(),
    tileName: tileNameVal,
    section: filterName
  }

  return data;
}

/**
 * This function takes an array of objects and return a string
 * with the value of each element.
 * 
 * @param  array
 * @return a String with values.
 */
function getArrayValues(array){
  var arr = new Array();
  $.each($(array), function () {
     arr.push($(this).val());
  });

  return arr.toString();
}

/* ******************************************************************************** */
//                               End of data functions
/* ******************************************************************************** */

/* ******************************************************************************** */
//
//                               Map functions
//
// Functions below are in charge of load and update the map.
//
/* ******************************************************************************** */
var map=null;
var selectedPolygonStyle=null;
var highlightOptions = {fillColor: "#FFFFFF", strokeColor: "#FFFFFF", fillOpacity: 0.6, strokeWidth: 10};
var normalStyle = {fillColor: "#BDBDBD", strokeColor: "#424242", fillOpacity: 0.4, strokeWidth: 10};
var selectedStyle= {fillColor: "#2E2E2E", strokeColor: "#1C1C1C", fillOpacity: 0.6, strokeWidth: 10};

// function initialize map
function initializeMap() {
  var mapOptions = {
      zoom: 2,
      center: new google.maps.LatLng(23.079732,17.226563),
      mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

  google.maps.event.addListenerOnce(map, 'idle', function(){
    map.setCenter(new google.maps.LatLng(23.079732,17.226563));
    map.setZoom(1);
  });

}

//function to load the kml once the user changes file setz
function loadKmlOnMap(){
  initializeMap();
  var filesetId = this.value;
  var kmlName = "";

  switch(filesetId){
    case "4":  // IPCC 4AR (CIAT) e IPCC 5AR (CIAT)
      kmlName = "tiled";
    break;

    case "7": // Precis Andes
      kmlName = "precis";
    break;

    case "8":  // Cordex
      kmlName = "cordex";
    break;

    case "10": // Eta South america
      kmlName = "eta";
    break;

    case "12":  // IPCC 4AR (CIAT) e IPCC 5AR (CIAT)
      kmlName = "tiled";
    break;
  }

  if(kmlName != ""){
    geoXml = new geoXML3.parser({
                  map: map,
                  singleInfoWindow: true,
                  afterParse: useTheData
                });

	  geoXml.parse('/theme/kmls/' + kmlName + '.kml');
  }else{
    $("#map-canvas").html("<img src='/theme/images/map-not-available.png'/>");
  }
}

//function for mouseover and mouse out
function highlightPoly(poly) {
    google.maps.event.addListener(poly,"mouseover",function() {
      poly.setOptions(highlightOptions);
    });
    google.maps.event.addListener(poly,"mouseout",function() {
      poly.setOptions(normalStyle);
    });
  
}

//function for events onclick over each polygon
function createListener(poly,name) {	
  google.maps.event.addListener(poly, "click", function(evt){

    // Creating the property to send as section property
    evt.target = {};
    evt.target["name"] = "tile";
    polygonClickEvent(evt, poly);
  });
}

function polygonClickEvent(evt, poly){
    // Don't show the info window
    poly.infoWindow.close();
   
    // Setting the tile id in the hidden input
    $("#tile_name").val(poly.title);

    if(selectedPolygonStyle != null){
      selectedPolygonStyle.setOptions(normalStyle);
      highlightPoly(selectedPolygonStyle);
    }

    selectedPolygonStyle=poly;    
    poly.setOptions(selectedStyle);
    google.maps.event.clearListeners(poly, 'mouseover');  
    google.maps.event.clearListeners(poly, 'mouseout');   

    // Look for the files available
    getFilesInfo(evt);
}

// function to manage the data into the kml files
function useTheData(doc){
  // Geodata handling goes here, using JSON properties of the doc object
  geoXmlDoc = doc[0]; 
  if(geoXmlDoc.gpolygons!=undefined){
		for (var i = 0; i < geoXmlDoc.gpolygons.length; i++) {
			geoXmlDoc.gpolygons[i].setOptions(normalStyle);
			highlightPoly(geoXmlDoc.gpolygons[i]);
			createListener(geoXmlDoc.gpolygons[i],geoXmlDoc.placemarks[i].name);
		}		
	}	
}

/* Apply a custom KML to the map */

/* ******************************************************************************** */
//                               End of map functions
/* ******************************************************************************** */