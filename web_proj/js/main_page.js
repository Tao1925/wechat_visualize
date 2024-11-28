// 动态加载 HTML 内容
function loadContent(targetId, file) {
    fetch(file)
        .then(response => {
            if (!response.ok) throw new Error(`Failed to load ${file}`);
            return response.text();
        })
        .then(data => {
            document.getElementById(targetId).innerHTML = data;
        })
        .catch(err => console.error(err));
}

// 加载内容
document.addEventListener('DOMContentLoaded', () => {
    loadContent('page1', 'html/page1.html');
    loadContent('page2', 'html/page2.html');
    loadContent('page3', 'html/page3.html');
});
