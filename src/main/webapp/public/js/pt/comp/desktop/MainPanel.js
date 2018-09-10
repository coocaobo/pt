$import('pt.comp.module.SimpleModule');
$import('pt.comp.desktop.LogOnRequest');

Ext.define('pt.comp.desktop.MainPanel', {
    extend: 'pt.comp.module.SimpleModule',
    constructor: function (config) {
        this.bgPanel = null;
        this.logonPanel = null;
        this.mainPanel = null;
        this.callParent(arguments);
    },
    init: function () {
        this.callParent(arguments);
        this.initPanel();
        Ext.on('resize', this.onResize, this);
        this.addEvent();

    },
    onResize: function (width, height) {
        this.bgPanel.setWidth(width);
        this.bgPanel.setHeight(height);
    },
    addEvent: function () {
    },
    initPanel: function (config) {
        var indexBgDiv = Ext.fly('body-index-bg');
        var height = indexBgDiv.getHeight();
        var width = indexBgDiv.getWidth();

        var bgPanel = new Ext.panel.Panel({
            renderTo: Ext.getBody(),
            height: height,
            bodyStyle: 'border-style: none;border-width: 0px;',
            width: width,
            layout: 'fit',
            border: false,
        });
        this.bgPanel = bgPanel;
        this.loadLoginOrMain();
        Window.EzPanel = bgPanel;
        return bgPanel;
    },

    loadLoginOrMain: function () {
        var me = this;
        if(pt.Cookie.isLogoff()) {
            me.change2LogonPanel();
            return;
        }
        var promise = pt.comp.desktop.LogOnRequest.requestApp();
        promise.then(function (res) {
            if (res.code === '01') {
                me.change2MainPanel();
                return;
            }
            me.change2LogonPanel();

        }, function (res) {
            me.change2LogonPanel();
        });
    },
    change2MainPanel: function () {
        var panel = this.loadMainPanel();
        this.bgPanel.removeAll(false);
        this.bgPanel.add(panel);
        EzToast.tip('登录成功');
    },
    change2LogonPanel: function () {
        var panel = this.loadLogOnPanel();
        this.bgPanel.removeAll(false);
        this.bgPanel.add(panel);
        EzToast.tip('请先登录');
    },
    onDdd: function () {
        this.change2LogonPanel();
    },
    loadLogOnPanel: function () {
        if (!this.logonPanel) {
            var logonForm = this.createLogonPanel();
            this.logonPanel = logonForm.initPanel();
            logonForm.addListener('change2MainPanel', function () {
                this.change2MainPanel();
            }, this);
        }
        return this.logonPanel;
    },
    createLogonPanel: function () {
        $import('pt.comp.desktop.LogOnForm');
        var logonForm = new pt.comp.desktop.LogOnForm()
        return logonForm;
    },

    loadMainPanel: function () {
        if (!this.mainPanel) {
            var mainPanel = this.createMainPanel();
            this.mainPanel = mainPanel.initPanel();
        }
        return this.mainPanel;
    },
    createMainPanel: function () {
        $import('pt.comp.desktop.DesktopPanel');
        var panel = new pt.comp.desktop.DesktopPanel()
        return panel;
    },

});


