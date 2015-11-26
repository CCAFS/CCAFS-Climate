$(document).ready(function() {
//  $('.range-slider').jRange({
//    from: 0,
//    to: 100,
//    step: 1,
//    scale: [0,25,50,75,100],
//    format: '%s',
//    width: 300,
//    showLabels: true,
//    isRange : true
//});

//$("#example_id").ionRangeSlider();

$("#period").ionRangeSlider({
    type: "double",
    min: 2015,
    max: 2100,
    from: 2015,
    to: 2039,
    drag_interval: true
});
$("#periodh").ionRangeSlider({
    type: "double",
    min: 1980,
    max: 2010,
    from: 1985,
    to: 1990,
    drag_interval: true
});
//***********************************VIDEO******************************	
  $(".messagepop").hide();

  $(function() {

    $('#tutoVideo a').on('click', function() {

      $('#frameMain_video').dialog({
        height: 470,
        width: 550,
        minWidth: 200,
        minHeight: 200,
        modal: true,
        closeOnEscape: false,
        open: function(event, ui) {
          ////Close dialog when outside is clicked
          $('.ui-widget-overlay').bind('click', function() {
            $("#frameMain_video").dialog('close');
          });
        },
        close: function() {
          $(this).dialog('destroy');
        }
      });

      return false;
    });

  });

//*****************************************************************	
  initializeICheckSettings();
  initializeMap();
  setPageEvents();
  
  $("#lat").on("change", function (evt){
    var lat = ($(this).val() != "")?$(this).val():0;
    var lon = ($("#lon").val() != "" )?$("#lon").val():0;
    markerSync(parseFloat(lat),parseFloat(lon));
    validCoordinate(parseFloat(lat),parseFloat(lon));
  });
  
  $("#lon").on("change", function (evt){
    var lon = ($(this).val() != "")?$(this).val():0;
    var lat = ($("#lat").val() != "" )?$("#lat").val():0;
    markerSync(parseFloat(lat),parseFloat(lon));
    validCoordinate(parseFloat(lat),parseFloat(lon));
  });

  // Make the accordion effect on elements at left
  $(".inputs-ac").on("click", function() {
    var elementClicked = this;
    $(elementClicked).find("span").addClass("selected");

    // Le quitamos la seleccion a los demas elementos
    $(".inputs-ac").each(function() {
      if ($(this).attr("id") != $(elementClicked).attr("id")) {
        $(this).find("span").removeClass("selected");
      }
    });
  });
});

/**
 * This function initialize the settings for 
 * plugin iCheck, responsible to give style to
 * radioButtons and checkboxes.
 */
function initializeICheckSettings() {

  // initializing iCheck Settings

  $('.ac-large input').iCheck({
    checkboxClass: 'icheckbox_minimal',
    radioClass: 'iradio_minimal',
    increaseArea: '20%'
  });

  $('.ac-large2 input').each(function() {
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

  $('.bloc input').iCheck({
    checkboxClass: 'icheckbox_flat',
    radioClass: 'iradio_flat'
  });
  $('.blocl input').iCheck({
    checkboxClass: 'icheckbox_flat',
    radioClass: 'iradio_flat'
  });
  $('.bloc-e input').iCheck({
    checkboxClass: 'icheckbox_flat',
    radioClass: 'iradio_flat'
  });

  $('#fileSet-8').iCheck('disable');
  $('label[for=fileSet-8]').addClass("disabled");
}

/**
 * This function set the events for the elements of the page.
 */
function setPageEvents() {

  $("#fileSet-filters").find("input")
          .on("ifChecked", getFilesInfo)
          .on("ifToggled", adjustFiltersOnFileSetSelection);
  /*.on("ifClicked", changeMap);*/
  $("#scenario-filters").find("input").on("ifToggled", getFilesInfo);
  $("#model-filters").find("input").on("ifToggled", getFilesInfo);
  $("#method-filters").find("input").on("ifToggled", getFilesInfo);
  $("#format-filters").find("input").on("ifToggled", getFilesInfo);
  $("#variable-filters").find("input").on("ifToggled", getFilesInfo);
  $("#observation-filters").find("input").on("ifToggled", getFilesInfo);

  // Select/De-select all option in model filter
//  $("model-999").on("ifToggled", selectAllModelOptionsEvent);
}

function validateForm () {
  var fields = $("#formSearch :input");
//  fields.keyup(function() {
    var emptyFields = fields.filter(function() {

      // remove the $.trim if whitespace is counted as filled
      return $.trim(this.value) === "";
    });
    if (!emptyFields.length && fillout) {
      $("#searchSubmit").removeAttr("disabled");
      $("#searchSubmit").removeClass("disable");
      $("#filesFound").text("");
    } else {
      $("#searchSubmit").attr("disabled", "disabled");
      $("#searchSubmit").addClass("disable");
      $("#filesFound").text("You forgot to fill something out");
    }
//  });
}

function removePageEvents() {

  $("#fileSet-filters").find("input")
          .off("ifToggled", getFilesInfo)
          .off("ifChecked", getFilesInfo);
  /*.off('ifChecked', changeMap);*/

  $("#scenario-filters").find("input").off("ifToggled", getFilesInfo);
  $("#model-filters").find("input").off("ifToggled", getFilesInfo);
//  $("#extent-filters").find("input").off("ifToggled", getFilesInfo);
  $("#format-filters").find("input").off("ifToggled", getFilesInfo);
//  $("#period-filters").find("input").off("ifToggled", getFilesInfo);
  $("#variable-filters").find("input").off("ifToggled", getFilesInfo);
//  $("#resolution-filters").find("input").off("ifToggled", getFilesInfo);
//  $("#extent-filters").find("input").off("ifToggled", getFilesInfo);


  // Select/De-select all option in model filter
  $("#model-999").off("ifToggled", selectAllModelOptionsEvent);
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
function deleteTileValue() {
  $("#tile_name").attr("value", null);
}

// function changeMap2(evt){

// }

function changeMap(evt) {
  var filterValues = $(evt.target).attr("id")
  var extentValue = $("[name='extent']:checked").val();
  var variables = getArrayValues($("input[name='variables\\[\\]']:checked"));
  var scenarios = getArrayValues($("[name='scenarios\\[\\]']:checked"));
  var model = getArrayValues($("input[name='model\\[\\]']:checked"));
  var period = getArrayValues($("input[name='period\\[\\]']:checked"));
  var section = $(evt.target).attr("name");

  if (filterValues == "extent-2" || extentValue == 2) {
    if (!$("#tile_name").val() && !variables && !scenarios && !model && !period) {
      loadKmlOnMap();
    }
  }
  else {
    deleteTileValue()
    $("#map-canvas").html("<img src='/theme/images/map-not-available.png'/>");
  }

  // if(extentValue == 1){ // Global
  // deleteTileValue()
  // $("#map-canvas").html("<img src='/theme/images/map-not-available.png'/>");
  // } else if(extentValue == 2){ // Regional
  // if(!$("#tile_name").val() && !variables && !scenarios && !model && !period){
  // loadKmlOnMap();
  // }
  // } else {// If it is not defined, 
  // $("#line-radio-1").iCheck('check');     
  // $("#map-canvas").html("<img src='/theme/images/map-not-available.png'/>");
  // }

}

function adjustFiltersOnFileSetSelection() {
  var fileSetSelected = $("input[name='fileSet']:checked").attr("id");

  deleteTileValue();
  uncheckAllInputs();

  // Select again the fileset
  $("#" + fileSetSelected).attr("checked", true);
}

function adjustFiltersOnExtentSelection() {
  var ResolutionSelected = $("input[name='resolution']:checked").attr("id");

  // console.log(variables)
  deleteTileValue();
  $("#" + ResolutionSelected).attr("checked", false);
  $("#" + ResolutionSelected).iCheck('update');

  $("input[id^='variable']").attr("checked", false);
  $("input[id^='variable']").iCheck('update');

  $("input[id^='model']").attr("checked", false);
  $("input[id^='model']").iCheck('update');

  // $("input[id^='format']").attr("checked", false);
  // $("input[id^='format']").iCheck('update');   
  if ($("#format-2").attr("checked") == "checked") {
    $("#format-2").attr("checked", false);
    $("#format-2").iCheck('update');
  }

  $("input[id^='scenario']").attr("checked", false);
  $("input[id^='scenario']").iCheck('update');

  $("input[id^='period']").attr("checked", false);
  $("input[id^='period']").iCheck('update');

}

/*
 This function checks if option "Select all options"
 in Model filter was pressed
 */
function selectAllModelOptionsEvent(evt) {
  var element = evt.target;

  // Disable temporary the toggled event
  $("input[name='model\\[\\]']").off("ifToggled", getFilesInfo);

  if ($(element).attr("checked") == "checked") {
    $("input[name='model\\[\\]']").iCheck('check');
  } else {
    $("input[name='model\\[\\]']").iCheck('uncheck');
  }

  // Enable again the toggled event
  $("input[name='model\\[\\]']").on("ifToggled", getFilesInfo);
  // Trigger the toggled event 
  $("input[name='model\\[\\]']").first().trigger("ifToggled");
}

function getFilesInfo(evt) {
  var nameEven = $(evt.target).attr("name");
  var filterValues = getUserSelections(nameEven);
  if (nameEven == 'observation') {
//    $("#observation-acronym").val($(evt.target).val())
  }
  // console.log(filterValues.filesetId)
  // Hide the help icon 

//  if (filterValues.filesetId == 4 && filterValues.extendId == 2) {
//    filterValues.formatId = 1;
//  }
//  if (filterValues.filesetId == 12 && filterValues.extendId == 2) {
//    filterValues.formatId = 1;
//  }
  if ($(evt.target).parent().prev().hasClass("help_icon")) {
    $(evt.target).parent().prev().hide();
  }
  $.ajax({
    type: "POST",
    dataType: "json",
    url: "/ajax/data-file-info-bias.php",
    data: filterValues,
    beforeSend: function() {
      // Hide the help icon if exists
      var help_icon_element = $("#help_icon_" + $(evt.target).attr("name").replace('[', '').replace(']', ''));
      if ($(help_icon_element).length > 0) {
        $(help_icon_element).hide();
      }
      $(".loader").show();
      // Hide the files found text
      $("#filesFound").hide();
      // Show the loader gif
    },
    success: function(data) {
      $(".loader").hide();
      if (data != null) {
        if (data.filesFound < 0) {
//          $("#filesFound").text("0 files found");
//          $("#searchSubmit").attr("disabled", "disabled");
//          $("#searchSubmit").addClass("disable");
        } else {
          if (data.filesFound == 0) {
//            $("#searchSubmit").attr("disabled", "disabled");
//            $("#searchSubmit").addClass("disable");
            $("#searchSubmit").removeAttr("disabled");
            $("#searchSubmit").removeClass("disable");
          } else {
            $("#searchSubmit").removeAttr("disabled");
            $("#searchSubmit").removeClass("disable");
          }
          // update files found text
          if (data.filesFound == 1) {
//            $("#filesFound").text("1 file found");
          } else {
//            $("#filesFound").text(data.filesFound + " files found");
          }

          // Show filter description if exists 
          $.each(data.description, function(id, descriptionText) {
            if (descriptionText != null) {
              var elementId = $(evt.target).attr("id");
              var elementIdPrefix = elementId.substring(0, elementId.lastIndexOf("-") + 1);

              var helpIcon = $("#" + elementIdPrefix + id).parent().prev().show();
              $(helpIcon).attr("title", descriptionText);
              $(helpIcon).tipTip({
                activation: "click",
                keepAlive: true,
                maxWidth: "400px",
                defaultPosition: "right"
              });

            }
          });
          //$("#filesFound1").val(data.filesFound);
        }
      } else {
//        $("#filesFound").text("0 files found");
        $("#searchSubmit").attr("disabled", "disabled");
        $("#searchSubmit").addClass("disable");
      }


      // if(filterValues.section == 'fileSet' || filterValues.section == 'extent' || filterValues.section == 'scenarios[]' ){
//      if (filterValues.filesetId == 12 || filterValues.filesetId == 4) {
//        data.filtersAvailable.extent = "1,2"
//      }
//      // }
//
//      // if(filterValues.section == 'fileSet' || filterValues.section == 'extent'){
//      if (filterValues.filesetId == 4 && filterValues.extendId == 1) {
//        deleteTileValue()
//      }
//      if (filterValues.filesetId == 12 && filterValues.extendId == 1) {
//        deleteTileValue()
//      }
//
//      if (filterValues.filesetId == 12 && filterValues.extendId == 1) {
//        data.filtersAvailable.format = "1,2"
//      }
//      if (filterValues.filesetId == 4 && filterValues.extendId == 1) {
//        data.filtersAvailable.format = "1,2"
//      }
      // if(filterValues.filesetId ==4 && filterValues.extendId==2){ 
      // $("#format-2").iCheck("uncheck");
      // $("#format-2").iCheck("enable");
      // }  
      // if(filterValues.filesetId ==12 && filterValues.extendId==2){ 
      // $("#format-2").iCheck("uncheck");
      // $("#format-2").iCheck("enable");
      // } 

//      updateFilters(data.filtersAvailable);


      // }
//      changeMap(evt);
      $("#filesFound").show();
    }
  });
  validateForm();
}

function uncheckAllInputs() {
  $("input").attr("checked", false);
  $("input").iCheck('update');
}

/**
 * According to the filters selected the others filters
 * are disabled/enabled.
 * 
 * @param  {array} $filtersAvailable contains an associative 
 *                 arrray with pairs: 
 *                 "filterName" => "inputs available comma separated" 
 */
function updateFilters(filtersAvailable) {
  $.each(filtersAvailable, function(filter, inputsIds) {
    // Deshabilitamos los eventos temporalmente para
    // evitar dispararlos
    removePageEvents();
    if (inputsIds) {
      var arrayInputsIds = inputsIds.split(",");
      $("input[id^='" + filter + "']").iCheck("disable");

      $.each(arrayInputsIds, function(index, id) {
        $("#" + filter + "-" + id).iCheck("enable");
      });

      if (arrayInputsIds.length == 1) {
        $("#" + filter + "-" + arrayInputsIds[0]).iCheck("check");
      }
    }

    // Habilitamos los eventos nuevamente
    setPageEvents();
    // changeMap();
  });
}


/**
 * This function return all the options selected by the user in 
 * an object.
 * 
 * @param  filterName - Name of the filter that trigger the event
 * @return an object with the values selected by the user.
 */
function getUserSelections(filterName) {
  var scenarios, model, period,variables,formats,method,observation;
  fillout = true;
  scenarios = getArrayValues($("[name='scenarios\\[\\]']:checked"));
  model = getArrayValues($("input[name='model\\[\\]']:checked"));
  period = getArrayValues($("input[name='period\\[\\]']:checked"));
  variables = getArrayValues($("input[name='variables\\[\\]']:checked"));
  formats = getArrayValues($("input[name='formats\\[\\]']:checked"));
  method = $("input[name='method']:checked").val();
  observation = $("input[name='observation']:checked").val();
  if(scenarios.length == 0) {
    fillout = false;
    return;
  }  
  if (model.length == 0) {
    fillout = false;
    return;
  }  
  if (variables.length == 0) {
    fillout = false;
    return;
  } 
  if (formats.length == 0) {
//    fillout = false;
  } 
  if (typeof method == 'undefined') {
    fillout = false;
    return;
  } 
  if (typeof observation == 'undefined') {
    fillout = false;
    return;
  }
//  tileNameVal = ($("#tile_name").val() == "") ? undefined : "'" + $("#tile_name").val() + "'";
//  if (filterName == "extent") {
//    tileNameVal = null
//  }

  var data = {
    coordinate: $("#lat").val()+","+$("#lon").val(),
    methodId: method,
    modelId: model,
    formatId: formats,
    scenarioId: scenarios,
    periodId: period,
    variableId: variables,
    observation: observation,
    filesetId: $("input[name='fileSet']:checked").val(),
    section: filterName
  }

  // console.log(data)

  return data;
}

/**
 * This function takes an array of objects and return a string
 * with the value of each element.
 * 
 * @param  array
 * @return a String with values.
 */
function getArrayValues(array) {
  var arr = new Array();
  $.each($(array), function() {
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
var map = null;
var selectedPolygonStyle = null;
var highlightOptions = {fillColor: "#FFFFFF", strokeColor: "#FFFFFF", fillOpacity: 0.6, strokeWidth: 10};
var normalStyle = {fillColor: "#BDBDBD", strokeColor: "#424242", fillOpacity: 0.4, strokeWidth: 10};
var selectedStyle = {fillColor: "#2E2E2E", strokeColor: "#1C1C1C", fillOpacity: 0.6, strokeWidth: 10};
var minZoomLevel = 1;
var marker = null;
var fillout = false;

// function initialize map
function initializeMap() {
  var mapOptions = {
    zoom: minZoomLevel,
    center: new google.maps.LatLng(23.079732, 17.226563),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    draggableCursor:'crosshair'
  };

  map = new google.maps.Map(document.getElementById('map-canvas'),
          mapOptions);

  google.maps.event.addListenerOnce(map, 'idle', function() {
    map.setCenter(new google.maps.LatLng(23.079732, 17.226563));
    map.setZoom(minZoomLevel);
  });

  google.maps.event.addListener(map, 'click', function(event) {
    var image = '/theme/images/targetred.png';
    if (marker) {
      marker.setMap(null);
    }
    marker = new google.maps.Marker({
      position: event.latLng,
      map: map,
//      icon: image
    });
//    console.log(event.latLng.lat() + ', ' + event.latLng.lng());
    $('#bias_point').text(event.latLng.lat().toFixed(4) + ', ' + event.latLng.lng().toFixed(4));
    $('#lat').val(event.latLng.lat().toFixed(4));
    $('#lon').val(event.latLng.lng().toFixed(4));
    validCoordinate (event.latLng.lat(), event.latLng.lng());
    validateForm ();
  });
}

function markerSync (lat, lon) {
  if (marker) {
    marker.setMap(null);
  }
  marker = new google.maps.Marker({
    position: {lat: lat, lng: lon},
    map: map
  });
}

//function to load the kml once the user changes file setz
function loadKmlOnMap() {

  initializeMap();
  var filesetId = $("input[name='fileSet']:checked").val();
  var kmlName = "";

  switch (filesetId) {
    case "4":  // IPCC 4AR (CIAT)
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

    case "12":  // IPCC 5AR (CIAT)
      kmlName = "tiled_cmip5";
      break;
  }

  if (kmlName != "") {
    geoXml = new geoXML3.parser({
      map: map,
      singleInfoWindow: true,
      afterParse: useTheData
    });

    geoXml.parse('/theme/kmls/' + kmlName + '.kml');
  }
}

//function for mouseover and mouse out
function highlightPoly(poly) {
  google.maps.event.addListener(poly, "mouseover", function() {
    poly.setOptions(highlightOptions);
  });
  google.maps.event.addListener(poly, "mouseout", function() {
    poly.setOptions(normalStyle);
  });

}

//function for events onclick over each polygon
function createListener(poly, name) {
  google.maps.event.addListener(poly, "click", function(evt) {

    // Creating the property to send as section property
    evt.target = {};
    evt.target["name"] = "tile";
    polygonClickEvent(evt, poly);
    // changeMap2(evt)
  });
}

function createListenerMarker(marker, poly, name) {
  google.maps.event.addListener(marker, "click", function(evt) {

    ///// Creating the property to send as section property
    evt.target = {};
    evt.target["name"] = "tile";
    markerClickEvent(evt, marker, poly);
  });
}

function markerClickEvent(evt, marker, poly) {
  // Don't show the info window
  poly.infoWindow.close();

  // Setting the tile id in the hidden input
  $("#tile_name").val(poly.title);

  if (selectedPolygonStyle != null) {
    selectedPolygonStyle.setOptions(normalStyle);
    highlightPoly(selectedPolygonStyle);
  }
  selectedPolygonStyle = poly;
  poly.setOptions(selectedStyle);
  google.maps.event.clearListeners(poly, 'mouseover');
  google.maps.event.clearListeners(poly, 'mouseout');

  // Look for the files available
  getFilesInfo(evt);

}

function polygonClickEvent(evt, poly) {
  // Don't show the info window
  poly.infoWindow.close();

  // Setting the tile id in the hidden input
  $("#tile_name").val(poly.title);

  // console.log(evt);

  if (selectedPolygonStyle != null) {
    selectedPolygonStyle.setOptions(normalStyle);
    highlightPoly(selectedPolygonStyle);
  }
  selectedPolygonStyle = poly;
  poly.setOptions(selectedStyle);
  google.maps.event.clearListeners(poly, 'mouseover');
  google.maps.event.clearListeners(poly, 'mouseout');

  // Look for the files available
  getFilesInfo(evt);

}

// function to manage the data into the kml files
function useTheData(doc) {
  // Geodata handling goes here, using JSON properties of the doc object
  geoXmlDoc = doc[0];

  if (geoXmlDoc.gpolygons != undefined) {
    for (var i = 0; i < geoXmlDoc.gpolygons.length; i++) {
      geoXmlDoc.gpolygons[i].setOptions(normalStyle);
      highlightPoly(geoXmlDoc.gpolygons[i]);
      createListener(geoXmlDoc.gpolygons[i], geoXmlDoc.placemarks[i].name);
      createListenerMarker(geoXmlDoc.markers[i], geoXmlDoc.gpolygons[i], geoXmlDoc.placemarks[i].name);


    }
  }
}

function validCoordinate (lat, lon) {
  var geocoder = new google.maps.Geocoder;
  var latlng = {lat: lat, lng: lon};
//  var result = true;
//  return "1";
  geocoder.geocode({'location': latlng}, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      if (results[1]) {
        if (!fillout){
          $("#searchSubmit").attr("disabled", "disabled");
          $("#searchSubmit").addClass("disable");
          $("#filesFound").text("You forgot to fill something out");
        } else {
          $("#searchSubmit").removeAttr("disabled");
          $("#searchSubmit").removeClass("disable");
          $("#filesFound").text("");
        }
      } else {
        $("#searchSubmit").attr("disabled", "disabled");
        $("#searchSubmit").addClass("disable");
        $("#filesFound").text("Please select a valid coordinate on continent");
      }
    } else {
      $("#searchSubmit").attr("disabled", "disabled");
      $("#searchSubmit").addClass("disable");
      $("#filesFound").text("Please select a valid coordinate on continent");
    }
  });
//  return result;
}

/* Apply a custom KML to the map */

/* ******************************************************************************** */
//                               End of map functions
/* ******************************************************************************** */