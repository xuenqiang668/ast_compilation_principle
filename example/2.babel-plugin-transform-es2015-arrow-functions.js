const core = require("@babel/core"); //babel核心模块

let sourceCode = `
const sum = (a, b) => {
    return a + b;
}
`;

const arrowFunctionPlugin = {
  visitor: {
    //如果是箭头函数，那么就会进来此函数，参数是箭头函数的节点路径对象
    ArrowFunctionExpression(path) {
      let { node } = path;
      node.type = "FunctionExpression";
    },
  },
};

let targetSource = core.transform(sourceCode, {
  plugins: [arrowFunctionPlugin], //使用插件
});

console.log(targetSource.code);
