$import('pt.comp.module.SimpleForm');
Ext.define('pt.base.permission.BaseUserForm', {
    extend: 'pt.comp.module.SimpleForm',
    constructor: function (config) {
        this.callParent(arguments);
    },
    initPanel: function () {
        var panel = this.callParent(arguments);
        this.wrapPanel(panel);
        return panel;
    },
    wrapPanel: function (panel) {
        var empidField = panel.getForm().findField('EMPID')
        empidField.on({
            change: this.onEmpidChange,
            scope: this,
        })
    },
    onEmpidChange: function (field) {
        var logonIdField = this.formPanel.getForm().findField('LOGONID')
        logonIdField.setValue();

        var hanzi = field.getRawValue();
        if (!hanzi) {
            return;
        }

        var promise = pt.util.Rmi.getPinyin(hanzi);
        promise.then(function (res) {
            if (res.code == '01') {
                logonIdField.setValue(res.body.pinyin);
            }
        });
    },
});