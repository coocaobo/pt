Ext.define('EzToast', {
    statics: {
        tip: function (html, title) {
            Ext.toast({
                html: html || '错误',
                title: title || '提示',
                width: 200,
                align: 'br',
                closable: true,
                iconCls: 'x-fa fa-home',
            });

        }
    }
});

Ext.define('pt.Cookie', {
    statics: {
        remarkLogoff: function () {
            Ext.util.Cookies.clear('logoff');
        },
        remarkUnLogoff: function () {
            Ext.util.Cookies.set('logoff', 'no');
        },
        isLogoff: function () {
            return Ext.util.Cookies.get('logoff') !== 'no';
        }
    }
})