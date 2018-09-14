$import('pt.comp.module.SimpleModule');
$import('pt.util.DicFieldUtil');
Ext.define('pt.comp.module.SimpleList', {
    extend: 'pt.comp.module.SimpleModule',
    constructor: function (config) {
        this.callParent(arguments);
    },
    pkeyField: '',
    isDr: false,
    init: function () {
        Ext.applyIf(this, {
            gridClass: 'Ext.grid.GridPanel',
            initCnd: [],
            serviceId: 'base.simpleService',
            queryActionId: 'querySingleList',
            removeActionId: 'removeSingleRecord',
            createFormClass: 'pt.comp.module.SimpleForm',
            updateFormClass: 'pt.comp.module.SimpleForm',
            viewFormClass: 'pt.comp.module.SimpleForm',
            middleModule: {},
        });

        this.cndField = {
            showField: null,
            allField: [],
        };
        this.requestData = {
            serverid: this.serviceId,
            actionid: this.queryActionId,
            schemaId: this.schemaId,
            cnd: this.initCnd,
        };
    },
    initPanel: function () {
        if (this.grid) {
            return this.grid;
        }
        if (!this.schema) {
            var schema = pt.util.Rmi.loadSchema(this.schemaId);
            if (!schema) {
                console.error('schema load error ');
                return;
            }
            this.changeSchema(schema);
            this.schema = schema;
        }

        var defaultConfig = this.getDefaultGridConfig();
        var schemaConifg = this.generalFromSchema(this.schema);
        var gridConfig = this.createGridConfig(defaultConfig, schemaConifg);
        var grid = Ext.create(this.gridClass, gridConfig);
        this.initGridEvent(grid);
        this.panel = grid;
        this.grid = grid;
        return grid;
    },
    initGridEvent: function (grid) {
        grid.on('rowdblclick', this.onRowdblclick, this);
    },
    onRowdblclick: function (grid, record, element, rowIndex, e, eOpts) {
        this.doView(record);
    },
    changeSchema: function () {
    },

    /**
     * string 默认为string
     * stringBig: 对应 textareafield内容
     * int
     * long     -- 保存时需要转换为Long
     * number  -- 保存时需要转换为BigDecimail
     * date    -- 保存时需要转换为 Date
     * @param schema
     * @returns {{columns: Array, fields: Array}}
     */
    generalFromSchema: function (schema) {

        var items = ObjUtil.getProp(schema, 'config.property.entry.item');

        var columns = [];
        var fields = [];
        var searchs = [];
        var groupTextCache = {};

        for (var i = 0, item; item = items[i]; i++) {
            var display = item['@display'];

            if (!this.pkeyField && item['@pkey'] == 'true') {
                this.pkeyField = item['@id'];
            }

            if (display && display != '1' && display != '3') {
                continue;
            }

            var id = item['@id'];
            var alias = item['@alias'];
            var type = item['@type'];
            var dicId = item['@dicId'];
            var allowBlank = item['@allowBlank'];
            var width = item['@width'];
            var renderer = item['@renderer'];
            var rendererFormat = item['@rendererFormat'];
            var flex = item['@flex'];
            var search = item['@search'];
            var groupText = item['@groupText'];


            if (!this.isDr && id == 'DR') {
                this.isDr = true;
            }


            var parseText = alias;
            var parseDataIndex = id;
            var parseType = 'string';
            var parseAlign = 'left';
            var parseRenderer = null;
            var parseWidth = null;
            var parseFlex = null;

            if (type) {
                if (type.startsWith('string')) {
                    parseType = 'string';
                } else if (type == 'date') {
                    parseRenderer = Ext.util.Format.dateRenderer(rendererFormat || 'Y-m-d')
                    parseAlign = 'center';
                } else if (type == 'int') {
                    parseType = 'int';
                    parseAlign = 'right';
                } else if (type == 'long') {
                    parseType = 'int';
                    parseAlign = 'right';
                } else if (type == 'number') {
                    parseType = 'number';
                    parseRenderer = Ext.util.Format.numberRenderer(rendererFormat || '0.00');
                    parseAlign = 'right';

                }
            }

            if (dicId) {
                parseDataIndex = parseDataIndex + '_text';
                parseType = 'string';
            }
            if (allowBlank == '0') {
                parseText = '<span class="ez-color-red">*' + parseText + '</span>';
            }
            if (width) {
                width = width * 1;
                parseWidth = isNaN(width) ? null : width;
            }
            if (renderer && this[renderer] && typeof(this[renderer]) == 'function') {
                parseRenderer = this[renderer];
            }
            if (flex) {
                flex = flex * 1;
                parseFlex = isNaN(flex) ? null : flex;
            }

            var columnConfig = {
                alias: alias,
                text: parseText,
                dataIndex: parseDataIndex,
                type: parseType,
                flex: parseFlex,
                align: parseAlign,
                width: parseWidth,
                renderer: parseRenderer,
            };


            if (groupText) {
                var group = groupTextCache[groupText];
                if (!group) {
                    group = groupTextCache[groupText] = {
                        text: groupText,
                        columns: []
                    };
                    columns.push(group)
                }
                group.columns.push(columnConfig);

            } else {
                columns.push(columnConfig);
            }

            var field = {
                name: parseDataIndex,
                type: parseType,
            }
            fields.push(field);


            if (search === '1') {
                var searchConfig = {
                    dicId: dicId,
                    id: id,
                    text: alias,
                    type: type,
                };
                searchs.push(searchConfig);
            }

        }
        var ret = {
            columns: columns,
            fields: fields,
            searchs: searchs
        };
        this.changeSchemaCoverObj(ret);
        return ret;
    },
    changeSchemaCoverObj: function () {
    },
    /**
     * @param fields
     * @returns {Ext.data.Store}
     */
    createStore: function (fields) {
        var myStore = Ext.create('Ext.data.Store', {
            fields: fields,
            proxy: {
                type: 'ajax',
                url: 'json',
                actionMethods: {
                    read: 'POST',
                },
                paramsAsJson: true,
                extraParams: this.requestData,
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                },

                reader: {
                    type: 'json',
                    rootProperty: 'body.list',
                    totalProperty: 'body.total',
                },
            },
            autoLoad: this.autoLoad !== false,
        });
        return myStore;
    },
    createGridConfig: function (defaultConfig, scConfig) {
        var store = this.createStore(scConfig.fields);
        var tbar = this.createTbar(scConfig.searchs);
        var columns = [].concat(defaultConfig.columns).concat(scConfig.columns);
        var config = {
            store: store,
            columns: columns,
            // plugins: [{
            //     type: 'gridexporter'
            // }],
            bbar: Ext.create('Ext.toolbar.Paging', {
                store: store,
                displayInfo: true,
            }),
            tbar: {
                items: [{
                    xtype: 'toolbar',
                    items: tbar,
                    border: 0,
                    padding: 0,
                }],
                scrollable: true,
            },
        }
        Ext.applyIf(config, defaultConfig);
        return config;
    },

    createTbar: function (searchs) {
        var ret = [];
        var queryFields = this.createQueryFields(searchs);
        if (queryFields) {
            ret = ret.concat(queryFields);
        }

        var buttons = this.createButtons();
        if (buttons) {
            ret = ret.concat(buttons);
        }

        if (ret.length == 0) {
            return;
        }
        return ret;
    },
    createQueryFields: function (searchs) {
        if (!searchs || !(searchs instanceof Array) || searchs.length == 0) {
            return;
        }
        var comboData = [];

        for (var i = 0, item; item = searchs[i]; i++) {
            var itemId = item.id
            comboData.push({
                value: itemId,
                text: item.text,
                fieldType: item.type,
            })

            var cndField = this.createCndField(item);
            this.cndField.allField.push(cndField);
        }

        this.showCndField();

        var store = new Ext.data.JsonStore({
            fields: ['value', 'text', 'fieldType'],
            data: comboData
        });
        var cndChoiceCombo = this.cndChoiceCombo = Ext.create('Ext.form.field.ComboBox', {
            store: store,
            valueField: "value",
            displayField: "text",
            mode: 'local',
            triggerAction: 'all',
            emptyText: '选择查询字段',
            selectOnFocus: true,
            editable: false,
            width: 120,
            value: comboData[0].value
        });
        cndChoiceCombo.on('change', this.onCndFieldSelect, this);

        var queryBtn = Ext.create('Ext.SplitButton', {
            // text: '查找',
            handler: this.doCndQuery,
            scope: this,
            iconCls: 'x-tool-img x-tool-search',
            menu: new Ext.menu.Menu({
                items: [
                    {
                        text: '高级查询', handler: function () {
                        EzToast.tip('未开放')
                    }
                    },
                ]
            })
        });

        var ret = [cndChoiceCombo];
        ret = ret.concat(this.cndField.allField);
        ret.push(queryBtn);
        return ret;
    },
    onCndFieldSelect: function (comb, newValue) {
        this.showCndField('cnd_' + newValue);
    },
    showCndField: function (name) {
        if (!name) {
            var willShow = this.cndField.allField[0];
            if (this.cndField.showField) {
                if (willShow.name == this.cndField.showField.name) {
                    return;
                }
                this.cndField.showField.hide();
            }
            this.cndField.showField = willShow;
            willShow.show();
            return;
        }

        if (this.cndField.showField) {
            this.cndField.showField.hide();
        }
        for (var i = 0, field; field = this.cndField.allField[i]; i++) {
            if (name == field.name) {
                this.cndField.showField = field;
                field.show();
            }
        }

    },
    createCndField: function (item) {
        var cndField = {};

        var fieldClass = 'Ext.form.TextField';
        var cndId = 'cnd_' + item.id;
        var type = item.type;

        if (item.dicId) {
            cndField = pt.util.DicFieldUtil.createField({
                '@dicId': item.dicId,
            }, {
                minWidth: 200,
                name: 'cnd_' + item.id,
                labelWidth: 0,
                enableKeyEvents: true,
            });
        }
        else {
            if (type) {
                if (type == 'string') {
                    fieldClass = 'Ext.form.TextField';
                } else if (type == 'stringBig') {
                    fieldClass = 'Ext.form.TextField';
                } else if (type == 'date') {
                    fieldClass = 'Ext.form.Date';
                } else if (type == 'int') {
                    fieldClass = 'Ext.form.Number';
                } else if (type == 'long') {
                    fieldClass = 'Ext.form.Number';
                } else if (type == 'number') {
                    fieldClass = 'Ext.form.Number';
                }
            }

            cndField = Ext.create(fieldClass, {
                width: 200,
                name: 'cnd_' + item.id,
                labelWidth: 0,
                enableKeyEvents: true,
            })
        }
        cndField.on('keyup', this.onCndFieldKeyup, this);
        cndField.hide();
        return cndField;
    },
    createButtons: function () {
        var actions = this.actions;
        if (!actions || !(actions instanceof Array ) || actions.length == 0) {
            return;
        }
        var ret = []
        for (var i = 0, action; action = actions[i]; i++) {
            var cmd = action.ACTIONCMD;
            if (cmd) {
                cmd = 'do' + cmd.substr(0, 1).toLocaleUpperCase() + cmd.substr(1);
            }
            var btn = {
                text: action.ACTIONNAME,
                cmd: cmd,
                handler: this.doAction,
                scope: this,
            }
            ret.push(btn);
        }
        return ret;
    },
    doAction: function (btn) {
        var cmd = btn.cmd;
        if (!cmd) {
            return;
        }
        var fn = this[cmd];
        if (fn) {
            fn.apply(this, [btn]);
        }
    },

    doCreate: function (btn) {
        if (!this.middleModule['createform']) {
            var createClass = this.createFormClass;
            if (!createClass) {
                return;
            }
            var config = {
                op: 'create',
                schemaId: this.schemaId,
            };

            this.middleModule['createform'] = this.createFormModule(createClass, config);
        }

        this.middleModule['createform'].getWindow({
            title: btn.text
        }, false, {initData: {recordData: this.getCreateInitRecordData()}});
    },
    /**
     * 新建的初始化记录数据
     * @returns {{DR: string}}
     */
    getCreateInitRecordData: function () {
        return {DR: '0'}
    },
    /**
     * 根据isDr判断是逻辑删除还是物理删除，可以进行多项删除操作
     */
    doRemove: function (btn) {
        var records = this.getSelection();
        var removeCount = records.length;
        if (removeCount == 0) {
            return;
        }

        var me = this;
        var removeRecords = [];
        Ext.MessageBox.confirm('确认', '将要删除' + removeCount + "项?", function (btnName) {
            if (btnName == 'yes') {

                var pkeyField = this.pkeyField;
                for (var i = 0, record; record = records[i]; i++) {
                    var removeRecord = {};
                    removeRecord[pkeyField] = record.data[pkeyField];
                    removeRecords.push(removeRecord);
                }
                me.removeData2server(removeRecords);
            }
        }, this)


    },
    doUpdate: function (btn) {
        var records = this.getSelection();
        var removeCount = records.length;
        if (removeCount == 0) {
            return;
        }
        var updateRecordId = records[0].data[this.pkeyField];


        if (!this.middleModule['updateform']) {
            var createClass = this.updateFormClass;
            if (!createClass) {
                return;
            }
            var config = {
                op: 'update',
                schemaId: this.schemaId,
            };

            this.middleModule['updateform'] = this.createFormModule(createClass, config);
        }

        var recordData = {};
        recordData[this.pkeyField] = updateRecordId;

        this.middleModule['updateform'].getWindow({
            title: btn.text
        }, false, {initData: {recordData: this.getUpdateInitRecordData(recordData), pkeyField: this.pkeyField}});
    },

    getUpdateInitRecordData: function (recordData) {
        return recordData;
    },

    removeData2server: function (removeRecords) {
        this.panel.el.mask('正在处理数据...');
        var me = this;
        var promise = pt.util.Rmi.jsonRequest({
            serverid: this.serviceId,
            actionid: this.removeActionId,
            schemaId: this.schemaId,
            body: removeRecords,
            dr: !!me.isDr
        });
        promise.then(function (res) {
            me.panel.el.unmask('正在处理数据...');
            if (res.code === '01') {
                me.onRemoveSuccess(res.body);
                return;
            }
        }, function () {
            me.panel.el.unmask('正在处理数据...');
        });
    },

    getSelection: function () {
        return this.grid.getSelection();
    },
    createFormModule: function (createClass, config) {
        $import(createClass);
        var formModule = Ext.create(createClass, config);
        formModule.on('savesuccess', this.onSaveDataSuccess, this);
        return formModule;
    },
    freshList: function () {
        this.grid.store.reload();
    },
    onSaveDataSuccess: function () {
        this.freshList();
    },
    onRemoveSuccess: function () {
        EzToast.tip('删除成功');
        this.freshList();
    },
    getDefaultGridConfig: function () {
        return {
            inline: true,
            columnLines: true,
            rowLines: true,
            shadow: 'true',
            multiSelect: true,
            rowNumbers: true,
            selModel: {
                selType: 'checkboxmodel',
            },
            plugins: [],
            columns: [
                {xtype: 'rownumberer', text: '序号', width: 50, align: 'center', locked: true},
            ],
            viewConfig: {
                getRowClass: this.getRowClass,
            },
        }
    },
    getRowClass: function (record, rowIndex, p, ds) {
    },
    resetParam: function (params) {
        Ext.apply(this.grid.store.proxy.config.extraParams, params);
    },
    doCndQuery: function () {
        var showField = this.cndField.showField;
        var selFieldData = this.cndChoiceCombo.getSelectedRecord().data;
        var fieldType = selFieldData.fieldType;
        var fieldValue = selFieldData.value;

        var value = showField.getValue();
        if (!value) {
            this.resetParam({
                cnd: this.initCnd
            });
            this.freshList();
            return;
        }

        var op = 'eq';
        var cndValueType = 's';
        if (!fieldType || fieldType == 'string' || fieldType == 'stringBig') {
            op = 'like';
        }
        if (fieldType == 'int' || fieldType == 'long' || fieldType == 'number') {
            cndValueType = 'i';
        }
        var cnd = [op, ['$', fieldValue], [cndValueType, value]];
        if (this.initCnd && this.initCnd.length > 0) {
            cnd = ['and', cnd, this.initCnd];
        }
        this.resetParam({
            cnd: cnd
        });
        this.freshList();
    }
    ,
    onCndFieldKeyup: function (field, e) {
        if (e.keyCode === 13) {
            this.doCndQuery();
        }
    }
    ,
    doUpload: function () {
        $import('pt.comp.module.SimpleFile');
        var params = this.getUploadParams();
        var uploadModule = this.uploadModule = Ext.create('pt.comp.module.SimpleFile', {autoLoad: false});
        uploadModule.on({
            scope: this,
            fileuploadsuccess: this.onFileUploadSuccess
        })

        uploadModule.getWindow({}, false, params);
        uploadModule.loadFileData();
    }
    ,
    onFileUploadSuccess: function () {
    }
    ,
    /**
     * 必须有type和pkey返回
     * @returns {{uploadType: string, uploadPkey: string}}
     */
    getUploadParams: function () {
        var params = {
            APPTYPE: this.uploadType,
            APPPKEY: this.uploadPkey,
        };
        return params;
    }
    ,
    /**
     * 显示查看页面
     */
    doView: function (record) {
        if (!record) {
            return;
        }

        var viewRecordId = record.data[this.pkeyField];


        if (!this.middleModule['viewform']) {
            var viewClass = this.viewFormClass;
            if (!viewClass) {
                return;
            }
            var config = {
                op: 'read',
                schemaId: this.schemaId,
            };

            this.middleModule['viewform'] = this.createFormModule(viewClass, config);
        }

        var recordData = {};
        recordData[this.pkeyField] = viewRecordId;

        this.middleModule['viewform'].getWindow({
            title: '查看信息'
        }, false, {initData: {recordData: this.getUpdateInitRecordData(recordData), pkeyField: this.pkeyField}});
    }
});