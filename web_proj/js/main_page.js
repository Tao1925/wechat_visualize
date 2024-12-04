
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
            if (targetId === "page7"){
                create_china_chart();
            }
            if (targetId === "page8"){
                create_nj_chart();
            }
        })
        .catch(err => console.error(err));
}

function timeToDecimal(timeStr) {
    // 分割输入的时间字符串
    const [hours, minutes] = timeStr.split(":").map(Number);

    // 将分钟转换为小时，并返回总的小时数
    return hours + minutes / 60;
}

async function show_photos(page_id, marker_name) {
    var target_page = document.getElementById("container");

    var photo_container = document.createElement('div');
    photo_container.id = "photo_container";
    photo_container.style.position = "relative";
    photo_container.style.width = "100%";
    photo_container.style.height = "100%";
    target_page.appendChild(photo_container)

    const image_urls =  []
    for (var i = 1; i <= 3; i++){
        image_urls.push('/output/photo/nj/' + marker_name + '/' + i + '.jpg');
    }

    const img_elements = [];

    image_urls.forEach(url => {
        const img = document.createElement('img');
        img.src = url;
        // img.onload = function(){
        //     // 获取屏幕的宽高
        //     const screenWidth = window.innerWidth;
        //     const screenHeight = window.innerHeight;
        //
        //     // 计算目标面积 (屏幕面积的1/8)
        //     const targetArea = (screenWidth * screenHeight) / 8;
        //
        //     // 图片的原始宽高
        //     const originalWidth = img.naturalWidth;
        //     const originalHeight = img.naturalHeight;
        //
        //     // 计算图片的长宽比
        //     const aspectRatio = originalWidth / originalHeight;
        //
        //     // 计算目标宽高，使图片面积接近 targetArea 且保持长宽比
        //     const targetWidth = Math.sqrt(targetArea * aspectRatio);
        //     const targetHeight = targetWidth / aspectRatio;
        //
        //     // 设置图片的宽高
        //     img.style.width = `${targetWidth}px`;
        //     img.style.height = `${targetHeight}px`;
        //     img.style.position = "relative";
        //     img.style.zIndex = 9999;
        // }
        photo_container.appendChild(img);
        img_elements.push(img);

    })
    console.log(img_elements)

    const vertical_imgs = [];
    const horizontal_imgs = [];

    for (var i = 0; i < 3; i++){
        if (img_elements[i].naturalHeight > img_elements[i].naturalWidth){
            vertical_imgs.push(img_elements[i]);
        }else{
            horizontal_imgs.push(img_elements[i]);
        }
    }
    console.log("horizontal_imgs.length = " + horizontal_imgs.length)
    if (horizontal_imgs.length === 3) {

        horizontal_imgs.forEach((img, idx) => {
            img.onload = function () {
                const screenWidth = window.innerWidth;
                const screenHeight = window.innerHeight;

                // 计算目标面积 (屏幕面积的1/8)
                const targetArea = (screenWidth * screenHeight) / 8;

                // 图片的原始宽高
                const originalWidth = this.naturalWidth;
                const originalHeight = this.naturalHeight;

                // 计算图片的长宽比
                const aspectRatio = originalWidth / originalHeight;

                // 计算目标宽高，使图片面积接近 targetArea 且保持长宽比
                const targetWidth = Math.sqrt(targetArea * aspectRatio);
                const targetHeight = targetWidth / aspectRatio;

                this.style.width = `${targetWidth}px`;
                this.style.height = `${targetHeight}px`;
                this.style.position = "absolute";
                this.style.zIndex = 9995 + idx;

                this.style.left = `${screenWidth / 4 * (idx + 1) - targetWidth / 2}px`;
                console.log("this.style.left = " + this.style.left)
                this.style.top = `${screenHeight / 4 * ((idx % 2) * 2 + 1) - targetHeight / 2}px`;
            }
            }
        )

        // for (var i = 0; i < 3; i++) {
        //     horizontal_imgs[i].onload = function () {
        //         const screenWidth = window.innerWidth;
        //         const screenHeight = window.innerHeight;
        //
        //         // 计算目标面积 (屏幕面积的1/8)
        //         const targetArea = (screenWidth * screenHeight) / 8;
        //
        //         // 图片的原始宽高
        //         const originalWidth = this.naturalWidth;
        //         const originalHeight = this.naturalHeight;
        //
        //         // 计算图片的长宽比
        //         const aspectRatio = originalWidth / originalHeight;
        //
        //         // 计算目标宽高，使图片面积接近 targetArea 且保持长宽比
        //         const targetWidth = Math.sqrt(targetArea * aspectRatio);
        //         const targetHeight = targetWidth / aspectRatio;
        //
        //         this.style.width = `${targetWidth}px`;
        //         this.style.height = `${targetHeight}px`;
        //         this.style.position = "relative";
        //         this.style.zIndex = 9999;
        //
        //         this.style.left = `${screenWidth / 4 * (i + 1) - targetWidth / 2}px`;
        //         console.log("this.style.left = " + this.style.left)
        //         this.style.top = `${screenHeight / 4 * (i % 2) * 2 + 1 - targetHeight / 2}px`;
        //     }
        // }
    }


}



// 加载内容
document.addEventListener('DOMContentLoaded', () => {
    for (let i = 1; i <= 9; i++) {
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

        const audio_data = [];
        const video_data = [];

        lines.forEach(line => {
                            const parts = line.split(' ');
                            if (parts.length === 4){
                                if (parts[2] === "audio") {
                                    audio_data.push([parts[0], timeToDecimal(parts[1]), parseInt(parts[3])]);
                                }else if (parts[2] === "video") {
                                    video_data.push([parts[0], timeToDecimal(parts[1]), parseInt(parts[3])]);
                                }
                            }
                        })

        var chart = echarts.init(document.getElementById('calls_chart'));
        console.log(audio_data)

        var option = {
            color: ['#dd4444','#80F1BE'],
            legend: {
                top: 10,
                data: ['语音', '视频'],
                textStyle: {
                    fontSize: 16
                }
            },
            xAxis: {
                type: 'time'
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: '北京',
                    type: 'scatter',
                    data: audio_data,
                    symbolSize: function (data){
                        return data[2];
                    }
                }
            ],

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


async function create_china_chart(){
    var chart = echarts.init(document.getElementById("china_chart"));

    $.getJSON("/output/china_province.json", function (data) {
        // 注册地图
        echarts.registerMap("china", data);
        // 配置option
        const option = {
            // 地理坐标系组件用于地图的绘制
            geo: {
                // 使用 registerMap 注册的地图名称。
                map: "china",
                // 是否开启鼠标缩放和平移漫游。默认不开启。如果只想要开启缩放或者平移，可以设置成 'scale' 或者 'move'。设置成 true 为都开启
                roam: true,
                zoom: 1.5,
                top: '25%',
                // 图形上的文本标签，可用于说明图形的一些数据信息，比如值，名称等。
                label: {
                    show: false,
                    color: "#666666",
                },
                // 地图区域的多边形 图形样式。
                /*
                itemStyle: {
                    // 地图区域的颜色
                    areaColor: "#71d5a1", // 绿色
                    // 图形的描边颜色
                    borderColor: "#2979ff", // 蓝色
                },*/
                // 设置高亮状态下的多边形和标签样式
                emphasis: {
                    // 设置区域样式
                    itemStyle: {
                        areaColor: "#ffff99", // 黄色
                        borderColor: "#f29100", // 描边颜色黄色
                    },
                    // 设置字体
                    label: {
                        fontSize: 16, // 16px
                        color: "#f29100", // 白色
                    },
                },
            },
            visualMap: {
                type: 'piecewise',
                pieces: [
                    { min: 0, max: 10, color: '#e0ffff' },   // 10 及以下的值，颜色为浅蓝色
                    { min: 10.1, max: 20, color: '#006edd' }, // 10 到 20 的值，颜色为深蓝色
                    { min: 20.1, max: 30, color: '#ff0000' }, // 20 到 30 的值，颜色为红色
                    { min: 30.1, max: 40, color: '#ff7f00' }, // 30 到 40 的值，颜色为橙色
                    { min: 40.1, max: 50, color: '#ffff00' }, // 40 到 50 的值，颜色为黄色
                ],
                text: ['高', '低'], // 映射显示的文字
                calculable: true,
            },
            series: [
                {
                    type: "map",
                    map: "china",
                    geoIndex: 0,
                    roam: true,
                    data: [
                        { name: "北京市", value:5 },  // 北京省份设置为红色
                        { name: "上海市", value:15 },  // 上海省份设置为绿色
                        { name: "广东省", value:25 },  // 广东省份设置为蓝色
                        // 其他省份使用默认颜色（如果不设置）
                    ]
                },
                {
                    type: "scatter",
                    coordinateSystem: "geo",
                    symbolSize: "20",
                    itemStyle: {
                        color: "#fa3534",
                    },
                    data: [
                        { name: "北京", value: [116.4074, 39.9042] },
                        { name: "上海", value: [121.4737, 31.2304] },
                        { name: "广州", value: [113.2644, 23.1292] },
                        // 更多数据...
                    ],
                },
            ],
        };
        chart.setOption(option, true);
    });
}

async function create_nj_chart(){
    /*
    window._AMapSecurityConfig = {
        securityJsCode: "bdf632a55278fa6e8480dc7917083027",
    };
    AMapLoader.load({
        key: "2105cea408b19738068689ff54a09fdd", //申请好的Web端开发者 Key，调用 load 时必填
        version: "2.0", //指定要加载的 JS API 的版本，缺省时默认为 1.4.15
    })
        .then((AMap) => {
            const map = new AMap.Map("nj-chart");
        })
        .catch((e) => {
            console.error(e); //加载错误提示
        }); */

    try {
        var map = new AMap.Map("container", {
            zoom: 13,
            center: [118.796709, 32.060362],
            resizeEnable: true
        });

        const response = await fetch("/output/map_points.txt");
        const content = await response.text();
        const lines = content.split('\n');

        const map_points_info = []

        lines.forEach(line => {
            const words = line.split(' ');
            const location_name = words[0];
            const cords = words[1].split(',');
            const x = parseFloat(cords[0]);
            const y = parseFloat(cords[1]);
            map_points_info.push({
                location_name: location_name,
                x: x,
                y: y
            })
        })
        console.log(map_points_info)

        var onMarkerClick = function (e) {
            var marker_location_name = e.target._originOpts.location_name;
            show_photos("page8", marker_location_name);

            // e.target 就是被点击的 Marker
        }

        for (var i = 0; i < map_points_info.length; i++){
            var marker = new AMap.Marker({
                map: map,
                icon: "/web_proj/res/poi-marker-default.png",
                position: [map_points_info[i].x, map_points_info[i].y],
                offset: new AMap.Pixel(-13, -30),
                location_name: map_points_info[i].location_name,
            });
            marker.on('click', onMarkerClick);
        }




    } catch (error){
        console.log(error)
    }
}
