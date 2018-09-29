(function () {
    // document.ready = function (){
    //     console.log(1)
    // }
    // document.ready(function() {
    //     console.log('ready');
    // });

    window.onresize = function () {
        Cockpit.data.echartsInstance
        for (var p in Cockpit.data.echartsInstance) {
            var tmpCharts = Cockpit.data.echartsInstance[p];
            if (tmpCharts) {
                tmpCharts.resize();
            }
        }
    }

    var Cockpit = {};
    Cockpit.config = {
        chartIdStr: 'chartId',
    };
    Cockpit.data = {echartsInstance: {}};
    Cockpit.initArea = function (el) {
        var chartId = el.getAttribute(Cockpit.config.chartIdStr);
        if (!chartId) {
            console.log('非法的图形区域id ' + chartId);
            return;
        }
        if (Cockpit.data.echartsInstance[chartId]) {
            console.log('图形区域id已经存在 ' + chartId);
            return;
        }
        var myChart = echarts.init(el, 'customed');


        Cockpit.data.echartsInstance[chartId] = myChart;
        window.EZEcharts.initCharts(chartId, myChart);
    }


    window.onload = function () {
        var areas = document.getElementsByClassName('ez-chart');
        var len = areas.lenght || -1;

        for (var i = 0, area; i < len, area = areas[i]; i++) {
            Cockpit.initArea(area);
        }

    }
})();