Ext.define('pt.util.Rmi', {
    statics: {
        jsonRequest: function (params, opts, meta) {
            params = params || {};
            meta = meta || {};
            Ext.applyIf(meta, {
                url: 'json',
                method: 'POST',
                jsonData: params,
                opts: opts
            });

            var deffered = Ext.Ajax.request(meta).then(function (response, opts) {
                    var obj = Ext.decode(response.responseText);
                    if (!response.request.opts || !response.request.opts.notTip) {
                        if (obj.code !== '01') {
                            EzToast.tip(obj.msg, '错误');
                        }
                    }
                    return obj;
                },
                function (response, opts) {
                    console.log('server-side failure with status code ' + response.status);
                });
            return deffered;
        },

        getRequest: function (params, opts, meta) {
            params = params || {};
            meta = meta || {};
            Ext.applyIf(meta, {
                method: 'GET',
                params: params,
                opts: opts
            });
            if (!meta.url) {
                return;
            }

            var deffered = Ext.Ajax.request(meta).then(function (response, opts) {
                    var obj = Ext.decode(response.responseText);
                    if (!response.request.opts || !response.request.opts.notTip) {
                        if (obj.code !== '01') {
                            EzToast.tip(obj.msg, '错误');
                        }
                    }
                    return obj;
                },
                function (response, opts) {
                    console.log('server-side failure with status code ' + response.status);
                });
            return deffered;
        },

        synJsonRequest: function (params) {
            var obj = Ext.Ajax.request({
                url: 'json',
                method: 'POST',
                rawData: JSON.stringify(params),
                async: false,
            });
            return obj;

        },

        formRequest: function (params, opts, meta) {
            params = params || {};
            meta = meta || {};

            Ext.applyIf(meta, {
                url: 'json',
                method: 'POST',
                params: params,
                opts: opts
            });

            var deffered = Ext.Ajax.request(meta).then(function (response, opts) {
                    var obj = Ext.decode(response.responseText);
                    if (!response.request.opts || !response.request.opts.notTip) {
                        if (obj.code !== '01') {
                            EzToast.tip(obj.msg);
                        }
                    }
                    return obj;
                },
                function (response, opts) {
                    console.log('server-side failure with status code ' + response.status);
                });
            return deffered;
        },
        xmlRequest: function (params, opts, meta) {

            params = params || {};
            meta = meta || {};

            Ext.applyIf(meta, {
                url: 'json',
                method: 'POST',
                params: params,
                opts: opts
            });

            var deffered = Ext.Ajax.request(meta).then(function (response, opts) {
                    return response.responseText;
                },
                function (response, opts) {
                    console.log('server-side failure with status code ' + response.status);
                });
            return deffered;
        },
        schemaCache: function () {
            if (this.schemaCache.called) {
                return;
            }
            this.schemaCache.called = true;
            var cache = {};

            return function (id) {
                if (cache[id]) {
                    return cache[id];
                }
                var params = {
                    id: id,
                    actionid: 'doGeneral',
                    serverid: 'schemaGeneral'
                };

                var rmiRequest = pt.util.Rmi.synJsonRequest(params);
                if (rmiRequest.status === 200) {
                    var result = Ext.decode(rmiRequest.responseText);
                    if (result.code == '01') {
                        cache[id] = result.body;
                    }
                }
                return cache[id];
            }
        },
        loadSchema: function (id) {
            if (!id) {
                return;
            }
            var cacheFn = pt.util.Rmi.schemaCache.loadFn;
            if (!cacheFn) {
                cacheFn = pt.util.Rmi.schemaCache.loadFn = pt.util.Rmi.schemaCache();
            }
            return Ext.clone(cacheFn(id), true);
        },

        getPinyin: function (hanzi) {
            if (!hanzi) {
                return;
            }
            var promist = pt.util.Rmi.jsonRequest({
                actionid: 'getPinyin',
                serverid: 'pinyinService',
                body: hanzi,
            });
            return promist;
        },
        getBasePath: function () {
            if (!pt.util.Rmi.basePath) {
                //获取当前网址，如： http://localhost:8080/Tmall/index.jsp
                var curWwwPath = window.document.location.href;

                //获取主机地址之后的目录如：/Tmall/index.jsp
                var pathName = window.document.location.pathname;
                var pos = curWwwPath.indexOf(pathName);

                //获取主机地址，如： http://localhost:8080
                var localhostPaht = curWwwPath.substring(0, pos);

                //获取带"/"的项目名，如：/Tmall
                var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
                pt.util.Rmi.basePath = localhostPaht + projectName;
            }
            debugger;
            return pt.util.Rmi.basePath;

        }
    }
});