$import('pt.comp.module.SimpleList');
Ext.define('yw.wdjz.ZBList', {
    extend: 'pt.comp.module.SimpleList',
    constructor: function (config) {
        this.callParent(arguments);
    },
    init: function () {
        this.initCnd = ['eq', ['$', 'DR'], ['s', '0']];
        this.callParent(arguments);
    },

})