(function () {
    var EZEcharts = window.EZEcharts = {
        initCharts: function (id, myCharts) {
            var fnName = 'chart_' + id;
            var scope = EZEcharts;
            var fn = scope[fnName];
            if (fn && typeof(fn) === 'function') {
                fn.apply(scope, [id, myCharts]);
            }

        },
    }
    EZEcharts['chart_c1-1'] = function (id, myCharts) {
        var option = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend1: {
                orient: 'vertical',
                x: 'left',
                data: ['直达', '营销广告', '搜索引擎', '邮件营销', '联盟广告', '视频广告', '百度', '谷歌', '必应', '其他']
            },
            series: [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius: ['40%', '55%'],
                    label: {
                        normal: {
                            // formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                            formatter: '{b}-{c}-{d}%  ',
                            // backgroundColor: '#eee',
                            // borderColor: '#aaa',
                            borderWidth: 1,
                            borderRadius: 4,
                            // shadowBlur:3,
                            // shadowOffsetX: 2,
                            // shadowOffsetY: 2,
                            // shadowColor: '#999',
                            // padding: [0, 7],
                            rich: {
                                a: {
                                    color: '#999',
                                    lineHeight: 22,
                                    align: 'center'
                                },
                                // abg: {
                                //     backgroundColor: '#333',
                                //     width: '100%',
                                //     align: 'right',
                                //     height: 22,
                                //     borderRadius: [4, 4, 0, 0]
                                // },
                                hr: {
                                    borderColor: '#aaa',
                                    width: '100%',
                                    borderWidth: 0.5,
                                    height: 0
                                },
                                b: {
                                    fontSize: 16,
                                    lineHeight: 33
                                },
                                per: {
                                    color: '#eee',
                                    backgroundColor: '#334455',
                                    padding: [2, 4],
                                    borderRadius: 2
                                }
                            }
                        }
                    },
                    data: [
                        {value: 335, name: '直达'},
                        {value: 310, name: '邮件营销'},
                        {value: 234, name: '联盟广告'},
                        {value: 135, name: '视频广告'},
                        {value: 1048, name: '百度'},
                        {value: 251, name: '谷歌'},
                        {value: 147, name: '必应'},
                        {value: 102, name: '其他'}
                    ]
                }
            ]
        };
        myCharts.setOption(option);
    };
    EZEcharts['chart_c1-2'] = function (id, myCharts) {
        var option = {
            title: {
                text: '南丁格尔玫瑰图',
                subtext: '纯属虚构',
                x: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x: 'left',
                data: ['rose1', 'rose2', 'rose3', 'rose4', 'rose5', 'rose6', 'rose7', 'rose8']
            },
            toolbox: {
                show: true,
                feature: {
                    mark: {show: true},
                    dataView: {show: true, readOnly: false},
                    magicType: {
                        show: true,
                        type: ['pie', 'funnel']
                    },
                    restore: {show: true},
                    saveAsImage: {show: true}
                }
            },
            calculable: true,
            series: [
                {
                    name: '半径模式',
                    type: 'pie',
                    radius: [20, 110],
                    center: ['50%', '50%'],
                    roseType: 'radius',
                    label: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    lableLine: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    data: [
                        {value: 10, name: 'rose1'},
                        {value: 5, name: 'rose2'},
                        {value: 15, name: 'rose3'},
                        {value: 25, name: 'rose4'},
                        {value: 20, name: 'rose5'},
                        {value: 35, name: 'rose6'},
                        {value: 30, name: 'rose7'},
                        {value: 40, name: 'rose8'}
                    ]
                },
            ]
        };
        myCharts.setOption(option);
    };
    EZEcharts['chart_c1-3'] = function (id, myChart) {
        // myChart.showLoading();

        $.get('./data/31.json', function (geoJson) {

            // myChart.hideLoading();

            echarts.registerMap('31', geoJson);

            myChart.setOption({
                title: {
                    text: '上海区人口密度 （2011）',
                    subtext: '人口密度数据来自Wikipedia',
                },
                tooltip: {
                    show: true,
                    trigger: 'item',
                    formatter: '{b}<br/>{c} (p / km2)'
                },
                visualMap: {
                    min: 800,
                    max: 50000,
                    text: ['High', 'Low'],
                    realtime: false,
                    calculable: true,
                    inRange: {
                        color: ['lightskyblue', 'yellow', 'orangered']
                    }
                },
                series: [
                    {
                        name: '香港18区人口密度',
                        type: 'map',
                        mapType: '31', // 自定义扩展图表类型
                        itemStyle: {
                            tooltip: {show: true},
                            normal: {label: {show: true}},
                            emphasis: {label: {show: true}}
                        },
                        data: [
                            {name: '崇明县', value: 20057.34},
                            {name: '南汇区', value: 15477.48},
                            {name: '奉贤区', value: 31686.1},
                            {name: '南区', value: 6992.6},
                            {name: '浦东新区', value: 44045.49},
                            {name: '金山区', value: 40689.64},
                            {name: '青浦区', value: 37659.78},
                            {name: '松江区', value: 45180.97},
                            {name: '嘉定区', value: 55204.26},
                            {name: '宝山区', value: 21900.9},
                            {name: '闵行区', value: 4918.26},
                            {name: '杨浦区', value: 5881.84},
                            {name: '普陀区', value: 4178.01},
                            {name: '徐汇区', value: 2227.92},
                            {name: '长宁区', value: 2180.98},
                            {name: '闸北区', value: 9172.94},
                            {name: '虹口区', value: 3368},
                            {name: '卢湾区', value: 3368},
                            {name: '静安区', value: 3368},
                            {name: '黄浦区', value: 806.98}
                        ],
                        // 自定义名称映射
                        nameMap1: {
                            'Central and Western': '中西区',
                            'Eastern': '东区',
                            'Islands': '离岛',
                            'Kowloon City': '九龙城',
                            'Kwai Tsing': '葵青',
                            'Kwun Tong': '观塘',
                            'North': '北区',
                            'Sai Kung': '西贡',
                            'Sha Tin': '沙田',
                            'Sham Shui Po': '深水埗',
                            'Southern': '南区',
                            'Tai Po': '大埔',
                            'Tsuen Wan': '荃湾',
                            'Tuen Mun': '屯门',
                            'Wan Chai': '湾仔',
                            'Wong Tai Sin': '黄大仙',
                            'Yau Tsim Mong': '油尖旺',
                            'Yuen Long': '元朗'
                        }
                    }
                ]
            });
            autohover();
        });
        function autohover(data) {
            var count = 0;
            var timeTicket = null;
            var data = myChart.getOption().series[0].data;
            var dataLength = data.length;//此处设置的是需要轮播的次数

            var dom = myChart['_dom'].nextElementSibling;
            var children = dom.children;


            timeTicket && clearInterval(timeTicket);
            timeTicket = setInterval(function () {
                if(count >= dataLength) {
                    count = 0;
                }
                myChart.dispatchAction({type: 'downplay', seriesIndex: 0,});
                myChart.dispatchAction({type: 'highlight', seriesIndex: 0, dataIndex: count});
                myChart.dispatchAction({type: 'showTip', seriesIndex: 0, dataIndex: count});

                var mapData = data[count];
                children[0].innerHTML = mapData.name;
                children[1].innerHTML = mapData.value;

                count++;
            }, 2000);
        }

        };
        EZEcharts['chart_c1-4'] = function (id, myChart) {

            myChart.showLoading();
            $.get('./data/confidence-band.json', function (data) {
                myChart.hideLoading();

                var base = -data.reduce(function (min, val) {
                    return Math.floor(Math.min(min, val.l));
                }, Infinity);
                myChart.setOption({
                    title: {
                        text: 'Confidence Band',
                        subtext: 'Example in MetricsGraphics.js',
                        left: 'center'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            animation: false,
                            label: {
                                backgroundColor: '#ccc',
                                borderColor: '#aaa',
                                borderWidth: 1,
                                shadowBlur: 0,
                                shadowOffsetX: 0,
                                shadowOffsetY: 0,
                                textStyle: {
                                    color: '#222'
                                }
                            }
                        },
                        formatter: function (params) {
                            return params[2].name + '<br />' + params[2].value;
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        data: data.map(function (item) {
                            return item.date;
                        }),
                        axisLabel: {
                            formatter: function (value, idx) {
                                var date = new Date(value);
                                return idx === 0 ? value : [date.getMonth() + 1, date.getDate()].join('-');
                            }
                        },
                        splitLine: {
                            show: false
                        },
                        boundaryGap: false
                    },
                    yAxis: {
                        axisLabel: {
                            formatter: function (val) {
                                return (val - base) * 100 + '%';
                            }
                        },
                        axisPointer: {
                            label: {
                                formatter: function (params) {
                                    return ((params.value - base) * 100).toFixed(1) + '%';
                                }
                            }
                        },
                        splitNumber: 3,
                        splitLine: {
                            show: false
                        }
                    },
                    series: [{
                        name: 'L',
                        type: 'line',
                        data: data.map(function (item) {
                            return item.l + base;
                        }),
                        lineStyle: {
                            normal: {
                                opacity: 0
                            }
                        },
                        stack: 'confidence-band',
                        symbol: 'none'
                    }, {
                        name: 'U',
                        type: 'line',
                        data: data.map(function (item) {
                            return item.u - item.l;
                        }),
                        lineStyle: {
                            normal: {
                                opacity: 0
                            }
                        },
                        areaStyle: {
                            normal: {
                                color: '#ccc'
                            }
                        },
                        stack: 'confidence-band',
                        symbol: 'none'
                    }, {
                        type: 'line',
                        data: data.map(function (item) {
                            return item.value + base;
                        }),
                        hoverAnimation: false,
                        symbolSize: 6,
                        itemStyle: {
                            normal: {
                                color: '#c23531'
                            }
                        },
                        showSymbol: false
                    }]
                });
            });

        };
        EZEcharts['chart_c1-5'] = function (id, myCharts) {

            var data = [
                [[28604, 77, 17096869, 'Australia', 1990], [31163, 77.4, 27662440, 'Canada', 1990], [1516, 68, 1154605773, 'China', 1990], [13670, 74.7, 10582082, 'Cuba', 1990], [28599, 75, 4986705, 'Finland', 1990], [29476, 77.1, 56943299, 'France', 1990], [31476, 75.4, 78958237, 'Germany', 1990], [28666, 78.1, 254830, 'Iceland', 1990], [1777, 57.7, 870601776, 'India', 1990], [29550, 79.1, 122249285, 'Japan', 1990], [2076, 67.9, 20194354, 'North Korea', 1990], [12087, 72, 42972254, 'South Korea', 1990], [24021, 75.4, 3397534, 'New Zealand', 1990], [43296, 76.8, 4240375, 'Norway', 1990], [10088, 70.8, 38195258, 'Poland', 1990], [19349, 69.6, 147568552, 'Russia', 1990], [10670, 67.3, 53994605, 'Turkey', 1990], [26424, 75.7, 57110117, 'United Kingdom', 1990], [37062, 75.4, 252847810, 'United States', 1990]],
                [[44056, 81.8, 23968973, 'Australia', 2015], [43294, 81.7, 35939927, 'Canada', 2015], [13334, 76.9, 1376048943, 'China', 2015], [21291, 78.5, 11389562, 'Cuba', 2015], [38923, 80.8, 5503457, 'Finland', 2015], [37599, 81.9, 64395345, 'France', 2015], [44053, 81.1, 80688545, 'Germany', 2015], [42182, 82.8, 329425, 'Iceland', 2015], [5903, 66.8, 1311050527, 'India', 2015], [36162, 83.5, 126573481, 'Japan', 2015], [1390, 71.4, 25155317, 'North Korea', 2015], [34644, 80.7, 50293439, 'South Korea', 2015], [34186, 80.6, 4528526, 'New Zealand', 2015], [64304, 81.6, 5210967, 'Norway', 2015], [24787, 77.3, 38611794, 'Poland', 2015], [23038, 73.13, 143456918, 'Russia', 2015], [19360, 76.5, 78665830, 'Turkey', 2015], [38225, 81.4, 64715810, 'United Kingdom', 2015], [53354, 79.1, 321773631, 'United States', 2015]]
            ];

            var option = {
                title: {
                    text: '1990 与 2015 年各国家人均寿命与 GDP'
                },
                legend: {
                    right: 10,
                    data: ['1990', '2015']
                },
                xAxis: {
                    splitLine: {
                        lineStyle: {
                            type: 'dashed'
                        }
                    }
                },
                yAxis: {
                    splitLine: {
                        lineStyle: {
                            type: 'dashed'
                        }
                    },
                    scale: true
                },
                series: [{
                    name: '1990',
                    data: data[0],
                    type: 'scatter',
                    symbolSize: function (data) {
                        return Math.sqrt(data[2]) / 5e2;
                    },
                    label: {
                        emphasis: {
                            show: true,
                            formatter: function (param) {
                                return param.data[3];
                            },
                            position: 'top'
                        }
                    },
                    itemStyle: {
                        normal: {
                            shadowBlur: 10,
                            shadowColor: 'rgba(120, 36, 50, 0.5)',
                            shadowOffsetY: 5,
                            color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
                                offset: 0,
                                color: 'rgb(251, 118, 123)'
                            }, {
                                offset: 1,
                                color: 'rgb(204, 46, 72)'
                            }])
                        }
                    }
                }, {
                    name: '2015',
                    data: data[1],
                    type: 'scatter',
                    symbolSize: function (data) {
                        return Math.sqrt(data[2]) / 5e2;
                    },
                    label: {
                        emphasis: {
                            show: true,
                            formatter: function (param) {
                                return param.data[3];
                            },
                            position: 'top'
                        }
                    },
                    itemStyle: {
                        normal: {
                            shadowBlur: 10,
                            shadowColor: 'rgba(25, 100, 150, 0.5)',
                            shadowOffsetY: 5,
                            color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
                                offset: 0,
                                color: 'rgb(129, 227, 238)'
                            }, {
                                offset: 1,
                                color: 'rgb(25, 183, 207)'
                            }])
                        }
                    }
                }]
            };

            myCharts.setOption(option);
        }
        EZEcharts['chart_c2-1'] = function (id, myCharts) {
            // debugger;
            var option = {
                title: {
                    text: '堆叠区域图'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                legend: {
                    data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: '邮件营销',
                        type: 'line',
                        stack: '总量',
                        areaStyle: {},
                        data: [120, 132, 101, 134, 90, 230, 210]
                    },
                    {
                        name: '联盟广告',
                        type: 'line',
                        stack: '总量',
                        areaStyle: {},
                        data: [220, 182, 191, 234, 290, 330, 310]
                    },
                    {
                        name: '视频广告',
                        type: 'line',
                        stack: '总量',
                        areaStyle: {},
                        data: [150, 232, 201, 154, 190, 330, 410]
                    },
                    {
                        name: '直接访问',
                        type: 'line',
                        stack: '总量',
                        areaStyle: {normal: {}},
                        data: [320, 332, 301, 334, 390, 330, 320]
                    },
                    {
                        name: '搜索引擎',
                        type: 'line',
                        stack: '总量',
                        label: {
                            normal: {
                                show: true,
                                position: 'top'
                            }
                        },
                        areaStyle: {normal: {}},
                        data: [820, 932, 901, 934, 1290, 1330, 1320]
                    }
                ]
            };

            myCharts.setOption(option);
        };
        EZEcharts['chart_c2-4'] = function (id, myChart) {
            var option = {
                // backgroundColor: '#1b1b1b',
                tooltip: {
                    formatter: "{a} <br/>{c} {b}"
                },
                toolbox: {
                    show: true,
                    feature: {
                        mark: {show: true},
                        restore: {show: true},
                        saveAsImage: {show: true}
                    }
                },
                series: [
                    {
                        name: '速度',
                        type: 'gauge',
                        min: 0,
                        max: 220,
                        splitNumber: 11,
                        radius: '50%',
                        axisLine: {            // 坐标轴线
                            lineStyle: {       // 属性lineStyle控制线条样式
                                color: [[0.09, 'lime'], [0.82, '#1e90ff'], [1, '#ff4500']],
                                width: 3,
                                shadowColor: '#fff', //默认透明
                                shadowBlur: 10
                            }
                        },
                        axisLabel: {            // 坐标轴小标记
                            textStyle: {       // 属性lineStyle控制线条样式
                                fontWeight: 'bolder',
                                color: '#fff',
                                shadowColor: '#fff', //默认透明
                                shadowBlur: 10
                            }
                        },
                        axisTick: {            // 坐标轴小标记
                            length: 15,        // 属性length控制线长
                            lineStyle: {       // 属性lineStyle控制线条样式
                                color: 'auto',
                                shadowColor: '#fff', //默认透明
                                shadowBlur: 10
                            }
                        },
                        splitLine: {           // 分隔线
                            length: 25,         // 属性length控制线长
                            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                                width: 3,
                                color: '#fff',
                                shadowColor: '#fff', //默认透明
                                shadowBlur: 10
                            }
                        },
                        pointer: {           // 分隔线
                            shadowColor: '#fff', //默认透明
                            shadowBlur: 5
                        },
                        title: {
                            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                fontWeight: 'bolder',
                                fontSize: 20,
                                fontStyle: 'italic',
                                color: '#fff',
                                shadowColor: '#fff', //默认透明
                                shadowBlur: 10
                            }
                        },
                        detail: {
                            backgroundColor: 'rgba(30,144,255,0.8)',
                            borderWidth: 1,
                            borderColor: '#fff',
                            shadowColor: '#fff', //默认透明
                            shadowBlur: 5,
                            offsetCenter: [0, '50%'],       // x, y，单位px
                            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                fontWeight: 'bolder',
                                color: '#fff'
                            }
                        },
                        data: [{value: 40, name: 'km/h'}]
                    },
                    {
                        name: '转速',
                        type: 'gauge',
                        center: ['25%', '55%'],    // 默认全局居中
                        radius: '30%',
                        min: 0,
                        max: 7,
                        endAngle: 45,
                        splitNumber: 7,
                        axisLine: {            // 坐标轴线
                            lineStyle: {       // 属性lineStyle控制线条样式
                                color: [[0.29, 'lime'], [0.86, '#1e90ff'], [1, '#ff4500']],
                                width: 2,
                                shadowColor: '#fff', //默认透明
                                shadowBlur: 10
                            }
                        },
                        axisLabel: {            // 坐标轴小标记
                            textStyle: {       // 属性lineStyle控制线条样式
                                fontWeight: 'bolder',
                                color: '#fff',
                                shadowColor: '#fff', //默认透明
                                shadowBlur: 10
                            }
                        },
                        axisTick: {            // 坐标轴小标记
                            length: 12,        // 属性length控制线长
                            lineStyle: {       // 属性lineStyle控制线条样式
                                color: 'auto',
                                shadowColor: '#fff', //默认透明
                                shadowBlur: 10
                            }
                        },
                        splitLine: {           // 分隔线
                            length: 20,         // 属性length控制线长
                            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                                width: 3,
                                color: '#fff',
                                shadowColor: '#fff', //默认透明
                                shadowBlur: 10
                            }
                        },
                        pointer: {
                            width: 5,
                            shadowColor: '#fff', //默认透明
                            shadowBlur: 5
                        },
                        title: {
                            offsetCenter: [0, '-30%'],       // x, y，单位px
                            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                fontWeight: 'bolder',
                                fontStyle: 'italic',
                                color: '#fff',
                                shadowColor: '#fff', //默认透明
                                shadowBlur: 10
                            }
                        },
                        detail: {
                            //backgroundColor: 'rgba(30,144,255,0.8)',
                            // borderWidth: 1,
                            borderColor: '#fff',
                            shadowColor: '#fff', //默认透明
                            shadowBlur: 5,
                            width: 80,
                            height: 30,
                            offsetCenter: [25, '20%'],       // x, y，单位px
                            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                                fontWeight: 'bolder',
                                color: '#fff'
                            }
                        },
                        data: [{value: 1.5, name: 'x1000 r/min'}]
                    },
                    {
                        name: '油表',
                        type: 'gauge',
                        center: ['75%', '50%'],    // 默认全局居中
                        radius: '30%',
                        min: 0,
                        max: 2,
                        startAngle: 135,
                        endAngle: 45,
                        splitNumber: 2,
                        axisLine: {            // 坐标轴线
                            lineStyle: {       // 属性lineStyle控制线条样式
                                color: [[0.2, 'lime'], [0.8, '#1e90ff'], [1, '#ff4500']],
                                width: 2,
                                shadowColor: '#fff', //默认透明
                                shadowBlur: 10
                            }
                        },
                        axisTick: {            // 坐标轴小标记
                            length: 12,        // 属性length控制线长
                            lineStyle: {       // 属性lineStyle控制线条样式
                                color: 'auto',
                                shadowColor: '#fff', //默认透明
                                shadowBlur: 10
                            }
                        },
                        axisLabel: {
                            textStyle: {       // 属性lineStyle控制线条样式
                                fontWeight: 'bolder',
                                color: '#fff',
                                shadowColor: '#fff', //默认透明
                                shadowBlur: 10
                            },
                            formatter: function (v) {
                                switch (v + '') {
                                    case '0' :
                                        return 'E';
                                    case '1' :
                                        return 'Gas';
                                    case '2' :
                                        return 'F';
                                }
                            }
                        },
                        splitLine: {           // 分隔线
                            length: 15,         // 属性length控制线长
                            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                                width: 3,
                                color: '#fff',
                                shadowColor: '#fff', //默认透明
                                shadowBlur: 10
                            }
                        },
                        pointer: {
                            width: 2,
                            shadowColor: '#fff', //默认透明
                            shadowBlur: 5
                        },
                        title: {
                            show: false
                        },
                        detail: {
                            show: false
                        },
                        data: [{value: 0.5, name: 'gas'}]
                    },
                    {
                        name: '水表',
                        type: 'gauge',
                        center: ['75%', '50%'],    // 默认全局居中
                        radius: '30%',
                        min: 0,
                        max: 2,
                        startAngle: 315,
                        endAngle: 225,
                        splitNumber: 2,
                        axisLine: {            // 坐标轴线
                            lineStyle: {       // 属性lineStyle控制线条样式
                                color: [[0.2, 'lime'], [0.8, '#1e90ff'], [1, '#ff4500']],
                                width: 2,
                                shadowColor: '#fff', //默认透明
                                shadowBlur: 10
                            }
                        },
                        axisTick: {            // 坐标轴小标记
                            show: false
                        },
                        axisLabel: {
                            textStyle: {       // 属性lineStyle控制线条样式
                                fontWeight: 'bolder',
                                color: '#fff',
                                shadowColor: '#fff', //默认透明
                                shadowBlur: 10
                            },
                            formatter: function (v) {
                                switch (v + '') {
                                    case '0' :
                                        return 'H';
                                    case '1' :
                                        return 'Water';
                                    case '2' :
                                        return 'C';
                                }
                            }
                        },
                        splitLine: {           // 分隔线
                            length: 15,         // 属性length控制线长
                            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                                width: 3,
                                color: '#fff',
                                shadowColor: '#fff', //默认透明
                                shadowBlur: 10
                            }
                        },
                        pointer: {
                            width: 2,
                            shadowColor: '#fff', //默认透明
                            shadowBlur: 5
                        },
                        title: {
                            show: false
                        },
                        detail: {
                            show: false
                        },
                        data: [{value: 0.5, name: 'gas'}]
                    }
                ]
            };

            setInterval(function () {
                option.series[0].data[0].value = (Math.random() * 100).toFixed(2) - 0;
                option.series[1].data[0].value = (Math.random() * 7).toFixed(2) - 0;
                option.series[2].data[0].value = (Math.random() * 2).toFixed(2) - 0;
                option.series[3].data[0].value = (Math.random() * 2).toFixed(2) - 0;
                myChart.setOption(option);
            }, 2000)
            myChart.setOption(option);

        };
        EZEcharts['chart_c2-3'] = function (id, myCharts) {
            var colors = ['#FFAE57', '#FF7853', '#EA5151', '#CC3F57', '#9A2555'];
            var bgColor = '#2E2733';

            var itemStyle = {
                star5: {
                    color: colors[0]
                },
                star4: {
                    color: colors[1]
                },
                star3: {
                    color: colors[2]
                },
                star2: {
                    color: colors[3]
                }
            };

            var data = [{
                name: '虚构',
                itemStyle: {
                    normal: {
                        color: colors[1]
                    }
                },
                children: [{
                    name: '小说',
                    children: [{
                        name: '5☆',
                        children: [{
                            name: '疼'
                        }, {
                            name: '慈悲'
                        }, {
                            name: '楼下的房客'
                        }]
                    }, {
                        name: '4☆',
                        children: [{
                            name: '虚无的十字架'
                        }, {
                            name: '无声告白'
                        }, {
                            name: '童年的终结'
                        }]
                    }, {
                        name: '3☆',
                        children: [{
                            name: '疯癫老人日记'
                        }]
                    }]
                }, {
                    name: '其他',
                    children: [{
                        name: '5☆',
                        children: [{
                            name: '纳博科夫短篇小说全集'
                        }]
                    }, {
                        name: '4☆',
                        children: [{
                            name: '安魂曲'
                        }, {
                            name: '人生拼图版'
                        }]
                    }, {
                        name: '3☆',
                        children: [{
                            name: '比起爱你，我更需要你'
                        }]
                    }]
                }]
            }, {
                name: '非虚构',
                itemStyle: {
                    color: colors[2]
                },
                children: [{
                    name: '设计',
                    children: [{
                        name: '5☆',
                        children: [{
                            name: '无界面交互'
                        }]
                    }, {
                        name: '4☆',
                        children: [{
                            name: '数字绘图的光照与渲染技术'
                        }, {
                            name: '日本建筑解剖书'
                        }]
                    }, {
                        name: '3☆',
                        children: [{
                            name: '奇幻世界艺术\n&RPG地图绘制讲座'
                        }]
                    }]
                }, {
                    name: '社科',
                    children: [{
                        name: '5☆',
                        children: [{
                            name: '痛点'
                        }]
                    }, {
                        name: '4☆',
                        children: [{
                            name: '卓有成效的管理者'
                        }, {
                            name: '进化'
                        }, {
                            name: '后物欲时代的来临',
                        }]
                    }, {
                        name: '3☆',
                        children: [{
                            name: '疯癫与文明'
                        }]
                    }]
                }, {
                    name: '心理',
                    children: [{
                        name: '5☆',
                        children: [{
                            name: '我们时代的神经症人格'
                        }]
                    }, {
                        name: '4☆',
                        children: [{
                            name: '皮格马利翁效应'
                        }, {
                            name: '受伤的人'
                        }]
                    }, {
                        name: '3☆',
                    }, {
                        name: '2☆',
                        children: [{
                            name: '迷恋'
                        }]
                    }]
                }, {
                    name: '居家',
                    children: [{
                        name: '4☆',
                        children: [{
                            name: '把房子住成家'
                        }, {
                            name: '只过必要生活'
                        }, {
                            name: '北欧简约风格'
                        }]
                    }]
                }, {
                    name: '绘本',
                    children: [{
                        name: '5☆',
                        children: [{
                            name: '设计诗'
                        }]
                    }, {
                        name: '4☆',
                        children: [{
                            name: '假如生活糊弄了你'
                        }, {
                            name: '博物学家的神秘动物图鉴'
                        }]
                    }, {
                        name: '3☆',
                        children: [{
                            name: '方向'
                        }]
                    }]
                }, {
                    name: '哲学',
                    children: [{
                        name: '4☆',
                        children: [{
                            name: '人生的智慧'
                        }]
                    }]
                }, {
                    name: '技术',
                    children: [{
                        name: '5☆',
                        children: [{
                            name: '代码整洁之道'
                        }]
                    }, {
                        name: '4☆',
                        children: [{
                            name: 'Three.js 开发指南'
                        }]
                    }]
                }]
            }];

            for (var j = 0; j < data.length; ++j) {
                var level1 = data[j].children;
                for (var i = 0; i < level1.length; ++i) {
                    var block = level1[i].children;
                    var bookScore = [];
                    var bookScoreId;
                    for (var star = 0; star < block.length; ++star) {
                        var style = (function (name) {
                            switch (name) {
                                case '5☆':
                                    bookScoreId = 0;
                                    return itemStyle.star5;
                                case '4☆':
                                    bookScoreId = 1;
                                    return itemStyle.star4;
                                case '3☆':
                                    bookScoreId = 2;
                                    return itemStyle.star3;
                                case '2☆':
                                    bookScoreId = 3;
                                    return itemStyle.star2;
                            }
                        })(block[star].name);

                        block[star].label = {
                            color: style.color,
                            downplay: {
                                opacity: 0.5
                            }
                        };

                        if (block[star].children) {
                            style = {
                                opacity: 1,
                                color: style.color
                            };
                            block[star].children.forEach(function (book) {
                                book.value = 1;
                                book.itemStyle = style;

                                book.label = {
                                    color: style.color
                                };

                                var value = 1;
                                if (bookScoreId === 0 || bookScoreId === 3) {
                                    value = 5;
                                }

                                if (bookScore[bookScoreId]) {
                                    bookScore[bookScoreId].value += value;
                                }
                                else {
                                    bookScore[bookScoreId] = {
                                        color: colors[bookScoreId],
                                        value: value
                                    };
                                }
                            });
                        }
                    }

                    level1[i].itemStyle = {
                        color: data[j].itemStyle.color
                    };
                }
            }

            var option = {
                // backgroundColor: bgColor,
                color: colors,
                series: [{
                    type: 'sunburst',
                    center: ['50%', '50%'],
                    data: data,
                    sort: function (a, b) {
                        if (a.depth === 1) {
                            return b.getValue() - a.getValue();
                        }
                        else {
                            return a.dataIndex - b.dataIndex;
                        }
                    },
                    label: {
                        rotate: 'radial',
                        color: bgColor
                    },
                    itemStyle: {
                        borderColor: bgColor,
                        borderWidth: 2
                    },
                    levels: [{}, {
                        r0: 0,
                        r: 20,
                        label: {
                            rotate: 0
                        }
                    }, {
                        r0: 20,
                        r: 50
                    }, {
                        r0: 50,
                        r: 70,
                        itemStyle: {
                            shadowBlur: 2,
                            shadowColor: colors[2],
                            color: 'transparent'
                        },
                        label: {
                            rotate: 'tangential',
                            fontSize: 10,
                            color: colors[0]
                        }
                    }, {
                        r0: 50,
                        r: 70,
                        itemStyle: {
                            shadowBlur: 80,
                            shadowColor: colors[0]
                        },
                        label: {
                            position: 'outside',
                            textShadowBlur: 5,
                            textShadowColor: '#333',
                        },
                        downplay: {
                            label: {
                                opacity: 0.5
                            }
                        }
                    }]
                }]
            };
            myCharts.setOption(option);
        };
        EZEcharts['chart_c2-2'] = function (id, myCharts) {
            var option = {
                title: {
                    text: '浏览器占比变化',
                    subtext: '纯属虚构',
                    top: 10,
                    left: 10
                },
                tooltip: {
                    trigger: 'item',
                    backgroundColor: 'rgba(0,0,250,0.2)'
                },
                legend: {
                    type: 'scroll',
                    bottom: 10,
                    data: (function () {
                        var list = [];
                        for (var i = 1; i <= 28; i++) {
                            list.push(i + 2000 + '');
                        }
                        return list;
                    })()
                },
                visualMap: {
                    top: 'middle',
                    right: 10,
                    color: ['red', 'yellow'],
                    calculable: true
                },
                radar: {
                    indicator: [
                        {text: 'IE8-', max: 400},
                        {text: 'IE9+', max: 400},
                        {text: 'Safari', max: 400},
                        {text: 'Firefox', max: 400},
                        {text: 'Chrome', max: 400}
                    ]
                },
                series: (function () {
                    var series = [];
                    for (var i = 1; i <= 28; i++) {
                        series.push({
                            name: '浏览器（数据纯属虚构）',
                            type: 'radar',
                            symbol: 'none',
                            lineStyle: {
                                width: 1
                            },
                            emphasis: {
                                areaStyle: {
                                    color: 'rgba(0,250,0,0.3)'
                                }
                            },
                            data: [
                                {
                                    value: [
                                        (40 - i) * 10,
                                        (38 - i) * 4 + 60,
                                        i * 5 + 10,
                                        i * 9,
                                        i * i / 2
                                    ],
                                    name: i + 2000 + ''
                                }
                            ]
                        });
                    }
                    return series;
                })()
            };

            myCharts.setOption(option);
        }
    }
)();