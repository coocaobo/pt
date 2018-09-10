$import('pt.comp.module.SimpleModule');
$import('pt.comp.module.SimpleAsynTreePanel');
Ext.define('pt.comp.module.SimpleTreeSelector', {
    extend: 'pt.comp.module.SimpleModule',
    constructor: function (config) {
        this.callParent(arguments);
    },
    init: function () {
        this.callParent(arguments);
        this.initData = {};
        this.addItems = {};
        this.removeItems = {};

    },
    initPanel: function () {
        var tree1 = this.fromTree = Ext.create('pt.comp.module.SimpleAsynTreePanel', {
            dicId: 'base.Allmenu'
        }).initPanel();
        tree1.on({
            'loadalldata': this.OnLoadAllTreeData,
            scope: this
        });
        tree1.expandAll();
        var targetTree = this.targetTree = this.createTargetTree();
        var panel = Ext.create('Ext.panel.Panel', {
            defaultType: 'panel',
            layout: {
                type: 'hbox',
                pack: 'center',
                align: 'middle',
            },
            defaults: {
                border: true,
                layout: 'fit',
                height: '100%',
            },

            items: [{
                title: '可以选择数据',
                flex: 1,
                height: '100%',
                items: tree1,
            }, {
                width: 50,
                layout: {
                    type: 'vbox',
                    pack: 'center',
                    align: 'middle',
                },
                defaults: {
                    width: 45,
                    margin: '5px 0px',
                    scope: this,
                    xtype: 'button',
                },
                items: [{
                    text: '>>',
                    handler: this.doAddItem,
                }, {
                    text: '<<',
                    handler: this.doRemoveItem,
                }, {
                    text: '确定',
                    handler: this.doSave,
                    scope: this
                }]
            }, {
                title: '已经选择数据',
                flex: 1,
                items: targetTree,
            }]
        });
        return panel;
    },
    createTargetTree: function () {

        var store = Ext.create('Ext.data.TreeStore', {
            root: {
                text: '根节点',
                id: '$root',
                expanded: true,
            },
            folderSort: true,
        });

        var me = this;
        var treeConfig = {
            store: store,
            rootVisible: true,
            useArrows: true,
            dockedItems: [{
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
        };
        var tree = Ext.create('Ext.tree.Panel', treeConfig);
        return tree;
    },
    initSelectData: function (pData) {
        this.initData = {};
        for (var i = 0, item; item = pData[i]; i++) {
            this.initData[item] = true;
        }
        this.initDataLoadOver = true;

        this.initTreeOriginalData();

    },
    getSelectChangeData: function () {
        var copyInitData = Ext.clone(this.initData);
        var targetRoot = this.targetTree.getRootNode();
        var datas = [];
        this.getNodeAddChildrenData(targetRoot, datas);

        var add = [], remove = [];
        for (var i = 0, oneData; oneData = datas[i]; i++) {
            if (copyInitData[oneData]) {
                delete copyInitData[oneData];
            } else {
                add.push(oneData);
            }

        }
        for (var prop in copyInitData) {
            remove.push(prop);
        }
        return {
            add: add,
            remove: remove,
        }
    },
    getNodeAddChildrenData: function (node, datas) {
        if (!node.isRoot()) {
            var id = node.data.id;
            datas.push(id);
        }
        var children = node.childNodes;
        for (var i = 0, cNode; cNode = children[i]; i++) {
            this.getNodeAddChildrenData(cNode, datas);
        }
    },
    doSave: function () {
        var changeDatas = this.getSelectChangeData();
        if (this.fireEvent('dosave', changeDatas)) {

            var delData = changeDatas.remove;
            var addData = changeDatas.add;
            this.initData;
            for (var i = 0, removeRec; removeRec = delData[i]; i++) {
                if (this.initData[removeRec]) {
                    delete this.initData[removeRec];
                }
            }
            for (var i = 0, addRec; addRec = addData[i]; i++) {
                this.initData[addRec] = true;
            }
        }
        ;
    },
    expandAll: function () {
        this.targetTree.expandAll();
    },
    collapseAll: function () {
        this.targetTree.collapseAll();
    },
    OnLoadAllTreeData: function () {
        this.treeLoadOver = true;
        this.initTreeOriginalData();
    },
    initTreeOriginalData: function () {
        if (!this.initDataLoadOver || !this.treeLoadOver) {
            return;
        }
        var targetRoot = this.targetTree.getRootNode();
        targetRoot.removeAll(true);
        var root = this.fromTree.getRootNode();
        this.unSelectNode(root);
        this.initChildNode(root);

    },

    initChildNode: function (node) {
        if (node.isLeaf()) {
            return;
        }
        var children = node.childNodes;
        for (var i = 0, child; child = children[i]; i++) {
            var nodeId = child.data.id;
            if (this.initData[nodeId]) {
                this.selectNode(child);
            } else {
                this.unSelectNode(child);
            }
            this.initChildNode(child);
        }

    },
    selectNode: function (node) {
        // this.changeNodeColor(node);
        this.addTargetNode(node);
    },
    changeNodeColor: function (node) {
        if(node.isRoot()) {
            return;
        }
        if (!node.get('originText')) {
            node.set('originText', node.get('text'));
        }
        node.set('text', '<span style="color:red;">[' + node.get('originText') + ']</span>');
        node.set('ezDis', true);
    },
    selectNodeAndChildren: function (node) {
        this.selectNode(node);

        var children = node.childNodes;
        for (var i = 0, cNode; cNode = children[i]; i++) {
            this.selectNodeAndChildren(cNode);
        }

    },
    unSelectNode: function (node) {
        if (!node.get('originText')) {
            node.set('originText', node.get('text'));
        }
        node.set('text', node.get('originText'));
        node.set('ezDis', false);
        this.removeTargetNode();
    },
    unSelectNodeById: function (id) {
        var fromRoot = this.fromTree.getRootNode();
        var fromNode = fromRoot.findChild('id', id, true);
        if (fromNode) {
            this.unSelectNode(fromNode);
        }
    },
    unSelectNodeAndChildren: function (node) {
        var nodeId = node.data.id;
        this.unSelectNodeById(nodeId);

        var children = node.childNodes;
        for (var i = 0, cNode; cNode = children[i]; i++) {
            this.unSelectNodeAndChildren(cNode);
        }

    },

    addTargetNode: function (node) {
        this.changeNodeColor(node);
        var fromParentNode = node.parentNode;
        if (!fromParentNode) {
            return;
        }
        var parentId = fromParentNode.data.id;

        var targetRoot = this.targetTree.getRootNode();

        var pNode = parentId == '$root' ? targetRoot : targetRoot.findChild('id', parentId, true);
        if (!pNode) {
            pNode = this.addTargetNode(fromParentNode);
        }

        var newNodeId = node.data.id;
        var newNode = targetRoot.findChild('id', newNodeId, true);
        if (newNode) {
            return newNode;
        }
        var nodeParam = {
            id: node.data.id,
            text: node.data.originText,
            leaf: node.data.leaf,
            iconCls: node.data.iconCls,
        }
        newNode = pNode.appendChild(nodeParam);
        newNode.expand();
        return newNode;
    },
    removeTargetNode: function () {

    },
    doAddItem: function () {
        var selNodes = this.fromTree.getSelection();
        for (var i = 0, selNode; selNode = selNodes[i]; i++) {
            this.selectNodeAndChildren(selNode);
        }
    },
    doRemoveItem: function () {
        var selNodes = this.targetTree.getSelection();

        for (var i = 0, selNode; selNode = selNodes[i]; i++) {
            this.unSelectNodeAndChildren(selNode);
            if (selNode.isRoot()) {
                selNode.removeAll();
            } else {
                if (selNode.parentNode) {
                    selNode.parentNode.removeChild(selNode)
                }
            }
        }

    }

});