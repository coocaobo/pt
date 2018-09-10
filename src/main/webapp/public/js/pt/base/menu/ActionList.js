$import('pt.comp.module.SimpleList');
Ext.define('pt.base.menu.ActionList', {
    extend: 'pt.comp.module.SimpleList',
    constructor: function (config) {
        this.callParent(arguments);
    },
    init: function () {
        this.initCnd = ['eq', ['$', 'DR'], ['s', '0']];
        this.callParent(arguments);
    },
    initPanel: function () {
        var panel = this.callParent(arguments);
        return panel;
    }

})