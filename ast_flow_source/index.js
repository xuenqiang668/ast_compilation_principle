/*
    LISP 代码： (add 2 (subtract 4 2))
    C    代码  add(2, subtract(4, 2))
    释义： 2 + （ 4 - 2 ）
*/
const { tokenizer, parser, transformer, codeGenerator } = require('./utils')
const { writeFn } = require('../utils')

// const tokens = tokenizer('(add 2 (subtract 4 2))')

// console.log('tokens',tokens);


// const ast = parser(tokens)

// console.log('ast', ast);
// writeFn(ast, 'ast.json')


function compiler(input) {
    let tokens = tokenizer(input); //生成tokens
    let ast = parser(tokens); //生成ast
    let newAst = transformer(ast); //拿到新的ast
    let output = codeGenerator(newAst); //生成新代码
    return output;
}


const output = compiler('(add 2 (subtract 4 2))')

console.log(output, 'output') // "add(2, subtract(4, 2));"