$import('pt.comp.module.SimpleList');
Ext.define('pt.comp.module.SimpleFile', {
    extend: 'pt.comp.module.SimpleList',
    constructor: function (config) {
        this.callParent(arguments);
    },
    init: function () {
        this.schemaId = 'base.File';
        this.actions = [{
            ACTIONCMD: 'upload',
            ACTIONNAME: '上传'
        }]
        // APPPKEY and APPTYPE 任何一个为空，那么不能查询数据
        this.APPTYPE = this.APPTYPE;
        this.APPPKEY = this.APPPKEY;
        this.viewAllowType = {
            '.png': true,
            '.jpg': true,
        };
        return this.callParent(arguments);
    },
    initPanel: function () {
        return this.callParent(arguments);
    },
    loadFileData: function () {
        var inSql = "select FILEID from BASE_FILE_APP where APPTYPE = '" + this.APPTYPE + "' and APPPKEY = '" + this.APPPKEY + "'";
        this.resetParam({
            cnd: ['in', ['$', 'FILEID'], [inSql]]
        });
        this.freshList();
    },
    doUpload: function () {
        $import('pt.comp.module.SimpleFileUploadForm');
        var uploadFormModule = Ext.create('pt.comp.module.SimpleFileUploadForm', {});
        uploadFormModule.on({
            scope: this,
            uploadsuccess: this.onUploadSuccess,
            uploadfailure: this.onUploadFaliure,
        });
        uploadFormModule.getWindow({
            title: '文件上传'
        }, false, {
            APPTYPE: this.APPTYPE,
            APPPKEY: this.APPPKEY
        });
    },
    getWindow: function (config, notShow, inits) {
        if (!inits.APPTYPE || !inits.APPPKEY) {
            return;
        }
        config = config || {};
        Ext.apply(config, {
            height: 500,
            width: 470,
            title: '文件查看'
        });
        var win = this.callParent([config, notShow, inits]);
        return win;
    },
    changeSchemaCoverObj: function (config) {
        config.columns.push({
            xtype: 'actioncolumn',
            width: 50,
            tdCls: 'action',
            items: [{
                iconCls: 'ez-file-view margin-left-5',
                tooltip: '预览',
                scope: this,
                handler: this.viewImg,
            }, {
                iconCls: 'ez-file-download margin-left-5',
                tooltip: '下载',
                handler: this.downLoadFile,
                scope: this,
            }]
        })
    },
    onUploadSuccess: function (appIds) {
        this.freshList();
        this.fireEvent('fileuploadsuccess', appIds, this.APPTYPE, this.APPPKEY);
        this.hasUploadFile = true;
    },
    onUploadFaliure: function () {

    },
    downLoadFile: function (grid, rowIndex, colIndex, node, e, record, rowEl) {

        var basePath = pt.util.Rmi.getBasePath();
        var href = basePath + '/down.file?FILEID=' + record.data.FILEID ;
        if (!this.ez_filedown_frame) {
            var elemIF = this.ez_filedown_frame = document.createElement("iframe");
            elemIF.id = 'ez-filedown-frame';
            elemIF.style.display = "none";
            document.body.appendChild(elemIF);
        }
        this.ez_filedown_frame.src = href;
    },
    viewImg: function (grid, rowIndex, colIndex, node, e, record, rowEl) {
        var type = record.data.FILETYPE;

        if(this.viewAllowType[type]) {

        }else {
            EzToast.tip('该文件不支持预览');
        }
            $import('pt.comp.module.SimpleFileViewModule');
        if (!this.SimpleFileViewModule) {
            this.SimpleFileViewModule = Ext.create('pt.comp.module.SimpleFileViewModule', {
            });
        }
        this.SimpleFileViewModule.getWindow({
            title: '预览'
        });
        var basePath = pt.util.Rmi.getBasePath();
        var url = basePath + '/down.file?FILEID=' + record.data.FILEID ;
        this.SimpleFileViewModule.showImg(url);


    }
});