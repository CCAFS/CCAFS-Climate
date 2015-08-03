Ext.define('modelstatList', { 
		extend: 'Ext.data.Model',
		fields: [
			{ name: 'id', type: 'integer' },
			{ name: 'name', type: 'string' },
			{ name: 'acronym', type: 'string' }
		]
	});
var statstore = Ext.create('Ext.data.Store', {
	model: 'modelstatList',
	autoLoad: true,
	autoSync: true,
	sorters: { property: 'name', direction : 'ASC' },

	proxy: {
		type: 'ajax',
		url: 'php/Geo_statByregion.php',
		extraParams: {type:7,country : 'Colombia', state:'', municip:''},			
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

cmbStat= Ext.create('Ext.form.field.ComboBox', { 
	editable: false, 
	value: 'ALL',
	fieldLabel: 'Station',
	labelWidth: 50,
	multiSelect: true, 
	displayField: 'acronym',
	valueField: 'id', 
	id:'varCmbID',
	queryMode: 'local',
	typeAhead: true,	
	store: statstore,
	listConfig: {
		getInnerTpl: function() {
			return '<div data-qtip="{name}">{acronym}</div>';
		}
	}

});							