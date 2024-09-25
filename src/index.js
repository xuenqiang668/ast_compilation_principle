// 前端工程师的编译原理指南-「有限状态机」
const NumReg = /[0-9]/
const PunctuatorRef = /[\+\-\*/]/

// 保存所有格式化的token
const tokens = []
// 当前正在处理的token 
let currentToken = {}


function emitToken(token) {
    // 重制 currentToken
    currentToken = {}
    // 将上一次传入的token参数保存到最终输入的tokens中
    tokens.push(token)
}

function strat(char) {
    if (NumReg.test(char)) {
        // 判断是否是第一个进来吗
        if (Object.keys(currentToken).length > 0) {
            // 不是的话进行叠加
            currentToken.value += char
            return
        }
        // init
        currentToken = { type: 'Numeric', value: char }
    }

    if (PunctuatorRef.test(char)) {
        // before 推入上一次的 currentToken
        emitToken(currentToken)
        // 初始化 currentToken 为 Punctuator 类型
        currentToken = { type: 'Punctuator', value: char }
        // after currentToken
        emitToken(currentToken)
    }
}

// 去除前后空格，并将中间多余空格替换为单个空格
function trimAndRemoveExtraSpaces(str) {
    return str.trim().replace(/\s+/g, ' ');
}


function tokenizer(input) {
    input = trimAndRemoveExtraSpaces(input)
    input.split('').forEach(char => {
        strat(char)
    })

    // 遍历结束后仍然需要发送一次最后
    tokens.push(currentToken)

    return tokens
}


console.log(tokenizer('100 + 200 - 300 '));