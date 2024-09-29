
`
  function join<T, W>(a: T, b: W) {}
  join < number, string > (1, "2");

`

`
整体思路：

第一步：先获取实参类型数组（1,'2'的类型数组：[number,string]）
第二步：获取函数调用时传递的泛型类型数组（[number, string]）
第三步：拿到函数定义时的泛型 [ T , W ]，然后结合第二步将 T赋值为number，W赋值为string，得到数组 [T=number,W=string]
第四步：计算函数定义时的形参类型数组：此时 a:number，b:string => [number,string]
第五步：a的形参类型跟a的实参类型进行比较，b的形参类型跟b的实参类型进行比较
`