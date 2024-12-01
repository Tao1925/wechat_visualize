
function loadContent(targetId, file) {
    fetch(file)
        .then(response => {
            if (!response.ok) throw new Error(`Failed to load ${file}`);
            return response.text();
        })
        .then(data => {
            document.getElementById(targetId).innerHTML = data;
            if (targetId === "page2"){
                create_month_chart();
            }
            if (targetId === "page3"){
                create_day_chart();
            }
            if (targetId === "page4"){
                create_wordcloud_chart();
            }
            if (targetId === "page5"){
                create_calls_chart();
            }
            if (targetId === "page6"){
                create_hour_chart();
            }
        })
        .catch(err => console.error(err));
}

// 加载内容
document.addEventListener('DOMContentLoaded', () => {
    for (let i = 1; i <= 6; i++) {
        loadContent('page' + i, 'html/page' + i + '.html');
    }
});

function create_month_chart() {
    // var ctx = document.getElementById('lineChart').getContext('2d');
    var chart = echarts.init(document.getElementById('month_chart'));
    const strings = [];
    const numbers = [];
    var data;

    fetch('/output/count_chat_monthly.txt')
        .then(response => response.text())
        .then(content => {
            const lines = content.split('\n');

            const strings = [];
            const numbers = [];

            lines.forEach(line => {
                const parts = line.split(' ');
                if (parts.length === 2) {
                    strings.push(parts[0]);
                    numbers.push(parseFloat(parts[1])); // 假设数字是浮动类型
                }
            });

            var option = {
                xAxis: {
                    type: 'category',
                    data: strings,
                    interval: 3,
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    data: numbers,
                    type: 'line',
                    smooth: true, // 使线条平滑
                    lineStyle: {
                        width: 3
                    },
                    symbol: 'circle', // 数据点的样式为圆形
                    animation: true, // 启用动画
                    animationDuration: 30000, // 动画持续时间
                    animationEasing: 'elasticOut', // 弹性缓动效果
                    animationDelay: function (idx) {
                        return idx * 200; // 每个数据点有不同的延迟
                    },
                    animationDurationUpdate: 15000, // 更新时的动画时长
                    animationEasingUpdate: 'bounceOut' // 更新时的弹跳效果
                }]
            };
            // 创建并渲染图表
            chart.setOption(option);


            console.log('Strings:', strings);
            console.log('Numbers:', numbers);


        })
        .catch(error => console.error('读取文件失败:', error));
}

async function create_day_chart() {

    try {

        const response = await fetch("/output/count_chat_daily.txt");
        const content = await response.text();
        const lines = content.split('\n');

        const strings = [];
        const numbers = [];

        lines.forEach(line => {
            const  parts = line.split(' ');
            if (parts.length === 2){
                strings.push(parts[0]);
                numbers.push(parseInt(parts[1]));
            }
        })

        console.log('Strings:', strings);
        console.log('Numbers:', numbers);

        var chartDom = document.getElementById('day_chart');
        var myChart = echarts.init(chartDom);
        var option = {
            title: {
                text: 'Beijing AQI',
                left: '1%'
            },
            tooltip: {
                trigger: 'axis'
            },
            grid: {
                left: '5%',
                right: '15%',
                bottom: '10%'
            },
            xAxis: {
                data: strings
            },
            yAxis: {},
            toolbox: {
                right: 10,
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none'
                    },
                    restore: {},
                    saveAsImage: {}
                }
            },
            dataZoom: [
                {
                    startValue: '2024-01-01'
                },
                {
                    type: 'inside'
                }
            ],
            visualMap: {
                top: 50,
                right: 10,
                pieces: [
                    {
                        gt: 0,
                        lte: 50,
                        color: '#93CE07'
                    },
                    {
                        gt: 50,
                        lte: 100,
                        color: '#FBDB0F'
                    },
                    {
                        gt: 100,
                        lte: 150,
                        color: '#FC7D02'
                    },
                    {
                        gt: 150,
                        lte: 200,
                        color: '#FD0100'
                    },
                    {
                        gt: 200,
                        lte: 300,
                        color: '#AA069F'
                    },
                    {
                        gt: 300,
                        color: '#AC3B2A'
                    }
                ],
                outOfRange: {
                    color: '#999'
                }
            },
            series: {
                name: 'Beijing AQI',
                type: 'line',
                data: numbers,
                markLine: {
                    silent: true,
                    lineStyle: {
                        color: '#333'
                    },
                    data: [
                        {
                            yAxis: 50
                        },
                        {
                            yAxis: 100
                        },
                        {
                            yAxis: 150
                        },
                        {
                            yAxis: 200
                        },
                        {
                            yAxis: 300
                        }
                    ]
                }
            }
        }

        myChart.setOption(option);
    } catch (error) {
        console.error('读取文件失败:', error);
    }
}

async function create_wordcloud_chart(){
    try {
        const response = await fetch("/output/count_word_frequency.txt");
        const content = await response.text();
        const lines = content.split('\n');

        const strings = [];
        const numbers = [];

        lines.forEach(line => {
            const  parts = line.split(' ');
            if (parts.length === 2){
                strings.push(parts[0]);
                numbers.push(parseInt(parts[1]));
            }
        })

        console.log(strings)
        console.log(numbers)
        const tmp_data = strings.map((str, idx) =>({
            name: str,
            value: numbers[idx]
        }));
        const data = tmp_data.slice(0, 100);
        console.log(data)

        var maskImage = new Image();
        maskImage.src = '/web_proj/res/heart_mask.png'

        var chart = echarts.init(document.getElementById('wordcloud_chart'));
        /*
        var data = [
            { name: 'ECharts', value: 10000 },
            { name: 'WordCloud', value: 6181 },
            { name: 'Data', value: 4386 },
            { name: 'JavaScript', value: 4055 },
            { name: 'Python', value: 2467 },
            { name: 'React', value: 1981 },
            { name: 'Node.js', value: 1506 },
            { name: 'Chart', value: 1483 },
            { name: 'VUE', value: 1323 },
            { name: 'CSS', value: 1024 }
        ];
        */
        // 配置项
        var option = {
            tooltip: {
                show: true
            },
            series: [{
                type: 'wordCloud',
                gridSize: 20,
                sizeRange: [12, 60],
                rotationRange: [-90, 90],
                shape: 'circle',
                maskImage: maskImage,
                right: null,
                bottom: null,
                width: '100%',
                height: '100%',
                drawOutOfBound: true,
                data: data,
            }]
        };

        maskImage.onload = function (){
            // option.series[0].maskImage;
            chart.setOption(option);
        }



    } catch (error){
        console.error('读取文件失败:', error);
    }
}

async function create_calls_chart(){
    try {
        const response = await fetch("/output/count_calls.txt");
        const content = await response.text();
        const lines = content.split('\n');

        const audio_call = [];
        const audio_time = [];
        const video_call = [];
        const video_time = [];

        lines.forEach(line => {
                            const parts = line.split(' ');
                            if (parts.length === 3){
                                if (parts[1] === "audio") {
                                    audio_time.push(parts[0]);
                                    audio_call.push(parseInt(parts[2]));
                                }else if (parts[1] === "video") {
                                    video_time.push(parts[0]);
                                    video_call.push(parseInt(parts[2]));
                                }
                            }
                        })

        var chart = echarts.init(document.getElementById('calls_chart'));

        const dataBJ = [
            [1, 55, 9, 56, 0.46, 18, 6, '良'],
            [2, 25, 11, 21, 0.65, 34, 9, '优'],
            [31, 46, 5, 49, 0.28, 10, 6, '优']
        ];
        const dataGZ = [
            [1, 26, 37, 27, 1.163, 27, 13, '优'],
            [2, 85, 62, 71, 1.195, 60, 8, '良'],
            [3, 78, 38, 74, 1.363, 37, 7, '良'],
            [4, 21, 21, 36, 0.634, 40, 9, '优'],
            [5, 41, 42, 46, 0.915, 81, 13, '优'],
            [29, 82, 92, 174, 3.29, 0, 13, '良'],
            [30, 106, 116, 188, 3.628, 101, 16, '轻度污染'],
            [31, 118, 50, 0, 1.383, 76, 11, '轻度污染']
        ];
        const dataSH = [
            [1, 91, 45, 125, 0.82, 34, 23, '良'],
            [2, 65, 27, 78, 0.86, 45, 29, '良'],
            [3, 83, 60, 84, 1.09, 73, 27, '良'],
            [4, 109, 81, 121, 1.28, 68, 51, '轻度污染'],
            [5, 106, 77, 114, 1.07, 55, 51, '轻度污染'],
            [29, 188, 143, 197, 1.66, 99, 51, '中度污染'],
            [30, 174, 131, 174, 1.55, 108, 50, '中度污染'],
            [31, 187, 143, 201, 1.39, 89, 53, '中度污染']
        ];
        const schema = [
            { name: 'date', index: 0, text: '日' },
            { name: 'AQIindex', index: 1, text: 'AQI指数' },
            { name: 'PM25', index: 2, text: 'PM2.5' },
            { name: 'PM10', index: 3, text: 'PM10' },
            { name: 'CO', index: 4, text: '一氧化碳（CO）' },
            { name: 'NO2', index: 5, text: '二氧化氮（NO2）' },
            { name: 'SO2', index: 6, text: '二氧化硫（SO2）' }
        ];
        const itemStyle = {
            opacity: 0.8,
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            shadowColor: 'rgba(0,0,0,0.3)'
        };
        var option = {
            color: ['#dd4444', '#fec42c', '#80F1BE'],
            legend: {
                top: 10,
                data: ['北京', '上海', '广州'],
                textStyle: {
                    fontSize: 16
                }
            },
            grid: {
                left: '10%',
                right: 150,
                top: '18%',
                bottom: '10%'
            },
            tooltip: {
                backgroundColor: 'rgba(255,255,255,0.7)',
                formatter: function (param) {
                    var value = param.value;
                    // prettier-ignore
                    return '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 18px;padding-bottom: 7px;margin-bottom: 7px">'
                        + param.seriesName + ' ' + value[0] + '日：'
                        + value[7]
                        + '</div>'
                        + schema[1].text + '：' + value[1] + '<br>'
                        + schema[2].text + '：' + value[2] + '<br>'
                        + schema[3].text + '：' + value[3] + '<br>'
                        + schema[4].text + '：' + value[4] + '<br>'
                        + schema[5].text + '：' + value[5] + '<br>'
                        + schema[6].text + '：' + value[6] + '<br>';
                }
            },
            xAxis: {
                type: 'value',
                name: '日期',
                nameGap: 16,
                nameTextStyle: {
                    fontSize: 16
                },
                max: 31,
                splitLine: {
                    show: false
                }
            },
            yAxis: {
                type: 'value',
                name: 'AQI指数',
                nameLocation: 'end',
                nameGap: 20,
                nameTextStyle: {
                    fontSize: 16
                },
                splitLine: {
                    show: false
                }
            },
            visualMap: [
                {
                    left: 'right',
                    top: '10%',
                    dimension: 2,
                    min: 0,
                    max: 250,
                    itemWidth: 30,
                    itemHeight: 120,
                    calculable: true,
                    precision: 0.1,
                    text: ['圆形大小：PM2.5'],
                    textGap: 30,
                    inRange: {
                        symbolSize: [10, 70]
                    },
                    outOfRange: {
                        symbolSize: [10, 70],
                        color: ['rgba(255,255,255,0.4)']
                    },
                    controller: {
                        inRange: {
                            color: ['#c23531']
                        },
                        outOfRange: {
                            color: ['#999']
                        }
                    }
                },
                {
                    left: 'right',
                    bottom: '5%',
                    dimension: 6,
                    min: 0,
                    max: 50,
                    itemHeight: 120,
                    text: ['明暗：二氧化硫'],
                    textGap: 30,
                    inRange: {
                        colorLightness: [0.9, 0.5]
                    },
                    outOfRange: {
                        color: ['rgba(255,255,255,0.4)']
                    },
                    controller: {
                        inRange: {
                            color: ['#c23531']
                        },
                        outOfRange: {
                            color: ['#999']
                        }
                    }
                }
            ],
            series: [
                {
                    name: '北京',
                    type: 'scatter',
                    itemStyle: itemStyle,
                    data: dataBJ
                },
                {
                    name: '上海',
                    type: 'scatter',
                    itemStyle: itemStyle,
                    data: dataSH
                },
                {
                    name: '广州',
                    type: 'scatter',
                    itemStyle: itemStyle,
                    data: dataGZ
                }
            ]
        };
        chart.setOption(option);


    } catch (error){
        console.error('读取文件失败:', error);
    }
}


async function create_hour_chart(){
    try{
        const response = await fetch("/output/count_chat_hourly.txt");
        const content = await response.text();
        const lines = content.split('\n');




        var sxy_hour_data = new Array(24).fill(0);
        var tsy_hour_data = new Array(24).fill(0);

        const x_data = Array.from({ length: 24 }, (v, i) => i);


        lines.forEach(line => {
            const parts = line.split(' ');
            if (parts.length === 3){
                var ind = parseInt(parts[1]);
                var cnt = parseInt(parts[2]);
                if (parts[0] === "SXY"){
                    sxy_hour_data[ind] = cnt;
                }else if (parts[0] === "TSY"){
                    tsy_hour_data[ind] = cnt;
                }
            }
        })


        var chart = echarts.init(document.getElementById('hour_chart'));

        var option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {},
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: x_data
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: 'SXY',
                    type: 'bar',
                    stack: 'hour',
                    emphasis: {
                        focus: 'series'
                    },
                    data: sxy_hour_data
                },
                {
                    name: 'TSY',
                    type: 'bar',
                    stack: 'hour',
                    emphasis: {
                        focus: 'series'
                    },
                    data: tsy_hour_data
                }
            ]
        };

        chart.setOption(option);

    } catch (error){
        console.error('读取文件失败:', error);
    }
}
