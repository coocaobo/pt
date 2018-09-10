Ext.define('Override.form.field.VTypes', {
    override: 'Ext.form.field.VTypes',

    // vtype validation function
    time: function(value) {
        return this.timeRe.test(value);
    },
    // RegExp for the value to be tested against within the validation function
    timeRe: /^([1-9]|1[0-9]):([0-5][0-9])(\s[a|p]m)$/i,
    // vtype Text property: The error text to display when the validation function returns false
    timeText: 'Not a valid time.  Must be in the format "12:34 PM".',
    // vtype Mask property: The keystroke filter mask
    timeMask: /[\d\s:amp]/i,


    IPAddress:  function(value) {
        return this.IPAddressRe.test(value);
    },
    IPAddressRe: /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,
    IPAddressText: 'Must be a numeric IP address',
    IPAddressMask: /[\d\.]/i,

    phone:  function(value) {
        return this.phoneRe.test(value);
    },
    phoneRe: /^1[34578]\d{9}$/,
    phoneText: '必须是11位电话号码',
    phonesMask: /[\d]/i
});