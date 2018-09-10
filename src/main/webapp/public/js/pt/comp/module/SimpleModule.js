Ext.define('pt.comp.module.SimpleModule', {
    extend: 'Ext.mixin.Observable',
    constructor: function (config) {
        this.callParent();
        Ext.apply(this, config);
        this.init();
    },
    init: function () {
        // this.id = new Date().getTime();
    },
    initPanel: function () {
        var panel = Ext.create('Ext.panel.Panel', {
            html: 'simpleModule panel'
        });
        return panel;
    },
    destroy: function () {
        console.log('destroy ' + this.id);
    },
    getWindow: function (config, notShow, inits) {
        Ext.apply(this, inits);
        if (!this.panelWin) {
            var panel = this.initPanel();
            var winConfig = {
                layout: {
                    type: 'fit',
                },
                items: panel,
                modal: true,
                closeAction: 'method-hide',
                listeners: {
                    scope: this,
                    beforeshow: this.onWinBeforShow,
                    beforeclose: this.onWinBeforClose,
                }
            }
            Ext.apply(winConfig, config);
            this.panelWin = Ext.create('Ext.window.Window', winConfig);
        } else {
        }
        if (this.panelWin) {
            if (notShow) {
                this.panelWin.hide();
            } else {
                this.panelWin.show();
            }
            return this.panelWin;
        }

    },
    getPanel: function () {
        return this.panel;
    },
    onWinBeforClose: function () {

    },
    onWinBeforShow: function () {

    }
});