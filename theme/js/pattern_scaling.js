$(document).ready(function(){
    $(".checkbox-resource").change(function() {
			// console.log($("#tile_name").val())
        if ($(".checkbox-resource:checked").length > 0) {
            $("#download-button").removeAttr("disabled");
        } else {
            $("#download-button").attr("disabled", "disabled");
        }
		
    });
    
    $(".checkbox-resourceR").change(function() {
        if ($(".checkbox-resourceR:checked").length > 0) {
            $("#download-buttonR").removeAttr("disabled");
        } else {
            $("#download-buttonR").attr("disabled", "disabled");
        }
    });
	
  setPageEvents();


	  
});






/* ******************************************************************************** */
//
//                               Map functions
//
// Functions below are in charge of load and update the map.
//
/* ******************************************************************************** */
// var map=null;
var selectedPolygonStyle=null;
var highlightOptions = {fillColor: "#FFFFFF", strokeColor: "#FFFFFF", fillOpacity: 0.6, strokeWidth: 10};
var normalStyle = {fillColor: "#BDBDBD", strokeColor: "#424242", fillOpacity: 0.4, strokeWidth: 10};
var selectedStyle= {fillColor: "#2E2E2E", strokeColor: "#1C1C1C", fillOpacity: 0.6, strokeWidth: 10};
var minZoomLevel = 1.4;  

var map;
var geoXml = null;
var geoXmlDoc = null;
var world_ext = {
north: 85,
south: -85,
west: -179,
east: 179,
};
      function initMap() {
		  var mapOptions = {
			  zoom: minZoomLevel,
			  // center: new google.maps.LatLng(23.079732,17.226563),
			  center: new google.maps.LatLng(0,0),
			  restriction: {
				latLngBounds: world_ext,
				strictBounds: false,
			  },			  
			  mapTypeId: google.maps.MapTypeId.ROADMAP
		  };

		  map = new google.maps.Map(document.getElementById('map_canvas'),
			  mapOptions);

		  google.maps.event.addListenerOnce(map, 'idle', function(){
			map.setCenter(new google.maps.LatLng(23.079732,17.226563));
			map.setZoom(minZoomLevel);	
		  });
			  
	

      }
 
function setPageEvents(){

	$('input[id=tile-11]').change(function(){
		
		if($(this).is(':checked')) {
			
			$('#map_canvas').show();
			loadKmlOnMap();
			if(!$("#tile_name").val()){
				 $("#download-button").attr("disabled", "disabled");
			}			
		} else {
			$('#map_canvas').hide();
			deleteTileValue()
			$("#map_canvas").html("<img src='/theme/images/map-not-available.png'/>"); 
		}
	});  	
	$('input[id=tile-12]').change(function(){
		
		if($(this).is(':checked')) {
			$('#map_canvas').show();
			loadKmlCLI_30s();
			if(!$("#tile_name").val()){
				 $("#download-button").attr("disabled", "disabled");
			}			
		} else {
			$('#map_canvas').hide();
			deleteTileValue()
			$("#map_canvas").html("<img src='/theme/images/map-not-available.png'/>"); 
		}
	}); 	
	$('input[id=tile-13]').change(function(){
		
		if($(this).is(':checked')) {
			$('#map_canvas').show();
			loadKmlCLI_2_5min();
			if(!$("#tile_name").val()){
				 $("#download-button").attr("disabled", "disabled");
			}			
		} else {
			$('#map_canvas').hide();
			deleteTileValue()
			$("#map_canvas").html("<img src='/theme/images/map-not-available.png'/>"); 
		}
	}); 	
	$('input[id=tile-14]').change(function(){
		
		if($(this).is(':checked')) {
			$('#map_canvas').show();
			loadKmlCLI_5min();
			if(!$("#tile_name").val()){
				 $("#download-button").attr("disabled", "disabled");
			}			
		} else {
			$('#map_canvas').hide();
			deleteTileValue()
			$("#map_canvas").html("<img src='/theme/images/map-not-available.png'/>"); 
		}
	}); 
	$('input[id=tile-15]').change(function(){
		
		if($(this).is(':checked')) {
			$('#map_canvas').show();
			loadKmlCLI_10min();
			if(!$("#tile_name").val()){
				 $("#download-button").attr("disabled", "disabled");
			}			
		} else {
			$('#map_canvas').hide();
			deleteTileValue()
			$("#map_canvas").html("<img src='/theme/images/map-not-available.png'/>"); 
		}
	}); 	
}

 
function loadKmlOnMap(){ 
	initMap()
	geoXml = new geoXML3.parser({
			  map: map,
			  singleInfoWindow: true,
			  afterParse: useTheData
			});

	// geoXml.parse('http://localhost/tiled_marksim.kml');		
	geoXml.parse('/theme/kmls/tiled_marksim.kml');		
}
function loadKmlCLI_2_5min(){ 
	initMap()
	geoXml = new geoXML3.parser({
			  map: map,
			  singleInfoWindow: true,
			  afterParse: useTheDataTiled
			});

	geoXml.parse('/theme/kmls/cli_2_5m.kml');	
}
function loadKmlCLI_30s(){ 
	initMap()
	geoXml = new geoXML3.parser({
			  map: map,
			  singleInfoWindow: true,
			  afterParse: useTheDataTiled
			});

	geoXml.parse('/theme/kmls/cli_30s.kml');	
}  
function loadKmlCLI_5min(){ 
	initMap()
	geoXml = new geoXML3.parser({
			  map: map,
			  singleInfoWindow: true,
			  afterParse: useTheDataTiled
			});

	geoXml.parse('/theme/kmls/cli_5m.kml');	
}  


function loadKmlCLI_10min(){ 
	initMap()
	geoXml = new geoXML3.parser({
			  map: map,
			  singleInfoWindow: true,
			  afterParse: useTheDataTiled

			});
	geoXml.parse('/theme/kmls/cli_10m.kml');	
}  
  
function deleteTileValue(){
  $("#tile_name").attr("value", null);
}
  // $("#download-files[]").find("input").on("ifToggled", getFilesInfo);

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
	// changeMap2(evt)
  });
}
function createListenerTiled(poly,name,coor) {	
  google.maps.event.addListener(poly, "click", function(evt){
	// Creating the property to send as section property
    evt.target = {};
    evt.target["name"] = "tile";
    polygonClickEventTile(evt, poly,name);
	// changeMap2(evt)
  });
}
function createListenerMarker(marker,poly,name) {	
  google.maps.event.addListener(marker, "click", function(evt){

    ///// Creating the property to send as section property
    evt.target = {};
    evt.target["name"] = "tile";
    markerClickEvent(evt, marker,poly);
  });
}

function markerClickEvent(evt, marker,poly){
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

function polygonClickEvent(evt, poly){
    // Don't show the info window
    poly.infoWindow.close();

    // Setting the tile id in the hidden input
    $("#tile_name").val(poly.title);
	console.log(poly.title)
 
    if(selectedPolygonStyle != null){
      selectedPolygonStyle.setOptions(normalStyle);
      highlightPoly(selectedPolygonStyle);
    }
    selectedPolygonStyle=poly;    
    poly.setOptions(selectedStyle);
    google.maps.event.clearListeners(poly, 'mouseover');  
    google.maps.event.clearListeners(poly, 'mouseout');   

	tileNameVal = (  $("#tile_name").val() == "" ) ? undefined : "'" + $("#tile_name").val() + "'";
    // Look for the files available
	
	  var filesetId = $("input[name='download-files[]']:checked").val();
	// console.log(getArrayValues($("input[name='download-files[]']:checked")))

	// console.log($("#tile_name").val())
	if($("#tile_name").val()){
		 $("#download-button").removeAttr("disabled");
	}	
    // test();

}
function polygonClickEventTile(evt, poly,name){
    // Don't show the info window
    // poly.infoWindow.close();
 
    // Setting the tile id in the hidden input
    $("#tile_name").val(name);
	
    if(selectedPolygonStyle != null){
      selectedPolygonStyle.setOptions(normalStyle);
      highlightPoly(selectedPolygonStyle);
    }
    selectedPolygonStyle=poly;    
    poly.setOptions(selectedStyle);
    google.maps.event.clearListeners(poly, 'mouseover');  
    google.maps.event.clearListeners(poly, 'mouseout');   

	tileNameVal = (  $("#tile_name").val() == "" ) ? undefined : "'" + $("#tile_name").val() + "'";
    // Look for the files available
	
	  var filesetId = $("input[name='download-files[]']:checked").val();
	// console.log(getArrayValues($("input[name='download-files[]']:checked")))

	// console.log($("#tile_name").val())
	if($("#tile_name").val()){
		 $("#download-button").removeAttr("disabled");
	}	
    // test();

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
			createListenerMarker(geoXmlDoc.markers[i],geoXmlDoc.gpolygons[i],geoXmlDoc.placemarks[i].name);
		}		
	}
}
function useTheDataTiled(doc){
  // Geodata handling goes here, using JSON properties of the doc object
  geoXmlDoc = doc[0]; 
  if(geoXmlDoc.gpolygons!=undefined){
		for (var i = 0; i < geoXmlDoc.gpolygons.length; i++) {
			geoXmlDoc.gpolygons[i].setOptions(normalStyle);
			highlightPoly(geoXmlDoc.gpolygons[i]);
			// console.log(geoXmlDoc.placemarks[i].polygon.bounds.ia.j)
			createListenerTiled(geoXmlDoc.gpolygons[i],geoXmlDoc.placemarks[i].name,geoXmlDoc.placemarks[i].polygon.bounds);
			// createListenerMarker(geoXmlDoc.markers[i],geoXmlDoc.gpolygons[i],geoXmlDoc.placemarks[i].name);
		}		
	}
}
function getUserSelections(filterName){
  var tileNameVal;

  tileNameVal = (  $("#tile_name").val() == "" ) ? undefined : "'" + $("#tile_name").val() + "'";
  if(filterName=="extent"){tileNameVal= null}
	
  var data = {
    tileName: tileNameVal,
    section: filterName
  }
  
  return data;
}
function getFilesInfo(evt){
  var filterValues = getUserSelections($(evt.target).attr("name"));

}

function getArrayValues(array){
  var arr = new Array();
  $.each($(array), function () {
     arr.push($(this).val());
  });

  return arr.toString();
}

function test(){
console.log("hola")
}