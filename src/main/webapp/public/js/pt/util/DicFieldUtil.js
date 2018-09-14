Ext.define('pt.util.DicFieldUtil', {
    statics: {
        createField: function (scItem, defaultConfig) {

            var fnName = scItem['@dicType'] || 'simple' + 'DicField';
            return this[fnName].apply(this, [scItem, defaultConfig]);
        },
        simpleDicField: function(scItem, defaultConfig){

            var requestData = {
                serverid: 'base.dicService',
                actionid: 'loadItem',
                slice: '2',
                dicId: scItem['@dicId']
            };

            var myStore = Ext.create('Ext.data.Store', {
                fields: ['id', 'text'],
                proxy: {
                    type: 'ajax',
                    url: 'json',
                    actionMethods: {
                        read: 'POST',
                    },
                    paramsAsJson: true,
                    extraParams: requestData,
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8',
                    },

                    reader: {
                        type: 'json',
                        rootProperty: 'body.items',
                    },
                },
                autoLoad: true,
            });

            var labelCls = '';
            var allowBlank = true;
            var fieldLabel = scItem['@alias'];

            if(scItem['@allowBlank'] == '0') {
                allowBlank = false;
                labelCls = 'ez-field-label-notnull';
                fieldLabel = '<span class="ez-field-label-notnull">'+fieldLabel+'</span>'
            }

            var comboxConfig = {
                name: scItem['@id'],
                fieldLabel: fieldLabel,
                allowBlank: allowBlank,
                // labelCls: labelCls,
                store: myStore,
                displayField: 'text',
                valueField: 'id',
                filterField: scItem['@dicFilterProp'],
                typeAhead: true,
                minChars: 1,
                queryMode: 'local',
                listeners : {
                    'beforequery':function(e){
                        var combo = e.combo;
                        if(!e.forceAll) {

                            var filterField = combo.filterField;

                            combo.store.filterBy(function (record, id) {
                                // 得到每个record的项目名称值

                                // 检索的正则
                                var input = combo.getRawValue();
                                var regExp = new RegExp(".*" + input + ".*");

                                var text = record.get(combo.displayField);
                                var ret = regExp.test(text);
                                if(ret) {
                                    return ret;
                                }
                                if (filterField) {
                                    ret = ret || regExp.test(record.get(filterField));
                                }
                                return ret;
                            });
                            combo.expand();
                            return false;
                        }else {
                            combo.store.clearFilter();
                        }
                    }
                }
            };
            Ext.apply(comboxConfig, defaultConfig);
            var combox = Ext.create('Ext.form.ComboBox', comboxConfig);

            return combox;
        }
    }
});
