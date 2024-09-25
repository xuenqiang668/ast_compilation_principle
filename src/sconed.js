const NumReg = /[0-9]/
const PunctuatorRef = /[\+\-\*/]/

// 保存所有格式化的token
const tokens = []
// 当前正在处理的token 
let currentToken = {}

function emitToken(token) {
  // 重制 currentToken
  currentToken = { type: '', value: '' }
  // 将上一次传入的token参数保存到最终输入的tokens中
  tokens.push(token)
}
// 
/**
 * 状态机初始函数
 * @param {*} char 输入的字符
 * @return {*} 
 */
function start(char) {
  // 如果输入是一个数字
  if (NumReg.test(char)) {
    // 初始化 currentToken 为 Numeric类型
    currentToken = { type: 'Numeric', value: char }
    return numeric
  } else if (PunctuatorRef.test(char)) {
    // 初始化 currentToken 为 Punctuator 类型
    currentToken = { type: 'Punctuator', value: char }
    return punctuator
  }
}

// 当前进入数字状态
function numeric(char) {
  if (NumReg.test(char)) {
    // 如何匹配的是number
    currentToken.value += char
  } else if (PunctuatorRef.test(char)) {
    // 如果此时匹配标点符号 表示状态需要被改变了
    // 首先将旧的token输入到tokens中
    emitToken(currentToken)
    currentToken = { type: 'Punctuator', value: char }
    return punctuator
  }
  // 返回当前状态函数 下次迭代仍然会调用该函数执行
  return numeric
}

// 标点符号处理函数
function punctuator(char) {
  // 无论如何都要发射 因为标点符号在分词阶段不会被拼接起来
  emitToken(currentToken)
  if (NumReg.test(char)) {
    currentToken = { type: 'Numeric', value: char }
    return numeric
  } else if (PunctuatorRef.test(char)) {
    currentToken = { type: 'Punctuator', value: char }
    return punctuator
  }

  return punctuator
}

function tokenizer(input) {
  // 初始化状态机的状态
  let state = start
  input.split('').forEach(char => {
    state = state(char)
  })
  // 遍历结束后仍然需要发送一次最后
  tokens.push(currentToken)
  return tokens
}

console.log(tokenizer('100+200-300'))
