Ext.Loader.setConfig({enabled: true});

Ext.Loader.setPath('Ext.ux', '../../libs/ext-4.2.2/examples/ux');
Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.util.*',
    'Ext.toolbar.Paging',
    'Ext.ux.PreviewPlugin',
    'Ext.ModelManager',
    'Ext.tip.QuickTipManager'
]);



Ext.onReady(function(){
    Ext.tip.QuickTipManager.init();

    Ext.define('ForumThread', {
        extend: 'Ext.data.Model',
        fields: [{
            name: 'id',
            mapping: 'id'
        },{
            name: 'category',
            // mapping: 'category'
        }
        ],
        idProperty: 'id'
    });

    // create the Data Store
    var store = Ext.create('Ext.data.Store', {
        pageSize: 50,
		// leadingBufferZone: 150,
        model: 'ForumThread',
        remoteSort: true,
        proxy: {
            ////load using script tags for cross domain, if the data in on the same domain as
            //// this page, an HttpProxy would be better
            // type: 'jsonp',
			type: 'ajax',
            url: '../php/test_json.php',
            reader: {
                root: 'topics',
                totalProperty: 'totalCount'
            },
            //// sends single sort as multi parameter
            simpleSortMode: true
        },
		// proxy: Ext.create('Ext.data.proxy.Ajax', {
			// url: '../php/test_json.php',
			// reader: Ext.create('Ext.data.reader.Json', {
				// root: 'topics',
				// totalProperty: 'totalCount'
			// })
		// }),		
        sorters: [{
            property: 'id',
            direction: 'DESC'
        }]
    });

    // pluggable renders
    function renderTopic(value, p, record) {
        return Ext.String.format(
            '<b><a href="http://sencha.com/forum/showthread.php?t={2}" target="_blank">{0}</a></b><a href="http://sencha.com/forum/forumdisplay.php?f={3}" target="_blank">{1} Forum</a>',
            value,
            record.data.forumtitle,
            record.getId(),
            record.data.forumid
        );
    }

    function renderLast(value, p, r) {
        return Ext.String.format('{0}<br/>by {1}', Ext.Date.dateFormat(value, 'M j, Y, g:i a'), r.get('lastposter'));
    }


    var pluginExpanded = true;
    var grid = Ext.create('Ext.grid.Panel', {
        width: 700,
        height: 500,
        title: 'ExtJS.com - Browse Forums',
        store: store,
        // disableSelection: true,
        loadMask: true,
		selType: 'checkboxmodel',
        viewConfig: {
            id: 'gv',
            trackOver: false,
            stripeRows: false,
            plugins: [{
                ptype: 'preview',
                bodyField: 'excerpt',
                expanded: true,
                pluginId: 'preview'
            }]
        },
        // grid columns
        columns:[{
            xtype: 'rownumberer',
            width: 50,
            sortable: false
        },{
            // tdCls: 'x-grid-cell-topic',
			header:'id',
            // text: "titulo",
            dataIndex:'id',// 'userid',//'title',//
            flex: 1,
            // renderer: renderTopic,
            sortable: false
        },{
            // text: "nane",
			header:'category',
            dataIndex: 'category',//'username',//
            align: 'center',
            width: 70,
            sortable: false
        }], 
        // paging bar on the bottom
        bbar: Ext.create('Ext.PagingToolbar', {
            store: store,
            displayInfo: true,
            displayMsg: 'Displaying topics {0} - {1} of {2}',
            emptyMsg: "No topics to display",
            items:[
                '-', {
                text: 'Show Preview',
                pressed: pluginExpanded,
                enableToggle: true,
                toggleHandler: function(btn, pressed) {
                    var preview = Ext.getCmp('gv').getPlugin('preview');
                    preview.toggleExpanded(pressed);
                }
            },'-', 
			{
                text: 'Select ALL',
                pressed: pluginExpanded,
                enableToggle: true,
                toggleHandler: function(btn, pressed) {
					var selectionModel = grid.getSelectionModel()
					
					
				  var storeB = grid.getStore();
					storeB.suspendEvents();
					// alert(storeB.getTotalCount());
					// store.suspendEvents(); // avoid view update after each row
					// store.each(function(rec){ selectionModel.select(rec);rec.set('field', true) })
					// store.resumeEvents();
					// grid.getView().refresh();
				
				
					storeB.load({
						params: {start: 0, limit: storeB.getTotalCount() },
						callback: function(records, operation, success) {
							if (records.length > 0){ // Issue is here: Records returns as NULL 
								// alert('Num Records: ' + records.length);
								selection=[]
								selected=[]	
								for (var i = records.length - 1; i >= 0; i--) { 
									selectionModel.select(records[i])
									// if(!this.selected[records[i].getId()]) 
									// {
										selection.push(records[i]);
										// selected[records[i].getId()] = true;
									// }
								};
									
								// storeB.resumeEvents();
								// this.onViewRefresh();
								
								/*
								this.selection = storeB.data.items.slice(0);
								this.selected = {};
								for (var i = this.selection.length - 1; i >= 0; i--) {
									this.selected[this.selection[i].id] = true;
								};*/
							}
							else
							{
								alert('Error no tiene records');
							}
						},
						scope: this
					});

					
					// if(!this.selected[rec.getId()]) 
					// {
						// this.selection.push(rec);
						// this.selected[rec.getId()] = true;
					// }
				}				
				
			}
			
			]
        }),
		
        renderTo: 'topic-grid'
    });

    // trigger the data store load
    store.loadPage(1);
});
