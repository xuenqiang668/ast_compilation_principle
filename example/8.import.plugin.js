const core = require("@babel/core"); //babel核心模块
const t = require('@babel/types')


const sourceCode = `
import {cloneDeep, sum} from 'lodash'

sum(1,2)

var a = 2
b = a
`;


const importPlugin = ({ libraryName }) => {

    return {
        visitor: {
            ImportDeclaration(path) {
                const { node } = path

                const declarations = []

                node.specifiers.map(specifier => {
                    const importedName = specifier.imported?.name


                    const local = specifier.local

                    const binding = path.scope.getBinding(importedName)

                    if (binding && binding.referenced) {
                        const importDeclaration = t.importDeclaration([t.importDefaultSpecifier(local)], t.stringLiteral(`${libraryName}/${importedName}`))
                        declarations.push(importDeclaration)
                    }
                })

                declarations.length && path.replaceWithMultiple(declarations); //替换当前节点
            }
        },
        /*
        
        const visitor = {
            ImportDeclaration(path, state) {
                const { libraryName, libraryDirectory = "lib" } = state.opts; //获取选项中的支持的库的名称
                
                const { node } = path; //获取节点
                const { specifiers } = node; //获取批量导入声明数组
                //如果当前的节点的模块名称是我们需要的库的名称，并且导入不是默认导入才会进来
                if (
                node.source.value === libraryName &&
                !types.isImportDefaultSpecifier(specifiers[0])
                ) {
            +     //遍历批量导入声明数组
            +     const declarations = specifiers.map((specifier) => {
            +       //返回一个importDeclaration节点，这里也可以用template
            +       return types.importDeclaration(
            +         //导入声明importDefaultSpecifier flatten
            +         [types.importDefaultSpecifier(specifier.local)],
            +         //导入模块source lodash/flatten
            +         types.stringLiteral(
            +           libraryDirectory
            +             ? `${libraryName}/${libraryDirectory}/${specifier.imported.name}`
            +             : `${libraryName}/${specifier.imported.name}`
            +         )
            +       );
            +     });
            +     path.replaceWithMultiple(declarations); //替换当前节点
                }
            },
            };

        */
    };
};
let targetSource = core.transform(sourceCode, {
    plugins: [importPlugin({ libraryName: 'lodash' })], //使用插件
});

console.log(targetSource.code);
