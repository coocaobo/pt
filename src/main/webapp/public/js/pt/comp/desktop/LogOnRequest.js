Ext.define('pt.comp.desktop.LogOnRequest', {
    statics: {
        requestApp: function (roleId) {
            var promise = pt.util.Rmi.formRequest({roleId: roleId}, {notTip: true}, {url: 'app.logon'});
            promise.then(function (res) {
                if (res.code === '01') {
                    Ext.apply(window.EzApp, res.body);
                    return res;
                }

            }, function (res) {
                return res;
            });
            return promise;
        }
    }
})