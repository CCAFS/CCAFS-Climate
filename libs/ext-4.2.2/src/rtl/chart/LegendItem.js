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
Ext.define('Ext.rtl.chart.LegendItem', {
    override: 'Ext.chart.LegendItem',
    
    updatePosition: function(relativeTo) {
        var me = this,
            items = me.items,
            ln = items.length,
            legend = me.legend,
            currentX = me.x,
            currentY = me.y,
            item, i, x, y, translate, o, width,
            relativeX, relativeY;
            
        if (!relativeTo) {
            relativeTo = legend;
        }
            
        if (!legend.chart.getHierarchyState().rtl || !relativeTo.width) {
            me.callParent(arguments);
            return;
        }
        
        relativeX = relativeTo.x;
        relativeY = relativeTo.y;
        width = relativeTo.width;
        for (i = 0; i < ln; i++) {
            translate = true;
            item = items[i];
            switch (item.type) {
                case 'text':
                    x = width + relativeX + currentX - 30 - item.getBBox().width; // -25 & -5 for a gap
                    y = relativeY + currentY;
                    translate = false;
                    break;
                case 'rect':
                    x = width + relativeX + currentX - 25;
                    y = relativeY + currentY - 6;
                    break;
                default:
                    x = width + relativeX + currentX - 25;
                    y = relativeY + currentY;
            }
            
            o = {
                x: x,
                y: y
            };
            
            item.setAttributes(translate ? {
                translate: o
            } : o, true);
        }
    }    
});
