/*
This file is part of Ext JS 4.2

Copyright (c) 2011-2013 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as
published by the Free Software Foundation and appearing in the file LICENSE included in the
packaging of this file.

Please review the following information to ensure the GNU General Public License version 3.0
requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department
at http://www.sencha.com/contact.

Build date: 2013-09-18 17:18:59 (940c324ac822b840618a3a8b2b4b873f83a1a9b1)
*/
/**
 * This class implements the component event domain. All classes extending from
 * {@link Ext.Component} are included in this domain. The matching criteria uses
 * {@link Ext.ComponentQuery}.
 * 
 * @private
 */
Ext.define('Ext.app.domain.Component', {
    extend: 'Ext.app.EventDomain',
    singleton: true,

    requires: [
        'Ext.Component'
    ],

    type: 'component',

    constructor: function() {
        var me = this;
        
        me.callParent();
        me.monitor(Ext.Component);
    },

    match: function(target, selector) {
        return target.is(selector);
    }
});
