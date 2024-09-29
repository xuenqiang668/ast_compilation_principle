const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generator = require('@babel/generator').default

const code = `const hello = () => {}`
// transform  const world = () => {}

    // 1. 源代码解析成 ast
const ast = parser.parse(code)

// console.log(ast);

const visitor =  {
     // traverse 会遍历树节点，只要节点的 type 在 visitor 对象中出现，变化调用该方法
    Identifier(path) {
        const {node} = path //从path中解析出当前 AST 节点

        node && (node.name = 'world')  //找到hello的节点，替换成world
    }
}

traverse(ast, visitor)

// 3. 生成
const res = generator(ast)

console.log(res.code);