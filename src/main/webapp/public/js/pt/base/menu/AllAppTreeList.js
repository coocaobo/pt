$import('pt.comp.module.SimpleTreeList');
Ext.define('pt.base.menu.AllAppTreeList', {
    extend: 'pt.comp.module.SimpleTreeList',
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
        this.listPane = {};
    },
    /**
     *  动态根据左边菜单的选择切换不同的列表
     *  所有的列表有 pt.base.menu.AppList; pt.base.menu.CatalogList; pt.base.menu.MenuList;
      */

    initPanel: function () {
        // var grid = this.callParent(arguments);

        var defaultPanel =  this.createDefaultList();
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
                items: defaultPanel
            }]
        });
        return panel;
    },

    createDefaultList: function(){
        return this.createMenuList();
    },
    createAppList:function() {

        if(this.listPane.appModule) {
            return this.listPane.appModule.getPanel();
        }

        var appClasspath='pt.base.menu.AppList';
        $import(appClasspath);
        var appModule = Ext.create(appClasspath, {
            schemaId: 'base.App',
        });

        appModule.initPanel();

        this.listPane.appModule = appModule;
        return appModule.getPanel();

    },

    createCatalogList:function() {

        if(this.listPane.catalogModule) {
            return this.listPane.catalogModule.getPanel();
        }


        var catalogClasspath='pt.base.menu.CatalogList';
        $import(catalogClasspath);
        var catalogModule = Ext.create(catalogClasspath, {
            schemaId: 'base.Catalog',
        });

        catalogModule.initPanel();

        this.listPane.catalogModule = catalogModule;
        return catalogModule.getPanel();

    },

    createMenuList:function() {
        if(this.listPane.menuModule) {
            return this.listPane.menuModule.getPanel();
        }

        var menuClasspath='pt.base.menu.MenuList';
        $import(menuClasspath);
        var menuModule = Ext.create(menuClasspath, {
            schemaId: 'base.Menu',
        });
        menuModule.initPanel();

        this.listPane.menuModule = menuModule;
        return menuModule.getPanel();

    },


})