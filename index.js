const esprima = require('esprima')
const {writeFn} = require('./utils')
// 深度遍历AST的工具库
const esTraverseFb = require('estraverse-fb')
// 生成AST节点的工具
const { builders } = require('ast-types')

//  因为 EscodeGen 对于 JSX 语法并不支持
// const test = `<div id='app'><p>hello esprima</p> juejin xeq</div>`
const test = `const a = 1  + 1; 

    const b =  333 * 2
`
// gen after 
{/* <div id="app"><p class="pclass">hello esprima</p>juejin xeq</div> */}


const ast = esprima.parseScript(test, { jsx: true, })

// write to watch
// writeFn(ast)

// 深度优先的方式
esTraverseFb.traverse(ast, {
    // 进入每个节点时都会出发enter函数
    enter: function (node) {
        const { type, openingElement } = node
        // 判断当前进入的节点是否是匹配的p节点
        if (type === 'JSXElement' && openingElement.name.name === 'p') {
            // 生成当前需要添加的属性节点
            const att = builders.jsxAttribute(
                // 第一个参数是name
                builders.jsxIdentifier('class'),
                // 第二个参数是value
                builders.literal('pclass')
            )
            // 为该节点的开始标签中添加生成的属性 class='pclass'
            openingElement.attributes.push(att)
        }
    },
    // 离开每个节点时会触发leave函数
    leave: function () {
        // nothing
    }
})



writeFn(ast)