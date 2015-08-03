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
 * @class Ext.util.Grouper

Represents a single grouper that can be applied to a Store. The grouper works
in the same fashion as the {@link Ext.util.Sorter}.

 * @markdown
 */
 
Ext.define('Ext.util.Grouper', {

    /* Begin Definitions */

    extend: 'Ext.util.Sorter',

    /* End Definitions */
   
   isGrouper: true,

    /**
     * Returns the value for grouping to be used.
     * @param {Ext.data.Model} instance The Model instance
     * @return {String} The group string for this model
     */
    getGroupString: function(instance) {
        return instance.get(this.property);
    }
});