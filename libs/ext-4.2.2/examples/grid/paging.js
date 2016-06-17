Ext.Loader.setConfig({enabled: true});

Ext.Loader.setPath('Ext.ux', '../ux/');
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
        fields: [
            'username'
        ],
        // idProperty: 'threadid'
    });

    // create the Data Store
    var store = Ext.create('Ext.data.Store', {
        pageSize: 50,
        model: 'ForumThread',
        remoteSort: true,
        proxy: {
            // load using script tags for cross domain, if the data in on the same domain as
            // this page, an HttpProxy would be better
            type: 'jsonp',
            url: 'http://www.sencha.com/forum/topics-browse-remote.php',
            reader: {
                root: 'topics',
                totalProperty: 'totalCount'
            },
            // sends single sort as multi parameter
            simpleSortMode: true
        }
        // sorters: [{
            // property: 'lastpost',
            // direction: 'DESC'
        // }]
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
        disableSelection: true,
        loadMask: true,
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
            // id assigned so we can apply custom css (e.g. .x-grid-cell-topic b { color:#333 })
            // TODO: This poses an issue in subclasses of Grid now because Headers are now Components
            // therefore the id will be registered in the ComponentManager and conflict. Need a way to
            // add additional CSS classes to the rendered cells.
            // id: 'topic',
            text: "Topic",
            dataIndex: 'username',
            flex: 1,
            // renderer: renderTopic,
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
            }]
        }),
        renderTo: 'topic-grid'
    });

    // trigger the data store load
    store.loadPage(1);
});
