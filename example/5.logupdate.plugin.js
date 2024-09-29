const core = require("@babel/core"); //babel核心模块
const t = require('@babel/types')
const template = require("@babel/template");

let sourceCode = ` 
//四种声明函数的方式
function sum(a, b) {
  return a + b;
}
const multiply = function (a, b) {
  return a * b;
};
const minus = (a, b) => a - b;
class Calculator {
  divide(a, b) {
    return a / b;
  }
}
`;

const transformafter = `
import loggerLib from "logger"

function sum(a, b) {
  loggerLib()
  return a + b;
}
const multiply = function (a, b) {
  loggerLib()
  return a * b;
};
const minus = (a, b) =>{
  loggerLib()
  return  a - b;
}
class Calculator {
  divide(a, b) {
    loggerLib()
    return a / b;
  }
}

`

// myself coding
/*
const logUpdatePlugin = {
    visitor: {
        Program(path) {
            let loggerId

            path.traverse({
                ImportDeclaration({ node }) {
                    if (node.source.value === "logger") {
                        //说明导入过了
                        const specifiers = node.specifiers[0].local.name
                        loggerId = specifiers
                        path.stop()
                    }
                },


            })

            if (!loggerId) {
                //如果loggerId没有值，说明源代码中还没有导入此模块，需要我们手动插入一个import语句
                loggerId = path.scope.generateUid("loggerLib");
                const imported = t.importDeclaration([t.importDefaultSpecifier(t.identifier(loggerId))], t.stringLiteral('logger'))

                path.node.body.unshift(imported)


                path.traverse({
                    FunctionDeclaration(fpath) {
                        fpath.traverse({
                            ReturnStatement(returnpath) {
                                returnpath.insertBefore(t.expressionStatement(t.callExpression(t.identifier(loggerId), [])))
                            }
                        })
                    },

                    VariableDeclarator(fpath) {
                        fpath.traverse({
                            ReturnStatement(returnpath) {
                                returnpath.insertBefore(t.expressionStatement(t.callExpression(t.identifier(loggerId), [])))
                            },

                            ArrowFunctionExpression(arrowpath) {
                                let binaryExpression
                                if(t.isBinaryExpression(arrowpath.node.body)) {
                                    binaryExpression = arrowpath.node.body
                                }

                                arrowpath.node.body = t.blockStatement([t.returnStatement(binaryExpression)])
                            }
                        })
                    },

                    ClassDeclaration(fpath) {
                        fpath.traverse({
                            ReturnStatement(returnpath) {
                                returnpath.insertBefore(t.expressionStatement(t.callExpression(t.identifier(loggerId), [])))
                            }
                        })
                    }
                })
            }
        }
    },
};
*/



const logUpdatePlugin = {
    visitor: {
      //用来保证此模块内一定会引入一个日志的模块，state就是一个用来暂存数据的对象，是一个容器，用于共享
      Program(path, state) {
        let loggerId;
        //遍历子节点
        path.traverse({
          ImportDeclaration(path) {
            const { node } = path;
            if (node.source.value === "logger") {
              //说明导入过了
              const specifiers = node.specifiers[0];
              loggerId = specifiers.local.name; //取出导入的变量名赋值给loggerId
              path.stop(); //找到了就跳出循环
            }
          },
        });
  
        //如果loggerId没有值，说明源代码中还没有导入此模块 插入一个import语句
        if (!loggerId) {
          loggerId = path.scope.generateUid("loggerLib"); //防止冲突
          path.node.body.unshift(
            template.statement(`import ${loggerId} from 'logger'`)()
          );
        }
        //在state上面挂在一个节点 => logger()
        state.loggerNode = template.statement(`${loggerId}()`)();
      },
      //四种函数方式
      "FunctionDeclaration|FunctionExpression|ArrowFunctionExpression|ClassMethod"(
        path,
        state
      ) {
        const { node } = path;
        if (t.isBlockStatement(node.body)) {
          //如果是一个块级语句的话
          node.body.body.unshift(state.loggerNode); //在语句的头部添加logger函数节点
        } else {
          //处理箭头函数，生成一个块级语句，在第一行中插入loggerNode，然后return 之前的内容
          const newBody = t.blockStatement([
            state.loggerNode,
            t.returnStatement(node.body),
          ]);
          //替换老节点
          node.body = newBody;
        }
      },
    },
  };

let targetSource = core.transform(sourceCode, {
    plugins: [logUpdatePlugin], //使用插件
});

console.log(targetSource.code); 
