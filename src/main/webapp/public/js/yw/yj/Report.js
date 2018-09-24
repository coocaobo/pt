$import('pt.comp.module.SimpleModule');
$import('lib.echarts.echarts_min');
Ext.define('yw.yj.Report', {
    extend: 'pt.comp.module.SimpleModule',
    constructor: function (config) {
        this.callParent(arguments);
    },
    init: function () {
        this.chartId = Ext.id(null, 'ez_ec');
        return this.callParent(arguments);
    },

    initPanel: function () {
        var tbar = this.getTbar();
        var panel = Ext.create('Ext.Panel', {
            tbar: tbar,
            html: '<div id="' + this.chartId + '" style="height: 100%; width: 100%;"></div>'

        });
        panel.on("boxready", this.onBoxReady, this);
        panel.on("resize", function () {
            if (this.myCharts) {
                this.myCharts.resize();
            }
        }, this);
        this.panel = panel;
        return panel;
    },
    onBoxReady: function (width, height) {
        this.loadData();
    },
    initChartData: function (params, body) {
        this.chartDatas = body.counts;
        this.paramsData = params;
        this.initChartView();
    },
    getDefaultOptions: function () {
        var jgType = {
            '$00': '未处理',
            '$01': '完成',
        };
        var ret = {
            backgroundColor: '#eee',
            legend: {
                data: ['未处理', '已处理'],
                align: 'left',
                left: 10
            },
            tooltip: {
                trigger: 'axis'
            },
            xAxis: {
                // data: xAxisData,
                name: '时间',
                silent: false,
                axisLine: {onZero: true},
                splitLine: {show: false},
                splitArea: {show: false}
            },
            yAxis: {
                // inverse: true,
                splitArea: {show: false}
            },
            grid: {
                left: 100
            },
            visualMap_tmp: {
                type: 'continuous',
                dimension: 1,
                text: ['High', 'Low'],
                inverse: true,
                itemHeight: 200,
                calculable: true,
                min: -2,
                max: 6,
                top: 60,
                left: 10,
                inRange: {
                    colorLightness: [0.4, 0.8]
                },
                outOfRange: {
                    color: '#bbb'
                },
                controller: {
                    inRange: {
                        color: '#2f4554'
                    }
                }
            }
        };
        return ret;
    },
    initChartView: function () {
        var freq = this.getFreqValue();
        if (freq === null) {
            return;
        }

        var itemStyle = {
            normal: {},
            emphasis: {
                barBorderWidth: 1,
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowColor: 'rgba(0,0,0,0.5)'
            }
        };


        var option = JSON.parse(JSON.stringify(this.getDefaultOptions()));

        var xAxisData = this.createxAxisByFreq(freq);
        console.log(xAxisData);
        var seriesData = this.getSeriesData(freq, xAxisData);
        var xAxisFormatData = this.formatXAxis(freq, xAxisData);
        option.xAxis.data = xAxisFormatData;
        option.series = [
            {
                name: '未处理',
                type: 'bar',
                stack: 'one',
                itemStyle: itemStyle,
                barWidth: 20,
                data: seriesData['undo']
            },
            {
                name: '已处理',
                type: 'bar',
                stack: 'one',
                itemStyle: itemStyle,
                barWidth: 20,
                data: seriesData['done']
            },
        ]

        if (!this.myCharts) {
            this.myCharts = echarts.init(document.getElementById(this.chartId));
        }
        var myCharts = this.myCharts;
        myCharts.setOption(option, true);

    },
    formatXAxis: function (freq, xAxisData) {
        var ret = [];
        for (var i = 0; i < xAxisData.length; i++) {
            var tmpArr = (xAxisData[i] + '').split('-');
            if (freq === '1') {
                ret.push(tmpArr[0] + '年' + tmpArr[1] + '月');
            } else if (freq === '2') {
                ret.push(tmpArr[0] + '年' + tmpArr[1] + '季度');
            } else if (freq === '3') {
                ret.push(tmpArr[0] + '年' + (tmpArr[1] === '01' ? '上半年' : (tmpArr[1] === '02' ? '下半年' : '未定义')));
            } else if (freq === '4') {
                ret.push(tmpArr[0] + '年');
            }
        }
        return ret;
    },
    getSeriesData: function (freq, xAxisData) {
        var ret = {};
        if (!this.chartDatas) {
            return ret;
        }

        var mapData = {};

        for (var i = 0; i < this.chartDatas.length; i++) {
            var oneData = this.chartDatas[i];
            var sj = oneData['sj'];
            if (!sj) {
                continue;
            }
            var jg = oneData['jg'] || '0';

            var month = sj.substr(0, 7);
            if (!mapData[month]) {
                mapData[month] = {};
            }

            var num = oneData['num'];
            if (mapData[month]['$' + jg]) {
                num = num + mapData[month]['$' + jg];
            }
            mapData[month]['$' + jg] = num;

        }

        var jg0 = [];
        var jg1 = [];
        for (var i = 0; i < xAxisData.length; i++) {
            var oneAxis = xAxisData[i];
            if (freq === '1') {

                var oneMapData = mapData[oneAxis];
                if (!oneMapData) {
                    jg0.push(0);
                    jg1.push(0);
                    continue;
                }
                jg0.push(oneMapData['$0'] || 0);
                jg1.push(oneMapData['$01'] || 0);
            } else if (freq === '2') {
                var ymArr = oneAxis.split('-');
                var num0 = 0;
                var num1 = 0;
                for (var j = 0; j < 3; j++) {
                    var mInt = (ymArr[1] * 1 - 1) * 3 + 1 + j;
                    var mStr = mInt > 10 ? mInt : '0' + mInt;
                    var oneMapData = mapData[ymArr[0] + '-' + mStr];
                    num0 += (!oneMapData ? 0 : oneMapData['$0'] || 0);
                    num1 += (!oneMapData ? 0 : oneMapData['$01'] || 0);
                }
                jg0.push(num0);
                jg1.push(num1);

            } else if (freq === '3') {
                var ymArr = oneAxis.split('-');
                var num0 = 0;
                var num1 = 0;
                for (var j = 0; j < 6; j++) {
                    var mInt = (ymArr[1] * 1 - 1) * 6 + 1 + j;
                    var mStr = mInt > 10 ? mInt : '0' + mInt;
                    var oneMapData = mapData[ymArr[0] + '-' + mStr];
                    num0 += (!oneMapData ? 0 : oneMapData['$0'] || 0);
                    num1 += (!oneMapData ? 0 : oneMapData['$01'] || 0);
                }
                jg0.push(num0);
                jg1.push(num1);

            } else if (freq === '4') {
                var y = oneAxis;
                var num0 = 0;
                var num1 = 0;
                for (var j = 0; j < 12; j++) {
                    var mInt = 1 + j;
                    var mStr = mInt > 10 ? mInt : '0' + mInt;
                    var oneMapData = mapData[y + '-' + mStr];
                    num0 += (!oneMapData ? 0 : oneMapData['$0'] || 0);
                    num1 += (!oneMapData ? 0 : oneMapData['$01'] || 0);
                }
                jg0.push(num0);
                jg1.push(num1);
            }
        }
        return {
            done: jg1,
            undo: jg0,
        }
    },
    createxAxisByFreq: function (freq) {
        var dateBeginStr = this.paramsData.dateBegin
        var dateEndStr = this.paramsData.dateEnd

        var dateBegin = new Date(dateBeginStr);
        var dateEnd = new Date(dateEndStr);

        var m1 = dateBegin.getMonth() + dateBegin.getFullYear() * 12;
        var m2 = dateEnd.getMonth() + dateEnd.getFullYear() * 12;

        var totalMonth = m2 - m1 + 1; //
        var tmpDate = new Date(dateBeginStr);
        var ret = [];
        if (freq === '1') { // 生成月度数据
            for (var i = 0; i < totalMonth; i++) {
                if (i !== 0) {
                    tmpDate.setMonth(tmpDate.getMonth() + 1)
                }

                var m = tmpDate.getMonth() + 1;
                if (m < 10) {
                    m = '0' + m;
                }
                ret.push(tmpDate.getFullYear() + '-' + m);
            }

        } else if (freq === '2') { // 生成季度数据
            for (var i = 0; i < totalMonth; i++) {
                if (i !== 0) {
                    tmpDate.setMonth(tmpDate.getMonth() + 1)
                }

                var m = tmpDate.getMonth() + 1;
                var quarter = '0' + ((((m + 2) / 3) + '').split('.')[0]);
                var ym = tmpDate.getFullYear() + '-' + quarter;
                if (ret.length > 0 && ret[ret.length - 1] === ym) {
                    continue;
                }
                ret.push(tmpDate.getFullYear() + '-' + quarter);
            }

        }
        else if (freq === '3') { // 生成半年度数据
            for (var i = 0; i < totalMonth; i++) {
                if (i !== 0) {
                    tmpDate.setMonth(tmpDate.getMonth() + 1)
                }

                var m = tmpDate.getMonth() + 1;
                var quarter = '0' + ((((m + 5) / 6) + '').split('.')[0]);
                var ym = tmpDate.getFullYear() + '-' + quarter;
                if (ret.length > 0 && ret[ret.length - 1] === ym) {
                    continue;
                }
                ret.push(tmpDate.getFullYear() + '-' + quarter);
            }

        } else if (freq === '4') { // 生成季度数据
            for (var i = 0; i < totalMonth; i++) {
                if (i !== 0) {
                    tmpDate.setMonth(tmpDate.getMonth() + 1)
                }

                var ym = tmpDate.getFullYear();
                if (ret.length > 0 && ret[ret.length - 1] === ym) {
                    continue;
                }
                ret.push(tmpDate.getFullYear());
            }
        }
        return ret;
    },
    getFreqValue: function () {
        if (this.panel.queryById(this.chartId + 'freq01').getValue()) {
            return '1'
        }


        if (this.panel.queryById(this.chartId + 'freq02').getValue()) {
            return '2'
        }


        if (this.panel.queryById(this.chartId + 'freq03').getValue()) {
            return '3'
        }


        if (this.panel.queryById(this.chartId + 'freq04').getValue()) {
            return '4'
        }

        return null;
    }
    ,
    loadData: function () {
        if (this.loading) {
            return;
        }
        if (this.invalidParams()) {
            return;
        }
        this.panel.el.mask('正在请求数据...');
        var me = this;
        var datas = {
            dateBegin: Ext.Date.format(this.dateBeginField.getValue(), 'Y-m-d'),
            dateEnd: Ext.Date.format(this.dateEndField.getValue(), 'Y-m-d'),
        };
        var actionid = 'report1';
        this.loading = true;
        var promise = pt.util.Rmi.jsonRequest({
            serverid: 'yhpcService',
            actionid: actionid,
            body: datas,
        });
        promise.then(function (res) {
            me.panel.el.unmask();
            me.loading = false;
            if (res.code === '01') {
                me.initChartData(datas, res.body);
                return;
            }
            console.dir('save error');
        }, function () {
            me.panel.el.unmask();
            me.loading = false;
            EzToast.tip('数据请求存在异常');
        });

    }
    ,
    invalidParams: function () {
        if (!this.dateBeginField.validate()
            || !this.dateEndField.validate()) {
            return true;
        }
        return false;
    }
    ,
    onDateEndChange: function (field, val, oldval, opts) {
        if (this.dateBeginField.getValue() > val) {
            field.setValue(this.dateBeginField.getValue());
        }
    }
    ,
    onDateBeginChange: function (field, val, oldval, opts) {
        if (this.dateEndField.getValue() < val) {
            field.setValue(this.dateEndField.getValue());
        }
    }
    ,
    getTbar: function () {

        var defaultDateBegin = new Date();
        defaultDateBegin.setMonth(0);
        defaultDateBegin.setDate(1);

        var defaultDateEnd = new Date();

        var dateBegin = this.dateBeginField = Ext.create('Ext.form.field.Date', {
            value: defaultDateBegin,
            allowBlank: false
        });
        dateBegin.on('change', this.onDateBeginChange, this);
        dateBegin.on('select', this.onDateBeginChange, this);
        var dateEnd = this.dateEndField = Ext.create('Ext.form.field.Date', {value: defaultDateEnd, allowBlank: false});
        dateEnd.on('change', this.onDateEndChange, this);
        dateEnd.on('select', this.onDateEndChange, this);

        var ret = [];
        ret.push('排查时间:');
        ret.push(dateBegin);
        ret.push('~');
        ret.push(dateEnd);
        ret.push('-');
        ret.push({
            id: this.chartId + 'freq01',
            name: 'freq',
            xtype: 'radio',
            value: '1',
            label: '月度',
            scope: this,
            listeners: {
                change: this.initChartView,
                scope: this,
            }
        });
        ret.push('月度');
        ret.push({
            id: this.chartId + 'freq02',
            name: 'freq',
            xtype: 'radio',
            value: '2',
            label: '季度',
            scope: this,
            listeners: {
                change: this.initChartView,
                scope: this,
            }
        });
        ret.push('季度');
        ret.push({
            id: this.chartId + 'freq03',
            name: 'freq',
            xtype: 'radio',
            value: '3',
            label: '半年度',
            scope: this,
            listeners: {
                change: this.initChartView,
                scope: this,
            }
        });
        ret.push('半年度');
        ret.push({
            id: this.chartId + 'freq04',
            name: 'freq',
            xtype: 'radio',
            value: '4',
            label: '年度',
            scope: this,
            listeners: {
                change: this.initChartView,
                scope: this,
            }
        });
        ret.push('年度');
        ret.push('-');
        ret.push({type: 'button', text: '统计', handler: this.loadData, scope: this});
        return ret;
    }

})