$import('pt.comp.module.SimpleList');
Ext.define('pt.base.menu.CatalogList', {
    extend: 'pt.comp.module.SimpleList',
    constructor: function (config) {
        this.callParent(arguments);
    },
    init: function () {
        this.initCnd = ['eq', ['$', 'DR'], ['s', '0']];
        this.treeConfig = {
            rootText:  '功能菜单',
            dicId: 'base.Allmenu'
        }
        this.callParent(arguments);
    },
    initPanel: function () {
        var panel = this.callParent(arguments);
        return panel;
    }

})