Ext.define('Ext.form.field.ViewText', {
    extend: 'Ext.form.field.Text',
    alias: 'widget.viewtextfield',
    alternateClassName: ['Ext.form.ViewTextField', 'Ext.form.ViewText'],
    componentLayout: 'textfield',
    fieldSubTpl: [ // note: {id} here is really {inputId}, but {cmpId} is available
        '<div id="{id}" data-ref="inputEl" type="{type}" {inputAttrTpl}',
        ' size="1"', // allows inputs to fully respect CSS widths across all browsers
        '<tpl if="name"> name="{name}"</tpl>',
        '<tpl if="placeholder"> placeholder="{placeholder}"</tpl>',
        '{%if (values.maxLength !== undefined){%} maxlength="{maxLength}"{%}%}',
        '<tpl if="readOnly"> readonly="readonly"</tpl>',
        '<tpl if="disabled"> disabled="disabled"</tpl>',
        '<tpl if="tabIdx != null"> tabindex="{tabIdx}"</tpl>',
        '<tpl if="fieldStyle"> style="{fieldStyle}"</tpl>',
        '<tpl if="ariaEl == \'inputEl\'">',
        '<tpl foreach="ariaElAttributes"> {$}="{.}"</tpl>',
        '</tpl>',
        '<tpl foreach="inputElAriaAttributes"> {$}="{.}"</tpl>',
        ' class="{fieldCls} {typeCls} {typeCls}-{ui} {editableCls} {inputCls} {fixCls}" autocomplete="off">',
        '<tpl if="value"> {[Ext.util.Format.htmlEncode(values.value)]}</tpl>',
        '</div>',
        {
            disableFormats: true
        }
    ],
    triggerWrapCls: Ext.baseCSSPrefix + 'form-trigger-wrap-none',

    getValue: function () {
        var val = this.value;
        return val;
    },

    setValue: function (value) {

        var ret = this.callParent([value]);
        if (this.el && this.el.dom) {
            if (this.el && this.el.dom) {
                this.inputEl.dom.innerText = value;
            }
            return ret;
        }
    },

    getRawValue: function () {
        return this.rawValue;
    },

    setRawValue: function (value) {
        var me = this,
            rawValue = me.rawValue;

        if (!me.transformRawValue.$nullFn) {
            value = me.transformRawValue(value);
        }

        value = Ext.valueFrom(value, '');

        if (rawValue === undefined || rawValue !== value) {
            me.rawValue = value;

            // Some Field subclasses may not render an inputEl
            if (me.inputEl) {
                me.bindChangeEvents(false);
                me.inputEl.dom.value = value;
                me.inputEl.dom.innerText = value;
                me.bindChangeEvents(true);
            }
        }

        if (me.rendered && me.reference) {
            me.publishState('rawValue', value);
        }

        return value;
    },
});

Ext.override(Ext.form.field.Date, {
    setValue: function(v) {
        var me = this;
        if(typeof(v) == 'string') {
            v = new Date(v);
        }
        me.lastValue = me.rawDateText;
        me.lastDate = me.rawDate;
        if (Ext.isDate(v)) {
            me.rawDate  = v;
            me.rawDateText = me.formatDate(v);
        }
        else {
            me.rawDate = me.rawToValue(v);
            me.rawDateText = me.formatDate(v);
            if (me.rawDate === v) {
                me.rawDate = null;
                me.rawDateText = '';
            }
        }
        me.callParent(arguments);
    },

});

Ext.override(Ext.form.field.Number, {
    getValue: function() {
        var value = parseFloat(this.callParent(), 10);
        return (isNaN(value)) ? null : value;
    },
});

Ext.apply(Ext.form.field.VTypes, {
    pwd6: function(val, field) {
        return this.pwd6Test.test(val);
    },
    pwd6Text: '密码必须要符合XXXXXX 格式.',
    pwd6Test: /^[a-zA-Z\d_]{6,}$/
});
