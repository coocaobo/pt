$import('pt.comp.module.SimpleList');
Ext.define('pt.base.permission.BaseRoleList', {
    extend: 'pt.comp.module.SimpleList',
    constructor: function (config) {
        this.callParent(arguments);
    },
    init: function () {
        this.initCnd = ['eq', ['$', 'DR'], ['s', '0']];
        this.callParent(arguments);
    },
    initPanel: function () {
        var gridPanel = this.callParent(arguments);
        gridPanel.on({
            rowdblclick: this.onGridDblclick,
            scope: this,
        })

        var selectTreePanel = this.createSelectTreePanel();
        var panel = this.panel = Ext.create('Ext.panel.Panel', {
            layout: 'border',
            defaults: {
                layout: 'fit',
                border: 0,
            },
            items: [{
                region: 'east',
                width: 450,
                items: selectTreePanel,
            }, {
                region: 'center',
                items: gridPanel
            }]
        });
        return panel;
    },
    createSelectTreePanel: function () {

        $import('pt.comp.module.SimpleTreeSelector');

        var treePanelModule = this.treePanelModule = Ext.create('pt.comp.module.SimpleTreeSelector', {});
        treePanelModule.on('dosave', this.onTreeModuleSave, this);

        return treePanelModule.initPanel();
    },
    onTreeModuleSave: function (datas) {
        if(!this.treePanelModule.roleId) {
            EzToast.tip('请先选择需要修改的角色', '提示');
            return;
        }
        if(!datas || !datas.add || !datas.remove ||  (datas.add.length == 0 &&  datas.remove.length == 0) ) {
            EzToast.tip('权限没有改变', '提示');
            return ;
        }
        this.panel.el.mask("正在提交数据...");
        var me = this;

        var params = {
            serverid: 'base.roleService',
            actionid: 'saveRolePermission',
            body: datas,
            roleId: me.treePanelModule.roleId,
            schemaId: 'base.RolePermission',
        };

        var rmiRequest = pt.util.Rmi.synJsonRequest(params);
        if (rmiRequest.status === 200) {
            this.panel.el.unmask();
            var result = Ext.decode(rmiRequest.responseText);
            if (result.code == '01') {
                EzToast.tip('保存成功', '提示');
                return true;
            }
            return false;
        }
        this.panel.el.unmask();
        return false;
    },
    onGridDblclick: function (grid, record, el, index) {
        var roleId = record.data.ROLEID;
        var me = this;
        var promise = pt.util.Rmi.jsonRequest({
            serverid: 'base.simpleService',
            actionid: 'querySingleList',
            schemaId: 'base.RolePermission',
            limit: -1,
            cnd: ['eq', ['$', 'ROLEID'], ['i', roleId]]
        })
        promise.then(function (res) {
            if (!res.code == '01') {
                return;
            }
            var list = res.body.list || [];
            var params = [];

            for (var i = 0, rec; rec = list[i]; i++) {
                var type = rec.APPTYPE;
                var id = rec.APPID;

                if (type == '01') {
                    id = 'a_' + id;
                } else if (type == '02') {
                    id = 'c_' + id;
                } else if (type == '03') {
                    id = 'm_' + id;
                } else if (type == '04') {
                    id = 'b_' + id;
                }
                params.push(id);
            }
            me.treePanelModule.initSelectData(params);
            me.treePanelModule.roleId = roleId;
        });
    }
});