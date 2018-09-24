$import('pt.comp.module.SimpleList');
Ext.define('yw.yj.WtpcList', {
    extend: 'pt.comp.module.SimpleList',
    constructor: function (config) {
        this.callParent(arguments);
    },
    init: function () {
        this.initCnd = ['eq', ['$', 'DR'], ['s', '0']];
        this.uploadType =  'yj.WtpcList';
        this.callParent(arguments);
    },
    getUploadParams: function(){

        var records = this.getSelection();
        var removeCount = records.length;
        if (removeCount == 0) {
            this.uploadPkey = "";
        }else {
            this.uploadPkey = '' + records[0].data.YHPCID;
        }
        var params = this.callParent(arguments);
        return params;
    },
    onFileUploadSuccess: function(appIds, appType, appKey) {
        if(!appKey || !appKey) {
            return;
        }

        var promise = pt.util.Rmi.jsonRequest({
            serverid: 'yhpcService',
            actionid: 'updateFileNum',
            type: appType,
            pkey: appKey,
        });
        promise.then(function (res) {
            if (res.code === '01') {
                return;
            }
            console.dir('save error');
        }, function () {
            console.dir('save error');
        });


    },
    /**
     * 创建参数
     * bookInfo headerInfo bodyInfo
     *
     * bookInfo
     * fileName: 文件名称
     * sheetName: 页签名称
     * sheetTitle: 页面标题
     * colWidth: 默认列宽度 int
     * rowHeight: 默认行高度 short
     *
     * headerInfo 【数组】
     * 表头信息
     * colName: 列名称,
     * colIndex: 对应数据索引
     * colType: 列类型, s:字符串, d: 数字, t: 时间
     * colHeight: 列宽度
     *
     *  bodyInfo 【数组】
     * 数据项
     * map中的key对应 headerInfo 中的colIndex
     *
     */
    doExportExcel: function() {
        var bookInfo = {
            fileName: new Date().getTime()
        };
        var headerInfo = [];
        var bodyInfo = [];

        var aColumns = this.grid.getColumns()
        if(!aColumns) {
            return;
        }
        for( var i = 0; i < aColumns.length; i ++) {
            var column = aColumns[i];
            var alias = ObjUtil.getProp(column, 'config.text');
            if(!alias) {
                continue;
            }
            var headerConfig = {
                colName: alias,
                colIndex: ObjUtil.getProp(column, 'config.dataIndex'),
                colType: 's',
                // colHeight: colHeight,
            }
            headerInfo.push(headerConfig);
        }

        this.grid.store.each(function(record, index, total) {
            bodyInfo.push(record.data);
        })

        var promise = pt.util.Rmi.jsonRequest({
            serverid: 'dataExportServer',
            actionid: 'exportExcel',
            bookInfo: bookInfo,
            headerInfo: headerInfo,
            bodyInfo: bodyInfo,
        });
        promise.then(function (res) {
            if(res.code == '01') {
                res.body.fileName;
                var path = window.location.pathname.substr(1);
                var index = path.indexOf('/');
                path = path.substr(0, index);
                var url = window.location.origin + '/' + path + '/tmp/' + res.body.fileName;
                window.open(url);
            }
        }, function () {
            console.dir('save error');
        });

    },
    zgjgRenderer: function(val, meta, reocrd, rowIndex, colIndex) {
        meta.style = 'background: red;'
        return val;
    },
    getRowClass: function (record, rowIndex, p, ds) {
       if( !record.get('ZGJG')) {
           return 'row-error-background';
       }
    },

})