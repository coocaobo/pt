$import('pt.comp.module.SimpleList');
Ext.define('pt.base.permission.BaseUserRoleList', {
    extend: 'pt.comp.module.SimpleList',
    constructor: function (config) {
        this.callParent(arguments);
    },
    init: function () {
        this.initCnd = ['eq', ['$', 'LOGONID'], ['s', '']];
        this.schemaId = 'base.UserRole';
        this.actions = [{
            ACTIONCMD: 'create',
            ACTIONNAME: '新建',
        }, {
            ACTIONCMD: 'update',
            ACTIONNAME: '修改',
        }, {
            ACTIONCMD: 'remove',
            ACTIONNAME: '删除',
        }];
        this.callParent(arguments);
    },
    reloadData: function (logonId) {
        this.logonId = logonId;

        this.resetParam({
            cnd: ['eq', ['$', 'LOGONID'], ['s', logonId]]
        })
        this.grid.store.load();
    },
    getCreateInitRecordData: function(){
        var params = this.callParent(arguments);
        params['LOGONID'] = this.logonId;
        return params;
    },
    doCreate:function(){
        if(!this.logonId) {
            EzToast.tip('请选择用户后再操作');
            return;
        }
        return this.callParent(arguments);
    }
});