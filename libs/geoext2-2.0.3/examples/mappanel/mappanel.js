/*
 * Copyright (c) 2008-2014 The Open Source Geospatial Foundation
 * 
 * Published under the BSD license.
 * See https://github.com/geoext/geoext2/blob/master/license.txt for the full
 * text of the license.
 */

Ext.require([
    'Ext.container.Viewport',
    'Ext.state.Manager',
    'Ext.state.CookieProvider',
    'Ext.window.MessageBox',
    'GeoExt.panel.Map'
]);

Ext.application({
    name: 'HelloGeoExt2',
    launch: function() {

        Ext.state.Manager.setProvider(Ext.create('Ext.state.CookieProvider', {
            expires: new Date(new Date().getTime()+(1000*60*60*24*7)) //7 days from now
        }));

        var map = new OpenLayers.Map({});
        
        var wms = new OpenLayers.Layer.WMS(
            "OpenStreetMap WMS",
            "http://ows.terrestris.de/osm/service?",
            {layers: 'OSM-WMS'},
            {
                attribution: '&copy; terrestris GmbH & Co. KG <br>' +
                    'Data &copy; OpenStreetMap ' +
                    '<a href="http://www.openstreetmap.org/copyright/en"' +
                    'target="_blank">contributors<a>'
            }
        );
        
        map.addLayers([wms]);
        
        mappanel = Ext.create('GeoExt.panel.Map', {
            title: 'The GeoExt.panel.Map-class',
            map: map,
            center: '12.3046875,51.48193359375',
            zoom: 6,
            stateful: true,
            stateId: 'mappanel',
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                items: [{
                    text: 'Current center of the map',
                    handler: function(){
                        var c = GeoExt.panel.Map.guess().map.getCenter();
                        Ext.Msg.alert(this.getText(), c.toString());
                    }
                }]
            }]
        });

        Ext.create('Ext.container.Viewport', {
            layout: 'fit',
            items: [
                mappanel
            ]
        });
    }
});
