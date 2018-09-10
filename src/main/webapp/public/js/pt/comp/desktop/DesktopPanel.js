$import('pt.comp.module.SimpleModule');
Ext.define('pt.comp.desktop.DesktopPanel', {
    extend: 'pt.comp.module.SimpleModule',
    constructor: function (config) {
        this.cachePanel_prefix = 'panelId-';
        this.callParent(arguments);
    },
    initPanel: function () {
        var panel = Ext.create('Ext.panel.Panel', {
            layout: 'border',
            bodyStyle: 'border-style: none;border-width: 0px;',
        });
        var items = [];
        if (!this.isHideNorth()) {
            var northPanel = this.createNorthPanel();
            items.push(northPanel);
        }
        if (!this.isHideSouth()) {
            var southPanel = this.createSouthPanel();
            items.push(southPanel);
        }
        var westPanel = this.westPanel = this.createWestPanel();
        westPanel.hide();
        items.push(westPanel);
        var mainTabPanel = this.mainTabPanel = this.createCenterPanel();
        items.push(mainTabPanel);
        panel.add(items);
        this.panel = panel;
        // ObjUtil.watermark();
        return panel;
    },
    isHideNorth: function () {
        var isHide = ObjUtil.getAppProp('sysInfo.organ.app.mainPanel.hide.north');
        return isHide == 'true';
    },
    isHideSouth: function () {
        var isHide = ObjUtil.getAppProp('sysInfo.organ.app.mainPanel.hide.south');
        return isHide == 'true';
    },
    createNorthPanel: function () {
        var html = '<div></div>';
        var northPanel = Ext.create('Ext.panel.Panel', {
            region: 'north',
            height: 71,
            bodyStyle: 'border-style: none;border-width: 0px;',
            bodyBorder: false,
            split: false,
            layout: 'fit',
            frame: false,
            html: html
        });

        var me = this;
        var promise = pt.util.Rmi.xmlRequest({}, {}, {url: 'public/view/desktop-top.html'});
        promise.then(function (res) {
            northPanel.update(res, null, function () {
                me.topHtmlUpdate(northPanel);
            }, me);
        }, function (response, opts) {

        })
        return northPanel;
    },
    topHtmlUpdate: function (panel) {
        this.addAnimalLogo();
        var companyName = Ext.fly('desktop-top-company-name');
        if (companyName) {
            var name = ObjUtil.getAppProp('sysInfo.organ.orgName');
            companyName.setText(name);
        }
        var appName = Ext.fly('desktop-top-app-name');
        if (appName) {
            var name = ObjUtil.getAppProp('sysInfo.organ.app.appName');
            appName.setText(name);
        }

        var userName = Ext.fly('desktop-top-company-user-name');
        if (userName) {
            var name = ObjUtil.getAppProp('empInfo.EMPNAME');
            userName.setText(name);
        }


        var roleName = Ext.fly('desktop-top-company-user-rolename');
        if (roleName) {
            var roleId = ObjUtil.getAppProp('logonInfo.roleId');
            var roleList = ObjUtil.getAppProp('logonInfo.roleList');
            if (roleId && roleList) {
                var name = '';
                for (var i = 0, roleInfo; roleInfo = roleList[i]; i++) {
                    if (''+roleInfo.roleId === roleId) {
                        name = roleInfo.roleName;
                        break;
                    }
                }
                roleName.setText(name);
            }

        }

        var appContainer = Ext.fly('desktop-top-company-menu');
        if (appContainer) {
            this.initAppTabs(appContainer);
        }
        var settingContainer = Ext.fly('desktop-top-company-quickOption-setting');
        if (settingContainer) {
            var setting = Ext.get(settingContainer);
            setting.addListener('click', this.onSettingClick, this);
        }

        var logoffContainer = Ext.fly('desktop-top-company-quickOption-logoff');
        if (logoffContainer) {
            var logoff = Ext.get(settingContainer);
            logoff.addListener('click', this.onLogoffClick, this);
        }

    },
    addAnimalLogo: function() {
        $import('lib.cloud.three_min');
    },
    onSettingClick: function () {
    },
    onLogoffClick: function () {

        Window.EzPanel.getEl().mask('正在登出...');
        var promise = pt.util.Rmi.formRequest({}, {
            notTip: true
        }, {
            url: 'logoff.logon'
        });
        promise.then(function (res) {
            if (res.code === '01') {
                pt.Cookie.remarkLogoff();
                window.location.href = '';
                return;
            }
            Window.EzPanel.getEl().unmask();
        }, function () {
            Window.EzPanel.getEl().unmask();
        });
    },
    initAppTabs: function (appConainer) {

        var roleId = ObjUtil.getAppProp('logonInfo.roleId');
        var appInfo = ObjUtil.getAppProp('appInfo');
        if (!roleId || !appInfo || !appInfo[roleId]) {
            return;
        }
        var apps = appInfo[roleId];
        var tpl = new Ext.XTemplate(
            '<tpl for=".">',
            '<div class="desktop-top-menu-item">{appDetail.APPNAME}</div>',
            '</tpl>'
        );

        var store = new Ext.data.Store({});
        store.loadData(apps);

        Ext.create('Ext.view.View', {
            store: store,
            tpl: tpl,
            selectedItemCls: 'desktop-top-menu-item-select',
            itemSelector: 'div.desktop-top-menu-item',
            renderTo: appConainer,
            listeners: {
                scope: this,
                select: this.onAppSelect
            }
        });

    },
    onAppSelect: function (view, record, index, eOpts) {
        this.updateCatlog(record.data);
    },
    createWestPanel: function () {
        var westPanel = Ext.create('Ext.panel.Panel', {
            title: '<span class="ez-menu-title">功能</span>',
            region: 'west',
            width: 200,
            scrollable: true,
            collapsible: true,   // make collapsible
            collapsed: true,
            html: '<div id="desktop-west-menu"></div>'
        });
        westPanel.on({
            afterrender: this.onMenuAfterrender,
            scope: this,
        })
        return westPanel;
    },
    setMenuTitle: function (title) {
        if (this.westPanel) {
            this.westPanel.setTitle('<span class="ez-menu-title">' + title + '</span>');
        }
    },
    onMenuAfterrender: function () {
        var menuContainer = Ext.fly('desktop-west-menu');

        var tpl = new Ext.XTemplate(
            '<div class="ez-menu-wrapper">',
            '<div class="ez-menu">',
            '<tpl for=".">',
            '<div class="ez-menu-leve1">',
            '<div class="ez-menu-leve1-text ez-menu-icon ez-icon-{CATICON}">{CATNAME} <span class="ez-menu-leve1-text-Symbol"></span></div>',
            '<div class="ez-menu-leve1-content" id="ez-menu-level1-{CATID}">',
            '</div>',
            '</div>',
            '</tpl>',
            '</div>',
            '</div>'
        );

        var store = new Ext.data.Store({});
        this.menuStore = store;

        Ext.create('Ext.view.View', {
            store: store,
            tpl: tpl,
            selectedItemCls: 'ez-menu-catlog-selected',
            itemSelector: 'div.ez-menu-leve1',
            renderTo: menuContainer,
            listeners: {
                scope: this,
                select: this.onCatlogSelect,
            }
        });

    },
    onCatlogSelect: function (view, record, index, eOpts) {
        if (record.renderMenu) {
            return;
        }
        var menus = record.data.children;
        var catlogContainer = Ext.fly('ez-menu-level1-' + record.data.CATID);
        var tpl = new Ext.XTemplate(
            '<tpl for=".">',
            '<div class="ez-menu-leve2">',
            '<div class="ez-menu-leve2-text ez-menu-icon ez-icon-{MENUICON}">{MENUNAME}<span class="ez-menu-leve2-text-Symbol"></span></div>',
            '</div>',
            '</tpl>'
        );

        var store = new Ext.data.Store({});
        if (menus) {
            store.loadData(menus);
        }

        Ext.create('Ext.view.View', {
            store: store,
            tpl: tpl,
            selectedItemCls: 'ez-menu-menu-selected',
            itemSelector: 'div.ez-menu-leve2',
            renderTo: catlogContainer,
            listeners: {
                scope: this,
                itemclick: this.onMenuSelect,
            }
        });
        record.renderMenu = true;
    },
    onMenuSelect: function (view, record, index, eOpts) {
        this.openMenu(record.data);
    },
    updateCatlog: function (catlogData) {
        if (!this.menuStore) {
            return;
        }
        if (this.westPanel.collapsed) {
            this.westPanel.show();
            this.westPanel.setCollapsed(false);
        }
        this.setMenuTitle(catlogData.appDetail.APPNAME);
        var data = catlogData.appDetail.children;
        this.menuStore.removeAll();
        if (data) {
            this.menuStore.loadData(data);
        }
    },
    resetMenu: function () {
        this.menuStore.loadData()
    },
    createSouthPanel: function () {
        var devOrgName = ObjUtil.getAppProp('sysInfo.organ.devOrg.name');
        var showTime = ObjUtil.getAppProp('sysInfo.organ.app.mainPanel.south.showTime');

        var tmpDateStr = '';
        if (showTime !== 'false') {
            tmpDateStr = '<span style="color: #326696;">' + new Date().toLocaleString() + '</span>';
        }

        var items = [tmpDateStr, '->', ('<span class="ez-main-text-tip">' + devOrgName + '</span>'), '->',]
        var toolbar = new Ext.toolbar.Toolbar({
            items: items
        })
        if (showTime !== 'false') {
            var sysDate = ObjUtil.getProp(EzApp, 'sysDate');
            new Date(sysDate)
            toolbar.sysDate = sysDate;
            Ext.interval(function () {
                toolbar.sysDate = toolbar.sysDate + 1000;
                var now = new Date(toolbar.sysDate);
                var dateStr = now.toLocaleString();
                var dateLabel = toolbar.items.getAt(0);
                dateLabel.setText('<span style="color: #326696;">' + dateStr + '</span>');
            }, 1000);

        }

        var southPanel = Ext.create('Ext.panel.Panel', {
            region: 'south',     // position for region
            height: 40,
            split: false,         // enable resizing
            layout: 'fit',
            items: toolbar
        });
        return southPanel;
    },
    createCenterPanel: function () {

        var plugins = Ext.create('Ext.ux.TabCloseMenu', {
            closeTabText: '关闭当前',
            closeOthersTabsText: '关闭其他',
            closeAllTabsText: '关闭所有',
            extraItemsTail: ['-', {
                text: '可关闭',
                checked: true,
                hideOnClick: true,
                handler: function (item) {
                    currentItem.tab.setClosable(item.checked);
                }
            }],
            listeners: {
                aftermenu: function () {
                },
                beforemenu: function (menu, item) {
                    var menuitem = menu.child('*[text="可关闭"]');
                    currentItem = item;
                    menuitem.setChecked(item.closable);
                }
            }
        });

        var tabPanel = Ext.create('Ext.tab.Panel', {
            closeAble: true,
            region: 'center',
            style: {
                background: 'red'
            },
            defaults: {
                padding: 0
            },
            items: [],
            plugins: plugins,
            listeners: {
                scope: this,
                remove: this.onMenuCompotentRemove,
            }
        });
        return tabPanel;
    },
    onMenuCompotentRemove: function (centerPanel, tabComp, opts) {
        this.removeCahcePanel(tabComp.menuId);
        var module = this.getCacheModule(tabComp.menuId);
        if (typeof(module.destroy) === 'function') {
            module.destroy();
        }
        this.removeCahceModule(tabComp.menuId);
    },
    openMenu: function (menuData) {
        var menuId = menuData && menuData.MENUID;
        if (!this.mainTabPanel || !menuId) {
            return;
        }
        var panel = this.getCachePanel(menuId);

        if (panel) {
            this.mainTabPanel.setActiveTab(panel);
            return;
        }
        var panel = this.createPanelFormConfig(menuData);
        this.cachePanel(menuId, panel);
        this.mainTabPanel.add(panel);
        this.mainTabPanel.setActiveTab(panel);
    },
    createPanelFormConfig: function (menuData) {
        var menuId = menuData.MENUID;
        var menuTitle = menuData.MENUNAME;
        var script = menuData.MENUPATH;
        var schema = menuData.SCHEMAID;
        var menuProps = menuData.prop.props;
        var actions = [].concat(menuData.children);
        var props = {
            actions: actions,
            schemaId: schema
        };

        for (var i = 0, prop; prop = menuProps[i]; i++) {
            props[prop.MPKEY] = prop.MPVAL;
        }

        if (script) {
            $import(script);
            var moduleClass = ObjUtil.getProp(window, script)
            var instance = new moduleClass(props);
            if (!instance.initPanel) {
                return;
            }
            this.cacheModule(menuId, instance);
            var panel = instance.initPanel();
            panel.menuId = menuId;
            panel.setTitle(menuTitle);
            panel.setClosable(true);


            return panel;
        }
    },
    cacheModule: function (menuId, instance) {
        var mapModuleCache = this.mainTabPanel.mapModuleCache = this.mainTabPanel.mapModuleCache || {};
        mapModuleCache[this.cachePanel_prefix + menuId] = instance;
    },
    getCacheModule: function (menuId) {
        var mapModuleCache = this.mainTabPanel.mapModuleCache = this.mainTabPanel.mapModuleCache || {};
        return mapModuleCache[this.cachePanel_prefix + menuId];
    },
    removeCahceModule: function (menuId) {
        var mapModuleCache = this.mainTabPanel.mapModuleCache = this.mainTabPanel.mapModuleCache || {};
        delete mapModuleCache[this.cachePanel_prefix + menuId];
    },

    cachePanel: function (menuId, instance) {
        var mapPanelCache = this.mainTabPanel.mapPanelCache = this.mainTabPanel.mapPanelCache || {};
        mapPanelCache[this.cachePanel_prefix + menuId] = instance;
    },
    removeCahcePanel: function (menuId) {
        var mapPanelCache = this.mainTabPanel.mapPanelCache = this.mainTabPanel.mapPanelCache || {};
        delete mapPanelCache[this.cachePanel_prefix + menuId];
    },
    getCachePanel: function (menuId) {
        var mapPanelCache = this.mainTabPanel.mapPanelCache = this.mainTabPanel.mapPanelCache || {};
        return mapPanelCache[this.cachePanel_prefix + menuId];
    },

});