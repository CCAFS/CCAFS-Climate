
$(document).ready(function(){
    // initializing map configuration.
    initializeMap();
    // applying a kml to the map.
    applyKML("http://www.ccafs-climate.org/theme/kmls/globalKml1.kml");
    //applyKML("https://dl.dropboxusercontent.com/u/28296257/temp/cordex.kml");
    
    $("#searchSubmit").removeAttr("disabled");
    // FILE SET.
    $("input[name='fileSet']").change(function(event) {
        console.log($(event.target));
    });
});
var map;
function initializeMap() {
    var mapOptions = {
        zoom: 1,
        center: new google.maps.LatLng(38, 4.5),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);
}

/* Apply a custom KML to the map */
function applyKML(publicUrl) {
    var kml = new google.maps.KmlLayer(publicUrl);
    //var kml = new google.maps.KmlLayer("https://dl.dropboxusercontent.com/u/42719711/globalKml1.kml");
    kml.setMap(map);
    
    /*google.maps.event.addListener(map, 'click', function(event) {
        alert(event.latLng);    
    });*/
}

 
