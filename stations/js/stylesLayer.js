	var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
		renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;	
	
	icons='iconosGIS/'
	symbStatIntercep= icons+"map-marker-icon.png"//"bloqF_24px.png"
	symbStatSel= icons+"bloqE_16px.png"
	graphicSize=16
	symbLocation= icons+"bloqF_24px2.png"
	var rulesStat = [
		new OpenLayers.Rule({
			title: "Interc. Station",
			symbolizer: {
				externalGraphic: symbStatIntercep,
				pointRadius: 8,
				graphicHeight: graphicSize,
				graphicWidth: graphicSize,
				// graphicYOffset: -24,									
				fillColor: "#99ccff",
				// label:"${id}",
				fontFamily: "Trebuchet MS",
				fontWeight: "bold",
				strokeColor: "#00FF00",
				strokeWidth: 3,
				labelOutlineColor: "white",
				labelYOffset: graphicSize+5,
				labelOutlineWidth: 3	
			}			

		})
	];	
	var rulesStatSel = [
		new OpenLayers.Rule({
			title: "Interc. Station",
			symbolizer: {
				externalGraphic: symbStatSel,
				pointRadius: 8,
				graphicHeight: graphicSize,
				graphicWidth: graphicSize,
				// graphicYOffset: -24,									
				fillColor: "#99ccff",
				// label:"${id}",
				fontFamily: "Trebuchet MS",
				fontWeight: "bold",
				strokeColor: "#00FF00",
				strokeWidth: 3,
				labelOutlineColor: "white",
				labelYOffset: graphicSize+5,
				labelOutlineWidth: 3	
			}			

		})
	];	
	var layerTempStat = new OpenLayers.Layer.Vector('Search station', {
		renderers: renderer,
		styleMap: new OpenLayers.StyleMap({
			"default": new OpenLayers.Style({
				externalGraphic: symbStatIntercep,
				graphicOpacity: 1,
				graphicHeight: graphicSize,
				graphicWidth: graphicSize,
				graphicYOffset: -graphicSize,
				fillOpacity: 0.2,
				pointRadius: 10
			}, {rules: rulesStat})

		})
	});
	var layerTempSel = new OpenLayers.Layer.Vector('SelSation', {//'displayInLayerSwitcher':false,
		renderers: renderer,
		styleMap: new OpenLayers.StyleMap({
			"default": new OpenLayers.Style({
				externalGraphic: symbStatSel,
				graphicOpacity: 1,
				graphicHeight: graphicSize,
				graphicWidth: graphicSize,
				graphicYOffset: -graphicSize,
				fillOpacity: 0.2,
				pointRadius: 10
			}, {rules: rulesStatSel}
			)

		})
	});	
	
	var polygonDraw = new OpenLayers.Layer.Vector("Shapes",{'displayInLayerSwitcher':false, renderers: renderer,transparent: true,visibility: true});
			
	var rulesRegion = [
		new OpenLayers.Rule({
			title: "Buffer",
			symbolizer: {
				fillColor: "#FE2E2E",//"#ff9a9a",
				fillOpacity: 0.1,
				strokeColor: "#00FF00",
				strokeWidth: 2,
				strokeDashstyle: "dash",
				// label: "xxxxxx",
				labelAlign: "cc",
				fontColor: "#333333",
				fontOpacity: 0.9,
				fontFamily: "Arial",
				fontSize: 16,
				strokeOpacity: 1
			}


		})
	];
	
	var styleTempRegion= new OpenLayers.Style({
		// externalGraphic: symbStatIntercep,
		graphicOpacity: 1,
		graphicHeight: 24,
		graphicWidth: 24,
		graphicYOffset: -24,
		fillOpacity: 0.1,
		pointRadius: 10
	}, {rules: rulesRegion});
			
	var layerTempRegion = new OpenLayers.Layer.Vector('Search region', {'displayInLayerSwitcher':false,
		// renderers: renderer,
		projection: new OpenLayers.Projection("EPSG:4326"),
		displayProjection: new OpenLayers.Projection("EPSG:900913"),						
		renderers: ['Canvas','SVG'],
		styleMap:  new OpenLayers.StyleMap(styleTempRegion)	
	});	

	
	var oneRuleHover = new OpenLayers.Rule({
		symbolizer:{
			fillColor: "${styleFunction2}",
			fillOpacity: 0.9, 
			labelYOffset: -5, // no efunciona cuando se usa renderers: ['Canvas','SVG']
			labelAlign:'lb', // lb,cb,rb,cm
			strokeColor: "#00FF00",//colorsCluster.low,
			strokeOpacity: 0.3,
			strokeWidth: 1,
			pointRadius: 5,
			labelOutlineWidth:0.5,
		}
	});	
	contextHover= {
		styleFunction2: function(feature) {
			if(feature.attributes.institute==1){
				return "blue"
			}
			if(feature.attributes.institute==6){
				return "red"
			}					
			if(feature.attributes.institute==5){
				return "black"
			}
			if(feature.attributes.institute==7){
				return "green"
			}
		},
	}			
	var style = new OpenLayers.Style(null, {
		rules: [oneRuleHover],context: contextHover }
	);
			
	var vectorHover = new OpenLayers.Layer.Vector('layerHover',{'displayInLayerSwitcher':false,
		/*styleMap: new OpenLayers.Style({
			// fillColor: "#00FF00",
			fillColor: "${styleFunction2}",
			fillOpacity: 0.9, 
			strokeColor: "red",
			strokeOpacity: 0.3,
			strokeWidth: 1,
			pointRadius: 4,
			// label: "1",
			labelOutlineWidth:0.5,
			fontColor: "#ffffff",
			fontOpacity: 0.8,
			fontSize: "12px"
		})*/
		styleMap:  new OpenLayers.StyleMap({
				"default": style					
			})
	})
	
	
	name: 'GeocoderComboBox GeoExt2'
	var locationLayer = new OpenLayers.Layer.Vector("Location", {
		'displayInLayerSwitcher':false,
		styleMap: new OpenLayers.Style({
			externalGraphic: symbLocation,
			graphicYOffset: -25,
			graphicHeight: 25,
			graphicTitle: "${name}",
			label:"${name}",
			fontFamily: "Trebuchet MS",
			fontWeight: "bold",
			strokeColor: "#00FF00",
			strokeWidth: 1,
			labelOutlineColor: "white",
			labelYOffset: -5,
			labelOutlineWidth: 3			

		})
	});	
	
	
	