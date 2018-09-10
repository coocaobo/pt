$import('pt.comp.module.SimpleModule');
$import('pt.util.DicFieldUtil');
Ext.define('pt.comp.module.SimpleForm', {
    extend: 'pt.comp.module.SimpleModule',
    constructor: function (config) {
        this.callParent(arguments);
    },
    init: function () {
        this.formClass = 'Ext.form.Panel';
        this.formData = null;
        this.serviceId = 'base.simpleService';
        this.createActionId = 'createSingle';
        this.loadActionId = 'loadSingle';
        this.updateActionid = 'updateSingle';
    },
    initPanel: function () {
        if (this.formPanel) {
            return this.formPanel;
        }
        if (!this.schema) {
            var schema = pt.util.Rmi.loadSchema(this.schemaId);
            if (!schema) {
                return;
            }
            this.schema = schema;
        }

        var defaultConfig = this.getDefaultFormConfig();
        var schemaConifg = this.generalFromSchema(this.schema);
        var formConfig = this.createFormConfig(defaultConfig, schemaConifg);
        var formPanel = this.formPanel = Ext.create(this.formClass, formConfig);
        return formPanel;
    },
    resetFormData: function () {
        this.doReset();
    },
    getFormData: function () {
        var datas = {};
        var fieldItems = this.formPanel.getForm().getFields().items;
        for (var i = 0, field; field = fieldItems[i]; i++) {
            datas[field.name] = field.getValue();
        }
        if (this.initData) {
            Ext.apply(datas, this.initData.recordData);
        }
        return datas;
    },
    saveData2server: function (datas) {
        this.formPanel.el.mask('正在请求数据...');
        var me = this;
        var actionid = this.createActionId;
        if (this.op == 'update') {
            actionid = this.updateActionid;
        }
        var promise = pt.util.Rmi.jsonRequest({
            serverid: this.serviceId,
            actionid: actionid,
            schemaId: this.schemaId,
            body: datas,
        });
        promise.then(function (res) {
            me.formPanel.el.unmask();
            me.saving = false;
            if (res.code === '01') {
                me.onSaveSuccess(res.body);
                EzToast.tip('数据保存成功')
                return;
            }
            console.dir('save error');
        }, function () {
            me.formPanel.el.unmask();
            me.saving = false;
            console.dir('save error');
        });
    },
    loadDataFromServer: function () {

        var pkey = this.initData.recordData[this.initData.pkeyField];
        this.loadServer(pkey, this.onLoadSuccess, this);

    },
    loadServer: function (pkey, callBack, scope) {
        var me = this;
        var promise = pt.util.Rmi.jsonRequest({
            serverid: this.serviceId,
            actionid: this.loadActionId,
            schemaId: this.schemaId,
            pkey: pkey,
        });
        promise.then(function (res) {
            if (res.code === '01') {
                if (callBack) {
                    callBack.apply(scope || me, [res.body.record]);
                }
                return;
            }
            console.dir('load data error');
        }, function () {
            console.dir('load data error');
        });
    },
    onSaveSuccess: function () {
        this.getWindow().hide();
        this.fireEvent('savesuccess');
    },
    onLoadSuccess: function (record) {
        var form = this.formPanel.getForm();
        form.setValues(record);
    },
    setFormData: function () {

    },
    getDefaultFormConfig: function () {
        return {
            width: 350,
            height: 600,
            defaultType: 'textfield',
            bodyPadding: 10,
            scrollable: true,
            defaults: {
                labelWidth: 100,
                labelAlign: 'right',
            },
            buttons: [{
                text: '保存',
                handler: this.doSave,
                scope: this
            }, {
                text: '重置',
                handler: this.doReset,
                scope: this
            }, {
                text: '取消',
                handler: this.doCancle,
                scope: this
            }]

        }
    },
    doReset: function () {
        var form = this.formPanel.getForm();
        form.reset(true);
    },
    doSave: function () {
        var form = this.formPanel;
        if (!form.isValid()) {
            return;
        }

        var isDirty = form.isDirty();
        if (!isDirty) {
            EzToast.tip('请先修改后再保存');
            return;
        }
        if (this.saving) {
            return;
        }
        this.saving = true;
        this.saveData2server(this.getFormData());
    },
    doCancle: function () {
        this.getWindow(null, true);
    },
    generalFromSchema: function (schema) {

        var scItems = ObjUtil.getProp(schema, 'config.property.entry.item');
        var items = [];


        for (var i = 0, item; item = scItems[i]; i++) {
            var display = item['@display'];
            if (display && display != '2' && display != '3') {
                continue;
            }

            var id = item['@id'];
            var alias = item['@alias'];
            var type = item['@type'];
            var vtype = item['@vtype'];
            var dicId = item['@dicId'];
            var allowBlank = item['@allowBlank'];
            var format = item['@format'];
            var maxLength = item['@maxLength'];
            var minValue = item['@minValue'] * 1;
            minValue = isNaN(minValue) ? null : minValue;
            var maxValue = item['@maxValue'] * 1;
            maxValue = isNaN(maxValue) ? null : maxValue;

            if (!this.pkeyField && item['@pkey'] == 'true') {
                this.pkeyField = id;
            }

            if (!this.isDr && id == 'DR') {
                this.isDr = true;
            }


            var parseName = id;
            var parseFieldLabel = alias;
            var parseLabelCls = null;
            var parseXtype = null;
            var parseAllowBlank = true;
            var parseFormat = null;
            var parseMaxLength = 50;
            var parseVtype = vtype;
            var parseMinValue = minValue;
            var parseMaxValue = maxValue;
            var parseDecimalPrecision = 0;


            var itemConfig;
            if (dicId) {
                itemConfig = pt.util.DicFieldUtil.createField(item);
            }
            else {
                if (type) {
                    if (type == 'string') {
                        parseXtype = 'textfield';
                    } else if (type == 'stringBig') {
                        parseXtype = 'textareafield';
                    } else if (type == 'date') {
                        parseXtype = 'datefield';
                        parseFormat = 'Y-m-d';
                    } else if (type == 'int') {
                        parseXtype = 'numberfield';
                        parseDecimalPrecision = 0;
                    } else if (type == 'long') {
                        parseXtype = 'numberfield';
                        parseDecimalPrecision = 0;
                    } else if (type == 'number') {
                        parseXtype = 'numberfield';
                        parseDecimalPrecision = 2;

                        isNaN()
                    }
                }

                if (allowBlank == '0') {
                    parseAllowBlank = false;
                    parseLabelCls = 'ez-field-label-notnull';
                }

                if (vtype) {
                    parseVtype = vtype;
                }

                if (format) {
                    parseFormat = format;
                }

                if (maxLength) {
                    maxLength = maxLength * 1;
                    parseMaxLength = isNaN(maxLength) ? 50 : maxLength;
                }

                itemConfig = {
                    name: parseName,
                    fieldLabel: parseFieldLabel,
                    labelCls: parseLabelCls,
                    xtype: parseXtype,
                    vtype: parseVtype,
                    allowBlank: parseAllowBlank,
                    format: parseFormat,
                    maxLength: parseMaxLength,
                    minValue: parseMinValue,
                    maxValue: parseMaxValue,
                    decimalPrecision: parseDecimalPrecision,

                }
            }

            items.push(itemConfig);
        }

        var ret = {
            items: items,
        };
        return ret;
    }
    ,
    createFormConfig: function (defaultConfig, scConfig) {
        var config = {
            items: scConfig.items,
        };
        Ext.applyIf(config, defaultConfig);
        return config;
    }
    ,
    onWinBeforShow: function () {
        var formPanel = this.formPanel;

        if (this.op == 'create') {
        }

        if (this.op == 'update') {
            this.loadDataFromServer();
        }
    }
    ,

    onWinBeforClose: function () {
        if (this.op == 'create') {
        }

        if (this.op == 'update') {
            this.resetFormData();
        }
    }
});