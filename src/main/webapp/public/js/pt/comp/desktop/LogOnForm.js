$import('pt.comp.module.SimpleForm');
$import('pt.comp.desktop.LogOnRequest');
Ext.define('pt.comp.desktop.LogOnForm', {
    extend: 'pt.comp.module.SimpleForm',
    constructor: function (config) {
        this.defaultErrorMsg = '请填写用户和密码';
        this.errorMsg = this.defaultErrorMsg;
        this.roleField = null;
        this.pwdCache = null;
        this.callParent(arguments);
    },
    init: function () {

    },
    initPanel: function () {

        var bgPanel = new Ext.panel.Panel({
            // bodyPadding: '250 0 0 500',
            layout: {
                type: 'hbox',
                pack: 'center',
                align: 'middle',
            },
            width: '100%',
            bodyStyle: {
                'background-color': '#326696',
            },
            border: false,
            frame: false,
            resizable: false,
            autoSize: true,
            items: [],
            listeners: {
                boxready : function() {
                    var me  = this;
                    me.onBoxRender(bgPanel)
                },
                scope: this,
            }
        });

        this.bgPanel = bgPanel;
        return bgPanel;
    },
    addLogonForm: function() {
        var logOnForm = this.createlogOnForm();
        this.logOnForm = logOnForm;
        this.disablelogOnBtn();
        this.bgPanel.add(logOnForm);
    },
    onBoxRender: function(bgPanel) {
        $import('lib.cloud.Detector');
        $import('lib.cloud.three_min');
        $import('lib.cloud.Draw');
        Ext.create('lib.cloud.Draw',{
            module: this,
            panel: bgPanel,
            autoDraw: true,
            callback: this.addLogonForm,
            scope: this,
        })
        return;

    },
    createlogOnForm: function () {
        var logonTitle = this.generalTitle();
        var roleField = this.generalRolefield();
        var logOnBtn = this.generallogOnBtn();
        var logOnForm = new Ext.form.Panel({
            width: 310,
            height: 300,
            autoWidth: true,
            autoHeight: true,
            title: logonTitle,
            defaultType: 'textfield',
            bodyPadding: '10 0 0 35',
            bodyStyle: {
                'z-index': 1,
            },
            frame: true,
            border: false,
            buttonAlign: 'center',
            defaults: {
                labelWidth: 60,
                labelStyle: 'font-weight:bold; font-size:16px; color:#326696',
                margin: '20 0 0 0'
            },
            items: [{
                fieldLabel: '用&nbsp;户',
                name: 'uid',
                enableKeyEvents: true,
                allowBlank: false,
                listeners: {
                    scope: this,
                    keyup: this.onUidKeyup,
                    render: this.onUidRender
                }
            }, {
                fieldLabel: '密&nbsp;码',
                name: 'pwd',
                inputType: 'password',
                allowBlank: false,
                enableKeyEvents: true,
                defaultListenerScope: false,
                listeners: {
                    scope: this,
                    keyup: this.onPwdKeyup,
                    blur: this.onPwdBlur,
                }
            }, roleField, {
                fieldLabel: '',
                xtype: 'viewtextfield',
                name: 'msg',
                value: '',
                margin: '10 0 -20 10',
                fieldStyle: 'color: red;',
                width: 210
            }, logOnBtn],
        });
        logOnForm.roleField = roleField;
        logOnForm.logOnBtn = logOnBtn;

        return logOnForm;
    },
    onUidRender: function (field) {
        field.focus();
    },
    onUidKeyup: function (field, e, eOpts) {
        if (e.keyCode === 13) {
            this.logOnForm.getForm().findField('pwd').focus();
        }
    },
    onPwdKeyup: function (field, e, eOpts) {
        if (e.keyCode === 13) {
            this.logOnForm.roleField.focus();
        }
    },
    onRoleKeyup: function (field, e, eOpts) {
        if (e.keyCode === 13) {
            this.doLogon();
            console.dir('role');
        }
    },
    onPwdBlur: function () {
        var form = this.logOnForm.getForm();
        if (form.isValid()) {
            var pwdField = form.findField('pwd');
            this.pwdCache = pwdField.getValue();
            pwdField.setValue('01234567890');
            this.loadRole();
            return;
        }

        var uidField = form.findField('uid');
        if (!uidField.isValid()) {
            uidField.focus();
            return;
        }
    },
    loadRole: function () {
        var me = this;
        var form = this.logOnForm.getForm();
        if (!form.isValid()) {
            return;
        }
        this.logOnForm.getEl().mask('正在校验...');
        this.changeErrorTip("正在校验...");
        var formValues = form.getValues()
        var promise = pt.util.Rmi.formRequest({
            uid: formValues.uid,
            pwd: this.pwdCache,
        }, {
            notTip: true
        }, {
            url: 'logon.logon'
        });
        promise.then(function (res) {
            me.logOnForm.getEl().unmask();
            if (res.code !== '01') {
                me.resetRoleField();
                if (res.code === '0204002') { // 没有用户
                    form.findField('uid').focus();
                } else if (res.code === '0204003') { // 密码不正确
                    form.findField('pwd').focus();
                }
                me.changeErrorTip(res.msg);
                return;
            }
            me.resetRoleField(res.body);
            me.changeErrorTip('请选择角色进行登录');

        }, function (res) {
            me.logOnForm.getEl().unmask();
            EzToast.tip( res.msg);
            me.changeErrorTip(res.msg);
            me.resetRoleField();
        });
    },
    changeErrorTip: function(msg) {
        var form = this.logOnForm.getForm();
        var msgField = form.findField('msg');
        msgField.setValue(msg);
    },
    resetRoleField: function (body) {
        var store = this.clearRoleField();
        if (!body) {
            return;
        }
        var roleDatas = [];
        for (var i = 0; i < body.length; i++) {
            roleDatas.push({
                vf: body[i].roleId,
                df: body[i].roleName
            })
        }
        store.loadData(roleDatas, false);
        if (roleDatas.length > 0) {
            var field = this.logOnForm.roleField;
            field.setValue(roleDatas[0].vf);
        }
        // this.bgPanel.fireEvent('afterchange');
    },
    clearRoleField: function () {
        var field = this.logOnForm.roleField;
        field.setValue();
        var store = field.store;
        store.removeAll();
        return store;
    },
    generalTitle: function () {
        var title = '<span class="logon-title">用户登录</span>'
        // + '<span class="logon-title logon-title-error">'+this.errorMsg+'</span>';
        return title;
    },
    createRoleStore: function () {
        var store = new Ext.data.JsonStore({
            fields: [{name: 'vf', type: 'string'}, {name: 'df', type: 'string'}],
            data: []
        });
        return store;
    },
    generalRolefield: function () {
        var store = this.createRoleStore();
        var roleCombo = new Ext.form.ComboBox({
            fieldLabel: '角&nbsp;色',
            name: 'roleId',
            displayField: 'df',
            valueField: 'vf',
            store: store,
            enableKeyEvents: true,
            editable: false,
        });
        roleCombo.on({
            change: this.onRoleComboSelect,
            keyup: this.onRoleKeyup,
            scope: this
        });
        return roleCombo;
    },
    onRoleComboSelect: function (comb, newValue, oldValue, eOpts) {
        if (newValue) {
            this.enablelogOnBtn();
        } else {
            this.disablelogOnBtn();
        }
    },
    generallogOnBtn: function () {
        var btn = new Ext.Button({
            text: '<span class="logon-button">登&nbsp;&nbsp;&nbsp;&nbsp;录</span>',
            disable: true,
            width: 200,
            height: 40,
            margin: '30 0 0 20',
            enableKeyEvents: true,
            handler: 'doLogon',
            scope: this,
            style: 'background: #326696;'
        })
        return btn;
    },
    doLogon: function () {
        if (this.isLogoning) {
            return;
        }
        this.isLogoning = true;
        var roleId = this.logOnForm.roleField.getValue();
        if (roleId) {
            this.loadApp(roleId);
        } else {
            this.isLogoning = false;
        }
    },
    loadApp: function (roleId) {
        var me = this;
        me.logOnForm.getEl().mask('正在加载用户数据...');
        var promise = pt.comp.desktop.LogOnRequest.requestApp(roleId);
        promise.then(function (res) {
            me.isLogoning = false;
            me.logOnForm.getEl().unmask();
            me.changeErrorTip(res.msg);
            if (res.code === '01') {
                Ext.util.Cookies.set('logoff', 'yes');
                me.changeErrorTip('正在跳转...');
                pt.Cookie.remarkUnLogoff();
                me.fireEvent('change2MainPanel');
                return;
            }

        }, function (res) {
            me.isLogoning = false;
            me.logOnForm.getEl().unmask();
            me.changeErrorTip(res.msg);
            me.resetRoleField();
        });


    },
    disablelogOnBtn: function () {
        var btn = this.logOnForm.logOnBtn;
        btn.disabled = true;
    },
    enablelogOnBtn: function () {
        var btn = this.logOnForm.logOnBtn;
        btn.disabled = false;
    }
});