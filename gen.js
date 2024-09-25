const escodegen = require('escodegen')
const { readFileFn } = require('./utils')

const ast = readFileFn('./json/data.json')
try {
    for (const astson of ast.body) {
        const expression = escodegen.generate(astson.declarations[0])
        console.log(expression);
    }
} catch (error) {
    console.log(error);
}

// console.log(html);