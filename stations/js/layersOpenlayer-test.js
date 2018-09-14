
			// A control class for capturing click events. Sirve cuando se da click derecho deseleciona los features y desactiva el boton seleccionar - selectControl
			OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {                
				defaultHandlerOptions: {
				'single': true,
				'double': true,
				'pixelTolerance': 0,
				'stopSingle': false,
				'stopDouble': false
				},
				handleRightClicks:true,
				initialize: function(options) {
				this.handlerOptions = OpenLayers.Util.extend(
				{}, this.defaultHandlerOptions
				);
				OpenLayers.Control.prototype.initialize.apply(
				this, arguments
				); 
				this.handler = new OpenLayers.Handler.Click(
				this, this.eventMethods, this.handlerOptions
				);
				},
				CLASS_NAME: "OpenLayers.Control.Click"
			}); // fin click events
			
            var colorsCluster = {
			    one: "rgb(0, 0, 0)",
                low: "rgb(78, 32, 218)",//"rgb(181, 226, 140)" 
                middle: "rgb(241, 211, 87)", 
                high: "rgb(253, 156, 115)"
            };
            var colors = {
			    one: "rgb(0, 0, 0)",
                low: "rgb(181, 226, 140)", 
                middle: "rgb(241, 211, 87)", 
                high: "rgb(253, 156, 115)"
            };           
            // Define three rules to style the cluster features.
// var filter = new OpenLayers.Filter.Function({
    // evaluate: function(attributes) {
        // return attributes.baz.dolor === 'sit';
    // }
// });			
			
            var oneRule = new OpenLayers.Rule({
                filter: new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.LESS_THAN,
                    property: "count",
                    value: 2
                }),
				// filter: new OpenLayers.Filter.FeatureId({
					// evaluate: function(feature) {
						// console.log(feature.cluster[0].attributes.institute)
						// if(feature.cluster[0].attributes.institute==1){

							// return "red";
						// }
						// if(feature.cluster[0].attributes.institute==6){

							// return "blue";
						// }						
					// }
				// }),				
                symbolizer:{
                    fillColor: "${styleFunction}",
                    fillOpacity: 0.9, 
					labelYOffset: -15, // no efunciona cuando se usa renderers: ['Canvas','SVG']
					labelAlign:'cb', // lb,cb,rb,cm
                    strokeColor: "#ff0000", //"#00FF00",//colorsCluster.low,
                    strokeOpacity: 0.3,
                    strokeWidth: 1,
                    pointRadius: 5,
                    label: "${label}",
                    labelOutlineWidth:0.5,
                    fontColor: "black",//"#ffffff",
                    fontOpacity: 0.8,
					fontFamily: "Trebuchet MS",
					fontWeight: "bold",					
                    fontSize: "11px",
					labelOutlineColor:"#0B3B0B"
                }
            });			
			// var instRule = new OpenLayers.Rule({
				// filter: new OpenLayers.Filter.Comparison({
					// type: OpenLayers.Filter.Comparison.EQUAL_TO,
					// property: "institute",
					// value: 6
				// }),
				// symbolizer: {
					// fillColor: "red",
					// fillOpacity: 0.9, 
					// strokeColor: colorsCluster.low,
					// strokeOpacity: 0.3,
					// strokeWidth: 5,
					// pointRadius: 5,
					// label: "${count}",
					// labelOutlineWidth:0.5,
					// fontColor: "#ffffff",
					// fontOpacity: 0.8,
					// fontSize: "12px"
				// }			
			 // });
            var lowRule = new OpenLayers.Rule({
                filter: new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.BETWEEN,
                    property: "count",
                    lowerBoundary: 2,//2,//2,
                    upperBoundary: 15//4//15
                }),
                symbolizer: {
                    fillColor: colorsCluster.low,
                    fillOpacity: 0.9, 
                    strokeColor: colorsCluster.low,
                    strokeOpacity: 0.5,
                    strokeWidth: 12,
                    pointRadius: 10,
                    label: "${count}",
                    labelOutlineWidth:0.8,
                    fontColor: "#ffffff",
                    fontOpacity: 0.8,
                    fontSize: "12px"
                }
            });
            var middleRule = new OpenLayers.Rule({
                filter: new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.BETWEEN,
                    property: "count",
                    lowerBoundary: 15,//4,//15,
                    upperBoundary: 50//8//50
                }),
                symbolizer: {
                    fillColor: colorsCluster.middle,
                    fillOpacity: 0.9, 
                    strokeColor: colorsCluster.middle,
                    strokeOpacity: 0.5,
                    strokeWidth: 12,
                    pointRadius: 15,
                    label: "${count}",
                    labelOutlineWidth: 0.8,
                    fontColor: "#ffffff",
                    fontOpacity: 0.8,
                    fontSize: "12px"
                }
            });
            var highRule = new OpenLayers.Rule({
                filter: new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.GREATER_THAN,
                    property: "count",
                    value: 50//8//50
                }),
                symbolizer: {
                    fillColor: colorsCluster.high,
                    fillOpacity: 0.9, 
                    strokeColor: colorsCluster.high,
                    strokeOpacity: 0.5,
                    strokeWidth: 12,
                    pointRadius: 20,
                    label: "${count}",
                    labelOutlineWidth: 0.8,
                    fontColor: "#ffffff",
                    fontOpacity: 0.8,
                    fontSize: "12px"
                }
            });		
			
			context= {
				// evaluate: function(attributes) {
					// return attributes.baz.dolor === 'sit';
				// },		
				styleFunction: function(feature) {
					// console.log(feature)
					var size =clusters.features.length
					var count =feature.attributes.count
					
					if(feature.cluster[0].attributes.institute==1){
						return "blue"
					}
					if(feature.cluster[0].attributes.institute==6){
						return "red"
					}					
					if(feature.cluster[0].attributes.institute==5){
						return "black"
					}
					if(feature.cluster[0].attributes.institute==7){
						return "green"
					}
					if(feature.cluster[0].attributes.institute==8){
						return "DarkOrange"
					}	
					if(feature.cluster[0].attributes.institute==9){
						return "gray"
					}	
					if(feature.cluster[0].attributes.institute==10){
						return "purple"
					}	
					if(feature.cluster[0].attributes.institute==11){
						return "brown"
					}					
					// if (count < 2) {
						// return "blue";
					// }else{
						// return "red"
					// }
				},
				// label:{}

				
				// width: function(feature) {
					// return (feature.cluster) ? 2 : 1;
				// },
				// radius: function(feature) {
					// var pix = 2;
					// if(feature.cluster) {
						// pix = Math.min(feature.attributes.count, 7) + 2;
					// }
					// return pix;
				// }
			}	
			
			var template = {
				// pointRadius: "${radius}",
				// pointRadius: 5,
				// fillColor: "${styleFunction}",
				fillColor: "red",
				// fillOpacity: 0.8,
				label: "${label}",
				fontFamily: "Trebuchet MS",
				fontWeight: "bold",
				// strokeColor: "#00FF00",
				// strokeWidth: 1,
				// labelOutlineColor: "white",
				// labelOutlineWidth: 1	
			};				
			onLabel=function(feature) {
				return feature.cluster[0].attributes.name;
			}
			onLabel2=function(feature) {
				return feature.cluster[0].attributes.code;
			}			
			onLabel3=function(feature) {
				return feature.cluster[0].attributes.id;
			}			
			onLabel4=function(feature) {
				return feature.cluster[0].attributes.elev;
			}			
			onLabel5=function(feature) {
				return feature.cluster[0].attributes.estado;
			}	
			context["label"]=onLabel3

				
			map = new OpenLayers.Map('map');
			var base = new OpenLayers.Layer.WMS("OpenLayers WMS", 
				 "http://vmap0.tiles.osgeo.org/wms/vmap0",
				{layers: 'basic'}
			);
			
			var osm = new OpenLayers.Layer.OSM({layers: 'basic'})
			// var base = new OpenLayers.Layer.OSM();
			// map.addControl(new OpenLayers.Control.LayerSwitcher());
			// map.addControl(new OpenLayers.Control.MousePosition());
			
		

			// var style = new OpenLayers.Style(template, { context: context});
			
			var style = new OpenLayers.Style(null, {
				rules: [oneRule, lowRule, middleRule, highRule],context: context }
			);  
		
			strategy = new OpenLayers.Strategy.Cluster({distance: 40}); //
			

			var clusters = new OpenLayers.Layer.Vector("Stations", {
				projection: new OpenLayers.Projection("EPSG:4326"),
				displayProjection: new OpenLayers.Projection("EPSG:900913"),					 
				protocol: new OpenLayers.Protocol.HTTP({
					url: "php/Geo_statByregion-test.php",
					params : { type:4},
					format: new OpenLayers.Format.GeoJSON()
				}),
				// renderers: ['Canvas','SVG'],
				strategies: [new OpenLayers.Strategy.Fixed(),strategy],
				isBaseLayer: false,
				styleMap:  new OpenLayers.StyleMap({
						"default": style					
						// "select": {
							// fillColor: "#8aeeef",
							// strokeColor: "#32a8a9"
						// }
					})
			});	

			clusters.events.on({"loadend": function(){ //layerTemp.events.register("featuresadded",layerTemp,function(){console.log(layerTemp.features.length)});	
				var bounds = clusters.getDataExtent();
				if(bounds){ mapPanel.map.panTo(bounds.getCenterLonLat()); mapPanel.map.zoomToExtent(bounds); }
				
			}})	
			
			var gsat = new OpenLayers.Layer.Google(
				"Google Satellite",
				{type: google.maps.MapTypeId.SATELLITE, numZoomLevels: 22}
			);
			var gphy = new OpenLayers.Layer.Google(
				"Google Physical",
				{type: google.maps.MapTypeId.TERRAIN} //, visibility: false
			);
			var gmap = new OpenLayers.Layer.Google(
				"Google Streets", // the default
				{numZoomLevels: 20} //, visibility: false
			);
			var ghyb = new OpenLayers.Layer.Google(
				"Google Hybrid",
				{type: google.maps.MapTypeId.HYBRID, numZoomLevels: 22} //, visibility: false
			);			
			
// label:function(feature) {
	// return feature.cluster[0].attributes.name;
// }


// clusters.styleMap.styles.default.defaultStyle.label = '';
// haloLayerLayer.redraw();    



			// console.log(clusters)
			
			// var geocapa = new OpenLayers.Layer.Vector("Search region", {
				// projection: new OpenLayers.Projection("EPSG:4326"),
				// displayProjection: new OpenLayers.Projection("EPSG:900913"),						
				// strategies: [new OpenLayers.Strategy.Fixed()],
				// protocol: new OpenLayers.Protocol.HTTP({
					// url: "php/Geo_statByregion.php",
					// callbackKey: 'callback',
					// params : { type:1,country : country, state:state, municip:municip},
					// format: new OpenLayers.Format.GeoJSON()
				// }),
				// renderers: ['Canvas','SVG'],
				// styleMap:  new OpenLayers.StyleMap(styleTempRegion)
				
			// });
			// mapPanel.map.addLayer(geocapa)
			// layerTemp=mapPanel.map.getLayersByName("Search region")[0]
			// layerTemp.events.on({"loadend": function(){ //layerTemp.events.register("featuresadded",layerTemp,function(){console.log(layerTemp.features.length)});	
				// var bounds = layerTemp.getDataExtent();
				// if(bounds){ mapPanel.map.panTo(bounds.getCenterLonLat()); mapPanel.map.zoomToExtent(bounds); }
			// }})			