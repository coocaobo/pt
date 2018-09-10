$import('pt.comp.module.SimpleModule');
Ext.define('pt.comp.module.SimpleFileUploadForm', {
    extend: 'pt.comp.module.SimpleModule',
    constructor: function (config) {
        this.callParent(arguments);
    },
    init: function () {
        this.on({
            scope: this,
            uploadsuccess: this.onUploadSuccess,
            uploadfailure: this.onUploadFaliure,
        })
        this.callParent(arguments);
    },
    initPanel: function () {
        var panel = this.panel = Ext.create('Ext.form.Panel', {
            fieldDefaults: { //统一设置表单字段默认属性
                msgTarget: 'side'
            },
            items: [{
                xtype: 'filefield',
                name: 'file',
                ariaLabel: 'abc',
                width: 400,
                placeholder: '请选择文件',
                allowBlank: false,
                buttonText: '选择文件',
            }],
            buttonAlign: 'center',
            buttons: [{
                text: '上传',
                handler: this.doSaveFileMsg,
                scope: this,
            }],
            scope: this,
        });

        return panel;
    },
    doSaveFileMsg: function () {

        var form = this.panel.getForm();
        if (!form.isValid()) {
            return;
        }
        var params = {
            APPTYPE: this.APPTYPE,
            APPPKEY: this.APPPKEY

        };
        var me = this;
        form.submit({
            url: 'upload.file',
            waitMsg: '正在上传文件请稍后...',
            params: params,
            success: function (fp, result) {
                if (result.response && result.response.responseText) {
                    var resBody = JSON.parse(result.response.responseText)

                    if (resBody.code == '01') {
                        me.fireEvent('uploadsuccess', resBody.body)
                    } else {
                        me.fireEvent('uploadfail', resBody.msg)
                    }
                }
            },
            failure: function (form, result) {
                if (result.response && result.response.responseText) {
                    var resBody = JSON.parse(result.response.responseText)

                    if (resBody.code == '01') {
                        me.fireEvent('uploadsuccess', resBody.body)
                    } else {
                        me.fireEvent('uploadfailure', resBody.msg)
                    }
                }
            },
            scope: this,
        });
    },
    onUploadSuccess: function() {
        EzToast.tip('上传文件成功');
        this.getWindow().hide();
    },
    onUploadFaliure: function() {

    },
})
;