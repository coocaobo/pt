// window.Ext = window.Ext || {};
// window.Ext.manifest = {
//     hooks: {
//         '*': true
//     }
// }
// $import('lib.ext.ext-all-debug');
$import('lib.ext.ext-all');
$import('lib.ext.ux');
$import('lib.ext.local-zh_CN');
$import('lib.ext.EzVtype');
Ext.onReady(function () {
    $import('lib.ext.ext-patch');
    $import('pt.comp.desktop.MainPanel');
    $import('pt.util.Rmi');
    $import('pt.util.Msg');
    $import('pt.util.ObjUtil');
    var mainPanel = new pt.comp.desktop.MainPanel();
    window.EzApp = {};
});

