Ext.define('Ext.exporter.data.Base', {

    config: {
        /**
         * @cfg {String} idPrefix
         *
         * Prefix to use when generating the id.
         *
         * @private
         */
        idPrefix: 'id',

        /**
         * @cfg {String} id
         *
         * Unique id for this object. Auto generated when missing.
         */
        id: null
    },

    // keep references to internal collections to easily destroy them
    internalCols: null,

    constructor: function(config){
        var me = this;

        me.internalCols = [];
        me.initConfig(config);

        if(!me.getId()){
            me.setId('');
        }
        return me.callParent([config]);
    },

    destroy: function(){
        var cols = this.internalCols,
            len = cols.length,
            i, col;

        for(i = 0; i < len; i++){
            col = cols[i];
            Ext.destroy(col.items, col);
        }
        cols.length = 0;
        this.internalCols = null;

        this.callParent();
    },

    applyId: function(data, id){
        if(Ext.isEmpty(id)){
            id = Ext.id(null, this.getIdPrefix());
        }
        if(!Ext.isEmpty(data)){
            id = data;
        }
        return id;
    },

    /**
     * This method could be used in config appliers that need to initialize a
     * Collection that has items of type className.
     *
     * @param data
     * @param dataCollection
     * @param className
     * @return {Ext.util.Collection}
     */
    checkCollection: function(data, dataCollection, className){
        if(data && !dataCollection){
            dataCollection = this.constructCollection(className);
        }

        if(data){
            dataCollection.add(data);
        }

        return dataCollection;
    },

    /**
     * Create a new Collection with a decoder for the specified className.
     *
     * @param className
     * @returns {Ext.util.Collection}
     *
     * @private
     */
    constructCollection: function(className){
        var col = new Ext.util.Collection({
            decoder: this.getCollectionDecoder(className),
            keyFn: this.getCollectionItemKey
        });

        this.internalCols.push(col);
        return col;
    },

    /**
     * Builds a Collection decoder for the specified className.
     *
     * @param className
     * @returns {Function}
     *
     * @private
     */
    getCollectionDecoder: function(className){
        return function(config){
            return (config && config.isInstance) ? config : Ext.create(className, config || {});
        };
    },

    /**
     * Returns a collection item key
     *
     * @param item
     * @return {String}
     *
     * @private
     */
    getCollectionItemKey: function(item){
        return item.getKey ? item.getKey() : item.getId();
    }
});

/**
 * This class implements a table column definition
 */
Ext.define('Ext.exporter.data.Column', {
    extend: 'Ext.exporter.data.Base',

    config:{
        /**
         * @cfg {Ext.exporter.data.Table} table
         *
         * Reference to the parent table object
         *
         * @private
         */
        table: null,
        /**
         * @cfg {String} text
         *
         * Column's text header
         *
         */
        text: null,
        /**
         * @cfg {Ext.exporter.file.Style} style
         *
         * Column's style. Use this to add special formatting to the exported document.
         *
         */
        style: null,
        /**
         * @cfg {Number} width
         *
         * Column's width
         *
         */
        width: null,
        /**
         * @cfg {Number} mergeAcross
         *
         * Specifies how many cells need to be merged from the current position to the right
         *
         * @readOnly
         */
        mergeAcross: null,
        /**
         * @cfg {Number} mergeDown
         *
         * Specifies how many cells need to be merged from the current position to the bottom
         *
         * @readOnly
         */
        mergeDown: null,
        /**
         * @cfg {Number} level
         *
         * Column's level
         *
         * @readOnly
         */
        level: 0,
        /**
         * @cfg {Number} index
         *
         * Column's index
         *
         * @readOnly
         */
        index: null,
        /**
         * @cfg {Ext.exporter.data.Column[]} columns
         *
         * Collection of children columns
         *
         */
        columns: null
    },

    destroy: function() {
        this.setTable(null);
        this.setColumns(null);
        this.callParent();
    },

    updateTable: function(table){
        var cols = this.getColumns(),
            i, length;

        if(cols){
            length = cols.length;
            for(i = 0; i < length; i++){
                cols.getAt(i).setTable(table);
            }
        }
    },

    applyColumns: function(data, dataCollection){
        return this.checkCollection(data, dataCollection, 'Ext.exporter.data.Column');
    },

    updateColumns: function(collection, oldCollection){
        var me = this;

        if(oldCollection){
            oldCollection.un({
                add: me.onColumnAdd,
                remove: me.onColumnRemove,
                scope: me
            });
            Ext.destroy(oldCollection.items, oldCollection);
        }
        if(collection){
            collection.on({
                add: me.onColumnAdd,
                remove: me.onColumnRemove,
                scope: me
            });
            me.onColumnAdd(collection, {items: collection.getRange()});
        }
    },

    sync: function(depth){
        var me = this,
            count = me.getColumnCount() - 1,
            cols = me.getColumns(),
            i, length, down;

        if(cols) {
            length = cols.length;
            for (i = 0; i < length; i++) {
                cols.getAt(i).sync(depth);
            }
            me.setMergeDown(null);
        }else{
            down = depth - this.getLevel();
            me.setMergeDown(down > 0 ? down : null);
        }
        me.setMergeAcross(count > 0 ? count : null);
    },

    onColumnAdd: function(collection, details){
        var items = details.items,
            length = items.length,
            level = this.getLevel(),
            table = this.getTable(),
            i, item;

        for(i = 0; i < length; i++) {
            item = items[i];
            item.setLevel(level + 1);
            item.setTable(table);
        }

        if(table) {
            table.syncColumns();
        }
    },

    onColumnRemove: function(collection, details){
        var table = this.getTable();

        Ext.destroy(details.items);
        if(table) {
            table.syncColumns();
        }
    },

    getColumnCount: function(columns){
        var s = 0,
            cols;

        if (!columns) {
            columns = this.getColumns();
            if(!columns){
                return 1;
            }
        }

        for (var i = 0; i < columns.length; i++) {
            cols = columns.getAt(i).getColumns();
            if (!cols) {
                s += 1;
            } else {
                s += this.getColumnCount(cols);
            }
        }

        return s;
    },

    /**
     * Convenience method to add columns.
     * @param {Object/Array} config
     * @return {Ext.exporter.data.Column/Ext.exporter.data.Column[]}
     */
    addColumn: function(config){
        if(!this.getColumns()){
            this.setColumns([]);
        }
        return this.getColumns().add(config || {});
    },

    /**
     * Convenience method to fetch a column by its id.
     * @param id
     * @return {Ext.exporter.data.Column}
     */
    getColumn: function(id){
        return this.getColumns().get(id);
    }

});

/**
 * This class implements a table cell definition
 */
Ext.define('Ext.exporter.data.Cell', {
    extend: 'Ext.exporter.data.Base',

    config: {
        /**
         * @cfg {Number/String/Date} value
         *
         * Cell's value
         *
         */
        value: null
    }
});

/**
 * This class implements a table row definition.
 */
Ext.define('Ext.exporter.data.Row', {
    extend: 'Ext.exporter.data.Base',


    config: {
        /**
         * @cfg {Ext.exporter.data.Cell[]} cells
         *
         * Row's cells
         */
        cells: null
    },

    destroy: function() {
        this.setCells(null);
        this.callParent();
    },

    applyCells: function(data, dataCollection){
        return this.checkCollection(data, dataCollection, 'Ext.exporter.data.Cell');
    },

    /**
     * Convenience method to add cells.
     * @param {Object/Array} config
     * @return {Ext.exporter.data.Cell/Ext.exporter.data.Cell[]}
     */
    addCell: function(config){
        if(!this.getCells()){
            this.setCells([]);
        }
        return this.getCells().add(config || {});
    },

    /**
     * Convenience method to fetch a cell by its id.
     * @param id
     * @return {Ext.exporter.data.Cell}
     */
    getCell: function(id){
        if(!this.getCells()){
            return null;
        }
        return this.getCells().get(id);
    }

});

/**
 * This class implements a table group definition.
 */
Ext.define('Ext.exporter.data.Group', {
    extend: 'Ext.exporter.data.Base',


    config: {
        /**
         * @cfg {String} text
         *
         * Group's header
         *
         */
        text: null,
        /**
         * @cfg {Ext.exporter.data.Row[]} rows
         *
         * Group's rows
         *
         */
        rows: null,
        /**
         * @cfg {Ext.exporter.data.Row[]} summaries
         *
         * Group's summaries
         *
         */
        summaries: null,
        /**
         * @cfg {Ext.exporter.data.Row} summary
         *
         * Define a single summary row. Kept for compatibility.
         * @private
         * @hide
         */
        summary: null,
        /**
         * @cfg {Ext.exporter.data.Group[]} groups
         *
         * Collection of sub-groups belonging to this group.
         *
         */
        groups: null
    },

    destroy: function() {
        var me = this;

        me.setRows(null);
        me.setSummaries(null);
        me.setGroups(null);

        me.callParent();
    },

    applyRows: function(data, dataCollection){
        return this.checkCollection(data, dataCollection, 'Ext.exporter.data.Row');
    },

    /**
     * Convenience method to add rows.
     * @param {Object/Array} config
     * @return {Ext.exporter.data.Row/Ext.exporter.data.Row[]}
     */
    addRow: function(config){
        if(!this.getRows()){
            this.setRows([]);
        }
        return this.getRows().add(config || {});
    },

    /**
     * Convenience method to fetch a row by its id.
     * @param id
     * @return {Ext.exporter.data.Row}
     */
    getRow: function(id){
        if(!this.getRows()){
            return null;
        }
        return this.getRows().get(id);
    },

    applyGroups: function(data, dataCollection){
        return this.checkCollection(data, dataCollection, 'Ext.exporter.data.Group');
    },

    /**
     * Convenience method to add groups.
     * @param {Object/Array} config
     * @return {Ext.exporter.data.Group/Ext.exporter.data.Group[]}
     */
    addGroup: function(config){
        if(!this.getGroups()){
            this.setGroups([]);
        }
        return this.getGroups().add(config || {});
    },

    /**
     * Convenience method to fetch a group by its id.
     * @param id
     * @return {Ext.exporter.data.Group}
     */
    getGroup: function(id){
        var groups = this.getGroups();

        if(!groups){
            return null;
        }
        return groups.get(id);
    },

    applySummaries: function(data, dataCollection){
        return this.checkCollection(data, dataCollection, 'Ext.exporter.data.Row');
    },

    applySummary: function(value){
        if(value) {
            this.addSummary(value);
        }
        return null;
    },

    /**
     * Convenience method to add summary rows.
     * @param {Object/Array} config
     * @return {Ext.exporter.data.Row/Ext.exporter.data.Row[]}
     */
    addSummary: function(config){
        if(!this.getSummaries()){
            this.setSummaries([]);
        }
        return this.getSummaries().add(config || {});
    },

    /**
     * Convenience method to fetch a summary row by its id.
     * @method getSummary
     * @param id Id of the summary row
     * @return {Ext.exporter.data.Row}
     */
    getSummary: function(id){
        var col = this.getSummaries();

        return col ? col.get(id) : null;
    }
});
/**
 * This class implements the data structure required by an exporter.
 */
Ext.define('Ext.exporter.data.Table', {
    extend: 'Ext.exporter.data.Base',

    isDataTable: true,

    config: {
        /**
         * @cfg {Ext.exporter.data.Column[]} columns
         *
         * Collection of columns that need to be exported.
         *
         */
        columns: null,
        /**
         * @cfg {Ext.exporter.data.Group[]} groups
         *
         * Collection of groups that need to be exported.
         *
         */
        groups: null
    },

    destroy: function() {
        this.setColumns(null);
        this.setGroups(null);
        this.callParent();
    },

    applyColumns: function(data, dataCollection){
        return this.checkCollection(data, dataCollection, 'Ext.exporter.data.Column');
    },

    updateColumns: function(collection, oldCollection){
        var me = this;

        if(oldCollection){
            oldCollection.un({
                add: me.onColumnAdd,
                remove: me.onColumnRemove,
                scope: me
            });
            Ext.destroy(oldCollection.items, oldCollection);
        }
        if(collection){
            collection.on({
                add: me.onColumnAdd,
                remove: me.onColumnRemove,
                scope: me
            });
            me.onColumnAdd(collection, {items: collection.getRange()});
            me.syncColumns();
        }
    },

    syncColumns: function(){
        var cols = this.getColumns(),
            depth = this.getColDepth(cols, -1),
            result = {},
            i, j, length, len, keys, arr, prevCol, index;

        if(!cols){
            return;
        }
        length = cols.length;
        for(i = 0; i < length; i++){
            cols.getAt(i).sync(depth);
        }
        this.getColumnLevels(cols, depth, result);
        keys = Ext.Object.getKeys(result);
        length = keys.length;

        for(i = 0; i < length; i++){
            arr = result[keys[i]];
            len = arr.length;
            for(j = 0; j < len; j++){
                if(j === 0){
                    index = 1;
                }else if(arr[j - 1]) {
                    prevCol = arr[j - 1].getConfig();
                    index += (prevCol.mergeAcross ? prevCol.mergeAcross + 1 : 1);
                }else{
                    index++;
                }
                if(arr[j]){
                    arr[j].setIndex(index);
                }
            }
        }
    },

    getLeveledColumns: function(){
        var cols = this.getColumns(),
            depth = this.getColDepth(cols, -1),
            result = {};

        this.getColumnLevels(cols, depth, result, true);
        return result;
    },

    /**
     * Fetch all bottom columns from the `columns` hierarchy.
     *
     * @return {Ext.exporter.data.Column[]}
     */
    getBottomColumns: function(){
        var result = this.getLeveledColumns(),
            keys, len;

        keys = Ext.Object.getKeys(result);
        len = keys.length;

        return len ? result[keys[keys.length - 1]] : [];
    },

    getColumnLevels: function(columns, depth, result, topDown){
        var col, i, j, len, name, level, cols;

        if (!columns) {
            return;
        }

        len = columns.length;
        for (i = 0; i < len; i++) {
            col = columns.getAt(i);
            level = col.getLevel();
            cols = col.getColumns();

            name = 's' + level;
            result[name] = result[name] || [];
            result[name].push(col);

            if(!cols) {
                for (j = level + 1; j <= depth; j++) {
                    name = 's' + j;
                    result[name] = result[name] || [];
                    result[name].push(topDown ? col : null);
                }
            }else{
                this.getColumnLevels(cols, depth, result, topDown);
            }
        }
    },

    onColumnAdd: function(collection, details){
        var items = details.items,
            length = items.length,
            i, item;

        for(i = 0; i < length; i++) {
            item = items[i];
            item.setTable(this);
            item.setLevel(0);
        }
        this.syncColumns();
    },

    onColumnRemove: function(collection, details){
        Ext.destroy(details.items);
        this.syncColumns();
    },

    getColumnCount: function(){
        var cols = this.getColumns(),
            s = 0,
            i, length;

        if(cols) {
            length = cols.length;
            for (i = 0; i < length; i++) {
                s += cols.getAt(i).getColumnCount();
            }
        }
        return s;
    },

    getColDepth: function(columns, level){
        var m = 0;

        if (!columns) {
            return level;
        }

        for (var i = 0; i < columns.length; i++) {
            m = Math.max(m, this.getColDepth(columns.getAt(i).getColumns(), level + 1));
        }

        return m;
    },

    /**
     * Convenience method to add columns.
     * @param {Object/Array} config
     * @return {Ext.exporter.data.Column/Ext.exporter.data.Column[]}
     */
    addColumn: function(config){
        if(!this.getColumns()){
            this.setColumns([]);
        }
        return this.getColumns().add(config || {});
    },

    /**
     * Convenience method to fetch a column by its id.
     * @param id
     * @return {Ext.exporter.data.Column}
     */
    getColumn: function(id){
        var cols = this.getColumns();

        if(!cols){
            return null;
        }
        return cols.get(id);
    },

    applyGroups: function(data, dataCollection){
        return this.checkCollection(data, dataCollection, 'Ext.exporter.data.Group');
    },

    /**
     * Convenience method to add groups.
     * @param {Object/Array} config
     * @return {Ext.exporter.data.Group/Ext.exporter.data.Group[]}
     */
    addGroup: function(config){
        if(!this.getGroups()){
            this.setGroups([]);
        }
        return this.getGroups().add(config || {});
    },

    /**
     * Convenience method to fetch a group by its id.
     * @param id
     * @return {Ext.exporter.data.Group}
     */
    getGroup: function(id){
        var groups = this.getGroups();

        if(!groups){
            return null;
        }
        return groups.get(id);
    }
});


/**
 * This exporter produces Microsoft Excel 2007 xlsx files for the supplied data. The standard [ISO/IEC 29500-1:2012][1]
 * was used for this implementation.
 *
 * [1]: http://www.iso.org/iso/home/store/catalogue_ics/catalogue_detail_ics.htm?csnumber=61750
 */
Ext.define('Ext.exporter.excel.Xlsx', {
    extend: 'Ext.exporter.Base',

    // for backward compatibility
    alternateClassName: 'Ext.exporter.Excel',

    alias: [
        'exporter.excel07',
        'exporter.xlsx',
        // last version of excel supported will get this alias
        'exporter.excel'
    ],

    requires: [
        'Ext.exporter.file.ooxml.Excel'
    ],

    config: {
        /**
         * @cfg {Ext.exporter.file.excel.Style} defaultStyle
         *
         * Default style applied to all cells
         */
        defaultStyle: {
            alignment: {
                vertical: 'Top'
            },
            font: {
                fontName: 'Arial',
                family: 'Swiss',
                size: 11,
                color: '#000000'
            }
        },

        /**
         * @cfg {Ext.exporter.file.excel.Style} titleStyle
         *
         * Default style applied to the title
         */
        titleStyle: {
            alignment: {
                horizontal: 'Center',
                vertical: 'Center'
            },
            font: {
                fontName: 'Arial',
                family: 'Swiss',
                size: 18,
                color: '#1F497D'
            }
        },

        /**
         * @cfg {Ext.exporter.file.excel.Style} groupHeaderStyle
         *
         * Default style applied to the group headers
         */
        groupHeaderStyle: {
            borders: [{
                position: 'Bottom',
                lineStyle: 'Continuous',
                weight: 1,
                color: '#4F81BD'
            }]
        },

        /**
         * @cfg {Ext.exporter.file.excel.Style} groupFooterStyle
         *
         * Default style applied to the group footers
         */
        groupFooterStyle: {
            borders: [{
                position: 'Top',
                lineStyle: 'Continuous',
                weight: 1,
                color: '#4F81BD'
            }]
        },

        /**
         * @cfg {Ext.exporter.file.excel.Style} tableHeaderStyle
         *
         * Default style applied to the table headers
         */
        tableHeaderStyle: {
            alignment: {
                horizontal: 'Center',
                vertical: 'Center'
            },
            borders: [{
                position: 'Bottom',
                lineStyle: 'Continuous',
                weight: 1,
                color: '#4F81BD'
            }],
            font: {
                fontName: 'Arial',
                family: 'Swiss',
                size: 11,
                color: '#1F497D'
            }
        }
    },

    fileName: 'export.xlsx',
    charset: 'ascii',
    mimeType: 'application/zip',
    binary: true,

    destroy: function () {
        var me = this;

        me.excel = me.worksheet = Ext.destroy(me.excel, me.worksheet);

        me.callParent();
    },

    getContent: function() {
        var me = this,
            config = this.getConfig(),
            data = config.data,
            colMerge;

        me.excel = new Ext.exporter.file.ooxml.Excel({
            properties: {
                title: config.title,
                author: config.author
            }
        });

        me.worksheet = me.excel.addWorksheet({
            name: config.title
        });
        me.tableHeaderStyleId = me.excel.addCellStyle(config.tableHeaderStyle);

        colMerge = data ? data.getColumnCount() : 1;

        me.addTitle(config, colMerge);

        if(data) {
            me.buildHeader();
            me.buildRows(data.getGroups(), colMerge, 0);
        }

        me.columnStylesNormal = me.columnStylesNormalId = me.columnStylesFooter = me.columnStylesFooterId = null;

        return me.excel.render();
    },

    addTitle: function(config, colMerge){
        if(!Ext.isEmpty(config.title)) {
            this.worksheet.addRow({
                height: 22.5
            }).addCell({
                mergeAcross: colMerge - 1,
                value: config.title,
                styleId: this.excel.addCellStyle(config.titleStyle)
            });
        }
    },

    buildRows: function (groups, colMerge, level) {
        var me = this,
            showSummary = me.getShowSummary(),
            g, row, styleH, styleF, cells,
            i, j, k, gLen, sLen, cLen, oneLine;

        if (!groups) {
            return;
        }

        styleH = me.excel.addCellStyle(Ext.applyIf({
            alignment: {
                Indent: level > 0 ? level : 0
            }
        }, me.getGroupHeaderStyle()));

        styleF = me.excel.addCellStyle(Ext.applyIf({
            alignment: {
                Indent: level > 0 ? level : 0
            }
        }, me.columnStylesFooter[0]));

        gLen = groups.length;
        for (i = 0; i < gLen; i++) {
            g = groups.getAt(i).getConfig();

            // if the group has no subgroups and no rows then show only summaries
            oneLine = (!g.groups && !g.rows);

            if(showSummary !== false && !Ext.isEmpty(g.text) && !oneLine){
                me.worksheet.addRow({
                    styleId: styleH
                }).addCell({
                    mergeAcross: colMerge - 1,
                    value: g.text,
                    styleId: styleH
                });
            }

            me.buildRows(g.groups, colMerge, level + 1);
            me.buildGroupRows(g.rows);

            if( g.summaries && (showSummary || oneLine) ){
                sLen = g.summaries.length;
                for(k = 0; k < sLen; k++){
                    // that's the summary footer
                    row = me.worksheet.addRow();
                    cells = g.summaries.getAt(k).getCells();
                    cLen = cells.length;
                    for (j = 0; j < cLen; j++) {
                        row.addCell(cells.getAt(j).getConfig()).setStyleId( oneLine ? me.columnStylesNormalId[j] : (j === 0 ? styleF : me.columnStylesFooterId[j]) );
                    }
                }
            }

        }
    },

    buildGroupRows: function(rows){
        var row, cells, i, j, rLen, cLen, cell;

        if (!rows) {
            return;
        }

        rLen = rows.length;
        for (i = 0; i < rLen; i++) {
            row = this.worksheet.addRow();
            cells = rows.getAt(i).getCells();
            cLen = cells.length;
            for (j = 0; j < cLen; j++) {
                cell = cells.getAt(j).getConfig();
                // for some reason is not enough to style a column
                // and we need to style cells of that column too
                cell.styleId = this.columnStylesNormalId[j];
                row.addCell(cell);
            }
        }
    },

    buildHeader: function () {
        var me = this,
            ret = {},
            data = me.getData(),
            keys, row, i, j, len, lenCells, style, arr, fStyle, col, colCfg;

        me.buildHeaderRows(data.getColumns(), ret);

        keys = Ext.Object.getKeys(ret);
        len = keys.length;

        for(i = 0; i < len; i++){
            row = me.worksheet.addRow({
                height: 20.25,
                autoFitHeight: 1,
                styleId: me.tableHeaderStyleId
            });

            arr = ret[keys[i]];
            lenCells = arr.length;

            for(j = 0; j < lenCells; j++){
                row.addCell(arr[j]).setStyleId(me.tableHeaderStyleId);
            }

        }

        arr = data.getBottomColumns();
        lenCells = arr.length;
        me.columnStylesNormal = [];
        me.columnStylesNormalId = [];
        me.columnStylesFooter = [];
        me.columnStylesFooterId = [];
        fStyle = me.getGroupFooterStyle();

        for(j = 0; j < lenCells; j++){
            col = arr[j];
            colCfg = {
                style: col.getStyle(),
                width: col.getWidth()
            };


            style = Ext.applyIf({parentId: 0}, fStyle);
            style = Ext.merge(style, colCfg.style);
            me.columnStylesFooter.push(style);
            me.columnStylesFooterId.push(me.excel.addCellStyle(style));

            style = Ext.applyIf({parentId: 0}, colCfg.style);
            me.columnStylesNormal.push(style);
            colCfg.styleId = me.excel.addCellStyle(style);
            me.columnStylesNormalId.push(colCfg.styleId);

            colCfg.min = colCfg.max = j + 1;
            colCfg.style = null;
            if(colCfg.width){
                colCfg.width = colCfg.width / 10;
            }

            me.worksheet.addColumn(colCfg);
        }
    },

    buildHeaderRows: function (columns, result) {
        var col, cols, i, len, name;

        if (!columns) {
            return;
        }

        len = columns.length;
        for (i = 0; i < len; i++) {
            col = columns.getAt(i).getConfig();
            col.value = col.text;
            cols = col.columns;
            delete(col.columns);
            delete(col.table);

            name = 's' + col.level;
            result[name] = result[name] || [];
            result[name].push(col);

            this.buildHeaderRows(cols, result);
        }
    }


});

Ext.define('Ext.exporter.Plugin', {
    extend: 'Ext.plugin.Abstract',

    alias: [
        'plugin.exporterplugin'
    ],


    init: function (cmp) {
        var me = this;

        cmp.saveDocumentAs = Ext.bind(me.saveDocumentAs, me);
        cmp.getDocumentData = Ext.bind(me.getDocumentData, me);
        me.cmp = cmp;

        return me.callParent([cmp]);
    },

    destroy: function(){
        var me = this;

        me.cmp.saveDocumentAs = me.cmp.getDocumentData = me.cmp = null;

        me.callParent();
    },

    saveDocumentAs: function(config){
        var cmp = this.cmp,
            deferred = new Ext.Deferred(),
            exporter = this.getExporter(config);

        cmp.fireEvent('beforedocumentsave', cmp);

        Ext.asap(this.delayedSave, this, [exporter, config, deferred]);
        return deferred.promise;
    },

    delayedSave: function(exporter, config, deferred){
        var cmp = this.cmp;

        // the plugin might be disabled or the component is already destroyed
        if(this.disabled || !cmp){
            Ext.destroy(exporter);
            deferred.reject();
            return;
        }

        exporter.setData(this.prepareData(config));
        cmp.fireEvent('dataready', cmp, exporter.getData());

        exporter.saveAs().then(
            function(){
                deferred.resolve(config);
            },
            function(msg){
                deferred.reject(msg);
            }
        ).always(function(){
            Ext.destroy(exporter);
            if(cmp) {
                cmp.fireEvent('documentsave', cmp);
            }
        });
    },

    getDocumentData: function(config){
        var exporter, ret;

        if(this.disabled){
            return;
        }

        exporter = this.getExporter(config);
        ret = exporter.getContent();
        Ext.destroy(exporter);

        return ret;
    },

    getExporter: function(config){
        var cfg = Ext.apply({
            type: 'excel'
        }, config);

        return Ext.Factory.exporter(cfg);
    },

    getExportStyle: function(style, config){
        var type = (config && config.type),
            types, def, index;

        if(Ext.isArray(style)) {
            types = Ext.Array.pluck(style, 'type');
            index = Ext.Array.indexOf(types, undefined);
            if (index >= 0) {
                // we found a default style which means that all others are exceptions
                def = style[index];
            }

            index = Ext.Array.indexOf(types, type);
            return index >= 0 ? style[index] : def;
        }else{
            return style;
        }
    },

    prepareData: Ext.emptyFn

});