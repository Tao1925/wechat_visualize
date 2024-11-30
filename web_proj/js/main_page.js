
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
        const video_call = [];

        lines.forEach(line => {
                            const parts = line.split(' ');
                            if (parts.length === 3){
                                audio_call.push(parseInt(parts[0]));
                                video_call.push(parseInt(parts[1]));
                            }
                        })





    } catch (error){
        console.error('读取文件失败:', error);
    }
}
