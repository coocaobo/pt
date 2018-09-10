$import('pt.comp.module.SimpleList');
$import('pt.base.permission.BaseUserRoleList');
Ext.define('pt.base.permission.BaseUserList', {
    extend: 'pt.comp.module.SimpleList',
    constructor: function (config) {
        this.callParent(arguments);
    },
    init: function () {
        this.updateFormClass = 'pt.base.permission.BaseUserForm';
        this.createFormClass = 'pt.base.permission.BaseUserForm';
        this.callParent(arguments);
    },
    initPanel: function () {
        var gridPanel = this.callParent(arguments);
        gridPanel.on({
            rowdblclick: this.onGridDblclick,
            scope: this,
        });

        var userRoleList = this.createUserRoleList();
        var panel = this.panel = Ext.create('Ext.panel.Panel', {
            layout: 'hbox',
            defaults: {
                layout: 'fit',
                border: 0,
                height: '100%',
            },
            items: [{
                flex: 1,
                items: gridPanel,
            }, {
                flex: 1,
                items: userRoleList,
            }]
        });
        return panel;
    },
    onGridDblclick: function (grid, record) {
        var logonId = record.data.LOGONID;
        this.userRoleModule.reloadData(logonId)
    },
    createUserRoleList: function () {
        var userRoleModule = this.userRoleModule = Ext.create('pt.base.permission.BaseUserRoleList', {});
        var panel = userRoleModule.initPanel();
        return panel;
    },


});