$import('pt.comp.module.SimpleList');
$import('pt.comp.module.SimpleAsynTreePanel');
Ext.define('pt.comp.module.SimpleTreeList', {
    extend: 'pt.comp.module.SimpleList',
    constructor: function (config) {
        this.callParent(arguments);
    },
    init: function () {
        this.callParent(arguments);
    },
    initPanel: function () {
        var grid = this.callParent(arguments);
        var tree = this.tree = this.createTreePanel();
        var panel = this.panel = Ext.create('Ext.panel.Panel', {
            layout: 'border',
            defaults: {
                layout: 'fit',
                border: 0,
            },
            items: [{
                region: 'west',
                width: 200,
                items: tree,
            }, {
                region: 'center',
                items: grid
            }]
        });
        return panel;
    },
    createTreePanel: function () {
        var config = {
            dicId: this.dicId,
        };
        Ext.apply(config, this.treeConfig);
        var treePanel = Ext.create('pt.comp.module.SimpleAsynTreePanel', config).getPanel();
        treePanel.on('itemclick', function(a, b) {

        })
        return treePanel;
    }

})