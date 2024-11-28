
function loadContent(targetId, file) {
    fetch(file)
        .then(response => {
            if (!response.ok) throw new Error(`Failed to load ${file}`);
            return response.text();
        })
        .then(data => {
            document.getElementById(targetId).innerHTML = data;
            if (targetId === "page2"){
                createLineChart();
            }
        })
        .catch(err => console.error(err));
}

// 加载内容
document.addEventListener('DOMContentLoaded', () => {
    loadContent('page1', 'html/page1.html');
    loadContent('page2', 'html/page2.html');
    loadContent('page3', 'html/page3.html');
});



function createLineChart() {
    var ctx = document.getElementById('lineChart').getContext('2d');

    // 折线图的数据
    var data = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
            label: '销售额',
            data: [65, 59, 80, 81, 56, 55, 40], // 每个月的数据
            fill: false,
            borderColor: 'rgba(75, 192, 192, 1)',
            tension: 0.1
        }]
    };

    // 图表的配置
    var config = {
        type: 'line',  // 设置图表类型为折线图
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return tooltipItem.raw + ' 元';  // 自定义工具提示格式
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true // Y 轴从 0 开始
                }
            }
        }
    };

    // 创建并渲染图表
    const myChart = new Chart(ctx, config);
}