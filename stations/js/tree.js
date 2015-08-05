/*
 * Copyright (c) 2008-2014 The Open Source Geospatial Foundation
 *
 * Published under the BSD license.
 * See https://github.com/geoext/geoext2/blob/master/license.txt for the full
 * text of the license.
 */
Ext.Loader.setPath('Ext.ux', '../../libs/ext-4.2.2/examples/ux');

Ext.require([
    'Ext.container.Viewport',
    'Ext.layout.container.Border',
    'GeoExt.tree.Panel',
    'Ext.tree.plugin.TreeViewDragDrop',
    'GeoExt.panel.Map',
    'GeoExt.tree.OverlayLayerContainer',
    'GeoExt.tree.BaseLayerContainer',
    'GeoExt.data.LayerTreeModel',
    'GeoExt.tree.View',
    'GeoExt.tree.Column',
	'Ext.ux.TabReorderer',
	'Ext.ux.TabScrollerMenu',
	'Ext.tip.QuickTipManager',
	'GeoExt.data.MapfishPrintProvider',
    'GeoExt.data.PrintPage',
    'GeoExt.plugins.PrintPageField',
    'GeoExt.plugins.PrintProviderField',
	'Ext.slider.*',
	'GeoExt.form.field.GeocoderComboBox',
    'GeoExt.container.WmsLegend',
    'Ext.util.Point',
    'GeoExt.container.UrlLegend',
    'GeoExt.container.VectorLegend',
    'GeoExt.panel.Legend'	
	
]);


var mapPanel, tree;

Ext.application({
    name: 'Tree',
    launch: function() {

		// para corregir cuando se desplega en el boton + las varaibles aparece error en property 'isGroupHeader'
		Ext.define('SystemFox.overrides.view.Table', {
			override: 'Ext.view.Table',
			checkThatContextIsParentGridView: function(e){
				var target = Ext.get(e.target);
				var parentGridView = target.up('.x-grid-view');
				if (this.el != parentGridView) {
					/* event of different grid caused by grids nesting */
					return false;
				} else {
					return true;
				}
			},
			processItemEvent: function(record, row, rowIndex, e) {
				if (e.target && !this.checkThatContextIsParentGridView(e)) {
					return false;
				} else {
					return this.callParent([record, row, rowIndex, e]);
				}
			}
		});	
	
		mapHeight=400	
		mapWidth=500	
		tabsHeight= 600
		
		var heightDiv = $("#geomap").height();
		var widthDiv = $("#geomap").width();

		mainPanelHeight=650//Ext.getBody().getViewSize().height//*0.7//800	heightDiv//
		mainPanelWidth= 836//Ext.getBody().getViewSize().width//*0.5 //1000 widthDiv//		
		tabsWidth= mainPanelWidth*0.35
		fieldsetWidth=280
		fieldsetWidthLayer=270
		widthComboBox =150 //tabsWidth*0.8 //
		widthLabelComboBox = 50	//tabsWidth*0.25	//	
		grapWidth=mainPanelWidth-50
		
		
		infoB="i.PNG" 
		iconZomm=icons+"worldclim3.png"
		iconGridDownload=icons+'download-icon.png'
		iconGridzoomExtentALL=icons+'magnifier-zoom-fit.png'
		iconGridExpand='add'
		iconGridStatistics=icons+'Table-icon.png'
		iconGridMaximize=icons+'arrow-expand-icon16.png'
		
		var WGS84 = new OpenLayers.Projection("EPSG:4326");
		var WGS84_google_mercator = new OpenLayers.Projection("EPSG:900913"); //map.getProjectionObject()
	
	
		// Init the singleton.  Any tag-based quick tips will start working.
		Ext.tip.QuickTipManager.init();

		// Apply a set of config properties to the singleton
		Ext.apply(Ext.tip.QuickTipManager.getQuickTip(), {
			maxWidth: mainPanelWidth*0.7,
			// minWidth: 50,
			// width:10,
			// maxHeight: 200,
			showDelay: 50,      // Show 50ms after entering target
			// hideDelay: 90000,
			mouseOffset: [-10, -10],
			// dismissDelay: 10000 // Hide after 10 seconds hover,  
			// anchorOffset: 110,	
		});

		toolip_groupByRegion='Find weather stations in a region. To clear the map search using the reset button'
		toolip_groupByStation='Find stations weather by name or id'
		toolip_groupByQuery='Find weather stations with a custom search. Can add and remove search conditions'		
		toolip_groupSlider='Change size cluster of stations. Resize view cluster'		
		toolip_groupLegendIMG='Legend by institutes of each country'		
		toolip_groupLabels='Select an attribute to add labels to stations in the map'		
		toolip_groupLayers='Base layers of map. Can select a layer by clicking in the radio button'		
		
		mapPanel = Ext.create('GeoExt.panel.Map', {
			id: 'mapPanelID',
            border: true,
			columnWidth: 1,
            region: "center",
            // we do not want all overlays, to try the OverlayLayerContainer
            height: '60%',
            // width: 300,			
            map: {allOverlays: false,controls: [],numZoomLevels: 20,
				projection: WGS84_google_mercator,
				displayProjection: WGS84		
			},
            center: [-76, 3],
            zoom: 6,
			//items: [tabs],
            layers: [
				// new OpenLayers.Layer.OSM("OSM"),
				clusters,
                new OpenLayers.Layer.WMS("OpenStreetMap WMS",
                    "http://ows.terrestris.de/osm/service?",
                    {layers: 'OSM-WMS'},
                    {
                        attribution: '&copy; terrestris GmbH & Co. KG <br>' +
                            'Data &copy; OpenStreetMap ' +
                            '<a href="http://www.openstreetmap.org/copyright/en"' +
                            'target="_blank">contributors<a>'
                    }
                ),				
                // new OpenLayers.Layer.WMS("Global Imagery",
                    // "http://maps.opengeo.org/geowebcache/service/wms", {
                        // layers: "bluemarble",
                        // format: "image/png8"
                    // }, {
                        // buffer: 0,
                        // visibility: false
                    // }
                // ),
				gsat,gphy,ghyb

            ],
			// tbar: [{
				// xtype:'buttongroup',
				// id:'toolbarID',
				// items: [{
					// text: 'Cut',
					// iconCls: 'add16',
					// scale: 'small'
				// },{
					// text: 'Copy',
					// iconCls: 'add16',
					// scale: 'small'
				// },{
					// text: 'Paste',
					// iconCls: 'add16',
					// scale: 'small',
					// menu: [{text: 'Paste Menu Item'}]
				// }]
			// }]			
            dockedItems: [{
                xtype: 'toolbar',
				id:'toolbarID',
				// layout:'hbox',
				// margin  : '5 0 0 0',
				overlay: true,
				overCls : 'my-over',
				cls:"my_css_toolbar",
				// width: '40%',
				// layout:'fit',
				layout: {
					// pack: 'justify',
					align: 'left' // align center is the default
				},				
				style: "background-color: transparent;width: 360px !important;margin-left: 50px;",//opacity: .6;transparent,;margin-left: 75%
                dock: 'top',
				// layoutConfig : {
					// align : 'stretch'
				// },
				// defaults : {
					// flex : 3  
				// }				
            }]			
        });
	
		
        var storeLayers = Ext.create('Ext.data.TreeStore', {
            model: 'GeoExt.data.LayerTreeModel',
            root: {
                expanded: true,
                children: [
					{
                        plugins: ['gx_baselayercontainer'],
                        expanded: true,
                        text: "Base Maps"
                    }, {
                        plugins: ['gx_overlaylayercontainer'],
                        expanded: true
                    }
                ]
            }
        });

        var layer;

        // create the tree with the configuration from above
        tabTree = Ext.create('GeoExt.tree.Panel', {
            border: false,
			cls:"tabTreeCSS",
            // region: "west",
            // title: "Layers",
            // width: 250,
            // width: tabsWidth,//170
			width:fieldsetWidthLayer,
			// minWidth:tabsWidth,
            split: true,
            // collapsible: true,
            // collapseMode: "mini",
            // autoScroll: true,
            store: storeLayers,
            rootVisible: false,
            lines: false,
            // tbar: [{
                // text: "add/remove labels",
                // handler: function() {
					
                // }
            // }
			// , {
                // text: "add",
                // handler: function() {
                    // mapPanel.map.addLayer(layer);
                // }
            // }
			// ]
        });



// ##############	PANEL PARA EL TAB Searchs ################################


	// Ext.define('SystemFox.overrides.view.Table', {
		// override: 'Ext.view.Table',
		// checkThatContextIsParentGridView: function(e){
			// var target = Ext.get(e.target);
			// var parentGridView = target.up('.x-grid-view');
			// if (this.el != parentGridView) { //event of different grid caused by grids nesting
				// return false;
			// } else {
				// return true;
			// }
		// },
		// processItemEvent: function(record, row, rowIndex, e) {
			// if (e.target && !this.checkThatContextIsParentGridView(e)) {
				// return false;
			// } else {
				// return this.callParent([record, row, rowIndex, e]);
			// }
		// }
	// });	

	// Ext.define('modelCountry', {
		// extend: 'Ext.data.Model',
		// fields: [
			// {type: 'string', name: 'country'},
		// ]
	// });		

	// creaStore = Ext.create('Ext.data.Store', {
		// autoDestroy: true,
		// model: 'modelCountry',
		// data: countries
	// });	

	Ext.define('modelCountry', {
		extend: 'Ext.data.Model',
		fields: [
				{ name: 'value', type: 'string' },
				{ name: 'label', type: 'string' },
		]
	});		
	creaStore = Ext.create('Ext.data.Store', {
		model: 'modelCountry',
		autoLoad: true,
		autoSync: true,		
		proxy: {
			type: 'ajax',
			url: 'php/Geo_statByregion.php',
			extraParams: {
				type:13
			},			
			reader: {
				type: 'json',
				root: 'data'
			}
		}
	});
	
	Ext.define('modelGridVar', { 
		extend: 'Ext.data.Model',
		fields: [
			{ name: 'idstat', type: 'integer' },
			{ name: 'idvar', type: 'integer' },
			{ name: 'name', type: 'string' },
			{ name: 'acronym', type: 'string' },
			{ name: 'date_start', type: 'date_start' },
			{ name: 'date_end', type: 'date_end' },
			{ name: 'age', type: 'age'}
		]
	});
		
    var countryCmb = Ext.create('Ext.form.field.ComboBox', {
        fieldLabel: 'Country',
        displayField: 'label',//'country',
		valueField: 'value',
        width: widthComboBox,
        labelWidth: widthLabelComboBox,
        store: creaStore,
        queryMode: 'local',
        typeAhead: true,
		forceSelection: true,
		listeners: {
			select:{fn:function(combo, value) {
				var storestate = Ext.getCmp('stateCmbID');  
				var storecity = Ext.getCmp('cityCmbID');  
					storestate.enable();
					storestate.clearValue();  
					storecity.disable();  
					storecity.clearValue();  
					storestate.getStore().load({
						params: {countryID: combo.getValue(),type:1}, // callback: function(records, operation, success) {console.log(records);} // para comprobar 
					});
					
				}}                                
			}			
    });
	
	Ext.define('modelState', { 
			extend: 'Ext.data.Model',
			fields: [
				{ name: 'value', type: 'string' },
				{ name: 'label', type: 'string' },
			]
		});
  var stateStore = Ext.create('Ext.data.Store', {
		model: 'modelState',
		proxy: {
			type: 'ajax',
			url: 'php/states.php',
			reader: {
				type: 'json',
				root: 'data'
			}
		}
	});	
	
	var stateCmb = Ext.create('Ext.form.field.ComboBox', {
        fieldLabel: 'State',
        displayField: 'label',
        valueField: 'value',
		id:'stateCmbID',
        width: widthComboBox,
        labelWidth: widthLabelComboBox,
        store: stateStore,
        queryMode: 'local',
        typeAhead: true,	
		disabled: true,
		listeners: {
			select:{fn:function(combo, value) {
				var storecity = Ext.getCmp('cityCmbID');  
				storecity.enable();
				storecity.clearValue();  
				var country = countryCmb.getValue();
				storecity.getStore().load({
					params: {stateID: combo.getValue(),countryID:country,type:2}, // callback: function(records, operation, success) {console.log(records);} // para comprobar 
				});
			}}                                
		}	
	});	
	
	var cityStore = Ext.create('Ext.data.Store', {
		model: 'modelState',
		proxy: {
			type: 'ajax',
			url: 'php/states.php',
			reader: {
				type: 'json',
				root: 'data'
			}
		}
	});	
	var cityCmb = Ext.create('Ext.form.field.ComboBox', {
		fieldLabel: 'City',
		displayField: 'label',
		valueField: 'value',
		id:'cityCmbID',
		width: widthComboBox,
		labelWidth: widthLabelComboBox,
		store: cityStore,
		queryMode: 'local',
		typeAhead: true	,
		disabled: true

	});	
	
	Ext.define('modelGridRegion', { 
			extend: 'Ext.data.Model',
			fields: [
				{ name: 'id', type: 'string' },
				{ name: 'code', type: 'string' },
				{ name: 'name', type: 'string' },
				{ name: 'category', type: 'string' },
				{ name: 'institute', type: 'string' },
				{ name: 'instalation', type: 'string' },
				{ name: 'quality', type: 'string' },
				{ name: 'model', type: 'string' },
				{ name: 'variables', type: 'string' },
				{ name: 'lon', type: 'string' },
				{ name: 'lat', type: 'string' },
				{ name: 'elev', type: 'string' },
				{ name: 'country', type: 'string' },
				{ name: 'state', type: 'string' },
				{ name: 'city', type: 'string' }
			]
		});	
		Ext.define('modelvarList', { 
				extend: 'Ext.data.Model',
				fields: [
					{ name: 'id', type: 'integer' },
					{ name: 'name', type: 'string' },
					{ name: 'acronym', type: 'string' }
				]
			});	
		Ext.define('modelStatistic', { 
			extend: 'Ext.data.Model',
			fields: [
				{ name: 'idstat', type: 'integer' },
				{ name: 'code', type: 'string' },
				{ name: 'name', type: 'string' },
				{ name: 'var', type: 'string' },
				{ name: 'count', type: 'string' },
				{ name: 'min', type: 'string' },
				{ name: 'max', type: 'string' },
				{ name: 'mean', type: 'string' },
				{ name: 'variance', type: 'string' },
				{ name: 'sd', type: 'string' },
				{ name: 'median', type: 'string' },
				{ name: 'cv_per', type: 'string' },
				{ name: 'na', type: 'string' },
				{ name: 'na_per', type: 'string' }
			]
		});			
		onZoomExtentALL = function () {
			layerTemp=mapPanel.map.getLayersByName("FindStation")[0]
			var BoundALL = layerTemp.getDataExtent();
			mapPanel.map.zoomToExtent(BoundALL);
		}			

		statistics	 = function () {
			if(Ext.getCmp('gridStatisticID')){
				Ext.getCmp('gridStatisticID').destroy();	
			}
		
			if(Ext.getCmp('gridRegionID')){
				var selection = Ext.getCmp('gridRegionID').getView().getSelectionModel().getSelection();//[0];
			}			
			if(Ext.getCmp('gridStatID')){
				var selection = Ext.getCmp('gridStatID').getView().getSelectionModel().getSelection();//[0];
			}
			
			selgrid=new Array()
			for(var i = 0; i < selection.length; i++) {
				selgrid.push(Number(selection[i].data.id));
			}
			
			selgrid=Ext.encode(selgrid)
			varList=Ext.encode(cmbVar.getValue())

			var statisticStore = Ext.create('Ext.data.Store', {
				model: 'modelStatistic',
				autoLoad: true,
				// autoSync: true,
				sorters: { property: 'name', direction : 'ASC' },
				proxy: {
					type: 'ajax',
					url: 'php/statistics.php',
					extraParams: {stations : selgrid, variable:varList},			
					reader: {
						type: 'json',
						root: 'topics'
					}
				}
			});	
			gridStatistic = Ext.create('Ext.grid.Panel', {
				id: 'gridStatisticID',
				border: true,
				// layout: 'fit',
				forceFit: true,
				cls:"gridStatisticCSS",
				store: statisticStore,
				maxHeight: 360,//Ext.getBody().getViewSize().height*0.3,
				// width: mainPanelWidth-50,
				// height:360,
				// maxHeight: mainPanelHeight*0.4,
				// selType: 'checkboxmodel',
				autoHeight: true,
				// autoScroll: false,
				columns: [
					{ text: 'id',minWidth: 50,dataIndex: 'idstat', flex: 1},
					{ text: 'code',minWidth: 80,dataIndex: 'code', flex: 1},
					{ text: 'name',minWidth: 120,dataIndex: 'name', flex: 4},
					{ text: 'var',minWidth: 50,dataIndex: 'var', flex: 2},
					{ text: 'count',minWidth: 60,dataIndex: 'count', flex: 2},
					{ text: 'min',minWidth: 60,dataIndex: 'min', flex: 2},
					{ text: 'max',minWidth: 60,dataIndex: 'max', flex: 2},
					{ text: 'median',minWidth: 60,dataIndex: 'median', flex: 2},
					{ text: 'mean',minWidth: 60,dataIndex: 'mean', flex: 2},
					{ text: 'var(x)',minWidth: 60,dataIndex: 'variance', flex: 2},
					{ text: 'sd',minWidth: 60,dataIndex: 'sd', flex: 2},
					{ text: 'cv&#37;',minWidth: 60,dataIndex: 'cv_per', flex: 2},
					{ text: 'na',minWidth: 60,dataIndex: 'na', flex: 2},
					{ text: 'na&#37;',minWidth: 60,dataIndex: 'na_per', flex: 2}
				],
				columnLines: true,
				stripeRows: true
			});
			if(!Ext.getCmp('statisticsID')){
				tabs.add({
					title: 'Summary statistic',
					name: 'statisticsID',
					// autoScroll: true,
					id: 'statisticsID',
					closable: true,
				});		
			}
			
			Ext.getCmp('statisticsID').add(gridStatistic);								
			
			Ext.getCmp('mapPanelID').setHeight(0)
			Ext.getCmp('tabsID').setWidth(mainPanelWidth-15);
			// Ext.getCmp('tabsID').setHeight(mainPanelHeight*0.2);
			tabs.setActiveTab('statisticsID');								
			
		}	// fin statistics
		

		var gridRegion
		
		expand	 = function () {
			var store = gridRegion.getStore();
			var expander = gridRegion.plugins[0];

			for(var i = 0; i < store.getCount(); i++) {
				var record = store.getAt(i);
				// console.log(expander.recordsExpanded[record.internalId]);
				if(!expander.recordsExpanded[record.internalId]){
					// expander.toggleRow(i);
					expander.toggleRow(i,gridRegion.store.getAt(i))
				}else(expander.toggleRow(i,gridRegion.store.getAt(i)))							
				
			}
			var rowExpander = gridRegion.plugins[0];
			var rowNode = gridRegion.getView().getNode(0);
			var row = Ext.fly(rowNode, '_rowExpander');
			var isCollapsed = row.hasCls(rowExpander.rowCollapsedCls);
			if(isCollapsed==true){
				gridRegion.down('#idExpand').setText('Expand all');
			} else{gridRegion.down('#idExpand').setText('Collapse all');}  
			
		}							
	
		
		Maximize	 = function () {
			mainTableH=Ext.getCmp('mainTableID').height;
			if(mainTableH==mainPanelHeight-46){
				// Ext.getCmp('tabsID').setHeight(0);
				// Ext.getCmp('mapPanelID').setHeight(0);
				Ext.getCmp('mainTableID').maxHeight=mainPanelHeight*0.4;
				Ext.getCmp('mainTableID').setHeight(mainPanelHeight*0.4);
				// console.log(mainTableH);
			}else{
				Ext.getCmp('tabsID').setHeight(0);
				Ext.getCmp('mapPanelID').setHeight(0);
				Ext.getCmp('mainTableID').maxHeight=mainPanelHeight-46;
				Ext.getCmp('gridRegionID').maxHeight=mainPanelHeight;
				Ext.getCmp('mainTableID').setHeight(mainPanelHeight);
				Ext.getCmp('gridRegionID').getView().refresh();
				Ext.getCmp('mainpanelID').doLayout();
				// console.log("fgfgf",Ext.getCmp('mainTableID').maxHeight,mainPanelHeight,Ext.getCmp('gridRegionID').maxHeight)
			}
			var store = gridRegion.getStore();
			var expander = gridRegion.plugins[0];
			for(var i = 0; i < store.getCount(); i++) {
				var record = store.getAt(i);
				expanded=!expander.recordsExpanded[record.internalId]
				if(expanded==false){
					expander.toggleRow(i,gridRegion.store.getAt(i))
				}
			}				
		}

		

		function generateGraps(idSta, period,listVar) {
			// var myMask = new Ext.LoadMask(Ext.getCmp('tabsID').getActiveTab(), {msg:"Please wait..."});
			var myMask = new Ext.LoadMask(Ext.getCmp('tabsID'), {msg:"Please wait..."});
			myMask.show();						
			  $.ajax({
				type: "POST",
			//    dataType: "json",
				url: "php/data-graphics.php",
				data: 'station='+idSta+'&period='+period+'&variable='+listVar,//filterValues,
				success: function(result) {
				  var objJSON = {};
				  if (result != null) {
					objJSON = eval("(function(){return " + result + ";})()");
				  } else {
			//        objJSON = null;
				  }
				  var data = objJSON;
				  // var period = period;
				  if (('tmax' in data) || data['tmin'] || data['tmean']) {
					var seriesData = [];
					if (data['tmin']) {
					  if (period == 1) {
						seriesData.push({
						  name: 'T. min',
						  data: data['tmin']['data'],
						  pointStart: Date.UTC(data['tmin']['sdate'].split(' ')[0].split('-')[0], (parseInt(data['tmin']['sdate'].split(' ')[0].split('-')[1]) - 1), parseInt(data['tmin']['sdate'].split(' ')[0].split('-')[2])),
						  pointInterval: 24 * 3600 * 1000
						});
					  } else if (period == 2) {
						dLen = data['tmin']['data'].length;
						for (var i = 0; i < dLen; i++) {
						  data['tmin']['data'][i] = [Date.UTC(data['tmin']['sdate'].split(' ')[0].split('-')[0], (parseInt(data['tmin']['sdate'].split(' ')[0].split('-')[1]) - 1 + i), 1), data['tmin']['data'][i]];
						}
						seriesData.push({
						  name: 'T. min',
						  data: data['tmin']['data']
						});
					  } else if (period == 3) {
						dLen = data['tmin']['data'].length;
						for (var i = 0; i < dLen; i++) {
						  data['tmin']['data'][i] = [Date.UTC((parseInt(data['tmin']['sdate'].split(' ')[0].split('-')[0]) + i), (parseInt(data['tmin']['sdate'].split(' ')[0].split('-')[1]) - 1), 1), data['tmin']['data'][i]];
						}
						seriesData.push({
						  name: 'T. min',
						  data: data['tmin']['data']
						});
					  }
					}
					if (data['tmax']) {
					  if (period == 1) {
						seriesData.push({
						  name: 'T. max',
						  data: data['tmax']['data'],
						  pointStart: Date.UTC(data['tmax']['sdate'].split(' ')[0].split('-')[0], (parseInt(data['tmax']['sdate'].split(' ')[0].split('-')[1]) - 1), parseInt(data['tmax']['sdate'].split(' ')[0].split('-')[2])),
						  pointInterval: 24 * 3600 * 1000
						});
					  } else if (period == 2) {
						dLen = data['tmax']['data'].length;
						for (var i = 0; i < dLen; i++) {
						  data['tmax']['data'][i] = [Date.UTC(data['tmax']['sdate'].split(' ')[0].split('-')[0], (parseInt(data['tmax']['sdate'].split(' ')[0].split('-')[1]) - 1 + i), 1), data['tmax']['data'][i]];
						}
						seriesData.push({
						  name: 'T. max',
						  data: data['tmax']['data']
						});
					  } else if (period == 3) {
						dLen = data['tmax']['data'].length;
						for (var i = 0; i < dLen; i++) {
						  data['tmax']['data'][i] = [Date.UTC((parseInt(data['tmax']['sdate'].split(' ')[0].split('-')[0]) + i), (parseInt(data['tmax']['sdate'].split(' ')[0].split('-')[1]) - 1), 1), data['tmax']['data'][i]];
						}
						seriesData.push({
						  name: 'T. max',
						  data: data['tmax']['data']
						});
					  }

					}
					if (data['tmean']) {
					  if (period == 1) {
						seriesData.push({
						  name: 'T. mean',
						  data: data['tmean']['data'],
						  pointStart: Date.UTC(data['tmean']['sdate'].split(' ')[0].split('-')[0], (parseInt(data['tmean']['sdate'].split(' ')[0].split('-')[1]) - 1), parseInt(data['tmean']['sdate'].split(' ')[0].split('-')[2])),
						  pointInterval: 24 * 3600 * 1000
						});
					  } else if (period == 2) {
						dLen = data['tmean']['data'].length;
						for (var i = 0; i < dLen; i++) {
						  data['tmean']['data'][i] = [Date.UTC(data['tmean']['sdate'].split(' ')[0].split('-')[0], (parseInt(data['tmean']['sdate'].split(' ')[0].split('-')[1]) - 1 + i), 1), data['tmean']['data'][i]];
						}
						seriesData.push({
						  name: 'T. mean',
						  data: data['tmean']['data']
						});
					  } else if (period == 3) {
						dLen = data['tmean']['data'].length;
						for (var i = 0; i < dLen; i++) {
						  data['tmean']['data'][i] = [Date.UTC((parseInt(data['tmean']['sdate'].split(' ')[0].split('-')[0]) + i), (parseInt(data['tmean']['sdate'].split(' ')[0].split('-')[1]) - 1), 1), data['tmean']['data'][i]];
						}
						seriesData.push({
						  name: 'T. mean',
						  data: data['tmean']['data']
						});
					  }

					}
			//        alert(seriesData);
					$('#grap_temp_'+idSta).highcharts('StockChart',{
					  chart: {
						type: 'spline',
						zoomType: 'x'
					  },
					  title: {
						text: 'Temperatura'
					  },
					  xAxis: {
						type: 'datetime',
						labels: {
						  overflow: 'justify'
						}
					  },
					  yAxis: {
						title: {
						  text: 'Temperature'
						}
					  },
					  tooltip: {
						valueSuffix: ' C',
						shared: true,
						valueDecimals: 2
					  },
					  plotOptions: {
						series: {
						  turboThreshold: 15000//larger threshold or set to 0 to disable
						}
					  },
					  series: seriesData
					});
				  }
				  if (data['prec']) {
					dLen = data['prec']['data'].length;

					if (period == 1) {
					  seriesData = {
						name: 'Precipitation',
						data: data['prec']['data'],
						pointStart: Date.UTC(data['prec']['sdate'].split(' ')[0].split('-')[0], (parseInt(data['prec']['sdate'].split(' ')[0].split('-')[1]) - 1), parseInt(data['prec']['sdate'].split(' ')[0].split('-')[2])),
						pointInterval: 24 * 3600 * 1000
					  };
					} else if (period == 2) {
					  for (var i = 0; i < dLen; i++) {
						data['prec']['data'][i] = [Date.UTC(data['prec']['sdate'].split(' ')[0].split('-')[0], (parseInt(data['prec']['sdate'].split(' ')[0].split('-')[1]) - 1 + i), 1), data['prec']['data'][i]];
					  }
					  seriesData = {
						name: 'Precipitation',
						data: data['prec']['data']
					  };
					} else if (period == 3) {
					  for (var i = 0; i < dLen; i++) {
						data['prec']['data'][i] = [Date.UTC((parseInt(data['prec']['sdate'].split(' ')[0].split('-')[0]) + i), (parseInt(data['prec']['sdate'].split(' ')[0].split('-')[1]) - 1), 1), data['prec']['data'][i]];
					  }
					  seriesData = {
						name: 'Precipitation',
						data: data['prec']['data']
					  };
					}
					$('#grap_prec_'+idSta).highcharts('StockChart',{
					  chart: {
						type: 'spline',
						zoomType: 'x'
					  },
					  title: {
						text: 'Precipitation'
					  },
					  xAxis: {
						type: 'datetime',
						labels: {
						  overflow: 'justify'
						}
					  },
					  yAxis: {
						title: {
						  text: 'Precipitation mm/day'
						}
					  },
					  tooltip: {
						valueSuffix: ' mm/day',
						valueDecimals: 2
					  },
					  plotOptions: {
						series: {
						  turboThreshold: 15000//larger threshold or set to 0 to disable
						}
					  },
					  series: [seriesData]
					});
				  }
				  if (data['sbright']) {
					dLen = data['sbright']['data'].length;

					if (period == 1) {
					  seriesData = {
						name: 'Sun bright',
						data: data['sbright']['data'],
						pointStart: Date.UTC(data['sbright']['sdate'].split(' ')[0].split('-')[0], (parseInt(data['sbright']['sdate'].split(' ')[0].split('-')[1]) - 1), parseInt(data['sbright']['sdate'].split(' ')[0].split('-')[2])),
						pointInterval: 24 * 3600 * 1000
					  };
					} else if (period == 2) {
					  for (var i = 0; i < dLen; i++) {
						data['sbright']['data'][i] = [Date.UTC(data['sbright']['sdate'].split(' ')[0].split('-')[0], (parseInt(data['sbright']['sdate'].split(' ')[0].split('-')[1]) - 1 + i), 1), data['sbright']['data'][i]];
					  }
					  seriesData = {
						name: 'Sun bright',
						data: data['sbright']['data']
					  };
					} else if (period == 3) {
					  for (var i = 0; i < dLen; i++) {
						data['sbright']['data'][i] = [Date.UTC((parseInt(data['sbright']['sdate'].split(' ')[0].split('-')[0]) + i), (parseInt(data['sbright']['sdate'].split(' ')[0].split('-')[1]) - 1), 1), data['sbright']['data'][i]];
					  }
					  seriesData = {
						name: 'Sun bright',
						data: data['sbright']['data']
					  };
					}
					$('#grap_sbright_'+idSta).highcharts('StockChart',{
					  chart: {
						type: 'spline',
						zoomType: 'x'
					  },
					  title: {
						text: 'Sun bright'
					  },
					  xAxis: {
						type: 'datetime',
						labels: {
						  overflow: 'justify'
						}
					  },
					  yAxis: {
						title: {
						  text: 'Sun bright hours/day'
						}
					  },
					  tooltip: {
						valueSuffix: ' hours/day',
						valueDecimals: 2
					  },
					  plotOptions: {
						series: {
						  turboThreshold: 15000//larger threshold or set to 0 to disable
						}
					  },
					  series: [seriesData]
					});
				  }
				  if (data['rhum']) {
					dLen = data['rhum']['data'].length;

					if (period == 1) {
					  seriesData = {
						name: 'Air humidity',
						data: data['rhum']['data'],
						pointStart: Date.UTC(data['rhum']['sdate'].split(' ')[0].split('-')[0], (parseInt(data['rhum']['sdate'].split(' ')[0].split('-')[1]) - 1), parseInt(data['rhum']['sdate'].split(' ')[0].split('-')[2])),
						pointInterval: 24 * 3600 * 1000
					  };
					} else if (period == 2) {
					  for (var i = 0; i < dLen; i++) {
						data['rhum']['data'][i] = [Date.UTC(data['rhum']['sdate'].split(' ')[0].split('-')[0], (parseInt(data['rhum']['sdate'].split(' ')[0].split('-')[1]) - 1 + i), 1), data['rhum']['data'][i]];
					  }
					  seriesData = {
						name: 'Air humidity',
						data: data['rhum']['data']
					  };
					} else if (period == 3) {
					  for (var i = 0; i < dLen; i++) {
						data['rhum']['data'][i] = [Date.UTC((parseInt(data['rhum']['sdate'].split(' ')[0].split('-')[0]) + i), (parseInt(data['rhum']['sdate'].split(' ')[0].split('-')[1]) - 1), 1), data['rhum']['data'][i]];
					  }
					  seriesData = {
						name: 'Air humidity',
						data: data['rhum']['data']
					  };
					}
					$('#grap_rhum_'+idSta).highcharts('StockChart',{
					  chart: {
						type: 'spline',
						zoomType: 'x'
					  },
					  title: {
						text: 'Air humidity'
					  },
					  xAxis: {
						type: 'datetime',
						labels: {
						  overflow: 'justify'
						}
					  },
					  yAxis: {
						title: {
						  text: 'Air humidity %'
						}
					  },
					  tooltip: {
						valueSuffix: ' %',
						valueDecimals: 2
					  },
					  plotOptions: {
						series: {
						  turboThreshold: 15000//larger threshold or set to 0 to disable
						}
					  },
					  series: [seriesData]
					});
				  }
				},
				complete: function() {
					myMask.hide();
				}
			  });

		}// fin function generateGraps


    var groupByRegion = {
        xtype: 'fieldset',
        title: 'Search by region   '+ '<img id="help_toolip" class="tooltipIcon" src='+icons+infoB+' data-qtip="'+toolip_groupByRegion+'" />',//<span data-qtip="hello">First Name</span>  
		id:"groupByRegionID",
		width:fieldsetWidth,
        layout: 'anchor',
        defaults: {
            anchor: '100%'
        },
        collapsible: true,
        collapsed: false,
        items: [countryCmb,stateCmb,cityCmb,
			{	buttonAlign:'center',
			   bodyStyle: 'padding-top:5px; border-bottom:1px solid #CCCCCC; width:80px;',
			  buttons: [{
				text: 'Execute',
				style: {
					// background: '#FF5566'
				},				
				handler: function(){
					if(tabSearchRegion.getForm().isValid()){
						country = countryCmb.getRawValue()	 
						state = stateCmb.getRawValue()
						municip = cityCmb.getRawValue()
						
						countryVal = countryCmb.getValue()	 
						stateVal = stateCmb.getValue()						
						municipVal = cityCmb.getValue()	
						
						// layerTemp=mapPanel.map.getLayersByName("FindRegion")[0]
						// if(layerTemp){layerTemp.destroyFeatures();mapPanel.map.removeLayer(layerTemp);}

						// layerTemp=mapPanel.map.getLayersByName("FindStation")[0]
						// if(layerTemp){layerTemp.destroyFeatures();mapPanel.map.removeLayer(layerTemp);}
							
						if(Ext.getCmp('popupID')){
							Ext.getCmp('popupID').close()
						}
						// loading status
						var myMask = new Ext.LoadMask(Ext.getCmp('mapPanelID'), {msg:"Please wait..."});
						var myAjax = new Ext.data.Connection({
							// handler: function(){if(layerTemp){layerTemp.destroyFeatures();mapPanel.map.removeLayer(layerTemp);}},
							listeners : {        
								beforerequest : function () {myMask.show();},
								requestcomplete : function () {myMask.hide();}
							}
						});
							
						getWinRegion = Ext.getCmp('winRegionID');
						if (getWinRegion) {
							winRegion.close()
							winRegion.destroy();
						} //winRegion		
						
						if(Ext.getCmp('gridRegionID')){
							Ext.getCmp('mainTableID').collapse();
							Ext.getCmp('gridRegionID').destroy();	
						}	
					
						if(country){
							Ext.Ajax.request({ // PINTA EN EL MAPA LA REGION
								url : 'php/Geo_statByregion.php' , 
								params : { type:1,country : country, state:state, municip:municip},
								method: 'GET',
								success: function ( result, request ) {
									layerTemp=mapPanel.map.getLayersByName("FindRegion")[0]
									if(layerTemp){layerTemp.destroyFeatures();}
									
									geocapa = result.responseText;
									var format = new OpenLayers.Format.GeoJSON({'internalProjection': new OpenLayers.Projection("EPSG:900913"), 'externalProjection': new OpenLayers.Projection("EPSG:4326")
									});
									mapPanel.map.addLayer(layerTempRegion);
									layerTemp=mapPanel.map.getLayersByName("FindRegion")[0]
									layerTemp.addFeatures(format.read(geocapa));
									var bounds = layerTemp.getDataExtent();
									if(bounds){ mapPanel.map.panTo(bounds.getCenterLonLat()); mapPanel.map.zoomToExtent(bounds);}
								},
								failure: function ( result, request) { 
									Ext.MessageBox.alert('Failed', result.responseText);
								}
							});
							
							myAjax.request({ // PINTA EN EL MAPA LAS ESTACIONES INTERCEPTADAS
								url : 'php/Geo_statByregion.php' , 
								params : { type:2,country : country, state:state, municip:municip},
								method: 'GET',
								success: function ( result, request ) {
									layerTemp=mapPanel.map.getLayersByName("FindStation")[0]
									if(layerTemp){layerTemp.destroyFeatures();}
								
									geocapa = result.responseText;
									var format = new OpenLayers.Format.GeoJSON({'internalProjection': new OpenLayers.Projection("EPSG:900913"), 'externalProjection': new OpenLayers.Projection("EPSG:4326")
									});
									if(format.read(geocapa)[0]){
										mapPanel.map.addLayer(layerTempStat);
										layerTemp=mapPanel.map.getLayersByName("FindStation")[0]
										layerTemp.addFeatures(format.read(geocapa));
									}
								},
								failure: function ( result, request) { 
									Ext.MessageBox.alert('Failed', result.responseText);
								}
						

							});	

							 ////////////////////////////////////////////////////////////////////////////////////////
							// PARA EXTRAER LA INFORMACION DE LAS ESTACIONES EN UNA TABLA
							 ////////////////////////////////////////////////////////////////////////////////////////
							var gridRegionStore = Ext.create('Ext.data.Store', {
								model: 'modelGridRegion',
								autoLoad: true,
								autoSync: true,
								sorters: { property: 'name', direction : 'ASC' },
								proxy: {
									type: 'ajax',
									url: 'php/Geo_statByregion.php',
									extraParams: {country : country, state:state, municip:municip,type:5},			
									reader: {
										type: 'json',
										root: 'topics'
									}
								}
							});	
							
							var gridStandar = Ext.create('Ext.data.Store', {
								model: 'modelGridRegion',
								autoLoad: false,
								autoSync: true,
								proxy: {
									type: 'ajax',
									url: 'php/Geo_statByregion.php',
									reader: {
										type: 'json',
										root: 'topics'
									}
								}
							});								
							// gridStandar.load({
								// params:{country : country, state:state, municip:municip,type:5}
							// });
							
							var varstore = Ext.create('Ext.data.Store', {
								model: 'modelvarList',
								autoLoad: true,
								autoSync: true,
								sorters: { property: 'name', direction : 'ASC' },

								proxy: {
									type: 'ajax',
									url: 'php/Geo_statByregion.php',
									extraParams: {type:7,country : country, state:state, municip:municip},			
									reader: {
										type: 'json',
										root: 'topics'
									}
								},
								listeners: {
									 load: function(store, records) {
										  store.insert(0, [{
											  id: 0,
											  name: 'ALL',
											  acronym: 'ALL'
											  
										  }]);
									 }
								  }								
							});	
							
							var selModel2 = Ext.create('Ext.selection.CheckboxModel', {
								listeners: {
									selectionchange: function(sm, selections) {
										gridRegion.down('#removeButton').setDisabled(selections.length === 0);
										gridRegion.down('#idstatistic').setDisabled(selections.length === 0);
									}
								}
							});
							
							btn_download = function () {
								var selection = gridRegion.getView().getSelectionModel().getSelection();//[0];
								selgrid=new Array()
								for(var i = 0; i < selection.length; i++) {
									selgrid.push(Number(selection[i].data.id));
								}
								Ext.DomHelper.append(document.body, {
								  tag: 'iframe',
								  id:'downloadIframe',
								  frameBorder: 0,
								  width: 0,
								  height: 0,
								  css: 'display:none;visibility:hidden;height: 0px;',
								  src: 'php/dowloaddata.php?station='+Ext.encode(selgrid)+'&'+'country='+countryVal+'&'+'state='+stateVal+'&'+'municip='+municipVal+'&'+'variable='+Ext.encode(cmbVar.getValue())
								});
							}	

							cmbVar= Ext.create('Ext.form.field.ComboBox', { 
								editable: false, 
								value: 'ALL',
								multiSelect: true, 
								displayField: 'acronym',
								valueField: 'id', 
								id:'varCmbID',
								queryMode: 'local',
								typeAhead: true,	
								store: varstore,
								listConfig: {
									getInnerTpl: function() {
										return '<div data-qtip="{name}">{acronym}</div>';
									}
								}
							
							});
		
							gridRegion = Ext.create('Ext.grid.Panel', {
								id: 'gridRegionID',
								border: true,
								// layout: 'fit',
								forceFit: true,
								store: gridRegionStore,
								maxHeight: Ext.getBody().getViewSize().height*0.3,
								width: mainPanelWidth,
								// height:273,
								// maxHeight: mainPanelHeight*0.4,
								selType: 'checkboxmodel',
								autoHeight: true,
								columns: [
									{
										xtype: 'actioncolumn',
										minWidth: 20,
										flex: 1,
										items: [{
											icon   : icons+'buttons/zoomin_off.gif',  // Use a URL in the icon config
											tooltip: 'zoom extent',
											handler: function(grid, rowIndex, colIndex) {
												var rec = gridRegionStore.getAt(rowIndex);
												selectionID = rec.get('id');
												layerTemp=mapPanel.map.getLayersByName("FindStation")[0]
												for (var i = layerTemp.features.length - 1; i >= 0; --i) {
													if(layerTemp.features[i].attributes.id==selectionID){
														featureSel=layerTemp.features[i].geometry
														var bounds = featureSel.getBounds();
														if(bounds){ mapPanel.map.panTo(bounds.getCenterLonLat()); mapPanel.map.zoomToExtent(bounds);}
														// winRegion.collapse()
														
														// estilo cuando se hace zoom en la tabla de cada row
														var mySelectStyle = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style["default"]);
														OpenLayers.Util.extend(mySelectStyle, {pointRadius: 12,fillOpacity: 0.1,strokeColor: "#00FF00",});//{externalGraphic: iconZomm,graphicHeight: 32,graphicWidth: 32,fillOpacity: 0.8});	

														var selectFeature = new OpenLayers.Control.SelectFeature(layerTemp,{selectStyle: mySelectStyle});
														mapPanel.map.addControl(selectFeature);
														selectFeature.activate();	
														selectFeature.select(layerTemp.features[i]);	
														// mapPanel.map.removeControl(selectFeature); // selectFeature.deactivate()
													}
												}											
												
											}
										}]
									},		
									{
										xtype: 'actioncolumn',
										minWidth: 20,
										flex: 1,
										items: [{
											icon   : icons+'buttons/pie-chart-graph-icon.png',  // Use a URL in the icon config
											tooltip: 'Graphic',
											handler: function(grid, rowIndex, colIndex) {
												var rec = gridRegionStore.getAt(rowIndex);
												selectionID = rec.get('id');
												
												varlist=(cmbVar.getRawValue()).replace(/\s/g, '')
												var arrayvar =new Array() //varlist.split(',');

												for(var i = 0; i < varstore.getCount(); i++) {
													var record = varstore.getAt(i);
													id=record.get('id')
													acronym=record.get('acronym')
													arrayvar.push(acronym)
													// console.log(id,acronym)
												}
												
												var datatest = {
													name: 'xxx',
													rowTitleArr: arrayvar,
													colTitleArr: ['a', 'b', 'c']
												}
												var tpl = [
													'<div id="grap_temp_'+selectionID+'" style="width:'+grapWidth+'px;"></div>',
													'<tpl for="rowTitleArr">',
													'<div id="grap_{.}_'+selectionID+'" style="width:'+grapWidth+'px;"></div>',
													'</tpl>'
													];	

												cmbPeriod='cmbPeriod'+selectionID
												cmbPeriod=Ext.create('Ext.form.field.ComboBox', { 
													fieldLabel: 'Select graphic model',
													id:'cmbPeriodID'+selectionID,
													labelWidth:150,
													store: {
														fields: ['value','name'], 
														data: [ 
															{value:1,name: 'Daily'}, 
															{value:2,name: 'Monthly'}, 
															{value:3,name: 'Yearly'}
														]
													},
													displayField: 'name',
													value: 1,
													queryMode: 'local',
													valueField: 'value', 								
													typeAhead: true,
													listeners: {
														select: function() {
															var actTab = tabs.getActiveTab();
															var idx = tabs.items.indexOf(actTab);
															actTabId=parseInt((actTab.title).match(/\d+/)[0])
															var idPeriod = Ext.getCmp('cmbPeriodID'+actTabId).getValue()
															generateGraps(actTabId,idPeriod,Ext.encode(cmbVar.getValue()))

														}
													}
												});		
												if(!Ext.getCmp('graphic'+selectionID)){
													tabs.add({
														// contentEl: "desc",
														// xtype: 'panel',
														title: 'Graphic_id'+selectionID,
														name: 'graphic'+selectionID,
														// width:mainPanelWidth-15,
														// height: mainPanelHeight,
														autoScroll: true,
														// height: 100,
														// autoHeight: true,
														// layout: 'fit',
														id: 'graphic'+selectionID,
														 // html: new Ext.XTemplate(
														 // tpl
														 // '<div id="grap_tmin_'+selectionID+'" ></div>',
														 // '<div id="grap_prec_'+selectionID+'"></div>'
														 // ),
														 // .apply({value: '2. HTML property of a panel generated by an XTemplate'}),
														closable: true,
														dockedItems: [
															{
															xtype: 'toolbar',
															items: [cmbPeriod]
															}
														]													
													});		
												}
												var t = new Ext.XTemplate(tpl);
												Ext.getCmp('graphic'+selectionID).update(t.apply(datatest));
												// Ext.getCmp('graphic'+selectionID).update('This<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long');
												
												Ext.getCmp('mapPanelID').setHeight(0)
												Ext.getCmp('tabsID').setWidth(mainPanelWidth-15);
												// Ext.getCmp('tabsID').setHeight(mainPanelHeight*0.2);
												tabs.setActiveTab('graphic'+selectionID);
												
												generateGraps(selectionID,cmbPeriod.getValue(),Ext.encode(cmbVar.getValue()))
											} // handler
										}]
									},								
									// {
										// text : '&#8470;',
										// dataIndex: 'rowIndex',
										// flex: 1,
										// minWidth: 20,
										// renderer : function(value, metaData, record, rowIndex)
										// {return rowIndex+1;}
									// },			
									{ text: 'id',minWidth: 50,dataIndex: 'id', flex: 1},
									{ text: 'code',minWidth: 80,dataIndex: 'code', flex: 1},
									{ text: 'name',minWidth: 120,dataIndex: 'name', flex: 4},
									{ text: 'institute',minWidth: 50,dataIndex: 'institute', flex: 3},
									{ text: 'model',minWidth: 80,dataIndex: 'model', flex: 2},
									
									// { text: 'category',minWidth: 100,dataIndex: 'category', flex: 4},

									// { text: 'instalation',minWidth: 80,dataIndex: 'instalation', flex: 3},
									// { text: 'quality',minWidth: 80,dataIndex: 'quality', flex: 1},
									
									{ text: 'variables',minWidth: 100,dataIndex: 'variables', flex: 4},
									// { text: 'lon',minWidth: 80,dataIndex: 'lon', flex: 3},
									// { text: 'lat',minWidth: 80,dataIndex: 'lat', flex: 3},
									// { text: 'elev',minWidth: 80,dataIndex: 'elev', flex: 2},
									// { text: 'country',minWidth: 80,dataIndex: 'country', flex: 4},
									// { text: 'state',minWidth: 80,dataIndex: 'state', flex: 4},
									// { text: 'city',minWidth: 90,dataIndex: 'city', flex: 4}
									
								],
								columnLines: true,
								plugins: [{
									ptype: 'rowexpander',
									pluginId: 'rowexpanderID',
									selectRowOnExpand: true,			
									rowBodyTpl : new Ext.XTemplate(
										'<p><b>category:</b> {category} | <b>instalation:</b> {instalation} ', //&#x2016; doble linea vertical
										'| <b>quality:</b> {quality} ',
										'| <b>lon:</b> {lon} ',
										'| <b>lat:</b> {lat} ',
										'| <b>elev:</b> {elev} </p>',
										'<p><b>country:</b> {country} ',
										'| <b>state:</b> {state} ',
										'| <b>city:</b> {city}</p> ',
										'<div id="myrow-{id}" ></div>'
									),		
									expandOnRender: true,
									expandOnDblClick: false		
	/*							toggleRow: function(rowIdx) {
										var rowNode = this.view.getNode(rowIdx); 
										row = Ext.get(rowNode);
										nextBd = Ext.get(row).down(this.rowBodyTrSelector);
										hiddenCls = this.rowBodyHiddenCls;
										record = this.view.getRecord(rowNode);
										grid = this.getCmp();
										acctNo = record.get('id');
										targetId = 'AccountGridRow-' + acctNo;			

										if (row.hasCls(this.rowCollapsedCls)) {
											row.removeCls(this.rowCollapsedCls);
											this.recordsExpanded[record.internalId] = true;
											this.view.fireEvent('expandbody', rowNode, record, nextBd.dom);

											if (rowNode.grid) {
												nextBd.removeCls(hiddenCls);
												rowNode.grid.doComponentLayout();
												rowNode.grid.view.refresh();
											} else {
												
												var store = Ext.create('Ext.data.Store', {
													model: 'modelGridVar',
													autoSync: true,
													proxy: {
														type: 'ajax', 
														url: 'php/Geo_statByregion.php',
														extraParams: {
															country : 'Nicaragua', state:'', municip:'',type:6
														},
														reader: {
															type: 'json',
															root: 'topics'
														}
													},
													autoLoad: {
														callback: function(records, operation, success) {
															nextBd.removeCls(hiddenCls);
															var grid = Ext.create('Ext.grid.Panel', { // <-- this is my "inner" grid view
																	renderTo: Ext.get(targetId),// Ext.getElementById(targetId) //targetId,Ext.get(targetId)
																	store: store,
																	height:100,
																	width:300,
																	columns: [
																		{
																			xtype: 'actioncolumn',
																			flex: 1,width:60,
																			items: [{
																				icon   : icons+'buttons/download_off.gif',  // Use a URL in the icon config
																				tooltip: 'zoom extent',
																				handler: function(grid, rowIndex, colIndex) {
																					var rec = store.getAt(rowIndex);
																					alert("Sell " + rec.get('name'));
																				}
																			}]
																		},												
																		{ text: 'name',dataIndex: 'name',width:80,flex: 1},{ text: 'date_start',dataIndex: 'date_start',width:80,flex: 1}],
																	row: row,
																});
															
															rowNode.grid = grid;

															grid.suspendEvents(); 
														}
													}
												});
											}

										}else {
											row.addCls(this.rowCollapsedCls);
											nextBd.addCls(this.rowBodyHiddenCls);
											this.recordsExpanded[record.internalId] = false;
											this.view.fireEvent('collapsebody', rowNode, record, nextBd.dom);
										}			
									}		
	*/							
								}],							

								stripeRows: true,
								// margin: '0 0 20 0',
								selModel: selModel2,
								// viewConfig: { 
									// stripeRows: false, 
									// getRowClass: function(record) { 
										// if(winRegion.width==winRegion.maxWidth){
											// return 'regiongrid-max';
										// }else{return 'regiongrid-min';}
									// }	
								// },
								// inline buttons
								dockedItems: [
									{
									xtype: 'toolbar',
									items: [{
										itemId: 'removeButton',
										text:'Download',
										tooltip:'Download data',
										icon   : iconGridDownload,
										disabled: true,
										handler: btn_download 
									},cmbVar,{
										itemId: 'zoomExtentALL',
										text:'zoomExtentALL',
										tooltip:'zoomExtent to ALL',
										icon   : iconGridzoomExtentALL,//iconCls:'add',
										handler: onZoomExtentALL 
									},{
										itemId: 'idExpand',
										text:'Expand all',
										tooltip:'Expand all',
										iconCls:iconGridExpand,
										handler: expand 
									},{
									
										itemId: 'idstatistic',
										text:'Statistics',
										tooltip:'Summary Statistic',
										icon   : iconGridStatistics,
										disabled: true,
										handler: statistics 
									},{ xtype: 'tbtext', itemId: 'numRecords' },{xtype: 'tbfill'},
									{ 
										itemId: 'idMaximo',
										// text:'Maximize',
										tooltip:'Maximize table',
										icon   : iconGridMaximize,
										// stretch: false,
										align: 'right',
										handler: Maximize,
									}]
								}]
								
							});
							
							// para el mostrar el grid de variables cuando se da en el boton expandir
							Ext.getCmp('gridRegionID').getView().on('expandbody', function(rowNode, record, expandbody,eNode){

								var dynamicStore  //the new store for the nested grid.
								var row = "myrow-" + record.get("id");
								var id2 = "mygrid-" + record.get("id");  
								row2 = Ext.get(rowNode);
								
								var store = Ext.create('Ext.data.Store', {
									model: 'modelGridVar',
									autoSync: true,
									storeId: 'store2',
									proxy: {
										type: 'ajax', 
										url: 'php/Geo_statByregion.php',
										extraParams: {
											idstat: record.get("id"), country : country, state:state, municip:municip,type:6
										},
										reader: {
											type: 'json',
											root: 'topics'
										}
									},
									autoLoad: true// {callback: initData}
								});
									  
								var grid = Ext.create('Ext.grid.Panel', {
									// hideHeaders: true,
									border: false,
									height:100,
									layout: 'fit',
									// width:500,
									autoWidth:true,
									id: id2,
									columns: [{
											xtype: 'actioncolumn',
											// flex: 0,
											width: 150,
											autoSizeColumn: true,
											items: [{
												icon   : icons+'buttons/download_off.gif',  // Use a URL in the icon config
												tooltip: 'zoom extent2',
												handler: function(grid, rowIndex, colIndex) {
													var rec = store.getAt(rowIndex);
													idstat=rec.get('idstat')
													idvar=rec.get('idvar')
													Ext.DomHelper.append(document.body, {
													  tag: 'iframe',
													  id:'downloadIframe',
													  frameBorder: 0,
													  width: 0,
													  height: 0,
													  css: 'display:none;visibility:hidden;height: 0px;',
													  src: 'php/dowloaddata.php?typedwn=selection&station='+Ext.encode([idstat])+'&'+'variable='+Ext.encode([idvar])
													});
												
												}
											}]
										},{ text: 'name',dataIndex: 'name'},
										{ text: 'acronym',dataIndex: 'acronym'},
										{ text: 'date_start',dataIndex: 'date_start'},
										{ text: 'date_end',dataIndex: 'date_end'},
										{ text: 'age',dataIndex: 'age',autoSizeColumn: true}],
									store: store,
									viewConfig: {
										listeners: {
											refresh: function(dataview) {
												Ext.each(dataview.panel.columns, function(column) {
													if (column.autoSizeColumn === true)
														column.autoSize();
												})
											}
										}
									}	
								});
								
							   grid.render(row)
								grid.getEl().swallowEvent([ 'mouseover', 'mousedown', 'click', 'dblclick' ]);
								// grid.on('itemclick', function(view) {
									// Ext.getCmp('gridRegionID').getView().getSelectionModel().deselectAll();
								// });
								
									
							});	
							gridRegion.getView().on('collapsebody', function(rowNode, record, eNode) {
								var row = "myrow-" + record.get("id");
								var id2 = "mygrid-" + record.get("id");  
								// Ext.getCmp(id2).getStore().removeAll();
								$('#'+row).empty();
								// Ext.get(rowNode).down('#'+row).down('div').destroy();
							});

							gridRegionStore.on('load', function(ds){
								countRow=ds.getTotalCount()
								if(countRow>1){
									// winRegion.show()
									// Ext.getCmp('gridRegionID').add(gridRegion);
									// Ext.getCmp('gridRegionID').doLayout();
									
									Ext.getCmp('mainTableID').add(gridRegion);
									gridRegion.down('#numRecords').setText('Records: ' + countRow);
									Ext.getCmp('mainTableID').expand()
								}else{
									Ext.getCmp('mainTableID').collapse()
									winInfo=Ext.MessageBox.show({
									   title: 'Information',
									   msg: 'Not stations found!',
									   buttons: Ext.MessageBox.OK,
									   animateTarget: 'info',
									   icon: 'x-message-box-info'
									});	
									winInfo.setPosition(mainPanelWidth/3,mainPanelHeight/2);
								}	
							});	

						}	
					}
				}
			},{
				text: 'Reset',
				handler: function(){
					if(Ext.getCmp('popupID')){
						Ext.getCmp('popupID').close()
					}					
					if(Ext.getCmp('gridRegionID')){
						Ext.getCmp('mainTableID').collapse();
						Ext.getCmp('gridRegionID').destroy();	
					}				
					selectControl.control.unselectAll();
					tabSearchRegion.getForm().reset();
					layerTempReg=mapPanel.map.getLayersByName("FindRegion")[0]
					if(layerTempReg){mapPanel.map.removeLayer(layerTempReg);}
					
					layerTempStat=mapPanel.map.getLayersByName("FindStation")[0]
					if(layerTempStat){mapPanel.map.removeLayer(layerTempStat);}				
				}
			}]
		  }
			
        ]
    };
	
	var radiosStat = new Ext.form.RadioGroup({
		columns    : 2,
		name: 'timespan',
		id: 'radioBton',
		fieldLabel: 'Search',
		allowBlank:true,
		labelWidth: 50,
		items: [
			 {boxLabel: 'By Id', name: 'radio1', inputValue: 1},
			 {boxLabel: 'By Name', name: 'radio1', inputValue: 2}
		],
		listeners: {
			change: function(radiogroup, radio){
			
			if(Ext.getCmp('radioBton').getChecked()[0]){
				var selVal = Ext.getCmp('radioBton').getChecked()[0].getGroupValue();
			
				var storestat = Ext.getCmp('cmbStatID');
			
				storestat.enable();
				storestat.clearValue();  

				storestat.getStore().load({
					params: {radioCh: selVal,type:8}, // callback: function(records, operation, success) {console.log(records);} // para comprobar 
				});	
			}			
		}}			
   });		

	Ext.define('modelstatList', { 
			extend: 'Ext.data.Model',
			fields: [
				{ name: 'id', type: 'string' },
				{ name: 'name', type: 'string' },
				{ name: 'inst', type: 'string' }
			]
		});
	var statstore = Ext.create('Ext.data.Store', {
		model: 'modelstatList',
		// autoLoad: true,
		// autoSync: true,
		// sorters: { property: 'name', direction : 'ASC' },
		proxy: {
			type: 'ajax',
			url: 'php/Geo_statByregion.php',
			reader: {
				type: 'json',
				root: 'topics'
			}
		}
	});	

	cmbStat= Ext.create('Ext.form.field.ComboBox', { 
		// editable: false, 
		id:'cmbStatID',
		displayField: 'name',
		fieldLabel: 'Station',
		labelWidth: 50,
		disabled: true,
		valueField: 'name', 
		queryMode: 'local',
		typeAhead: true,	
		store: statstore,
		listConfig: {
			getInnerTpl: function() {
				return '<div data-qtip="id:{id}|{inst}">{name}</div>';
			}
		}		
	});	
   
    var groupByStation = {
        xtype: 'fieldset',
        title: 'Search by station   '+ '<img id="help_toolip" class="tooltipIcon" src='+icons+infoB+' data-qtip="'+toolip_groupByStation+'" />',//<span data-qtip="hello">First Name</span>  
		width:fieldsetWidth,
        layout: 'anchor',
        defaults: {
            anchor: '100%'
        },
        collapsible: true,
        collapsed: false,
        items: [radiosStat,cmbStat,
		{	buttonAlign:'center',
			bodyStyle: 'padding-top:5px; border-bottom:1px solid #CCCCCC; width:80px;',
			buttons: [{
				text: 'Execute',
				handler: function(){
					if(Ext.getCmp('radioBton').getChecked()[0]){//if(tabSearchStat.getForm().isValid()){
						if(Ext.getCmp('popupID')){
							Ext.getCmp('popupID').close()
						}					
						
						radioCh = Ext.getCmp('radioBton').getChecked()[0].getGroupValue();
					
						getStat = cmbStat.getValue();
						layerTemp=mapPanel.map.getLayersByName("FindRegion")[0]
						if(layerTemp){layerTemp.destroyFeatures();mapPanel.map.removeLayer(layerTemp);}
						
						// FindStation=mapPanel.map.getLayersByName("FindStation")[0]
						// if(FindStation){FindStation.destroyFeatures();mapPanel.map.removeLayer(layerTemp);}		
						
						if(Ext.getCmp('popupID')){
							Ext.getCmp('popupID').close()
						}						
						if(Ext.getCmp('gridRegionID')){
							Ext.getCmp('mainTableID').collapse();
							Ext.getCmp('gridRegionID').destroy();	
						}
							
						if(getStat){
							Ext.Ajax.request({ // PINTA EN EL MAPA LAS ESTACIONES INTERCEPTADAS
								url : 'php/Geo_statByregion.php' , 
								params : {type:9,getStat:getStat,radioCh:radioCh},
								method: 'GET',
								success: function ( result, request ) {
									layerTemp=mapPanel.map.getLayersByName("FindStation")[0]
									if(layerTemp){layerTemp.destroyFeatures();mapPanel.map.removeLayer(layerTemp);}
									
									geocapa = result.responseText;
									var format = new OpenLayers.Format.GeoJSON({'internalProjection': new OpenLayers.Projection("EPSG:900913"), 'externalProjection': new OpenLayers.Projection("EPSG:4326")
									});
									if(format.read(geocapa)[0]){
										mapPanel.map.addLayer(layerTempStat);
										layerTemp=mapPanel.map.getLayersByName("FindStation")[0]
										layerTemp.addFeatures(format.read(geocapa));
									}
									var BoundALL = layerTemp.getDataExtent();
									mapPanel.map.zoomToExtent(BoundALL);									
								},
								failure: function ( result, request) { 
									Ext.MessageBox.alert('Failed', result.responseText);
								}
							});	
							 ////////////////////////////////////////////////////////////////////////////////////////
							// PARA EXTRAER LA INFORMACION DE LAS ESTACIONES EN UNA TABLA
							 ////////////////////////////////////////////////////////////////////////////////////////

							var gridRegionStore = Ext.create('Ext.data.Store', {
								model: 'modelGridRegion',
								autoLoad: true,
								autoSync: true,
								sorters: { property: 'name', direction : 'ASC' },
								proxy: {
									type: 'ajax',
									url: 'php/Geo_statByregion.php',
									extraParams: {type:10,getStat:getStat,radioCh:radioCh},			
									reader: {
										type: 'json',
										root: 'topics'
									}
								}
							});								

							var varstore = Ext.create('Ext.data.Store', {
								model: 'modelvarList',
								autoLoad: true,
								autoSync: true,
								sorters: { property: 'name', direction : 'ASC' },

								proxy: {
									type: 'ajax',
									url: 'php/Geo_statByregion.php',
									extraParams: {type:11,getStat:getStat,radioCh:radioCh},			
									reader: {
										type: 'json',
										root: 'topics'
									}
								},
								listeners: {
									 load: function(store, records) {
										  store.insert(0, [{
											  id: 0,
											  name: 'ALL',
											  acronym: 'ALL'
											  
										  }]);
									 }
								  }								
							});	
							
							var selModel = Ext.create('Ext.selection.CheckboxModel', {
								listeners: {
									selectionchange: function(sm, selections) {
										gridRegion.down('#removeButton').setDisabled(selections.length === 0);
										gridRegion.down('#idstatistic').setDisabled(selections.length === 0);
									}
								}
							});	
							btn_download = function () {
								var selection = gridRegion.getView().getSelectionModel().getSelection();//[0];
								selgrid=new Array()
								for(var i = 0; i < selection.length; i++) {
									selgrid.push(Number(selection[i].data.id));
								}
								console.log(cmbVar.getValue())
								Ext.DomHelper.append(document.body, {
								  tag: 'iframe',
								  id:'downloadIframe',
								  frameBorder: 0,
								  width: 0,
								  height: 0,
								  css: 'display:none;visibility:hidden;height: 0px;',
								  src: 'php/dowloaddata.php?station='+Ext.encode(selgrid)+'&'+'country=null'+'&'+'state=null'+'&'+'municip=null'+'&'+'variable='+Ext.encode(cmbVar.getValue())
								});
							}	

							cmbVar= Ext.create('Ext.form.field.ComboBox', { 
								editable: false, 
								value: 'ALL',
								multiSelect: true, 
								displayField: 'acronym',
								valueField: 'id', 
								id:'varCmbID',
								queryMode: 'local',
								typeAhead: true,	
								store: varstore,
								listConfig: {
									getInnerTpl: function() {
										return '<div data-qtip="{name}">{acronym}</div>';
									}
								}
							
							});		

							gridRegion = Ext.create('Ext.grid.Panel', {
								id: 'gridRegionID',
								border: true,
								// layout: 'fit',
								forceFit: true,
								store: gridRegionStore,
								maxHeight: Ext.getBody().getViewSize().height*0.3,
								width: mainPanelWidth,
								// height:273,
								// maxHeight: mainPanelHeight*0.4,
								selType: 'checkboxmodel',
								autoHeight: true,
								columns: [
									{
										xtype: 'actioncolumn',
										minWidth: 20,
										flex: 1,
										items: [{
											icon   : icons+'buttons/zoomin_off.gif',  // Use a URL in the icon config
											tooltip: 'zoom extent',
											handler: function(grid, rowIndex, colIndex) {
												var rec = gridRegionStore.getAt(rowIndex);
												selectionID = rec.get('id');
												layerTemp=mapPanel.map.getLayersByName("FindStation")[0]
												for (var i = layerTemp.features.length - 1; i >= 0; --i) {
													if(layerTemp.features[i].attributes.id==selectionID){
														featureSel=layerTemp.features[i].geometry
														var bounds = featureSel.getBounds();
														if(bounds){ mapPanel.map.panTo(bounds.getCenterLonLat()); mapPanel.map.zoomToExtent(bounds);}
				
														var mySelectStyle = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style["default"]);
														OpenLayers.Util.extend(mySelectStyle, {pointRadius: 12,fillOpacity: 0.1,strokeColor: "#00FF00",});//{externalGraphic: iconZomm,graphicHeight: 32,graphicWidth: 32,fillOpacity: 0.8});	
														
														var selectFeature = new OpenLayers.Control.SelectFeature(layerTemp,{selectStyle: mySelectStyle});
														mapPanel.map.addControl(selectFeature);
														selectFeature.activate();	
														selectFeature.select(layerTemp.features[i]);	
														// mapPanel.map.removeControl(selectFeature); // selectFeature.deactivate()
													}
												}											
												
											}
										}]
									},		
									{
										xtype: 'actioncolumn',
										minWidth: 20,
										flex: 1,
										items: [{
											icon   : icons+'buttons/pie-chart-graph-icon.png',  // Use a URL in the icon config
											tooltip: 'Graphic',
											handler: function(grid, rowIndex, colIndex) {
												var rec = gridRegionStore.getAt(rowIndex);
												selectionID = rec.get('id');
												
												varlist=(cmbVar.getRawValue()).replace(/\s/g, '')
												var arrayvar =new Array() //varlist.split(',');

												for(var i = 0; i < varstore.getCount(); i++) {
													var record = varstore.getAt(i);
													id=record.get('id')
													acronym=record.get('acronym')
													arrayvar.push(acronym)
													// console.log(id,acronym)
												}
												
												var datatest = {
													name: 'xxx',
													rowTitleArr: arrayvar,
													colTitleArr: ['a', 'b', 'c']
												}
												var tpl = [
													'<div id="grap_temp_'+selectionID+'" style="width:'+grapWidth+'px;"></div>',
													'<tpl for="rowTitleArr">',
													'<div id="grap_{.}_'+selectionID+'" style="width:'+grapWidth+'px;"></div>',
													'</tpl>'
													];	

												cmbPeriod='cmbPeriod'+selectionID
												cmbPeriod=Ext.create('Ext.form.field.ComboBox', { 
													fieldLabel: 'Select graphic model',
													id:'cmbPeriodID'+selectionID,
													labelWidth:150,
													store: {
														fields: ['value','name'], 
														data: [ 
															{value:1,name: 'Daily'}, 
															{value:2,name: 'Monthly'}, 
															{value:3,name: 'Yearly'}
														]
													},
													displayField: 'name',
													value: 1,
													queryMode: 'local',
													valueField: 'value', 								
													typeAhead: true,
													listeners: {
														select: function() {
															var actTab = tabs.getActiveTab();
															var idx = tabs.items.indexOf(actTab);
															actTabId=parseInt((actTab.title).match(/\d+/)[0])
															var idPeriod = Ext.getCmp('cmbPeriodID'+actTabId).getValue()
															console.log(actTab,idx,actTabId,idPeriod)
															generateGraps(actTabId,idPeriod,Ext.encode(cmbVar.getValue()))

														}
													}
												});		
												if(!Ext.getCmp('graphic'+selectionID)){
													tabs.add({
														// contentEl: "desc",
														// xtype: 'panel',
														title: 'Graphic_id'+selectionID,
														name: 'graphic'+selectionID,
														// width:mainPanelWidth-15,
														// maxHeight: 100,
														autoScroll: true,
														// height: 100,
														// autoHeight: true,
														// layout: 'fit',
														id: 'graphic'+selectionID,
														 // html: new Ext.XTemplate(
														 // tpl
														 // '<div id="grap_tmin_'+selectionID+'" ></div>',
														 // '<div id="grap_prec_'+selectionID+'"></div>'
														 // ),
														 // .apply({value: '2. HTML property of a panel generated by an XTemplate'}),
														closable: true,
														dockedItems: [
															{
															xtype: 'toolbar',
															items: [cmbPeriod]
															}
														]													
													});		
												}
												var t = new Ext.XTemplate(tpl);
												Ext.getCmp('graphic'+selectionID).update(t.apply(datatest));
												// Ext.getCmp('graphic'+selectionID).update('This<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long');
												
												Ext.getCmp('mapPanelID').setHeight(0)
												Ext.getCmp('tabsID').setWidth(mainPanelWidth-15);
												// Ext.getCmp('tabsID').setHeight(mainPanelHeight*0.2);
												tabs.setActiveTab('graphic'+selectionID);
												
												generateGraps(selectionID,cmbPeriod.getValue(),Ext.encode(cmbVar.getValue()))
											} // handler
										}]
									},								
									// {
										// text : '&#8470;',
										// dataIndex: 'rowIndex',
										// flex: 1,
										// minWidth: 20,
										// renderer : function(value, metaData, record, rowIndex)
										// {return rowIndex+1;}
									// },			
									{ text: 'id',minWidth: 50,dataIndex: 'id', flex: 1},
									{ text: 'code',minWidth: 80,dataIndex: 'code', flex: 1},
									{ text: 'name',minWidth: 120,dataIndex: 'name', flex: 4},
									{ text: 'institute',minWidth: 50,dataIndex: 'institute', flex: 3},
									{ text: 'model',minWidth: 80,dataIndex: 'model', flex: 2},
									
									// { text: 'category',minWidth: 100,dataIndex: 'category', flex: 4},

									// { text: 'instalation',minWidth: 80,dataIndex: 'instalation', flex: 3},
									// { text: 'quality',minWidth: 80,dataIndex: 'quality', flex: 1},
									
									{ text: 'variables',minWidth: 100,dataIndex: 'variables', flex: 4},
									// { text: 'lon',minWidth: 80,dataIndex: 'lon', flex: 3},
									// { text: 'lat',minWidth: 80,dataIndex: 'lat', flex: 3},
									// { text: 'elev',minWidth: 80,dataIndex: 'elev', flex: 2},
									// { text: 'country',minWidth: 80,dataIndex: 'country', flex: 4},
									// { text: 'state',minWidth: 80,dataIndex: 'state', flex: 4},
									// { text: 'city',minWidth: 90,dataIndex: 'city', flex: 4}
									
								],
								columnLines: true,
								plugins: [{
									ptype: 'rowexpander',
									pluginId: 'rowexpanderID',
									selectRowOnExpand: true,			
									rowBodyTpl : new Ext.XTemplate(
										'<p><b>category:</b> {category} | <b>instalation:</b> {instalation} ', //&#x2016; doble linea vertical
										'| <b>quality:</b> {quality} ',
										'| <b>lon:</b> {lon} ',
										'| <b>lat:</b> {lat} ',
										'| <b>elev:</b> {elev} </p>',
										'<p><b>country:</b> {country} ',
										'| <b>state:</b> {state} ',
										'| <b>city:</b> {city}</p> ',
										'<div id="myrow-{id}" ></div>'
									),		
									expandOnRender: true,
									expandOnDblClick: false		
						
								}],							

								stripeRows: true,
								// margin: '0 0 20 0',
								selModel: selModel,
								// viewConfig: { 
									// stripeRows: false, 
									// getRowClass: function(record) { 
										// if(winRegion.width==winRegion.maxWidth){
											// return 'regiongrid-max';
										// }else{return 'regiongrid-min';}
									// }	
								// },
								// inline buttons
								dockedItems: [
									{
									xtype: 'toolbar',
									items: [{
										itemId: 'removeButton',
										text:'Download',
										tooltip:'Download data',
										icon   : iconGridDownload,
										disabled: true,
										handler: btn_download 
									},cmbVar,{
										itemId: 'zoomExtentALL',
										text:'zoomExtentALL',
										tooltip:'zoomExtent to ALL',
										icon   : iconGridzoomExtentALL,//iconCls:'add',
										handler: onZoomExtentALL 
									},{
										itemId: 'idExpand',
										text:'Expand all',
										tooltip:'Expand all',
										iconCls:iconGridExpand,
										handler: expand 
									},{
										itemId: 'idstatistic',
										text:'Statistics',
										tooltip:'Summary Statistic',
										icon   : iconGridStatistics,
										disabled: true,
										handler: statistics 
									},{ xtype: 'tbtext', itemId: 'numRecords' },{xtype: 'tbfill'},
									{ 
										itemId: 'idMaximo',
										// text:'Maximize',
										tooltip:'Maximize table',
										icon   : iconGridMaximize,
										// stretch: false,
										align: 'right',
										handler: Maximize,
									}]
								}]		
							});

							// para el mostrar el grid de variables cuando se da en el boton expandir
							Ext.getCmp('gridRegionID').getView().on('expandbody', function(rowNode, record, expandbody,eNode){

								var dynamicStore  //the new store for the nested grid.
								var row = "myrow-" + record.get("id");
								var id2 = "mygrid-" + record.get("id");  
								row2 = Ext.get(rowNode);
								
								var store = Ext.create('Ext.data.Store', {
									model: 'modelGridVar',
									autoSync: true,
									storeId: 'store2',
									proxy: {
										type: 'ajax', 
										url: 'php/Geo_statByregion.php',
										extraParams: {
											idstat: record.get("id"),getStat:getStat,radioCh:radioCh,type:12
										},
										reader: {
											type: 'json',
											root: 'topics'
										}
									},
									autoLoad: true// {callback: initData}
								});
									  
								var grid = Ext.create('Ext.grid.Panel', {
									// hideHeaders: true,
									border: false,
									height:100,
									layout: 'fit',
									// width:500,
									autoWidth:true,
									id: id2,
									columns: [{
											xtype: 'actioncolumn',
											// flex: 0,
											width: 150,
											autoSizeColumn: true,
											items: [{
												icon   : icons+'buttons/download_off.gif',  // Use a URL in the icon config
												tooltip: 'zoom extent2',
												handler: function(grid, rowIndex, colIndex) {
													var rec = store.getAt(rowIndex);
													idstat=rec.get('idstat')
													idvar=rec.get('idvar')
													Ext.DomHelper.append(document.body, {
													  tag: 'iframe',
													  id:'downloadIframe',
													  frameBorder: 0,
													  width: 0,
													  height: 0,
													  css: 'display:none;visibility:hidden;height: 0px;',
													  src: 'php/dowloaddata.php?typedwn=selection&station='+Ext.encode([idstat])+'&'+'variable='+Ext.encode([idvar])
													});
												
												}
											}]
										},{ text: 'name',dataIndex: 'name'},
										{ text: 'acronym',dataIndex: 'acronym'},
										{ text: 'date_start',dataIndex: 'date_start'},
										{ text: 'date_end',dataIndex: 'date_end'},
										{ text: 'age',dataIndex: 'age',autoSizeColumn: true}],
									store: store,
									viewConfig: {
										listeners: {
											refresh: function(dataview) {
												Ext.each(dataview.panel.columns, function(column) {
													if (column.autoSizeColumn === true)
														column.autoSize();
												})
											}
										}
									}	
								});
								
							   grid.render(row)
								grid.getEl().swallowEvent([ 'mouseover', 'mousedown', 'click', 'dblclick' ]);
								// grid.on('itemclick', function(view) {
									// Ext.getCmp('gridRegionID').getView().getSelectionModel().deselectAll();
								// });
								
									
							});	
							gridRegion.getView().on('collapsebody', function(rowNode, record, eNode) {
								var row = "myrow-" + record.get("id");
								var id2 = "mygrid-" + record.get("id");  
								// Ext.getCmp(id2).getStore().removeAll();
								$('#'+row).empty();
								// Ext.get(rowNode).down('#'+row).down('div').destroy();
							});

							gridRegionStore.on('load', function(ds){
								countRow=ds.getTotalCount()
								if(countRow>=1){
									// winRegion.show()
									// Ext.getCmp('gridRegionID').add(gridRegion);
									// Ext.getCmp('gridRegionID').doLayout();
									
									Ext.getCmp('mainTableID').add(gridRegion);
									gridRegion.down('#numRecords').setText('Records: ' + countRow);
									Ext.getCmp('mainTableID').expand()
								}else{
									Ext.getCmp('mainTableID').collapse()
									winInfo=Ext.MessageBox.show({
									   title: 'Information',
									   msg: 'Not stations found!',
									   buttons: Ext.MessageBox.OK,
									   animateTarget: 'info',
									   icon: 'x-message-box-info'
									});	
									winInfo.setPosition(mainPanelWidth/3,mainPanelHeight/2);
								}	
							});	
							
							
						}
						
					}
				}			
			},{
				text: 'Reset',
				handler: function(){
					if(Ext.getCmp('popupID')){
						Ext.getCmp('popupID').close()
					}				
					if(Ext.getCmp('gridRegionID')){
						Ext.getCmp('mainTableID').collapse();
						Ext.getCmp('gridRegionID').destroy();	
					}		
					selectControl.control.unselectAll();
					Ext.getCmp("cmbStatID").reset();
					tabSearchStat.getForm().reset();
					layerTempReg=mapPanel.map.getLayersByName("FindRegion")[0]
					if(layerTempReg){mapPanel.map.removeLayer(layerTempReg);}
					
					layerTempStat=mapPanel.map.getLayersByName("FindStation")[0]
					if(layerTempStat){mapPanel.map.removeLayer(layerTempStat);}	
				}		
			}]
		}]
			  
    };


	var queryStore = Ext.create('Ext.data.Store', {
		fields: ['id','name'], 
		data: [ 
			{"id":"1","name": 'Age'}, 
			{"id":"2","name": 'Variables'}, 
			{"id":"3","name": 'Status'}, 
			{"id":"4","name": 'Elevation'}, 
			// {"id":"5","name": 'Coordinates'}, 
			{"id":"6","name": 'Institute'},
			{"id":"7","name": 'Quality'},
			{"id":"8","name": 'Category'},
			{"id":"9","name": 'Model'},
			{"id":"10","name": 'Country'}, 
			{"id":"11","name": 'State'}, 
			{"id":"12","name": 'Municipality'} 			

		] 
	});	
	
	Ext.define('modelCondVal', { 
			extend: 'Ext.data.Model',
			fields: [
				{ name: 'id', type: 'string' },
				{ name: 'name', type: 'string' },
			]
		});	
	var condValStore = Ext.create('Ext.data.Store', {
		model: 'modelCondVal',
		// autoLoad: true,
		// autoSync: true,		
		proxy: {
			type: 'ajax',
			url: 'php/Geo_statByregion.php',
			reader: {
				type: 'json',
				root: 'topics'
			}
		}
	});	

	cmbCondTypewidth=130
	cmbQuerywidth=90
	cmbCondwidth=50
	cmbCondValuewidth=85
	
	
	cmbQuery= Ext.create('Ext.form.field.ComboBox', { 
		// editable: false, 
		id:'cmbQueryID',
		width:cmbQuerywidth,
		store:queryStore,
		valueField: 'id',                     
		displayField: 'name',
		triggerAction: 'all',
		typeAhead: true,
		listeners: {
			select:{fn:function(combo, value) {
				var storestate = Ext.getCmp('cmbCondValueID');  
					storestate.enable();
					storestate.clearValue();  
					storestate.getStore().load({
						params: {idCond: combo.getValue(),type:18}, // callback: function(records, operation, success) {console.log(records);} // para comprobar 
					});
					
					storeComp = Ext.getCmp('cmbCondID');
					storeComp.enable();
					storeComp.clearValue(); 											
					storeComp.getStore().load({
						params: {idCond: combo.getValue(),type:20}, // callback: function(records, operation, success) {console.log(records);} // para comprobar 
					});					
					
				}}                                
		}		
	});	
	var condStore = Ext.create('Ext.data.Store', { 
		model: 'modelCondVal',
		proxy: {
			type: 'ajax',
			url: 'php/Geo_statByregion.php',
			reader: {
				type: 'json',
				root: 'topics'
			}
		} 
	});
	var condTypeStore = Ext.create('Ext.data.Store', { 
		fields: ['id','name'], 
		data: [ 
			{"id":"1","name": 'any'}, 
			{"id":"2","name": 'all'}
		] 
	});	


	var cmbCond = Ext.create('Ext.form.field.ComboBox', {
		id:'cmbCondID', 
		width:cmbCondwidth,
		store:condStore,
		valueField: 'id',                     
		displayField: 'name',
		queryMode: 'local',
		typeAhead: true,
		disabled: true	

	})
	var cmbCondValue = Ext.create('Ext.form.field.ComboBox', {
            id:'cmbCondValueID', 
			width:cmbCondValuewidth,
			store:condValStore,
			valueField: 'id',                     
			displayField: 'name',
			// triggerAction: 'all',
			queryMode: 'local',
			typeAhead: true,
			disabled: true		

	})
	var cmbCondType = Ext.create('Ext.form.field.ComboBox', {
            id:'cmbCondTypeID', 
			fieldLabel:'Match in',
			width:cmbCondTypewidth,
			labelWidth:60,
            store:condTypeStore,
            valueField: 'id',                     
            displayField: 'name',
			triggerAction: 'all',
			typeAhead: true

	})
	var btonDeletCond= new Ext.Button({
		id:'btnDeleteCondID',
		icon: icons+'delete.png',
		handler: function(){
			// Ext.getCmp('buttongroupCondID').remove(Ext.getCmp('btnDeleteCondID'));
			// Ext.getCmp('buttongroupCondID').remove(Ext.getCmp('cmbQueryID'));
			// Ext.getCmp('buttongroupCondID').remove(Ext.getCmp('cmbCondID'));
			// Ext.getCmp('buttongroupCondID').remove(Ext.getCmp('cmbCondValueID'));
				
		}
	});	
	
	condlistsel=[]
	count=0
    var groupByQuery = {
        xtype: 'fieldset',
        title: 'Advanced query   '+ '<img id="help_toolip" class="tooltipIcon" src='+icons+infoB+' data-qtip="'+toolip_groupByQuery+'" />',//<span data-qtip="hello">First Name</span>  
		id:'groupByQueryID',
        layout: 'anchor',
		width:fieldsetWidth,
        defaults: {
            anchor: '100%',
			bodyStyle: 'padding:4px'
        },
        collapsible: true,
        collapsed: true,
		items: [
		{
			layout: 'column',
			// columns: 2,
			items: [cmbCondType]//,{xtype: 'tbtext', text: 'Sample',width:40}]
		},		
		{
			xtype: 'buttongroup',
			id: 'buttongroupCondID',
			columns: 4,
			defaults: {
				scale: 'small',
				// border: false
			},
			style: {
				border: 0,
				padding: 0
			},			
			items: [btonDeletCond,cmbQuery,cmbCond,cmbCondValue]
		},{
			xtype: 'buttongroup',
			columns: 4,
			// layout: 'column',
			// layout: {
				// type: 'hbox',
				// columns: 2
			// },			
			// style:'font-size: 10px;',
			cls:'my-cls',
			style: {
				border: 0,
				padding: 0
			},				
			defaults: {
				scale: 'small',
			},
			items: [		
				{
					xtype:'button',
					text:'Add condition',
					icon: icons+'add.png',
					width:95,
					handler: function(){
							count=count+1
							btonDeletCond= new Ext.Button({
								id:'btnDeleteCondID'+count,
								icon: icons+'delete.png',
								handler: function(b,e){
										Ext.getCmp('buttongroupCondID').remove(Ext.getCmp(b.id),true);
										Ext.getCmp('buttongroupCondID').remove(Ext.getCmp('cmbQueryID'+(b.id).match(/\d+/)[0]));
										Ext.getCmp('buttongroupCondID').remove(Ext.getCmp('cmbCondID'+(b.id).match(/\d+/)[0]));
										Ext.getCmp('buttongroupCondID').remove(Ext.getCmp('cmbCondValueID'+(b.id).match(/\d+/)[0]));
										var index = condlistsel.indexOf(parseInt((b.id).match(/\d+/)[0]));
										if (index > -1) {
											condlistsel.splice(index, 1);
										}
										
								},
							});		
							condlistsel.push(count)
							cmbQuery= Ext.create('Ext.form.field.ComboBox', { 
								// editable: false, 
								id:'cmbQueryID'+count,
								width:cmbQuerywidth,
								store:queryStore,
								valueField: 'id',                     
								displayField: 'name',
								triggerAction: 'all',
								typeAhead: true,
								listeners: {
									select:{fn:function(combo, value) {
											storestate = Ext.getCmp('cmbCondValueID'+count);  
											storestate.enable();
											storestate.clearValue();  
											storestate.getStore().load({
												params: {idCond: combo.getValue(),type:18}, // callback: function(records, operation, success) {console.log(records);} // para comprobar 
											});											
											
											storeComp = Ext.getCmp('cmbCondID'+count);
											storeComp.enable();
											storeComp.clearValue(); 											
											storeComp.getStore().load({
												params: {idCond: combo.getValue(),type:20}, // callback: function(records, operation, success) {console.log(records);} // para comprobar 
											});
											
										}}                                
								}									
							});		
							var condStore = Ext.create('Ext.data.Store', { 
								model: 'modelCondVal',
								id:'condStore'+count, 
								proxy: {
									type: 'ajax',
									url: 'php/Geo_statByregion.php',
									reader: {
										type: 'json',
										root: 'topics'
									}
								} 
							});							
							cmbCond = Ext.create('Ext.form.field.ComboBox', {
									id:'cmbCondID'+count, 
									width:cmbCondwidth,
									store:condStore,
									valueField: 'id',                     
									displayField: 'name',
									queryMode: 'local',
									typeAhead: true,
									disabled: true									

							})	
							getValcmbQuery = Ext.getCmp('cmbQueryID'+count).getValue()
							
							var condValStore = Ext.create('Ext.data.Store', {
								model: 'modelCondVal',
								// autoLoad: true,
								// autoSync: true,		
								proxy: {
									type: 'ajax',
									url: 'php/Geo_statByregion.php',
									reader: {
										type: 'json',
										root: 'topics'
									}
								}
							});								
							cmbCondValue = Ext.create('Ext.form.field.ComboBox', {
									id:'cmbCondValueID'+count, 
									width:cmbCondValuewidth,
									store:condValStore,
									valueField: 'id',                     
									displayField: 'name',
									// triggerAction: 'all',
									queryMode: 'local',
									typeAhead: true,
									disabled: true

							})		
							
							Ext.getCmp('buttongroupCondID').add(btonDeletCond)
							Ext.getCmp('buttongroupCondID').add(cmbQuery);
							Ext.getCmp('buttongroupCondID').add(cmbCond);
							Ext.getCmp('buttongroupCondID').add(cmbCondValue);
					}					
				},
				{
					xtype:'button',
					text:'Run',
					icon: icons+'find.png',
					width:50,
					handler: function(){
						if(Ext.getCmp('popupID')){
							Ext.getCmp('popupID').close()
						}		
						if(Ext.getCmp('gridRegionID')){
							Ext.getCmp('mainTableID').collapse();
							Ext.getCmp('gridRegionID').destroy();	
						}						
						// loading status
						// var myMask = new Ext.LoadMask(Ext.getCmp('mapPanelID'), {msg:"Please wait..."});
												
						// layerTemp=mapPanel.map.getLayersByName("FindStation")[0]
						// if(layerTemp){layerTemp.destroyFeatures()}
						
						if(Ext.getCmp("cmbQueryID").getValue() && Ext.getCmp("cmbCondID").getValue() && Ext.getCmp("cmbCondValueID").getValue() && Ext.getCmp("cmbCondTypeID").getValue()){
							// myMask.show();
							// console.log(Ext.getCmp('buttongroupCondID').items.items)
							function getAllChildren (panel) {
							  var children = panel.items ? panel.items.items : [];
							  Ext.each(children, function (child) {
								children = children.concat(getAllChildren(child));
							  })
							  return children;
							}		
							function getAllChildenIds(panel) {
								var children = getAllChildren(panel);
								listItems=[]
								for (var i=0, l=children.length; i < l; i++) {
									if(children[i].getXType()!='button' && (children[i].getId()).substring(0, 9)!='cmbCondID'){
										// children[i] = Ext.getCmp(children[i].getId()).getValue()
										listItems.push(Ext.getCmp(children[i].getId()).getValue());
										// console.log((children[i].getId()).substring(0, 9))
									}
									if((children[i].getId()).substring(0, 9)=='cmbCondID'){
										listItems.push(Ext.getCmp(children[i].getId()).getRawValue());
									}
								}
								return listItems;
							}						
							// console.log(condlistsel)
							var children = getAllChildenIds(Ext.getCmp('buttongroupCondID'));
							cond= Ext.getCmp("cmbCondTypeID").getRawValue()
							
							var myMask = new Ext.LoadMask(Ext.getCmp('mapPanelID'), {msg:"Please wait..."});
							var myAjax = new Ext.data.Connection({
								handler: function(){if(layerTemp){layerTemp.destroyFeatures();mapPanel.map.removeLayer(layerTemp);}},
								listeners : {        
									beforerequest : function () {myMask.show();},
									requestcomplete : function () {myMask.hide();}
								}
							});							
							myAjax.request({ // PINTA EN EL MAPA LAS ESTACIONES INTERCEPTADAS
								url : 'php/Geo_statByregion.php' , 
								params : { type:19,condit : cond, children:Ext.encode(children)},
								method: 'GET',
								success: function ( result, request ) {
									layerTemp=mapPanel.map.getLayersByName("FindStation")[0]
									if(layerTemp){layerTemp.destroyFeatures();}
								
									geocapa = result.responseText;
									var format = new OpenLayers.Format.GeoJSON({'internalProjection': new OpenLayers.Projection("EPSG:900913"), 'externalProjection': new OpenLayers.Projection("EPSG:4326")
									});
									if(format.read(geocapa)[0]){
										mapPanel.map.addLayer(layerTempStat);
										layerTemp=mapPanel.map.getLayersByName("FindStation")[0]
										layerTemp.addFeatures(format.read(geocapa));
									
										selectID=[]
										feature = layerTemp.features;
										for (var i = feature.length - 1; i >= 0; --i) {
													sel=feature[i].attributes.id;
													selectID.push(sel)
										}

										// ##############################################################    TABLA GRID ##################################
								
										var gridStatStore = Ext.create('Ext.data.Store', {
											model: 'modelGridRegion',
											autoLoad: true,
											autoSync: true,
											sorters: { property: 'name', direction : 'ASC' },
											proxy: {
												type: 'ajax',
												url: 'php/Geo_statByregion.php',
												extraParams: {type:14,listStatSel:Ext.encode(selectID)},			
												reader: {
													type: 'json',
													root: 'topics'
												}
											}
										});								

										var varstore = Ext.create('Ext.data.Store', {
											model: 'modelvarList',
											autoLoad: true,
											autoSync: true,
											sorters: { property: 'name', direction : 'ASC' },

											proxy: {
												type: 'ajax',
												url: 'php/Geo_statByregion.php',
												extraParams: {type:15,listStatSel:Ext.encode(selectID)},			
												reader: {
													type: 'json',
													root: 'topics'
												}
											},
											listeners: {
												 load: function(store, records) {
													  store.insert(0, [{
														  id: 0,
														  name: 'ALL',
														  acronym: 'ALL'
														  
													  }]);
												 }
											  }								
										});	
										
										var selModel = Ext.create('Ext.selection.CheckboxModel', {
											listeners: {
												selectionchange: function(sm, selections) {
													gridRegion.down('#removeButton').setDisabled(selections.length === 0);
													gridRegion.down('#idstatistic').setDisabled(selections.length === 0);
													// gridRegion.down('#zoomExtent').setDisabled(selections.length === 0 || selections.length > 1);
												}
											}
										});	
										
										btn_download = function () {
											var selection = gridRegion.getView().getSelectionModel().getSelection();//[0];
											selgrid=new Array()
											for(var i = 0; i < selection.length; i++) {
												selgrid.push(Number(selection[i].data.id));
											}
											Ext.DomHelper.append(document.body, {
											  tag: 'iframe',
											  id:'downloadIframe',
											  frameBorder: 0,
											  width: 0,
											  height: 0,
											  css: 'display:none;visibility:hidden;height: 0px;',
											  src: 'php/dowloaddata.php?typedwn=selection&station='+Ext.encode(selgrid)+'&'+'country=null'+'&'+'state=null'+'&'+'municip=null'+'&'+'variable='+Ext.encode(cmbVar.getValue())+'&typedwn=selection'
											});
										}	
										onZoomExtentALL = function () {
											// layerTemp=mapPanel.map.getLayersByName("FindStation")[0]

											FeatselectID=[]
											for (var i = feature.length - 1; i >= 0; --i) {
												if(feature[i].renderIntent=='select'){
													// console.log(clusters.selectedFeatures.indexOf(feature[i]))
													// for (var j = feature[i].cluster.length - 1; j >= 0; --j) {
														sel=feature[i]//.cluster[j]
														FeatselectID.push(sel)
													// }
												}
											}
											console.log(FeatselectID)
											// var BoundALL = FeatselectID.getDataExtent();
											var BoundALL = FeatselectID.getExtent();
											// var BoundALL = FeatselectID.getSource().getExtent();;
											mapPanel.map.zoomToExtent(BoundALL);								
											
										}

										cmbVar= Ext.create('Ext.form.field.ComboBox', { 
											editable: false, 
											value: 'ALL',
											multiSelect: true, 
											displayField: 'acronym',
											valueField: 'id', 
											id:'varCmbID',
											queryMode: 'local',
											typeAhead: true,	
											store: varstore,
											listConfig: {
												getInnerTpl: function() {
													return '<div data-qtip="{name}">{acronym}</div>';
												}
											}
										
										});		
										
										gridRegion = Ext.create('Ext.grid.Panel', {
											id: 'gridRegionID',
											border: true,
											// layout: 'fit',
											forceFit: true,
											store: gridStatStore,
											maxHeight: Ext.getBody().getViewSize().height*0.3,
											width: mainPanelWidth,
											// height:273,
											// maxHeight: mainPanelHeight*0.4,
											selType: 'checkboxmodel',
											autoHeight: true,
											columns: [
												{
													xtype: 'actioncolumn',
													minWidth: 20,
													flex: 1,
													items: [{
														icon   : icons+'buttons/zoomin_off.gif',  // Use a URL in the icon config
														tooltip: 'zoom extent',
														handler: function(grid, rowIndex, colIndex) {
															var rec = gridStatStore.getAt(rowIndex);
															selectionID = rec.get('id');
															// zoomToStation(selectionID);
															layerTemp=mapPanel.map.getLayersByName("FindStation")[0]
															for (var i = layerTemp.features.length - 1; i >= 0; --i) {
																if(layerTemp.features[i].attributes.id==selectionID){
																	featureSel=layerTemp.features[i].geometry
																	var bounds = featureSel.getBounds();
																	if(bounds){ mapPanel.map.panTo(bounds.getCenterLonLat()); mapPanel.map.zoomToExtent(bounds);}
																	var mySelectStyle = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style["default"]);
																	OpenLayers.Util.extend(mySelectStyle, {pointRadius: 12,fillOpacity: 0.1,strokeColor: "#00FF00",});//{externalGraphic: iconZomm,graphicHeight: 32,graphicWidth: 32,fillOpacity: 0.8});	
																	var selectFeature = new OpenLayers.Control.SelectFeature(layerTemp,{selectStyle: mySelectStyle});
																	mapPanel.map.addControl(selectFeature);
																	selectFeature.activate();	
																	selectFeature.select(layerTemp.features[i]);	
																	// mapPanel.map.removeControl(selectFeature); // selectFeature.deactivate()
																}
															}														
														}
													}]
												},		
												{
													xtype: 'actioncolumn',
													minWidth: 20,
													flex: 1,
													items: [{
														icon   : icons+'buttons/pie-chart-graph-icon.png',  // Use a URL in the icon config
														tooltip: 'Graphic',
														handler: function(grid, rowIndex, colIndex) {
															var rec = gridStatStore.getAt(rowIndex);
															selectionID = rec.get('id');
															
															varlist=(cmbVar.getRawValue()).replace(/\s/g, '')
															var arrayvar =new Array() //varlist.split(',');

															for(var i = 0; i < varstore.getCount(); i++) {
																var record = varstore.getAt(i);
																id=record.get('id')
																acronym=record.get('acronym')
																arrayvar.push(acronym)
																// console.log(id,acronym)
															}
															
															var datatest = {
																name: 'xxx',
																rowTitleArr: arrayvar,
																colTitleArr: ['a', 'b', 'c']
															}
															var tpl = [
																'<div id="grap_temp_'+selectionID+'" style="width:'+grapWidth+'px;"></div>',
																'<tpl for="rowTitleArr">',
																'<div id="grap_{.}_'+selectionID+'" style="width:'+grapWidth+'px;"></div>',
																'</tpl>'
															];	

															cmbPeriod='cmbPeriod'+selectionID
															cmbPeriod=Ext.create('Ext.form.field.ComboBox', { 
																fieldLabel: 'Select graphic model',
																id:'cmbPeriodID'+selectionID,
																labelWidth:150,
																store: {
																	fields: ['value','name'], 
																	data: [ 
																		{value:1,name: 'Daily'}, 
																		{value:2,name: 'Monthly'}, 
																		{value:3,name: 'Yearly'}
																	]
																},
																displayField: 'name',
																value: 1,
																queryMode: 'local',
																valueField: 'value', 								
																typeAhead: true,
																listeners: {
																	select: function() {
																		var actTab = tabs.getActiveTab();
																		var idx = tabs.items.indexOf(actTab);
																		actTabId=parseInt((actTab.title).match(/\d+/)[0])
																		var idPeriod = Ext.getCmp('cmbPeriodID'+actTabId).getValue()
																		console.log(actTab,idx,actTabId,idPeriod)
																		generateGraps(actTabId,idPeriod,Ext.encode(cmbVar.getValue()))

																	}
																}
															});		
															if(!Ext.getCmp('graphic'+selectionID)){
																tabs.add({
																	// contentEl: "desc",
																	// xtype: 'panel',
																	title: 'Graphic_id'+selectionID,
																	name: 'graphic'+selectionID,
																	// width:mainPanelWidth-15,
																	// maxHeight: 100,
																	autoScroll: true,
																	// height: 100,
																	// autoHeight: true,
																	// layout: 'fit',
																	id: 'graphic'+selectionID,
																	 // html: new Ext.XTemplate(
																	 // tpl
																	 // '<div id="grap_tmin_'+selectionID+'" ></div>',
																	 // '<div id="grap_prec_'+selectionID+'"></div>'
																	 // ),
																	 // .apply({value: '2. HTML property of a panel generated by an XTemplate'}),
																	closable: true,
																	dockedItems: [
																		{
																		xtype: 'toolbar',
																		items: [cmbPeriod]
																		}
																	]													
																});		
															}
															var t = new Ext.XTemplate(tpl);
															Ext.getCmp('graphic'+selectionID).update(t.apply(datatest));
															// Ext.getCmp('graphic'+selectionID).update('This<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long');
															
															Ext.getCmp('mapPanelID').setHeight(0)
															Ext.getCmp('tabsID').setWidth(mainPanelWidth-15);
															// Ext.getCmp('tabsID').setHeight(mainPanelHeight*0.2);
															tabs.setActiveTab('graphic'+selectionID);
															
															generateGraps(selectionID,cmbPeriod.getValue(),Ext.encode(cmbVar.getValue()))
														} // handler
													}]
												},								
												// {
													// text : '&#8470;',
													// dataIndex: 'rowIndex',
													// flex: 1,
													// minWidth: 20,
													// renderer : function(value, metaData, record, rowIndex)
													// {return rowIndex+1;}
												// },			
												{ text: 'id',minWidth: 50,dataIndex: 'id', flex: 1},
												{ text: 'code',minWidth: 80,dataIndex: 'code', flex: 1},
												{ text: 'name',minWidth: 120,dataIndex: 'name', flex: 4},
												{ text: 'institute',minWidth: 50,dataIndex: 'institute', flex: 3},
												{ text: 'model',minWidth: 80,dataIndex: 'model', flex: 2},
												
												// { text: 'category',minWidth: 100,dataIndex: 'category', flex: 4},

												// { text: 'instalation',minWidth: 80,dataIndex: 'instalation', flex: 3},
												// { text: 'quality',minWidth: 80,dataIndex: 'quality', flex: 1},
												
												{ text: 'variables',minWidth: 100,dataIndex: 'variables', flex: 4},
												// { text: 'lon',minWidth: 80,dataIndex: 'lon', flex: 3},
												// { text: 'lat',minWidth: 80,dataIndex: 'lat', flex: 3},
												// { text: 'elev',minWidth: 80,dataIndex: 'elev', flex: 2},
												// { text: 'country',minWidth: 80,dataIndex: 'country', flex: 4},
												// { text: 'state',minWidth: 80,dataIndex: 'state', flex: 4},
												// { text: 'city',minWidth: 90,dataIndex: 'city', flex: 4}
												
											],
											columnLines: true,
											plugins: [{
												ptype: 'rowexpander',
												pluginId: 'rowexpanderID',
												selectRowOnExpand: true,			
												rowBodyTpl : new Ext.XTemplate(
													'<p><b>category:</b> {category} | <b>instalation:</b> {instalation} ', //&#x2016; doble linea vertical
													'| <b>quality:</b> {quality} ',
													'| <b>lon:</b> {lon} ',
													'| <b>lat:</b> {lat} ',
													'| <b>elev:</b> {elev} </p>',
													'<p><b>country:</b> {country} ',
													'| <b>state:</b> {state} ',
													'| <b>city:</b> {city}</p> ',
													'<div id="myrow-{id}" ></div>'
												),		
												expandOnRender: true,
												expandOnDblClick: false		
									
											}],							

											stripeRows: true,
											// margin: '0 0 20 0',
											selModel: selModel,
											// viewConfig: { 
												// stripeRows: false, 
												// getRowClass: function(record) { 
													// if(winRegion.width==winRegion.maxWidth){
														// return 'regiongrid-max';
													// }else{return 'regiongrid-min';}
												// }	
											// },
											// inline buttons
											dockedItems: [
												{
												xtype: 'toolbar',
												items: [{
													itemId: 'removeButton',
													text:'Download',
													tooltip:'Download data',
													icon   : iconGridDownload,
													disabled: true,
													handler: btn_download 
												},cmbVar/*{
													itemId: 'zoomExtentALL',
													text:'zoomExtentALL',
													tooltip:'zoomExtent to ALL',
													icon   : iconGridzoomExtentALL,//iconCls:'add',
													handler: onZoomExtentALL 
												}*/,{
													itemId: 'idExpand',
													text:'Expand all',
													tooltip:'Expand all',
													iconCls:iconGridExpand,
													handler: expand 
												},{
												
													itemId: 'idstatistic',
													text:'Statistics',
													tooltip:'Summary Statistic',
													icon   : iconGridStatistics,
													disabled: true,
													handler: statistics 
												},{ xtype: 'tbtext', itemId: 'numRecords' },{xtype: 'tbfill'},
												{ 
													itemId: 'idMaximo',
													// text:'Maximize',
													tooltip:'Maximize/Minimize table',
													icon   : iconGridMaximize,
													// stretch: false,
													align: 'right',
													handler: Maximize,
												}]
											}]		
										});

										// para el mostrar el grid de variables cuando se da en el boton expandir
										Ext.getCmp('gridRegionID').getView().on('expandbody', function(rowNode, record, expandbody,eNode){

											var dynamicStore  //the new store for the nested grid.
											var row = "myrow-" + record.get("id");
											var id2 = "mygrid-" + record.get("id");  
											row2 = Ext.get(rowNode);
											
											var store = Ext.create('Ext.data.Store', {
												model: 'modelGridVar',
												autoSync: true,
												storeId: 'store2',
												proxy: {
													type: 'ajax', 
													url: 'php/Geo_statByregion.php',
													extraParams: {
														idstat: record.get("id"),type:17
													},
													reader: {
														type: 'json',
														root: 'topics'
													}
												},
												autoLoad: true// {callback: initData}
											});
												  
											var grid = Ext.create('Ext.grid.Panel', {
												// hideHeaders: true,
												border: false,
												height:100,
												layout: 'fit',
												// width:500,
												autoWidth:true,
												id: id2,
												columns: [{
														xtype: 'actioncolumn',
														// flex: 0,
														width: 150,
														autoSizeColumn: true,
														items: [{
															icon   : icons+'buttons/download_off.gif',  // Use a URL in the icon config
															tooltip: 'zoom extent2',
															handler: function(grid, rowIndex, colIndex) {
																var rec = store.getAt(rowIndex);
																idstat=rec.get('idstat')
																idvar=rec.get('idvar')
																Ext.DomHelper.append(document.body, {
																  tag: 'iframe',
																  id:'downloadIframe',
																  frameBorder: 0,
																  width: 0,
																  height: 0,
																  css: 'display:none;visibility:hidden;height: 0px;',
																  src: 'php/dowloaddata.php?typedwn=selection&station='+Ext.encode([idstat])+'&'+'variable='+Ext.encode([idvar])
																});
															
															}
														}]
													},{ text: 'name',dataIndex: 'name'},
													{ text: 'acronym',dataIndex: 'acronym'},
													{ text: 'date_start',dataIndex: 'date_start'},
													{ text: 'date_end',dataIndex: 'date_end'},
													{ text: 'age',dataIndex: 'age',autoSizeColumn: true}],
												store: store,
												viewConfig: {
													listeners: {
														refresh: function(dataview) {
															Ext.each(dataview.panel.columns, function(column) {
																if (column.autoSizeColumn === true)
																	column.autoSize();
															})
														}
													}
												}	
											});
											
										   grid.render(row)
											grid.getEl().swallowEvent([ 'mouseover', 'mousedown', 'click', 'dblclick' ]);
											// grid.on('itemclick', function(view) {
												// Ext.getCmp('gridRegionID').getView().getSelectionModel().deselectAll();
											// });
											
												
										});	
										gridRegion.getView().on('collapsebody', function(rowNode, record, eNode) {
											var row = "myrow-" + record.get("id");
											var id2 = "mygrid-" + record.get("id");  
											// Ext.getCmp(id2).getStore().removeAll();
											$('#'+row).empty();
											// Ext.get(rowNode).down('#'+row).down('div').destroy();
										});

										gridStatStore.on('load', function(ds){
											countRow=ds.getTotalCount()
											if(countRow>=1){
												// winRegion.show()
												// Ext.getCmp('gridRegionID').add(gridRegion);
												// Ext.getCmp('gridRegionID').doLayout();
												Ext.getCmp('mainTableID').add(gridRegion);
												gridRegion.down('#numRecords').setText('Records: ' + countRow);
												Ext.getCmp('mainTableID').expand()
												
												var bounds = layerTemp.getDataExtent();
												if(bounds){mapPanel.map.zoomToExtent(bounds);}
												
												// Ext.DomHelper.append(document.body, {
												  // tag: 'iframe',
												  // id:'downloadIframe',
												  // frameBorder: 0,
												  // width: 0,
												  // height: 0,
												  // css: 'display:none;visibility:hidden;height: 0px;',
												  // src: 'php/dowloaddata.php?typedwn=selection&station='+encodeURIComponent(JSON.stringify(selectID))+'&'+'country=null'+'&'+'state=null'+'&'+'municip=null'+'&'+'variable='+Ext.encode(cmbVar.getValue())
												// });		
												myMask.hide();
												
											}else{
												Ext.getCmp('mainTableID').collapse()
												Ext.getCmp('gridRegionID').destroy();
												myMask.hide();
												winInfo=Ext.MessageBox.show({
												   title: 'Information',
												   msg: 'Not stations found!',
												   buttons: Ext.MessageBox.OK,
												   animateTarget: 'info',
												   icon: 'x-message-box-info',
													listners : {
														  click :  {
														   element: 'OK',
														   fn: function(btn){ 

														   }
														  }
													}										   
												});	
												winInfo.setPosition(mainPanelWidth/3,mainPanelHeight/2);
												
											}	
										});	
									
										// ################################################################################################################
									}else{
										myMask.hide();
										Ext.getCmp('mainTableID').collapse()
										winInfo=Ext.MessageBox.show({
										   title: 'Information',
										   msg: 'Not stations found!',
										   buttons: Ext.MessageBox.OK,
										   animateTarget: 'info',
										   icon: 'x-message-box-info'
										});	
										winInfo.setPosition(mainPanelWidth/3,mainPanelHeight/2);
									}
										
								},
								failure: function ( result, request) { 
									Ext.MessageBox.alert('Failed', result.responseText);
								}
						

							});	
							
				
						}else{
							// myMask.hide(); 
							winInfo=Ext.MessageBox.show({
							   title: 'Information',
							   msg: 'There are empty fields!',
							   buttons: Ext.MessageBox.OK,
							   animateTarget: 'info',
							   icon: 'x-message-box-info'
							});	
							winInfo.setPosition(mainPanelWidth/3,mainPanelHeight/2);						
						}

					}	// fin handler				
				},
				{
					xtype:'button',
					text:'Cancel',
					icon: icons+'decline.png',
					handler: function(){
						if(Ext.getCmp('popupID')){
							Ext.getCmp('popupID').close()
						}					
						if(Ext.getCmp('gridRegionID')){
							Ext.getCmp('mainTableID').collapse();
							Ext.getCmp('gridRegionID').destroy();	
						}
						
						if(Ext.getCmp("cmbQueryID")){
							Ext.getCmp("cmbQueryID").reset();
							Ext.getCmp("cmbCondID").reset();
							Ext.getCmp("cmbCondValueID").reset();
							Ext.getCmp("cmbCondTypeID").reset();
						}
						for (var i=0, l=condlistsel.length; i < l; i++) {
							Ext.getCmp('buttongroupCondID').remove(Ext.getCmp('btnDeleteCondID'+condlistsel[i]),true);
							Ext.getCmp('buttongroupCondID').remove(Ext.getCmp('cmbQueryID'+condlistsel[i]));
							Ext.getCmp('buttongroupCondID').remove(Ext.getCmp('cmbCondID'+condlistsel[i]));
							Ext.getCmp('buttongroupCondID').remove(Ext.getCmp('cmbCondValueID'+condlistsel[i]));							
						}
						for (var i=0, l=condlistsel.length; i < l; i++) {
								delete condlistsel[i];
						}		
						layerTempReg=mapPanel.map.getLayersByName("FindRegion")[0]
						if(layerTempReg){mapPanel.map.removeLayer(layerTempReg);}
						
						layerTempStat=mapPanel.map.getLayersByName("FindStation")[0]
						if(layerTempStat){mapPanel.map.removeLayer(layerTempStat);}	
					}
				}				
			]
		}]		
		
	}

    var groupLocation = {
        xtype: 'fieldset',
        title: 'Location place',
		width:fieldsetWidth,
        layout: 'anchor',
        collapsible: true,
        collapsed: false,
        items: [
		// {
			// xtype: "gx_geocodercombo",
			// layer: locationLayer,
			// width: 200,
		// }
		]
	}	
	
    var tabSearchLocation = Ext.create('Ext.FormPanel', {
		// cls: 'css_labels',
        // width: 250,
		width:fieldsetWidth+10,//tabsWidth,
        bodyPadding: 5,
        items: [
            groupLocation
            // radioGroup
        ],
   });	
	
    var tabSearchRegion = Ext.create('Ext.FormPanel', {
		// cls: 'css_labels',
        // width: 250,
		width:fieldsetWidth+10,//tabsWidth,
        bodyPadding: 5,
        items: [
            groupByRegion
            // radioGroup
        ]		
   });

    var tabSearchStat = Ext.create('Ext.FormPanel', {
		// cls: 'css_labels',
		width:fieldsetWidth+10,//tabsWidth,
        bodyPadding: 5,
		// bodyStyle: "font-family: Oswald;",		
        items: [
            groupByStation
        ]	
    });
    var tabSearchQuery = Ext.create('Ext.FormPanel', {
		width:fieldsetWidth+10,//tabsWidth,
        bodyPadding: 5,
        items: [
            groupByQuery
        ]	
    });	
// ############################################################################
	slider=Ext.create('Ext.slider.Single', {
		hideLabel: true,
		// cls:"custom-slider",
		width: 214,
		increment: 5,
		value: 20,
		minValue: 0,
		maxValue: 100,
		listeners: {                    
			change: function (slider, newValue, thumb, eOpts ) {
				strategy.distance=slider.getValue();
				mapPanel.map.removeLayer(clusters);
				mapPanel.map.addLayer(clusters);					
			}
		}			
	});
    var groupSlider = {
        xtype: 'fieldset',
        title: 'Change cluster   '+ '<img id="help_toolip" class="tooltipIcon" src='+icons+infoB+' data-qtip="'+toolip_groupSlider+'" />',//<span data-qtip="hello">First Name</span>  
		width:fieldsetWidthLayer,
        layout: 'anchor',
        defaults: {
            anchor: '100%',
			margin: "10 5 5 5"
        },
        collapsible: true,
        collapsed: false,
        items: [/*{
			xtype: 'label',
			forId: 'myFieldId',
			text: 'Change size cluster of stations',
			margin: "0 0 0 10",
		},*/slider]
	}
    var groupLegendIMG = {
        xtype: 'fieldset',
        title: 'Legend   '+ '<img id="help_toolip" class="tooltipIcon" src='+icons+infoB+' data-qtip="'+toolip_groupLegendIMG+'" />',//<span data-qtip="hello">First Name</span>  
		width:fieldsetWidthLayer,
        layout: 'anchor',
		bodyPadding: 5,
        defaults: {
            anchor: '100%',
			margin: "10 5 5 5"
        },
        collapsible: true,
        collapsed: false,
        items: [
		// {
			// xtype: 'label',
			// forId: 'myFieldId',
			// text: 'Institutes',
			// margin: "0 0 0 10",		
		// },
		{ 
			xtype: "panel",
			html: '<img src='+icons+'cluster.PNG height="25" width="25" style="vertical-align: middle;"/><span class="legendFond" style="vertical-align: middle;"> Cluster</span>'+
				  '<div class="legendFond" id="ideam">IDEAM</div>'+
				  '<div class="legendFond" id="cafenica">CAFENICA</div>'+
				  '<div class="legendFond" id="cruz-roja">Cruz-Roja</div>'+
				  '<div class="legendFond" id="afr-rising">Afr-Rising</div>'
		}]
	}	
	
	var storeAddLabes = Ext.create('Ext.data.Store', { 
		fields: ['id','name'], 
		data: [ 
			{"id":"1","name": 'None'}, 
			{"id":"2","name": 'name'},
			{"id":"3","name": 'code'},
			{"id":"4","name": 'id'},
			{"id":"5","name": 'elev'},
			{"id":"6","name": 'status'}

		] 
	});	

	cmbAddLabels= Ext.create('Ext.form.field.ComboBox', { 
		// editable: false, 
		id:'cmbAddLabelsID',
		width:20,
		store:storeAddLabes,
		valueField: 'id',
		value:'4',		
		displayField: 'name',
		fieldLabel:'Labels stations',
		// labelWidth:40,
		triggerAction: 'all',
		typeAhead: true,
		listeners: {
			select:{fn:function(combo, value) {
				var getStore = combo.getValue();
                    // layer = mapPanel.map.layers[2];
                    // mapPanel.map.removeLayer(layer);
					if(getStore=="1"){
						context["label"]=onLabel
						clusters.features[0].layer.styleMap.styles.default.rules[0].symbolizer.label='';
					}
					if(getStore=="2"){
						context["label"]=onLabel
						clusters.features[0].layer.styleMap.styles.default.rules[0].symbolizer.label='${label}';
					}
					if(getStore=="3"){
						context["label"]=onLabel2
						clusters.features[0].layer.styleMap.styles.default.rules[0].symbolizer.label='${label}';
					}
					if(getStore=="4"){
						context["label"]=onLabel3
						clusters.features[0].layer.styleMap.styles.default.rules[0].symbolizer.label='${label}';
					}
					if(getStore=="5"){
						context["label"]=onLabel4
						clusters.features[0].layer.styleMap.styles.default.rules[0].symbolizer.label='${label}';
					}
					if(getStore=="6"){
						context["label"]=onLabel5
						clusters.features[0].layer.styleMap.styles.default.rules[0].symbolizer.label='${label}';
					}
					clusters.redraw(); 			
		}}}})
	
    var groupLabels = {
        xtype: 'fieldset',
        title: 'Labels   '+ '<img id="help_toolip" class="tooltipIcon" src='+icons+infoB+' data-qtip="'+toolip_groupLabels+'" />',//<span data-qtip="hello">First Name</span>  
		width:fieldsetWidthLayer,
        layout: 'anchor',
        defaults: {
            anchor: '100%',
			margin: "5 5 5 5"
        },
        collapsible: true,
        collapsed: false,
        items: [cmbAddLabels]
	}
    var groupLayers = {
        xtype: 'fieldset',
        title: 'Layers   '+ '<img id="help_toolip" class="tooltipIcon" src='+icons+infoB+' data-qtip="'+toolip_groupLayers+'" />',//<span data-qtip="hello">First Name</span>  
		width:fieldsetWidthLayer,
        layout: 'anchor',
        defaults: {
            anchor: '100%',
			margin: "5 5 5 5"
        },
        collapsible: true,
        collapsed: false,
        items: [tabTree]
	}

	
    var tabLayerLabels = Ext.create('Ext.FormPanel', {
		width:fieldsetWidthLayer+10,//tabsWidth,
        bodyPadding: 'padding: 0px 5px 5px 5px;',
        items: [groupLabels],
   });
	
    var tabLayerTree = Ext.create('Ext.FormPanel', {
		width:fieldsetWidthLayer+10,//tabsWidth,
        bodyPadding: 5,
        items: [groupLayers],
   });
    var tabLayerSlider = Ext.create('Ext.FormPanel', {
		width:fieldsetWidthLayer+10,//tabsWidth,
        bodyPadding: 'padding: 0px 5px 5px 5px;',
        items: [groupSlider],
   });   
    var tabLayerLegendIMG = Ext.create('Ext.FormPanel', {
		width:fieldsetWidthLayer+10,//tabsWidth,
        bodyPadding: 'padding: 0px 5px 5px 5px;',
        items: [groupLegendIMG],
   });	
		// console.log(mapPanel.layers)
        var layerRec0 = mapPanel.layers.getAt(1);
        layerRec0.set("legendURL", "http://ows.terrestris.de/osm/service?FORMAT=image%2Fgif&TRANSPARENT=true&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic&EXCEPTIONS=application%2Fvnd.ogc.se_xml&LAYER=OSM-WMS");
		
		layerRec0.set("hideInLegend", !layerRec0.get("hideInLegend"));

		// console.log(Ext.getCmp('mapPanelID').layers)
        legendPanel = Ext.create('GeoExt.panel.Legend', {
		// var legendPanel = new GeoExt.LegendPanel({
            defaults: {
                labelCls: 'mylabel',
                style: 'padding:5px'
            },
            bodyStyle: 'padding:5px',
            width: 350,
            autoScroll: true,
            // region: 'west'
        });
		
		var tabs = Ext.widget('tabpanel', {
			/*id: 'tabsID',
			border: false,
			split: true,
			collapsible: true,
			// scrollable: true,
			//collapseMode: "mini",
			// title: "INFORMATION",
			// collapseDirection: 'left',
			autoScroll: true,
			region: "west",
			//width: 270,
			// maxHeight: 300,
			// autoHeight: true,
			height: 100,//mainPanelHeight,//'60%',
			// Width:'50%',
			minWidth:tabsWidth,
			// maxWidth:300,
			activeTab: 0,
			plugins: [{
				ptype: 'tabscrollermenu',
				maxText  : 15,
				pageSize : 3
			},Ext.create('Ext.ux.TabReorderer')],			
			defaults :{
				// bodyPadding: 1
			},*/
			id: 'tabsID',
			region: "west",
			collapsible: true,
			collapseMode: "mini",
			scrollable: true,
			defaults:{ autoScroll:true }, 
			width:tabsWidth+5,	
			// minWidth:fieldsetWidth,
			plugins: [{
				ptype: 'tabscrollermenu',
				maxText  : 15,
				pageSize : 3
			},Ext.create('Ext.ux.TabReorderer')],			
			items: [{
				// contentEl:'markup', 
				title: 'Searchs',
				items:[tabSearchRegion,tabSearchStat,tabSearchQuery]
			},{
				// contentEl:'script', 
				title: 'Layers',
				items:[tabLayerTree,tabLayerLabels,tabLayerSlider,tabLayerLegendIMG]
			}],//,{title: 'Graphics',autoScroll: true,id:'1000'}]
			listeners: {
				'tabchange': function (tabPanel, tab) {
					var idx = tabs.items.indexOf(tab);
					if(idx==0 || idx==1){
						Ext.getCmp('tabsID').setWidth(tabsWidth+5);
						mapPanel.map.updateSize();
						// mapPanel.map.onMapResize();
						// mapPanel.map.refresh();						
						Ext.getCmp('mapPanelID').doLayout();
						Ext.getCmp('mainpanelID').doLayout();
						layer = mapPanel.map.layers[2];
						layer.redraw();
					}
					else{Ext.getCmp('tabsID').setWidth(mainPanelWidth-15);}
									
				}
			}			
		});
		

		
	// ########################### mapPanel ###################
		
	
	// ##############	CONTROLES ################################

// var mySelectStyle = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style["default"]);
// OpenLayers.Util.extend(mySelectStyle, {externalGraphic: iconZomm,graphicHeight: 32,graphicWidth: 32,fillOpacity: 0.8});	

// var selectFeature = new OpenLayers.Control.SelectFeature(layerTemp,{selectStyle: mySelectStyle});
// mapPanel.map.addControl(selectFeature);
// selectFeature.activate();	
// selectFeature.select(layerTemp.features[i]);	

		mapPanel.map.addControl(new OpenLayers.Control.Navigation());
		mapPanel.map.addControl(new OpenLayers.Control.PanZoomBar());
		mapPanel.map.addControl(new OpenLayers.Control.Graticule(
			{layerName: "Grid", visible: false, 
				numPoints: 2, 
				labelled: true
			}
		));
		mapPanel.map.addControl(new OpenLayers.Control.MousePosition());
		
// ############################################## POPUP IDENTIFY ##############################################################################################################			

		
		mapPanel.map.addLayer(locationLayer);
		mapPanel.map.addLayer(vectorHover);
		
		zoomToStation =function(ids){
			Ext.Ajax.request({ // PINTA ESTACION 
				url : 'php/Geo_statByregion.php' , 
				params : {type:21,listStatSel: Ext.encode(ids)},
				method: 'GET',
				success: function ( result, request ) {
					layerTemp=mapPanel.map.getLayersByName("FindRegion")[0]
					if(layerTemp){layerTemp.destroyFeatures();}
					geocapa = result.responseText;
					var format = new OpenLayers.Format.GeoJSON({'internalProjection': new OpenLayers.Projection("EPSG:900913"), 'externalProjection': new OpenLayers.Projection("EPSG:4326")
					});
					mapPanel.map.addLayer(layerTempRegion);
					layerTemp=mapPanel.map.getLayersByName("FindRegion")[0]
					layerTemp.addFeatures(format.read(geocapa));
					var bounds = layerTemp.getDataExtent();
					if(bounds){mapPanel.map.zoomToExtent(bounds);}
					if(layerTemp.features.length==1){
						mapPanel.map.setCenter(new OpenLayers.LonLat(layerTemp.features[0].geometry.x,layerTemp.features[0].geometry.y), 15);
					}
					
				},
				failure: function ( result, request) { 
					Ext.MessageBox.alert('Failed', result.responseText);
				}
			});
		}

		
		function createPopup(feature,myFeatyures) {

			selIds=new Array()
			for(var i = 0; i < myFeatyures.length; i++) {
				selIds.push(Number(myFeatyures[i].attributes.id));
			}
			
			var gridStatStore = Ext.create('Ext.data.Store', {
				model: 'modelGridRegion',
				autoLoad: true,
				autoSync: false,
				// sorters: { property: 'name', direction : 'ASC' },
				proxy: {
					type: 'ajax',
					url: 'php/Geo_statByregion.php',
					extraParams: {type:14,listStatSel:Ext.encode(selIds)},			
					reader: {
						type: 'json',
						root: 'topics'
					}
				}
			});
			gridRegionHover = Ext.create('Ext.grid.Panel', {
				id: 'gridRegionIDHover',
				border: true,
				// layout: 'fit',
				forceFit: true,
				store: gridStatStore,
				maxHeight: 150,
				// width: 200,
				cls: 'custom-gridPanelHover',
				// height:273,
				// maxHeight: mainPanelHeight*0.4,
				autoHeight: true,
				columns: [
					{ text: 'code',minWidth: 50,dataIndex: 'code', flex: 1},
					{ text: 'name',minWidth: 100,dataIndex: 'name', flex: 4},
					// { text: 'institute',minWidth: 70,dataIndex: 'institute', flex: 3},
					{ text: 'model',minWidth: 80,dataIndex: 'model', flex: 2},
					{ text: 'variables',minWidth: 120,dataIndex: 'variables', flex: 4}
				],
				columnLines: true,
				stripeRows: true,
				// viewConfig: {
					// loadMask: false
				// },	
				dockedItems: [
					{
					xtype: 'toolbar',
					items: [{
						itemId: 'removeButtonHover',
						text:'Download data',
						icon   : iconGridDownload,
						scale: 'small',
						handler: function(){
							// selectControl.control.deactivate();
							if(Ext.getCmp('gridRegionID')){
								Ext.getCmp('mainTableID').collapse();
								Ext.getCmp('gridRegionID').destroy();	
							}				
							if(Ext.getCmp('popupID')){
								Ext.getCmp('popupID').close()
							}	
							
							layerTemp=mapPanel.map.getLayersByName("FindRegion")[0]
							if(layerTemp){layerTemp.destroyFeatures();mapPanel.map.removeLayer(layerTemp);}
							
							FindStation=mapPanel.map.getLayersByName("FindStation")[0]
							if(FindStation){FindStation.destroyFeatures();}
									
							// loading status
							var myMask = new Ext.LoadMask(Ext.getCmp('mapPanelID'), {msg:"Please wait..."});
							myMask.show();
							
							selectID=selIds
					
							// ##############################################################    TABLA GRID ##################################
							
										var gridStatStore = Ext.create('Ext.data.Store', {
											model: 'modelGridRegion',
											autoLoad: true,
											autoSync: true,
											sorters: { property: 'name', direction : 'ASC' },
											proxy: {
												type: 'ajax',
												url: 'php/Geo_statByregion.php',
												extraParams: {type:14,listStatSel:Ext.encode(selectID)},			
												reader: {
													type: 'json',
													root: 'topics'
												}
											}
										});								

										var varstore = Ext.create('Ext.data.Store', {
											model: 'modelvarList',
											autoLoad: true,
											autoSync: true,
											sorters: { property: 'name', direction : 'ASC' },

											proxy: {
												type: 'ajax',
												url: 'php/Geo_statByregion.php',
												extraParams: {type:15,listStatSel:Ext.encode(selectID)},			
												reader: {
													type: 'json',
													root: 'topics'
												}
											},
											listeners: {
												 load: function(store, records) {
													  store.insert(0, [{
														  id: 0,
														  name: 'ALL',
														  acronym: 'ALL'
														  
													  }]);
												 }
											  }								
										});	
										
										var selModel = Ext.create('Ext.selection.CheckboxModel', {
											listeners: {
												selectionchange: function(sm, selections) {
													gridRegion.down('#removeButton').setDisabled(selections.length === 0);
													gridRegion.down('#idstatistic').setDisabled(selections.length === 0);
													// gridRegion.down('#zoomExtent').setDisabled(selections.length === 0 || selections.length > 1);
												}
											}
										});	
										
										btn_download = function () {
											var selection = gridRegion.getView().getSelectionModel().getSelection();//[0];
											selgrid=new Array()
											for(var i = 0; i < selection.length; i++) {
												selgrid.push(Number(selection[i].data.id));
											}
											Ext.DomHelper.append(document.body, {
											  tag: 'iframe',
											  id:'downloadIframe',
											  frameBorder: 0,
											  width: 0,
											  height: 0,
											  css: 'display:none;visibility:hidden;height: 0px;',
											  src: 'php/dowloaddata.php?typedwn=selection&station='+Ext.encode(selgrid)+'&'+'country=null'+'&'+'state=null'+'&'+'municip=null'+'&'+'variable='+Ext.encode(cmbVar.getValue())+'&typedwn=selection'
											});
										}	
										onZoomExtentALL = function () {
											// layerTemp=mapPanel.map.getLayersByName("FindStation")[0]

											FeatselectID=[]
											for (var i = feature.length - 1; i >= 0; --i) {
												if(feature[i].renderIntent=='select'){
														sel=feature[i]//.cluster[j]
														FeatselectID.push(sel)
												}
											}
											console.log(FeatselectID)
											console.log(FeatselectID[0].geometry.getBounds())
											var BoundALL = FeatselectID[0].geometry.getBounds();
											// mapPanel.map.zoomToExtent(BoundALL);								
											
										}

										cmbVar= Ext.create('Ext.form.field.ComboBox', { 
											editable: false, 
											value: 'ALL',
											multiSelect: true, 
											displayField: 'acronym',
											valueField: 'id', 
											id:'varCmbID',
											queryMode: 'local',
											typeAhead: true,	
											store: varstore,
											listConfig: {
												getInnerTpl: function() {
													return '<div data-qtip="{name}">{acronym}</div>';
												}
											}
										
										});		
										
										gridRegion = Ext.create('Ext.grid.Panel', {
											id: 'gridRegionID',
											border: true,
											// layout: 'fit',
											forceFit: true,
											store: gridStatStore,
											maxHeight: Ext.getBody().getViewSize().height*0.3,
											width: mainPanelWidth,
											// height:273,
											// maxHeight: mainPanelHeight*0.4,
											selType: 'checkboxmodel',
											autoHeight: true,
											columns: [
												{
													xtype: 'actioncolumn',
													minWidth: 20,
													flex: 1,
													items: [{
														icon   : icons+'buttons/zoomin_off.gif',  // Use a URL in the icon config
														tooltip: 'zoom extent',
														handler: function(grid, rowIndex, colIndex) {
															var rec = gridStatStore.getAt(rowIndex);
															selectionID = rec.get('id');
															zoomToStation(selectionID)
														}
													}]
												},		
												{
													xtype: 'actioncolumn',
													minWidth: 20,
													flex: 1,
													items: [{
														icon   : icons+'buttons/pie-chart-graph-icon.png',  // Use a URL in the icon config
														tooltip: 'Graphic',
														handler: function(grid, rowIndex, colIndex) {
															var rec = gridStatStore.getAt(rowIndex);
															selectionID = rec.get('id');
															
															varlist=(cmbVar.getRawValue()).replace(/\s/g, '')
															var arrayvar =new Array() //varlist.split(',');

															for(var i = 0; i < varstore.getCount(); i++) {
																var record = varstore.getAt(i);
																id=record.get('id')
																acronym=record.get('acronym')
																arrayvar.push(acronym)
																// console.log(id,acronym)
															}
															
															var datatest = {
																name: 'xxx',
																rowTitleArr: arrayvar,
																colTitleArr: ['a', 'b', 'c']
															}
															var tpl = [
																'<div id="grap_temp_'+selectionID+'" style="width:'+grapWidth+'px;"></div>',
																'<tpl for="rowTitleArr">',
																'<div id="grap_{.}_'+selectionID+'" style="width:'+grapWidth+'px;"></div>',
																'</tpl>'
															];	

															cmbPeriod='cmbPeriod'+selectionID
															cmbPeriod=Ext.create('Ext.form.field.ComboBox', { 
																fieldLabel: 'Select graphic model',
																id:'cmbPeriodID'+selectionID,
																labelWidth:150,
																store: {
																	fields: ['value','name'], 
																	data: [ 
																		{value:1,name: 'Daily'}, 
																		{value:2,name: 'Monthly'}, 
																		{value:3,name: 'Yearly'}
																	]
																},
																displayField: 'name',
																value: 1,
																queryMode: 'local',
																valueField: 'value', 								
																typeAhead: true,
																listeners: {
																	select: function() {
																		var actTab = tabs.getActiveTab();
																		var idx = tabs.items.indexOf(actTab);
																		actTabId=parseInt((actTab.title).match(/\d+/)[0])
																		var idPeriod = Ext.getCmp('cmbPeriodID'+actTabId).getValue()
																		console.log(actTab,idx,actTabId,idPeriod)
																		generateGraps(actTabId,idPeriod,Ext.encode(cmbVar.getValue()))

																	}
																}
															});		
															if(!Ext.getCmp('graphic'+selectionID)){
																tabs.add({
																	// contentEl: "desc",
																	// xtype: 'panel',
																	title: 'Graphic_id'+selectionID,
																	name: 'graphic'+selectionID,
																	// width:mainPanelWidth-15,
																	// maxHeight: 100,
																	autoScroll: true,
																	// height: 100,
																	// autoHeight: true,
																	// layout: 'fit',
																	id: 'graphic'+selectionID,
																	 // html: new Ext.XTemplate(
																	 // tpl
																	 // '<div id="grap_tmin_'+selectionID+'" ></div>',
																	 // '<div id="grap_prec_'+selectionID+'"></div>'
																	 // ),
																	 // .apply({value: '2. HTML property of a panel generated by an XTemplate'}),
																	closable: true,
																	dockedItems: [
																		{
																		xtype: 'toolbar',
																		items: [cmbPeriod]
																		}
																	]													
																});		
															}
															var t = new Ext.XTemplate(tpl);
															Ext.getCmp('graphic'+selectionID).update(t.apply(datatest));
															// Ext.getCmp('graphic'+selectionID).update('This<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long');
															
															Ext.getCmp('mapPanelID').setHeight(0)
															Ext.getCmp('tabsID').setWidth(mainPanelWidth-15);
															// Ext.getCmp('tabsID').setHeight(mainPanelHeight*0.2);
															tabs.setActiveTab('graphic'+selectionID);
															
															generateGraps(selectionID,cmbPeriod.getValue(),Ext.encode(cmbVar.getValue()))
														} // handler
													}]
												},								
												// {
													// text : '&#8470;',
													// dataIndex: 'rowIndex',
													// flex: 1,
													// minWidth: 20,
													// renderer : function(value, metaData, record, rowIndex)
													// {return rowIndex+1;}
												// },			
												{ text: 'id',minWidth: 50,dataIndex: 'id', flex: 1},
												{ text: 'code',minWidth: 80,dataIndex: 'code', flex: 1},
												{ text: 'name',minWidth: 120,dataIndex: 'name', flex: 4},
												{ text: 'institute',minWidth: 50,dataIndex: 'institute', flex: 3},
												{ text: 'model',minWidth: 80,dataIndex: 'model', flex: 2},
												
												// { text: 'category',minWidth: 100,dataIndex: 'category', flex: 4},

												// { text: 'instalation',minWidth: 80,dataIndex: 'instalation', flex: 3},
												// { text: 'quality',minWidth: 80,dataIndex: 'quality', flex: 1},
												
												{ text: 'variables',minWidth: 100,dataIndex: 'variables', flex: 4},
												// { text: 'lon',minWidth: 80,dataIndex: 'lon', flex: 3},
												// { text: 'lat',minWidth: 80,dataIndex: 'lat', flex: 3},
												// { text: 'elev',minWidth: 80,dataIndex: 'elev', flex: 2},
												// { text: 'country',minWidth: 80,dataIndex: 'country', flex: 4},
												// { text: 'state',minWidth: 80,dataIndex: 'state', flex: 4},
												// { text: 'city',minWidth: 90,dataIndex: 'city', flex: 4}
												
											],
											columnLines: true,
											plugins: [{
												ptype: 'rowexpander',
												pluginId: 'rowexpanderID',
												selectRowOnExpand: true,			
												rowBodyTpl : new Ext.XTemplate(
													'<p><b>category:</b> {category} | <b>instalation:</b> {instalation} ', //&#x2016; doble linea vertical
													'| <b>quality:</b> {quality} ',
													'| <b>lon:</b> {lon} ',
													'| <b>lat:</b> {lat} ',
													'| <b>elev:</b> {elev} </p>',
													'<p><b>country:</b> {country} ',
													'| <b>state:</b> {state} ',
													'| <b>city:</b> {city}</p> ',
													'<div id="myrow-{id}" ></div>'
												),		
												expandOnRender: true,
												expandOnDblClick: false		
									
											}],							

											stripeRows: true,
											// margin: '0 0 20 0',
											selModel: selModel,
											// viewConfig: { 
												// stripeRows: false, 
												// getRowClass: function(record) { 
													// if(winRegion.width==winRegion.maxWidth){
														// return 'regiongrid-max';
													// }else{return 'regiongrid-min';}
												// }	
											// },
											// inline buttons
											dockedItems: [
												{
												xtype: 'toolbar',
												items: [{
													itemId: 'removeButton',
													text:'Download',
													tooltip:'Download data',
													icon   : iconGridDownload,
													disabled: true,
													handler: btn_download 
												},cmbVar/*,{
													itemId: 'zoomExtentALL',
													text:'zoomExtentALL',
													tooltip:'zoomExtent to ALL',
													icon   : iconGridzoomExtentALL,//iconCls:'add',
													handler: onZoomExtentALL 
												}*/,{
													itemId: 'idExpand',
													text:'Expand all',
													tooltip:'Expand all',
													iconCls:iconGridExpand,
													handler: expand 
												},{
												
													itemId: 'idstatistic',
													text:'Statistics',
													tooltip:'Summary Statistic',
													icon   : iconGridStatistics,
													disabled: true,
													handler: statistics 
												},{ xtype: 'tbtext', itemId: 'numRecords' },{xtype: 'tbfill'},
												{ 
													itemId: 'idMaximo',
													// text:'Maximize',
													tooltip:'Maximize table',
													icon   : iconGridMaximize,
													// stretch: false,
													align: 'right',
													handler: Maximize,
												}]
											}]		
										});

										// para el mostrar el grid de variables cuando se da en el boton expandir
										Ext.getCmp('gridRegionID').getView().on('expandbody', function(rowNode, record, expandbody,eNode){

											var dynamicStore  //the new store for the nested grid.
											var row = "myrow-" + record.get("id");
											var id2 = "mygrid-" + record.get("id");  
											row2 = Ext.get(rowNode);
											
											var store = Ext.create('Ext.data.Store', {
												model: 'modelGridVar',
												autoSync: true,
												storeId: 'store2',
												proxy: {
													type: 'ajax', 
													url: 'php/Geo_statByregion.php',
													extraParams: {
														idstat: record.get("id"),type:17
													},
													reader: {
														type: 'json',
														root: 'topics'
													}
												},
												autoLoad: true// {callback: initData}
											});
												  
											var grid = Ext.create('Ext.grid.Panel', {
												// hideHeaders: true,
												border: false,
												height:100,
												layout: 'fit',
												// width:500,
												autoWidth:true,
												id: id2,
												columns: [{
														xtype: 'actioncolumn',
														// flex: 0,
														width: 150,
														autoSizeColumn: true,
														items: [{
															icon   : icons+'buttons/download_off.gif',  // Use a URL in the icon config
															tooltip: 'zoom extent2',
															handler: function(grid, rowIndex, colIndex) {
																var rec = store.getAt(rowIndex);
																idstat=rec.get('idstat')
																idvar=rec.get('idvar')
																Ext.DomHelper.append(document.body, {
																  tag: 'iframe',
																  id:'downloadIframe',
																  frameBorder: 0,
																  width: 0,
																  height: 0,
																  css: 'display:none;visibility:hidden;height: 0px;',
																  src: 'php/dowloaddata.php?typedwn=selection&station='+Ext.encode([idstat])+'&'+'variable='+Ext.encode([idvar])
																});
															
															}
														}]
													},{ text: 'name',dataIndex: 'name'},
													{ text: 'acronym',dataIndex: 'acronym'},
													{ text: 'date_start',dataIndex: 'date_start'},
													{ text: 'date_end',dataIndex: 'date_end'},
													{ text: 'age',dataIndex: 'age',autoSizeColumn: true}],
												store: store,
												viewConfig: {
													listeners: {
														refresh: function(dataview) {
															Ext.each(dataview.panel.columns, function(column) {
																if (column.autoSizeColumn === true)
																	column.autoSize();
															})
														}
													}
												}	
											});
											
										   grid.render(row)
											grid.getEl().swallowEvent([ 'mouseover', 'mousedown', 'click', 'dblclick' ]);
											// grid.on('itemclick', function(view) {
												// Ext.getCmp('gridRegionID').getView().getSelectionModel().deselectAll();
											// });
											
												
										});	
										gridRegion.getView().on('collapsebody', function(rowNode, record, eNode) {
											var row = "myrow-" + record.get("id");
											var id2 = "mygrid-" + record.get("id");  
											// Ext.getCmp(id2).getStore().removeAll();
											$('#'+row).empty();
											// Ext.get(rowNode).down('#'+row).down('div').destroy();
										});

										gridStatStore.on('load', function(ds){
											countRow=ds.getTotalCount()
											if(countRow>=1){
												// winRegion.show()
												// Ext.getCmp('gridRegionID').add(gridRegion);
												// Ext.getCmp('gridRegionID').doLayout();
												
												Ext.getCmp('mainTableID').add(gridRegion);
												gridRegion.down('#numRecords').setText('Records: ' + countRow);
												Ext.getCmp('mainTableID').expand()
												
												Ext.DomHelper.append(document.body, {
												  tag: 'iframe',
												  id:'downloadIframe',
												  frameBorder: 0,
												  width: 0,
												  height: 0,
												  css: 'display:none;visibility:hidden;height: 0px;',
												  src: 'php/dowloaddata.php?typedwn=selection&station='+encodeURIComponent(JSON.stringify(selectID))+'&'+'country=null'+'&'+'state=null'+'&'+'municip=null'+'&'+'variable='+Ext.encode(cmbVar.getValue())
												});									
												myMask.hide();
											}else{
												myMask.hide();
												Ext.getCmp('mainTableID').collapse()
												winInfo=Ext.MessageBox.show({
												   title: 'Information',
												   msg: 'Not stations found!',
												   buttons: Ext.MessageBox.OK,
												   animateTarget: 'info',
												   icon: 'x-message-box-info'
												});	
												winInfo.setPosition(mainPanelWidth/3,mainPanelHeight/2);
											}	
										});	
								
							
							
							// ################################################################################################################
						
						


						} // fin handler boton hover

					}]
				}]
			});
								
			var checkConstrOpt = "no-constrain", //constrain-full, constrain-header, no-constrain
				undef,
				constrainOpts = {
					constrain: (checkConstrOpt === 'constrain-full') ? true : undef,
					constrainHeader: (checkConstrOpt === 'constrain-header') ? true : undef
				},
				popupOpts = Ext.apply({
					title: 'Information',
					id:'popupID',
					location: feature,
					width:200,
					maxHeight:300,
					items: [gridRegionHover],
					maximizable: false,
					collapsible: true,
					anchorPosition: 'auto',
					alwaysOnTop: true,
					listeners:{		
						resize: {
						  fn: function(el) {
							if(el.height){
							  gridRegion.maxHeight=el.height-40
							  // Ext.getCmp('popupID').maxHeight=el.height
							  Ext.getCmp('gridRegionIDHover').getView().refresh();
							} 
						  }
						}
					}
				}, constrainOpts);

			popup = Ext.create('GeoExt.window.Popup', popupOpts);
			// unselect feature when the popup
			// is closed
			popup.on({
				close: function() {
					if(OpenLayers.Util.indexOf(clusters.selectedFeatures,
											   this.feature) > -1) {
						selectControl.control.unselect(this.feature);
					}else {
					this.destroy();}					
				}
			});
			popup.show();
		}

		var defStyle =// estilo de puntos cuando se pasa el mouse por ensima de los clusters - hover
		{
			fillColor: "red",
			fillOpacity: 0.9, 
			strokeColor: "red",
			strokeOpacity: 0.3,
			strokeWidth: 1,
			pointRadius: 4,
			label: "${name}",
			labelOutlineWidth:0.5,
			fontColor: "#ffffff",
			fontOpacity: 0.8,
			fontSize: "12px"
		};	

		clusters.events.on({
		  'featureselected': function(event) {
		  
			var myFeatyures = event.feature.cluster;
			var f = event.feature;
			allfeatures=new Array()
			if(myFeatyures.length>1){
				for (var i = myFeatyures.length - 1; i >= 0; --i) {
					// myFeatyures[i].style = defStyle 
					vectorHover.drawFeature(myFeatyures[i]);
					allfeatures.push(myFeatyures[i])
				}
			}
			// vectorHover.addFeatures(allfeatures);
			
			if(Ext.getCmp('popupID')){
				Ext.getCmp('popupID').close()
			}			
			createPopup(event.feature,myFeatyures);
						
				
		  },
		  'featureunselected': function(event) {
				vectorHover.removeAllFeatures();
				vectorHover.destroyFeatures();
				// if(Ext.getCmp('popupID')){
					// Ext.getCmp('popupID').close()
				// }				
		  }
		});

		var styleHoverNull = new OpenLayers.Style(null, {
			fillColor: ""
		});	
		
		var selectHover = new OpenLayers.Control.SelectFeature(
			clusters, {hover: true, renderIntent: styleHoverNull}
		);
		
		mapPanel.map.addControl(selectHover);
		selectHover.activate();

		var oClickClose = new OpenLayers.Control.Click({eventMethods:{
		 'click': function(e) {
			if(Ext.getCmp('popupID')){
				Ext.getCmp('popupID').close()
			}
			getWin = Ext.getCmp('distanceID');
			if (getWin) {
				getWin.close()
				getWin.destroy();
			} 			
		 }
		}});
		mapPanel.map.addControl(oClickClose)
		oClickClose.activate();		
// ############################################## FIN POPUP IDENTIFY ##############################################################################################################		
	
		var ctrl, toolbarItems = [], action, actions = {};	            

		var btonZooExtent = new Ext.Button({
			pressedCls : 'my-pressed',
			overCls : 'my-over',
			tooltip: "Zoom Extent to all stations",
			icon: icons+'ze.png', 
			scale: 'medium',
			enableToggle: false,
			handler: function(){
				if(Ext.getCmp('popupID')){
					Ext.getCmp('popupID').close()
				}		
				getWin = Ext.getCmp('distanceID');
				if (getWin) {
					getWin.close()
					getWin.destroy();
				} 				
				var BoundALL = clusters.getDataExtent();
				mapPanel.map.zoomToExtent(BoundALL);
				selectControl.control.deactivate();
			}			
		});
		
		var btonIdentify = new Ext.Button({
			pressedCls : 'my-pressed',
			overCls : 'my-over',
			tooltip: "Identify stations with hover mouse. Shows a attribute table summary",
			icon: icons+'identify_off.gif', 
			scale: 'medium',
			enableToggle: true,
			allowDepress: true,
			pressed:true,
			handler: function(toggled){
				if(Ext.getCmp('popupID')){
					Ext.getCmp('popupID').close()
				}		
				getWin = Ext.getCmp('distanceID');
				if (getWin) {
					getWin.close()
					getWin.destroy();
				} 				
				if(toggled.pressed==true){
					selectHover.activate();
				}else{
					selectHover.deactivate();
					vectorHover.removeAllFeatures();
				}
			}			
		});
		
		ctrl_zoomBox = Ext.create('GeoExt.Action', {
			pressedCls : 'my-pressed',
			overCls : 'my-over',
			control: new OpenLayers.Control.ZoomBox(),//{alwaysZoom:true}),
			toggleGroup: "draw",
			group: "draw",
			map: mapPanel.map,
			enableToggle: true,
			tooltip: "Zoom Box",
			icon: icons+'zb.png',
			scale: 'medium',
			handler: function(toggled){
				if(Ext.getCmp('popupID')){
					Ext.getCmp('popupID').close()
				}			
				// if(toggled.pressed==true){
					// selectHover.deactivate();
				// }else{
					// selectHover.activate();
				// }
				getWin = Ext.getCmp('distanceID');
				if (getWin) {
					getWin.close()
					getWin.destroy();
				} 				
			}			
		});
		
		//para desactivar el boton zoombox cuando se lo ejecuta
		ctrl_zoomBox.control.events.on({"activate": onZoomBoxActivate, "scope": ctrl_zoomBox.control });
		function onZoomBoxActivate(){
			mapPanel.map.events.on({"zoomend": onMapZoomEnd, "scope": mapPanel.map});
		}
		function onMapZoomEnd(){
			ctrl_zoomBox.control.deactivate();
			// selectHover.activate();
		}		
		
		var medirDistancia = Ext.create('GeoExt.Action', {
			pressedCls : 'my-pressed',
			overCls : 'my-over',		
			control: new OpenLayers.Control.Measure(OpenLayers.Handler.Path, {
				eventListeners: {
					measure: function(evt) {
						getWin = Ext.getCmp('distanceID');
						if (getWin) {
							getWin.close()
							getWin.destroy();
						} //winRegion						
						var ventana = Ext.create('widget.window', {
								title: "Distance",
								id:'distanceID',
								constrainHeader: true,
								height: 60, width: 170, 
								style: "font-family: 'Oswald', sans-serif;font-size: 14px;",
								html: "Distance is: " + ((Math.floor(evt.measure*100))/100) + ' '+ evt.units,
								layout:'fit',
								autoscroll: true,
								overflow: true,
								x:mainPanelWidth/2,
								y:mainPanelHeight/2,								
								
							});
							// ventana.setPosition(mainPanelWidth/3,mainPanelHeight/2);
							ventana.show();								
							medirDistancia.control.deactivate();
							// selectHover.activate();
					}
				}
			}),
			handler: function(toggled){
				getWin = Ext.getCmp('distanceID');
				if (getWin) {
					getWin.close()
					getWin.destroy();
				} //winRegion	
				if(Ext.getCmp('popupID')){
					Ext.getCmp('popupID').close()
				}
				// if(toggled.pressed==true){
					// selectHover.deactivate();
				// }else{
					// selectHover.activate();
				// }
			},
			map: mapPanel.map,
			toggleGroup: "draw",
			allowDepress: true,
			tooltip: "Distance. To finish measure double-clicking on the map",
			cls: 'x-btn-icon',
			icon: icons+'a.png',
			scale: 'medium',
			group: "draw"
		});
			
		var bton_down = new Ext.Button({
			pressedCls : 'my-pressed',
			overCls : 'my-over',
			tooltip: "Download stations selected",
			icon: icons+'download.png',
			scale: 'medium',
			enableToggle: false,
			handler: function(){
				selectControl.control.deactivate();
				if(Ext.getCmp('gridRegionID')){
					Ext.getCmp('mainTableID').collapse();
					Ext.getCmp('gridRegionID').destroy();	
				}				
				getWin = Ext.getCmp('distanceID');
				if (getWin) {
					getWin.close()
					getWin.destroy();
				} 
				
				// loading status
				var myMask = new Ext.LoadMask(Ext.getCmp('mapPanelID'), {msg:"Please wait..."});
				myMask.show();
				
				// para obtener ids de estaciones seleccionadas
				feature = clusters.features;
				selectID=[]
				for (var i = feature.length - 1; i >= 0; --i) {
					if(feature[i].renderIntent=='select'){
						// console.log(clusters.selectedFeatures.indexOf(feature[i]))
						for (var j = feature[i].cluster.length - 1; j >= 0; --j) {
							sel=feature[i].cluster[j].attributes.id;
							selectID.push(sel)
						}
					}
				}					
				
				// ##############################################################    TABLA GRID ##################################
				
							var gridStatStore = Ext.create('Ext.data.Store', {
								model: 'modelGridRegion',
								autoLoad: true,
								autoSync: true,
								sorters: { property: 'name', direction : 'ASC' },
								proxy: {
									type: 'ajax',
									url: 'php/Geo_statByregion.php',
									extraParams: {type:14,listStatSel:Ext.encode(selectID)},			
									reader: {
										type: 'json',
										root: 'topics'
									}
								}
							});								

							var varstore = Ext.create('Ext.data.Store', {
								model: 'modelvarList',
								autoLoad: true,
								autoSync: true,
								sorters: { property: 'name', direction : 'ASC' },

								proxy: {
									type: 'ajax',
									url: 'php/Geo_statByregion.php',
									extraParams: {type:15,listStatSel:Ext.encode(selectID)},			
									reader: {
										type: 'json',
										root: 'topics'
									}
								},
								listeners: {
									 load: function(store, records) {
										  store.insert(0, [{
											  id: 0,
											  name: 'ALL',
											  acronym: 'ALL'
											  
										  }]);
									 }
								  }								
							});	
							
							var selModel = Ext.create('Ext.selection.CheckboxModel', {
								listeners: {
									selectionchange: function(sm, selections) {
										gridRegion.down('#removeButton').setDisabled(selections.length === 0);
										gridRegion.down('#idstatistic').setDisabled(selections.length === 0);
										// gridRegion.down('#zoomExtent').setDisabled(selections.length === 0 || selections.length > 1);
									}
								}
							});	
							
							btn_download = function () {
								var selection = gridRegion.getView().getSelectionModel().getSelection();//[0];
								selgrid=new Array()
								for(var i = 0; i < selection.length; i++) {
									selgrid.push(Number(selection[i].data.id));
								}
								Ext.DomHelper.append(document.body, {
								  tag: 'iframe',
								  id:'downloadIframe',
								  frameBorder: 0,
								  width: 0,
								  height: 0,
								  css: 'display:none;visibility:hidden;height: 0px;',
								  src: 'php/dowloaddata.php?typedwn=selection&station='+Ext.encode(selgrid)+'&'+'country=null'+'&'+'state=null'+'&'+'municip=null'+'&'+'variable='+Ext.encode(cmbVar.getValue())+'&typedwn=selection'
								});
							}	
							onZoomExtentALL = function () {
								// layerTemp=mapPanel.map.getLayersByName("FindStation")[0]

								FeatselectID=[]
								for (var i = feature.length - 1; i >= 0; --i) {
									if(feature[i].renderIntent=='select'){
											sel=feature[i]//.cluster[j]
											FeatselectID.push(sel)
									}
								}
								console.log(FeatselectID)
								console.log(FeatselectID[0].geometry.getBounds())
								var BoundALL = FeatselectID[0].geometry.getBounds();
								// mapPanel.map.zoomToExtent(BoundALL);								
								
							}

							cmbVar= Ext.create('Ext.form.field.ComboBox', { 
								editable: false, 
								value: 'ALL',
								multiSelect: true, 
								displayField: 'acronym',
								valueField: 'id', 
								id:'varCmbID',
								queryMode: 'local',
								typeAhead: true,	
								store: varstore,
								listConfig: {
									getInnerTpl: function() {
										return '<div data-qtip="{name}">{acronym}</div>';
									}
								}
							
							});		
							
							gridRegion = Ext.create('Ext.grid.Panel', {
								id: 'gridRegionID',
								border: true,
								// layout: 'fit',
								forceFit: true,
								store: gridStatStore,
								maxHeight: Ext.getBody().getViewSize().height*0.3,
								width: mainPanelWidth,
								// height:273,
								// maxHeight: mainPanelHeight*0.4,
								selType: 'checkboxmodel',
								autoHeight: true,
								columns: [
									{
										xtype: 'actioncolumn',
										minWidth: 20,
										flex: 1,
										items: [{
											icon   : icons+'buttons/zoomin_off.gif',  // Use a URL in the icon config
											tooltip: 'zoom extent',
											handler: function(grid, rowIndex, colIndex) {
												var rec = gridStatStore.getAt(rowIndex);
												selectionID = rec.get('id');
												zoomToStation(selectionID)
												// layerTemp=mapPanel.map.getLayersByName("Stations")[0]
												// for (var i = layerTemp.features.length - 1; i >= 0; --i) {
													// for (var j = layerTemp.features[i].cluster.length - 1; j >= 0; --j) {
														// sel=layerTemp.features[i].cluster[j].attributes.id;
														// if(sel==selectionID){
															// featureSel=layerTemp.features[i].cluster[j].geometry
															// var bounds = featureSel.getBounds();
															// if(bounds){ mapPanel.map.panTo(bounds.getCenterLonLat()); mapPanel.map.zoomToExtent(bounds);}

															// var mySelectStyle = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style["default"]);
															// OpenLayers.Util.extend(mySelectStyle, {pointRadius: 5,fillOpacity: 0.5,strokeColor: "#00FF00"});//{externalGraphic: iconZomm,graphicHeight: 32,graphicWidth: 32,fillOpacity: 0.8});	
															
															// var selectFeature = new OpenLayers.Control.SelectFeature(layerTemp,{selectStyle: mySelectStyle});
															// mapPanel.map.addControl(selectFeature);
															// selectFeature.activate();	
															// selectFeature.select(layerTemp.features[i]);	
														// }
													// }
												// }												
											}
										}]
									},		
									{
										xtype: 'actioncolumn',
										minWidth: 20,
										flex: 1,
										items: [{
											icon   : icons+'buttons/pie-chart-graph-icon.png',  // Use a URL in the icon config
											tooltip: 'Graphic',
											handler: function(grid, rowIndex, colIndex) {
												var rec = gridStatStore.getAt(rowIndex);
												selectionID = rec.get('id');
												
												varlist=(cmbVar.getRawValue()).replace(/\s/g, '')
												var arrayvar =new Array() //varlist.split(',');

												for(var i = 0; i < varstore.getCount(); i++) {
													var record = varstore.getAt(i);
													id=record.get('id')
													acronym=record.get('acronym')
													arrayvar.push(acronym)
													// console.log(id,acronym)
												}
												
												var datatest = {
													name: 'xxx',
													rowTitleArr: arrayvar,
													colTitleArr: ['a', 'b', 'c']
												}
												var tpl = [
													'<div id="grap_temp_'+selectionID+'" style="width:'+grapWidth+'px;"></div>',
													'<tpl for="rowTitleArr">',
													'<div id="grap_{.}_'+selectionID+'" style="width:'+grapWidth+'px;"></div>',
													'</tpl>'
												];	

												cmbPeriod='cmbPeriod'+selectionID
												cmbPeriod=Ext.create('Ext.form.field.ComboBox', { 
													fieldLabel: 'Select graphic model',
													id:'cmbPeriodID'+selectionID,
													labelWidth:150,
													store: {
														fields: ['value','name'], 
														data: [ 
															{value:1,name: 'Daily'}, 
															{value:2,name: 'Monthly'}, 
															{value:3,name: 'Yearly'}
														]
													},
													displayField: 'name',
													value: 1,
													queryMode: 'local',
													valueField: 'value', 								
													typeAhead: true,
													listeners: {
														select: function() {
															var actTab = tabs.getActiveTab();
															var idx = tabs.items.indexOf(actTab);
															actTabId=parseInt((actTab.title).match(/\d+/)[0])
															var idPeriod = Ext.getCmp('cmbPeriodID'+actTabId).getValue()
															console.log(actTab,idx,actTabId,idPeriod)
															generateGraps(actTabId,idPeriod,Ext.encode(cmbVar.getValue()))

														}
													}
												});		
												if(!Ext.getCmp('graphic'+selectionID)){
													tabs.add({
														// contentEl: "desc",
														// xtype: 'panel',
														title: 'Graphic_id'+selectionID,
														name: 'graphic'+selectionID,
														// width:mainPanelWidth-15,
														// maxHeight: 100,
														autoScroll: true,
														// height: 100,
														// autoHeight: true,
														// layout: 'fit',
														id: 'graphic'+selectionID,
														 // html: new Ext.XTemplate(
														 // tpl
														 // '<div id="grap_tmin_'+selectionID+'" ></div>',
														 // '<div id="grap_prec_'+selectionID+'"></div>'
														 // ),
														 // .apply({value: '2. HTML property of a panel generated by an XTemplate'}),
														closable: true,
														dockedItems: [
															{
															xtype: 'toolbar',
															items: [cmbPeriod]
															}
														]													
													});		
												}
												var t = new Ext.XTemplate(tpl);
												Ext.getCmp('graphic'+selectionID).update(t.apply(datatest));
												// Ext.getCmp('graphic'+selectionID).update('This<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long');
												
												Ext.getCmp('mapPanelID').setHeight(0)
												Ext.getCmp('tabsID').setWidth(mainPanelWidth-15);
												// Ext.getCmp('tabsID').setHeight(mainPanelHeight*0.2);
												tabs.setActiveTab('graphic'+selectionID);
												
												generateGraps(selectionID,cmbPeriod.getValue(),Ext.encode(cmbVar.getValue()))
											} // handler
										}]
									},								
									// {
										// text : '&#8470;',
										// dataIndex: 'rowIndex',
										// flex: 1,
										// minWidth: 20,
										// renderer : function(value, metaData, record, rowIndex)
										// {return rowIndex+1;}
									// },			
									{ text: 'id',minWidth: 50,dataIndex: 'id', flex: 1},
									{ text: 'code',minWidth: 80,dataIndex: 'code', flex: 1},
									{ text: 'name',minWidth: 120,dataIndex: 'name', flex: 4},
									{ text: 'institute',minWidth: 50,dataIndex: 'institute', flex: 3},
									{ text: 'model',minWidth: 80,dataIndex: 'model', flex: 2},
									
									// { text: 'category',minWidth: 100,dataIndex: 'category', flex: 4},

									// { text: 'instalation',minWidth: 80,dataIndex: 'instalation', flex: 3},
									// { text: 'quality',minWidth: 80,dataIndex: 'quality', flex: 1},
									
									{ text: 'variables',minWidth: 100,dataIndex: 'variables', flex: 4},
									// { text: 'lon',minWidth: 80,dataIndex: 'lon', flex: 3},
									// { text: 'lat',minWidth: 80,dataIndex: 'lat', flex: 3},
									// { text: 'elev',minWidth: 80,dataIndex: 'elev', flex: 2},
									// { text: 'country',minWidth: 80,dataIndex: 'country', flex: 4},
									// { text: 'state',minWidth: 80,dataIndex: 'state', flex: 4},
									// { text: 'city',minWidth: 90,dataIndex: 'city', flex: 4}
									
								],
								columnLines: true,
								plugins: [{
									ptype: 'rowexpander',
									pluginId: 'rowexpanderID',
									selectRowOnExpand: true,			
									rowBodyTpl : new Ext.XTemplate(
										'<p><b>category:</b> {category} | <b>instalation:</b> {instalation} ', //&#x2016; doble linea vertical
										'| <b>quality:</b> {quality} ',
										'| <b>lon:</b> {lon} ',
										'| <b>lat:</b> {lat} ',
										'| <b>elev:</b> {elev} </p>',
										'<p><b>country:</b> {country} ',
										'| <b>state:</b> {state} ',
										'| <b>city:</b> {city}</p> ',
										'<div id="myrow-{id}" ></div>'
									),		
									expandOnRender: true,
									expandOnDblClick: false		
						
								}],							

								stripeRows: true,
								// margin: '0 0 20 0',
								selModel: selModel,
								// viewConfig: { 
									// stripeRows: false, 
									// getRowClass: function(record) { 
										// if(winRegion.width==winRegion.maxWidth){
											// return 'regiongrid-max';
										// }else{return 'regiongrid-min';}
									// }	
								// },
								// inline buttons
								dockedItems: [
									{
									xtype: 'toolbar',
									items: [{
										itemId: 'removeButton',
										text:'Download',
										tooltip:'Download data',
										icon   : iconGridDownload,
										disabled: true,
										handler: btn_download 
									},cmbVar/*,{
										itemId: 'zoomExtentALL',
										text:'zoomExtentALL',
										tooltip:'zoomExtent to ALL',
										icon   : iconGridzoomExtentALL,//iconCls:'add',
										handler: onZoomExtentALL 
									}*/,{
										itemId: 'idExpand',
										text:'Expand all',
										tooltip:'Expand all',
										iconCls:iconGridExpand,
										handler: expand 
									},{
									
										itemId: 'idstatistic',
										text:'Statistics',
										tooltip:'Summary Statistic',
										icon   : iconGridStatistics,
										disabled: true,
										handler: statistics 
									},{ xtype: 'tbtext', itemId: 'numRecords' },{xtype: 'tbfill'},
									{ 
										itemId: 'idMaximo',
										// text:'Maximize',
										tooltip:'Maximize table',
										icon   : iconGridMaximize,
										// stretch: false,
										align: 'right',
										handler: Maximize,
									}]
								}]		
							});

							// para el mostrar el grid de variables cuando se da en el boton expandir
							Ext.getCmp('gridRegionID').getView().on('expandbody', function(rowNode, record, expandbody,eNode){

								var dynamicStore  //the new store for the nested grid.
								var row = "myrow-" + record.get("id");
								var id2 = "mygrid-" + record.get("id");  
								row2 = Ext.get(rowNode);
								
								var store = Ext.create('Ext.data.Store', {
									model: 'modelGridVar',
									autoSync: true,
									storeId: 'store2',
									proxy: {
										type: 'ajax', 
										url: 'php/Geo_statByregion.php',
										extraParams: {
											idstat: record.get("id"),type:17
										},
										reader: {
											type: 'json',
											root: 'topics'
										}
									},
									autoLoad: true// {callback: initData}
								});
									  
								var grid = Ext.create('Ext.grid.Panel', {
									// hideHeaders: true,
									border: false,
									height:100,
									layout: 'fit',
									// width:500,
									autoWidth:true,
									id: id2,
									columns: [{
											xtype: 'actioncolumn',
											// flex: 0,
											width: 150,
											autoSizeColumn: true,
											items: [{
												icon   : icons+'buttons/download_off.gif',  // Use a URL in the icon config
												tooltip: 'zoom extent2',
												handler: function(grid, rowIndex, colIndex) {
													var rec = store.getAt(rowIndex);
													idstat=rec.get('idstat')
													idvar=rec.get('idvar')
													Ext.DomHelper.append(document.body, {
													  tag: 'iframe',
													  id:'downloadIframe',
													  frameBorder: 0,
													  width: 0,
													  height: 0,
													  css: 'display:none;visibility:hidden;height: 0px;',
													  src: 'php/dowloaddata.php?typedwn=selection&station='+Ext.encode([idstat])+'&'+'variable='+Ext.encode([idvar])
													});
												
												}
											}]
										},{ text: 'name',dataIndex: 'name'},
										{ text: 'acronym',dataIndex: 'acronym'},
										{ text: 'date_start',dataIndex: 'date_start'},
										{ text: 'date_end',dataIndex: 'date_end'},
										{ text: 'age',dataIndex: 'age',autoSizeColumn: true}],
									store: store,
									viewConfig: {
										listeners: {
											refresh: function(dataview) {
												Ext.each(dataview.panel.columns, function(column) {
													if (column.autoSizeColumn === true)
														column.autoSize();
												})
											}
										}
									}	
								});
								
							   grid.render(row)
								grid.getEl().swallowEvent([ 'mouseover', 'mousedown', 'click', 'dblclick' ]);
								// grid.on('itemclick', function(view) {
									// Ext.getCmp('gridRegionID').getView().getSelectionModel().deselectAll();
								// });
								
									
							});	
							gridRegion.getView().on('collapsebody', function(rowNode, record, eNode) {
								var row = "myrow-" + record.get("id");
								var id2 = "mygrid-" + record.get("id");  
								// Ext.getCmp(id2).getStore().removeAll();
								$('#'+row).empty();
								// Ext.get(rowNode).down('#'+row).down('div').destroy();
							});

							gridStatStore.on('load', function(ds){
								countRow=ds.getTotalCount()
								if(countRow>=1){
									// winRegion.show()
									// Ext.getCmp('gridRegionID').add(gridRegion);
									// Ext.getCmp('gridRegionID').doLayout();
									
									Ext.getCmp('mainTableID').add(gridRegion);
									gridRegion.down('#numRecords').setText('Records: ' + countRow);
									Ext.getCmp('mainTableID').expand()
									
									Ext.DomHelper.append(document.body, {
									  tag: 'iframe',
									  id:'downloadIframe',
									  frameBorder: 0,
									  width: 0,
									  height: 0,
									  css: 'display:none;visibility:hidden;height: 0px;',
									  src: 'php/dowloaddata.php?typedwn=selection&station='+encodeURIComponent(JSON.stringify(selectID))+'&'+'country=null'+'&'+'state=null'+'&'+'municip=null'+'&'+'variable='+Ext.encode(cmbVar.getValue())
									});									
									myMask.hide();
								}else{
									myMask.hide();
									Ext.getCmp('mainTableID').collapse()
									winInfo=Ext.MessageBox.show({
									   title: 'Information',
									   msg: 'Not stations found!',
									   buttons: Ext.MessageBox.OK,
									   animateTarget: 'info',
									   icon: 'x-message-box-info'
									});	
									winInfo.setPosition(mainPanelWidth/3,mainPanelHeight/2);
								}	
							});	
					
							// selectHover.activate();
							// selectControl.control.unselectAll();
				// ################################################################################################################
			
			


			}
		});		
				
		
        function onPopupClose(evt) {
            selectControl.control.unselect(selectedFeature);
        }
        function onFeatureSelect(event) {
			// var myFeatyures = event.cluster;
			// var f = event.feature;
			// if(myFeatyures.length>1){
				// for (var i = myFeatyures.length - 1; i >= 0; --i) {
					// vectorHover.drawFeature(myFeatyures[i]);
				// }
			// }
			vectorHover.removeAllFeatures();
			vectorHover.destroyFeatures();			
			if(Ext.getCmp('popupID')){
				Ext.getCmp('popupID').close()
			}			

        }
        function onFeatureUnselect(feature) {
            // mapPanel.map.removePopup(feature.popup);
            // feature.popup.destroy();
            // feature.popup = null;
        } 		
		// SelectFeature control, a "toggle" control
		

// controlSel = new OpenLayers.Control.SelectFeature(
                    // clusters,
                    // {
                        // clickout: false, toggle: false,
                        // multiple: false, hover: false,
                        // toggleKey: "ctrlKey", // ctrl key removes from selection
                        // multipleKey: "shiftKey", // shift key adds to selection
                        // box: true
                    // }
                // );
				
				

// mapPanel.map.addControl(controlSel);
// var selectControl = new Ext.Button({
	// pressedCls : 'my-pressed',
	// overCls : 'my-over',
	// toggleGroup: "draw",
	// group: "draw",
	// icon: icons+'s.png',
	// scale: 'medium',
    // handler: function(toggled){
        // if (toggled) {
            // controlSel.activate();
        // } else {
            // controlSel.deactivate();
        // }
    // },
	// enableToggle: true,
	// tooltip: "select stations for download"	
// });		

        // var vector = new OpenLayers.Layer.Vector("vector");
        // mapPanel.map.addLayers([clusters2]);
		
        // actionDraw = Ext.create('GeoExt.Action', {
            // text: "draw line",
            // control: new OpenLayers.Control.DrawFeature(vector, OpenLayers.Handler.Path),
            // map: mapPanel.map,
            // toggleGroup: "draw",
            // allowDepress: false,
            // tooltip: "draw line",
            // group: "draw"
        // });
		
		var mySelectStyle = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style["default"]);
		OpenLayers.Util.extend(mySelectStyle, {externalGraphic: iconZomm,graphicHeight: 32,graphicWidth: 32,fillOpacity: 0.8});	
												
		selectControl = Ext.create('GeoExt.Action', {
			pressedCls : 'my-pressed',
			overCls : 'my-over',
			toggleGroup: "draw",
			group: "draw",
			icon: icons+'select_off.gif',
			scale: 'medium',
			control: new OpenLayers.Control.SelectFeature(clusters, {
				type: OpenLayers.Control.TYPE_TOGGLE,
				// selectStyle: mySelectStyle,
				clickout: true, toggle: false,
				multiple: false, hover: false,
				toggleKey: "ctrlKey", // ctrl key removes from selection
				multipleKey: "shiftKey", // shift key adds to selection
				box: true,
				onSelect: onFeatureSelect, onUnselect: onFeatureUnselect				
			}),
			map: mapPanel.map,
			// button options
			enableToggle: true,
			tooltip: "select stations by box or use shift key to select stations individual and to download press the next button",
			handler: function(toggled){
				if(Ext.getCmp('popupID')){
					Ext.getCmp('popupID').close()
				}		
				getWin = Ext.getCmp('distanceID');
				if (getWin) {
					getWin.close()
					getWin.destroy();
				} 				
				if(toggled.pressed==true){
					// selectHover.deactivate();
				}else{
					// selectHover.activate();
					selectControl.control.unselectAll();					
				}
				
			}		
		});

		//para desactivar el boton zoombox cuando se da click derecho
		selectControl.control.events.on({"activate": selectActivate, "scope": selectControl.control });
		function selectActivate(){
			var oClick = new OpenLayers.Control.Click({eventMethods:{
			 'rightclick': function(e) {
				  selectControl.control.unselectAll();
				  selectControl.control.deactivate();
				  oClick.deactivate();
				  // selectHover.activate();
					if(Ext.getCmp('gridRegionID')){
						Ext.getCmp('mainTableID').collapse();
						Ext.getCmp('gridRegionID').destroy();	
					}					  
			 }
			}});
			mapPanel.map.addControl(oClick);
			oClick.activate();			
		}
	
		
	// BOTON PARA IMPRIMIR MAPA
/*	var printProvider = Ext.create('GeoExt.data.MapfishPrintProvider', {
		method: "GET", // "POST" recommended for production use
		capabilities: printCapabilities, // from the info.json script in the html
		customParams: {
			mapTitle: "Printing Demo"
		}
	});
	printPage = Ext.create('GeoExt.data.PrintPage', {
		printProvider: printProvider
	});		
	var pageLayer = new OpenLayers.Layer.Vector('print');
	pageLayer.addFeatures(printPage.feature);					
					
	var printBton = Ext.create('GeoExt.Action', {
		pressedCls : 'my-pressed',
		overCls : 'my-over',
		enableToggle: false,
		scale: 'medium',
		icon: icons+'print3.png',
		tooltip: "Print map",
		loadMask: true,
		handler: function(){ 

			mapPanel.map.addLayer(pageLayer);
			var winPrint = new Ext.Window({
				title: 'Print',
				constrainHeader: true,
				width: 220,
				bodyStyle: "padding:5px",
				labelAlign: "top",
				defaults: {anchor: "100%"},
				x: mainPanelWidth / 4,
				y: mainPanelWidth / 4 - 1,
				labelWidth: 72,	
				frame:true, 
				layout: 'form',	
			
				items: [{
					xtype: "textarea",
					name: "comment",
					value: "",
					fieldLabel: "Comment",
					allowBlank: false,
					plugins: Ext.create('GeoExt.plugins.PrintPageField', {
						printPage: printPage
					})
				}, {
					xtype: "combo",
					store: printProvider.layouts,
					displayField: "name",
					fieldLabel: "Layout",
					typeAhead: true,
					queryMode: "local",
					triggerAction: "all",
					plugins: Ext.create('GeoExt.plugins.PrintProviderField', {
						printProvider: printProvider
					})
				}, {
					xtype: "combo",
					store: printProvider.dpis,
					displayField: "name",
					fieldLabel: "Resolution",
					displayTpl: Ext.create('Ext.XTemplate', '<tpl for=".">{name} dpi</tpl>'),
					tpl: '<tpl for="."><li role="option" class="x-boundlist-item">{name} dpi</li></tpl>',
					typeAhead: true,
					queryMode: "local",
					triggerAction: "all",
					plugins: Ext.create('GeoExt.plugins.PrintProviderField', {
						printProvider: printProvider
					})
				}, {
					xtype: "combo",
					store: printProvider.scales,
					displayField: "name",
					fieldLabel: "Scale",
					typeAhead: true,
					queryMode: "local",
					triggerAction: "all",
					plugins: Ext.create('GeoExt.plugins.PrintPageField',{
						printPage: printPage
					})
				}, {
					xtype: "textfield",
					name: "rotation",
					fieldLabel: "Rotation",
					plugins: Ext.create('GeoExt.plugins.PrintPageField',{
						printPage: printPage
					})
				}],
				buttons: [{
					text: "Create PDF",
					handler: function() {
							printProvider.print(mapPanel, printPage);
					}
				}],
				listeners:{
					 'close':function(winPrint){
						  // pageLayer.destroyFeatures()
							var mLayers = mapPanel.map.layers;
							for(var a = 0; a < mLayers.length; a++ ){
								if(mLayers[a].name=='print'){
									mapPanel.map.removeLayer(mLayers[a]); 
									}
							}							  
						  
					  }

				}						
				
			})
			
			winPrint.show(); 
		}

		}); // print bton


*/		
		toolbarItems.push(Ext.create('Ext.button.Button', ctrl_zoomBox));		
		toolbarItems.push(Ext.create('Ext.button.Button', selectControl));
		
		// Ext.getCmp('toolbarID').add(medirDistancia);	
		// Ext.getCmp('toolbarID').add({xtype: 'tbfill'});
		Ext.getCmp('toolbarID').add(Ext.create('Ext.button.Button', medirDistancia));
		Ext.getCmp('toolbarID').add(btonZooExtent);	
		Ext.getCmp('toolbarID').add(toolbarItems);	
		Ext.getCmp('toolbarID').add(bton_down);	
		Ext.getCmp('toolbarID').add(btonIdentify);	
		Ext.getCmp('toolbarID').add(
			{
				xtype: "gx_geocodercombo",
				layer: locationLayer,
				width: 200,
			}
		)
		// Ext.getCmp('toolbarID').add(Ext.create('Ext.button.Button', printBton));
		
// #############################################################	'


var tabCount = 4;
// Ext.tip.QuickTipManager.init();

		var tabsPanel = Ext.create('Ext.panel.Panel', {
				width: mainPanelWidth,
				//height: 100,
				scrollable: true,
				// layout: {
					// type: 'border',
					// padding: 3
				// },
				items: {
					xtype: 'tabpanel',
					activeTab: 0,
					scrollable: true,
					itemId: 'tabPanel',
					plugins: [{
						ptype: 'tabscrollermenu',
						maxText  : 15,
						pageSize : 3
					},Ext.create('Ext.ux.TabReorderer')],
					items: [tabs
						// {title: 'First tab',
						// html: 'Creating more tabs...'
						// }					
					
					]
				},
				dockedItems: {
					dock: 'bottom',
					xtype: 'toolbar',
					items: [{
						text : 'Add an item',
						handler: function() {
							tabPanel = tabsPanel.getComponent('tabPanel');
							tabCount++;
							tabPanel.add({
								xtype: 'panel',
								title: 'Tab ' + tabCount,
								html : 'Content for tab ' + tabCount,
								closable: true
							});
						}
					}, {
						text: 'Toggle tabs enabled',
						handler: function() {
							tabPanel = tabsPanel.getComponent('tabPanel');
							tabPanel.tabBar.items.each(function(tab) {
								if (tab.disabled) {
									tab.enable();
								} else {
									tab.disable();
								}
							});
						}
					}, {
						text: 'Remove 2nd item',
						handler: function() {
							tabPanel = tabsPanel.getComponent('tabPanel');
							var item = tabPanel.items.items[1];

							if (item) {
								tabPanel.remove(item);
							}
						}
					}]
				}				
		})	
	
	
     // var tabLimit = 12,
    // tabPanel = tabsPanel.getComponent('tabPanel');

    // Ext.defer(function (num) {
        // var i,
            // title,
            // tabs = [];
        // for (i = 1; i <= tabLimit; i++) {
            // title = 'Tab # ' + i;
            // tabs.push({
                // title: title,
                // html: 'Hi, I am tab ' + i,
                // tabTip: title,
                // closable: true
            // });
        // }
        // tabPanel.add(tabs);
        // tabPanel.getComponent(0).body.update('Done!');
    // }, 100);		
		
    // var tabsPanel = Ext.create('Ext.tab.Panel', {
        // renderTo: Ext.getBody(),
        // width: mainPanelWidth,
        // height: '60%',
        // bodyStyle: 'padding:5px',
			// layout: {
				// type: 'border',
				// padding: 3
			// },		
		// plugins: [{
			// ptype: 'tabscrollermenu',
			// maxText  : 15,
			// pageSize : 5
		// },Ext.create('Ext.ux.TabReorderer')],
        // items: [{
            // xtype: 'panel',
            // title: 'Tab 1',
            // html : 'Test 1',
            // closable: false,
			// items:[tabs,mapPanel]
        // }, {
            // xtype: 'panel',
            // title: 'Tab 2',
            // html : 'Test 2',
            // closable: true
        // }]
	// })		
		 mainPanel=Ext.create('Ext.panel.Panel', {
			id:'mainpanelID',
			width: mainPanelWidth,
			scrollable: true,
			cls: 'css_labels',
			height: mainPanelHeight,
			title: 'Data',
			border:false,
			layout: {
				type: 'border',
				padding: 3
			},
			defaults: {
				split: true
			},
			tools: [
				{xtype: 'tbfill'},
				{
					icon   : icons+'buttons/login24.png',
					tooltip: 'Login',
					scale: 'medium',
					cls:"toolLogin",
					handler: function(){
						console.log("ghghg")
					}
				
				}		
				// {
					// type: 'maximize',
					// tooltip: 'Agrandir la fenêtre',
					// handler: function (e, target, panelHdr) {
						// var panel = panelHdr.up('panel');
						// if (!panel.maximized) {

							// panel.restoreSize = panel.getSize();
							// panel.restorePos = panel.getPosition(true);
							// panel.maximized = true;
							// var parent = panel.ownerCt,
								// container = parent ? parent.getTargetEl() : panel.container,
								// newBox = container.getViewSize(false);
							// panel.setBox(newBox);
						// } else {
							// var newBox = panel.restoreSize;
							// newBox.x = panel.restorePos[0];
							// newBox.y = panel.restorePos[1];
							// panel.maximized = false;
							// panel.setBox(newBox);
						// }
					// }
				// }
			],			
			header: {
				titlePosition: 1,
				titleAlign: 'left',
				height: 36,
				//cls: 'tabpanel-header'
			},			
			items: [tabs,mapPanel,
			{
				region: 'south',
				// cls: 'my-header',
				id:'mainTableID',
				header : Ext.create('Ext.panel.Header', {
					height : 500
				}),		
			// collapseDirection: 'bottom',
				collapseMode: "mini",
				// margins:'3 1 0 5',
				collapsible: true,
				collapsed: true,
				layout: 'fit',

				// title: 'Query height 40%',
				// split: true,
				// height: 273,//mainPanelHeight*0.4,//'40%',
				maxHeight: mainPanelHeight*0.4,
				// minWidth: 100,
				// minHeight: 140,
				// bodyPadding: 10,
				// stateId: 'westRegion',
				// stateful: true,
				// items: [],
/*				listeners:{
					beforerender: function(component, eOpts){

					},	
					beforeexpand:function(node, event){
						// Ext.getCmp('gridRegionID').getView().on('expandbody', function(rowNode, record, expandbody){
							// Ext.getCmp('gridRegionID').maxHeight=Ext.getCmp('mainTableID').height
							// Ext.getCmp('gridRegionID').getView().refresh();
							// console.log(Ext.getCmp('gridRegionID').maxHeight,Ext.getCmp('mainTableID').height);
						// });	
					},
					resize: {
					  fn: function(el) {
						tablePanelH=mainPanelHeight*0.4
						tableH=el.height
						
						if(el.height){
							var row = Ext.getCmp('gridRegionID').getView().getNode(0);
							var height = Ext.get(row).getHeight();
							numRecords=(Ext.getCmp('gridRegionID').down('#numRecords').text).replace( /^\D+/g, '')
							maxGrid=numRecords*height+250	
							if(tablePanelH<tableH){
								maxGrid=maxGrid*2
							}							
							if(tablePanelH>maxGrid){
								Ext.getCmp('mainTableID').height=maxGrid
								Ext.getCmp('mainpanelID').doLayout();	
							}else{
								Ext.getCmp('gridRegionID').maxHeight=tableH+60
							}
							Ext.getCmp('gridRegionID').getView().refresh();
							console.log('maxGrid:',maxGrid,'resize:',tableH,'tablePanelH static:',tablePanelH,'gridRegionID:',Ext.getCmp('gridRegionID').maxHeight)


						}

						
					  }
					},
				}				
*/
			}

			],
			renderTo: Ext.getBody() //Ext.getElementById("geomap")
		});
    }
});

