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
    'GeoExt.panel.Legend',
    'Ext.grid.plugin.BufferedRenderer',
    'Ext.ux.form.SearchField'

]);


var mapPanel, tree;

// para eliminar seciones cuando se refresca
function checkFirstVisit() {
  if(document.cookie.indexOf('mycookie')==-1) {
	document.cookie = 'mycookie=1';
  }
  else {
	Ext.Ajax.request({
		url: 'php/Geo_statByregion-test.php',
		method: 'POST',
		params : {type:24},
		success: function(response, opts) {
		},
		failure: function(response, opts) {

		}
	});
  }
}
	

Ext.application({
    name: 'Tree',
    launch: function() {

		mapHeight=400	
		mapWidth=500	
		tabsHeight= 600
		MaxFileDownload=150
		
		var heightDiv = $("#geomap").height();
		var widthDiv = $("#geomap").width();

		mainPanelHeight=650//Ext.getBody().getViewSize().height//*0.7//800	heightDiv//
		mainPanelWidth= 836//Ext.getBody().getViewSize().width//*0.5 //1000 widthDiv//		
		tabsWidth= mainPanelWidth*0.37
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

// para quitar loadmask	cuando se traba	
Ext.override(Ext.grid.GridPanel, {
	reconfigure : function(store, colModel){
		if(this.loadMask && this.loadMask.store){
			this.loadMask.destroy();
			this.loadMask = new Ext.LoadMask(this.bwrap,
				Ext.apply({}, {store:store}, this.initialConfig.loadMask));
		}
		this.view.initData(store, colModel);
		this.store = store;
		this.colModel = colModel;
		if(this.rendered){
			this.view.refresh(true);
		}
	}
});	


/*===================== PARA CONVERTIR COORDENADAS DECIMALES A DSM BICEVERSA =======================*/
 function ConvertDMSToDD(degrees, minutes, seconds) {
 		if(degrees<0){degrees=degrees*-1;dir=-1}else{dir=1}
    var dd = degrees + minutes/60 + seconds/(60*60);
        dd = dd*dir;
    return dd;
}  
function ConvertDDToDMS(D){
    return [0|D, 0|(D<0?D=-D:D)%1*60, 0|D*60%1*60];
}
/*============================*/
	
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

		toolip_groupByRegion='Find weather stations by region. To clear the map, use the reset button'
		toolip_groupByStation='Find weather stations by name'
		toolip_groupByQuery='Find weather stations with a custom search. Add as many conditions as needed'		
		toolip_groupSlider='Change number of stations per cluster'		
		toolip_groupLegendIMG='Legend by data source'		
		toolip_groupLabels='Change weather station labels'		
		toolip_groupLayers='Base layers of map. Select a layer by clicking the radio button'		
		toolip_fieldsetLogin='According to the terms of use, some stations are restricted for unauthorized users'		
		toolip_chirpsWcl='Datasets: Chirps and Chirp (Daily Precipitation) ~5km grid resolution.  WorldClim V2 (Rain, Tmin, Tmax. Climatology ) ~1km grid resolution. CRU V4 (Rain, Tmin, Tmax. Monthly) ~50km grid resolution.'		

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
					// return false; // si se activa no sirve para ocultar los layers
				} else {
					return this.callParent([record, row, rowIndex, e]);
				}
			}
		});
			
		mapPanel = Ext.create('GeoExt.panel.Map', {
			id: 'mapPanelID',
            border: true,
			columnWidth: 1,
            region: "center",
            // we do not want all overlays, to try the OverlayLayerContainer
            height: '60%',
            // width: 300,			
            map: {allOverlays: false,numZoomLevels: 20,//controls: [],
				projection: WGS84_google_mercator,
				displayProjection: WGS84		
			},
            center: [-76, 3],
            zoom: 6,
			//items: [tabs],
            layers: [
				// new OpenLayers.Layer.OSM("OSM"),
				clusters,
				// new OpenLayers.Layer.Google(
							// "Google Hybrid",
							// {type: google.maps.MapTypeId.HYBRID}
						// ),				
				
				// new OpenLayers.Layer.Google(
							// "Google Physical",
							// {type: google.maps.MapTypeId.TERRAIN}
						// ),			
				// new OpenLayers.Layer.Google(
							// "Google Streets",
							// {type: google.maps.MapTypeId.STREETS}
						// )		
				// gphy,ghyb,
                new OpenLayers.Layer.WMS("Streets Map",
                    "http://ows.terrestris.de/osm/service?",
                    {layers: 'OSM-WMS'}
                    // ,{
                        // attribution: '&copy; terrestris GmbH & Co. KG <br>' +
                            // 'Data &copy; OpenStreetMap ' +
                            // '<a href="http://www.openstreetmap.org/copyright/en"' +
                            // 'target="_blank">contributors<a>'
                    // }
                )				
                // new OpenLayers.Layer.WMS("Global Imagery",
                    // "http://maps.opengeo.org/geowebcache/service/wms", {
                        // layers: "bluemarble",
                        // format: "image/png8"
                    // }, {
                        // buffer: 0,
                        // visibility: false
                    // }
                // ),
				//gsat,
				

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
				//style: "background-color: transparent;width: 140px !important;margin-left: 50px;",//opacity: .6;transparent,;margin-left: 75%
                dock: 'top',
				// layoutConfig : {
					// align : 'stretch'
				// },
				// defaults : {
					// flex : 3  
				// }				
            }]			
        });

//===============================================================================================================
	mapPanel.map.addLayer(layerTempRegion);
	mapPanel.map.addLayer(layerTempStat);
	
	// este no esta en uso
	var bton_login = new Ext.Button({	
		text:'Login',
		icon   : icons+'buttons/login16.png',//'buttons/login24.png',
		width:70,
		height:22,
		id:'btonLoginId',
		tooltip: 'Login',
		// scale: 'small',
		// cls:"toolLogin",
		handler: function(){
			var login = Ext.create('Ext.FormPanel', {
				// url:'php/Login.php', 
				// id:'formLoginId',
				bodyPadding: 5,
				cls: 'css_labels',
				frame:true, 
				// title:'Please Login', 
				defaultType:'textfield',
				monitorValid:true,

				items:[{ 
						fieldLabel:'Login', 
						name:'login', 
						id:'login', 
						labelWidth:60,
						allowBlank:false,
						minLength: 4, maxLength: 32
					},{ 
						fieldLabel:'Password', 
						name:'password', 
						id:'password', 
						inputType:'password', 
						labelWidth:60,
						allowBlank:false, minLength: 4,
						maxLength: 32, minLengthText: 'Password must be at least 4 characters long.' 
					}],

					buttons:[
						{
							text:'Sign Up',
							overCls : 'my-over',
							scale: 'small',
							handler:function(){
								/*
								var simple = Ext.widget({
									xtype: 'form',
									layout: 'form',
									collapsible: true,
									id: 'simpleForm',
									url: 'save-form.php',
									frame: true,
									title: 'Simple Form',
									bodyPadding: '5 5 0',
									width: 350,
									fieldDefaults: {
										msgTarget: 'side',
										labelWidth: 75
									},
									plugins: {
										ptype: 'datatip'
									},
									defaultType: 'textfield',
									items: [{
										fieldLabel: 'First Name',
										afterLabelTextTpl: required,
										name: 'first',
										allowBlank: false,
										tooltip: 'Enter your first name'
									},{
										fieldLabel: 'Last Name',
										afterLabelTextTpl: required,
										name: 'last',
										allowBlank: false,
										tooltip: 'Enter your last name'
									},{
										fieldLabel: 'Company',
										name: 'company',
										tooltip: "Enter your employer's name"
									}, {
										fieldLabel: 'Email',
										afterLabelTextTpl: required,
										name: 'email',
										allowBlank: false,
										vtype:'email',
										tooltip: 'Enter your email address'
									}, {
										fieldLabel: 'DOB',
										name: 'dob',
										xtype: 'datefield',
										tooltip: 'Enter your date of birth'
									}, {
										fieldLabel: 'Age',
										name: 'age',
										xtype: 'numberfield',
										minValue: 0,
										maxValue: 100,
										tooltip: 'Enter your age'
									}, {
										xtype: 'timefield',
										fieldLabel: 'Time',
										name: 'time',
										minValue: '8:00am',
										maxValue: '6:00pm',
										tooltip: 'Enter a time',
										plugins: {
											ptype: 'datatip',
											tpl: 'Select time {date:date("G:i")}'
										}
									}],

									buttons: [{
										text: 'Save',
										handler: function() {
											this.up('form').getForm().isValid();
										}
									},{
										text: 'Cancel',
										handler: function() {
											this.up('form').getForm().reset();
										}
									}]
								});										
								*/
								Ext.getCmp('ventana_loginID').destroy();
								
								var formPanel = Ext.widget('form', {
									// renderTo: Ext.getBody(),
									frame: true,
									width: 350,
									labelWidth:260,
									bodyPadding: 10,
									bodyBorder: true,
									// title: 'Account Registration',
							 
									defaults: {
										anchor: '100%'
									},
									fieldDefaults: {
										labelAlign: 'left',
										msgTarget: 'none',
										invalidCls: '' //unset the invalidCls so individual fields do not get styled as invalid
									},
							 
									/*
									 * Listen for validity change on the entire form and update the combined error icon
									 */
									listeners: {
										fieldvaliditychange: function() {
											this.updateErrorState();
										},
										fielderrorchange: function() {
											this.updateErrorState();
										}
									},
							 
									updateErrorState: function() {
										var me = this,
											errorCmp, fields, errors;
							 
										if (me.hasBeenDirty || me.getForm().isDirty()) { //prevents showing global error when form first loads
											errorCmp = me.down('#formErrorState');
											fields = me.getForm().getFields();
											errors = [];
											fields.each(function(field) {
												Ext.Array.forEach(field.getErrors(), function(error) {
													errors.push({name: field.getFieldLabel(), error: error});
												});
											});
											errorCmp.setErrors(errors);
											me.hasBeenDirty = true;
										}
									},
							 
									items: [{
										xtype: 'textfield',
										name: 'username',
										fieldLabel: 'User Name',
										allowBlank: false,
										minLength: 6
									}, {
										xtype: 'textfield',
										name: 'email',
										fieldLabel: 'Email Address',
										vtype: 'email',
										allowBlank: false
									}, {
										xtype: 'textfield',
										name: 'password1',
										fieldLabel: 'Password',
										inputType: 'password',
										style: 'margin-top:15px',
										allowBlank: false,
										minLength: 8
									}, {
										xtype: 'textfield',
										name: 'password2',
										fieldLabel: 'Repeat Password',
										inputType: 'password',
										allowBlank: false,
										/**
										 * Custom validator implementation - checks that the value matches what was entered into
										 * the password1 field.
										 */
										validator: function(value) {
											var password1 = this.previousSibling('[name=password1]');
											return (value === password1.getValue()) ? true : 'Passwords do not match.'
										}
									},
							 
									/*
									 * Terms of Use acceptance checkbox. Two things are special about this:
									 * 1) The boxLabel contains a HTML link to the Terms of Use page; a special click listener opens this
									 *    page in a modal Ext window for convenient viewing, and the Decline and Accept buttons in the window
									 *    update the checkbox's state automatically.
									 * 2) This checkbox is required, i.e. the form will not be able to be submitted unless the user has
									 *    checked the box. Ext does not have this type of validation built in for checkboxes, so we add a
									 *    custom getErrors method implementation.
									 */
									{
										/*xtype: 'checkboxfield',
										name: 'acceptTerms',
										fieldLabel: 'Terms of Use',
										hideLabel: true,
										style: 'margin-top:15px',
										boxLabel: 'I have read and accept the <a href="http://www.sencha.com/legal/terms-of-use/" class="terms">Terms of Use</a>.',
							 
										// Listener to open the Terms of Use page link in a modal window
										listeners: {
											click: {
												element: 'boxLabelEl',
												fn: function(e) {
													var target = e.getTarget('.terms'),
														win;
													if (target) {
														win = Ext.widget('window', {
															title: 'Terms of Use',
															modal: true,
															html: '<iframe src="' + target.href + '" width="950" height="500" style="border:0"></iframe>',
															buttons: [{
																text: 'Decline',
																handler: function() {
																	this.up('window').close();
																	formPanel.down('[name=acceptTerms]').setValue(false);
																}
															}, {
																text: 'Accept',
																handler: function() {
																	this.up('window').close();
																	formPanel.down('[name=acceptTerms]').setValue(true);
																}
															}]
														});
														win.show();
														e.preventDefault();
													}
												}
											}
										},
							 
										// Custom validation logic - requires the checkbox to be checked
										getErrors: function() {
											return this.getValue() ? [] : ['You must accept the Terms of Use']
										}*/
									}],
							 
									dockedItems: [{
										xtype: 'container',
										dock: 'bottom',
										layout: {
											type: 'hbox',
											align: 'middle'
										},
										padding: '10 10 5',
							 
										items: [{
											xtype: 'component',
											id: 'formErrorState',
											baseCls: 'form-error-state',
											flex: 1,
											validText: 'Form is valid',
											invalidText: 'Form has errors',
											tipTpl: Ext.create('Ext.XTemplate', '<ul><tpl for="."><li><span class="field-name">{name}</span>: <span class="error">{error}</span></li></tpl></ul>'),
							 
											getTip: function() {
												var tip = this.tip;
												if (!tip) {
													tip = this.tip = Ext.widget('tooltip', {
														target: this.el,
														title: 'Error Details:',
														autoHide: false,
														anchor: 'top',
														mouseOffset: [-11, -2],
														closable: true,
														constrainPosition: false,
														cls: 'errors-tip'
													});
													tip.show();
												}
												return tip;
											},
							 
											setErrors: function(errors) {
												var me = this,
													baseCls = me.baseCls,
													tip = me.getTip();
							 
												errors = Ext.Array.from(errors);
							 
												// Update CSS class and tooltip content
												if (errors.length) {
													me.addCls(baseCls + '-invalid');
													me.removeCls(baseCls + '-valid');
													me.update(me.invalidText);
													tip.setDisabled(false);
													tip.update(me.tipTpl.apply(errors));
												} else {
													me.addCls(baseCls + '-valid');
													me.removeCls(baseCls + '-invalid');
													me.update(me.validText);
													tip.setDisabled(true);
													tip.hide();
												}
											}
										}, {
											xtype: 'button',
											formBind: true,
											disabled: true,
											text: 'Submit Registration',
											width: 140,
											handler: function() {
												var form = this.up('form').getForm();
												
												if (form.isValid()) {
													username=form.getValues().username
													email=form.getValues().email
													password1=form.getValues().password1
													password2=form.getValues().password2
													acceptTerms=form.getValues().acceptTerms
													
													// console.log(username)
													
													Ext.Ajax.request({
														url: 'php/Geo_statByregion-test.php',
														method: 'POST',
														params : {type:25,login:username, password: password1,confirm:password2,email:email,name:"real nombre",info:""},
														success: function(response, opts) {
															resul=response.responseText
															// if(resul.split("\n")[1]=="OK"){
															// console.log(resul)
															if(resul=="OK"){
																// Ext.getCmp('btonLoginId').setText('Logout');
																// ventana_login.hide();
																// ventana_login.destroy();
																// Ext.Msg.alert('OK',"Please check your e-mail and follow the instructions."); 
																winInfo=Ext.MessageBox.show({
																   title: 'Information',
																   msg: 'Please check your e-mail and follow the instructions.',
																   width:300,
																   buttons: Ext.MessageBox.OK,
																   animateTarget: 'info',
																   icon: 'x-message-box-info'
																});	
																winInfo.setPosition(mainPanelWidth/3,mainPanelHeight/2);																			
																
															}else{
																// Ext.Msg.alert('Login Failed!',"Sorry, a user with this login and/or e-mail address already exist."); 
																winInfo=Ext.MessageBox.show({
																   title: 'Information',
																   msg: 'Sorry, a user with this login and/or e-mail address already exist.',
																   width:300,
																   buttons: Ext.MessageBox.OK,
																   animateTarget: 'error',
																   icon: 'x-message-box-error'
																});	
																winInfo.setPosition(mainPanelWidth/3,mainPanelHeight/2);																			
															}
														},
														failure: function(response, opts) {
															var responseText = (response.responseText ? response.responseText : 'Unable to contact the server.  Please try again later.');
															panelLaunch({
																iconClass: 'x-panel-action-icon-tick',
																position: 'br',
																actionMethod: ['hide']
															}, responseText);
														},
														scope: this
													});																
													
													/* Normally we would submit the form to the server here and handle the response...
													form.submit({
														clientValidation: true,
														url: 'register.php',
														success: function(form, action) {
														   //...
														},
														failure: function(form, action) {
															//...
														}
													});
													*/
							 
												
													// Ext.Msg.alert('Submitted Values', form.getValues(true));
												}
											}
										}]
									}]
								});
									
								var Register = new Ext.Window({
									iconCls: 'key',
									title: 'Account Registration',
									style: "font-family: 'Oswald', sans-serif;font-size: 14px;",
									constrainHeader: true,
									collapsible: true,
									resizable: false,
									frame:true, 
									width: 350,
									height: 280,
									layout: 'fit', //fit
									plain: true,
									bodyStyle: 'padding:5px;',
									buttonAlign: 'center',
									x:mainPanelWidth/2,
									y:mainPanelHeight/4,									
									items: [formPanel]							
								}); // fin windows											
								Register.show();
							} 									
						},
						{ 
								// iconCls: 'key-go',
								text:' Submit',
								overCls : 'my-over',
								formBind: true,	 
								// icon: icons+'key-go-icon.png', 
								scale: 'small',
								// listeners : {
									// click: function(button,event) {
										// Ext.getCmp('btonLoginId').setText('Hide');
									// }
								// },										
								handler:function(){ 
										Ext.Ajax.request({
											url: 'php/Geo_statByregion-test.php',
											method: 'POST',
											params : {type:23,login:Ext.getCmp('login').getValue(), password: Ext.getCmp('password').getValue()},
											success: function(response, opts) {
												resul=response.responseText
												
												// if(resul.split("\n")[1]=="OK"){
												if(resul=="OK"){
													Ext.getCmp('btonLoginId').setText('Logout');
													// ventana_login.hide();
													ventana_login.destroy();
												}else if(resul==10){
													winInfo=Ext.MessageBox.show({
													   title: 'Warning',
													   msg: 'Login and/or password did not match to the database.',
													   width:300,
													   buttons: Ext.MessageBox.OK,
													   animateTarget: 'warning',
													   icon: 'x-message-box-warning'
													});	
													winInfo.setPosition(mainPanelWidth/3,mainPanelHeight/2);															
												
												}else{
													winInfo=Ext.MessageBox.show({
													   title: 'Warning',
													   msg: 'Not stations found!',
													   width:300,
													   buttons: Ext.MessageBox.OK,
													   animateTarget: 'warning',
													   icon: 'x-message-box-warning'
													});	
													winInfo.setPosition(mainPanelWidth/3,mainPanelHeight/2);

												}
											},
											failure: function(response, opts) {
												var responseText = (response.responseText ? response.responseText : 'Unable to contact the server.  Please try again later.');
												panelLaunch({
													iconClass: 'x-panel-action-icon-tick',
													position: 'br',
													actionMethod: ['hide']
												}, responseText);
											},
											scope: this
										});										
								/*
									login.getForm().submit({ 
										method:'GET',//'POST', 
										waitTitle:'Connecting', 
										waitMsg:'Sending data...',
										processResponse : function(response){
											this.response = response;
											if(!response.responseText){
											return true;
											}
											this.result = this.handleResponse(response);

											// so right here you could reassign the properties:
											this.result.success = this.result.exito;//"exito";//
											this.result.errors = "error"//this.result.yourErrorsProperty;
											// this.result.failure = "error"//this.result.yourErrorsProperty;
											// this.result.data = this.result.yourDataProperty;
											return this.result;
										},			 
										success:function(){ 
											// Ext.Msg.alert('Status', 'Login Successful!', function(btn, text){
												// if (btn == 'ok'){

													// selectFeature.enable();
													// printBton.enable();
													// bton_worldclim.enable();
													// help.enable();

													// Ext.getCmp('panel_uno').setDisabled(false);
													// Ext.getCmp('panel_dos').setDisabled(false);
													// Ext.getCmp('panel_tres').setDisabled(false);
													// Ext.getCmp('panel_cuatro').setDisabled(false);
													// Ext.getCmp('stationCmb').setDisabled(true);
													// Ext.getCmp('stateCmb').setDisabled(true);
													// Ext.getCmp('munCmb').setDisabled(true);
													// Ext.getCmp('watershedCmb').setDisabled(true);
													// Ext.getCmp('sdate').setDisabled(true);
													// Ext.getCmp('edate').setDisabled(true);
													
														
												// }
											// });
											ventana_login.hide();
										},
				 
										failure:function(form, action){ 
											if(action.failureType == 'server'){ 
												// obj = Ext.util.JSON.decode(action.response.responseText); 
												// Ext.Msg.alert('Login Failed!', obj.errors.reason); 
												Ext.Msg.alert('Login Failed!'); 
											}else{ 
												Ext.Msg.alert('Warning!', 'Authentication server is unreachable : ' + action.response.responseText); 
											} 
											login.getForm().reset(); 
										} 
									}); */
						} 
					}] 
		   });
		   
			btonLog=Ext.getCmp('btonLoginId').text
			
			var ventana_login = new Ext.Window({
				iconCls: 'key',
				title: 'Login',
				id:'ventana_loginID',
				style: "font-family: 'Oswald', sans-serif;font-size: 14px;",
				constrainHeader: true,
				collapsible: true,
				resizable: false,
				frame:true, 
				width: 250,
				height: 150,
				layout: 'fit', //fit
				plain: true,
				bodyStyle: 'padding:5px;',
				buttonAlign: 'center',
				x:mainPanelWidth/2,
				y:mainPanelHeight/3,									
				items: [login]							
			}); // fin windows
				
			if(btonLog=="Login"){		
				ventana_login.show();
			}else{
				Ext.Ajax.request({
					url: 'php/Geo_statByregion-test.php',
					method: 'POST',
					params : {type:24},
					success: function(response, opts) {
						resul=response.responseText
						Ext.getCmp('btonLoginId').setText('Login');
						ventana_login.hide();
					},
					failure: function(response, opts) {
						var responseText = (response.responseText ? response.responseText : 'Unable to contact the server.  Please try again later.');
						panelLaunch({
							iconClass: 'x-panel-action-icon-tick',
							position: 'br',
							actionMethod: ['hide']
						}, responseText);
					},
					scope: this
				});						
			
			}
		   
		}// fin handler
	})

//===============================================================================================================
		
		
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
			url: 'php/Geo_statByregion-test.php',
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
			{ name: 'copyrigth', type: 'integer' },
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
		},
		 filter: function(filters, value) {
				Ext.data.Store.prototype.filter.apply(this, [
					filters,
					value ? new RegExp(Ext.String.escapeRegex(value), 'i') : value
				]);
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
		// enableRegEx: true,
		// anyMatch: true, 
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
		},
		 filter: function(filters, value) {
				Ext.data.Store.prototype.filter.apply(this, [
					filters,
					value ? new RegExp(Ext.String.escapeRegex(value), 'i') : value
				]);
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
		disabled: true,
		enableRegEx: true

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
				{ name: 'suspension', type: 'string' },
				{ name: 'quality', type: 'string' },
				{ name: 'model', type: 'string' },
				{ name: 'variables', type: 'string' },
				{ name: 'lon', type: 'string' },
				{ name: 'lat', type: 'string' },
				{ name: 'elev', type: 'string' },
				{ name: 'country', type: 'string' },
				{ name: 'state', type: 'string' },
				{ name: 'city', type: 'string' },
				{ name: 'copyright', type: 'string' },
				{ name: 'ctrl_quali_var', type: 'string' }

				// { name: 'id',mapping: 'id', type: 'string' },
				// { name: 'code',mapping: 'code', type: 'string' },
				// { name: 'name',mapping: 'name', type: 'string' },
				// { name: 'category',mapping: 'category', type: 'string' },
				// { name: 'institute',mapping: 'institute', type: 'string' },
				// { name: 'instalation',mapping: 'instalation', type: 'string' },
				// { name: 'suspension',mapping: 'suspension', type: 'string' },
				// { name: 'quality',mapping: 'quality', type: 'string' },
				// { name: 'model',mapping: 'model', type: 'string' },
				// { name: 'variables',mapping: 'variables', type: 'string' },
				// { name: 'lon',mapping: 'lon', type: 'string' },
				// { name: 'lat',mapping: 'lat', type: 'string' },
				// { name: 'elev',mapping: 'elev', type: 'string' },
				// { name: 'country',mapping: 'country', type: 'string' },
				// { name: 'state',mapping: 'state', type: 'string' },
				// { name: 'city',mapping: 'city', type: 'string' },
				// { name: 'copyright',mapping: 'copyright', type: 'string' },
				// { name: 'ctrl_quali_var',mapping: 'ctrl_quali_var', type: 'string' }				
				
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
		Ext.define('modelQC', { 
				extend: 'Ext.data.Model',
				fields: [
					{ name: 'name', type: 'string' },
					{ name: 'description', type: 'string' }
				]
			});			
		Ext.define('modelStatistic', { 
			extend: 'Ext.data.Model',
			fields: [
				{ name: 'idstat', type: 'integer' },
				{ name: 'code', type: 'string' },
				{ name: 'name', type: 'string' },
				{ name: 'date_start', type: 'string' },
				{ name: 'date_end', type: 'string' },
				{ name: 'var', type: 'string' },
				{ name: 'quality', type: 'string' },
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
			layerTemp=mapPanel.map.getLayersByName("Search station")[0]
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
			if(Ext.getCmp('gridRegionID_1')){
				var selection = Ext.getCmp('gridRegionID_1').getView().getSelectionModel().getSelection();//[0];
			}

			selgrid=new Array()
			for(var i = 0; i < selection.length; i++) {
				selgrid.push(Number(selection[i].data.id));
			}
			
			selgrid=Ext.encode(selgrid)
			varList="ALL"//Ext.encode(cmbVar.getValue())

			var statisticStore = Ext.create('Ext.data.Store', {
				model: 'modelStatistic',
				autoLoad: true,
				// autoSync: true,
				sorters: { property: 'name', direction : 'ASC' },
				proxy: {
					type: 'ajax',
					url: 'php/statistics.php',
					extraParams: {stations : selgrid, variable:varList},
					actionMethods: {
						read: 'POST'
					},					
					reader: {
						type: 'json',
						root: 'topics'
					}
				}
			});	
			btonReturn= new Ext.Button({
				pressedCls : 'my-pressed',
				overCls : 'my-over',
				tooltip: "Return to map",
				text:'Return to map',
				icon: icons+'map.png', 
				scale: 'small',
				handler: function(){
					tabs.setActiveTab(0);
				}													
			});			
			gridStatistic = Ext.create('Ext.grid.Panel', {
				id: 'gridStatisticID',
				border: true,
				// layout: 'fit',
				forceFit: true,
				cls:"gridStatisticCSS",
				store: statisticStore,
				maxHeight: mainPanelHeight*0.51,//360,//
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
					{ text: 'start date',minWidth: 80,dataIndex: 'date_start', flex: 2},
					{ text: 'end date',minWidth: 80,dataIndex: 'date_end', flex: 2},
					{ text: 'quality ctrl',minWidth: 70,dataIndex: 'quality', flex: 2},
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
				stripeRows: true,
				dockedItems: [{xtype: 'toolbar',items: [{xtype: 'tbfill'},btonReturn]}]
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
			// Ext.getCmp('gridStatisticID').maxHeight=mainPanelHeight*0.5;
			// console.log(mainPanelHeight*0.5)
			
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
				if(Ext.getCmp('gridStatisticID')){
					hesta=Ext.getCmp('statisticsID').getHeight()
					Ext.getCmp('gridStatisticID').maxHeight=hesta-16.4
					Ext.getCmp('statisticsID').doLayout();
				}
				
			}else{
				Ext.getCmp('tabsID').setHeight(0);
				Ext.getCmp('mapPanelID').setHeight(0);
				Ext.getCmp('mainTableID').maxHeight=mainPanelHeight-46;
				if(Ext.getCmp('gridRegionID_1')){
					Ext.getCmp('gridRegionID_1').maxHeight=mainPanelHeight;Ext.getCmp('gridRegionID_1').setHeight(mainPanelHeight);Ext.getCmp('mainTableID').setHeight(mainPanelHeight);Ext.getCmp('gridRegionID_1').getView().refresh();
				}else{Ext.getCmp('gridRegionID').maxHeight=mainPanelHeight;Ext.getCmp('mainTableID').setHeight(mainPanelHeight);Ext.getCmp('mainTableID').setHeight(mainPanelHeight);Ext.getCmp('gridRegionID').getView().refresh();}				
				
				
				
				Ext.getCmp('mainpanelID').doLayout();

				
				// console.log("fgfgf",Ext.getCmp('mainTableID').maxHeight,mainPanelHeight,Ext.getCmp('gridRegionID').maxHeight)
			}
			// var store = gridRegion.getStore();
			// var expander = gridRegion.plugins[0];
			// for(var i = 0; i < store.getCount(); i++) {
				// var record = store.getAt(i);
				// expanded=!expander.recordsExpanded[record.internalId]
				// if(expanded==false){
					// expander.toggleRow(i,gridRegion.store.getAt(i))
				// }
			// }				
		}

		

		function generateGraps(idSta, period,listVar,qc) {
			// var myMask = new Ext.LoadMask(Ext.getCmp('tabsID').getActiveTab(), {msg:"Please wait..."});
			$(".grap").html("");
			var myMask = new Ext.LoadMask(Ext.getCmp('tabsID'), {msg:"Please wait..."});
			// console.log(idSta, period,listVar)
			myMask.show();						
			  $.ajax({
				type: "POST",
			//    dataType: "json",
				url: "php/data-graphics.php",
				data: 'station='+idSta+'&period='+period+'&variable='+listVar+'&qc='+qc,//filterValues,
				success: function(result) {
				  var objJSON = {};
				  if (result != null) {
					objJSON = eval("(function(){return " + result + ";})()");
				  } else {

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
						labelPrec="mm/day"
					  seriesData = {
						name: 'Precipitation',
						data: data['prec']['data'],
						pointStart: Date.UTC(data['prec']['sdate'].split(' ')[0].split('-')[0], (parseInt(data['prec']['sdate'].split(' ')[0].split('-')[1]) - 1), parseInt(data['prec']['sdate'].split(' ')[0].split('-')[2])),
						pointInterval: 24 * 3600 * 1000
					  };
					} else if (period == 2) {
						labelPrec="mm/month"
					  for (var i = 0; i < dLen; i++) {
						data['prec']['data'][i] = [Date.UTC(data['prec']['sdate'].split(' ')[0].split('-')[0], (parseInt(data['prec']['sdate'].split(' ')[0].split('-')[1]) - 1 + i), 1), data['prec']['data'][i]];
					  }
					  seriesData = {
						name: 'Precipitation',
						data: data['prec']['data']
					  };
					} else if (period == 3) {
						labelPrec="mm/year"
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
						  text: 'Precipitation '+labelPrec
						}
					  },
					  tooltip: {
						valueSuffix: ' '+labelPrec,
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
				  if (data['srad']) {
					dLen = data['srad']['data'].length;

					if (period == 1) {
					  seriesData = {
						name: 'Sun bright',
						data: data['srad']['data'],
						pointStart: Date.UTC(data['srad']['sdate'].split(' ')[0].split('-')[0], (parseInt(data['srad']['sdate'].split(' ')[0].split('-')[1]) - 1), parseInt(data['srad']['sdate'].split(' ')[0].split('-')[2])),
						pointInterval: 24 * 3600 * 1000
					  };
					} else if (period == 2) {
					  for (var i = 0; i < dLen; i++) {
						data['srad']['data'][i] = [Date.UTC(data['srad']['sdate'].split(' ')[0].split('-')[0], (parseInt(data['srad']['sdate'].split(' ')[0].split('-')[1]) - 1 + i), 1), data['srad']['data'][i]];
					  }
					  seriesData = {
						name: 'Sun bright',
						data: data['srad']['data']
					  };
					} else if (period == 3) {
					  for (var i = 0; i < dLen; i++) {
						data['srad']['data'][i] = [Date.UTC((parseInt(data['srad']['sdate'].split(' ')[0].split('-')[0]) + i), (parseInt(data['srad']['sdate'].split(' ')[0].split('-')[1]) - 1), 1), data['srad']['data'][i]];
					  }
					  seriesData = {
						name: 'Sun bright',
						data: data['srad']['data']
					  };
					}
					$('#grap_srad_'+idSta).highcharts('StockChart',{
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
				
				},
				complete: function() {
					myMask.hide();
				}
			  });

		}// fin function generateGraps

		function generateGrapsChirps(lon, lat,yi,yf,mi,mf,period,ch_chirps,ch_chirp,ch_wcl,ch_cru) {
			// var myMask = new Ext.LoadMask(Ext.getCmp('tabsID').getActiveTab(), {msg:"Please wait..."});
			$(".grap").html("");
			idSta=1
			var myMask = new Ext.LoadMask(Ext.getCmp('tabsID'), {msg:"Please wait..."});
			// console.log(idSta, period,listVar)
			myMask.show();						
			  $.ajax({
				type: "GET",//"POST", //
			//    dataType: "json",
				// url: "php/data-graphics-chirps.php",
				url: "php/data-graphics-chirps.php",
				data: 'lon='+lon+'&lat='+lat+'&yi='+yi+'&yf='+yf+'&mi='+mi+'&mf='+mf+'&ch_chirps='+ch_chirps+'&ch_chirp='+ch_chirp+'&ch_wcl='+ch_wcl+'&ch_cru='+ch_cru,//filterValues,
				success: function(result) {
				  var objJSON = {};
				  if (result != null) {
					objJSON = eval("(function(){return " + result + ";})()");
				  } else {

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
					dLchirp = data['prchirp']['data'].length;
					dLenMon = data['monthly']['data'].length;
					dLencru_prec = data['cru_prec']['data'].length;
					dLencru_tmin = data['cru_tmin']['data'].length;
					dLencru_tmax = data['cru_tmax']['data'].length;
					dLenClim = data['clim']['data'].length;

					if (period == 1) {
					  seriesData = {
						name: 'CHIRPS',
						data: data['prec']['data'],
						pointStart: Date.UTC(data['prec']['sdate'].split(' ')[0].split('-')[0], (parseInt(data['prec']['sdate'].split(' ')[0].split('-')[1]) - 1), parseInt(data['prec']['sdate'].split(' ')[0].split('-')[2])),
						pointInterval: 24 * 3600 * 1000
					  };
					  
					  serieschirp = {
						name: 'CHIRP',
						data: data['prchirp']['data'],
						pointStart: Date.UTC(data['prchirp']['sdate'].split(' ')[0].split('-')[0], (parseInt(data['prchirp']['sdate'].split(' ')[0].split('-')[1]) - 1), parseInt(data['prchirp']['sdate'].split(' ')[0].split('-')[2])),
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
					
					//******************** monthly**********
					  for (var i = 0; i < dLenMon; i++) {
						data['monthly']['data'][i] = [Date.UTC(data['monthly']['sdate'].split(' ')[0].split('-')[0], (parseInt(data['monthly']['sdate'].split(' ')[0].split('-')[1]) - 1 + i), 1), data['monthly']['data'][i]];
					  }
					  // seriesDataMonthly = {
						  // name: 'Prec. Chirps',
						  // data: data['monthly']['data']
					  // }
					  seriesDataMonthly = {
							name: 'Prec. Chirps',
							type: 'column',
							yAxis: 1,
							data: data['monthly']['data'],
							tooltip: {
								valueSuffix: ' mm'
							}					  
					  };
					//******************** monthly CRU **********
					  for (var i = 0; i < dLencru_prec; i++) {
						data['cru_prec']['data'][i] = [Date.UTC(data['cru_prec']['sdate'].split(' ')[0].split('-')[0], (parseInt(data['cru_prec']['sdate'].split(' ')[0].split('-')[1]) - 1 + i), 1), data['cru_prec']['data'][i]];
					  }
					  serieCruPrec = {
						name: 'Prec. CRU',
						type: 'column',
						yAxis: 1,
						data: data['cru_prec']['data'],
						tooltip: {
							valueSuffix: ' mm'
						}						
					  };	
					  //tmin
					  for (var i = 0; i < dLencru_tmin; i++) {
						data['cru_tmin']['data'][i] = [Date.UTC(data['cru_tmin']['sdate'].split(' ')[0].split('-')[0], (parseInt(data['cru_tmin']['sdate'].split(' ')[0].split('-')[1]) - 1 + i), 1), data['cru_tmin']['data'][i]];
					  }
					  serieCruTmin = {
							name: 'Temp. Min (cru)',
							type: 'spline',	
							color:'orange',
							data: data['cru_tmin']['data'],
							tooltip: {
								valueSuffix: ' C'
							}						
					  };		

					  //tmax
					  for (var i = 0; i < dLencru_tmax; i++) {
						data['cru_tmax']['data'][i] = [Date.UTC(data['cru_tmax']['sdate'].split(' ')[0].split('-')[0], (parseInt(data['cru_tmax']['sdate'].split(' ')[0].split('-')[1]) - 1 + i), 1), data['cru_tmax']['data'][i]];
					  }
						serieCruTmax ={
							name: 'Temp. Max (wcl)',
							type: 'spline',
							color:'red',
							data: data['cru_tmax']['data'],//[7.5, 7.4, 9.8, 14.9, 18.7, 21.9, 25.6, 26.8, 23.9, 18.9, 14.7, 10],
							tooltip: {
								valueSuffix: ' C'
							}
						}					  
					//******************** rainy**********
					  for (var i = 0; i < dLenMon; i++) {
						data['rainy']['data'][i] = [Date.UTC(data['rainy']['sdate'].split(' ')[0].split('-')[0], (parseInt(data['rainy']['sdate'].split(' ')[0].split('-')[1]) - 1 + i), 1), data['rainy']['data'][i]];
					  }
					  seriesDataRainy = {
						name: 'Rainy',
						data: data['rainy']['data']
					  };
					  //******************** Wetdays **********
					  for (var i = 0; i < dLenMon; i++) {
						data['wetdays']['data'][i] = [Date.UTC(data['wetdays']['sdate'].split(' ')[0].split('-')[0], (parseInt(data['wetdays']['sdate'].split(' ')[0].split('-')[1]) - 1 + i), 1), data['wetdays']['data'][i]];
					  }
					  seriesDataWetdays = {
						name: 'wetdays',
						data: data['wetdays']['data']
					  };					  
					//************* climatology ***********
					var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
									'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
					categories_months=[]
					for (var i = 0; i < dLenClim; i++) {
						listmons=parseInt(data['monthly']['sdate'].split(' ')[0].split('-')[1])-1 + i
						categories_months.push(monthNames[listmons]);
					 }

					climData=data['clim']['data']					  
					Array.prototype.max = function() {
					  return Math.max.apply(null, this);
					};

					Array.prototype.min = function() {
					  return Math.min.apply(null, this);
					};
					var indexmax = climData.indexOf(climData.max());
					// var indexmin = climData.indexOf(climData.min());
					climData[indexmax] = {y: climData.max(),marker: {symbol: 'url(https://www.highcharts.com/samples/graphics/snow.png)'}}; //'url(https://www.highcharts.com/samples/graphics/sun.png)'
					// climData[indexmin] = {y: climData.min(),marker: {symbol: 'url(http://gisweb.ciat.cgiar.org/Bc_Downscale/img/sun.png)'}};
					
					//*******************
					if(data['database']['chirps']=="false" && data['database']['chirp']=="false"){
						$('#grap_prec_'+idSta).remove();
					}
					if(data['database']['chirps']=="false"){
						$('#grap_prec_annual_'+idSta).remove();
						$('#grap_rainy_'+idSta).remove();
						$('#grap_wetdays_'+idSta).remove();
						$('#index_boxplot').remove();
						$('#stats_chirps').remove();
					}
					if(data['database']['cru']=="false"){
						$('#grap_prec_mon_'+idSta).remove();
					}
					if(data['database']['wcl']=="false"){
						$('#grap_clim_wcl'+idSta).remove();
					}
					
					$('#grap_prec_'+idSta).highcharts('StockChart',{
					  chart: {
						type: 'spline',
						zoomType: 'x'
					  },
					  title: {
						text: 'Daily Precipitation'
					  },
					  xAxis: {
						type: 'datetime',
						labels: {
						  overflow: 'justify'
						}
					  },
					  yAxis: {
						title: {
						  text: 'Rainfall mm/day'
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
					  series: [seriesData,serieschirp]
					});
					//*********************************** monthly**********************************
					
					// $('#grap_prec_mon_'+idSta).highcharts('StockChart',{ # StockChart es para ver el rangeSelector
					  // chart: {
						// type: 'spline',
						// zoomType: 'xy'
					  // },
					  // title: {
						// text: 'Monthly Precipitation'
					  // },
					  // xAxis: {
						// type: 'datetime',
						// labels: {
						  // overflow: 'justify'
						// }
					  // },
					  // yAxis: {
						// title: {
						  // text: 'Rainfall mm/month'
						// }
					  // },
					  // tooltip: {
						// valueSuffix: ' mm/month',
						// valueDecimals: 2
					  // },
					  // plotOptions: {
						// series: {
						  // turboThreshold: 15000//larger threshold or set to 0 to disable
						// }
					  // },
					  // series: [seriesDataMonthly]

					// });	
					//*********************************** monthly V2 + CRU **********************************
					
					$('#grap_prec_mon_'+idSta).highcharts({
						chart: {
							zoomType: 'xy'
						},
						title: {
							text: 'Monthly Precipitation CHIRPS and CRU TS V4'
						},
						xAxis: {
							type: 'datetime',
							labels: {
							  overflow: 'justify'
							}
						},						
						yAxis: [{ // Primary yAxis
							labels: {
								format: '{value} C',
								style: {
									color: Highcharts.getOptions().colors[1]
								}
							},
							title: {
								text: 'Temperature',
								style: {
									color: Highcharts.getOptions().colors[1]
								}
							}
						}, { // Secondary yAxis
							title: {
								text: 'Rainfall',
								style: {
									color: Highcharts.getOptions().colors[0]
								}
							},
							labels: {
								format: '{value} mm',
								style: {
									color: Highcharts.getOptions().colors[0]
								}
							},
							opposite: true
						}],
						tooltip: {
							shared: true
						},
						legend: {
							layout: 'horizontal',
							align: 'left',
							x: 100,
							verticalAlign: 'bottom',//'top',
							y: 25,
							floating: true,
							itemMarginBottom: 5,
							backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
						},
					  plotOptions: {
						series: {
						  turboThreshold: 15000//larger threshold or set to 0 to disable
						}
					  },						
						series: [seriesDataMonthly,serieCruPrec,serieCruTmin,serieCruTmax]
					});						
					//************************* annual *********************************
					 function range(start, count) {
						  return Array.apply(0, Array(count))
							.map(function (element, index) { 
							  return index + start;  
						  });
						}					
					$('#grap_prec_annual_'+idSta).highcharts({

							chart: {
								type: 'line'
							},
							title: {
								text: 'Annual Precipitation'
							},
							xAxis: {
								categories: range(yi,yf-yi+1)
							},
							yAxis: {
								title: {
									text: 'Rainfall (mm)'
								},
								opposite: true								
							},
							plotOptions: {
								 line: {
									dataLabels: {
										enabled: true
									},
									enableMouseTracking: false
								}           
							},
							series: [{
								showInLegend: false,
								name: 'Rainfall (mm)',
								marker: {
									symbol: 'square'
								},
								data: data['annual']['data']

							}]

						
					});							
					
					//*********************************** Rainy **********************************
					
					$('#grap_rainy_'+idSta).highcharts('StockChart',{
					  chart: {
						type: 'spline',
						zoomType: 'x'
					  },
					  title: {
						text: 'Rainy days per month'
					  },
					  xAxis: {
						type: 'datetime',
						labels: {
						  overflow: 'justify'
						}
					  },
					  yAxis: {
						title: {
						  text: 'Rainy days (>1mm/day)'
						}
					  },
					  tooltip: {
						valueSuffix: ' days',
						valueDecimals: 0
					  },
					  plotOptions: {
						series: {
						  turboThreshold: 15000//larger threshold or set to 0 to disable
						}
					  },
					  series: [seriesDataRainy]

					});			

					//*********************************** wetdays **********************************
					
					$('#grap_wetdays_'+idSta).highcharts('StockChart',{
					  chart: {
						type: 'spline',
						zoomType: 'x'
					  },
					  title: {
						text: 'Maximum consecutive rainy per month'
					  },
					  xAxis: {
						type: 'datetime',
						labels: {
						  overflow: 'justify'
						}
					  },
					  yAxis: {
						title: {
						  text: 'Max wetdays (>1mm/day)'
						}
					  },
					  tooltip: {
						valueSuffix: ' days',
						valueDecimals: 0
					  },
					  plotOptions: {
						series: {
						  turboThreshold: 15000//larger threshold or set to 0 to disable
						}
					  },
					  series: [seriesDataWetdays]

					});			
					
					//************************* climatology *********************************
					
					// $('#grap_prec_clim_'+idSta).highcharts({

							// chart: {
								// type: 'line'
							// },
							// title: {
								// text: 'Monthly Average Precipitation'
							// },
							// xAxis: {
								// categories: categories_months
							// },
							// yAxis: {
								// title: {
									// text: 'Rainfall (mm)'
								// },
								// opposite: true								
							// },
							// plotOptions: {
								 // line: {
									// dataLabels: {
										// enabled: true
									// },
									// enableMouseTracking: false
								// }           
							// },
							// series: [{
								// showInLegend: false,
								// name: 'Rainfall (mm)',
								// marker: {
									// symbol: 'square'
								// },
								// data: data['clim']['data']

							// }]

						
					// });		
					
					//************* climatology v2 + WCL ***********
					
					$('#grap_clim_wcl'+idSta).highcharts({
						chart: {
							zoomType: 'xy'
						},
						title: {
							text: 'Average Monthly Temperature and Precipitation (CHIRPS and WorldClim V2)'
						},
						// subtitle: {
							// text: 'Source: WorldClimate.com'
						// },
						xAxis: [{
							categories: categories_months,
							crosshair: true
						}],
						yAxis: [{ // Primary yAxis
							labels: {
								format: '{value} C',
								style: {
									color: Highcharts.getOptions().colors[1]
								}
							},
							title: {
								text: 'Temperature',
								style: {
									color: Highcharts.getOptions().colors[1]
								}
							}
						}, { // Secondary yAxis
							title: {
								text: 'Rainfall',
								style: {
									color: Highcharts.getOptions().colors[0]
								}
							},
							labels: {
								format: '{value} mm',
								style: {
									color: Highcharts.getOptions().colors[0]
								}
							},
							opposite: true
						}],
						tooltip: {
							shared: true
						},
						legend: {
							layout: 'horizontal',
							align: 'left',
							x: 100,
							verticalAlign: 'bottom',//'top',
							y: 25,
							floating: true,
							itemMarginBottom: 5,
							//padding:0.8,
							backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
						},
						series: [{
							name: 'Prec. WorldClim',
							type: 'column',
							yAxis: 1,
							data: data['wcl_prec']['data'],//[49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
							tooltip: {
								valueSuffix: ' mm'
							}

						},{
							name: 'Prec. Chirps',
							type: 'column',
							yAxis: 1,
							data: data['clim']['data'],//[49.9, 71.9, 106.1, 129.2, 144.7, 176.0, 135.6, 148.0, 216.4, 194.1, 95.9, 54.4],
							tooltip: {
								valueSuffix: ' mm'
							}

						}, {
							name: 'Temp. Min (wcl)',
							type: 'spline',
							color:'orange',
							data: data['wcl_tmin']['data'],//[7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
							tooltip: {
								valueSuffix: ' C'
							}
						}, {
							name: 'Temp. Max (wcl)',
							type: 'spline',
							color:'red',
							data: data['wcl_tmax']['data'],//[7.5, 7.4, 9.8, 14.9, 18.7, 21.9, 25.6, 26.8, 23.9, 18.9, 14.7, 10],
							tooltip: {
								valueSuffix: ' C'
							}
						}]
					});					
					
					
					
					//************************** STATISTICAL *********
					source_ftp="ftp://ftp.ciat.cgiar.org/DAPA/projects/GCMPage/data/data_requests/" //"http://gisweb.ciat.cgiar.org/Bc_Downscale/download" // "../../downloads/chirps/"//
					lon=Math.round(lon*10000)/10000
					lat=Math.round(lat*10000)/10000
					if(data['database']['chirps']=="true"){
						$('#index_boxplot').append('<img src="'+source_ftp+'/chirps_lonlat_'+lon+'_'+lat+'/chirpsV2_boxplot_yi_'+yi+'_yf_'+yf+'_lon_'+Math.round(lon*10000)/10000+'_lat_'+Math.round(lat*10000)/10000+'.png" style="margin:auto; width:100%;display:block" />');

						// $('#index_wetdays').append('<img src="'+source_ftp+'/chirpsV2_wetdays_yi_'+yi+'_yf_'+yf+'_lon_'+Math.round(lon*10000)/10000+'_lat_'+Math.round(lat*10000)/10000+'.png" style="margin:auto; width:100%display:block" />');
						// $('#index_conswetdays').append('<img src="'+source_ftp+'/chirpsV2_conswetdays_yi_'+yi+'_yf_'+yf+'_lon_'+Math.round(lon*10000)/10000+'_lat_'+Math.round(lat*10000)/10000+'.png" style="margin:auto; width:100%display:block" />');
						
						//**************************  *********
						
						$('#stats_chirps').append(
							'<br><table width="265" border="1" style="font-family: Trebuchet MS;margin-left: 35%;">                      \
							  <tr>                                                                                \
								<td colspan="2" style="padding-bottom: 5px;padding-top: 5px;" ><div align="center"><strong>Summary statistics of daily data</strong></div></td>\
							  </tr>                                                                               \
							  <tr>                                                                                \
								<td width="110"><div align="center">N</div></td>                                  '+
								'<td width="80"><div align="center">'+data['stats']['data'][0]+'</div></td>'+
							  '</tr>                                                                               \
							  <tr>                                                                                \
								<td><div align="center">Min</div></td>                                           '+
								'<td width="80"><div align="center">'+data['stats']['data'][1]+'</div></td>'+
							  '</tr>                                                                               \
							  <tr>                                                                                \
								<td><div align="center">Max</div></td>                                        '+
								'<td width="80"><div align="center">'+data['stats']['data'][2]+'</div></td>'+
							  '</tr>                                                                               \
							  <tr>                                                                                \
								<td><div align="center">Mean</div></td>                                '+
								'<td width="80"><div align="center">'+data['stats']['data'][3]+'</div></td>'+
							  '</tr>                                                                               \
							  <tr>                                                                                \
								<td><div align="center">Median</div></td>                                       '+
								'<td width="80"><div align="center">'+data['stats']['data'][6]+'</div></td>'+
							  '</tr>                                                                               \
							  <tr>                                                                                \
								<td><div align="center">Standard deviation</div></td>                                '+
								'<td width="80"><div align="center">'+data['stats']['data'][5]+'</div></td>'+
							  '</tr>                                                                               \
							  <tr>                                                                                \
								<td><div align="center">Variance</div></td>                                            '+
								'<td width="80"><div align="center">'+data['stats']['data'][4]+'</div></td>'+
							  '</tr>                                                                               \
							  <tr>                                                                                \
								<td><div align="center">Coef. Variation</div></td>                                            '+
								'<td width="80"><div align="center">'+data['stats']['data'][7]+'</div></td>'+
							  '</tr>                                                                               \
							</table>   <br> <br>                                                                          ' 
			
						);
			        }
					
				  } // fin prec
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
				  if (data['srad']) {
					dLen = data['srad']['data'].length;

					if (period == 1) {
					  seriesData = {
						name: 'Sun bright',
						data: data['srad']['data'],
						pointStart: Date.UTC(data['srad']['sdate'].split(' ')[0].split('-')[0], (parseInt(data['srad']['sdate'].split(' ')[0].split('-')[1]) - 1), parseInt(data['srad']['sdate'].split(' ')[0].split('-')[2])),
						pointInterval: 24 * 3600 * 1000
					  };
					} else if (period == 2) {
					  for (var i = 0; i < dLen; i++) {
						data['srad']['data'][i] = [Date.UTC(data['srad']['sdate'].split(' ')[0].split('-')[0], (parseInt(data['srad']['sdate'].split(' ')[0].split('-')[1]) - 1 + i), 1), data['srad']['data'][i]];
					  }
					  seriesData = {
						name: 'Sun bright',
						data: data['srad']['data']
					  };
					} else if (period == 3) {
					  for (var i = 0; i < dLen; i++) {
						data['srad']['data'][i] = [Date.UTC((parseInt(data['srad']['sdate'].split(' ')[0].split('-')[0]) + i), (parseInt(data['srad']['sdate'].split(' ')[0].split('-')[1]) - 1), 1), data['srad']['data'][i]];
					  }
					  seriesData = {
						name: 'Sun bright',
						data: data['srad']['data']
					  };
					}
					$('#grap_srad_'+idSta).highcharts('StockChart',{
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
				
				},
				complete: function() {
					myMask.hide();
				}
			  });

		}// fin function generateGraps
		
// Ext.define('MyApp.ux.DisableCheckColumn', {
    // extend: 'Ext.ux.CheckColumn',
    // alias: 'widget.disablecheckcolumn',

    // /**
     // * Only process events for checkboxes that do not have a "disabled" class
     // */
    // processEvent: function(type, view, cell, recordIndex, cellIndex, e) {
        // var enabled = Ext.query('[class*=disabled]', cell).length == 0,
            // me = this;

        // if (enabled) {
            // me.callParent(arguments);
        // }
    // },

// });

var bton_sign_Up = new Ext.Button({						
						// xtype:'button',
						text:'Sign Up',
						id:'SignUpID',
						icon: icons+'forms-icon.png',
						width:70,
						margin: '5px 5px 0 5px',
						handler: function(){
							Ext.getCmp('mainpanelID').setDisabled(true);
							if(Ext.getCmp('popupID')){
								Ext.getCmp('popupID').close()
							}	
							
							if(Ext.getCmp('ventana_loginID')){
								Ext.getCmp('ventana_loginID').destroy();
							}
							
							var formPanel = Ext.widget('form', {
								// renderTo: Ext.getBody(),
								frame: true,
								width: 350,
								labelWidth:260,
								bodyPadding: 10,
								bodyBorder: true,
								// title: 'Account Registration',
						 
								defaults: {
									anchor: '100%'
								},
								fieldDefaults: {
									labelAlign: 'left',
									msgTarget: 'none',
									invalidCls: '' //unset the invalidCls so individual fields do not get styled as invalid
								},
						 
								/*
								 * Listen for validity change on the entire form and update the combined error icon
								 */
								listeners: {
									fieldvaliditychange: function() {
										this.updateErrorState();
									},
									fielderrorchange: function() {
										this.updateErrorState();
									}
								},
						 
								updateErrorState: function() {
									var me = this,
										errorCmp, fields, errors;
						 
									if (me.hasBeenDirty || me.getForm().isDirty()) { //prevents showing global error when form first loads
										errorCmp = me.down('#formErrorState');
										fields = me.getForm().getFields();
										errors = [];
										fields.each(function(field) {
											Ext.Array.forEach(field.getErrors(), function(error) {
												errors.push({name: field.getFieldLabel(), error: error});
											});
										});
										errorCmp.setErrors(errors);
										me.hasBeenDirty = true;
									}
								},
						 
								items: [{
									xtype: 'textfield',
									name: 'username',
									fieldLabel: 'User Name',
									allowBlank: false,
									minLength: 6
								}, {
									xtype: 'textfield',
									name: 'email',
									fieldLabel: 'Email Address',
									vtype: 'email',
									allowBlank: false
								}, {
									xtype: 'textfield',
									name: 'password1',
									fieldLabel: 'Password',
									inputType: 'password',
									style: 'margin-top:15px',
									allowBlank: false,
									minLength: 8
								}, {
									xtype: 'textfield',
									name: 'password2',
									fieldLabel: 'Repeat Password',
									inputType: 'password',
									allowBlank: false,
									/**
									 * Custom validator implementation - checks that the value matches what was entered into
									 * the password1 field.
									 */
									validator: function(value) {
										var password1 = this.previousSibling('[name=password1]');
										return (value === password1.getValue()) ? true : 'Passwords do not match.'
									}
								},
						 
								/*
								 * Terms of Use acceptance checkbox. Two things are special about this:
								 * 1) The boxLabel contains a HTML link to the Terms of Use page; a special click listener opens this
								 *    page in a modal Ext window for convenient viewing, and the Decline and Accept buttons in the window
								 *    update the checkbox's state automatically.
								 * 2) This checkbox is required, i.e. the form will not be able to be submitted unless the user has
								 *    checked the box. Ext does not have this type of validation built in for checkboxes, so we add a
								 *    custom getErrors method implementation.
								 */
								{
								
									xtype: 'fieldset',
									title: '<span style="color: #135A92">Important</span>',
									id:'idTermsUSe',
									
									// layout: 'anchor',
									// width:fieldsetWidth,
									bodyPadding: 0,
									defaults: {
										anchor: '100%',
										bodyStyle: 'padding:4px;'
									},
									// collapsible: true,
									// collapsed: false,
									// buttonAlign: 'right',
									html: '<p style="color:#95999A">If you want to access restricted weather stations data please <a href="http://ccafs-climate.org/contact/" target="_blank">contact us.</a></p>'
									// items: []								
									/*
									xtype: 'checkboxfield',
									name: 'acceptTerms',
									fieldLabel: 'Terms of Use',
									hideLabel: true,
									style: 'margin-top:15px',
									// boxLabel: 'I have read and accept the <a href="http://172.22.52.48/downloads/docs/cordex_terms_of_use_stations.pdf" class="terms">Terms of Use</a>.',
									boxLabel: 'I have read and accept the <a href="http://ccafs-climate.org/downloads/docs/cordex_terms_of_use_stations.pdf" class="terms">Terms of Use</a>.',
						 
									// Listener to open the Terms of Use page link in a modal window
									listeners: {
										click: {
											element: 'boxLabelEl',
											fn: function(e) {
												var target = e.getTarget('.terms'),
													win;
												if (target) {
													win = Ext.widget('window', {
														title: 'Terms of Use',
														modal: true,
														html: '<iframe src="' + target.href + '" width="550" height="500" style="border:0"></iframe>',
														x:0,
														y:0,															
														buttons: [{
															text: 'Decline',
															handler: function() {
																this.up('window').close();
																formPanel.down('[name=acceptTerms]').setValue(false);
															}
														}, {
															text: 'Accept',
															handler: function() {
																this.up('window').close();
																formPanel.down('[name=acceptTerms]').setValue(true);
															}
														}]
													});
													win.show();
													e.preventDefault();
												}
											}
										}
									},
						 
									// Custom validation logic - requires the checkbox to be checked
									getErrors: function() {
										return this.getValue() ? [] : ['You must accept the Terms of Use']
									}*/
								}],
						 
								dockedItems: [{
									xtype: 'container',
									dock: 'bottom',
									layout: {
										type: 'hbox',
										align: 'middle'
									},
									padding: '10 10 5',
						 
									items: [{
										xtype: 'component',
										id: 'formErrorState',
										baseCls: 'form-error-state',
										flex: 1,
										validText: 'Form is valid',
										invalidText: 'Form has errors',
										tipTpl: Ext.create('Ext.XTemplate', '<ul><tpl for="."><li><span class="field-name">{name}</span>: <span class="error">{error}</span></li></tpl></ul>'),
						 
										getTip: function() {
											var tip = this.tip;
											if (!tip) {
												tip = this.tip = Ext.widget('tooltip', {
													target: this.el,
													title: 'Error Details:',
													id:"tooltipLoginRegisID",
													autoHide: false,
													anchor: 'top',
													mouseOffset: [-11, -2],
													closable: true,
													constrainPosition: false,
													cls: 'errors-tip'
												});
												tip.show();
											}
											return tip;
										},
						 
										setErrors: function(errors) {
											var me = this,
												baseCls = me.baseCls,
												tip = me.getTip();
						 
											errors = Ext.Array.from(errors);
						 
											// Update CSS class and tooltip content
											if (errors.length) {
												me.addCls(baseCls + '-invalid');
												me.removeCls(baseCls + '-valid');
												me.update(me.invalidText);
												tip.setDisabled(false);
												tip.update(me.tipTpl.apply(errors));
											} else {
												me.addCls(baseCls + '-valid');
												me.removeCls(baseCls + '-invalid');
												me.update(me.validText);
												tip.setDisabled(true);
												tip.hide();
											}
										}
									}, {
										xtype: 'button',
										formBind: true,
										disabled: true,
										text: 'Submit Registration',
										width: 140,
										handler: function() {
											var form = this.up('form').getForm();
											
											if (form.isValid()) {
												username=form.getValues().username
												email=form.getValues().email
												password1=form.getValues().password1
												password2=form.getValues().password2
												acceptTerms=form.getValues().acceptTerms
												
												Ext.Ajax.request({
													url: 'php/Geo_statByregion-test.php',
													method: 'POST',
													params : {type:25,login:username, password: password1,confirm:password2,email:email,name:"real nombre",info:""},
													success: function(response, opts) {
														resul=response.responseText
														// if(resul.split("\n")[1]=="OK"){
														if(resul=="OK"){
															// Ext.getCmp('btonLoginId').setText('Logout');
															// ventana_login.hide();
															// ventana_login.destroy();
															// Ext.Msg.alert('OK',"Please check your e-mail and follow the instructions."); 
															winInfo=Ext.MessageBox.show({
															   title: 'Information',
															   msg: 'The registration was successful. If you have privileges to download the data please contact us.',
															   width:300,
															   buttons: Ext.MessageBox.OK,
															   animateTarget: 'info',
															   icon: 'x-message-box-info',
															   fn : function(btn) {
																	if (btn == 'ok') {
																		Ext.getCmp('registerID').destroy()
																	}
																}
																
															});	
															winInfo.setPosition(mainPanelWidth/3,mainPanelHeight/2);																			
															Ext.getCmp('mainpanelID').enable()
															
															
														}else{
															// Ext.Msg.alert('Login Failed!',"Sorry, a user with this login and/or e-mail address already exist."); 
															winInfo=Ext.MessageBox.show({
															   title: 'Information',
															   msg: 'Sorry, a user with this login and/or e-mail address already exist.',
															   width:300,
															   buttons: Ext.MessageBox.OK,
															   animateTarget: 'error',
															   icon: 'x-message-box-error'
															   
															});	
															winInfo.setPosition(mainPanelWidth/3,mainPanelHeight/2);																			
														}
													},
													failure: function(response, opts) {
														var responseText = (response.responseText ? response.responseText : 'Unable to contact the server.  Please try again later.');
														panelLaunch({
															iconClass: 'x-panel-action-icon-tick',
															position: 'br',
															actionMethod: ['hide']
														}, responseText);
													},
													scope: this
												});																
												
												/* Normally we would submit the form to the server here and handle the response...
												form.submit({
													clientValidation: true,
													url: 'register.php',
													success: function(form, action) {
													   //...
													},
													failure: function(form, action) {
														//...
													}
												});
												*/
						 
											
												// Ext.Msg.alert('Submitted Values', form.getValues(true));
											}
										}
									}]
								}]
							});
								
							var Register = new Ext.Window({
								iconCls: 'key',
								id:"registerID",
								title: 'Account Registration',
								style: "font-family: 'Oswald', sans-serif;font-size: 14px;",
								constrainHeader: true,
								collapsible: true,
								resizable: false,
								frame:true, 
								width: 350,
								height: 310,
								layout: 'fit', //fit
								plain: true,
								bodyStyle: 'padding:5px;',
								buttonAlign: 'center',
								x:mainPanelWidth/2,
								y:mainPanelHeight/4,									
								items: [formPanel],
								listeners:{
									'close':function(){
										Ext.getCmp('mainpanelID').enable()
										if(Ext.getCmp('tooltipLoginRegisID')){
											Ext.getCmp('tooltipLoginRegisID').destroy()
										}
									}
								}									
							}); // fin windows											
							Register.show();
																
						
						}
					})					



    var fieldsetLogin = {
        xtype: 'fieldset',
        title: 'Sign in with username and password   '+ '<img id="help_toolip" class="tooltipIcon" src='+icons+infoB+' data-qtip="'+toolip_fieldsetLogin+'" />',//<span data-qtip="hello">First Name</span>  
		id:'Login',
        layout: 'anchor',
		width:fieldsetWidth,
        defaults: {
            anchor: '100%',
			bodyStyle: 'padding:4px'
        },
        collapsible: true,
        collapsed: false,
		buttonAlign: 'right',
		items: [
			{
				xtype: 'buttongroup',
				id: 'buttongroupCondForm',
				// columns: 1,
				// layout: 'column',
				layout: {
					type: 'hbox',
					align: 'middle',
					pack: 'center',
				},			
				// style:'font-size: 10px;',
				cls:'my-cls',
				// layout: {
					// type: 'vbox',
					// align: 'center'
				// },				
				style: {
					border: 0,
					padding: 1
				},				
				defaults: {
					scale: 'small',
					// flex: 1
				},
				items: [		
					{
						xtype:'button',
						id:'btonLoginId',
						text:'Login',
						icon: icons+'key-icon.png',
						width:70,
						handler: function(){
							if(Ext.getCmp('popupID')){
								Ext.getCmp('popupID').close()
							}						
							Ext.getCmp('mainpanelID').setDisabled(true);
							if(Ext.getCmp('btonLoginId').text=="Logout"){
								if(Ext.getCmp('gridRegionID')){
									Ext.getCmp('gridRegionID').getStore().load({ params: { start: 0, limit: 30} });
									Ext.getCmp('gridRegionID').doLayout();	
								}
								if(Ext.getCmp('gridRegionID_1')){
									Ext.getCmp('gridRegionID_1').getStore().load({ params: { start: 0, limit: 30} });
									Ext.getCmp('gridRegionID_1').doLayout();	
								}								
							}							
							var login = Ext.create('Ext.FormPanel', {
								// url:'php/Login.php', 
								// id:'formLoginId',
								bodyPadding: 5,
								cls: 'css_labels',
								frame:true, 
								// title:'Please Login', 
								defaultType:'textfield',
								monitorValid:true,
								defaults: {
									listeners:{
										specialkey: function(field, e){
											if (e.getKey() == e.ENTER){
												var element = Ext.getCmp("Btn_Submit_id");
												element.handler.call(element.scope);
												// element.fireEvent('click',element); // field.up('form').getForm().submit({});
											}
										}									
									}
								},
								items:[{ 
										fieldLabel:'Login', 
										name:'login', 
										id:'login', 
										labelWidth:60,
										allowBlank:false,
										minLength: 4, maxLength: 32
									},{ 
										fieldLabel:'Password', 
										name:'password', 
										id:'password', 
										inputType:'password', 
										labelWidth:60,
										allowBlank:false, minLength: 4,
										maxLength: 32, minLengthText: 'Password must be at least 4 characters long.' 
									}],

									buttons:[
										{ 
												// iconCls: 'key-go',
												text:' Submit',
												id:"Btn_Submit_id",
												overCls : 'my-over',
												formBind: true,	 
												// icon: icons+'key-go-icon.png', 
												scale: 'small',
												// listeners : {
													// click: function(button,event) {
														// Ext.getCmp('btonLoginId').setText('Hide');
													// }
												// },										
												handler:function(){ 
														Ext.Ajax.request({
															url: 'php/Geo_statByregion-test.php',
															method: 'POST',
															params : {type:23,login:Ext.getCmp('login').getValue(), password: Ext.getCmp('password').getValue()},
															success: function(response, opts) {
																resul=response.responseText
																var res = resul.split(" ")[0];
																var usr  = resul.split(" ")[1];
																// if(resul.split("\n")[1]=="OK"){
																if(res=="OK"){
																	
																	if(Ext.getCmp('gridRegionID')){
																		// Ext.getCmp('mainTableID').collapse();
																		// Ext.getCmp('gridRegionID').minHeight=mainPanelHeight*0.2;	
																		// Ext.getCmp('gridRegionID').getStore().reload();
																		Ext.getCmp('gridRegionID').getStore().load({ params: { start: 0, limit: 30} });
																		// Ext.getCmp('gridRegionID').getView().refresh();
																		// Ext.getCmp('mainTableID').expand()																		
																		Ext.getCmp('gridRegionID').doLayout();	
																	}

																	if(Ext.getCmp('gridRegionID_1')){
																		Ext.getCmp('gridRegionID_1').getStore().load({ params: { start: 0, limit: 30} });
																		Ext.getCmp('gridRegionID_1').doLayout();	
																	}																	
																	Ext.getCmp('btonLoginId').setText('Logout');
																	// ventana_login.hide();
																	ventana_login.destroy();
																	Ext.getCmp('mainpanelID').enable()
																	Ext.getCmp('SignUpID').disable()
																	// Ext.getCmp('buttongroupCondForm').remove(Ext.getCmp('SignUpID'));
																	Ext.getCmp('buttongroupCondForm').add({
																		xtype: 'label',
																		// forId: 'myFieldIdLog',
																		cls:'myFieldIdLog',
																		id:'myFieldIdLog',
																		height : 25,
																		text: 'Welcome '+usr+'!',
																		// labelAlign:'top',
																		// bodyStyle: 'margin: -5px !important;',
																		// style : {
																			//background : '#6699FF',
																			// color : '#394E6A',
																			// textAlign: 'top',
																			// margins: '-20 10 10 10'
																		// },																		
																		
																	});
																}else if(resul==10){
																	winInfo=Ext.MessageBox.show({
																	   title: 'Warning',
																	   msg: 'Login and/or password did not match to the database.',
																	   width:300,
																	   buttons: Ext.MessageBox.OK,
																	   animateTarget: 'warning',
																	   icon: 'x-message-box-warning'
																	});	
																	winInfo.setPosition(mainPanelWidth/3,mainPanelHeight/2);															
																
																}else{
																	winInfo=Ext.MessageBox.show({
																	   title: 'Warning',
																	   msg: 'Not stations found!',
																	   width:300,
																	   buttons: Ext.MessageBox.OK,
																	   animateTarget: 'warning',
																	   icon: 'x-message-box-warning'
																	});	
																	winInfo.setPosition(mainPanelWidth/3,mainPanelHeight/2);

																}
															},
															failure: function(response, opts) {
																var responseText = (response.responseText ? response.responseText : 'Unable to contact the server.  Please try again later.');
																panelLaunch({
																	iconClass: 'x-panel-action-icon-tick',
																	position: 'br',
																	actionMethod: ['hide']
																}, responseText);
															},
															scope: this
														});										
													
										} 
									}],
									// keys: [{ key: Ext.EventObject.ENTER, fn: Ext.getCmp('Btn_Submit_id') }]
									
						   });
						   
							btonLog=Ext.getCmp('btonLoginId').text
							
							var ventana_login = new Ext.Window({
								iconCls: 'key',
								title: 'Login',
								id:'ventana_loginID',
								style: "font-family: 'Oswald', sans-serif;font-size: 14px;",
								constrainHeader: true,
								collapsible: true,
								resizable: false,
								frame:true, 
								// keys: [{ key: Ext.EventObject.ENTER, scope: this, handler:function(){console.log("holaaa")} }],
								width: 250,
								height: 150,
								layout: 'fit', //fit
								plain: true,
								bodyStyle: 'padding:5px;',
								buttonAlign: 'center',
								x:mainPanelWidth/2,
								y:mainPanelHeight/3,									
								items: [login],
								enablekeyEvents: true,
								listeners:{
									'close':function(){
										Ext.getCmp('mainpanelID').enable()
									}									
								}								
							}); // fin windows
								
							if(btonLog=="Login"){		
								ventana_login.show();
							}else{
								Ext.Ajax.request({
									url: 'php/Geo_statByregion-test.php',
									method: 'POST',
									params : {type:24},
									success: function(response, opts) {
										resul=response.responseText
										Ext.getCmp('btonLoginId').setText('Login');
										ventana_login.hide();
										Ext.getCmp('mainpanelID').enable()
									},
									failure: function(response, opts) {
										var responseText = (response.responseText ? response.responseText : 'Unable to contact the server.  Please try again later.');
										panelLaunch({
											iconClass: 'x-panel-action-icon-tick',
											position: 'br',
											actionMethod: ['hide']
										}, responseText);
									},
									scope: this
								});						
								Ext.getCmp('SignUpID').enable()
								// Ext.getCmp('buttongroupCondForm').add(bton_sign_Up);
								Ext.getCmp('buttongroupCondForm').remove(Ext.getCmp('myFieldIdLog'),true)
							}						
						} // fin handler Login
					},bton_sign_Up
					
					
					
					
				]
			}
		
		]
	}

	
	function downform(listsel,records){
		var varstore = Ext.create('Ext.data.Store', {
			model: 'modelvarList',
			storeId:'varstoreID',
			autoLoad: true,
			autoSync: true,
			sorters: { property: 'name', direction : 'ASC' },

			proxy: {
				type: 'ajax',
				url: 'php/Geo_statByregion-test.php',
				extraParams: {type:7,listStatSel: Ext.encode(listsel)},
				actionMethods :{
					read   : 'POST'
				},			
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
		cmbVar= Ext.create('Ext.form.field.ComboBox', { 
			editable: false, 
			fieldLabel: 'Variables',
			name: 'Variables',
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

		var qcstore = Ext.create('Ext.data.Store', {
			model: 'modelQC',
			autoLoad: true,
			autoSync: true,
			sorters: { property: 'name', direction : 'ASC' },

			proxy: {
				type: 'ajax',
				url: 'php/Geo_statByregion-test.php',
				extraParams: {type:29,listStatSel:Ext.encode(listsel)},
				actionMethods: {
					read: 'POST'//'POST'
				},												
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
						  description: 'ALL'
						  
					  }]),
					  store.insert(1, [{
						  id: 1,
						  name: 'raw',
						  description: 'Original data'
						  
					  }]);														  
				 }
			  }								
			});	
			qualitycCmb = Ext.create('Ext.form.field.ComboBox', { 
				fieldLabel: 'Quality control:',
				name: 'Quality_control',
				// labelWidth:90,
				editable: false, 
				value: 'ALL',
				multiSelect: false, 
				displayField: 'name',
				valueField: 'name', 
				id:'qcCmbID',
				queryMode: 'local',
				typeAhead: true,	
				store: qcstore,
				// width: 180,												
				listConfig: {
					getInnerTpl: function() {
						return '<div data-qtip="{description}">{name}</div>';
					}
				},
				listeners: {
					select: function() {
						var qc = Ext.getCmp('qcCmbID').getValue()
						// var selection = gridRegion.getView().getSelectionModel();//[0];
						// getdata=gridRegion.getStore().data.items
						// console.log(getdata)
						// for(var i = 0; i < getdata.length; i++) {
							// if(getdata[i].data.quality==qc){
								// selection.select(i,true);
							// }
						// }
						// var number_of_selected_records = selection.getSelection().length;
						// var name = Ext.getCmp('numRecordsSelected').setText( 'Found: ' +number_of_selected_records);														
					}
				}											
			});		
		
		
		var form_downloading = Ext.widget('form', {
			// renderTo: Ext.getBody(),
			frame: true,
			width: 350,
			labelWidth:260,
			bodyPadding: 10,
			bodyBorder: true,
			// title: 'Account Registration',
	 
			defaults: {
				anchor: '100%'
			},
			fieldDefaults: {
				labelAlign: 'left',
				msgTarget: 'none',
				invalidCls: '' //unset the invalidCls so individual fields do not get styled as invalid
			},
			items: [cmbVar,qualitycCmb,
			{
			
				xtype: 'fieldset',
				title: '<span style="color: #135A92">Info</span>',
				id:'idTermsUSe',
				
				// layout: 'anchor',
				// width:fieldsetWidth,
				bodyPadding: 0,
				defaults: {
					anchor: '100%',
					bodyStyle: 'padding:4px;'
				},
				// collapsible: true,
				// collapsed: false,
				// buttonAlign: 'right',
				html: '<p style="color:#95999A">Selected records: '+listsel.length+'</a><br>*Download automatically starts after pressing the button</p>',
				// items: [{ xtype: 'tbtext', itemId: 'infodwon', id:'infodwon' }]
			}],
	 
			dockedItems: [{
				xtype: 'container',
				dock: 'bottom',
				layout: {
					type: 'hbox',
					align: 'middle'
				},
				padding: '10 10 5',
	 
				items: [{
					xtype: 'button',
					formBind: true,
					disabled: true,
					text: 'Downloading data',
					width: 140,
					handler: function() {
						var form = this.up('form').getForm();
						
						if (form.isValid()) {
							vars=form.getValues().Variables
							qc=form.getValues().Quality_control
							// listsel=new Array(listsel)
							// console.log(qc,listsel,Ext.encode(vars))
							
							// var selection = gridRegion.getView().getSelectionModel().getSelection();//[0];
							// selgrid=new Array()
							// for(var i = 0; i < selection.length; i++) {
								// selgrid.push(Number(selection[i].data.id));
							// }


							Ext.DomHelper.append(document.body, {
							  tag: 'iframe',
							  id:'downloadIframe',
							  frameBorder: 0,
							  width: 0,
							  height: 0,
							  css: 'display:none;visibility:hidden;height: 0px;',
							  // src: 'php/dowloaddata.php?qc='+qc+'&station='+Ext.encode(listsel)+'&variable='+Ext.encode(vars)
							  // src: 'php/dowloaddata.php?qc='+qc+'&station='+Ext.encode(listsel)+'&variable='+vars
							  src: 'php/dowloaddata.php?qc='+qc+'&station='+Ext.encode(listsel)+'&'+'variable='+vars+'&'+'country=null'+'&'+'state=null'+'&'+'municip=null'
							  
							});
							// Ext.getCmp('infodwon').setText('Selected: ' + 0);
														
						}
					}
				}]
			}]
		});
			

		Ext.getCmp('mainpanelID').setDisabled(true);
		win_download = new Ext.Window({
			iconCls: 'down',
			id:"windownloadID",
			title: 'Download',
			style: "font-family: 'Oswald', sans-serif;font-size: 14px;",
			constrainHeader: true,
			collapsible: true,
			resizable: false,
			frame:true, 
			width: 350,
			height: 230,
			layout: 'fit', //fit
			plain: true,
			bodyStyle: 'padding:5px;',
			buttonAlign: 'center',
			x:mainPanelWidth/2,
			y:mainPanelHeight/4,						
			items: [form_downloading],
			listeners:{
				'close':function(){
					Ext.getCmp('mainpanelID').enable()
				}
			}			
		}); // fin windows		
		win_download.show();		
		
	}

	btn_download = function () {
		if(Ext.getCmp('windownloadID')){
			Ext.getCmp('windownloadID').destroy();	
		}	
		
		if(Ext.getCmp('gridRegionID')){
				var selectionModel = Ext.getCmp('gridRegionID').getView().getSelectionModel(); 
		}else if(Ext.getCmp('gridRegionID_1')){
				var selectionModel = Ext.getCmp('gridRegionID_1').getView().getSelectionModel(); 
		}
		
		
		var selection = selectionModel.getSelection();
		records1=selectionModel.getStore().getCount()
		records2=selection.length
		listsel=new Array()
		copyrightN=[]
		check=""
		// console.log(Ext.ComponentQuery.query("#status").getValue())
		if(records2>0 & records2<150){
			records=records2
			for(var i = 0; i < records; i++) {
				if(selection[i].data.copyright=="Free"){
					listsel.push(parseInt(selection[i].data.id))
				}
				
				copyrightN.push(selection[i].data.copyright);
			}
			check="ok"
		}else if(records2==0 & records1<150) {
			records=records1
			for(var i = 0; i < records; i++) {
				var record = selectionModel.getStore().getAt(i);
				if(record.get('copyright')=="Free"){
					listsel.push(parseInt(record.get('id')))
				}
				copyrightN.push(record.get('copyright'));
			}
			check="ok"
		}else{
			check="no"
			winInfo=Ext.MessageBox.show({
			   title: 'Information',
			   msg:"Exceeds the maximum number (Max. 150) of downloads",
			   width:300,
			   buttons: Ext.MessageBox.OK,
			   animateTarget: 'info',
			   icon: 'x-message-box-info'
			});	
			winInfo.setPosition(mainPanelWidth/3,mainPanelHeight/2);									
			
		}
		if(copyrightN.indexOf("Free")!=-1 & check=="ok" & listsel.length>0){
			downform(listsel,records);
		}else if(copyrightN.indexOf("Free")==-1 & check!="no"){
			winInfo2=Ext.MessageBox.show({
			   title: 'Information',
			   msg:"You do not have permission to download",
			   width:300,
			   buttons: Ext.MessageBox.OK,
			   animateTarget: 'info',
			   icon: 'x-message-box-info'
			});	
			winInfo2.setPosition(mainPanelWidth/3,mainPanelHeight/2);										
		}
	}	
	var myMask = new Ext.LoadMask(Ext.getCmp('mapPanelID'), {msg:"Please wait..."});


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
				text: 'Search',
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
						
						drawPolygon.control.deactivate();
						polygonDraw.destroyFeatures();
						// layerTemp=mapPanel.map.getLayersByName("Search_region")[0]
						// if(layerTemp){layerTemp.destroyFeatures();mapPanel.map.removeLayer(layerTemp);}

						// layerTemp=mapPanel.map.getLayersByName("Search station")[0]
						// if(layerTemp){layerTemp.destroyFeatures();mapPanel.map.removeLayer(layerTemp);}
							
						if(Ext.getCmp('popupID')){
							Ext.getCmp('popupID').close()
						}
						// loading status
						
						var myAjax = new Ext.data.Connection({
							// handler: function(){if(layerTemp){layerTemp.destroyFeatures();mapPanel.map.removeLayer(layerTemp);}},
							listeners : {        
								beforerequest : function () {myMask.show();},
								// requestcomplete : function () {myMask.hide();}
							}
						});
							
						getWinRegion = Ext.getCmp('winRegionID');
						if (getWinRegion) {
							winRegion.close()
							winRegion.destroy();
						} //winRegion		
						
						if(Ext.getCmp('gridRegionID_1')){
							Ext.getCmp('mainTableID').collapse();
							Ext.getCmp('gridRegionID_1').destroy();
							// console.log(Ext.getBody().getViewSize().height*0.3,mainPanelHeight*0.4)
						}	
						if(Ext.getCmp('gridRegionID')){
							Ext.getCmp('mainTableID').collapse();
							Ext.getCmp('gridRegionID').destroy();
						}						
						if(country){
							clusters.setVisibility(false)
							Ext.Ajax.request({ // PINTA EN EL MAPA LA REGION
								url : 'php/Geo_statByregion-test.php' , 
								params : { type:1,country : country, state:state, municip:municip},
								method: 'GET',
								success: function ( result, request ) {
									// layerTemp=mapPanel.map.getLayersByName("Search_region")[0]
									// if(layerTemp){layerTemp.destroyFeatures();}
									layerTempRegion.destroyFeatures();
									
									geocapa = result.responseText;
									var format = new OpenLayers.Format.GeoJSON({'internalProjection': new OpenLayers.Projection("EPSG:900913"), 'externalProjection': new OpenLayers.Projection("EPSG:4326")
									});
									// layerTemp=mapPanel.map.getLayersByName("Search_region")[0]
									layerTempRegion.addFeatures(format.read(geocapa));
									var bounds = layerTempRegion.getDataExtent();
									if(bounds){ mapPanel.map.panTo(bounds.getCenterLonLat()); mapPanel.map.zoomToExtent(bounds);}
								},
								failure: function ( result, request) { 
									Ext.MessageBox.alert('Failed', result.responseText);
								}
							});
							
							myAjax.request({ // PINTA EN EL MAPA LAS ESTACIONES INTERCEPTADAS
								url : 'php/Geo_statByregion-test.php' , 
								params : { type:2,country : country, state:state, municip:municip},
								method: 'GET',
								success: function ( result, request ) {
									
									layerTemp=mapPanel.map.getLayersByName("Search station")[0]
									if(layerTemp){layerTemp.destroyFeatures();}
								
									geocapa = result.responseText;
									var format = new OpenLayers.Format.GeoJSON({'internalProjection': new OpenLayers.Projection("EPSG:900913"), 'externalProjection': new OpenLayers.Projection("EPSG:4326")
									});
									if(format.read(geocapa)[0]){
										layerTemp=mapPanel.map.getLayersByName("Search station")[0]
										layerTemp.addFeatures(format.read(geocapa));
										// var selectFeature = new OpenLayers.Control.SelectFeature(layerTemp);
										// mapPanel.map.addControl(selectFeature);
										// selectFeature.activate();
										var FeatselectID=[]										
										for (var i = layerTemp.features.length - 1; i >= 0; --i) {
											// selectFeature.select(layerTemp.features[i]);
											FeatselectID.push(layerTemp.features[i].attributes.id)
										}
										getid(FeatselectID)
										
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
										myMask.hide();
									}
								},
								failure: function ( result, request) { 
									Ext.MessageBox.alert('Failed', result.responseText);
								}
						

							});	
							
							layerTemp=mapPanel.map.getLayersByName("Search station")[0]
						
							function getid(selectID){
								
								var qcstoreGrap = Ext.create('Ext.data.Store', {
									model: 'modelQC',
									autoLoad: true,
									autoSync: true,
									sorters: { property: 'name', direction : 'ASC' },

									proxy: {
										type: 'ajax',
										url: 'php/Geo_statByregion-test.php',
										extraParams: {type:29,listStatSel:Ext.encode(selectID)},
										actionMethods: {
											read: 'POST'//'POST'
										},												
										reader: {
											type: 'json',
											root: 'topics'
										}
									},
									listeners: {
										 load: function(store, records) {
											  store.insert(0, [{
												  id: 0,
												  name: 'raw',
												  description: 'Original data'
												  
											  }]);														  
										 }
									  }								
								});

							
							
							 ////////////////////////////////////////////////////////////////////////////////////////
							// PARA EXTRAER LA INFORMACION DE LAS ESTACIONES EN UNA TABLA
							 ////////////////////////////////////////////////////////////////////////////////////////
							var gridRegionStore = Ext.create('Ext.data.Store', {
								storeId: 'store_ID',
								model: 'modelGridRegion',
								buffered: true,
								pageSize: 30,
								leadingBufferZone: 90,
								proxy: {
									type: 'ajax',
									url: 'php/Geo_statByregion-test.php',
									extraParams: {country : country, state:state, municip:municip,type:5},
									reader: {
										type: 'json',
										root: 'topics',
										totalProperty: 'totalCount'
									},
									simpleSortMode: true,
									filterParam: 'query',
									encodeFilters: function(filters) {
										return filters[0].value;
									}
								},
								listeners: {
									totalcountchange: onStoreSizeChange
								},
								remoteFilter: true,
								autoLoad: true								
							});

							function onStoreSizeChange() {
								gridRegion.down('#status').update({count: gridRegionStore.getTotalCount()});
							}							

							var gridStandar = Ext.create('Ext.data.Store', {
								model: 'modelGridRegion',
								autoLoad: false,
								autoSync: true,
								proxy: {
									type: 'ajax',
									url: 'php/Geo_statByregion-test.php',
									reader: {
										type: 'json',
										root: 'topics'
									}
								}
							});								
							var selModel2 = Ext.create('Ext.selection.CheckboxModel', {
								mode: 'SIMPLE',
								// headerWidth: 56,
								listeners: {
									selectionchange: function(sm, selections) {
										// gridRegion.down('#removeButton').setDisabled(selections.length === 0);
										gridRegion.down('#idstatistic').setDisabled(selections.length === 0);
										
									}
								},
								select: function(records, keepExisting, suppressEvent) {
									if (Ext.isDefined(records)) {
										this.doSelect(records, keepExisting, suppressEvent);
									}
								},
								selectAll: function( suppressEvent ) {
									var me = this,
										selections = me.store.getRange();
									countFree=[]
									for( var key in selections ) {
										// if( selections[key].data.copyright == 'Restricted' ||  selections[key].data.copyright == 'Request' ) {
											// console.log(selections[key].data)
											// gridRegionStore.remove(selections[key]);
											// selections.splice( key, 1 );
											// break;
											if( selections[key].data.copyright == 'Free'){
												countFree.push(selections[key].data.copyright)
												// var currentUserRecord = gridRegion.store.getAt(key);
												// gridRegion.store.removeAt(key);
												// gridRegion.store.insert(0, [currentUserRecord]);												
											}
										// }
									}
									
									if(countFree.length>150){
										winInfo=Ext.MessageBox.show({
										   title: 'Information',
										   msg: 'Exceeds the maximum number (Max. 150) of downloads',
										   width:300,
										   buttons: Ext.MessageBox.OK,
										   animateTarget: 'info',
										   icon: 'x-message-box-info'
										});	
										winInfo.setPosition(mainPanelWidth/3,mainPanelHeight/2);
									}else{
										var i = 0,
											len = selections.length,
											selLen = me.getSelection().length;
											
										// if( len != selLen ) {
										if( selLen==0 ) {
											me.bulkChange = true;
											for (; i < len; i++) {
												me.doSelect(selections[i], true, suppressEvent);
											}
											delete me.bulkChange;
											me.maybeFireSelectionChange(me.getSelection().length !== selLen);
										}
										else {
											me.deselectAll( suppressEvent );
										}									
									}

								}								
								
							});

							gridRegion = Ext.create('Ext.grid.Panel', {
								id: 'gridRegionID_1',
								border: true,
								// layout: 'fit',
								forceFit: true,
								store: gridRegionStore,
								// maxHeight: mainPanelHeight*0.4,//Ext.getBody().getViewSize().height*0.3,
								width: mainPanelWidth,
								height:mainPanelHeight*0.4,
								// maxHeight: mainPanelHeight*0.4,
								selType: 'checkboxmodel',
								autoHeight: true,
								columns: [
									{
										xtype: 'rownumberer',
										width: 30,
										sortable: false
									},							
									{
										xtype: 'actioncolumn',
										minWidth: 30,
										flex: 1,
										items: [{
											icon   : icons+'buttons/zoomin_off.gif',  // Use a URL in the icon config
											tooltip: 'zoom extent',
											handler: function(grid, rowIndex, colIndex) {
												var rec = gridRegionStore.getAt(rowIndex);
												selectionID = rec.get('id');
												layerTemp=mapPanel.map.getLayersByName("Search station")[0]
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
										minWidth: 30,
										flex: 1,
										items: [{
											icon   : icons+'buttons/pie-chart-graph-icon.png',  // Use a URL in the icon config
											tooltip: 'Graphic',
											id:'GraphicID',
											handler: function(grid, rowIndex, colIndex) {
												var rec = gridRegionStore.getAt(rowIndex);
												selectionID = rec.get('id');
												statName = rec.get('name');
												copyrightN = rec.get('copyright');
												varget = rec.get('variables');
												// console.log(varget.split(","))
												varstore=varget.split(",")
													var periodst = Ext.create('Ext.data.Store', {
															fields: ['value','name'], 
															data: [ 
																{value:1,name: 'Daily'}, 
																{value:2,name: 'Monthly'}, 
																{value:3,name: 'Yearly'}
															]																	
													})
													varlist="ALL"//(cmbVar.getRawValue()).replace(/\s/g, '')
													var arrayvar =new Array() //varlist.split(',');
										
													// for(var i = 0; i < varstore.getCount(); i++) {
													for(var i = 0; i < varstore.length; i++) {
														// var record = varstore.getAt(i);
														var record = varstore[i];
														// id=record.get('id')
														// acronym=record.get('acronym')
														// arrayvar.push(acronym)
														arrayvar.push(record)
														// console.log(id,acronym)
													}
													
													var datatest = {
														name: 'xxx',
														rowTitleArr: arrayvar,
														colTitleArr: ['a', 'b', 'c']
													}
													var tpl = [
														'<div class="grap" id="grap_temp_'+selectionID+'" style="width:'+grapWidth+'px;"></div>',
														'<tpl for="rowTitleArr">',
														'<div class="grap" id="grap_{.}_'+selectionID+'" style="width:'+grapWidth+'px;"></div>',
														'</tpl>'
														];	

													cmbPeriod='cmbPeriod'+selectionID
													cmbPeriod=Ext.create('Ext.form.field.ComboBox', { 
														fieldLabel: 'Select graphic model',
														id:'cmbPeriodID',
														labelWidth:150,
														store: periodst,
														displayField: 'name',
														value: 1,
														queryMode: 'local',
														valueField: 'value', 								
														typeAhead: true,
														listeners: {
															select: function() {
																var actTab = tabs.getActiveTab();
																var idx = tabs.items.indexOf(actTab);
																// actTabId=parseInt((actTab.title).match(/\d+/)[0])
																var idPeriod = Ext.getCmp('cmbPeriodID').getValue()
																var qc = Ext.getCmp('qcCmbGrapID').getValue()
																
																// generateGraps(selectionID,idPeriod,Ext.encode(cmbVar.getValue()),qc)
																// console.log(selectionID,idPeriod,"ALL",qc)
																// console.log("hola")
																if (copyrightN == 'Free') {
																	generateGraps(selectionID,idPeriod,"ALL",qc)
																}else if (copyrightN != 'Free' && idPeriod==1){
																	winInfo=Ext.MessageBox.show({
																	   title: 'Information',
																	   msg: 'Sorry, You are not authorized to download data.',
																	   width:300,
																	   buttons: Ext.MessageBox.OK,
																	   animateTarget: 'error',
																	   icon: 'x-message-box-error'
																	   
																	});	
																	winInfo.setPosition(mainPanelWidth/3,mainPanelHeight/2);
																	Ext.getCmp('cmbPeriodID').setValue(3);
																}else if (copyrightN != 'Free' && idPeriod==2 ){
																	winInfo=Ext.MessageBox.show({
																	   title: 'Information',
																	   msg: 'Sorry, You are not authorized to download data.',
																	   width:300,
																	   buttons: Ext.MessageBox.OK,
																	   animateTarget: 'error',
																	   icon: 'x-message-box-error'
																	   
																	});	
																	winInfo.setPosition(mainPanelWidth/3,mainPanelHeight/2);
																	Ext.getCmp('cmbPeriodID').setValue(3);
																}																
																

															}
														}
													});	
													if (copyrightN != 'Free') {
													Ext.getCmp('cmbPeriodID').setValue(3);
													}else{Ext.getCmp('cmbPeriodID').setValue(1);}
													
													cmbqc='cmbqc'+selectionID
													cmbqc=Ext.create('Ext.form.field.ComboBox', { 
														fieldLabel: 'Quality control:',
														labelWidth:90,
														editable: false, 
														value: 'raw',
														multiSelect: false, 
														displayField: 'name',
														valueField: 'name', 
														id:'qcCmbGrapID',
														queryMode: 'local',
														typeAhead: true,
														store: qcstoreGrap,
														width: 180,												
														listConfig: {
															getInnerTpl: function() {
																return '<div data-qtip="{description}">{name}</div>';
															}
														},														
														listeners: {
															select: function() {
																var actTab = tabs.getActiveTab();
																var idx = tabs.items.indexOf(actTab);
																// actTabId=parseInt((actTab.title).match(/\d+/)[0])
																var idPeriod = Ext.getCmp('cmbPeriodID').getValue()
																var qc = Ext.getCmp('qcCmbGrapID').getValue()
																// generateGraps(selectionID,idPeriod,Ext.encode(cmbVar.getValue()),qc)
																generateGraps(selectionID,idPeriod,"ALL",qc)

															}
														}
													});														
													btonReturn= new Ext.Button({
														pressedCls : 'my-pressed',
														overCls : 'my-over',
														tooltip: "Return to map",
														text:'Return to map',
														icon: icons+'map.png', 
														scale: 'small',
														handler: function(){
															tabs.setActiveTab(0);
														}													
													});	
													if(Ext.getCmp('graphic_tab')){
														tabs.remove(Ext.getCmp('graphic_tab'), true);
													}												

													tabs.add({
														// contentEl: "desc",
														// xtype: 'panel',
														title: 'Graph '+statName,//'Graphic_id'+selectionID
														name: 'graphic_tab',
														// width:mainPanelWidth-15,
														// height: mainPanelHeight,
														autoScroll: true,
														// height: 100,
														// autoHeight: true,
														// layout: 'fit',
														id: 'graphic_tab',
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
															items: [cmbPeriod,cmbqc,{xtype: 'tbfill'},btonReturn]
															}
														]													
													});		
													
													var t = new Ext.XTemplate(tpl);
													Ext.getCmp('graphic_tab').update(t.apply(datatest));
													// Ext.getCmp('graphic'+selectionID).update('This<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long');
													
													Ext.getCmp('mapPanelID').setHeight(0)
													Ext.getCmp('tabsID').setWidth(mainPanelWidth-15);
													// Ext.getCmp('tabsID').setHeight(mainPanelHeight*0.2);
													tabs.setActiveTab('graphic_tab');
													
													// generateGraps(selectionID,cmbPeriod.getValue(),Ext.encode(cmbVar.getValue()),'raw')
													generateGraps(selectionID,cmbPeriod.getValue(),"ALL",'raw')

												
											}, // handler
										   isDisabled: function(view, rowIndex, colIndex, item, record) {
														// Returns true if 'editable' is false (, null, or undefined)
														// var c = record.get('copyright');
														// console.log(c)
														// return !record.get('copyright')';
														// if (c == 'Restricted' || c == 'Request') {
															// return false;
														// }
													}											
											
										}]
									},								
									
									{ text: 'download',minWidth: 80,dataIndex: 'copyright', flex: 3,tdCls: 'x-change-cell'},
									{ text: 'code',minWidth: 70,dataIndex: 'code', flex: 1,tdCls: 'x-change-cell'},
									{ text: 'name',minWidth: 120,dataIndex: 'name', flex: 4,tdCls: 'x-change-cell'},
									{ text: 'institute',minWidth: 70,dataIndex: 'institute', flex: 3,tdCls: 'x-change-cell'},
									{ text: 'model',minWidth: 80,dataIndex: 'model', flex: 2,tdCls: 'x-change-cell'},
									{ text: 'variables',minWidth: 120,dataIndex: 'variables', flex: 4,tdCls: 'x-change-cell'},
									{ text: 'elevation (m)',minWidth: 80,dataIndex: 'elev', flex: 2,tdCls: 'x-change-cell'},
									{ text: 'category',minWidth: 100,dataIndex: 'category', flex: 3,tdCls: 'x-change-cell'},
									{ text: 'instalation',minWidth: 80,dataIndex: 'instalation', flex: 3,tdCls: 'x-change-cell'},
									{ text: 'suspension',minWidth: 80,dataIndex: 'suspension', flex: 3,tdCls: 'x-change-cell'},
									{ text: 'quality',minWidth: 70,dataIndex: 'ctrl_quali_var', flex: 1,tdCls: 'x-change-cell'},									
									// { text: 'country',minWidth: 80,dataIndex: 'country', flex: 4,tdCls: 'x-change-cell'},
									{ text: 'state',minWidth: 80,dataIndex: 'state', flex: 4,tdCls: 'x-change-cell'},
									{ text: 'city',minWidth: 90,dataIndex: 'city', flex: 4,tdCls: 'x-change-cell'}
									
								],
								columnLines: true,
				

								stripeRows: true,
								// margin: '0 0 20 0',
								selModel: selModel2,
								viewConfig: { 
									stripeRows: false, 
									getRowClass: function(record, index, rowParams, stor) {
									   var c = record.get('copyright');
									   // return id == '1' ? 'general-rule' : ''; // para desaparecer el check
										if (c == 'Restricted' || c == 'Request') {
											return 'price-fall';
										} 
									}	
								},
								listeners: {
									beforeselect: function ( row, model, index ) {

										if ( model.data.copyright == "Restricted" || model.data.copyright == 'Request') {
											return false;
										}
									},
									cellclick: function(view, td, cellIndex, record, tr, rowIndex, e, eOpts) {
										// var selection = gridRegion.getView().getSelectionModel().getCount();//[0];
										// console.log(view)									
									},
									callback: function (records, operation, success) {        
									},
									selectionchange: function(sm, selections){ // hay problema cuando se selecciona el cursor vuelve a la primera fila
										layerTempSel.destroyFeatures();
										gridRegion.down('#numRecordsSelected').setText('Selected: ' + selections.length);
										feature = layerTempStat.features;
										for (var i = feature.length - 1; i >= 0; --i) {
												idall=feature[i].attributes.id;
												for (var k = selections.length - 1; k >= 0; --k) {
													idsel=selections[k].data.id
													if(idall==idsel){
														var point = new OpenLayers.Feature.Vector(
															new OpenLayers.Geometry.Point(feature[i].geometry.x, feature[i].geometry.y));	
														layerTempSel.addFeatures([point]);
														mapPanel.map.setLayerIndex(layerTempSel, 99); // 99 para colocar el layer de primero
													}
												}												
											// }											
										}
									},
									itemclick:function(view, record, item, index, e ) {
									},
									select: function(selModel, record, index, options) {
										var selection = gridRegion.getView().getSelectionModel();//[0];
										var number_of_selected_records = selection.getSelection().length;
										var name = Ext.getCmp('numRecordsSelected').setText( 'Selected: ' + number_of_selected_records);
									}									
								},
								// inline buttons
								dockedItems: [
									{
									xtype: 'toolbar',
									items: [{
										itemId: 'removeButton',
										text:'Download',
										tooltip:'Download data',
										icon   : iconGridDownload,
										// disabled: true,
										handler: btn_download 
									},//,qualitycCmb,
									// {
										// width: 250,
										// fieldLabel: 'Search',
										// labelWidth: 40,
										// xtype: 'searchfield',
										// store: gridRegionStore
									// },									
									{
										itemId: 'zoomExtentALL',
										text:'Zoom extent',
										tooltip:'Zoom extent all stations',
										icon   : iconGridzoomExtentALL,//iconCls:'add',
										handler: onZoomExtentALL 
									},
									// ,{
										// itemId: 'idExpand',
										// text:'Expand all',
										// tooltip:'Expand all',
										// iconCls:iconGridExpand,
										// handler: expand 
									// }
									{
									
										itemId: 'idstatistic',
										text:'Statistics',
										tooltip:'Summary Statistic',
										icon   : iconGridStatistics,
										disabled: true,
										handler: statistics 
									},
									// { xtype: 'tbtext', itemId: 'numRecords', id:'numRecords' },
									{
										xtype: 'component',
										itemId: 'status',
										tpl: 'Records: {count}',
										style: 'margin-right:5px'
									},									
									{ xtype: 'tbtext', itemId: 'numRecordsSelected', id:'numRecordsSelected' },
									{xtype: 'tbfill'},
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

							gridRegionStore.on('load', function(ds){
								countRow=ds.getTotalCount()
								// copyrightp=[]
								// for(var i = 0; i < countRow; i++) {
									// if(ds.getAt(i).get('copyright')=="Free"){
										// console.log(ds.getAt(i).get('copyright'))
									// }
									
									// copyrightp.push(ds.getAt(i).get('copyright'));
								// }
								// var a = copyrightp.indexOf("Free");
								// gridRegion.down('#removeButton').setDisabled(a==-1)	
								
								if(countRow>=1){
									// winRegion.show()
									// Ext.getCmp('gridRegionID').add(gridRegion);
									// Ext.getCmp('gridRegionID').doLayout();
									Ext.getCmp('mainTableID').add(gridRegion);
									// gridRegion.down('#numRecords').setText('Records: ' + countRow);
									gridRegion.down('#numRecordsSelected').setText('Selected: ' + 0);
									Ext.getCmp('mainTableID').expand()
									myMask.hide();
									
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
									myMask.hide();
								}	
							});	

							} // function getid
						}// if country	
					} // fin if
				}
			},{
				text: 'Reset',
				handler: function(){
					var storecity = Ext.getCmp('cityCmbID');  
					var storestate = Ext.getCmp('stateCmbID');  
					storecity.disable();	
					storestate.disable();	
					
					clusters.setVisibility(true)
					if(Ext.getCmp('popupID')){
						Ext.getCmp('popupID').close()
					}			
					drawPolygon.control.deactivate();
					if(Ext.getCmp('gridRegionID_1')){
						Ext.getCmp('mainTableID').collapse();
						Ext.getCmp('gridRegionID_1').destroy();	
					}				
					selectControl.control.unselectAll();
					tabSearchRegion.getForm().reset();
					// layerTempReg=mapPanel.map.getLayersByName("Search_region")[0]
					// if(layerTempReg){layerTempReg.destroyFeatures();mapPanel.map.removeLayer(layerTempReg);}
					layerTempRegion.destroyFeatures();
					
					layerTempStat=mapPanel.map.getLayersByName("Search station")[0]
					if(layerTempStat){
						layerTempStat.destroyFeatures();
						// mapPanel.map.removeLayer(layerTempStat);
					}	

					layerTempSel.destroyFeatures()
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
				{ name: 'iso', type: 'string' },
				{ name: 'inst', type: 'string' }
			]
		});
	var statstore = Ext.create('Ext.data.Store', {
		model: 'modelstatList',
		autoLoad: true,
		autoSync: true,
		// sorters: { property: 'name', direction : 'ASC' },
		proxy: {
			type: 'ajax',
			url: 'php/Geo_statByregion-test.php',
			extraParams: {radioCh: 2,type:8},
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
		// disabled: true,
		valueField: 'name', 
		queryMode: 'local',
		typeAhead: true,	
		store: statstore,
		listConfig: {
			getInnerTpl: function() {
				return '<div data-qtip="id:{id}|{iso}|{inst}">{name}</div>';
			}
		}		
	});	

// ##########################################  groupByStation ######################################################################
	
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
        items: [/*radiosStat,*/cmbStat,
		{	buttonAlign:'center',
			bodyStyle: 'padding-top:5px; border-bottom:1px solid #CCCCCC; width:80px;',
			buttons: [{
				text: 'Search',
				handler: function(){
					if(Ext.getCmp('cmbStatID').getValue()){//if(tabSearchStat.getForm().isValid()){
						if(Ext.getCmp('popupID')){
							Ext.getCmp('popupID').close()
						}					
						polygonDraw.destroyFeatures();
						drawPolygon.control.deactivate();
						radioCh = 2//Ext.getCmp('radioBton').getChecked()[0].getGroupValue();
					
						getStat = cmbStat.getValue();
						// layerTemp=mapPanel.map.getLayersByName("Search_region")[0]
						// if(layerTemp){layerTemp.destroyFeatures();mapPanel.map.removeLayer(layerTemp);}
						layerTempRegion.destroyFeatures();
						
						// FindStation=mapPanel.map.getLayersByName("Search station")[0]
						// if(FindStation){FindStation.destroyFeatures();mapPanel.map.removeLayer(layerTemp);}		
						
						if(Ext.getCmp('popupID')){
							Ext.getCmp('popupID').close()
						}						
						if(Ext.getCmp('gridRegionID')){
							Ext.getCmp('mainTableID').collapse();
							Ext.getCmp('gridRegionID').destroy();	
						}
						if(Ext.getCmp('gridRegionID_1')){
							Ext.getCmp('mainTableID').collapse();
							Ext.getCmp('gridRegionID_1').destroy();
						}						
						if(getStat){
							clusters.setVisibility(false)
							Ext.Ajax.request({ // PINTA EN EL MAPA LAS ESTACIONES INTERCEPTADAS
								url : 'php/Geo_statByregion-test.php' , 
								params : {type:9,getStat:getStat,radioCh:radioCh},
								method: 'GET',
								success: function ( result, request ) {
									layerTemp=mapPanel.map.getLayersByName("Search station")[0]
									if(layerTemp){
										layerTemp.destroyFeatures();
										// mapPanel.map.removeLayer(layerTemp);
									}
									
									geocapa = result.responseText;
									var format = new OpenLayers.Format.GeoJSON({'internalProjection': new OpenLayers.Projection("EPSG:900913"), 'externalProjection': new OpenLayers.Projection("EPSG:4326")
									});
									if(format.read(geocapa)[0]){
										mapPanel.map.addLayer(layerTempStat);
										layerTemp=mapPanel.map.getLayersByName("Search station")[0]
										layerTemp.addFeatures(format.read(geocapa));
										var FeatselectID=[]										
										for (var i = layerTemp.features.length - 1; i >= 0; --i) {
											// selectFeature.select(layerTemp.features[i]);
											FeatselectID.push(layerTemp.features[i].attributes.id)
										}
										getid(FeatselectID)										
									}
									var BoundALL = layerTemp.getDataExtent();
									// var bounds = layerTemp.getBounds();
									// mapPanel.map.panTo(BoundALL.getCenterLonLat())
									// mapPanel.map.zoomToExtent(BoundALL);	
									// mapPanel.map.zoomTo(13);
									mapPanel.map.setCenter(BoundALL.getCenterLonLat(), 12);
									
									
								},
								failure: function ( result, request) { 
									Ext.MessageBox.alert('Failed', result.responseText);
								}
							});	
							// mapPanel.map.zoomTo(13);
							 ////////////////////////////////////////////////////////////////////////////////////////
							// PARA EXTRAER LA INFORMACION DE LAS ESTACIONES EN UNA TABLA
							 ////////////////////////////////////////////////////////////////////////////////////////
							function getid(selectID){
								var qcstore = Ext.create('Ext.data.Store', {
									model: 'modelQC',
									autoLoad: true,
									autoSync: true,
									sorters: { property: 'name', direction : 'ASC' },

									proxy: {
										type: 'ajax',
										url: 'php/Geo_statByregion-test.php',
										extraParams: {type:29,listStatSel:Ext.encode(selectID)},
										actionMethods: {
											read: 'POST'//'POST'
										},												
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
												  description: 'ALL'
												  
											  }]),
											  store.insert(1, [{
												  id: 1,
												  name: 'raw',
												  description: 'Original data'
												  
											  }]);														  
										 }
									  }								
								});	
								qualitycCmb = Ext.create('Ext.form.field.ComboBox', { 
									fieldLabel: 'Quality control:',
									labelWidth:90,
									editable: false, 
									value: 'ALL',
									multiSelect: false, 
									displayField: 'name',
									valueField: 'name', 
									id:'qcCmbID',
									queryMode: 'local',
									typeAhead: true,	
									store: qcstore,
									width: 180,												
									listConfig: {
										getInnerTpl: function() {
											return '<div data-qtip="{description}">{name}</div>';
										}
									},
									listeners: {
										select: function() {
											// var qc = Ext.getCmp('qcCmbID').getValue()
											// var selection = gridRegion.getView().getSelectionModel();//[0];
											// getdata=gridRegion.getStore().data.items
											// console.log(getdata)
											// for(var i = 0; i < getdata.length; i++) {
												// if(getdata[i].data.quality==qc){
													// selection.select(i,true);
												// }
											// }
											// var number_of_selected_records = selection.getSelection().length;
											// var name = Ext.getCmp('numRecordsSelected').setText( 'Found: ' +number_of_selected_records);														
										}
									}											
								});		
								var qcstoreGrap = Ext.create('Ext.data.Store', {
									model: 'modelQC',
									autoLoad: true,
									autoSync: true,
									sorters: { property: 'name', direction : 'ASC' },

									proxy: {
										type: 'ajax',
										url: 'php/Geo_statByregion-test.php',
										extraParams: {type:29,listStatSel:Ext.encode(selectID)},
										actionMethods: {
											read: 'POST'//'POST'
										},												
										reader: {
											type: 'json',
											root: 'topics'
										}
									},
									listeners: {
										 load: function(store, records) {
											  store.insert(0, [{
												  id: 0,
												  name: 'raw',
												  description: 'Original data'
												  
											  }]);														  
										 }
									  }								
								});
							
								var gridRegionStore = Ext.create('Ext.data.Store', {
									model: 'modelGridRegion',
									autoLoad: true,
									autoSync: true,
									sorters: { property: 'name', direction : 'ASC' },
									proxy: {
										type: 'ajax',
										url: 'php/Geo_statByregion-test.php',
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
									url: 'php/Geo_statByregion-test.php',
									extraParams: {type:11,getStat:getStat,radioCh:radioCh},			
									actionMethods: {
										read: 'POST'
									},									
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
								MaximizeSta	 = function () {
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
								var selModel = Ext.create('Ext.selection.CheckboxModel', {
								mode: 'SIMPLE',
								listeners: {
									selectionchange: function(sm, selections) {
										gridRegion.down('#removeButton').setDisabled(selections.length === 0);
										gridRegion.down('#idstatistic').setDisabled(selections.length === 0);
									}
								},
								select: function(records, keepExisting, suppressEvent) {
									if (Ext.isDefined(records)) {
										this.doSelect(records, keepExisting, suppressEvent);
									}
								},
								selectAll: function( suppressEvent ) {
									var me = this,
										selections = me.store.getRange();
									countFree=[]
									for( var key in selections ) {
										if( selections[key].data.copyright == 'Free'){
											countFree.push(selections[key].data.copyright)
										}
									}
									
									if(countFree.length>150){
										winInfo=Ext.MessageBox.show({
										   title: 'Information',
										   msg: 'Exceeds the maximum number (Max. 150) of downloads',
										   width:300,
										   buttons: Ext.MessageBox.OK,
										   animateTarget: 'info',
										   icon: 'x-message-box-info'
										});	
										winInfo.setPosition(mainPanelWidth/3,mainPanelHeight/2);
									}else{
										var i = 0,
											len = selections.length,
											selLen = me.getSelection().length;
											
										// if( len != selLen ) {
										if( selLen==0 ) {
											me.bulkChange = true;
											for (; i < len; i++) {
												me.doSelect(selections[i], true, suppressEvent);
											}
											delete me.bulkChange;
											me.maybeFireSelectionChange(me.getSelection().length !== selLen);
										}
										else {
											me.deselectAll( suppressEvent );
										}									
									}
								}//								
								
							});	
								/*btn_download = function () {
								var selection = gridRegion.getView().getSelectionModel().getSelection();//[0];
								selgrid=new Array()
								for(var i = 0; i < selection.length; i++) {
									selgrid.push(Number(selection[i].data.id));
								}
								var qc = Ext.getCmp('qcCmbID').getValue()
								// console.log(cmbVar.getValue())
								Ext.DomHelper.append(document.body, {
								  tag: 'iframe',
								  id:'downloadIframe',
								  frameBorder: 0,
								  width: 0,
								  height: 0,
								  css: 'display:none;visibility:hidden;height: 0px;',
								  src: 'php/dowloaddata.php?qc='+qc+'&station='+Ext.encode(selgrid)+'&'+'country=null'+'&'+'state=null'+'&'+'municip=null'+'&'+'variable='+cmbVar.getValue()//Ext.encode(cmbVar.getValue())
								});
							}	*/

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
									// maxHeight: Ext.getBody().getViewSize().height*0.3,
									width: mainPanelWidth,
									height:273,
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
													layerTemp=mapPanel.map.getLayersByName("Search station")[0]
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
													statName = rec.get('name');
													copyrightN = rec.get('copyright');
														var periodst = Ext.create('Ext.data.Store', {
																fields: ['value','name'], 
																data: [ 
																	{value:1,name: 'Daily'}, 
																	{value:2,name: 'Monthly'}, 
																	{value:3,name: 'Yearly'}
																]																	
														})													
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
															'<div class="grap" id="grap_temp_'+selectionID+'" style="width:'+grapWidth+'px;"></div>',
															'<tpl for="rowTitleArr">',
															'<div class="grap" id="grap_{.}_'+selectionID+'" style="width:'+grapWidth+'px;"></div>',
															'</tpl>'
															];	

														cmbPeriod='cmbPeriod'+selectionID
														cmbPeriod=Ext.create('Ext.form.field.ComboBox', { 
															fieldLabel: 'Select graphic model',
															id:'cmbPeriodID',
															labelWidth:150,
															store: periodst,
															displayField: 'name',
															value: 1,
															queryMode: 'local',
															valueField: 'value', 								
															typeAhead: true,
															listeners: {
																select: function() {
																	var actTab = tabs.getActiveTab();
																	var idx = tabs.items.indexOf(actTab);
																	// actTabId=parseInt((actTab.title).match(/\d+/)[0])
																	var idPeriod = Ext.getCmp('cmbPeriodID').getValue()
																	var qc = Ext.getCmp('qcCmbGrapID').getValue()
																	if (copyrightN == 'Free') {
																		generateGraps(selectionID,idPeriod,Ext.encode(cmbVar.getValue()),qc)
																	}else if (copyrightN != 'Free' && idPeriod==1){
																		winInfo=Ext.MessageBox.show({
																		   title: 'Information',
																		   msg: 'Sorry, You are not authorized to download data.',
																		   width:300,
																		   buttons: Ext.MessageBox.OK,
																		   animateTarget: 'error',
																		   icon: 'x-message-box-error'
																		   
																		});	
																		winInfo.setPosition(mainPanelWidth/3,mainPanelHeight/2);																			
																		Ext.getCmp('cmbPeriodID').setValue(3);
																	}else if (copyrightN != 'Free' && idPeriod==2 ){
																		winInfo=Ext.MessageBox.show({
																		   title: 'Information',
																		   msg: 'Sorry, You are not authorized to download data.',
																		   width:300,
																		   buttons: Ext.MessageBox.OK,
																		   animateTarget: 'error',
																		   icon: 'x-message-box-error'
																		   
																		});	
																		winInfo.setPosition(mainPanelWidth/3,mainPanelHeight/2);
																		Ext.getCmp('cmbPeriodID').setValue(3);
																	}
																}
															}
														});	
														if (copyrightN != 'Free') {
														Ext.getCmp('cmbPeriodID').setValue(3);
														}else{Ext.getCmp('cmbPeriodID').setValue(1);}
															
														cmbqc='cmbqc'+selectionID
														cmbqc=Ext.create('Ext.form.field.ComboBox', { 
															fieldLabel: 'Quality control:',
															labelWidth:90,
															editable: false, 
															value: 'raw',
															multiSelect: false, 
															displayField: 'name',
															valueField: 'name', 
															id:'qcCmbGrapID',
															queryMode: 'local',
															typeAhead: true,
															store: qcstoreGrap,
															width: 180,												
															listConfig: {
																getInnerTpl: function() {
																	return '<div data-qtip="{description}">{name}</div>';
																}
															},														
															listeners: {
																select: function() {
																	var actTab = tabs.getActiveTab();
																	var idx = tabs.items.indexOf(actTab);
																	// actTabId=parseInt((actTab.title).match(/\d+/)[0])
																	var idPeriod = Ext.getCmp('cmbPeriodID').getValue()
																	var qc = Ext.getCmp('qcCmbGrapID').getValue()
																	generateGraps(selectionID,idPeriod,Ext.encode(cmbVar.getValue()),qc)

																}
															}
														});														
														btonReturn= new Ext.Button({
															pressedCls : 'my-pressed',
															overCls : 'my-over',
															tooltip: "Return to map",
															text:'Return to map',
															icon: icons+'map.png', 
															scale: 'small',
															handler: function(){
																tabs.setActiveTab(0);
															}													
														});	
														if(Ext.getCmp('graphic_tab')){
															tabs.remove(Ext.getCmp('graphic_tab'), true);
														}												

														tabs.add({
															// contentEl: "desc",
															// xtype: 'panel',
															title: 'Graph '+statName,//'Graphic_id'+selectionID
															name: 'graphic_tab',
															// width:mainPanelWidth-15,
															// height: mainPanelHeight,
															autoScroll: true,
															// height: 100,
															// autoHeight: true,
															// layout: 'fit',
															id: 'graphic_tab',
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
																items: [cmbPeriod,cmbqc,{xtype: 'tbfill'},btonReturn]
																}
															]													
														});		
														
														var t = new Ext.XTemplate(tpl);
														Ext.getCmp('graphic_tab').update(t.apply(datatest));
														// Ext.getCmp('graphic'+selectionID).update('This<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long');
														
														Ext.getCmp('mapPanelID').setHeight(0)
														Ext.getCmp('tabsID').setWidth(mainPanelWidth-15);
														// Ext.getCmp('tabsID').setHeight(mainPanelHeight*0.2);
														tabs.setActiveTab('graphic_tab');
														generateGraps(selectionID,cmbPeriod.getValue(),Ext.encode(cmbVar.getValue()),'raw')

													
												}, // handler											
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
										{ text: 'download',minWidth: 50,dataIndex: 'copyright', flex: 3,tdCls: 'x-change-cell'},
										{ text: 'id',minWidth: 50,dataIndex: 'id', flex: 1,tdCls: 'x-change-cell'},
										{ text: 'code',minWidth: 80,dataIndex: 'code', flex: 1,tdCls: 'x-change-cell'},
										{ text: 'name',minWidth: 120,dataIndex: 'name', flex: 4,tdCls: 'x-change-cell'},
										{ text: 'institute',minWidth: 50,dataIndex: 'institute', flex: 3,tdCls: 'x-change-cell'},
										{ text: 'model',minWidth: 80,dataIndex: 'model', flex: 2,tdCls: 'x-change-cell'},
										
										// { text: 'category',minWidth: 100,dataIndex: 'category', flex: 4},

										// { text: 'instalation',minWidth: 80,dataIndex: 'instalation', flex: 3},
										// { text: 'quality',minWidth: 80,dataIndex: 'quality', flex: 1},
										
										{ text: 'variables',minWidth: 100,dataIndex: 'variables', flex: 4,tdCls: 'x-change-cell'},
										
										
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
											'| <b>suspension:</b> {suspension} ',
											'| <b>quality:</b> {ctrl_quali_var} ',
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
									viewConfig: { 
										stripeRows: false, 
										getRowClass: function(record, index, rowParams, stor) {
										   var c = record.get('copyright');
										   // return id == '1' ? 'general-rule' : ''; // para desaparecer el check
											if (c == 'Restricted' || c == 'Request') {
												return 'price-fall';
											} 
										}	
									},
									listeners: {
										beforeselect: function ( row, model, index ) {
											if ( model.data.copyright == "Restricted" || model.data.copyright == 'Request') {
												return false;
											}
										},
										selectionchange: function(sm, selections){ // hay problema cuando se selecciona el cursor vuelve a la primera fila
											// layerTempSel.removeAllFeatures();
											layerTempSel.destroyFeatures();
											// gridRegion.down('#numRecordsSelected').setText('Selected: ' + selections.length);
											feature = layerTempStat.features;
											for (var i = feature.length - 1; i >= 0; --i) {
												// for (var j = feature[i].cluster.length - 1; j >= 0; --j) {
													idall=feature[i].attributes.id;
													for (var k = selections.length - 1; k >= 0; --k) {
														idsel=selections[k].data.id
														if(idall==idsel){
															// feature[i].layer.styleMap.styles.default.rules[0].symbolizer.externalGraphic="iconosGIS/bloqE_16px.png" 
															// layerTempSel.drawFeature(feature[i])
															 // mapPanel.map.refresh();	
															var point = new OpenLayers.Feature.Vector(
																new OpenLayers.Geometry.Point(feature[i].geometry.x, feature[i].geometry.y));	
															layerTempSel.addFeatures([point]);
															mapPanel.map.setLayerIndex(layerTempSel, 99);
														}
													}												
												// }											
											}
										},
										select: function(selModel, record, index, options) {
											// var selection = gridRegion.getView().getSelectionModel();//[0];
											// var number_of_selected_records = selection.getSelection().length;
											// var name = Ext.getCmp('numRecordsSelected').setText( 'Selected: ' + number_of_selected_records);
										}									
									},
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
										},cmbVar,qualitycCmb,{
											itemId: 'zoomExtentALL',
											text:'Zoom extent',
											tooltip:'Zoom extent all stations',
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
										},{ xtype: 'tbtext', itemId: 'numRecords' },
										// { xtype: 'tbtext', itemId: 'numRecordsSelected', id:'numRecordsSelected' },
										{xtype: 'tbfill'},
										{ 
											itemId: 'idMaximo',
											// text:'Maximize',
											tooltip:'Maximize/Minimize table',
											icon   : iconGridMaximize,
											// stretch: false,
											align: 'right',
											handler: MaximizeSta,
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
											url: 'php/Geo_statByregion-test.php',
											extraParams: {
												idstat: record.get("id"),getStat:getStat,radioCh:radioCh,type:12
											},
											actionMethods: {
												read: 'POST'
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
										columns: [
										// {
												// xtype: 'actioncolumn',
												// width: 150,
												// autoSizeColumn: true,
												// items: [{
													// icon   : icons+'buttons/download_off.gif',  // Use a URL in the icon config
													// tooltip: 'zoom extent2',
													// handler: function(grid, rowIndex, colIndex) {
														// var rec = store.getAt(rowIndex);
														// idstat=rec.get('idstat')
														// idvar=rec.get('idvar')
														// Ext.DomHelper.append(document.body, {
														  // tag: 'iframe',
														  // id:'downloadIframe',
														  // frameBorder: 0,
														  // width: 0,
														  // height: 0,
														  // css: 'display:none;visibility:hidden;height: 0px;',
														  // src: 'php/dowloaddata.php?typedwn=selection&station='+Ext.encode([idstat])+'&'+'variable='+Ext.encode([idvar])
														// });
													
													// }
												// }]
											// },
											{ text: 'name',dataIndex: 'name'},
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
										gridRegion.down('#numRecords').setText('Rows: ' + countRow);
										// gridRegion.down('#numRecordsSelected').setText('Selected: ' + 0);
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
										myMask.hide();
									}	
								});	
							
							}
						}
						
					}
				}			
			},{
				text: 'Reset',
				handler: function(){
					clusters.setVisibility(true)
					if(Ext.getCmp('popupID')){
						Ext.getCmp('popupID').close()
					}				
					drawPolygon.control.deactivate();
					if(Ext.getCmp('gridRegionID')){
						Ext.getCmp('mainTableID').collapse();
						Ext.getCmp('gridRegionID').destroy();	
					}		
					selectControl.control.unselectAll();
					Ext.getCmp("cmbStatID").reset();
					tabSearchStat.getForm().reset();
					// layerTempReg=mapPanel.map.getLayersByName("Search_region")[0]
					// if(layerTempReg){layerTempReg.destroyFeatures();mapPanel.map.removeLayer(layerTempReg);}
					layerTempRegion.destroyFeatures();
					
					layerTempStat=mapPanel.map.getLayersByName("Search station")[0]
					if(layerTempStat){
						layerTempStat.destroyFeatures();
						// mapPanel.map.removeLayer(layerTempStat);
					}
					
					layerTempSel.destroyFeatures()
				}		
			}]
		}]
			  
    };


	var queryStore = Ext.create('Ext.data.Store', {
		fields: ['id','name'], 
		data: [ 
			{"id":"1","name": 'Age'}, 
			{"id":"2","name": 'Variable'}, 
			{"id":"3","name": 'Download'}, 
			{"id":"13","name": 'Status'}, 
			{"id":"4","name": 'Elevation'}, 
			// {"id":"5","name": 'Coordinates'}, 
			{"id":"14","name": 'Start date'}, 
			{"id":"15","name": 'End date'}, 
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
				{ name: 'name', type: 'string' }
			]
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
				// for (var i=0, l=Ext.getCmp('buttongroupCondID').items.items.length; i < l; i++) {
					// console.log(Ext.getCmp('buttongroupCondID').items.items[i].id);
					// if(Ext.getCmp('buttongroupCondID').items.items[i].id=='textCondValueID'){
						// fieltext=true
					// }else{fieltext=false}
				// }
				if(combo.getValue()==14 || combo.getValue()==15){
					// if(fieltext==false){
						// Ext.getCmp('buttongroupCondID').remove(Ext.getCmp('cmbCondValueID'));		
						// Ext.getCmp('buttongroupCondID').add(Ext.getCmp('textCondValueID'))
					// }
				}else{
					// if(fieltext==true){
						// Ext.getCmp('buttongroupCondID').remove(Ext.getCmp('textCondValueID'));
						// var condValStore = Ext.create('Ext.data.Store', {
							// model: 'modelCondVal',
							// proxy: {
								// type: 'ajax',
								// url: 'php/Geo_statByregion-test.php',
								// reader: {
									// type: 'json',
									// root: 'topics'
								// }
							// }
						// });		
						// var cmbCondValue = Ext.create('Ext.form.field.ComboBox', {
								// id:'cmbCondValueID', 
								// width:cmbCondValuewidth,
								// store:condValStore,
								// valueField: 'id',                     
								// displayField: 'name',
								// queryMode: 'local',
								// typeAhead: true,
								// disabled: true		

						// })
							
						// Ext.getCmp('buttongroupCondID').add(cmbCondValue)	
						// var storestate = Ext.getCmp('cmbCondValueID');
						// storestate.enable();
						// storestate.clearValue();  
						// storestate.getStore().load({
							// params: {idCond: combo.getValue(),type:18}, // callback: function(records, operation, success) {console.log(records);} // para comprobar 
						// });						
					// }
				}
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
			url: 'php/Geo_statByregion-test.php',
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
	
	var condValStore = Ext.create('Ext.data.Store', {
		model: 'modelCondVal',
		// autoLoad: true,
		// autoSync: true,		
		proxy: {
			type: 'ajax',
			url: 'php/Geo_statByregion-test.php',
			reader: {
				type: 'json',
				root: 'topics'
			}
		}
	});		
	var cmbCondValue = Ext.create('Ext.form.field.ComboBox', {
            id:'cmbCondValueID', 
			width:cmbCondValuewidth,
			store:condValStore,
			valueField: 'id',                     
			displayField: 'name',
			queryMode: 'local',
			typeAhead: true,
			disabled: true		

	})
	var textCondValue = Ext.create('Ext.form.field.Text', {
            id:'textCondValueID', 
			width:cmbCondValuewidth,
			value:'2000-01-01'
	})	
	
	var cmbCondType = Ext.create('Ext.form.field.ComboBox', {
            id:'cmbCondTypeID', 
			fieldLabel:'Match in',
			width:cmbCondTypewidth,
			labelWidth:60,
            store:condTypeStore,
			value:'all',
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
        title: 'Advanced query station   '+ '<img id="help_toolip" class="tooltipIcon" src='+icons+infoB+' data-qtip="'+toolip_groupByQuery+'" />',//<span data-qtip="hello">First Name</span>  
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
									url: 'php/Geo_statByregion-test.php',
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
									url: 'php/Geo_statByregion-test.php',
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
					text:'Search',
					icon: icons+'find.png',
					width:65,
					handler: function(){
						Ext.getCmp('buttongroupCondID').doLayout();
						polygonDraw.destroyFeatures();
						drawPolygon.control.deactivate();
						
						if(Ext.getCmp('popupID')){
							Ext.getCmp('popupID').close()
						}		
						if(Ext.getCmp('gridRegionID')){
							Ext.getCmp('mainTableID').collapse();
							Ext.getCmp('gridRegionID').destroy();	
						}
						if(Ext.getCmp('gridRegionID_1')){
							Ext.getCmp('mainTableID').collapse();
							Ext.getCmp('gridRegionID_1').destroy();
						}						
						// loading status
						// var myMask = new Ext.LoadMask(Ext.getCmp('mapPanelID'), {msg:"Please wait..."});
												
						// layerTemp=mapPanel.map.getLayersByName("Search station")[0]
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
								// handler: function(){if(layerTemp){layerTemp.destroyFeatures();mapPanel.map.removeLayer(layerTemp);}},
								id:'myAjaxID',
								listeners : {        
									beforerequest : function () {myMask.show();},
									// requestcomplete : function () {myMask.hide();}
								}
							});	
							
							checkCond=[]
							var i,j,temparray,chunk = 3;
							for (i=0,j=children.length; i<j; i+=chunk) {
								temparray = children.slice(i,i+chunk);
								if(temparray[0] && temparray[1] && temparray[2]){
								}else{
									checkCond.push(temparray);
								}

							}	
							if(checkCond.length==0){
								clusters.setVisibility(false)
								myAjax.request({ // PINTA EN EL MAPA LAS ESTACIONES INTERCEPTADAS
									url : 'php/Geo_statByregion-test.php' , 
									params : { type:19,condit : cond, children:Ext.encode(children)},
									method: 'POST',
									success: function ( result, request ) {
										layerTemp=mapPanel.map.getLayersByName("Search station")[0]
										if(layerTemp){layerTemp.destroyFeatures();}
										
										// layerTempRegion=mapPanel.map.getLayersByName("Search_region")[0]
										// if(layerTempRegion){layerTempRegion.destroyFeatures();}	
										layerTempRegion.destroyFeatures();
										
										geocapa = result.responseText;
										var format = new OpenLayers.Format.GeoJSON({'internalProjection': new OpenLayers.Projection("EPSG:900913"), 'externalProjection': new OpenLayers.Projection("EPSG:4326")
										});

										if(format.read(geocapa)[0]){
											mapPanel.map.addLayer(layerTempStat);
											layerTemp=mapPanel.map.getLayersByName("Search station")[0]
											layerTemp.addFeatures(format.read(geocapa));
											selectID=[]
											feature = layerTemp.features;
											for (var i = feature.length - 1; i >= 0; --i) {
														sel=feature[i].attributes.id;
														selectID.push(sel)
											}

											// ##############################################################    TABLA GRID ##################################
											var qcstore = Ext.create('Ext.data.Store', {
												model: 'modelQC',
												autoLoad: true,
												autoSync: true,
												sorters: { property: 'name', direction : 'ASC' },

												proxy: {
													type: 'ajax',
													url: 'php/Geo_statByregion-test.php',
													extraParams: {type:29,listStatSel:Ext.encode(selectID)},
													actionMethods: {
														read: 'POST'//'POST'
													},												
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
															  description: 'ALL'
															  
														  }]),
														  store.insert(1, [{
															  id: 1,
															  name: 'raw',
															  description: 'Original data'
															  
														  }]);														  
													 }
												  }								
											});	
											qualitycCmb = Ext.create('Ext.form.field.ComboBox', { 
												fieldLabel: 'Quality control:',
												labelWidth:90,
												editable: false, 
												value: 'ALL',
												multiSelect: false, 
												displayField: 'name',
												valueField: 'name', 
												id:'qcCmbID',
												queryMode: 'local',
												typeAhead: true,	
												store: qcstore,
												width: 180,												
												listConfig: {
													getInnerTpl: function() {
														return '<div data-qtip="{description}">{name}</div>';
													}
												},
												listeners: {
													select: function() {
														var qc = Ext.getCmp('qcCmbID').getValue()
														var selection = gridRegion.getView().getSelectionModel();//[0];
														// getdata=gridRegion.getStore().data.items
														// for(var i = 0; i < getdata.length; i++) {
															// if(getdata[i].data.quality==qc){
																// selection.select(i,true);
															// }
														// }
														var number_of_selected_records = selection.getSelection().length;
														var name = Ext.getCmp('numRecordsSelected').setText( 'Found: ' +number_of_selected_records);														
													}
												}											
											});		
											var qcstoreGrap = Ext.create('Ext.data.Store', {
												model: 'modelQC',
												autoLoad: true,
												autoSync: true,
												sorters: { property: 'name', direction : 'ASC' },

												proxy: {
													type: 'ajax',
													url: 'php/Geo_statByregion-test.php',
													extraParams: {type:29,listStatSel:Ext.encode(selectID)},
													actionMethods: {
														read: 'POST'//'POST'
													},												
													reader: {
														type: 'json',
														root: 'topics'
													}
												},
												listeners: {
													 load: function(store, records) {
														  store.insert(0, [{
															  id: 0,
															  name: 'raw',
															  description: 'Original data'
															  
														  }]);														  
													 }
												  }								
											});
			
											var gridStatStore = Ext.create('Ext.data.Store', {
												storeId: 'store_ID',
												model: 'modelGridRegion',
												buffered: true,
												pageSize: 30,
												leadingBufferZone: 90,
												proxy: {
													type: 'ajax',
													url: 'php/Geo_statByregion-test.php',
													extraParams: {type:14,listStatSel:Ext.encode(selectID)},
													reader: {
														type: 'json',
														root: 'topics',
														totalProperty: 'totalCount'
													},
													simpleSortMode: true,
													filterParam: 'query',
													encodeFilters: function(filters) {
														return filters[0].value;
													},
													actionMethods: {
														read: 'POST'
													},													
												},
												// listeners: {
													// totalcountchange: onStoreSizeChange
												// },
												remoteFilter: true,
												autoLoad: true													
												// model: 'modelGridRegion',
												// autoLoad: true,
												// autoSync: true,
												// sorters: { property: 'name', direction : 'ASC' },
												// proxy: {
													// type: 'ajax',
													// url: 'php/Geo_statByregion-test.php',
													// extraParams: {type:14,listStatSel:Ext.encode(selectID)},	
													// actionMethods: {
														// read: 'POST'
													// },													
													// reader: {
														// type: 'json',
														// root: 'topics'
													// }
												// }
											});								

											var varstore = Ext.create('Ext.data.Store', {
												model: 'modelvarList',
												autoLoad: true,
												autoSync: true,
												sorters: { property: 'name', direction : 'ASC' },

												proxy: {
													type: 'ajax',
													url: 'php/Geo_statByregion-test.php',
													extraParams: {type:15,listStatSel:Ext.encode(selectID)},
													actionMethods: {
														read: 'POST'
													},													
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
												mode: 'SIMPLE',
												listeners: {
													selectionchange: function(sm, selections) {
														gridRegion.down('#removeButton').setDisabled(selections.length === 0);
														gridRegion.down('#idstatistic').setDisabled(selections.length === 0);
														
													}
												},
												select: function(records, keepExisting, suppressEvent) {
													if (Ext.isDefined(records)) {
														this.doSelect(records, keepExisting, suppressEvent);
													}
												},
												selectAll: function( suppressEvent ) {
													var me = this,
														selections = me.store.getRange();
													countFree=[]
													for( var key in selections ) {
														if( selections[key].data.copyright == 'Free'){
															countFree.push(selections[key].data.copyright)
														}
													}
													
													if(countFree.length>150){
														winInfo=Ext.MessageBox.show({
														   title: 'Information',
														   msg: 'Exceeds the maximum number (Max. 150) of downloads',
														   width:300,
														   buttons: Ext.MessageBox.OK,
														   animateTarget: 'info',
														   icon: 'x-message-box-info'
														});	
														winInfo.setPosition(mainPanelWidth/3,mainPanelHeight/2);
													}else{
														var i = 0,
															len = selections.length,
															selLen = me.getSelection().length;
															
														// if( len != selLen ) {
														if( selLen==0 ) {
															me.bulkChange = true;
															for (; i < len; i++) {
																me.doSelect(selections[i], true, suppressEvent);
															}
															delete me.bulkChange;
															me.maybeFireSelectionChange(me.getSelection().length !== selLen);
														}
														else {
															me.deselectAll( suppressEvent );
														}									
													}
												}//														
											});	
											
											// btn_download = function () {
												// var selection = gridRegion.getView().getSelectionModel().getSelection();//[0];
												// var qc = Ext.getCmp('qcCmbID').getValue()
												// selgrid=new Array()
												// for(var i = 0; i < selection.length; i++) {
													// selgrid.push(Number(selection[i].data.id));
												// }
												// Ext.DomHelper.append(document.body, {
												  // tag: 'iframe',
												  // id:'downloadIframe',
												  // frameBorder: 0,
												  // width: 0,
												  // height: 0,
												  // css: 'display:none;visibility:hidden;height: 0px;',
												  // src: 'php/dowloaddata.php?qc='+qc+'&typedwn=selection&station='+Ext.encode(selgrid)+'&'+'country=null'+'&'+'state=null'+'&'+'municip=null'+'&'+'variable='+Ext.encode(cmbVar.getValue())+'&typedwn=selection'
												// });
											// }	
											// onZoomExtentALL = function () {
												// FeatselectID=[]
												// for (var i = feature.length - 1; i >= 0; --i) {
													// if(feature[i].renderIntent=='select'){
															// sel=feature[i]//.cluster[j]
															// FeatselectID.push(sel)
													// }
												// }
										
												// var BoundALL = FeatselectID.getExtent();
												// mapPanel.map.zoomToExtent(BoundALL);								
												
											// }

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
														xtype: 'rownumberer',
														width: 30,
														sortable: false
													},													
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
																layerTemp=mapPanel.map.getLayersByName("Search station")[0]
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
																statName = rec.get('name');
																copyrightN = rec.get('copyright');
																var periodst = Ext.create('Ext.data.Store', {
																		fields: ['value','name'], 
																		data: [ 
																			{value:1,name: 'Daily'}, 
																			{value:2,name: 'Monthly'}, 
																			{value:3,name: 'Yearly'}
																		]																	
																})
																
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
																		'<div class="grap" id="grap_temp_'+selectionID+'" style="width:'+grapWidth+'px;"></div>',
																		'<tpl for="rowTitleArr">',
																		'<div class="grap" id="grap_{.}_'+selectionID+'" style="width:'+grapWidth+'px;"></div>',
																		'</tpl>'
																		];	

																	cmbPeriod='cmbPeriod'+selectionID
																	cmbPeriod=Ext.create('Ext.form.field.ComboBox', { 
																		fieldLabel: 'Select graphic model',
																		id:'cmbPeriodID',
																		labelWidth:150,
																		store: periodst,
																		displayField: 'name',
																		value: 1,
																		queryMode: 'local',
																		valueField: 'value', 								
																		typeAhead: true,
																		listeners: {
																			select: function() {
																				var actTab = tabs.getActiveTab();
																				var idx = tabs.items.indexOf(actTab);
																				// actTabId=parseInt((actTab.title).match(/\d+/)[0])
																				var idPeriod = Ext.getCmp('cmbPeriodID').getValue()
																				var qc = Ext.getCmp('qcCmbGrapID').getValue()
																				if (copyrightN == 'Free') {
																					generateGraps(selectionID,idPeriod,Ext.encode(cmbVar.getValue()),qc)
																				}else if (copyrightN != 'Free' && idPeriod==1){
																					winInfo=Ext.MessageBox.show({
																					   title: 'Information',
																					   msg: 'Sorry, You are not authorized to download data.',
																					   width:300,
																					   buttons: Ext.MessageBox.OK,
																					   animateTarget: 'error',
																					   icon: 'x-message-box-error'
																					   
																					});	
																					winInfo.setPosition(mainPanelWidth/3,mainPanelHeight/2);																			
																					Ext.getCmp('cmbPeriodID').setValue(3);
																				}else if (copyrightN != 'Free' && idPeriod==2 ){
																					winInfo=Ext.MessageBox.show({
																					   title: 'Information',
																					   msg: 'Sorry, You are not authorized to download data.',
																					   width:300,
																					   buttons: Ext.MessageBox.OK,
																					   animateTarget: 'error',
																					   icon: 'x-message-box-error'
																					   
																					});	
																					winInfo.setPosition(mainPanelWidth/3,mainPanelHeight/2);
																					Ext.getCmp('cmbPeriodID').setValue(3);
																				}
																			}
																		}
																	});	
																	if (copyrightN != 'Free') {
																	Ext.getCmp('cmbPeriodID').setValue(3);
																	}else{Ext.getCmp('cmbPeriodID').setValue(1);}
																	
																	cmbqc='cmbqc'+selectionID
																	cmbqc=Ext.create('Ext.form.field.ComboBox', { 
																		fieldLabel: 'Quality control:',
																		labelWidth:90,
																		editable: false, 
																		value: 'raw',
																		multiSelect: false, 
																		displayField: 'name',
																		valueField: 'name', 
																		id:'qcCmbGrapID',
																		queryMode: 'local',
																		typeAhead: true,
																		store: qcstoreGrap,
																		width: 180,												
																		listConfig: {
																			getInnerTpl: function() {
																				return '<div data-qtip="{description}">{name}</div>';
																			}
																		},														
																		listeners: {
																			select: function() {
																				var actTab = tabs.getActiveTab();
																				var idx = tabs.items.indexOf(actTab);
																				// actTabId=parseInt((actTab.title).match(/\d+/)[0])
																				var idPeriod = Ext.getCmp('cmbPeriodID').getValue()
																				var qc = Ext.getCmp('qcCmbGrapID').getValue()
																				generateGraps(selectionID,idPeriod,Ext.encode(cmbVar.getValue()),qc)

																			}
																		}
																	});																	
																	btonReturn= new Ext.Button({
																		pressedCls : 'my-pressed',
																		overCls : 'my-over',
																		tooltip: "Return to map",
																		text:'Return to map',
																		icon: icons+'map.png', 
																		scale: 'small',
																		handler: function(){
																			tabs.setActiveTab(0);
																		}													
																	});	
																	if(Ext.getCmp('graphic_tab')){
																		tabs.remove(Ext.getCmp('graphic_tab'), true);
																	}												

																	tabs.add({
																		// contentEl: "desc",
																		// xtype: 'panel',
																		title: 'Graph '+statName,//'Graphic_id'+selectionID
																		name: 'graphic_tab',
																		// width:mainPanelWidth-15,
																		// height: mainPanelHeight,
																		autoScroll: true,
																		// height: 100,
																		// autoHeight: true,
																		// layout: 'fit',
																		id: 'graphic_tab',
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
																			items: [cmbPeriod,cmbqc,{xtype: 'tbfill'},btonReturn]
																			}
																		]													
																	});		
																	
																	var t = new Ext.XTemplate(tpl);
																	Ext.getCmp('graphic_tab').update(t.apply(datatest));
																	// Ext.getCmp('graphic'+selectionID).update('This<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long');
																	
																	Ext.getCmp('mapPanelID').setHeight(0)
																	Ext.getCmp('tabsID').setWidth(mainPanelWidth-15);
																	// Ext.getCmp('tabsID').setHeight(mainPanelHeight*0.2);
																	tabs.setActiveTab('graphic_tab');
																	
																	generateGraps(selectionID,cmbPeriod.getValue(),Ext.encode(cmbVar.getValue()),'raw')
																
															}, // handler															
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
														{ text: 'download',minWidth: 80,dataIndex: 'copyright', flex: 3,tdCls: 'x-change-cell'},
														{ text: 'code',minWidth: 70,dataIndex: 'code', flex: 1,tdCls: 'x-change-cell'},
														{ text: 'name',minWidth: 120,dataIndex: 'name', flex: 4,tdCls: 'x-change-cell'},
														{ text: 'institute',minWidth: 70,dataIndex: 'institute', flex: 3,tdCls: 'x-change-cell'},
														{ text: 'model',minWidth: 80,dataIndex: 'model', flex: 2,tdCls: 'x-change-cell'},
														

														
														{ text: 'variables',minWidth: 120,dataIndex: 'variables', flex: 4,tdCls: 'x-change-cell'},
														
														
														// { text: 'lon',minWidth: 80,dataIndex: 'lon', flex: 3},
														// { text: 'lat',minWidth: 80,dataIndex: 'lat', flex: 3},
														{ text: 'elevation (m)',minWidth: 80,dataIndex: 'elev', flex: 2,tdCls: 'x-change-cell'},
														{ text: 'category',minWidth: 100,dataIndex: 'category', flex: 3,tdCls: 'x-change-cell'},
														{ text: 'instalation',minWidth: 80,dataIndex: 'instalation', flex: 3,tdCls: 'x-change-cell'},
														{ text: 'suspension',minWidth: 80,dataIndex: 'suspension', flex: 3,tdCls: 'x-change-cell'},
														{ text: 'quality ctrl',minWidth: 70,dataIndex: 'ctrl_quali_var', flex: 1,tdCls: 'x-change-cell'},									
														{ text: 'country',minWidth: 80,dataIndex: 'country', flex: 4,tdCls: 'x-change-cell'},
														{ text: 'state',minWidth: 80,dataIndex: 'state', flex: 4,tdCls: 'x-change-cell'},
														{ text: 'city',minWidth: 90,dataIndex: 'city', flex: 4,tdCls: 'x-change-cell'}
													
													// { text: 'lon',minWidth: 80,dataIndex: 'lon', flex: 3},
													// { text: 'lat',minWidth: 80,dataIndex: 'lat', flex: 3},
													// { text: 'elev',minWidth: 80,dataIndex: 'elev', flex: 2},
													// { text: 'country',minWidth: 80,dataIndex: 'country', flex: 4},
													// { text: 'state',minWidth: 80,dataIndex: 'state', flex: 4},
													// { text: 'city',minWidth: 90,dataIndex: 'city', flex: 4}
													
												],
												columnLines: true,
												// plugins: [
												// {
													// ptype: 'rowexpander',
													// pluginId: 'rowexpanderID',
													// selectRowOnExpand: true,			
													// rowBodyTpl : new Ext.XTemplate(
														// '<p><b>category:</b> {category} | <b>instalation:</b> {instalation} ', //&#x2016; doble linea vertical
														// '| <b>quality:</b> {quality} ',
														// '| <b>lon:</b> {lon} ',
														// '| <b>lat:</b> {lat} ',
														// '| <b>elev:</b> {elev} </p>',
														// '<p><b>country:</b> {country} ',
														// '| <b>state:</b> {state} ',
														// '| <b>city:</b> {city}</p> ',
														// '<div id="myrow-{id}" ></div>'
													// ),		
													// expandOnRender: true,
													// expandOnDblClick: false		
										
												// }
												// ],							

												stripeRows: true,
												// margin: '0 0 20 0',
												selModel: selModel,
												viewConfig: { 
													stripeRows: false, 
													getRowClass: function(record, index, rowParams, stor) {
													   var c = record.get('copyright');
													   // return id == '1' ? 'general-rule' : ''; // para desaparecer el check
														if (c == 'Restricted' || c == 'Request') {
															return 'price-fall';
														} 
													}	
												},
												listeners: {
													beforeselect: function ( row, model, index ) {
														if ( model.data.copyright == "Restricted" || model.data.copyright == 'Request') {
															return false;
														}
													},
													selectionchange: function(sm, selections){ // hay problema cuando se selecciona el cursor vuelve a la primera fila
														// layerTempSel.removeAllFeatures();
														layerTempSel.destroyFeatures();
														// gridRegion.down('#numRecordsSelected').setText('Selected: ' + selections.length);
														feature = layerTempStat.features;
														for (var i = feature.length - 1; i >= 0; --i) {
															// for (var j = feature[i].cluster.length - 1; j >= 0; --j) {
																idall=feature[i].attributes.id;
																for (var k = selections.length - 1; k >= 0; --k) {
																	idsel=selections[k].data.id
																	if(idall==idsel){
																		// feature[i].layer.styleMap.styles.default.rules[0].symbolizer.externalGraphic="iconosGIS/bloqE_16px.png" 
																		// layerTempSel.drawFeature(feature[i])
																		 // mapPanel.map.refresh();	
																		var point = new OpenLayers.Feature.Vector(
																			new OpenLayers.Geometry.Point(feature[i].geometry.x, feature[i].geometry.y));	
																		layerTempSel.addFeatures([point]);
																		mapPanel.map.setLayerIndex(layerTempSel, 99);
																	}
																}												
															// }											
														}
													},
													select: function(selModel, record, index, options) {
														var selection = gridRegion.getView().getSelectionModel();//[0];
														var number_of_selected_records = selection.getSelection().length;
														var name = Ext.getCmp('numRecordsSelected').setText( 'Selected: ' + number_of_selected_records);
													}													
												},
												dockedItems: [
													{
													xtype: 'toolbar',
													items: [{
														itemId: 'removeButton',
														text:'Download',
														tooltip:'Download data',
														icon   : iconGridDownload,
														// disabled: true,
														handler: btn_download 
													},//cmbVar,qualitycCmb,
													// {
														// width: 250,
														// fieldLabel: 'Search',
														// labelWidth: 40,
														// xtype: 'searchfield',
														// store: gridStatStore
													// },													
													{
														itemId: 'zoomExtentALL',
														text:'Zoom extent',
														tooltip:'zoomExtent to ALL',
														icon   : iconGridzoomExtentALL,//iconCls:'add',
														handler: onZoomExtentALL 
													}/*,{
														itemId: 'idExpand',
														text:'Expand all',
														tooltip:'Expand all',
														iconCls:iconGridExpand,
														handler: expand 
													}*/,{
													
														itemId: 'idstatistic',
														text:'Statistics',
														tooltip:'Summary Statistic',
														icon   : iconGridStatistics,
														disabled: true,
														handler: statistics 
													},{ xtype: 'tbtext', itemId: 'numRecords' },
													{ xtype: 'tbtext', itemId: 'numRecordsSelected', id:'numRecordsSelected' },
													{xtype: 'tbfill'},
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

											gridStatStore.on('load', function(ds){
												countRow=ds.getTotalCount()
												if(countRow>=1){
													// winRegion.show()
													// Ext.getCmp('gridRegionID').add(gridRegion);
													// Ext.getCmp('gridRegionID').doLayout();
													Ext.getCmp('mainTableID').add(gridRegion);
													gridRegion.down('#numRecords').setText('Records: ' + countRow);
													gridRegion.down('#numRecordsSelected').setText('Selected: ' + 0);
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
						clusters.setVisibility(true)
						Ext.LoadMask.override({    listeners: {
								beforedestroy: function() {
									this.hide();
								}
							}
						});						
					
						if(Ext.getCmp('popupID')){
							Ext.getCmp('popupID').close()
						}		
						// drawPolygon.control.deactivate();
						if(Ext.getCmp('gridRegionID')){
							Ext.getCmp('mainTableID').collapse();
							Ext.getCmp('gridRegionID').destroy();	
						}
						if(Ext.getCmp('gridRegionID_1')){
							Ext.getCmp('mainTableID').collapse();
							Ext.getCmp('gridRegionID_1').destroy();
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
						// layerTempReg=mapPanel.map.getLayersByName("Search_region")[0]
						// if(layerTempReg){mapPanel.map.removeLayer(layerTempReg);}
						layerTempRegion.destroyFeatures();
						
						layerTempStat=mapPanel.map.getLayersByName("Search station")[0]
						if(layerTempStat){
							// mapPanel.map.removeLayer(layerTempStat);
							layerTempStat.destroyFeatures();

						}	
					}
				}				
			]
		}]		
		
	}

		/*########################################################################  FORM CHIRPS DAILY V2 #########################################################################*/
		
		mapPanel.map.addLayer(poinDraw);
		var customHandlerPoint = OpenLayers.Class(OpenLayers.Handler.Point, {
			addPoint: function(pixel) {}
		});	  
		drawControls = new OpenLayers.Control.DrawFeature(poinDraw,customHandlerPoint)
		mapPanel.map.addControl(drawControls);	
		
		updateCoordsDeg=function (){
			FieldLon=Ext.getCmp("lon_deg")
			FieldLat=Ext.getCmp("lat_deg")
			lonIn=FieldLon.getValue()
			latIn=FieldLat.getValue()	
			if(Ext.getCmp('lon_deg').getValue()!=null & Ext.getCmp('lon_deg').getValue()!=0 & Ext.getCmp('lat_deg').getValue()!=null & Ext.getCmp('lat_deg').getValue()!=0 & FieldLon.isValid() & FieldLat.isValid()){
				var lonlatIn = new OpenLayers.LonLat(lonIn, latIn).transform(new OpenLayers.Projection("EPSG:4326"),new OpenLayers.Projection("EPSG:900913"))
				if(Ext.getCmp("btnCoordMap").pressed==true){
					pointMap=poinDraw.features[0].geometry
					var lonlatMap = new OpenLayers.LonLat(pointMap.x, pointMap.y).transform(new OpenLayers.Projection("EPSG:900913"),new OpenLayers.Projection("EPSG:4326"))
					cond=Math.abs(lonIn-lonlatMap.lon)>0.000000000001 & Math.abs(latIn-lonlatMap.lat)>0.000000000001
				}else{cond=Math.abs(lonIn-lonIn)==0}
				if(cond){
					var point = new OpenLayers.Geometry.Point(lonlatIn.lon, lonlatIn.lat);
					var pointFeature2 = new OpenLayers.Feature.Vector(point)
					poinDraw.addFeatures([pointFeature2]);
					mapPanel.map.setCenter(new OpenLayers.LonLat(lonlatIn.lon, lonlatIn.lat), 10);	
				}
			}				
		}
		updateCoordsDMS=function (){
			FieldLon1=Ext.getCmp("lon_1")
			FieldLon2=Ext.getCmp("lon_2")
			FieldLon3=Ext.getCmp("lon_3")
			FieldLat1=Ext.getCmp("lat_1")
			FieldLat2=Ext.getCmp("lat_2")
			FieldLat3=Ext.getCmp("lat_3")

			lonIn1=FieldLon1.getValue()
			lonIn2=FieldLon2.getValue()
			lonIn3=FieldLon3.getValue()
			latIn1=FieldLat1.getValue()	
			latIn2=FieldLat2.getValue()	
			latIn3=FieldLat3.getValue()	
			if(FieldLon1.isValid() & FieldLon2.isValid() & FieldLon3.isValid() & FieldLat1.isValid() & FieldLat2.isValid() & FieldLat3.isValid()){
				lonIn=ConvertDMSToDD(parseInt(lonIn1),parseInt(lonIn2),parseInt(lonIn3))				
				latIn=ConvertDMSToDD(parseInt(latIn1),parseInt(latIn2),parseInt(latIn3))				
				var lonlatIn = new OpenLayers.LonLat(lonIn, latIn).transform(new OpenLayers.Projection("EPSG:4326"),new OpenLayers.Projection("EPSG:900913"))
				if(Ext.getCmp("btnCoordMap").pressed==true){
					pointMap=poinDraw.features[0].geometry
					var lonlatMap = new OpenLayers.LonLat(pointMap.x, pointMap.y).transform(new OpenLayers.Projection("EPSG:900913"),new OpenLayers.Projection("EPSG:4326"))
					cond=Math.abs(lonIn-lonIn)>1
				}else{cond=Math.abs(lonIn-lonIn)==0}
				if(cond){
					var point = new OpenLayers.Geometry.Point(lonlatIn.lon, lonlatIn.lat);
					var pointFeature2 = new OpenLayers.Feature.Vector(point)
					poinDraw.addFeatures([pointFeature2]);
					mapPanel.map.setCenter(new OpenLayers.LonLat(lonlatIn.lon, lonlatIn.lat), 10);	
				}
			}				
		}			
	   labelWidthChirps=68
	   var formChirps = Ext.create('Ext.form.Panel', {
			id:"formChirps",
			autoHeight: true,
			//width   : 365,
			bodyPadding: 10,
			defaults: {
				anchor: '100%',
				labelWidth: 100
			},
			items   : [
						{
							xtype      : 'radiogroup',
							fieldLabel : 'Format',
							labelWidth:labelWidthChirps,
							defaults: {
								//flex: 1
							},
							//layout: 'hbox',
							items: [
								{
									boxLabel  : 'DMS',
									name      : 'coord',
									width: 60,
									inputValue: 'dms',
									id        : 'radio2',
									checked   : true,
									margin: '0 0 0 0'
								},            
								{
									boxLabel  : 'DEG',
									name      : 'coord',                   
									inputValue: 'deg',                  
									id        : 'radio1',
									margin: '0 0 0 -30'
								}
							],
							listeners: {
								change: {
									fn: function(field, newValue, oldValue, options) {
										if(newValue.coord=='dms'){
											Ext.getCmp('lon_deg').hide();Ext.getCmp('lon_deg').disable()
											Ext.getCmp('contCoordsLon').show();Ext.getCmp('contCoordsLon').enable();
											Ext.getCmp('lat_deg').hide();Ext.getCmp('lat_deg').disable()
											Ext.getCmp('contCoordsLat').show();Ext.getCmp('contCoordsLat').enable();						
										}else{
											Ext.getCmp('lon_deg').show();Ext.getCmp('lon_deg').enable();
											Ext.getCmp('contCoordsLon').hide();Ext.getCmp('contCoordsLon').disable();
											Ext.getCmp('lon_deg').reset();
											var fieldContainer = formChirps.down('#invoiceCt');
											fieldContainer.items.each(function(f) {
												if (Ext.isFunction(f.reset)) {
													f.reset();
												}
											});   
											/*******/
											Ext.getCmp('lat_deg').show();Ext.getCmp('lat_deg').enable()
											Ext.getCmp('contCoordsLat').hide();Ext.getCmp('contCoordsLat').disable();
											Ext.getCmp('lat_deg').reset();
											var fieldContainer = formChirps.down('#contCoordsLat');
											fieldContainer.items.each(function(f) {
												if (Ext.isFunction(f.reset)) {
													f.reset();
												}
											}); 							
										}

									}
								}
							}            
						},                   
						{
							xtype: 'fieldcontainer',
							fieldLabel: 'Longitude',
							//combineErrors: true,
							msgTarget: 'under',
							labelWidth:labelWidthChirps,
							layout: 'hbox',
							defaults: {
								hideLabel: true
							},
							items: [
								{
									xtype: 'fieldcontainer',
									id:"contCoordsLon",
									itemId: 'invoiceCt',
									msgTarget: 'under', 
									layout: 'hbox',
									defaults: {
										hideLabel: true
									},
									items: [
										{xtype: 'numberfield',  id:"lon_1",hideTrigger: true,fieldLabel: 'Lon 1', name: 'lon_1', width: 40, allowBlank: false, margins: '0 5 0 0',maxValue: 180,minValue: -180,
											listeners: {
												'change': updateCoordsDMS
											}												
										},                        
										{xtype: 'displayfield', id:"lon_1_1",value: '&deg;'}, 
										{xtype: 'numberfield',  id:"lon_2",    hideTrigger: true, fieldLabel: 'Lon 2', name: 'lon_2', width: 35, allowBlank: false, margins: '0 5 0 0',maxValue: 60,minValue: 0,
											listeners: {
												'change': updateCoordsDMS
											}												
										},
										{xtype: 'displayfield',id:"lon_2_1", value: '&prime;'},
										{xtype: 'numberfield',id:"lon_3", hideTrigger: true, fieldLabel: 'Lon 3', name: 'lon_3', width: 45, allowBlank: false,maxValue: 60,minValue: 0,decimalPrecision:2,
											listeners: {
												'change': updateCoordsDMS
											}												
										},
										{xtype: 'displayfield', id:"lon_3_1",value: '&Prime;'}
									]
								},// container contCoordsLon
								{xtype: 'numberfield', id:"lon_deg",emptyText: 'Decimal Degrees',hidden: true,disabled:true,hideTrigger: true,fieldLabel: 'Lon_deg 1', name: 'lon_deg-1', width: 120, allowBlank: false, margins: '0 5 0 0',maxValue: 180,minValue: -180,decimalPrecision:12,
									listeners: {
										'change': updateCoordsDeg
									}										
								},
							]
						},
						{
							xtype: 'fieldcontainer',
							fieldLabel: 'Latitude',
							//combineErrors: true,
							labelWidth:labelWidthChirps,
							msgTarget: 'under',
							defaults: {
								hideLabel: true
							},
							items: [
								{
									xtype: 'fieldcontainer',
									id:"contCoordsLat",
									itemId: 'contCoordsLat',
									//combineErrors: true,
									msgTarget: 'under', 
									layout: 'hbox',
									defaults: {
										hideLabel: true
									},
									items: [
										{xtype: 'numberfield',  id:"lat_1",hideTrigger: true,fieldLabel: 'Lat 1', name: 'lat_1', width: 40, allowBlank: false, margins: '0 5 0 0',maxValue: 180,minValue: -180,
											listeners: {
												'change': updateCoordsDMS
											}												
										},
										{xtype: 'displayfield', id:"lat_1_1",value: '&deg;'}, 
										{xtype: 'numberfield',  id:"lat_2",    hideTrigger: true, fieldLabel: 'Lat 2', name: 'lat_2', width: 35, allowBlank: false, margins: '0 5 0 0',maxValue: 60,minValue: 0,
											listeners: {
												'change': updateCoordsDMS
											}												
										},
										{xtype: 'displayfield',id:"lat_2_1", value: '&prime;'},
										{xtype: 'numberfield',id:"lat_3", hideTrigger: true, fieldLabel: 'Lat 3', name: 'lat_3', width: 45, allowBlank: false,maxValue: 60,minValue: 0,decimalPrecision:2,
											listeners: {
												'change': updateCoordsDMS
											}												
										},
										{xtype: 'displayfield', id:"lat_3_1",value: '&Prime;'}

									]
								},// container corrds
								{xtype: 'numberfield',  id:"lat_deg",hidden: true,disabled:true,emptyText: 'Decimal Degrees',hideTrigger: true,fieldLabel: 'Lat_deg 1', name: 'lat_deg-1', width: 120, allowBlank: false, margins: '0 5 0 0',maxValue: 180,minValue: -180,decimalPrecision:12,
									listeners: {
										'change': updateCoordsDeg
									}										
								},
							]
						},
						{
							xtype: 'container',
							combineErrors: true,
							msgTarget: 'side',
							fieldLabel: 'Year',
							anchor: '100%',
							layout: 'hbox',
							margin: '5 0 0 0',
							// defaultMargins: {top: 0, right: 5, bottom: 0, lef:
							defaults: {
								hideLabel: true
							},
							items : [
								
								{xtype: 'displayfield', value: 'Year',margin: '15 0 0 0',},
								{
									xtype: 'panel',
									id:"panelSlider",
									width: 180,
									height:60,
									margin: '0 0 0 22',
									html: ['<input type="text" id="periodh" name="periodh" value="" />']								   
								}
							]
						},
						{
							xtype: 'container',
							combineErrors: true,
							msgTarget: 'side',
							fieldLabel: 'Month',
							anchor: '100%',
							layout: 'hbox',
							margin: '-12 0 -10 0',
							// defaultMargins: {top: 0, right: 5, bottom: 0, lef:
							defaults: {
								hideLabel: true
							},
							items : [
								
								{xtype: 'displayfield', value: 'Month',margin: '15 0 0 0',},
								{
									xtype: 'panel',
									width: 180,
									height:60,
									margin: '0 0 0 12',
									html: ['<input type="text" id="Smonth" name="Smonth" value="" />']								   
								}
							]
						},

						{
							xtype: 'checkboxgroup',
							id: 'datasetid',
							// fieldLabel: 'Multi-Column (horizontal)',
							// cls: 'x-check-group-alt',
							// Distribute controls across 3 even columns, filling each row
							// from left to right before starting the next row
							columns: 2,
							margin: '10 0 5 30', //top,left,down,right
							items: [
								{boxLabel: 'CHIRPS', name: 'cb-horiz-1',inputValue: 'chirps',checked: true,},
								{boxLabel: 'CHIRP', name: 'cb-horiz-2', inputValue: 'chirp'},
								{boxLabel: 'WorldClim V2', name: 'cb-horiz-3', inputValue: 'wcl',checked: true,},
								{boxLabel: 'CRU V4', name: 'cb-horiz-4', inputValue: 'cru',checked: true,}
							]
						}						

			],
			buttons: [
				{
					text   : 'coords map',
					id:"btnCoordMap",
					pressedCls : 'my-pressed',
					enableToggle: true,
					handler: function() {
						// prevalence.items.items[0].getValue()
						
						// console.log(values)
						// values=this.up('form').getForm().getValues()
					  // if(values.coord=="dms"){
						  // console.log(ConvertDMSToDD(parseInt(values.lat_1),parseInt(values.lat_2),parseInt(values.lat_3)))
					  // }else{
						  // console.log(ConvertDDToDMS(parseInt(values.lat_deg)))
					  // }
					},
					toggleHandler: function(btn, pressed){
						if(pressed==false){
							 drawControls.deactivate();
							 poinDraw.destroyFeatures()
							 
						}else{
							drawControls.activate();
						}
					}				
				},
				{
					text   : 'Run',
					handler: function() {
						var form   = this.up('form').getForm();
						// values=Ext.getCmp("formChirps").getForm().getValues()
						if (form.isValid()) {
							valueSlider= $("#periodh").prop("value").split(";");
							monSlider= $("#Smonth").prop("value").split(";");
							
							pointMap=poinDraw.features[0].geometry
							var lonlatMap = new OpenLayers.LonLat(pointMap.x, pointMap.y).transform(new OpenLayers.Projection("EPSG:900913"),new OpenLayers.Projection("EPSG:4326"))
							yi=parseInt(valueSlider[0])
							yf=parseInt(valueSlider[1])
							mi=parseInt(monSlider[0])
							mf=parseInt(monSlider[1])										
							selectionID = 1;
							statName = "chirps";
							copyrightN = 1;
								var arrayvar =new Array("prec") //varlist.split(',');
							
								var datatest = {
									name: 'xxx',
									rowTitleArr: arrayvar,
									colTitleArr: ['a', 'b', 'c']
								}
								var tpl = [
									// '<div id="grap_temp_'+selectionID+'" style="width:'+grapWidth+'px;"></div>',
									'<div id="grap_clim_wcl'+selectionID+'" style="width:'+grapWidth+'px;"></div>','<br>',
									'<div id="grap_prec_mon_'+selectionID+'" style="width:'+grapWidth+'px;"></div>','<br>',
									// '<tpl for="rowTitleArr">',
									// '<div id="grap_{.}_'+selectionID+'" style="width:'+grapWidth+'px;"></div>',
									// '</tpl>',
									'<div id="grap_prec_annual_'+selectionID+'" style="width:'+grapWidth+'px;"></div>','<br>',
									'<div id="grap_rainy_'+selectionID+'" style="width:'+grapWidth+'px;"></div>','<br>',
									'<div id="grap_wetdays_'+selectionID+'" style="width:'+grapWidth+'px;"></div>','<br>',
									// '<div id="grap_prec_clim_'+selectionID+'" style="width:'+grapWidth+'px;"></div>',
									
									'<div id="index_boxplot" style="width:'+grapWidth+'px;"></div>',
									// '<div id="index_wetdays" style="width:'+grapWidth+'px;"></div>',
									// '<div id="index_conswetdays" style="width:'+grapWidth+'px;"></div>',
									'<div id="grap_prec_'+selectionID+'" style="width:'+grapWidth+'px;"></div>','<br>',
									'<div id="stats_chirps" style="width:'+grapWidth+'px;"></div>',
									'<div style="font-family: Trebuchet MS";><p style="font-size:20px">Data sources</p>',
									'<a href="http://chg.geog.ucsb.edu/data/index.html" target="_blank">CHIRPS and CHIRP</a>: Is a 30+ year quasi-global rainfall dataset. Spanning 50&deg;S-50&deg;N (and all longitudes), starting in 1981 to near-present, CHIRP incorporates 0.05&deg; resolution (~5km) satellite imagery and CHIPRS incorporates 0.05&deg; resolution (~5km) satellite imagery with in-situ station data to create gridded rainfall time series for trend analysis and seasonal drought monitoring.','<br>',
									'<a href="http://worldclim.org/version2" target="_blank">WorldClim V2:</a>: Very high resolution interpolated climate surfaces with in-situ station data for global land areas (~1km resolution). WorldClim version 2 has average monthly climate data for minimum, mean, and maximum temperature and for precipitation for 1970-2000.','<br>',
									'<a href="http://www.cru.uea.ac.uk/" target="_blank">CRU V4</a>: Datasets interpolated monthly for global land for multiple variables with 0.5&deg; x 0.5&deg; resolution (~50 km) from 1901-2015.','<br>','<br><br> </div>'
									
									];	
								var qcstoreGrap = Ext.create('Ext.data.Store', {
									model: 'modelQC',
									autoLoad: true,
									autoSync: true,
									sorters: { property: 'name', direction : 'ASC' },

									proxy: {
										type: 'ajax',
										url: 'php/Geo_statByregion-test.php',
										extraParams: {type:29,listStatSel:Ext.encode(selectionID),spec:"espc"},
										actionMethods: {
											read: 'POST'//'POST'
										},												
										reader: {
											type: 'json',
											root: 'topics'
										}
									},
									listeners: {
										 load: function(store, records) {
											  store.insert(0, [{
												  id: 0,
												  name: 'raw',
												  description: 'Original data'
												  
											  }]);														  
										 }
									  }								
								});
								btonReturn= new Ext.Button({
									pressedCls : 'my-pressed',
									overCls : 'my-over',
									tooltip: "Return to map",
									text:'Return to map',
									icon: icons+'map.png', 
									scale: 'small',
									handler: function(){
										tabs.setActiveTab(0);
									}													
								});	
								source_ftp="ftp://ftp.ciat.cgiar.org/DAPA/projects/GCMPage/data/data_requests/" //"http://gisweb.ciat.cgiar.org/Bc_Downscale/download" // "../../downloads/chirps/"//
								lon=Math.round(lonlatMap.lon*10000)/10000
								lat=Math.round(lonlatMap.lat*10000)/10000			
								dataftp=source_ftp+'/chirps_lonlat_'+lon+'_'+lat+'.zip';
					
								btonDowndChirps= new Ext.Button({
									pressedCls : 'my-pressed',
									overCls : 'my-over',
									tooltip: "Download data",
									text:'Download data',
									icon: icons+'download-icon.png', 
									scale: 'small',
									handler: function(){
										window.open(dataftp)
										// Ext.DomHelper.append(document.body, {
										  // tag: 'iframe',
										  // id:'downloadIframe',
										  // frameBorder: 0,
										  // width: 0,
										  // height: 0,
										  // css: 'display:none;visibility:hidden;height: 0px;',
										  // src: dataftp
										// });
										
									}													
								});					
								if(Ext.getCmp('graphic_tab')){
									tabs.remove(Ext.getCmp('graphic_tab'), true);
								}												

								tabs.add({
									// contentEl: "desc",
									// xtype: 'panel',
									title: 'Graph '+statName,//'Graphic_id'+selectionID
									name: 'graphic_tab',
									// width:mainPanelWidth-15,
									// height: mainPanelHeight,
									autoScroll: true,
									// height: 100,
									// autoHeight: true,
									// layout: 'fit',
									id: 'graphic_tab',
									// html:'<div id="grap_prec_clim_'+selectionID+'" style="width:'+grapWidth+'px;"></div>',
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
										items: [{xtype: 'tbtext',text: 'Long: '+Math.round(lonlatMap.lon*10000)/10000+' Lat: '+Math.round(lonlatMap.lat*10000)/10000},{xtype: 'tbfill'},btonDowndChirps,'-',btonReturn]
										}
									]													
								});		
								
								var t = new Ext.XTemplate(tpl);
								Ext.getCmp('graphic_tab').update(t.apply(datatest));
								Ext.getCmp('mapPanelID').setHeight(0)
								Ext.getCmp('tabsID').setWidth(mainPanelWidth-15);
								tabs.setActiveTab('graphic_tab');
								var idPeriod = 1
								ch_chirps=Ext.getCmp("datasetid").items.items[0].getValue()
								ch_chirp=Ext.getCmp("datasetid").items.items[1].getValue()
								ch_wcl=Ext.getCmp("datasetid").items.items[2].getValue()
								ch_cru=Ext.getCmp("datasetid").items.items[3].getValue()
								generateGrapsChirps(lonlatMap.lon, lonlatMap.lat,yi,yf,mi,mf,idPeriod,ch_chirps,ch_chirp,ch_wcl,ch_cru)
								
							// if (copyrightN == 'Free') {

							// }else{
								// winInfo=Ext.MessageBox.show({
								   // title: 'Information',
								   // msg: 'Sorry, You are not authorized to download data.',
								   // width:300,
								   // buttons: Ext.MessageBox.OK,
								   // animateTarget: 'error',
								   // icon: 'x-message-box-error'
								   
								// });	
								// winInfo.setPosition(mainPanelWidth/3,mainPanelHeight/2);																			
							// }
						
						
						
						}
					}
				},
	 
				{
					text   : 'Reset',
					handler: function() {
						this.up('form').getForm().reset();
					}
				}
			]
		});


	
		var groupByChirps = {
			xtype: 'fieldset',
			title: 'CHIRPS & WorldClim V2 & CRU TS V4 data   '+ '<img id="help_toolip" class="tooltipIcon" src='+icons+infoB+' data-qtip="'+toolip_chirpsWcl+'" />',//<span data-qtip="hello">First Name</span>  
			width:fieldsetWidth,
			layout: 'anchor',
			defaults: {
				anchor: '100%'
			},
			collapsible: true,
			collapsed: false,
			items: [formChirps]
		}
	
	
		poinDraw.events.register('featureadded',poinDraw, onAddedPoint);
		function onAddedPoint(ev){
			var point=ev.feature.geometry;
			// console.log(poinDraw.features[0])
			// poinDraw.removeFeatures(featureObject);
			if(poinDraw.features.length>1){
				// poinDraw.destroyFeatures();
				poinDraw.removeFeatures(poinDraw.features[0]);
			}
			var lonlat = new OpenLayers.LonLat(point.x, point.y).transform(new OpenLayers.Projection("EPSG:900913"),new OpenLayers.Projection("EPSG:4326"))
			values=Ext.getCmp("formChirps").getForm().getValues()
		  if(values.coord=="dms"){
			 Ext.getCmp('lon_1').setValue(ConvertDDToDMS(lonlat.lon)[0]);Ext.getCmp('lon_2').setValue(ConvertDDToDMS(lonlat.lon)[1]);Ext.getCmp('lon_3').setValue(ConvertDDToDMS(lonlat.lon)[2]);
			 Ext.getCmp('lat_1').setValue(ConvertDDToDMS(lonlat.lat)[0]);Ext.getCmp('lat_2').setValue(ConvertDDToDMS(lonlat.lat)[1]);Ext.getCmp('lat_3').setValue(ConvertDDToDMS(lonlat.lat)[2]);
		  }else{
			 Ext.getCmp('lon_deg').setValue(lonlat.lon);Ext.getCmp('lat_deg').setValue(lonlat.lat);
		  }
		}
	
		/*########################################################################  FIN FORM CHIRPS DAILY V2 #########################################################################*/

	

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

    var tabSearchLogin = Ext.create('Ext.FormPanel', {
		// cls: 'css_labels',
        // width: 250,
		width:fieldsetWidth+10,//tabsWidth,
        bodyPadding: 5,
        items: [
            fieldsetLogin
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
    var tabSearchChirps = Ext.create('Ext.FormPanel', {
		width:fieldsetWidth+10,//tabsWidth,
        bodyPadding: 5,
        items: [
            groupByChirps
        ]	
    });	
	

			
// ############################################################################
	slider=Ext.create('Ext.slider.Single', {
		hideLabel: true,
		// cls:"custom-slider",
		width: 214,
		increment: 5,
		value: 40,
		minValue: 0,
		maxValue: 100,
		listeners: {                    
			change: function (slider, newValue, thumb, eOpts ) {
				strategy.distance=slider.getValue();
				mapPanel.map.removeLayer(clusters);
				mapPanel.map.addLayer(clusters);
				layerTemp=mapPanel.map.getLayersByName("Search station")[0]
				map.setLayerIndex(clusters, 0);
				// map.raiseLayer(clusters, -1)
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
        title: 'Legend Institutes   '+ '<img id="help_toolip" class="tooltipIcon" src='+icons+infoB+' data-qtip="'+toolip_groupLegendIMG+'" />',//<span data-qtip="hello">First Name</span>  
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
			// html: '<img src='+icons+'cluster.PNG height="25" width="25" style="vertical-align: middle;"/><span class="legendFond" style="vertical-align: middle;"> Cluster</span>'+
				  // '<div class="legendFond" id="ideam">IDEAM</div>'+
				  // '<div class="legendFond" id="cafenica">CAFENICA</div>'+
				  // '<div class="legendFond" id="cruz-roja">Cruz-Roja</div>'+
				  // '<div class="legendFond" id="afr-rising">Afr-Rising</div>'
				  
			html: '<table style="width:100%">'+
					  '<tr>'+
						'<td><img src='+icons+'cluster.PNG height="25" width="25" style="vertical-align: middle;"/><span class="legendFond" style="vertical-align: middle;"> Cluster</span></td>'+
						'<td><div class="legendFond" id="ideam">IDEAM (COL)</div></td>'+
						'<td><div class="legendFond" id="cafenica">CAFENICA (NIC)</div></td>'+
					  '</tr>'+
					  '<tr>'+
						'<td><img src='+icons+'map-marker-icon.png height="16" width="16" style="vertical-align: middle;"/><span class="legendFond" style="vertical-align: middle;"> Search</span></td>'+
						'<td><div class="legendFond" id="cruz-roja">Cruz-Roja (NIC)</div></td>'+
						'<td><div class="legendFond" id="afr-rising">Afr-Rising (ETH)</div></td>' +
					  '</tr>'+
					  '<tr>'+
						'<td><div class="legendFond" id="inmet">INMET (BRA)</div></td>' +
						'<td><div class="legendFond" id="Copeco">Copeco (HND)</div></td>' +
						'<td><div class="legendFond" id="noaa">DGRH (HND)</div></td>' +
					  '</tr>'+	
					  '<tr>'+
						'<td><div class="legendFond" id="enee">ENEE (HND)</div></td>' +
					  '</tr>'+					  
					'</table>'				  
				  
				  
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
        title: 'Layers map   '+ '<img id="help_toolip" class="tooltipIcon" src='+icons+infoB+' data-qtip="'+toolip_groupLayers+'" />',//<span data-qtip="hello">First Name</span>  
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
        /*var layerRec0 = mapPanel.layers.getAt(1);
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
		*/
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
			// border: true,
			style: 'border: solid #E1E1E1 1px',
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
				title: 'Search',
				items:[tabSearchLogin,tabSearchRegion,tabSearchStat,tabSearchQuery,tabSearchChirps]
			},{
				// contentEl:'script', 
				title: 'Options',
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
						// layer = mapPanel.map.layers[2];
						// layerBase=mapPanel.map.getLayersByName("Streets Map")[0]
						// if(tabPanel.items.length>2){
							// layerBase.redraw();
						// }
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
		// mapPanel.map.addControl(new OpenLayers.Control.PanZoomBar());
		// mapPanel.map.addControl(new OpenLayers.Control.Graticule(
			// {layerName: "Grid", visible: false, 
				// numPoints: 2, 
				// labelled: true
			// }
		// ));
		mapPanel.map.addControl(new OpenLayers.Control.MousePosition());
		
// ################################################################# POPUP IDENTIFY ##############################################################################################################			

		
		mapPanel.map.addLayer(locationLayer);
		mapPanel.map.addLayer(vectorHover);
		
		zoomToStation =function(ids){
			Ext.Ajax.request({ // PINTA ESTACION 
				url : 'php/Geo_statByregion-test.php' , 
				params : {type:21,listStatSel: Ext.encode(ids)},
				method: 'GET',
				success: function ( result, request ) {
					layerTemp=mapPanel.map.getLayersByName("SelSation")[0]
					if(layerTemp){layerTemp.destroyFeatures();}
					geocapa = result.responseText;
					var format = new OpenLayers.Format.GeoJSON({'internalProjection': new OpenLayers.Projection("EPSG:900913"), 'externalProjection': new OpenLayers.Projection("EPSG:4326")
					});
					// mapPanel.map.addLayer(layerTempRegion);
					// layerTemp=mapPanel.map.getLayersByName("Search_region")[0]
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

		
		function createPopupOne(feature,myFeatyures) {
			
			selIds=new Array()
			selname=new Array()
			for(var i = 0; i < myFeatyures.length; i++) {
				selIds.push(Number(myFeatyures[i].attributes.id));
				selname.push(myFeatyures[i].attributes.name);
			}

			Ext.define('modelGridPopup', { 
					extend: 'Ext.data.Model',
					fields: ['name','attri']
				});	
			
			var gridStatStore = Ext.create('Ext.data.Store', {
				// model: 'modelGridRegion',
				model: 'modelGridPopup',
				autoLoad: true,
				autoSync: false,
				// sorters: { property: 'name', direction : 'ASC' },
				proxy: {
					type: 'ajax',
					url: 'php/Geo_statByregion-test.php',
					// extraParams: {type:14,listStatSel:Ext.encode(selIds)},			
					extraParams: {type:22,listStatSel:Ext.encode(selIds)},	
					actionMethods: {
						read: 'POST'
					},					
					reader: {
						type: 'json',
						root: 'topics'
					}
				}
			});

				funcPupup = function(){
								// selectControl.control.deactivate();
								if(Ext.getCmp('gridRegionID')){
									Ext.getCmp('mainTableID').collapse();
									Ext.getCmp('gridRegionID').destroy();	
								}	
								if(Ext.getCmp('gridRegionID_1')){
									Ext.getCmp('mainTableID').collapse();
									Ext.getCmp('gridRegionID_1').destroy();
								}								
								if(Ext.getCmp('popupID')){
									Ext.getCmp('popupID').close()
								}	
								
								// layerTemp=mapPanel.map.getLayersByName("Search_region")[0]
								// if(layerTemp){layerTemp.destroyFeatures();mapPanel.map.removeLayer(layerTemp);}
								layerTempRegion.destroyFeatures();
								
								FindStation=mapPanel.map.getLayersByName("Search station")[0]
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
													url: 'php/Geo_statByregion-test.php',
													extraParams: {type:14,listStatSel:Ext.encode(selectID)},	
													actionMethods: {
														read: 'POST'
													},												
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
													url: 'php/Geo_statByregion-test.php',
													extraParams: {type:15,listStatSel:Ext.encode(selectID)},
													actionMethods: {
														read: 'POST'
													},												
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
												mode: 'SIMPLE',
												listeners: {
													selectionchange: function(sm, selections) {
														gridRegion.down('#removeButton').setDisabled(selections.length === 0);
														gridRegion.down('#idstatistic').setDisabled(selections.length === 0);
														
													}
												},
												select: function(records, keepExisting, suppressEvent) {
													if (Ext.isDefined(records)) {
														this.doSelect(records, keepExisting, suppressEvent);
													}
												},
												selectAll: function( suppressEvent ) {
													var me = this,
														selections = me.store.getRange();
													countFree=[]
													for( var key in selections ) {
														if( selections[key].data.copyright == 'Free'){
															countFree.push(selections[key].data.copyright)
														}
													}
													
													if(countFree.length>150){
														winInfo=Ext.MessageBox.show({
														   title: 'Information',
														   msg: 'Exceeds the maximum number (Max. 150) of downloads',
														   width:300,
														   buttons: Ext.MessageBox.OK,
														   animateTarget: 'info',
														   icon: 'x-message-box-info'
														});	
														winInfo.setPosition(mainPanelWidth/3,mainPanelHeight/2);
													}else{
														var i = 0,
															len = selections.length,
															selLen = me.getSelection().length;
															
														// if( len != selLen ) {
														if( selLen==0 ) {
															me.bulkChange = true;
															for (; i < len; i++) {
																me.doSelect(selections[i], true, suppressEvent);
															}
															delete me.bulkChange;
															me.maybeFireSelectionChange(me.getSelection().length !== selLen);
														}
														else {
															me.deselectAll( suppressEvent );
														}									
													}
												} //												
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
												// layerTemp=mapPanel.map.getLayersByName("Search station")[0]

												FeatselectID=[]
												for (var i = feature.length - 1; i >= 0; --i) {
													if(feature[i].renderIntent=='select'){
															sel=feature[i]//.cluster[j]
															FeatselectID.push(sel)
													}
												}
												// console.log(FeatselectID)
												// console.log(FeatselectID[0].geometry.getBounds())
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
												// maxHeight: Ext.getBody().getViewSize().height*0.3,
												width: mainPanelWidth,
												height:mainPanelHeight*0.4,
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
															tooltip: 'Graphic',
															handler: function(grid, rowIndex, colIndex) {
																var rec = gridStatStore.getAt(rowIndex);
																selectionID = rec.get('id');
																statName = rec.get('name');
																copyrightN = rec.get('copyright');
																	var periodst = Ext.create('Ext.data.Store', {
																			fields: ['value','name'], 
																			data: [ 
																				{value:1,name: 'Daily'}, 
																				{value:2,name: 'Monthly'}, 
																				{value:3,name: 'Yearly'}
																			]																	
																	})																
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
																		id:'cmbPeriodID',
																		labelWidth:150,
																		store: periodst,
																		displayField: 'name',
																		value: 1,
																		queryMode: 'local',
																		valueField: 'value', 								
																		typeAhead: true,
																		listeners: {
																			select: function() {
																				var actTab = tabs.getActiveTab();
																				var idx = tabs.items.indexOf(actTab);
																				// actTabId=parseInt((actTab.title).match(/\d+/)[0])
																				var idPeriod = Ext.getCmp('cmbPeriodID').getValue()
																				var qc = Ext.getCmp('qcCmbGrapID').getValue()
																				
																				if (copyrightN == 'Free') {
																					generateGraps(selectionID,idPeriod,Ext.encode(cmbVar.getValue()),qc)
																				}else if (copyrightN != 'Free' && idPeriod==1){
																					winInfo=Ext.MessageBox.show({
																					   title: 'Information',
																					   msg: 'Sorry, You are not authorized to download data.',
																					   width:300,
																					   buttons: Ext.MessageBox.OK,
																					   animateTarget: 'error',
																					   icon: 'x-message-box-error'
																					   
																					});	
																					winInfo.setPosition(mainPanelWidth/3,mainPanelHeight/2);																			
																					Ext.getCmp('cmbPeriodID').setValue(3);
																				}else if (copyrightN != 'Free' && idPeriod==2 ){
																					winInfo=Ext.MessageBox.show({
																					   title: 'Information',
																					   msg: 'Sorry, You are not authorized to download data.',
																					   width:300,
																					   buttons: Ext.MessageBox.OK,
																					   animateTarget: 'error',
																					   icon: 'x-message-box-error'
																					   
																					});	
																					winInfo.setPosition(mainPanelWidth/3,mainPanelHeight/2);
																					Ext.getCmp('cmbPeriodID').setValue(3);
																				}
																			}
																		}
																	});	
																	if (copyrightN != 'Free') {
																	Ext.getCmp('cmbPeriodID').setValue(3);
																	}else{Ext.getCmp('cmbPeriodID').setValue(1);}
																	
																	btonReturn= new Ext.Button({
																		pressedCls : 'my-pressed',
																		overCls : 'my-over',
																		tooltip: "Return to map",
																		text:'Return to map',
																		icon: icons+'map.png', 
																		scale: 'small',
																		handler: function(){
																			tabs.setActiveTab(0);
																		}													
																	});	
																	if(Ext.getCmp('graphic_tab')){
																		tabs.remove(Ext.getCmp('graphic_tab'), true);
																	}												

																	tabs.add({
																		// contentEl: "desc",
																		// xtype: 'panel',
																		title: 'Graph '+statName,//'Graphic_id'+selectionID
																		name: 'graphic_tab',
																		// width:mainPanelWidth-15,
																		// height: mainPanelHeight,
																		autoScroll: true,
																		// height: 100,
																		// autoHeight: true,
																		// layout: 'fit',
																		id: 'graphic_tab',
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
																			items: [cmbPeriod,{xtype: 'tbfill'},btonReturn]
																			}
																		]													
																	});		
																	
																	var t = new Ext.XTemplate(tpl);
																	Ext.getCmp('graphic_tab').update(t.apply(datatest));
																	// Ext.getCmp('graphic'+selectionID).update('This<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long');
																	
																	Ext.getCmp('mapPanelID').setHeight(0)
																	Ext.getCmp('tabsID').setWidth(mainPanelWidth-15);
																	// Ext.getCmp('tabsID').setHeight(mainPanelHeight*0.2);
																	tabs.setActiveTab('graphic_tab');
																	var qc = Ext.getCmp('qcCmbGrapID').getValue()
																	generateGraps(selectionID,cmbPeriod.getValue(),Ext.encode(cmbVar.getValue()),qc)
																
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
													{ text: 'download',minWidth: 50,dataIndex: 'copyright', flex: 3,tdCls: 'x-change-cell'},
													{ text: 'id',minWidth: 50,dataIndex: 'id', flex: 1,tdCls: 'x-change-cell'},
													{ text: 'code',minWidth: 80,dataIndex: 'code', flex: 1,tdCls: 'x-change-cell'},
													{ text: 'name',minWidth: 120,dataIndex: 'name', flex: 4,tdCls: 'x-change-cell'},
													{ text: 'institute',minWidth: 50,dataIndex: 'institute', flex: 3,tdCls: 'x-change-cell'},
													{ text: 'model',minWidth: 80,dataIndex: 'model', flex: 2,tdCls: 'x-change-cell'},
													
													// { text: 'category',minWidth: 100,dataIndex: 'category', flex: 4},

													// { text: 'instalation',minWidth: 80,dataIndex: 'instalation', flex: 3},
													// { text: 'quality',minWidth: 80,dataIndex: 'quality', flex: 1},
													
													{ text: 'variables',minWidth: 100,dataIndex: 'variables', flex: 4,tdCls: 'x-change-cell'},
													
													
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
												viewConfig: { 
													stripeRows: false, 
													getRowClass: function(record, index, rowParams, stor) {
													   var c = record.get('copyright');
													   // return id == '1' ? 'general-rule' : ''; // para desaparecer el check
														if (c == 'Restricted' || c == 'Request') {
															return 'price-fall';
														} 
													}	
												},
												listeners: {
													beforeselect: function ( row, model, index ) {
														if ( model.data.copyright == "Restricted" || model.data.copyright == 'Request') {
															return false;
														}
													},
													selectionchange: function(sm, selections){ // hay problema cuando se selecciona el cursor vuelve a la primera fila
														// layerTempSel.removeAllFeatures();
														layerTempSel.destroyFeatures();
														// gridRegion.down('#numRecordsSelected').setText('Selected: ' + selections.length);
														feature = layerTempStat.features;
														for (var i = feature.length - 1; i >= 0; --i) {
															// for (var j = feature[i].cluster.length - 1; j >= 0; --j) {
																idall=feature[i].attributes.id;
																for (var k = selections.length - 1; k >= 0; --k) {
																	idsel=selections[k].data.id
																	if(idall==idsel){
																		// feature[i].layer.styleMap.styles.default.rules[0].symbolizer.externalGraphic="iconosGIS/bloqE_16px.png" 
																		// layerTempSel.drawFeature(feature[i])
																		 // mapPanel.map.refresh();	
																		var point = new OpenLayers.Feature.Vector(
																			new OpenLayers.Geometry.Point(feature[i].geometry.x, feature[i].geometry.y));	
																		layerTempSel.addFeatures([point]);
																		mapPanel.map.setLayerIndex(layerTempSel, 99);
																	}
																}												
															// }											
														}
													}												
												},
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
													},{ xtype: 'tbtext', itemId: 'numRecords' },
													// { xtype: 'tbtext', itemId: 'numRecordsSelected' },
													{xtype: 'tbfill'},
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
														url: 'php/Geo_statByregion-test.php',
														extraParams: {
															idstat: record.get("id"),type:17
														},
														actionMethods: {
															read: 'POST'
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
													columns: [
														{ text: 'name',dataIndex: 'name'},
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
													// gridRegion.down('#numRecordsSelected').setText('Selected: ' + 0);
													Ext.getCmp('mainTableID').expand()
													
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

			gridRegionHover = Ext.create('Ext.grid.Panel', {
				id: 'gridRegionIDHover',
				border: true,
				// layout: 'fit',
				forceFit: true,
				store: gridStatStore,
				maxHeight: 150,
				enableColumnHide: false,
				hideHeaders: true,
				// width: 200,
				cls: 'custom-gridPanelHover',
				// height:273,
				// maxHeight: mainPanelHeight*0.4,
				autoHeight: true,
				columns: [
					{ minWidth: 60,dataIndex: 'name', flex: 1,menuDisabled: true,tdCls: 'x-change-cell'},
					{ minWidth: 100,dataIndex: 'attri', flex: 4,menuDisabled: true}
				],
				columnLines: false,
				stripeRows: false,
				viewConfig: {
					getRowClass: function(record, index) {
							//var c = record.get('name');
							return 'gridRegionHover-1column';
					}
				}			
				// dockedItems: [
					// {
					// xtype: 'toolbar',
					// items: [{
						// itemId: 'removeButtonHover',
						// text:'Download data',
						// icon   : iconGridDownload,
						// scale: 'small',
						// handler: funcPupup
					// }]
				// }]
			});
			
			statName = selname[0];	
			
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
					width:220,
					maxHeight:300,
					items: [gridRegionHover],
					anchorPosition: 'auto',
					tools: [
						{
							tooltip: 'Graphic',
							scale: 'small',
							cls:"toolGraph",
							handler: function(){
								selectionID = selIds[0];
								
								
								Ext.Ajax.request({
									url: 'php/Geo_statByregion-test.php',
									method: 'POST',
									params : {type:27,idstat:selectionID},
									success: function(response, opts) {
										resul=response.responseText
										if(resul=="OK"){
											var arrayvar =["prec","tmax","tmean","tmin","sbright","rhum","srad","windd","wsmean"]//varlist.split(',');
											
											var datatest = {
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
												id:'cmbPeriodID',
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
														// actTabId=parseInt((actTab.title).match(/\d+/)[0])
														var idPeriod = Ext.getCmp('cmbPeriodID').getValue()
														// var qc = Ext.getCmp('qcCmbGrapID').getValue()
														generateGraps(selectionID,idPeriod,"ALL","ALL")

													}
												}
											});		
											
											btonReturn= new Ext.Button({
												pressedCls : 'my-pressed',
												overCls : 'my-over',
												tooltip: "Return to map",
												text:'Return to map',
												icon: icons+'map.png', 
												scale: 'small',
												handler: function(){
													tabs.setActiveTab(0);
												}													
											});	
											if(Ext.getCmp('graphic_tab')){
												tabs.remove(Ext.getCmp('graphic_tab'), true);
											}								
											
											tabs.add({
												title: 'Graph '+statName,//'Graphic_id'+selectionID
												name: 'graphic_tab',
												autoScroll: true,
												id: 'graphic_tab',
												closable: true,
												dockedItems: [
													{
													xtype: 'toolbar',
													items: [cmbPeriod,{xtype: 'tbfill'},btonReturn]
													}
												]													
											});
											
											var t = new Ext.XTemplate(tpl);
											Ext.getCmp('graphic_tab').update(t.apply(datatest));
											Ext.getCmp('mapPanelID').setHeight(0)
											Ext.getCmp('tabsID').setWidth(mainPanelWidth-15);
											tabs.setActiveTab('graphic_tab');
											// var qc = Ext.getCmp('qcCmbGrapID').getValue()
											generateGraps(selectionID,cmbPeriod.getValue(),'ALL','ALL')
											
										}else{
											// Ext.Msg.alert('Login Failed!',"Sorry, a user with this login and/or e-mail address already exist."); 
											winInfo=Ext.MessageBox.show({
											   title: 'Information',
											   msg: 'Sorry, You are not authorized to download data.',
											   width:300,
											   buttons: Ext.MessageBox.OK,
											   animateTarget: 'error',
											   icon: 'x-message-box-error'
											   
											});	
											winInfo.setPosition(mainPanelWidth/3,mainPanelHeight/2);																			
										}
									},
									failure: function(response, opts) {
										var responseText = (response.responseText ? response.responseText : 'Unable to contact the server.  Please try again later.');
										panelLaunch({
											iconClass: 'x-panel-action-icon-tick',
											position: 'br',
											actionMethod: ['hide']
										}, responseText);
									},
									scope: this
								});																
										


							
							}
							
						},	
						{
							tooltip: 'Statistic',
							scale: 'small',
							cls:"toolStatistic",
							handler: function(){
								if(Ext.getCmp('gridStatisticID')){
									Ext.getCmp('gridStatisticID').destroy();	
								}
								selgrid=Ext.encode(selIds)
								varList="ALL"

								var statisticStore = Ext.create('Ext.data.Store', {
									model: 'modelStatistic',
									autoLoad: true,
									// autoSync: true,
									sorters: { property: 'name', direction : 'ASC' },
									proxy: {
										type: 'ajax',
										url: 'php/statistics.php',
										extraParams: {stations : selgrid, variable:varList},	
										actionMethods: {
											read: 'POST'
										},										
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
										{ text: 'start date',minWidth: 80,dataIndex: 'date_start', flex: 2},
										{ text: 'end date',minWidth: 80,dataIndex: 'date_end', flex: 2},										
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
							
							
							}
						},						
						{
							tooltip: 'Show more info',//'Download data',
							scale: 'small',
							cls:"toolDownload",
							handler: funcPupup
						}
					],	
					alwaysOnTop: true,					
					maximizable: false,
					collapsible: false,					
					listeners:{		
						resize: {
						  fn: function(el) {
							if(el.height){
							  gridRegionHover.maxHeight=el.height-40
							  // Ext.getCmp('popupID').maxHeight=el.height
							  Ext.getCmp('gridRegionIDHover').getView().refresh();
							} 
						  }
						},
						afterrender : function(panel) {
							var header = panel.header;
							header.setHeight(36);
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
		} // fin createPopupOne

		
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
					url: 'php/Geo_statByregion-test.php',
					extraParams: {type:14,listStatSel:Ext.encode(selIds)},
					actionMethods: {
						read: 'POST'
					},						
					reader: {
						type: 'json',
						root: 'topics'
					}
				}
			});
			
				funcPupup = function(){
								// selectControl.control.deactivate();
								if(Ext.getCmp('gridRegionID')){
									Ext.getCmp('mainTableID').collapse();
									Ext.getCmp('gridRegionID').destroy();	
								}
								if(Ext.getCmp('gridRegionID_1')){
									Ext.getCmp('mainTableID').collapse();
									Ext.getCmp('gridRegionID_1').destroy();
								}								
								if(Ext.getCmp('popupID')){
									Ext.getCmp('popupID').close()
								}	
								
								// layerTemp=mapPanel.map.getLayersByName("Search_region")[0]
								// if(layerTemp){layerTemp.destroyFeatures();mapPanel.map.removeLayer(layerTemp);}
								layerTempRegion.destroyFeatures();
								
								FindStation=mapPanel.map.getLayersByName("Search station")[0]
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
													url: 'php/Geo_statByregion-test.php',
													extraParams: {type:14,listStatSel:Ext.encode(selectID)},	
													actionMethods: {
														read: 'POST'
													},												
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
													url: 'php/Geo_statByregion-test.php',
													extraParams: {type:15,listStatSel:Ext.encode(selectID)},
													actionMethods: {
														read: 'POST'
													},												
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
												mode: 'SIMPLE',
												listeners: {
													selectionchange: function(sm, selections) {
														gridRegion.down('#removeButton').setDisabled(selections.length === 0);
														gridRegion.down('#idstatistic').setDisabled(selections.length === 0);
														
													}
												},
												select: function(records, keepExisting, suppressEvent) {
													if (Ext.isDefined(records)) {
														this.doSelect(records, keepExisting, suppressEvent);
													}
												},
												selectAll: function( suppressEvent ) {
													var me = this,
														selections = me.store.getRange();
													countFree=[]
													for( var key in selections ) {
														if( selections[key].data.copyright == 'Free'){
															countFree.push(selections[key].data.copyright)
														}
													}
													
													if(countFree.length>150){
														winInfo=Ext.MessageBox.show({
														   title: 'Information',
														   msg: 'Exceeds the maximum number (Max. 150) of downloads',
														   width:300,
														   buttons: Ext.MessageBox.OK,
														   animateTarget: 'info',
														   icon: 'x-message-box-info'
														});	
														winInfo.setPosition(mainPanelWidth/3,mainPanelHeight/2);
													}else{
														var i = 0,
															len = selections.length,
															selLen = me.getSelection().length;
															
														// if( len != selLen ) {
														if( selLen==0 ) {
															me.bulkChange = true;
															for (; i < len; i++) {
																me.doSelect(selections[i], true, suppressEvent);
															}
															delete me.bulkChange;
															me.maybeFireSelectionChange(me.getSelection().length !== selLen);
														}
														else {
															me.deselectAll( suppressEvent );
														}									
													}
												} //												
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
												// layerTemp=mapPanel.map.getLayersByName("Search station")[0]

												FeatselectID=[]
												for (var i = feature.length - 1; i >= 0; --i) {
													if(feature[i].renderIntent=='select'){
															sel=feature[i]//.cluster[j]
															FeatselectID.push(sel)
													}
												}
												// console.log(FeatselectID)
												// console.log(FeatselectID[0].geometry.getBounds())
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
												// maxHeight: Ext.getBody().getViewSize().height*0.3,
												width: mainPanelWidth,
												height:mainPanelHeight*0.4,
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
																statName = rec.get('name');
																copyrightN = rec.get('copyright');
																	var periodst = Ext.create('Ext.data.Store', {
																			fields: ['value','name'], 
																			data: [ 
																				{value:1,name: 'Daily'}, 
																				{value:2,name: 'Monthly'}, 
																				{value:3,name: 'Yearly'}
																			]																	
																	})
																
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
																		id:'cmbPeriodID',
																		labelWidth:150,
																		store: periodst,
																		displayField: 'name',
																		value: 1,
																		queryMode: 'local',
																		valueField: 'value', 								
																		typeAhead: true,
																		listeners: {
																			select: function() {
																				var actTab = tabs.getActiveTab();
																				var idx = tabs.items.indexOf(actTab);
																				// actTabId=parseInt((actTab.title).match(/\d+/)[0])
																				var idPeriod = Ext.getCmp('cmbPeriodID').getValue()
																				var qc = Ext.getCmp('qcCmbGrapID').getValue()
																				if (copyrightN == 'Free') {
																					generateGraps(selectionID,idPeriod,Ext.encode(cmbVar.getValue()),qc)
																				}else if (copyrightN != 'Free' && idPeriod==1){
																					winInfo=Ext.MessageBox.show({
																					   title: 'Information',
																					   msg: 'Sorry, You are not authorized to download data.',
																					   width:300,
																					   buttons: Ext.MessageBox.OK,
																					   animateTarget: 'error',
																					   icon: 'x-message-box-error'
																					   
																					});	
																					winInfo.setPosition(mainPanelWidth/3,mainPanelHeight/2);																			
																					Ext.getCmp('cmbPeriodID').setValue(3);
																				}else if (copyrightN != 'Free' && idPeriod==2 ){
																					winInfo=Ext.MessageBox.show({
																					   title: 'Information',
																					   msg: 'Sorry, You are not authorized to download data.',
																					   width:300,
																					   buttons: Ext.MessageBox.OK,
																					   animateTarget: 'error',
																					   icon: 'x-message-box-error'
																					   
																					});	
																					winInfo.setPosition(mainPanelWidth/3,mainPanelHeight/2);
																					Ext.getCmp('cmbPeriodID').setValue(3);
																				}																				

																			}
																		}
																	});	
																	if (copyrightN != 'Free') {
																	Ext.getCmp('cmbPeriodID').setValue(3);
																	}else{Ext.getCmp('cmbPeriodID').setValue(1);}
																	
																	btonReturn= new Ext.Button({
																		pressedCls : 'my-pressed',
																		overCls : 'my-over',
																		tooltip: "Return to map",
																		text:'Return to map',
																		icon: icons+'map.png', 
																		scale: 'small',
																		handler: function(){
																			tabs.setActiveTab(0);
																		}													
																	});	
																	if(Ext.getCmp('graphic_tab')){
																		tabs.remove(Ext.getCmp('graphic_tab'), true);
																	}												

																	tabs.add({
																		// contentEl: "desc",
																		// xtype: 'panel',
																		title: 'Graph '+statName,//'Graphic_id'+selectionID
																		name: 'graphic_tab',
																		// width:mainPanelWidth-15,
																		// height: mainPanelHeight,
																		autoScroll: true,
																		// height: 100,
																		// autoHeight: true,
																		// layout: 'fit',
																		id: 'graphic_tab',
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
																			items: [cmbPeriod,{xtype: 'tbfill'},btonReturn]
																			}
																		]													
																	});		
																	
																	var t = new Ext.XTemplate(tpl);
																	Ext.getCmp('graphic_tab').update(t.apply(datatest));
																	// Ext.getCmp('graphic'+selectionID).update('This<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long');
																	
																	Ext.getCmp('mapPanelID').setHeight(0)
																	Ext.getCmp('tabsID').setWidth(mainPanelWidth-15);
																	// Ext.getCmp('tabsID').setHeight(mainPanelHeight*0.2);
																	tabs.setActiveTab('graphic_tab');
																	var qc = Ext.getCmp('qcCmbGrapID').getValue()
																	generateGraps(selectionID,cmbPeriod.getValue(),Ext.encode(cmbVar.getValue()),qc)
																
															}, // handler
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
													{ text: 'download',minWidth: 80,dataIndex: 'copyright', flex: 3,tdCls: 'x-change-cell'},
													{ text: 'code',minWidth: 70,dataIndex: 'code', flex: 1,tdCls: 'x-change-cell'},
													{ text: 'name',minWidth: 120,dataIndex: 'name', flex: 4,tdCls: 'x-change-cell'},
													{ text: 'institute',minWidth: 70,dataIndex: 'institute', flex: 3,tdCls: 'x-change-cell'},
													{ text: 'model',minWidth: 80,dataIndex: 'model', flex: 2,tdCls: 'x-change-cell'},
													

													
													{ text: 'variables',minWidth: 120,dataIndex: 'variables', flex: 4,tdCls: 'x-change-cell'},
													
													
													// { text: 'lon',minWidth: 80,dataIndex: 'lon', flex: 3},
													// { text: 'lat',minWidth: 80,dataIndex: 'lat', flex: 3},
													{ text: 'elevation (m)',minWidth: 80,dataIndex: 'elev', flex: 2,tdCls: 'x-change-cell'},
													{ text: 'category',minWidth: 100,dataIndex: 'category', flex: 3,tdCls: 'x-change-cell'},
													{ text: 'instalation',minWidth: 80,dataIndex: 'instalation', flex: 3,tdCls: 'x-change-cell'},
													{ text: 'suspension',minWidth: 80,dataIndex: 'suspension', flex: 3,tdCls: 'x-change-cell'},
													{ text: 'quality',minWidth: 70,dataIndex: 'quality', flex: 1,tdCls: 'x-change-cell'},									
													{ text: 'country',minWidth: 80,dataIndex: 'country', flex: 4,tdCls: 'x-change-cell'},
													{ text: 'state',minWidth: 80,dataIndex: 'state', flex: 4,tdCls: 'x-change-cell'},
													{ text: 'city',minWidth: 90,dataIndex: 'city', flex: 4,tdCls: 'x-change-cell'}
													
												],
												columnLines: true,
												stripeRows: true,
												// margin: '0 0 20 0',
												selModel: selModel,
												viewConfig: { 
													stripeRows: false, 
													getRowClass: function(record, index, rowParams, stor) {
													   var c = record.get('copyright');
													   // return id == '1' ? 'general-rule' : ''; // para desaparecer el check
														if (c == 'Restricted' || c == 'Request') {
															return 'price-fall';
														} 
													}	
												},
												listeners: {
													beforeselect: function ( row, model, index ) {
														if ( model.data.copyright == "Restricted" || model.data.copyright == 'Request') {
															return false;
														}
													},
													selectionchange: function(sm, selections){ // hay problema cuando se selecciona el cursor vuelve a la primera fila
														// layerTempSel.removeAllFeatures();
														layerTempSel.destroyFeatures();
														// gridRegion.down('#numRecordsSelected').setText('Selected: ' + selections.length);
														feature = layerTempStat.features;
														for (var i = feature.length - 1; i >= 0; --i) {
															// for (var j = feature[i].cluster.length - 1; j >= 0; --j) {
																idall=feature[i].attributes.id;
																for (var k = selections.length - 1; k >= 0; --k) {
																	idsel=selections[k].data.id
																	if(idall==idsel){
																		// feature[i].layer.styleMap.styles.default.rules[0].symbolizer.externalGraphic="iconosGIS/bloqE_16px.png" 
																		// layerTempSel.drawFeature(feature[i])
																		 // mapPanel.map.refresh();	
																		var point = new OpenLayers.Feature.Vector(
																			new OpenLayers.Geometry.Point(feature[i].geometry.x, feature[i].geometry.y));	
																		layerTempSel.addFeatures([point]);
																		mapPanel.map.setLayerIndex(layerTempSel, 99);
																	}
																}												
															// }											
														}
													}												
												},
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
													},{
														itemId: 'idExpand',
														text:'Expand all',
														tooltip:'Expand all',
														iconCls:iconGridExpand,
														handler: expand 
													}*/,{
													
														itemId: 'idstatistic',
														text:'Statistics',
														tooltip:'Summary Statistic',
														icon   : iconGridStatistics,
														disabled: true,
														handler: statistics 
													},{ xtype: 'tbtext', itemId: 'numRecords' },
													// { xtype: 'tbtext', itemId: 'numRecordsSelected' },
													{xtype: 'tbfill'},
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

											gridStatStore.on('load', function(ds){
												countRow=ds.getTotalCount()
												if(countRow>=1){
													// winRegion.show()
													// Ext.getCmp('gridRegionID').add(gridRegion);
													// Ext.getCmp('gridRegionID').doLayout();
													
													Ext.getCmp('mainTableID').add(gridRegion);
													gridRegion.down('#numRecords').setText('Records: ' + countRow);
													// gridRegion.down('#numRecordsSelected').setText('Selected: ' + 0);
													Ext.getCmp('mainTableID').expand()
													
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
			
			gridRegionHover = Ext.create('Ext.grid.Panel', {
				id: 'gridRegionIDHover',
				border: true,
				// layout: 'fit',
				forceFit: true,
				store: gridStatStore,
				maxHeight: 150,
				enableColumnHide: false,
				// width: 200,
				cls: 'custom-gridPanelHover',
				// height:273,
				// maxHeight: mainPanelHeight*0.4,
				autoHeight: true,
				columns: [
					{ text: 'cod',minWidth: 45,dataIndex: 'code', flex: 1,menuDisabled: true},
					{ text: 'name',minWidth: 100,dataIndex: 'name', flex: 4,menuDisabled: true},
					{ text: 'model',minWidth: 70,dataIndex: 'model', flex: 2,menuDisabled: true},
					{ text: 'variables',minWidth: 120,dataIndex: 'variables', flex: 4,menuDisabled: true}
				],
				columnLines: true,
				stripeRows: true,
				listeners: {
					cellclick: function(view, td, cellIndex, record, tr, rowIndex, e, eOpts) {
						var rec = gridStatStore.getAt(rowIndex);
						selectionID = rec.get('id');
						for (var i = myFeatyures.length - 1; i >= 0; --i) {
							if(myFeatyures[i].attributes.id==selectionID){
								featureSel=myFeatyures[i].geometry
								var bounds = featureSel.getBounds();
								if(bounds){ mapPanel.map.panTo(bounds.getCenterLonLat()); mapPanel.map.zoomToExtent(bounds);}
								mapPanel.map.zoomTo(13);
								// mapPanel.map.zoomOut()
							}
						}						
					
					}
				}
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
					width:220,
					maxHeight:300,
					items: [gridRegionHover],
					anchorPosition: 'auto',
					tools: [
						{
							tooltip: 'Show more info',//'Download data',
							scale: 'small',
							cls:"toolDownload",
							handler: funcPupup
						}
					],	
					alwaysOnTop: true,					
					maximizable: false,
					collapsible: false,					
					listeners:{		
						resize: {
						  fn: function(el) {
							if(el.height){
							  gridRegionHover.maxHeight=el.height-40
							  // Ext.getCmp('popupID').maxHeight=el.height
							  Ext.getCmp('gridRegionIDHover').getView().refresh();
							} 
						  }
						},
						afterrender : function(panel) {
							var header = panel.header;
							header.setHeight(36);
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

		/*clusters.events.on({
		  'featureselected': function(event) {
		  
			var myFeatyures = event.feature.cluster;
			var f = event.feature;
			allfeatures=new Array()
			if(Ext.getCmp('popupID')){
				Ext.getCmp('popupID').close()
			}				
			if(myFeatyures.length>1){
				for (var i = myFeatyures.length - 1; i >= 0; --i) {
					// vectorHover.drawFeature(myFeatyures[i]);
					// allfeatures.push(myFeatyures[i])
				}
				createPopup(event.feature,myFeatyures);
			}else{
				createPopupOne(event.feature,myFeatyures);
			}

		  },
		  'featureunselected': function(event) {
				// vectorHover.removeAllFeatures();
				// vectorHover.destroyFeatures();
				
		  }
		});*/

		var styleHoverNull = new OpenLayers.Style(null, {
			fillColor: ""
		});	
		function onFeatureSelect1(event) {
			var myFeatyures = event.cluster;
			allfeatures=new Array()
			if(Ext.getCmp('popupID')){
				Ext.getCmp('popupID').close()
			}				
			if(myFeatyures.length>1){
				createPopup(event,myFeatyures);
			}else{
				createPopupOne(event,myFeatyures);
			}		
		}
		function onFeatureSelect1Click(event) {
			var myFeatyures = event.cluster;
			if(Ext.getCmp('popupID')){
				Ext.getCmp('popupID').close()
			}	

			selIds=new Array()
			// selname=new Array()
			for(var i = 0; i < myFeatyures.length; i++) {
				selIds.push(Number(myFeatyures[i].attributes.id));
				// selname.push(myFeatyures[i].attributes.name);
			}

			var qcstore = Ext.create('Ext.data.Store', {
				model: 'modelQC',
				autoLoad: true,
				autoSync: true,
				sorters: { property: 'name', direction : 'ASC' },

				proxy: {
					type: 'ajax',
					url: 'php/Geo_statByregion-test.php',
					extraParams: {type:29,listStatSel:Ext.encode(selIds)},
					actionMethods: {
						read: 'POST'//'POST'
					},												
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
							  description: 'ALL'
							  
						  }]),
						  store.insert(1, [{
							  id: 1,
							  name: 'raw',
							  description: 'Original data'
							  
						  }]);														  
					 }
				  }								
			});	
			qualitycCmb = Ext.create('Ext.form.field.ComboBox', { 
				fieldLabel: 'Quality control:',
				labelWidth:90,
				editable: false, 
				value: 'ALL',
				multiSelect: false, 
				displayField: 'name',
				valueField: 'name', 
				id:'qcCmbID',
				queryMode: 'local',
				typeAhead: true,	
				store: qcstore,
				width: 180,												
				listConfig: {
					getInnerTpl: function() {
						return '<div data-qtip="{description}">{name}</div>';
					}
				},
				listeners: {
					select: function() {
						var qc = Ext.getCmp('qcCmbID').getValue()
						var selection = gridRegion.getView().getSelectionModel();//[0];
						getdata=gridRegion.getStore().data.items
						for(var i = 0; i < getdata.length; i++) {
							if(getdata[i].data.quality==qc){
								selection.select(i,true);
							}
						}
						var number_of_selected_records = selection.getSelection().length;
						var name = Ext.getCmp('numRecordsSelected').setText( 'Selected: ' +number_of_selected_records);														
					}
				}											
			});		
			var qcstoreGrap = Ext.create('Ext.data.Store', {
				model: 'modelQC',
				autoLoad: true,
				autoSync: true,
				sorters: { property: 'name', direction : 'ASC' },

				proxy: {
					type: 'ajax',
					url: 'php/Geo_statByregion-test.php',
					extraParams: {type:29,listStatSel:Ext.encode(selIds)},
					actionMethods: {
						read: 'POST'//'POST'
					},												
					reader: {
						type: 'json',
						root: 'topics'
					}
				},
				listeners: {
					 load: function(store, records) {
						  store.insert(0, [{
							  id: 0,
							  name: 'raw',
							  description: 'Original data'
							  
						  }]);														  
					 }
				  }								
			});	 			
			if(myFeatyures.length>1){
				funcPupup = function(){
								// selectControl.control.deactivate();
								if(Ext.getCmp('gridRegionID')){
									Ext.getCmp('mainTableID').collapse();
									Ext.getCmp('gridRegionID').destroy();	
								}	
								if(Ext.getCmp('gridRegionID_1')){
									Ext.getCmp('mainTableID').collapse();
									Ext.getCmp('gridRegionID_1').destroy();
								}								
								if(Ext.getCmp('popupID')){
									Ext.getCmp('popupID').close()
								}	
								
								// layerTemp=mapPanel.map.getLayersByName("Search_region")[0]
								// if(layerTemp){layerTemp.destroyFeatures();mapPanel.map.removeLayer(layerTemp);}
								layerTempRegion.destroyFeatures();
								
								FindStation=mapPanel.map.getLayersByName("Search station")[0]
								if(FindStation){FindStation.destroyFeatures();}
										
								// loading status
								var myMask = new Ext.LoadMask(Ext.getCmp('mapPanelID'), {msg:"Please wait..."});
								myMask.show();
								
								selectID=selIds
								// console.log(myFeatyures)
								// onFeatureSelect(myFeatyures)
								// ##############################################################    TABLA GRID ##################################
								
											var gridStatStore = Ext.create('Ext.data.Store', {
												model: 'modelGridRegion',
												autoLoad: true,
												autoSync: true,
												sorters: { property: 'name', direction : 'ASC' },
												proxy: {
													type: 'ajax',
													url: 'php/Geo_statByregion-test.php',
													extraParams: {type:14,listStatSel:Ext.encode(selectID)},	
													actionMethods: {
														read: 'POST'
													},												
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
													url: 'php/Geo_statByregion-test.php',
													extraParams: {type:28,listStatSel:Ext.encode(selectID)},
													actionMethods: {
														read: 'GET'//'POST'
													},												
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
												mode: 'SIMPLE',
												listeners: {
													selectionchange: function(sm, selections) {
														gridRegion.down('#removeButton').setDisabled(selections.length === 0);
														gridRegion.down('#idstatistic').setDisabled(selections.length === 0);
													}
												},
												select: function(records, keepExisting, suppressEvent) {
													if (Ext.isDefined(records)) {
														this.doSelect(records, keepExisting, suppressEvent);
													}
												},
												selectAll: function( suppressEvent ) {
													var me = this,
														selections = me.store.getRange();
													countFree=[]
													for( var key in selections ) {
														if( selections[key].data.copyright == 'Free'){
															countFree.push(selections[key].data.copyright)
														}
													}
													
													if(countFree.length>150){
														winInfo=Ext.MessageBox.show({
														   title: 'Information',
														   msg: 'Exceeds the maximum number (Max. 150) of downloads',
														   width:300,
														   buttons: Ext.MessageBox.OK,
														   animateTarget: 'info',
														   icon: 'x-message-box-info'
														});	
														winInfo.setPosition(mainPanelWidth/3,mainPanelHeight/2);
													}else{
														var i = 0,
															len = selections.length,
															selLen = me.getSelection().length;
															
														// if( len != selLen ) {
														if( selLen==0 ) {
															me.bulkChange = true;
															for (; i < len; i++) {
																me.doSelect(selections[i], true, suppressEvent);
															}
															delete me.bulkChange;
															me.maybeFireSelectionChange(me.getSelection().length !== selLen);
														}
														else {
															me.deselectAll( suppressEvent );
														}									
													}
												} //												
											});	
											
											// btn_download = function () {
												// var selection = gridRegion.getView().getSelectionModel().getSelection();//[0];
												// var qc = Ext.getCmp('qcCmbID').getValue()
												// selgrid=new Array()
												// for(var i = 0; i < selection.length; i++) {
													// selgrid.push(Number(selection[i].data.id));
												// }
												// var number_of_selected_records = selection.length;
												// var name = Ext.getCmp('numRecordsSelected').setText( 'Selected: ' +number_of_selected_records);														
												// Ext.DomHelper.append(document.body, {
												  // tag: 'iframe',
												  // id:'downloadIframe',
												  // frameBorder: 0,
												  // width: 0,
												  // height: 0,
												  // css: 'display:none;visibility:hidden;height: 0px;',
												  // src: 'php/dowloaddata.php?typedwn=selection&qc='+qc+'&station='+Ext.encode(selgrid)+'&'+'country=null'+'&'+'state=null'+'&'+'municip=null'+'&'+'variable='+Ext.encode(cmbVar.getValue())+'&typedwn=selection'
												// });
											// }	
											onZoomExtentALL = function () {
												// layerTemp=mapPanel.map.getLayersByName("Search station")[0]
												feature = clusters.features;
												FeatselectID=[]
												for (var i = feature.length - 1; i >= 0; --i) {
													if(feature[i].renderIntent=='select'){
															sel=feature[i]//.cluster[j]
															FeatselectID.push(sel)
													}
												}
												// console.log(feature,FeatselectID)
												// console.log(FeatselectID[0].geometry.getBounds())
												var BoundALL = FeatselectID[0].geometry.getBounds();
												mapPanel.map.zoomToExtent(BoundALL);								
												
											}

											// cmbVar= Ext.create('Ext.form.field.ComboBox', { 
												// fieldLabel: 'Variables:',
												// labelWidth:60,
												// editable: false, 
												// value: 'ALL',
												// multiSelect: true, 
												// displayField: 'acronym',
												// valueField: 'id', 
												// id:'varCmbID',
												// queryMode: 'local',
												// typeAhead: true,	
												// store: varstore,
												// listConfig: {
													// getInnerTpl: function() {
														// return '<div data-qtip="{name}">{acronym}</div>';
													// }
												// }
											
											// });	
											
											gridRegion = Ext.create('Ext.grid.Panel', {
												id: 'gridRegionID',
												border: true,
												// layout: 'fit',
												forceFit: true,
												store: gridStatStore,
												// maxHeight: Ext.getBody().getViewSize().height*0.3,
												width: mainPanelWidth,
												height:mainPanelHeight*0.4,
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
																statName = rec.get('name');
																copyrightN = rec.get('copyright');
																	var periodst = Ext.create('Ext.data.Store', {
																			fields: ['value','name'], 
																			data: [ 
																				{value:1,name: 'Daily'}, 
																				{value:2,name: 'Monthly'}, 
																				{value:3,name: 'Yearly'}
																			]																	
																	})																	
																	// varlist=(cmbVar.getRawValue()).replace(/\s/g, '')
																	varlist="ALL"
																	var arrayvar =new Array() //varlist.split(',');
																	
																	for(var i = 0; i < varstore.getCount(); i++) {
																		var record = varstore.getAt(i);
																		id=record.get('id')
																		acronym=record.get('acronym')
																		arrayvar.push(acronym)
																		// console.log(id,acronym)
																	}
																	// console.log(arrayvar)
																	var datatest = {
																		name: 'xxx',
																		rowTitleArr: arrayvar,
																		colTitleArr: ['a', 'b', 'c']
																	}
																	var tpl = [
																		'<div class="grap" id="grap_temp_'+selectionID+'" style="width:'+grapWidth+'px;"></div>',
																		'<tpl for="rowTitleArr">',
																		'<div class="grap"  id="grap_{.}_'+selectionID+'" style="width:'+grapWidth+'px;"></div>',
																		'</tpl>'
																		];	

																	cmbPeriod='cmbPeriod'+selectionID
																	cmbPeriod=Ext.create('Ext.form.field.ComboBox', { 
																		fieldLabel: 'Select graphic model',
																		id:'cmbPeriodID',
																		labelWidth:125,
																		store: periodst,
																		displayField: 'name',
																		// value: 1,
																		queryMode: 'local',
																		valueField: 'value', 								
																		typeAhead: true,
																		listeners: {
																			select: function() {
																				var actTab = tabs.getActiveTab();
																				var idx = tabs.items.indexOf(actTab);
																				// actTabId=parseInt((actTab.title).match(/\d+/)[0])
																				var idPeriod = Ext.getCmp('cmbPeriodID').getValue()
																				// var field = Ext.getCmp('cmbPeriodID').findField('Daily');
																				var qc = Ext.getCmp('qcCmbGrapID').getValue()
																				if (copyrightN == 'Free') {
																					generateGraps(selectionID,idPeriod,varlist,Ext.getCmp('qcCmbGrapID').getValue(),qc)
																				}else if (copyrightN != 'Free' && idPeriod==1){
																					winInfo=Ext.MessageBox.show({
																					   title: 'Information',
																					   msg: 'Sorry, You are not authorized to download data.',
																					   width:300,
																					   buttons: Ext.MessageBox.OK,
																					   animateTarget: 'error',
																					   icon: 'x-message-box-error'
																					   
																					});	
																					winInfo.setPosition(mainPanelWidth/3,mainPanelHeight/2);
																					Ext.getCmp('cmbPeriodID').setValue(3);
																				}else if (copyrightN != 'Free' && idPeriod==2 ){
																					winInfo=Ext.MessageBox.show({
																					   title: 'Information',
																					   msg: 'Sorry, You are not authorized to download data.',
																					   width:300,
																					   buttons: Ext.MessageBox.OK,
																					   animateTarget: 'error',
																					   icon: 'x-message-box-error'
																					   
																					});	
																					winInfo.setPosition(mainPanelWidth/3,mainPanelHeight/2);
																					Ext.getCmp('cmbPeriodID').setValue(3);
																				}																					
																			}
																		}
																	});	
																	
																	if (copyrightN != 'Free') {
																	Ext.getCmp('cmbPeriodID').setValue(3);
																	}else{Ext.getCmp('cmbPeriodID').setValue(1);}
																	
																	cmbqc='cmbqc'+selectionID
																	cmbqc=Ext.create('Ext.form.field.ComboBox', { 
																		fieldLabel: 'Quality control:',
																		labelWidth:90,
																		editable: false, 
																		value: 'raw',
																		multiSelect: false, 
																		displayField: 'name',
																		valueField: 'name', 
																		id:'qcCmbGrapID',
																		queryMode: 'local',
																		typeAhead: true,
																		store: qcstoreGrap,
																		width: 180,												
																		listConfig: {
																			getInnerTpl: function() {
																				return '<div data-qtip="{description}">{name}</div>';
																			}
																		},														
																		// store: {
																			// fields: ['value','name'], 
																			// data: [ 
																				// {value:1,name: 'Daily'}, 
																				// {value:2,name: 'Monthly'}, 
																				// {value:3,name: 'Yearly'}
																			// ]
																		// },
																		// displayField: 'name',
																		// value: 1,
																		// queryMode: 'local',
																		// valueField: 'value', 								
																		// typeAhead: true,
																		listeners: {
																			select: function() {
																				var actTab = tabs.getActiveTab();
																				var idx = tabs.items.indexOf(actTab);
																				// actTabId=parseInt((actTab.title).match(/\d+/)[0])
																				var idPeriod = Ext.getCmp('cmbPeriodID').getValue()
																				var qc = Ext.getCmp('qcCmbGrapID').getValue()
																				generateGraps(selectionID,idPeriod,varlist,qc)

																			}
																		}
																	});	

																	btonReturn= new Ext.Button({
																		pressedCls : 'my-pressed',
																		overCls : 'my-over',
																		tooltip: "Return to map",
																		text:'Return to map',
																		icon: icons+'map.png', 
																		scale: 'small',
																		handler: function(){
																			tabs.setActiveTab(0);
																		}													
																	});	
																	if(Ext.getCmp('graphic_tab')){
																		tabs.remove(Ext.getCmp('graphic_tab'), true);
																	}												

																	tabs.add({
																		// contentEl: "desc",
																		// xtype: 'panel',
																		title: 'Graph '+statName,//'Graphic_id'+selectionID
																		name: 'graphic_tab',
																		// width:mainPanelWidth-15,
																		// height: mainPanelHeight,
																		autoScroll: true,
																		// height: 100,
																		// autoHeight: true,
																		// layout: 'fit',
																		id: 'graphic_tab',
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
																			items: [cmbPeriod,cmbqc,{xtype: 'tbfill'},btonReturn]
																			}
																		]													
																	});		
																	
																	var t = new Ext.XTemplate(tpl);
																	Ext.getCmp('graphic_tab').update(t.apply(datatest));
																	// Ext.getCmp('graphic'+selectionID).update('This<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long');
																	
																	Ext.getCmp('mapPanelID').setHeight(0)
																	Ext.getCmp('tabsID').setWidth(mainPanelWidth-15);
																	// Ext.getCmp('tabsID').setHeight(mainPanelHeight*0.2);
																	tabs.setActiveTab('graphic_tab');
																	
																	// console.log(selectionID,cmbPeriod.getValue(),Ext.encode(cmbVar.getValue()))
																	generateGraps(selectionID,cmbPeriod.getValue(),"ALL",'raw')
																
															}, // handler
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
													{ text: 'download',minWidth: 80,dataIndex: 'copyright', flex: 3,tdCls: 'x-change-cell'},
													{ text: 'code',minWidth: 70,dataIndex: 'code', flex: 1,tdCls: 'x-change-cell'},
													{ text: 'name',minWidth: 120,dataIndex: 'name', flex: 4,tdCls: 'x-change-cell'},
													{ text: 'institute',minWidth: 70,dataIndex: 'institute', flex: 3,tdCls: 'x-change-cell'},
													{ text: 'model',minWidth: 80,dataIndex: 'model', flex: 2,tdCls: 'x-change-cell'},
													{ text: 'variables',minWidth: 120,dataIndex: 'variables', flex: 4,tdCls: 'x-change-cell'},
													// { text: 'lon',minWidth: 80,dataIndex: 'lon', flex: 3},
													// { text: 'lat',minWidth: 80,dataIndex: 'lat', flex: 3},
													{ text: 'elevation (m)',minWidth: 80,dataIndex: 'elev', flex: 2,tdCls: 'x-change-cell'},
													{ text: 'category',minWidth: 100,dataIndex: 'category', flex: 3,tdCls: 'x-change-cell'},
													{ text: 'instalation',minWidth: 80,dataIndex: 'instalation', flex: 3,tdCls: 'x-change-cell'},
													{ text: 'suspension',minWidth: 80,dataIndex: 'suspension', flex: 3,tdCls: 'x-change-cell'},
													{ text: 'quality ctrl',minWidth: 70,dataIndex: 'ctrl_quali_var', flex: 1,tdCls: 'x-change-cell'},									
													{ text: 'country',minWidth: 80,dataIndex: 'country', flex: 4,tdCls: 'x-change-cell'},
													{ text: 'state',minWidth: 80,dataIndex: 'state', flex: 4,tdCls: 'x-change-cell'},
													{ text: 'city',minWidth: 90,dataIndex: 'city', flex: 4,tdCls: 'x-change-cell'}
													
												],
												columnLines: true,
												stripeRows: true,
												// margin: '0 0 20 0',
												selModel: selModel,
												viewConfig: { 
													stripeRows: false, 
													getRowClass: function(record, index, rowParams, stor) {
													   var c = record.get('copyright');
													   // return id == '1' ? 'general-rule' : ''; // para desaparecer el check
														if (c == 'Restricted' || c == 'Request') {
															return 'price-fall';
														} 
													}	
												},
												listeners: {
													beforeselect: function ( row, model, index ) {
														if ( model.data.copyright == "Restricted" || model.data.copyright == 'Request') {
															return false;
														}
													},
													selectionchange: function(sm, selections){ // hay problema cuando se selecciona el cursor vuelve a la primera fila
														// layerTempSel.removeAllFeatures();
														layerTempSel.destroyFeatures();
														
														// var selection = gridRegion.getView().getSelectionModel();//[0];
														// var number_of_selected_records = selection.getSelection().length;
														// gridRegion.down('#numRecordsSelected').setText('Selected: ' + selections.length);
														// gridRegion.up('#numRecordsSelected').setText('Selected: ' + number_of_selected_records);
														// console.log(Ext.getCmp('numRecordsSelected'))
														// var name = Ext.getCmp('numRecordsSelected').setText( number_of_selected_records);
														
														feature = layerTempStat.features;
														for (var i = feature.length - 1; i >= 0; --i) {
															// for (var j = feature[i].cluster.length - 1; j >= 0; --j) {
																idall=feature[i].attributes.id;
																for (var k = selections.length - 1; k >= 0; --k) {
																	idsel=selections[k].data.id
																	if(idall==idsel){
																		// feature[i].layer.styleMap.styles.default.rules[0].symbolizer.externalGraphic="iconosGIS/bloqE_16px.png" 
																		// layerTempSel.drawFeature(feature[i])
																		 // mapPanel.map.refresh();	
																		var point = new OpenLayers.Feature.Vector(
																			new OpenLayers.Geometry.Point(feature[i].geometry.x, feature[i].geometry.y));	
																		layerTempSel.addFeatures([point]);
																		mapPanel.map.setLayerIndex(layerTempSel, 99);
																	}
																}												
															// }											
														}
													},											
													
													cellclick: function(iView, iCellEl, iColIdx, iStore, iRowEl, iRowIdx, iEvent) {
													},
													select: function(selModel, record, index, options) {
														var selection = gridRegion.getView().getSelectionModel();//[0];
														var number_of_selected_records = selection.getSelection().length;
														var name = Ext.getCmp('numRecordsSelected').setText( 'Selected: ' + number_of_selected_records);
													}
													
												},
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
													},/*cmbVar,qualitycCmb,{
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
													},*/{
													
														itemId: 'idstatistic',
														text:'Statistics',
														tooltip:'Summary Statistic',
														icon   : iconGridStatistics,
														disabled: true,
														handler: statistics 
													},{ xtype: 'tbtext', itemId: 'numRecords' },
													{ xtype: 'tbtext', itemId: 'numRecordsSelected', id:'numRecordsSelected' },
													{xtype: 'tbfill'},
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

											gridStatStore.on('load', function(ds){
												countRow=ds.getTotalCount()
												if(countRow>=1){
													// winRegion.show()
													// Ext.getCmp('gridRegionID').add(gridRegion);
													// Ext.getCmp('gridRegionID').doLayout();
													
													Ext.getCmp('mainTableID').add(gridRegion);
													gridRegion.down('#numRecords').setText('Records: ' + countRow);
													gridRegion.down('#numRecordsSelected').setText('Selected: ' + 0);
													Ext.getCmp('mainTableID').expand()
													
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

				funcPupup();
			}else{
				funcPupup = function(){
								// selectControl.control.deactivate();
								if(Ext.getCmp('gridRegionID')){
									Ext.getCmp('mainTableID').collapse();
									Ext.getCmp('gridRegionID').destroy();	
								}	
								if(Ext.getCmp('gridRegionID_1')){
									Ext.getCmp('mainTableID').collapse();
									Ext.getCmp('gridRegionID_1').destroy();
								}								
								if(Ext.getCmp('popupID')){
									Ext.getCmp('popupID').close()
								}	
								
								// layerTemp=mapPanel.map.getLayersByName("Search_region")[0]
								// if(layerTemp){layerTemp.destroyFeatures();mapPanel.map.removeLayer(layerTemp);}
								layerTempRegion.destroyFeatures();
								
								FindStation=mapPanel.map.getLayersByName("Search station")[0]
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
													url: 'php/Geo_statByregion-test.php',
													extraParams: {type:14,listStatSel:Ext.encode(selectID)},	
													actionMethods: {
														read: 'POST'
													},												
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
													url: 'php/Geo_statByregion-test.php',
													extraParams: {type:28,listStatSel:Ext.encode(selectID)},
													actionMethods: {
														read: 'POST'
													},												
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
												mode: 'SIMPLE',
												listeners: {
													selectionchange: function(sm, selections) {
														gridRegion.down('#removeButton').setDisabled(selections.length === 0);
														gridRegion.down('#idstatistic').setDisabled(selections.length === 0);
														
													}
												},
												select: function(records, keepExisting, suppressEvent) {
													if (Ext.isDefined(records)) {
														this.doSelect(records, keepExisting, suppressEvent);
													}
												},
												selectAll: function( suppressEvent ) {
													var me = this,
														selections = me.store.getRange();
													countFree=[]
													for( var key in selections ) {
														if( selections[key].data.copyright == 'Free'){
															countFree.push(selections[key].data.copyright)
														}
													}
													
													if(countFree.length>150){
														winInfo=Ext.MessageBox.show({
														   title: 'Information',
														   msg: 'Exceeds the maximum number (Max. 150) of downloads',
														   width:300,
														   buttons: Ext.MessageBox.OK,
														   animateTarget: 'info',
														   icon: 'x-message-box-info'
														});	
														winInfo.setPosition(mainPanelWidth/3,mainPanelHeight/2);
													}else{
														var i = 0,
															len = selections.length,
															selLen = me.getSelection().length;
															
														// if( len != selLen ) {
														if( selLen==0 ) {
															me.bulkChange = true;
															for (; i < len; i++) {
																me.doSelect(selections[i], true, suppressEvent);
															}
															delete me.bulkChange;
															me.maybeFireSelectionChange(me.getSelection().length !== selLen);
														}
														else {
															me.deselectAll( suppressEvent );
														}									
													}
												} //												
											});	
											
											// btn_download = function () {
												// var selection = gridRegion.getView().getSelectionModel().getSelection();//[0];
												// var qc = Ext.getCmp('qcCmbID').getValue()
												// selgrid=new Array()
												// for(var i = 0; i < selection.length; i++) {
													// selgrid.push(Number(selection[i].data.id));
												// }
												// Ext.DomHelper.append(document.body, {
												  // tag: 'iframe',
												  // id:'downloadIframe',
												  // frameBorder: 0,
												  // width: 0,
												  // height: 0,
												  // css: 'display:none;visibility:hidden;height: 0px;',
												  // src: 'php/dowloaddata.php?typedwn=selection&qc='+qc+'&station='+Ext.encode(selgrid)+'&'+'country=null'+'&'+'state=null'+'&'+'municip=null'+'&'+'variable='+Ext.encode(cmbVar.getValue())+'&typedwn=selection'
												// });
											// }	
											onZoomExtentALL = function () {
												// layerTemp=mapPanel.map.getLayersByName("Search station")[0]

												FeatselectID=[]
												for (var i = feature.length - 1; i >= 0; --i) {
													if(feature[i].renderIntent=='select'){
															sel=feature[i]//.cluster[j]
															FeatselectID.push(sel)
													}
												}
												// console.log(FeatselectID)
												// console.log(FeatselectID[0].geometry.getBounds())
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
												// maxHeight: Ext.getBody().getViewSize().height*0.3,
												width: mainPanelWidth,
												height:273,
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
															tooltip: 'Graphic',
															handler: function(grid, rowIndex, colIndex) {
																var rec = gridStatStore.getAt(rowIndex);
																selectionID = rec.get('id');
																statName = rec.get('name');
																copyrightN = rec.get('copyright');
																	var periodst = Ext.create('Ext.data.Store', {
																			fields: ['value','name'], 
																			data: [ 
																				{value:1,name: 'Daily'}, 
																				{value:2,name: 'Monthly'}, 
																				{value:3,name: 'Yearly'}
																			]																	
																	})	
																
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
																		id:'cmbPeriodID',
																		labelWidth:150,
																		store: periodst,
																		displayField: 'name',
																		value: 1,
																		queryMode: 'local',
																		valueField: 'value', 								
																		typeAhead: true,
																		listeners: {
																			select: function() {
																				var actTab = tabs.getActiveTab();
																				var idx = tabs.items.indexOf(actTab);
																				// actTabId=parseInt((actTab.title).match(/\d+/)[0])
																				var idPeriod = Ext.getCmp('cmbPeriodID').getValue()
																				var qc = Ext.getCmp('qcCmbGrapID').getValue()
																				if (copyrightN == 'Free') {
																					generateGraps(selectionID,idPeriod,Ext.encode(cmbVar.getValue()),qc)
																				}else if (copyrightN != 'Free' && idPeriod==1){
																					winInfo=Ext.MessageBox.show({
																					   title: 'Information',
																					   msg: 'Sorry, You are not authorized to download data.',
																					   width:300,
																					   buttons: Ext.MessageBox.OK,
																					   animateTarget: 'error',
																					   icon: 'x-message-box-error'
																					   
																					});	
																					winInfo.setPosition(mainPanelWidth/3,mainPanelHeight/2);																			
																					Ext.getCmp('cmbPeriodID').setValue(3);
																				}else if (copyrightN != 'Free' && idPeriod==2 ){
																					winInfo=Ext.MessageBox.show({
																					   title: 'Information',
																					   msg: 'Sorry, You are not authorized to download data.',
																					   width:300,
																					   buttons: Ext.MessageBox.OK,
																					   animateTarget: 'error',
																					   icon: 'x-message-box-error'
																					   
																					});	
																					winInfo.setPosition(mainPanelWidth/3,mainPanelHeight/2);
																					Ext.getCmp('cmbPeriodID').setValue(3);
																				}																				

																			}
																		}
																	});	
																	if (copyrightN != 'Free') {
																	Ext.getCmp('cmbPeriodID').setValue(3);
																	}else{Ext.getCmp('cmbPeriodID').setValue(1);}
																	
																	cmbqc='cmbqc'+selectionID
																	cmbqc=Ext.create('Ext.form.field.ComboBox', { 
																		fieldLabel: 'Quality control:',
																		labelWidth:90,
																		editable: false, 
																		value: 'raw',
																		multiSelect: false, 
																		displayField: 'name',
																		valueField: 'name', 
																		id:'qcCmbGrapID',
																		queryMode: 'local',
																		typeAhead: true,
																		store: qcstoreGrap,
																		width: 180,												
																		listConfig: {
																			getInnerTpl: function() {
																				return '<div data-qtip="{description}">{name}</div>';
																			}
																		},														
																		listeners: {
																			select: function() {
																				var actTab = tabs.getActiveTab();
																				var idx = tabs.items.indexOf(actTab);
																				// actTabId=parseInt((actTab.title).match(/\d+/)[0])
																				var idPeriod = Ext.getCmp('cmbPeriodID').getValue()
																				var qc = Ext.getCmp('qcCmbGrapID').getValue()
																				generateGraps(selectionID,idPeriod,Ext.encode(cmbVar.getValue()),qc)

																			}
																		}
																	});	
																	
																	btonReturn= new Ext.Button({
																		pressedCls : 'my-pressed',
																		overCls : 'my-over',
																		tooltip: "Return to map",
																		text:'Return to map',
																		icon: icons+'map.png', 
																		scale: 'small',
																		handler: function(){
																			tabs.setActiveTab(0);
																		}													
																	});	
																	if(Ext.getCmp('graphic_tab')){
																		tabs.remove(Ext.getCmp('graphic_tab'), true);
																	}												

																	tabs.add({
																		// contentEl: "desc",
																		// xtype: 'panel',
																		title: 'Graph '+statName,//'Graphic_id'+selectionID
																		name: 'graphic_tab',
																		// width:mainPanelWidth-15,
																		// height: mainPanelHeight,
																		autoScroll: true,
																		// height: 100,
																		// autoHeight: true,
																		// layout: 'fit',
																		id: 'graphic_tab',
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
																			items: [cmbPeriod,cmbqc,{xtype: 'tbfill'},btonReturn]
																			}
																		]													
																	});		
																	
																	var t = new Ext.XTemplate(tpl);
																	Ext.getCmp('graphic_tab').update(t.apply(datatest));
																	// Ext.getCmp('graphic'+selectionID).update('This<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long');
																	
																	Ext.getCmp('mapPanelID').setHeight(0)
																	Ext.getCmp('tabsID').setWidth(mainPanelWidth-15);
																	// Ext.getCmp('tabsID').setHeight(mainPanelHeight*0.2);
																	tabs.setActiveTab('graphic_tab');
																	var qc = Ext.getCmp('qcCmbGrapID').getValue()
																	generateGraps(selectionID,cmbPeriod.getValue(),Ext.encode(cmbVar.getValue()),qc)
																
															}, // handler
															
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
													{ text: 'download',minWidth: 50,dataIndex: 'copyright', flex: 3,tdCls: 'x-change-cell'},
													{ text: 'id',minWidth: 50,dataIndex: 'id', flex: 1,tdCls: 'x-change-cell'},
													{ text: 'code',minWidth: 80,dataIndex: 'code', flex: 1,tdCls: 'x-change-cell'},
													{ text: 'name',minWidth: 120,dataIndex: 'name', flex: 4,tdCls: 'x-change-cell'},
													{ text: 'institute',minWidth: 50,dataIndex: 'institute', flex: 3,tdCls: 'x-change-cell'},
													{ text: 'model',minWidth: 80,dataIndex: 'model', flex: 2,tdCls: 'x-change-cell'},
													
													// { text: 'category',minWidth: 100,dataIndex: 'category', flex: 4},

													// { text: 'instalation',minWidth: 80,dataIndex: 'instalation', flex: 3},
													// { text: 'quality',minWidth: 80,dataIndex: 'quality', flex: 1},
													
													{ text: 'variables',minWidth: 100,dataIndex: 'variables', flex: 4,tdCls: 'x-change-cell'},
													
													
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
														'| <b>quality ctrl:</b> {ctrl_quali_var} ',
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
												viewConfig: { 
													stripeRows: false, 
													getRowClass: function(record, index, rowParams, stor) {
													   var c = record.get('copyright');
													   // return id == '1' ? 'general-rule' : ''; // para desaparecer el check
														if (c == 'Restricted' || c == 'Request') {
															return 'price-fall';
														} 
													}	
												},
												listeners: {
													beforeselect: function ( row, model, index ) {
														if ( model.data.copyright == "Restricted" || model.data.copyright == 'Request') {
															return false;
														}
													},
													selectionchange: function(sm, selections){ // hay problema cuando se selecciona el cursor vuelve a la primera fila
														// layerTempSel.removeAllFeatures();
														layerTempSel.destroyFeatures();
														// gridRegion.down('#numRecordsSelected').setText('Selected: ' + selections.length);
														feature = layerTempStat.features;
														for (var i = feature.length - 1; i >= 0; --i) {
															// for (var j = feature[i].cluster.length - 1; j >= 0; --j) {
																idall=feature[i].attributes.id;
																for (var k = selections.length - 1; k >= 0; --k) {
																	idsel=selections[k].data.id
																	if(idall==idsel){
																		// feature[i].layer.styleMap.styles.default.rules[0].symbolizer.externalGraphic="iconosGIS/bloqE_16px.png" 
																		// layerTempSel.drawFeature(feature[i])
																		 // mapPanel.map.refresh();	
																		var point = new OpenLayers.Feature.Vector(
																			new OpenLayers.Geometry.Point(feature[i].geometry.x, feature[i].geometry.y));	
																		layerTempSel.addFeatures([point]);
																		mapPanel.map.setLayerIndex(layerTempSel, 99);
																	}
																}												
															// }											
														}
													},
													select: function(selModel, record, index, options) {
														var selection = gridRegion.getView().getSelectionModel();//[0];
														var number_of_selected_records = selection.getSelection().length;
														var name = Ext.getCmp('numRecordsSelected').setText( 'Selected: ' + number_of_selected_records);
													}													
												},
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
													},/*cmbVar,qualitycCmb,,{
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
													},{ xtype: 'tbtext', itemId: 'numRecords' },
													{ xtype: 'tbtext', itemId: 'numRecordsSelected', id:'numRecordsSelected' },
													{xtype: 'tbfill'},
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
												
												// Ext.getCmp('gridRegionID').maxHeight=mainPanelHeight;
												// Ext.getCmp('mainTableID').setHeight(mainPanelHeight);
												
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
														url: 'php/Geo_statByregion-test.php',
														extraParams: {
															idstat: record.get("id"),type:17
														},
														actionMethods: {
															read: 'POST'
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
													columns: [
														{ text: 'name',dataIndex: 'name'},
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
													gridRegion.down('#numRecordsSelected').setText('Selected: ' + 0);
													Ext.getCmp('mainTableID').expand()
													
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

				funcPupup();
			}				
			

		
		}	

        function onFeatureUnselectClick(feature) {
			// selectClick.control.unselectAll();
			if(Ext.getCmp('gridRegionID')){
				Ext.getCmp('mainTableID').collapse();
				Ext.getCmp('gridRegionID').destroy();	
			}
			if(Ext.getCmp('gridRegionID_1')){
				Ext.getCmp('mainTableID').collapse();
				Ext.getCmp('gridRegionID_1').destroy();
			}			
        } 		

		var selectHover = new OpenLayers.Control.SelectFeature(
			clusters, {
				hover: true,
				onSelect: onFeatureSelect1
			}//, renderIntent: styleHoverNull}
		);

		var selectClick = new OpenLayers.Control.SelectFeature(
			clusters, {
				clickout: true, toggle: false,
				multiple: false, hover: false,
				toggleKey: "ctrlKey", // ctrl key removes from selection
				multipleKey: "shiftKey", // shift key adds to selection
				onSelect: onFeatureSelect1Click,
				onUnselect: onFeatureUnselectClick
			}//, renderIntent: styleHoverNull}
		);	
		
		mapPanel.map.addControl(selectClick);
		selectClick.activate();
		
		mapPanel.map.addControl(selectHover);
		// selectHover.activate();

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
			
			// selectControl.control.unselectAll();
			// selectControl.control.deactivate();
			// selectHover.activate();
			// if(Ext.getCmp('gridRegionID')){
				// Ext.getCmp('mainTableID').collapse();
				// Ext.getCmp('gridRegionID').destroy();	
			// }
			
			// layerTemp=mapPanel.map.getLayersByName("Search_region")[0]
			// if(layerTempRegion){layerTempRegion.removeAllFeatures()}			
			// layerTempStat=mapPanel.map.getLayersByName("Search station")[0]
			// if(layerTempStat){layerTempStat.removeAllFeatures()}			
			layerTempSel.destroyFeatures()
		 }
		}});
		
		mapPanel.map.addControl(oClickClose)
		oClickClose.activate();		
// ############################################## FIN POPUP IDENTIFY ##############################################################################################################		
	
		var ctrl, toolbarItems = [], action, actions = {};	            

		var btonZooExtent = new Ext.Button({
			pressedCls : 'my-pressed',
			overCls : 'my-over',
			tooltip: "Zoom out to all weather station",
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
			tooltip: "Identify stations with hover mouse. Show weather station summary",
			icon: icons+'identify_off.gif', 
			scale: 'medium',
			enableToggle: true,
			allowDepress: true,
			toggleGroup: "draw",
			pressed:false,
			handler: function(toggled){
				if(Ext.getCmp('popupID')){
					Ext.getCmp('popupID').close()
				}		
				getWin = Ext.getCmp('distanceID');
				if (getWin) {
					getWin.close()
					getWin.destroy();
				} 				
				// if(toggled.pressed==true){
					// selectHover.activate();
				// }else{
					// selectHover.deactivate();
					// vectorHover.removeAllFeatures();
				// }
			},
			toggleHandler: function(btn, pressed){
				if(pressed==true){
					selectHover.activate();
					// mapPanel.map.removeControl(selectFeature); // 
					// selectFeature.deactivate()					
				}else{
					layerTempSel.destroyFeatures();
					selectHover.deactivate();
					vectorHover.removeAllFeatures();
					// if(Ext.getCmp('gridRegionID')){
						// Ext.getCmp('mainTableID').collapse();
						// Ext.getCmp('gridRegionID').destroy();	
					// }					
				}			
                // console.log('toggle', btn.text, pressed);
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
			tooltip: "Draw a box to zoom in",
			icon: icons+'zb.png',
			scale: 'medium',
			handler: function(toggled){
				if(Ext.getCmp('popupID')){
					Ext.getCmp('popupID').close()
				}			
				// if(toggled.pressed==true){
					// selectHover.deactivate();
				// }
				// else{
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
		
		var something = (function(event) {
			var executed = false;
			return function (event) {
				if (!executed) {
					executed = true;
					feature2 = clusters.features;
				
					selectID=[]
					mergeFeature=[]
					for (var i = feature2.length - 1; i >= 0; --i) {
						// i=1
						// console.log(feature2[i].renderIntent)
						// console.log(clusters.selectedFeatures.indexOf(feature2[i]))
						// if(clusters.selectedFeatures.indexOf(feature[i])==0){
						if(feature2[i].renderIntent=='select'){
							// console.log(clusters.selectedFeatures.indexOf(feature[i]))
							// console.log(feature[i])
							mergeFeature.push(feature2[i])
							// for (var j = feature[i].cluster.length - 1; j >= 0; --j) {
								// sel=feature[i].cluster[j].attributes.id;
								// selectID.push(sel)
								
							// }
						}
					}					
					
					// console.log(event)
				}
			};
		})();			

		funcDownBySel=function(selectID){
				if(Ext.getCmp('gridRegionID')){
					Ext.getCmp('mainTableID').collapse();
					Ext.getCmp('gridRegionID').destroy();	
				}
				if(Ext.getCmp('gridRegionID_1')){
					Ext.getCmp('mainTableID').collapse();
					Ext.getCmp('gridRegionID_1').destroy();
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
				mergeFeature=[]
				for (var i = feature.length - 1; i >= 0; --i) {
					// i=1
					// console.log(clusters.selectedFeatures.indexOf(feature[i]))
					// if(clusters.selectedFeatures.indexOf(feature[i])==0){
					if(feature[i].renderIntent=='select'){
						// console.log(clusters.selectedFeatures.indexOf(feature[i]))
						mergeFeature.push(feature[i])
						for (var j = feature[i].cluster.length - 1; j >= 0; --j) {
							sel=feature[i].cluster[j].attributes.id;
							selectID.push(sel)
							
						}
					}
				}		
				something(mergeFeature);				

				// console.log(mergeFeature)
				// if(mergeFeature.length==2){
					// console.log(mergeFeature)
				// }
				// else{
					// console.log("hhola")
					// }
				
				myMask.hide();
				// ##############################################################    TABLA GRID ##################################
/*				
							var gridStatStore = Ext.create('Ext.data.Store', {
								model: 'modelGridRegion',
								autoLoad: true,
								autoSync: true,
								sorters: { property: 'name', direction : 'ASC' },
								proxy: {
									type: 'ajax',
									url: 'php/Geo_statByregion-test.php',
									extraParams: {type:14,listStatSel:Ext.encode(selectID)},
									actionMethods: {
										read: 'POST'
									},								
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
									url: 'php/Geo_statByregion-test.php',
									extraParams: {type:15,listStatSel:Ext.encode(selectID)},	
									actionMethods: {
										read: 'POST'
									},									
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
								},
								mode: 'SIMPLE',
								select: function(records, keepExisting, suppressEvent) {
									if (Ext.isDefined(records)) {
										this.doSelect(records, keepExisting, suppressEvent);
									}
								},
								selectAll: function( suppressEvent ) {
									var me = this,
										selections = me.store.getRange();

									for( var key in selections ) {
										if( selections[key].data.copyright == 'Restricted' ||  selections[key].data.copyright == 'Request' ) {
											selections.splice( key, 1 );
											break;
										}
									}

									var i = 0,
										len = selections.length,
										selLen = me.getSelection().length;

									if( len != selLen ) {
										me.bulkChange = true;
										for (; i < len; i++) {
											me.doSelect(selections[i], true, suppressEvent);
										}
										delete me.bulkChange;

										me.maybeFireSelectionChange(me.getSelection().length !== selLen);
									}
									else {
										me.deselectAll( suppressEvent );
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
								// layerTemp=mapPanel.map.getLayersByName("Search station")[0]

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
												statName = rec.get('name');
												
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
													id:'cmbPeriodID',
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
															// actTabId=parseInt((actTab.title).match(/\d+/)[0])
															var idPeriod = Ext.getCmp('cmbPeriodID').getValue()
															generateGraps(selectionID,idPeriod,Ext.encode(cmbVar.getValue()))

														}
													}
												});		

												btonReturn= new Ext.Button({
													pressedCls : 'my-pressed',
													overCls : 'my-over',
													tooltip: "Return to map",
													text:'Return to map',
													icon: icons+'map.png', 
													scale: 'small',
													handler: function(){
														tabs.setActiveTab(0);
													}													
												});	
												if(Ext.getCmp('graphic_tab')){
													tabs.remove(Ext.getCmp('graphic_tab'), true);
												}												

												tabs.add({
													title: 'Graph '+statName,//'Graphic_id'+selectionID
													name: 'graphic_tab',
													autoScroll: true,
													id: 'graphic_tab',
													closable: true,
													dockedItems: [
														{
														xtype: 'toolbar',
														items: [cmbPeriod,{xtype: 'tbfill'},btonReturn]
														}
													]													
												});		
												
												var t = new Ext.XTemplate(tpl);
												Ext.getCmp('graphic_tab').update(t.apply(datatest));
												Ext.getCmp('mapPanelID').setHeight(0)
												Ext.getCmp('tabsID').setWidth(mainPanelWidth-15);
												tabs.setActiveTab('graphic_tab');												
												
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
									{ text: 'id',minWidth: 50,dataIndex: 'id', flex: 1,tdCls: 'x-change-cell'},
									{ text: 'code',minWidth: 80,dataIndex: 'code', flex: 1,tdCls: 'x-change-cell'},
									{ text: 'name',minWidth: 120,dataIndex: 'name', flex: 4,tdCls: 'x-change-cell'},
									{ text: 'institute',minWidth: 50,dataIndex: 'institute', flex: 3,tdCls: 'x-change-cell'},
									{ text: 'model',minWidth: 80,dataIndex: 'model', flex: 2,tdCls: 'x-change-cell'},
									
									// { text: 'category',minWidth: 100,dataIndex: 'category', flex: 4},

									// { text: 'instalation',minWidth: 80,dataIndex: 'instalation', flex: 3},
									// { text: 'quality',minWidth: 80,dataIndex: 'quality', flex: 1},
									
									{ text: 'variables',minWidth: 100,dataIndex: 'variables', flex: 4,tdCls: 'x-change-cell'},
									{ text: 'status',minWidth: 50,dataIndex: 'copyright', flex: 3,tdCls: 'x-change-cell'},
									
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
								viewConfig: { 
									stripeRows: false, 
									getRowClass: function(record, index, rowParams, stor) {
									   var c = record.get('copyright');
									   // return id == '1' ? 'general-rule' : ''; // para desaparecer el check
										if (c == 'Restricted' || c == 'Request') {
											return 'price-fall';
										} 
									}	
								},
								listeners: {
									beforeselect: function ( row, model, index ) {
										if ( model.data.copyright == "Restricted" || model.data.copyright == 'Request') {
											return false;
										}
									}								
								},
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
										// itemId: 'zoomExtentALL',
										// text:'zoomExtentALL',
										// tooltip:'zoomExtent to ALL',
										// icon   : iconGridzoomExtentALL,//iconCls:'add',
										// handler: onZoomExtentALL 
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
										url: 'php/Geo_statByregion-test.php',
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
									
									// Ext.DomHelper.append(document.body, { // para descargar automaticamente
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
			
			
		*/

			// selectControl.control.deactivate();		
		} // fin funcDownBySel
				
	
			
		var bton_down = new Ext.Button({
			pressedCls : 'my-pressed',
			overCls : 'my-over',
			tooltip: "Download stations selected",
			icon: icons+'download.png',
			scale: 'medium',
			enableToggle: false,
			handler: funcDownBySel 			
		});
		
        function onPopupClose(evt) {
            selectControl.control.unselect(selectedFeature);
        }

        function onFeatureSelect(feature) {
/*			var myFeatyures = event.cluster;
			var f = event.feature;
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

			selectID= new Array()
			// for (var i = feature.length - 1; i >= 0; --i) {
				for (var i = myFeatyures.length - 1; i >= 0; --i) {
					selectID.push(myFeatyures[i].data.id)
					// console.log(myFeatyures[i].data.id)
					// selectID[selectID.length] = myFeatyures[i].data.id
					// selectID.concat(myFeatyures[i].data.id);
				}				
			// }	
*/
			wkt = new OpenLayers.Format.WKT({
				  'internalProjection': new OpenLayers.Projection("EPSG:900913"),
				  'externalProjection': new OpenLayers.Projection("EPSG:4326")
				})
				// var features = e.object.features;	
				var str = wkt.write(feature);	

	// var str = wkt.write(feature);
			// console.log(str)
	
			// funcDownBySel(event);
			
        }
        function onFeatureUnselect(feature) {
			selectControl.control.unselectAll();
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
		

		mapPanel.map.addLayer(polygonDraw);
		
		var customHandler = OpenLayers.Class(OpenLayers.Handler.Polygon, {
			addPoint: function(pixel) {
				// var popup;
				var pops = mapPanel.map.popups;
				var coor = mapPanel.map.getLonLatFromPixel(pixel);
				
				if (!this.drawingHole && this.holeModifier && this.evt && this.evt[this.holeModifier]) {
					var geometry = this.point.geometry;
					var features = this.control.layer.features;
					var candidate,
					polygon;
					for (var i = features.length - 1; i >= 0; --i) {
						candidate = features[i].geometry;
						if ((candidate instanceof OpenLayers.Geometry.Polygon || candidate instanceof OpenLayers.Geometry.MultiPolygon) && candidate.intersects(geometry)) {
							polygon = features[i];
							this.control.layer.removeFeatures([polygon], {
								silent: true
							});
							this.control.layer.events.registerPriority("sketchcomplete", this, this.finalizeInteriorRing);
							this.control.layer.events.registerPriority("sketchmodified", this, this.enforceTopology);
							polygon.geometry.addComponent(this.line.geometry);
							this.polygon = polygon;
							this.drawingHole = true;
							break;
						}
					}
				}
				OpenLayers.Handler.Path.prototype.addPoint.apply(this, arguments);

				if(pops==""){
					popup = new OpenLayers.Popup.FramedCloud(
											// "featurePopup",
											"popup",
											coor,//feature.geometry.getBounds().getCenterLonLat(),
											null,//new OpenLayers.Size(5,5),
											// '<div style="color:black;font-family: Trebuchet MS;font-size: 10px;">Double-click to finish</br>' + '</div>',
											'Double-click to finish',
											new OpenLayers.Icon(
											'',
												new OpenLayers.Size(0,0),
												new OpenLayers.Pixel(0, 0)
											),
											true,
											null
										);
					popup.minSize = new OpenLayers.Size(30, 30);
					popup.maxSize = new OpenLayers.Size(145, 55);
					popup.autoSize = true;
					popup.offset = 5;											 
								
					popup.calculateNewPx = function(px){
						if(popup.size !== null){
							px = px.add(popup.size.w / 2 * -1 + popup.offset, popup.size.h * -1 + popup.offset);
							return px;
						}
					};								
					mapPanel.map.addPopup(popup, true);		
				}

			}
		});
		/*########################################################################  CHIRPS DAILY V2 #########################################################################*/
		var winChirps
		// mapPanel.map.addLayer(poinDraw);
		// var customHandlerPoint = OpenLayers.Class(OpenLayers.Handler.Point, {
			// addPoint: function(pixel) {}
		// });	  
		// drawControls = new OpenLayers.Control.DrawFeature(poinDraw,customHandlerPoint)
		// mapPanel.map.addControl(drawControls);		

		
		var btonChirps = new Ext.Button({
			id:"btonChirpsID",
			pressedCls : 'my-pressed',
			overCls : 'my-over',
			// toggleGroup: "draw",
			// group: "draw",				
			tooltip: "Get data from CHIRPS",
			icon: icons+'rsz_weather_showers.png', 
			scale: 'medium',
			enableToggle: true,
			toggleHandler: function(btn, pressed){
				if(pressed==false){
					 if(Ext.getCmp('winChirpsID')){
						 Ext.getCmp('winChirpsID').close();		
						Ext.getCmp('winChirpsID').destroy();
						poinDraw.destroyFeatures();	
						drawControls.deactivate();						
					 }
				}else{
				}
			},		
			handler: function(){
			/*
				updateCoordsDeg=function (){
					FieldLon=Ext.getCmp("lon_deg")
					FieldLat=Ext.getCmp("lat_deg")
					lonIn=FieldLon.getValue()
					latIn=FieldLat.getValue()	
					if(Ext.getCmp('lon_deg').getValue()!=null & Ext.getCmp('lon_deg').getValue()!=0 & Ext.getCmp('lat_deg').getValue()!=null & Ext.getCmp('lat_deg').getValue()!=0 & FieldLon.isValid() & FieldLat.isValid()){
						var lonlatIn = new OpenLayers.LonLat(lonIn, latIn).transform(new OpenLayers.Projection("EPSG:4326"),new OpenLayers.Projection("EPSG:900913"))
						if(Ext.getCmp("btnCoordMap").pressed==true){
							pointMap=poinDraw.features[0].geometry
							var lonlatMap = new OpenLayers.LonLat(pointMap.x, pointMap.y).transform(new OpenLayers.Projection("EPSG:900913"),new OpenLayers.Projection("EPSG:4326"))
							cond=Math.abs(lonIn-lonlatMap.lon)>0.000000000001 & Math.abs(latIn-lonlatMap.lat)>0.000000000001
						}else{cond=Math.abs(lonIn-lonIn)==0}
						if(cond){
							var point = new OpenLayers.Geometry.Point(lonlatIn.lon, lonlatIn.lat);
							var pointFeature2 = new OpenLayers.Feature.Vector(point)
							poinDraw.addFeatures([pointFeature2]);
							mapPanel.map.setCenter(new OpenLayers.LonLat(lonlatIn.lon, lonlatIn.lat), 10);	
						}
					}				
				}
				updateCoordsDMS=function (){
					FieldLon1=Ext.getCmp("lon_1")
					FieldLon2=Ext.getCmp("lon_2")
					FieldLon3=Ext.getCmp("lon_3")
					FieldLat1=Ext.getCmp("lat_1")
					FieldLat2=Ext.getCmp("lat_2")
					FieldLat3=Ext.getCmp("lat_3")

					lonIn1=FieldLon1.getValue()
					lonIn2=FieldLon2.getValue()
					lonIn3=FieldLon3.getValue()
					latIn1=FieldLat1.getValue()	
					latIn2=FieldLat2.getValue()	
					latIn3=FieldLat3.getValue()	
					if(FieldLon1.isValid() & FieldLon2.isValid() & FieldLon3.isValid() & FieldLat1.isValid() & FieldLat2.isValid() & FieldLat3.isValid()){
						lonIn=ConvertDMSToDD(parseInt(lonIn1),parseInt(lonIn2),parseInt(lonIn3))				
						latIn=ConvertDMSToDD(parseInt(latIn1),parseInt(latIn2),parseInt(latIn3))				
						var lonlatIn = new OpenLayers.LonLat(lonIn, latIn).transform(new OpenLayers.Projection("EPSG:4326"),new OpenLayers.Projection("EPSG:900913"))
						if(Ext.getCmp("btnCoordMap").pressed==true){
							pointMap=poinDraw.features[0].geometry
							var lonlatMap = new OpenLayers.LonLat(pointMap.x, pointMap.y).transform(new OpenLayers.Projection("EPSG:900913"),new OpenLayers.Projection("EPSG:4326"))
							cond=Math.abs(lonIn-lonIn)>1
						}else{cond=Math.abs(lonIn-lonIn)==0}
						if(cond){
							var point = new OpenLayers.Geometry.Point(lonlatIn.lon, lonlatIn.lat);
							var pointFeature2 = new OpenLayers.Feature.Vector(point)
							poinDraw.addFeatures([pointFeature2]);
							mapPanel.map.setCenter(new OpenLayers.LonLat(lonlatIn.lon, lonlatIn.lat), 10);	
						}
					}				
				}			

			   var form = Ext.create('Ext.form.Panel', {
					id:"formChirps",
					autoHeight: true,
					//width   : 365,
					bodyPadding: 10,
					defaults: {
						anchor: '100%',
						labelWidth: 100
					},
					items   : [
						{
							xtype: 'fieldset',
							title: 'Options',
							collapsible: false,
							defaults: {
								//labelWidth: 89,
								//anchor: '100%',
								layout: {
									//type: 'hbox',
									//defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
								}
							},
							items: [
								{
									xtype      : 'radiogroup',
									fieldLabel : 'Coord. format',
									labelWidth:85,
									defaults: {
										//flex: 1
									},
									//layout: 'hbox',
									items: [
										{
											boxLabel  : 'DMS',
											name      : 'coord',
											width: 60,
											inputValue: 'dms',
											id        : 'radio2',
											checked   : true,
											margin: '0 0 0 0'
										},            
										{
											boxLabel  : 'Decimal degrees',
											name      : 'coord',                   
											inputValue: 'deg',                  
											id        : 'radio1',
											margin: '0 0 0 -30'
										}
									],
									listeners: {
										change: {
											fn: function(field, newValue, oldValue, options) {
												if(newValue.coord=='dms'){
													Ext.getCmp('lon_deg').hide();Ext.getCmp('lon_deg').disable()
													Ext.getCmp('contCoordsLon').show();Ext.getCmp('contCoordsLon').enable();
													Ext.getCmp('lat_deg').hide();Ext.getCmp('lat_deg').disable()
													Ext.getCmp('contCoordsLat').show();Ext.getCmp('contCoordsLat').enable();						
												}else{
													Ext.getCmp('lon_deg').show();Ext.getCmp('lon_deg').enable();
													Ext.getCmp('contCoordsLon').hide();Ext.getCmp('contCoordsLon').disable();
													Ext.getCmp('lon_deg').reset();
													var fieldContainer = form.down('#invoiceCt');
													fieldContainer.items.each(function(f) {
														if (Ext.isFunction(f.reset)) {
															f.reset();
														}
													});   
													Ext.getCmp('lat_deg').show();Ext.getCmp('lat_deg').enable()
													Ext.getCmp('contCoordsLat').hide();Ext.getCmp('contCoordsLat').disable();
													Ext.getCmp('lat_deg').reset();
													var fieldContainer = form.down('#contCoordsLat');
													fieldContainer.items.each(function(f) {
														if (Ext.isFunction(f.reset)) {
															f.reset();
														}
													}); 							
												}

											}
										}
									}            
								},                   
								{
									xtype: 'fieldcontainer',
									fieldLabel: 'Longitude',
									//combineErrors: true,
									msgTarget: 'under',
									labelWidth:85,
									layout: 'hbox',
									defaults: {
										hideLabel: true
									},
									items: [
										{
											xtype: 'fieldcontainer',
											id:"contCoordsLon",
											itemId: 'invoiceCt',
											msgTarget: 'under', 
											layout: 'hbox',
											defaults: {
												hideLabel: true
											},
											items: [
												{xtype: 'numberfield',  id:"lon_1",hideTrigger: true,fieldLabel: 'Lon 1', name: 'lon_1', width: 40, allowBlank: false, margins: '0 5 0 0',maxValue: 180,minValue: -180,
													listeners: {
														'change': updateCoordsDMS
													}												
												},                        
												{xtype: 'displayfield', id:"lon_1_1",value: '&deg;'}, 
												{xtype: 'numberfield',  id:"lon_2",    hideTrigger: true, fieldLabel: 'Lon 2', name: 'lon_2', width: 35, allowBlank: false, margins: '0 5 0 0',maxValue: 60,minValue: 0,
													listeners: {
														'change': updateCoordsDMS
													}												
												},
												{xtype: 'displayfield',id:"lon_2_1", value: '&prime;'},
												{xtype: 'numberfield',id:"lon_3", hideTrigger: true, fieldLabel: 'Lon 3', name: 'lon_3', width: 45, allowBlank: false,maxValue: 60,minValue: 0,decimalPrecision:2,
													listeners: {
														'change': updateCoordsDMS
													}												
												},
												{xtype: 'displayfield', id:"lon_3_1",value: '&Prime;'}
											]
										},// container contCoordsLon
										{xtype: 'numberfield', id:"lon_deg",emptyText: 'Decimal Degrees',hidden: true,disabled:true,hideTrigger: true,fieldLabel: 'Lon_deg 1', name: 'lon_deg-1', width: 120, allowBlank: false, margins: '0 5 0 0',maxValue: 180,minValue: -180,decimalPrecision:12,
											listeners: {
												'change': updateCoordsDeg
											}										
										},
									]
								},
								{
									xtype: 'fieldcontainer',
									fieldLabel: 'Latitude',
									//combineErrors: true,
									labelWidth:85,
									msgTarget: 'under',
									defaults: {
										hideLabel: true
									},
									items: [
										{
											xtype: 'fieldcontainer',
											id:"contCoordsLat",
											itemId: 'contCoordsLat',
											//combineErrors: true,
											msgTarget: 'under', 
											layout: 'hbox',
											defaults: {
												hideLabel: true
											},
											items: [
												{xtype: 'numberfield',  id:"lat_1",hideTrigger: true,fieldLabel: 'Lat 1', name: 'lat_1', width: 40, allowBlank: false, margins: '0 5 0 0',maxValue: 180,minValue: -180,
													listeners: {
														'change': updateCoordsDMS
													}												
												},
												{xtype: 'displayfield', id:"lat_1_1",value: '&deg;'}, 
												{xtype: 'numberfield',  id:"lat_2",    hideTrigger: true, fieldLabel: 'Lat 2', name: 'lat_2', width: 35, allowBlank: false, margins: '0 5 0 0',maxValue: 60,minValue: 0,
													listeners: {
														'change': updateCoordsDMS
													}												
												},
												{xtype: 'displayfield',id:"lat_2_1", value: '&prime;'},
												{xtype: 'numberfield',id:"lat_3", hideTrigger: true, fieldLabel: 'Lat 3', name: 'lat_3', width: 45, allowBlank: false,maxValue: 60,minValue: 0,decimalPrecision:2,
													listeners: {
														'change': updateCoordsDMS
													}												
												},
												{xtype: 'displayfield', id:"lat_3_1",value: '&Prime;'}

											]
										},// container corrds
										{xtype: 'numberfield',  id:"lat_deg",hidden: true,disabled:true,emptyText: 'Decimal Degrees',hideTrigger: true,fieldLabel: 'Lat_deg 1', name: 'lat_deg-1', width: 120, allowBlank: false, margins: '0 5 0 0',maxValue: 180,minValue: -180,decimalPrecision:12,
											listeners: {
												'change': updateCoordsDeg
											}										
										},
									]
								},
								{
									xtype: 'container',
									combineErrors: true,
									msgTarget: 'side',
									fieldLabel: 'Year Range',
									anchor: '100%',
									layout: 'hbox',
									margin: '5 0 0 0',
									// defaultMargins: {top: 0, right: 5, bottom: 0, lef:
									defaults: {
										hideLabel: true
									},
									items : [
										
										{xtype: 'displayfield', value: 'Year Range',margin: '15 0 0 0',},
										{
											xtype: 'panel',
											id:"panelSlider",
											width: 210,
											height:60,
											margin: '0 0 0 22',
											html: ['<input type="text" id="periodh" name="periodh" value="" />']								   
										}
									]
								},
								{
									xtype: 'container',
									combineErrors: true,
									msgTarget: 'side',
									fieldLabel: 'Month Range',
									anchor: '100%',
									layout: 'hbox',
									margin: '-12 0 -10 0',
									// defaultMargins: {top: 0, right: 5, bottom: 0, lef:
									defaults: {
										hideLabel: true
									},
									items : [
										
										{xtype: 'displayfield', value: 'Month Range',margin: '15 0 0 0',},
										{
											xtype: 'panel',
											width: 210,
											height:60,
											margin: '0 0 0 12',
											html: ['<input type="text" id="Smonth" name="Smonth" value="" />']								   
										}
									]
								}
							]
						}
					],
					buttons: [
						{
							text   : 'Get coords from map',
							id:"btnCoordMap",
							pressedCls : 'my-pressed',
							enableToggle: true,
							handler: function() {
								// values=this.up('form').getForm().getValues()
							  // if(values.coord=="dms"){
								  // console.log(ConvertDMSToDD(parseInt(values.lat_1),parseInt(values.lat_2),parseInt(values.lat_3)))
							  // }else{
								  // console.log(ConvertDDToDMS(parseInt(values.lat_deg)))
							  // }
							},
							toggleHandler: function(btn, pressed){
								if(pressed==false){
									 drawControls.deactivate();
									 
								}else{
									drawControls.activate();
								}
							}				
						},
						{
							text   : 'Run',
							handler: function() {
								var form   = this.up('form').getForm();
								// values=Ext.getCmp("formChirps").getForm().getValues()
								if (form.isValid()) {
									valueSlider= $("#periodh").prop("value").split(";");
									monSlider= $("#Smonth").prop("value").split(";");
									
									pointMap=poinDraw.features[0].geometry
									var lonlatMap = new OpenLayers.LonLat(pointMap.x, pointMap.y).transform(new OpenLayers.Projection("EPSG:900913"),new OpenLayers.Projection("EPSG:4326"))
									yi=parseInt(valueSlider[0])
									yf=parseInt(valueSlider[1])
									mi=parseInt(monSlider[0])
									mf=parseInt(monSlider[1])										
									selectionID = 1;
									statName = "chirps";
									copyrightN = 1;
										var arrayvar =new Array("prec") //varlist.split(',');
									
										var datatest = {
											name: 'xxx',
											rowTitleArr: arrayvar,
											colTitleArr: ['a', 'b', 'c']
										}
										var tpl = [
											// '<div id="grap_temp_'+selectionID+'" style="width:'+grapWidth+'px;"></div>',
											
											'<tpl for="rowTitleArr">',
											'<div id="grap_{.}_'+selectionID+'" style="width:'+grapWidth+'px;"></div>',
											'</tpl>',
											// '<div id="grap_prec_'+selectionID+'" style="width:'+grapWidth+'px;"></div>',
											'<div id="grap_prec_mon_'+selectionID+'" style="width:'+grapWidth+'px;"></div>',
											'<div id="grap_prec_clim_'+selectionID+'" style="width:'+grapWidth+'px;"></div>',
											
											'<div id="index_boxplot" style="width:'+grapWidth+'px;"></div>',
											'<div id="index_wetdays" style="width:'+grapWidth+'px;"></div>',
											'<div id="index_conswetdays" style="width:'+grapWidth+'px;"></div>',
											'<div id="stats_chirps" style="width:'+grapWidth+'px;"></div>',
											
											];	
										var qcstoreGrap = Ext.create('Ext.data.Store', {
											model: 'modelQC',
											autoLoad: true,
											autoSync: true,
											sorters: { property: 'name', direction : 'ASC' },

											proxy: {
												type: 'ajax',
												url: 'php/Geo_statByregion-test.php',
												extraParams: {type:29,listStatSel:Ext.encode(selectionID),spec:"espc"},
												actionMethods: {
													read: 'POST'//'POST'
												},												
												reader: {
													type: 'json',
													root: 'topics'
												}
											},
											listeners: {
												 load: function(store, records) {
													  store.insert(0, [{
														  id: 0,
														  name: 'raw',
														  description: 'Original data'
														  
													  }]);														  
												 }
											  }								
										});
										btonReturn= new Ext.Button({
											pressedCls : 'my-pressed',
											overCls : 'my-over',
											tooltip: "Return to map",
											text:'Return to map',
											icon: icons+'map.png', 
											scale: 'small',
											handler: function(){
												tabs.setActiveTab(0);
											}													
										});	
										btonDowndChirps= new Ext.Button({
											pressedCls : 'my-pressed',
											overCls : 'my-over',
											tooltip: "Download data",
											text:'Download data',
											icon: icons+'download-icon.png', 
											scale: 'small',
											handler: function(){
												tabs.setActiveTab(0);
											}													
										});					
										if(Ext.getCmp('graphic_tab')){
											tabs.remove(Ext.getCmp('graphic_tab'), true);
										}												

										tabs.add({
											// contentEl: "desc",
											// xtype: 'panel',
											title: 'Graph '+statName,//'Graphic_id'+selectionID
											name: 'graphic_tab',
											// width:mainPanelWidth-15,
											// height: mainPanelHeight,
											autoScroll: true,
											// height: 100,
											// autoHeight: true,
											// layout: 'fit',
											id: 'graphic_tab',
											// html:'<div id="grap_prec_clim_'+selectionID+'" style="width:'+grapWidth+'px;"></div>',
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
												items: [{xtype: 'tbtext',text: 'Long: '+lonlatMap.lon+' Lat: '+lonlatMap.lat},{xtype: 'tbfill'},btonDowndChirps,'-',btonReturn]
												}
											]													
										});		
										
										var t = new Ext.XTemplate(tpl);
										Ext.getCmp('graphic_tab').update(t.apply(datatest));
										Ext.getCmp('mapPanelID').setHeight(0)
										Ext.getCmp('tabsID').setWidth(mainPanelWidth-15);
										tabs.setActiveTab('graphic_tab');
										var idPeriod = 1
										generateGrapsChirps(lonlatMap.lon, lonlatMap.lat,yi,yf,mi,mf,idPeriod)
										
									// if (copyrightN == 'Free') {

									// }else{
										// winInfo=Ext.MessageBox.show({
										   // title: 'Information',
										   // msg: 'Sorry, You are not authorized to download data.',
										   // width:300,
										   // buttons: Ext.MessageBox.OK,
										   // animateTarget: 'error',
										   // icon: 'x-message-box-error'
										   
										// });	
										// winInfo.setPosition(mainPanelWidth/3,mainPanelHeight/2);																			
									// }
								
								
								
								}
							}
						},
			 
						{
							text   : 'Reset',
							handler: function() {
								this.up('form').getForm().reset();
							}
						}
					]
				});
					  
					  
					  
				// var winChirps = Ext.create('Ext.window.Window', {
				var winChirps = new Ext.window.Window({
				// var winChirps = new Ext.Window({
					id: "winChirpsID",	
					title: 'CHIRPS DATA',
					// closeAction: 'close',
					height: 300,//250,
					width: 360,
					collapsible: true,
					resizable: false,
					layout:'fit',
					//layout: 'fit',
					items: [form],
					listeners:{
						 'close':function(){
								Ext.getCmp("btonChirpsID").toggle(false);
								poinDraw.destroyFeatures();
								drawControls.deactivate();
						  }
						}		
				}).show();

				$("#periodh").ionRangeSlider({
					type: "double",
					min: 1981,
					max: 2016,
					from: 1990,
					to: 2000,
					to_max:2016,
					max_interval:10,
					// to_percent: 77.5,
					drag_interval: true
				});				
				$("#Smonth").ionRangeSlider({
					type: "double",
					min: 1,
					max: 12,
					from: 1,
					to: 12,
					to_max:12,
					// max_interval:8,
					// to_percent: 77.5,
					drag_interval: true
				});		
			*/				
				// $("#period").append( "<p>Test</p>" );
				
				// if(Ext.getCmp("btonChirpsID").pressed==false){
					// Ext.getCmp("winChirpsID").close();	
					// Ext.getCmp("winChirpsID").destroy();	
				// }
	
			}			
		});
	
		// mapPanel.map.addLayer(poinDraw);
		
				// var customHandlerPoint = OpenLayers.Class(OpenLayers.Handler.Point, {
			// addPoint: function(pixel) {}
		// });
		// var drawPoint = Ext.create('GeoExt.Action', {
			// pressedCls : 'my-pressed',
			// overCls : 'my-over',
			// toggleGroup: "draw",
			// group: "draw",
			// icon: icons+'rsz_weather_showers.png',
			// scale: 'medium',		
			// control: new OpenLayers.Control.DrawFeature(poinDraw, customHandlerPoint ),
			// map: mapPanel.map,
			// enableToggle: true,
			// allowDepress: true,
			// tooltip: "Get data from CHIRPS",			
			// toggleHandler: function(btn, pressed){
				// if(pressed==false){}
			// }
		// });
		/*
		poinDraw.events.register('featureadded',poinDraw, onAddedPoint);
		function onAddedPoint(ev){
			var point=ev.feature.geometry;
			// console.log(poinDraw.features[0])
			// poinDraw.removeFeatures(featureObject);
			if(poinDraw.features.length>1){
				// poinDraw.destroyFeatures();
				poinDraw.removeFeatures(poinDraw.features[0]);
			}
			var lonlat = new OpenLayers.LonLat(point.x, point.y).transform(new OpenLayers.Projection("EPSG:900913"),new OpenLayers.Projection("EPSG:4326"))
			values=Ext.getCmp("formChirps").getForm().getValues()
		  if(values.coord=="dms"){
			 Ext.getCmp('lon_1').setValue(ConvertDDToDMS(lonlat.lon)[0]);Ext.getCmp('lon_2').setValue(ConvertDDToDMS(lonlat.lon)[1]);Ext.getCmp('lon_3').setValue(ConvertDDToDMS(lonlat.lon)[2]);
			 Ext.getCmp('lat_1').setValue(ConvertDDToDMS(lonlat.lat)[0]);Ext.getCmp('lat_2').setValue(ConvertDDToDMS(lonlat.lat)[1]);Ext.getCmp('lat_3').setValue(ConvertDDToDMS(lonlat.lat)[2]);
		  }else{
			 Ext.getCmp('lon_deg').setValue(lonlat.lon);Ext.getCmp('lat_deg').setValue(lonlat.lat);
		  }
		}
		*/
		/*###############################################################################  FIN CHIRPS DAILY V2 #########################################################################*/
		
		var drawPolygon = Ext.create('GeoExt.Action', {
			pressedCls : 'my-pressed',
			overCls : 'my-over',
			toggleGroup: "draw",
			group: "draw",
			icon: icons+'shape_poly.png',
			scale: 'medium',		
			// control: new OpenLayers.Control.DrawFeature(polygonDraw, OpenLayers.Handler.Polygon),
			control: new OpenLayers.Control.DrawFeature(polygonDraw, customHandler ),
			map: mapPanel.map,
			enableToggle: true,
			allowDepress: true,
			tooltip: "Draw a polygon to download weather station data",			
			toggleHandler: function(btn, pressed){
				if(pressed==false){
					// selectControl.control.unselectAll();
					layerTempSel.destroyFeatures();
					var pops = mapPanel.map.popups;
					if(pops[0]){
						pops[0].destroy()
					}					
					
					polygonDraw.destroyFeatures()
					if(Ext.getCmp('gridRegionID')){
						Ext.getCmp('mainTableID').collapse();
						Ext.getCmp('gridRegionID').destroy();	
					}	
					if(Ext.getCmp('gridRegionID_1')){
						Ext.getCmp('mainTableID').collapse();
						Ext.getCmp('gridRegionID_1').destroy();
					}					
					// layerTempReg=mapPanel.map.getLayersByName("FindRegion")[0]
					// if(layerTempReg){mapPanel.map.removeLayer(layerTempReg);}
					layerTempRegion.destroyFeatures();
					
					layerTempStat=mapPanel.map.getLayersByName("Search station")[0]
					if(layerTempStat){layerTempStat.destroyFeatures();}						
				}else{
					if(Ext.getCmp('popupID')){
						Ext.getCmp('popupID').close()
					}				
				}		
            }			
		});
		polygonDraw.events.register('featureadded',polygonDraw, onAdded);
		// polygonDraw.events.register('sketchstarted',polygonDraw, onStart);
		function onStart(ev){
		}
		function onAdded(ev){
			layerTempRegion.destroyFeatures();
			if(Ext.getCmp('gridRegionID')){
				Ext.getCmp('mainTableID').collapse();
				Ext.getCmp('gridRegionID').destroy();	
			}
			if(Ext.getCmp('gridRegionID_1')){
				Ext.getCmp('mainTableID').collapse();
				Ext.getCmp('gridRegionID_1').destroy();
			}			
			if(Ext.getCmp('popupID')){
				Ext.getCmp('popupID').close()
			}			
			var pops = mapPanel.map.popups;
			if(pops){
				pops[0].destroy()
			}		
			var polygon=ev.feature.geometry;
			var bounds=polygon.getBounds();
			if(polygonDraw.features.length>1){
				polygonDraw.removeFeatures(polygonDraw.features[0])
			}
			wkt = new OpenLayers.Format.WKT({
				  'internalProjection': new OpenLayers.Projection("EPSG:900913"),
				  'externalProjection': new OpenLayers.Projection("EPSG:4326")
			})
				// var features = e.object.features;	
			var str = wkt.write(ev.feature);	

			var myMask = new Ext.LoadMask(Ext.getCmp('mapPanelID'), {msg:"Please wait..."});
			var myAjax = new Ext.data.Connection({
				// handler: function(){if(layerTemp){layerTemp.destroyFeatures();mapPanel.map.removeLayer(layerTemp);}},
				listeners : {        
					beforerequest : function () {myMask.show();},
					// requestcomplete : function () {myMask.hide();}
				}
			});	
			myAjax.request({ // PINTA EN EL MAPA LAS ESTACIONES INTERCEPTADAS
				url : 'php/Geo_statByregion-test.php' , 
				params : {type:26,wkt : str},
				method: 'GET',
				success: function ( result, request ) {
					layerTemp=mapPanel.map.getLayersByName("Search station")[0]
					if(layerTemp){layerTemp.destroyFeatures();}
				
					geocapa = result.responseText;
					var format = new OpenLayers.Format.GeoJSON({'internalProjection': new OpenLayers.Projection("EPSG:900913"), 'externalProjection': new OpenLayers.Projection("EPSG:4326")
					});
					if(format.read(geocapa)[0]){
						mapPanel.map.addLayer(layerTempStat);
						layerTemp=mapPanel.map.getLayersByName("Search station")[0]
						layerTemp.addFeatures(format.read(geocapa));
					}
				},
				failure: function ( result, request) { 
					Ext.MessageBox.alert('Failed', result.responseText);
				}
		

			});		
			
			var gridStatStore = Ext.create('Ext.data.Store', {
				// model: 'modelGridRegion',
				// autoLoad: true,
				// autoSync: true,
				// sorters: { property: 'name', direction : 'ASC' },
				// proxy: {
					// type: 'ajax',
					// url: 'php/Geo_statByregion-test.php',
					// extraParams: {type:14,wkt : str},
					// actionMethods: {
						// read: 'POST'
					// },								
					// reader: {
						// type: 'json',
						// root: 'topics'
					// }
				// }
				storeId: 'store_ID',
				model: 'modelGridRegion',
				buffered: true,
				pageSize: 30,
				leadingBufferZone: 90,
				proxy: {
					type: 'ajax',
					url: 'php/Geo_statByregion-test.php',
					extraParams: {type:14,wkt : str},
					reader: {
						type: 'json',
						root: 'topics',
						totalProperty: 'totalCount'
					},
					simpleSortMode: true,
					filterParam: 'query',
					encodeFilters: function(filters) {
						return filters[0].value;
					}
				},
				// listeners: {
					// totalcountchange: onStoreSizeChange
				// },
				remoteFilter: true,
				autoLoad: true					
			});								
			// function onStoreSizeChange() {
				// gridRegion.down('#status').update({count: gridRegionStore.getTotalCount()});
			// }
			var varstore = Ext.create('Ext.data.Store', {
				model: 'modelvarList',
				autoLoad: true,
				autoSync: true,
				sorters: { property: 'name', direction : 'ASC' },

				proxy: {
					type: 'ajax',
					url: 'php/Geo_statByregion-test.php',
					extraParams: {type:15,wkt : str},	
					actionMethods: {
						read: 'POST'
					},									
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
								mode: 'SIMPLE',
								listeners: {
									selectionchange: function(sm, selections) {
										gridRegion.down('#removeButton').setDisabled(selections.length === 0);
										gridRegion.down('#idstatistic').setDisabled(selections.length === 0);
										
									}
								},
								select: function(records, keepExisting, suppressEvent) {
									if (Ext.isDefined(records)) {
										this.doSelect(records, keepExisting, suppressEvent);
									}
								},
								selectAll: function( suppressEvent ) {
									var me = this,
										selections = me.store.getRange();
									countFree=[]
									for( var key in selections ) {
										if( selections[key].data.copyright == 'Free'){
											countFree.push(selections[key].data.copyright)
										}
									}
									
									if(countFree.length>150){
										winInfo=Ext.MessageBox.show({
										   title: 'Information',
										   msg: 'Exceeds the maximum number (Max. 150) of downloads',
										   width:300,
										   buttons: Ext.MessageBox.OK,
										   animateTarget: 'info',
										   icon: 'x-message-box-info'
										});	
										winInfo.setPosition(mainPanelWidth/3,mainPanelHeight/2);
									}else{
										var i = 0,
											len = selections.length,
											selLen = me.getSelection().length;
											
										// if( len != selLen ) {
										if( selLen==0 ) {
											me.bulkChange = true;
											for (; i < len; i++) {
												me.doSelect(selections[i], true, suppressEvent);
											}
											delete me.bulkChange;
											me.maybeFireSelectionChange(me.getSelection().length !== selLen);
										}
										else {
											me.deselectAll( suppressEvent );
										}									
									}
								}								
							});	
							
							// btn_download = function () {
								// var selection = gridRegion.getView().getSelectionModel().getSelection();//[0];
								// selgrid=new Array()
								// for(var i = 0; i < selection.length; i++) {
									// selgrid.push(Number(selection[i].data.id));
								// }
								
								// if(selgrid.length>MaxFileDownload){
									// winInfo=Ext.MessageBox.show({
									   // title: 'Information',
									   // msg:"Exceeds the maximum number (Max. 150) of downloads",
									   // width:300,
									   // buttons: Ext.MessageBox.OK,
									   // animateTarget: 'info',
									   // icon: 'x-message-box-info'
									// });	
									// winInfo.setPosition(mainPanelWidth/3,mainPanelHeight/2);								
								// }else{
									// Ext.DomHelper.append(document.body, {
									  // tag: 'iframe',
									  // id:'downloadIframe',
									  // frameBorder: 0,
									  // width: 0,
									  // height: 0,
									  // css: 'display:none;visibility:hidden;height: 0px;',
									  // src: 'php/dowloaddata.php?typedwn=selection&station='+Ext.encode(selgrid)+'&'+'country=null'+'&'+'state=null'+'&'+'municip=null'+'&'+'variable='+Ext.encode(cmbVar.getValue())+'&typedwn=selection'
									// });
								// }
							// }
							onZoomExtentALL = function () {
								layerTemp=mapPanel.map.getLayersByName("Search station")[0]
								var BoundALL = layerTemp.getDataExtent();
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
								// maxHeight: mainPanelHeight*0.4,//Ext.getBody().getViewSize().height*0.3,
								width: mainPanelWidth,
								height: mainPanelHeight*0.4,
								// maxHeight: mainPanelHeight*0.4,
								selType: 'checkboxmodel',
								autoHeight: true,
								columns: [
									{
										xtype: 'rownumberer',
										width: 30,
										sortable: false
									},									
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
												statName = rec.get('name');
												copyrightN = rec.get('copyright');
													var periodst = Ext.create('Ext.data.Store', {
															fields: ['value','name'], 
															data: [ 
																{value:1,name: 'Daily'}, 
																{value:2,name: 'Monthly'}, 
																{value:3,name: 'Yearly'}
															]																	
													})	
												
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
													var qcstoreGrap = Ext.create('Ext.data.Store', {
														model: 'modelQC',
														autoLoad: true,
														autoSync: true,
														sorters: { property: 'name', direction : 'ASC' },

														proxy: {
															type: 'ajax',
															url: 'php/Geo_statByregion-test.php',
															extraParams: {type:29,listStatSel:Ext.encode(selectionID),spec:"espc"},
															actionMethods: {
																read: 'POST'//'POST'
															},												
															reader: {
																type: 'json',
																root: 'topics'
															}
														},
														listeners: {
															 load: function(store, records) {
																  store.insert(0, [{
																	  id: 0,
																	  name: 'raw',
																	  description: 'Original data'
																	  
																  }]);														  
															 }
														  }								
													});
													cmbPeriod='cmbPeriod'+selectionID
													cmbPeriod=Ext.create('Ext.form.field.ComboBox', { 
														fieldLabel: 'Select graphic model',
														id:'cmbPeriodID',
														labelWidth:150,
														store: periodst,
														displayField: 'name',
														value: 1,
														queryMode: 'local',
														valueField: 'value', 								
														typeAhead: true,
														listeners: {
															select: function() {
																var actTab = tabs.getActiveTab();
																var idx = tabs.items.indexOf(actTab);
																// actTabId=parseInt((actTab.title).match(/\d+/)[0])
																var idPeriod = Ext.getCmp('cmbPeriodID').getValue()
																var qc = Ext.getCmp('qcCmbGrapID').getValue()
																if (copyrightN == 'Free') {
																	generateGraps(selectionID,idPeriod,Ext.encode(cmbVar.getValue()),qc)
																}else if (copyrightN != 'Free' && idPeriod==1){
																	winInfo=Ext.MessageBox.show({
																	   title: 'Information',
																	   msg: 'Sorry, You are not authorized to download data.',
																	   width:300,
																	   buttons: Ext.MessageBox.OK,
																	   animateTarget: 'error',
																	   icon: 'x-message-box-error'
																	   
																	});	
																	winInfo.setPosition(mainPanelWidth/3,mainPanelHeight/2);																			
																	Ext.getCmp('cmbPeriodID').setValue(3);
																}else if (copyrightN != 'Free' && idPeriod==2 ){
																	winInfo=Ext.MessageBox.show({
																	   title: 'Information',
																	   msg: 'Sorry, You are not authorized to download data.',
																	   width:300,
																	   buttons: Ext.MessageBox.OK,
																	   animateTarget: 'error',
																	   icon: 'x-message-box-error'
																	   
																	});	
																	winInfo.setPosition(mainPanelWidth/3,mainPanelHeight/2);
																	Ext.getCmp('cmbPeriodID').setValue(3);
																}																

															}
														}
													});	
													if (copyrightN != 'Free') {
													Ext.getCmp('cmbPeriodID').setValue(3);
													}else{Ext.getCmp('cmbPeriodID').setValue(1);}
													
													cmbqc='cmbqc'+selectionID
													cmbqc=Ext.create('Ext.form.field.ComboBox', { 
														fieldLabel: 'Quality control:',
														labelWidth:90,
														editable: false, 
														value: 'raw',
														multiSelect: false, 
														displayField: 'name',
														valueField: 'name', 
														id:'qcCmbGrapID',
														queryMode: 'local',
														typeAhead: true,
														store: qcstoreGrap,
														width: 180,												
														listConfig: {
															getInnerTpl: function() {
																return '<div data-qtip="{description}">{name}</div>';
															}
														},														
														listeners: {
															select: function() {
																var actTab = tabs.getActiveTab();
																var idx = tabs.items.indexOf(actTab);
																// actTabId=parseInt((actTab.title).match(/\d+/)[0])
																var idPeriod = Ext.getCmp('cmbPeriodID').getValue()
																var qc = Ext.getCmp('qcCmbGrapID').getValue()
																// generateGraps(selectionID,idPeriod,Ext.encode(cmbVar.getValue()),qc)
																generateGraps(selectionID,idPeriod,"ALL",qc)

															}
														}
													});														
													btonReturn= new Ext.Button({
														pressedCls : 'my-pressed',
														overCls : 'my-over',
														tooltip: "Return to map",
														text:'Return to map',
														icon: icons+'map.png', 
														scale: 'small',
														handler: function(){
															tabs.setActiveTab(0);
														}													
													});	
													if(Ext.getCmp('graphic_tab')){
														tabs.remove(Ext.getCmp('graphic_tab'), true);
													}												

													tabs.add({
														// contentEl: "desc",
														// xtype: 'panel',
														title: 'Graph '+statName,//'Graphic_id'+selectionID
														name: 'graphic_tab',
														// width:mainPanelWidth-15,
														// height: mainPanelHeight,
														autoScroll: true,
														// height: 100,
														// autoHeight: true,
														// layout: 'fit',
														id: 'graphic_tab',
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
															items: [cmbPeriod,cmbqc,{xtype: 'tbfill'},btonReturn]
															}
														]													
													});		
													
													var t = new Ext.XTemplate(tpl);
													Ext.getCmp('graphic_tab').update(t.apply(datatest));
													// Ext.getCmp('graphic'+selectionID).update('This<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long<br/>is<br/>extra<br/>extra<br/>extra<br/>extra<br/>long');
													
													Ext.getCmp('mapPanelID').setHeight(0)
													Ext.getCmp('tabsID').setWidth(mainPanelWidth-15);
													// Ext.getCmp('tabsID').setHeight(mainPanelHeight*0.2);
													tabs.setActiveTab('graphic_tab');
													// var qc = Ext.getCmp('qcCmbGrapID').getValue()
													// generateGraps(selectionID,cmbPeriod.getValue(),Ext.encode(cmbVar.getValue()),qc)
													generateGraps(selectionID,cmbPeriod.getValue(),"ALL","raw")
												
											}, // handler											
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
										{ text: 'download',minWidth: 80,dataIndex: 'copyright', flex: 3,tdCls: 'x-change-cell'},
										{ text: 'code',minWidth: 70,dataIndex: 'code', flex: 1,tdCls: 'x-change-cell'},
										{ text: 'name',minWidth: 120,dataIndex: 'name', flex: 4,tdCls: 'x-change-cell'},
										{ text: 'institute',minWidth: 70,dataIndex: 'institute', flex: 3,tdCls: 'x-change-cell'},
										{ text: 'model',minWidth: 80,dataIndex: 'model', flex: 2,tdCls: 'x-change-cell'},
										

										
										{ text: 'variables',minWidth: 120,dataIndex: 'variables', flex: 4,tdCls: 'x-change-cell'},
										
										
										// { text: 'lon',minWidth: 80,dataIndex: 'lon', flex: 3},
										// { text: 'lat',minWidth: 80,dataIndex: 'lat', flex: 3},
										{ text: 'elevation (m)',minWidth: 80,dataIndex: 'elev', flex: 2,tdCls: 'x-change-cell'},
										{ text: 'category',minWidth: 100,dataIndex: 'category', flex: 3,tdCls: 'x-change-cell'},
										{ text: 'instalation',minWidth: 80,dataIndex: 'instalation', flex: 3,tdCls: 'x-change-cell'},
										{ text: 'suspension',minWidth: 80,dataIndex: 'suspension', flex: 3,tdCls: 'x-change-cell'},
										{ text: 'quality',minWidth: 70,dataIndex: 'quality', flex: 1,tdCls: 'x-change-cell'},									
										{ text: 'country',minWidth: 80,dataIndex: 'country', flex: 4,tdCls: 'x-change-cell'},
										{ text: 'state',minWidth: 80,dataIndex: 'state', flex: 4,tdCls: 'x-change-cell'},
										{ text: 'city',minWidth: 90,dataIndex: 'city', flex: 4,tdCls: 'x-change-cell'}
									
									// { text: 'lon',minWidth: 80,dataIndex: 'lon', flex: 3},
									// { text: 'lat',minWidth: 80,dataIndex: 'lat', flex: 3},
									// { text: 'elev',minWidth: 80,dataIndex: 'elev', flex: 2},
									// { text: 'country',minWidth: 80,dataIndex: 'country', flex: 4},
									// { text: 'state',minWidth: 80,dataIndex: 'state', flex: 4},
									// { text: 'city',minWidth: 90,dataIndex: 'city', flex: 4}
									
								],
								columnLines: true,
								// plugins: [{
									// ptype: 'rowexpander',
									// pluginId: 'rowexpanderID',
									// selectRowOnExpand: true,			
									// rowBodyTpl : new Ext.XTemplate(
										// '<p><b>category:</b> {category} | <b>instalation:</b> {instalation} ', //&#x2016; doble linea vertical
										// '| <b>quality:</b> {quality} ',
										// '| <b>lon:</b> {lon} ',
										// '| <b>lat:</b> {lat} ',
										// '| <b>elev:</b> {elev} </p>',
										// '<p><b>country:</b> {country} ',
										// '| <b>state:</b> {state} ',
										// '| <b>city:</b> {city}</p> ',
										// '<div id="myrow-{id}" ></div>'
									// ),		
									// expandOnRender: true,
									// expandOnDblClick: false		
						
								// }],							

								stripeRows: true,
								// margin: '0 0 20 0',
								selModel: selModel,
								viewConfig: { 
									stripeRows: false, 
									getRowClass: function(record, index, rowParams, stor) {
									   var c = record.get('copyright');
									   // return id == '1' ? 'general-rule' : ''; // para desaparecer el check
										if (c == 'Restricted' || c == 'Request') {
											return 'price-fall';
										} 
									}	
								},
								listeners: {
									beforeselect: function ( row, model, index ) {
										if ( model.data.copyright == "Restricted" || model.data.copyright == 'Request') {
											return false;
										}
									},
									selectionchange: function(sm, selections){ // hay problema cuando se selecciona el cursor vuelve a la primera fila
										// layerTempSel.removeAllFeatures();
										layerTempSel.destroyFeatures();
										gridRegion.down('#numRecordsSelected').setText('Selected: ' + selections.length);
										feature = layerTempStat.features;
										for (var i = feature.length - 1; i >= 0; --i) {
											// for (var j = feature[i].cluster.length - 1; j >= 0; --j) {
												idall=feature[i].attributes.id;
												for (var k = selections.length - 1; k >= 0; --k) {
													idsel=selections[k].data.id
													if(idall==idsel){
														// feature[i].layer.styleMap.styles.default.rules[0].symbolizer.externalGraphic="iconosGIS/bloqE_16px.png" 
														// layerTempSel.drawFeature(feature[i])
														 // mapPanel.map.refresh();	
														var point = new OpenLayers.Feature.Vector(
															new OpenLayers.Geometry.Point(feature[i].geometry.x, feature[i].geometry.y));	
														layerTempSel.addFeatures([point]);
														mapPanel.map.setLayerIndex(layerTempSel, 99);
													}
												}												
											// }											
										}
									},
									select: function(selModel, record, index, options) {
										var selection = gridRegion.getView().getSelectionModel();//[0];
										var number_of_selected_records = selection.getSelection().length;
										var name = Ext.getCmp('numRecordsSelected').setText( 'Selected: ' + number_of_selected_records);
									}									
								},
								dockedItems: [
									{
									xtype: 'toolbar',
									items: [{
										itemId: 'removeButton',
										text:'Download',
										tooltip:'Download data',
										icon   : iconGridDownload,
										// disabled: true,
										handler: btn_download 
									},//cmbVar,
									{
										itemId: 'zoomExtentALL',
										text:'Zoom Extent',
										tooltip:'zoomExtent to ALL',
										icon   : iconGridzoomExtentALL,//iconCls:'add',
										handler: onZoomExtentALL 
									}
									// ,{
										// itemId: 'idExpand',
										// text:'Expand all',
										// tooltip:'Expand all',
										// iconCls:iconGridExpand,
										// handler: expand 
									// }
									,{
									
										itemId: 'idstatistic',
										text:'Statistics',
										tooltip:'Summary Statistic',
										icon   : iconGridStatistics,
										disabled: true,
										handler: statistics 
									},{ xtype: 'tbtext', itemId: 'numRecords' },
									// {
										// xtype: 'component',
										// itemId: 'status',
										// tpl: 'Records: {count}',
										// style: 'margin-right:5px'
									// },									
									{ xtype: 'tbtext', itemId: 'numRecordsSelected', id:'numRecordsSelected' },
									{xtype: 'tbfill'},
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
		

							gridStatStore.on('load', function(ds){
								countRow=ds.getTotalCount()
								if(countRow>=1){
									// winRegion.show()
									// Ext.getCmp('gridRegionID').add(gridRegion);
									// Ext.getCmp('gridRegionID').doLayout();
									gridRegion.down('#numRecordsSelected').setText('Selected: ' + 0);
									Ext.getCmp('mainTableID').add(gridRegion);
									gridRegion.down('#numRecords').setText('Records: ' + countRow);
									Ext.getCmp('mainTableID').expand()
									
									// Ext.DomHelper.append(document.body, { // para descargar automaticamente
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
			
			
		}	// FIN CONTROL DRAW POLYGON	
		
		
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
			tooltip: "Download stations by box",
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
				
			},
			toggleHandler: function(btn, pressed){
				if(pressed==false){
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
					if(Ext.getCmp('gridRegionID_1')){
						Ext.getCmp('mainTableID').collapse();
						Ext.getCmp('gridRegionID_1').destroy();
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
		// toolbarItems.push(Ext.create('Ext.button.Button', selectControl));
		toolbarItems.push(Ext.create('Ext.button.Button', drawPolygon));
		// toolbarItems.push(Ext.create('Ext.button.Button', btonChirps));
		
		// Ext.getCmp('toolbarID').add(medirDistancia);	
		// Ext.getCmp('toolbarID').add({xtype: 'tbfill'});
		// Ext.getCmp('toolbarID').add(Ext.create('Ext.button.Button', medirDistancia));
		Ext.getCmp('toolbarID').add(btonZooExtent);	
		Ext.getCmp('toolbarID').add(toolbarItems);	
		// Ext.getCmp('toolbarID').add(bton_down);	
		Ext.getCmp('toolbarID').add(btonIdentify);	
	
		// Ext.getCmp('toolbarID').add(
			// {
				// xtype: "gx_geocodercombo",
				// layer: locationLayer,
				// width: 200,
			// }
		// )
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

// private
		mapPanel.map.addLayer(layerTempSel);
		
		 mainPanel=Ext.create('Ext.panel.Panel', {
			id:'mainpanelID',
			width: mainPanelWidth,
			scrollable: true,
			cls: 'css_labels',
			height: mainPanelHeight,
			// title: 'Data',
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
				// bton_login,
				// xtype:'button',

						
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
			// header: {
				// titlePosition: 1,
				// titleAlign: 'left',
				// height: 36,
				//cls: 'tabpanel-header'
			// },	
			header : Ext.create('Ext.panel.Header', {
				height : 500
			}),			
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
				listeners:{
					// beforerender: function(component, eOpts){
					// },	
					// beforeexpand:function(node, event){
						// Ext.getCmp('gridRegionID').getView().on('expandbody', function(rowNode, record, expandbody){
							// Ext.getCmp('gridRegionID').maxHeight=Ext.getCmp('mainTableID').height
							// Ext.getCmp('gridRegionID').getView().refresh();
							// console.log(Ext.getCmp('gridRegionID').maxHeight,Ext.getCmp('mainTableID').height);
						// });	
					// },
					resize: {
					  fn: function(el) {
						tablePanelH=mainPanelHeight*0.4
						tableH=el.height
						
						mainTableH=Ext.getCmp('mainTableID').height;
						if(Ext.getCmp('gridRegionID')){
							Ext.getCmp('gridRegionID').maxHeight=mainPanelHeight;
							// Ext.getCmp('gridRegionID').setHeight(mainPanelHeight);
							Ext.getCmp('gridRegionID').getView().refresh();
							
							// console.log("hola "+mainTableH+" "+Ext.getCmp('gridRegionID').height)						
						}

						// if(el.height){
							// var row = Ext.getCmp('gridRegionID').getView().getNode(0);
							// var height = Ext.get(row).getHeight();
							// numRecords=(Ext.getCmp('gridRegionID').down('#numRecords').text).replace( /^\D+/g, '')
							// maxGrid=numRecords*height+250	
							// if(tablePanelH<tableH){
								// maxGrid=maxGrid*2
							// }							
							// if(tablePanelH>maxGrid){
								// Ext.getCmp('mainTableID').height=maxGrid
								// Ext.getCmp('mainpanelID').doLayout();	
							// }else{
								// Ext.getCmp('gridRegionID').maxHeight=tableH+60
							// }
							// Ext.getCmp('gridRegionID').getView().refresh();
							// console.log('maxGrid:',maxGrid,'resize:',tableH,'tablePanelH static:',tablePanelH,'gridRegionID:',Ext.getCmp('gridRegionID').maxHeight)
						// }
						
					  }
					},
				}				

			}

			],
			renderTo: Ext.getBody() //Ext.getElementById("geomap")
		}); // fin mainPanel
		
		$("#periodh").ionRangeSlider({
			type: "double",
			min: 1981,
			max: 2019,
			from: 2008,
			to: 2019,
			to_max:2019,
			max_interval:30,
			// to_percent: 77.5,
			drag_interval: true
		});				
		$("#Smonth").ionRangeSlider({
			type: "double",
			min: 1,
			max: 12,
			from: 1,
			to: 12,
			to_max:12,
			drag_interval: true
		});		

		
    }
});

