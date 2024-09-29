const core = require("@babel/core"); //babel核心模块
const t = require('@babel/types')

let sourceCode = `
  const sum = (a, b) => {
    console.log(this);
    return a + b;
  };
`;

/**
 * 思路：
 * 第一步：找到当前箭头函数要使用哪个作用域内的this，暂时称为父作用域
 * 第二步：往父作用域中加入_this变量，也就是var _this=this
 * 第三步：找出当前箭头函数内所有用到this的地方
 * 第四步：将当前箭头函数中的this，统一替换成_this
 */
function hoistFunctionEnvironment(path) {
  const thisEnv = path.findParent(parent => {
    return (parent.isFunction() && !parent.isArrowFunctionExpression()) || parent.isProgram()
  })

    //向父作用域内放入一个_this变量
  thisEnv.scope.push({
    id: t.identifier('_this'), //生成标识符节点,也就是变量名
    init: t.thisExpression() //生成this节点 也就是变量值
  })

  const thisPaths = []//获取当前节点this的路径
  //遍历当前节点的子节点
  path.traverse({
    ThisExpression(thisPath) {
      thisPaths.push(thisPath)
    }
  })

  thisPaths.forEach(thisPath => {
    thisPath.replaceWith(t.identifier('_this')) //this => _this
  })
}


const arrowFunctionPlugin = {
  visitor: {
    //如果是箭头函数，那么就会进来此函数，参数是箭头函数的节点路径对象
    ArrowFunctionExpression(path) {
      let { node } = path;
      node.type = "FunctionExpression";

      hoistFunctionEnvironment(path); //提升函数环境，解决this作用域问题

      //如果函数体不是块语句
      if(!t.isBlockStatement(node.body)) {
        //生成一个块语句，并将内容return
        node.body = t.blockStatement([t.returnStatement(node.body)])
      }

    },
  },
};

let targetSource = core.transform(sourceCode, {
  plugins: [arrowFunctionPlugin], //使用插件
});

console.log(targetSource.code);
