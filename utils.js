const fs = require('fs');
const path = require('path');

function writeFn(data, filename = 'data.json') {
    const dirPath = path.resolve(__dirname, './json'); // 目标目录
    const filePath = path.join(dirPath, filename); // 目标文件

    // 检查目录是否存在
    if (!fs.existsSync(dirPath)) {
        // 如果目录不存在，则创建目录
        fs.mkdirSync(dirPath, { recursive: true });
        console.log('目录已创建:', dirPath);
    }

    // 将数据转换为 JSON 字符串
    const jsonData = JSON.stringify(data, null, 2);

    // 写入文件
    fs.writeFile(filePath, jsonData, (err) => {
        if (err) {
            console.error('写入文件时出错:', err);
            return;
        }
        console.log('JSON 数据已成功写入到', filePath);
    });
}

// readfile
function readFileFn(filePath) {
    // 确保使用绝对路径
    const absolutePath = path.resolve(__dirname, filePath);

    try {
        // 使用 fs.readFileSync 读取文件内容
        const data = fs.readFileSync(absolutePath, 'utf8');
        console.log('文件内容:', JSON.parse(data));
        const res = JSON.parse(data)
        return res
    } catch (err) {
        console.error('读取文件时出错:', err);
    }
}


// 导出函数
module.exports = {
    writeFn,
    readFileFn
};



