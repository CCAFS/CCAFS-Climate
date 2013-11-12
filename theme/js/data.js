
$(document).ready(function(){
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

           
    // initializing map configuration.
    initializeMap();
  
    $("#searchSubmit").removeAttr("disabled");
    // FILE SET.
	
	//validate if cordex option is checked for the first layer on map
	if($("#fileSet-8").attr("checked")=="checked"){
		geoXml = new geoXML3.parser({
                    map: map,
                    singleInfoWindow: true,
                    afterParse: useTheData
                });
                geoXml.parse('http://ccafs-climate.local/theme/kmls/8.kml');				
	}
	
	// load on the map the selected layer(file set). Depending on the value of the radio button
	$("input[name='fileSet']").on('ifChecked', function(event){
		initializeMap();
		geoXml = new geoXML3.parser({
                 map: map,
                 singleInfoWindow: true,
                 afterParse: useTheData
				});
             geoXml.parse('http://ccafs-climate.local/theme/kmls/'+this.value+'.kml');			
	});	
	map.setCenter(new google.maps.LatLng(19.3, 18.6));
});


var map;
var highlightOptions = {fillColor: "#FFFF00", strokeColor: "#000000", fillOpacity: 0.4, strokeWidth: 10};
var normalStyle = {fillColor: "#FF0000", strokeColor: "#000000", fillOpacity: 0.4, strokeWidth: 10};
// function initialize map
function initializeMap() {
    var mapOptions = {
        zoom: 2,
        center: new google.maps.LatLng(38, 4.5),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);
				
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
function createListener(poly) {
	google.maps.event.addListener(poly,"click",function() {
      poly.setOptions(highlightOptions);	  
    });
}

// function to manage the data into the kml files
function useTheData(doc){
  // Geodata handling goes here, using JSON properties of the doc object
  geoXmlDoc = doc[0];
  if(geoXmlDoc.gpolygons!=undefined){
		for (var i = 0; i < geoXmlDoc.gpolygons.length; i++) {
			geoXmlDoc.gpolygons[i].setOptions(normalStyle);
			highlightPoly(geoXmlDoc.gpolygons[i]);
			createListener(geoXmlDoc.gpolygons[i]);
		}
		map.setZoom(1);
	}
}
/* Apply a custom KML to the map */
