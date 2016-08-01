Ext.Loader.setConfig({enabled: true});

Ext.Loader.setPath('Ext.ux', '../../libs/ext-4.2.2/examples/ux');
Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.util.*',
    'Ext.grid.plugin.BufferedRenderer',
    'Ext.ux.form.SearchField'
]);

Ext.onReady(function(){
    Ext.define('ForumThread', {
        extend: 'Ext.data.Model',
        fields: [{
            name: 'userid',//'title',
            mapping: 'post_text'//'topic_title'
        },{
            name: 'username',
            mapping: 'author'//'author'
        }
        ],
        idProperty: 'post_id'
    });
	Ext.define('modelGridRegion', { 
			extend: 'Ext.data.Model',
        fields: [{
            name: 'category',
            mapping: 'category'
        },{
            name: 'institute',
            mapping: 'institute'
        }
        ],
        // idProperty: 'id'			

		});	
    // create the Data Store
    var store = Ext.create('Ext.data.Store', {
        id: 'store',
        model: 'modelGridRegion',
        // model: 'ForumThread',
        // allow the grid to interact with the paging scroller by buffering
        buffered: true,
        
        // The topics-remote.php script appears to be hardcoded to use 50, and ignores this parameter, so we
        // are forced to use 50 here instead of a possibly more efficient value.
        pageSize: 50,

        // This web service seems slow, so keep lots of data in the pipeline ahead!
        leadingBufferZone: 1000,
        proxy: {
            // load using script tags for cross domain, if the data in on the same domain as
            // this page, an HttpProxy would be better
            // type: 'jsonp',
			type: 'ajax',
			// url: 'http://www.sencha.com/forum/topics-remote.php',
            url: '../php/test_json.php',
			extraParams: {country : 'Colombia',state:'', municip:'',type:5},
            reader: {
				type: 'json',
                root: 'topics',
                totalProperty: 'totalCount'
            },
            // sends single sort as multi parameter
            simpleSortMode: true,
            
            // Parameter name to send filtering information in
            filterParam: 'query',

            // The PHP script just use query=<whatever>
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
        grid.down('#status').update({count: store.getTotalCount()});
    }

    function renderTopic(value, p, record) {
        return Ext.String.format(
            '<a href="http://sencha.com/forum/showthread.php?p={1}" target="_blank">{0}</a>',
            value,
            record.getId()
        );
    }

    var grid = Ext.create('Ext.grid.Panel', {
        width: 700,
        height: 500,
        collapsible: true,
        title: 'ExtJS.com - Browse Forums',
        store: store,
		selType: 'checkboxmodel',
        loadMask: true,
        dockedItems: [{
            dock: 'top',
            xtype: 'toolbar',
            items: [{
                width: 400,
                fieldLabel: 'Search',
                labelWidth: 50,
                xtype: 'searchfield',
                store: store
            }, '->', {
                xtype: 'component',
                itemId: 'status',
                tpl: 'Matching threads: {count}',
                style: 'margin-right:5px'
            }]
        }],
        selModel: {
            pruneRemoved: false
        },
        multiSelect: true,
        viewConfig: {
            trackOver: false,
            emptyText: '<h1 style="margin:20px">No matching results</h1>'
        },
        // grid columns
        columns:[{
            xtype: 'rownumberer',
            width: 50,
            sortable: false
        },{
            // tdCls: 'x-grid-cell-topic',
			header:'category',
            // text: "titulo",
            dataIndex:'category',// 'userid',//'title',//
            flex: 1,
            // renderer: renderTopic,
            sortable: false
        },{
            // text: "nane",
			header:'institute',
            dataIndex: 'institute',//'username',//
            align: 'center',
            width: 70,
            sortable: false
        }],
        renderTo: Ext.getBody()
    });
});