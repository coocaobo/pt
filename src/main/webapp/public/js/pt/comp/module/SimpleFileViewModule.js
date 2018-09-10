$import('pt.comp.module.SimpleModule');
Ext.define('pt.comp.module.SimpleFileViewModule', {
    extend: 'pt.comp.module.SimpleModule',
    constructor: function (config) {
        this.htmlId = Ext.id(null, 'ez-img-view')
        this.callParent(arguments);
    },
    initPanel: function () {
        if(this.panel) {
            return this.panel;
        }
        var panel = this.panel =  Ext.create('Ext.panel.Panel', {
            html: '<div ><img id="'+this.htmlId+'" src="222" ></div>'
        });
        return panel;
    },
    showImg: function(url) {
        if(!this.panel) {
            return;
        }

        var el = Ext.fly(this.htmlId);
        el.dom.src = url;

        this.getWindow().setPosition(9999999,0)
        var img = new Image();
        var me = this;
        img.onload=function(){
            var width =  img.width;
            var height = img.height;
            me.panel.setWidth(width);
            me.panel.setHeight(height);
            me.getWindow().center();
        };
        img.src= url;
    }
})
;