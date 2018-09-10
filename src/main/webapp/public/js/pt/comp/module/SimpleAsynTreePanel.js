$import('pt.comp.module.SimpleModule');
Ext.define('pt.comp.module.SimpleAsynTreePanel', {
    extend: 'pt.comp.module.SimpleModule',
    constructor: function (config) {
        this.callParent(arguments);
    },
    init: function () {
        Ext.applyIf(this, {
            serverid: 'base.dicService',
            actionid: 'loadItem',
            slice: '1',
            rootText: '根节点',
            rootCls: '',
        })
        this.callParent(arguments);
        this.initPanel();
    },
    initPanel: function () {
        if (this.tree) {
            return this.tree;
        }
        if (!this.dicId) {
            console.error('have null dicId');
            return;
        }
        var treePanel = this.createTreePanel();
        this.tree = treePanel;
        return treePanel;
    },
    createTreePanel: function () {


        var requestData = {
            serverid: this.serverid,
            actionid: this.actionid,
            slice: this.slice,
            dicId: this.dicId
        };

        var store = Ext.create('Ext.data.TreeStore', {
            nodeParam: 'parentId',
            proxy: {
                type: 'ajax',
                url: 'json',
                actionMethods: {
                    read: 'POST',
                },
                paramsAsJson: true,
                extraParams: requestData,
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                },
                reader: {
                    type: 'json',
                    rootProperty: 'body.items',
                },
            },
            root: {
                text: this.rootText,
                id: '$root',
                expanded: true,
                iconCls: this.rootCls,

            },
            folderSort: true,
            sorters: [{
                property: 'text',
                direction: 'ASC'
            }]
        });

        var me = this;

        var dockedItems;
        if (!this.disableDock) {
            dockedItems = [{
                xtype: 'toolbar',
                items: [{
                    text: '展开',
                    handler: function () {
                        me.expandAll();
                    }
                }, {
                    text: '闭合',
                    handler: function () {
                        me.collapseAll();
                    }
                }]
            }]
        }

        var treeConfig = {
            store: store,
            rootVisible: true,
            useArrows: true,
            dockedItems: dockedItems,
            unLoadNodeNum: 1,
            listeners: {
                scope: this,
                load: this.afterLoadData,

            },
            scope: this,

        };
        Ext.apply(treeConfig, this.treeConfig);

        var tree = Ext.create('Ext.tree.Panel', treeConfig);
        return tree;
    },
    expandAll: function () {
        this.tree.expandAll();
    },
    collapseAll: function () {
        this.tree.collapseAll();
    },
    afterLoadData: function(store, records){
        var num = store.ownerTree.unLoadNodeNum -1;
        for(var i = 0, rec; rec = records[i]; i ++) {
            if(rec.data.leaf === false) {
                num ++;
            }
        }
        store.ownerTree.unLoadNodeNum = num;
        if(num == 0) {
            store.ownerTree.fireEvent('loadalldata');
        }
    }


})