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
Ext.define('Ext.rtl.chart.Legend', {
    override: 'Ext.chart.Legend',
    
    init: function() {
        var me = this;   
        
        me.callParent(arguments);
        me.position = me.chart.invertPosition(me.position);    
        me.rtl = me.chart.getHierarchyState().rtl;  
    },
    
    updateItemDimensions: function() {
        var me = this,
            result = me.callParent(),
            padding = me.padding,
            spacing = me.itemSpacing,
            items = me.items,
            len = items.length,
            mfloor = Math.floor,
            width = result.totalWidth,
            usedWidth = 0,
            i, item, itemWidth;
            
        if (me.rtl && !me.isVertical) {
            for (i = 0; i < len; ++i) {
                item = items[i];
 
                // Set the item's position relative to the legend box
                itemWidth = mfloor(item.getBBox().width + spacing);
                item.x = -usedWidth + padding;
                usedWidth += itemWidth;
            }
        }
        return result;
    }
})
