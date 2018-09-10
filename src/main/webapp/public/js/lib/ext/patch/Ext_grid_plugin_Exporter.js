Ext.define('Ext.grid.plugin.Exporter', {
    alias: [
        'plugin.gridexporter'
    ],

    extend: 'Ext.exporter.Plugin',

    prepareData: function (config) {
        var me = this,
            grid = me.cmp,
            table = new Ext.exporter.data.Table(),
            headers, group;

        group = table.addGroup({
            text: ''
        });

        me.extractGroups(group, grid.getColumns());

        headers = me.getColumnHeaders(grid.getHeaderContainer().innerItems, config);

        table.addGroup(group);
        table.setColumns(headers);

        return table;
    },

    getColumnHeaders: function (columns, config) {
        var cols = [],
            i, obj, col;

        for (i = 0; i < columns.length; i++) {
            col = columns[i];

            obj = {
                text: col.getText(),
                width: col.getWidth()
            };

            if (col.isHeaderGroup) {
                obj.columns = this.getColumnHeaders(col.innerItems, config);
                if (obj.columns.length === 0) {
                    // all children columns are ignored for export so there's no need to export this grouped header
                    obj = null;
                }
            } else if (!col.getIgnoreExport()) {
                obj.style = this.getExportStyle(col.getExportStyle(), config);
                obj.width = obj.width || col.getComputedWidth();
            } else {
                obj = null;
            }

            if (obj) {
                cols.push(obj);
            }
        }

        return cols;
    },

    extractGroups: function (group, columns) {
        var store = this.cmp.getStore(),
            len = store.getCount(),
            lenCols = columns.length,
            i, j, record, row, col;

        // we could also export grouped stores
        for (i = 0; i < len; i++) {
            record = store.getAt(i);
            row = group.addRow();

            for (j = 0; j < lenCols; j++) {
                col = columns[j];
                // each column has a config 'ignoreExport' that can tell us to ignore the column on export
                if (!col.getIgnoreExport()) {
                    row.addCell({
                        value: record.get(col.getDataIndex())
                    });
                }
            }
        }

        return group;
    }

});