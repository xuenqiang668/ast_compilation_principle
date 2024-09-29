const core = require("@babel/core"); //babel核心模块
const t = require('@babel/types')
const path = require('path')

let sourceCode = `   console.log('eee')
`;

/*
const logPlugin = {
    visitor: {
        CallExpression(path) {
            const { node } = path

            // console.log(node.callee);
            node.arguments.push(t.stringLiteral('aaa'))
            node.arguments.push(t.numberLiteralTypeAnnotation(2222))
        }
    },
};
*/
// console.log(targetSource.code); // console.log('eee', "aaa", 2222);


function getfilename() {
    return path.basename(__filename)
}

let types = ['log', 'warn', 'error', 'table']
const logPlugin = {
    visitor: {
        CallExpression(path) {
            const { node } = path

            if (t.isMemberExpression(node.callee) && node.callee.object.name === 'console') {
                if (types.includes(node.callee.property.name)) {
                    const { line, column } = node.loc.start; //找到所处位置的行和列
                    console.log(line, column);
                       node.arguments.push(t.stringLiteral(`line: ${line}, column:${column}`))

                       const filename = getfilename()
                       node.arguments.push(t.stringLiteral(filename))
                }

            }
        }
    },
};

let targetSource = core.transform(sourceCode, {
    plugins: [logPlugin], //使用插件
});

console.log(targetSource.code); 
