# JavaScript概念

webcore 负责解析html，css，渲染等相关工作

jscore  负责解析、执行 JavaScript 代码

js运行顺序是   浏览器通过 parse模块 来将我们的js代码转换成ast树的结构 在经过Ignation 转换成字节码  之后再将我们的字节码转换成机器码

js代码--->parse--->ast--->Ignation--->机器码

## 什么是SEO

搜索引擎优化(SEO) 是通过了解搜索引擎的运行规则来调整网站，以及提法哦网站再有关搜索引擎的内的排名的方式

元素语义化是利于 SEO的  因为 搜索引擎会根据我们应用的不同权重的属性来对我们的网站做一个排名

但是也不要只用h1 标签 这样可能被google搜索引擎作为一个作弊网站

## 浏览器的渲染流程

![image-20220528221542859](https://s2.loli.net/2022/05/28/zrPi4RIZo5lTGef.png)

浏览器会优先去加载我们的HTML  然后解析我们的html代码  生成我们的DOM树(上方的DOM指的是我们的script可能会对我们的dom树进行一个操作)   于此同时,浏览器会加载我们的css代码(解析) 然后生成我们的css规则 全部执行完毕之后会将HTML和css结合起来生成渲染树 现在还没有生成我们的位置信息   之后我们会对网页进行layout(布局)  用来计算我们的节点的位置和大小信息  dom树和渲染树不一定是一一对应的(可能有display:none;等 而layout就是用来做这个的)  等待我们的位置和大小信息确定下来之后就会做一个  绘制(painting) 绘制阶段会将我们的每个frame(结构体)转为屏幕上实际的像素点  绘制完成之后就会进行展示了

css会另开一个线程解析css规则  一般都会等我们的css和DOM执行完成之后再进行 渲染树操作(也就是当我们link代码过多的情况下是不会阻塞我们的DOM树解析的 但是会影响到我们的render tree进行渲染)   但是我们有些引擎会对我们的过程做一个优化 一般不会在这里傻等我们的css规则加载完毕

需要`注意`的是

* link元素不会阻塞我们的Dom tree的构建过程 但是会阻塞我们的render tree渲染过程
* render tree和dom tree不是一一对应的关系 比如对于display为none的元素 压根不会出现在我们的render tree中

> script元素的处理

浏览器在解析html的过程中,遇到了script元素是不能继续构建dom树的. 他会停止继续构建,首先下载JavaScript代码 并且执行JavaScript脚本,只有等到JavaScript脚本执行结束后 才会继续解析html构建DOM树

但是目前 脚本往往比html页面更重,处理时间需要更长  所以会造成页面解析阻塞,在脚本下载/执行完成之前,用户什么都看不到

为了解决这个问题 script元素给我们提供了两个属性   `defer`/`async`

```html
<body>
  <h2>我是标题</h2>
  <p>我是container</p>
  <!-- defer属性告诉浏览器不要等待脚本的下载,而继续解析html,构建DOM树 -->
  <script src="./index.js" defer></script>
  <script src="./index2.js" defer></script>    我们的defer是能保证顺序的 也就是 我们的index2文件一定在index文件加载完毕后加载 并且推荐将我们的defer放到head元素中

  <p>我是待解析的页面内容</p>
</body>
```

脚本会由浏览器来进行下载,但是不会阻塞DOM tree的构建过程 如果脚本提前下载好了,它会等待DOM tree构建完成,在DOMContentLoaded事件之前执行defer中的代码

`async`也是用新线程在进行下载的   但是并不会等待DOM tree构建 并且我们的script顺序也不一定 存在很大的不稳定因素

## 回流/重绘

`回流(reflow 重排)`

第一次确定我们的浏览器大小和位置的时候称之为布局  但是我们后续在script中移除了某个元素之后(或者在css隐藏某个元素之后) 我们的会重新做一个布局 对节点的大小、位置、重新修改这个过程就叫回流

需要注意的是 当我们调用getComputedStyle方法获取尺寸 位置信息也会引起回流

`重绘`

* 第一次渲染内容叫绘制
* 之后重新渲染称之为重绘

修改背景色 文字颜色 边框颜色 样式 都会引起重绘

一般我们`回流`之后都会引起`重绘`

`如何避免`

* 样式尽量一次性修改

* 尽量避免频繁操作dom

* 避免通过geicomputedstyle获取尺寸位置等

* 对某些元素使用position abs 或者 flx

  

## 合成

在我们绘制(paint)之后会进行一个合成流程(Composite)

这是浏览器的一种优化手段(可以将布局后的元素绘制到多个合成图层中)

```txt
比如我们的标准流元素在一个图层 定位元素在另外一个图层  并且新的图层可以利用GPU来进行渲染
	每个合成层都是单独渲染的.
生成合成层的属性:
3D transforms
video canvas iframe
opacity 动画转换时
position:fixed
will-change 一个实验性的属性,提前告诉浏览器可能发生哪些变化
animations 或 transition 设置了 opacity / transform

通过上述理解  如果执行动画的时候将我们的元素单独置于一个新图层的时候 是不会引起回流的  回流是非常影响性能的 也就是说 以后动画推荐使用 transform而不是left/right等
```

## 闭包

> 是在支持头等函数(第一公民)编程语言中,实现词法绑定的技术

实际上是一种结构,他存储了一个函数和一个关联环境  闭包跟普通函数最大的区别在于,当捕捉闭包的时候,它的自由变量会在捕捉时被确定,这样即使脱离了捕捉时的上下文,它依然能够照常运行

```js
const name  = '张三'
function foo(){
  console.log(name) //我们现在是通过作用域链查找到了外部变量name  而实际上 我们现在就是用到了闭包技术
}
```

可以这么说  一个普通的函数 能够访问外层的自由变量  那么这个函数和周围的环境 就是一个闭包   

* 广义:JavaScript中的函数都是闭包(因为可以通过作用域链访问到外层的函数)
* 狭义:只有函数中访问了外层的变量 才会形成闭包

## 浏览器前缀

为什么需要浏览器前缀  当css属性刚开始没有成为标准 浏览器为了防止后续会修改名字给新的属性添加了浏览器前缀

![image-20220426224016296](https://raw.githubusercontent.com/dianjiqiang/picGoEnt/main/image-20220426224016296.png)

以前的时候 我们都需要自己手动添加 	

现在一般打包工具都会自动帮助我们添加

## 浏览器内核

> 也可以叫做排版引擎

浏览器能做出代码解析和渲染出炫酷的页面是需要有我们的内核支持的  一般的不同的浏览器所使用的的内核也不同 (常见的浏览器内核)

![image-20220528220700512](https://s2.loli.net/2022/05/28/Y7GWRsAgmrhwc1S.png)



一般浏览器内核是由两部分组成的 以 webkit为例

* webCore 负责HTML解析,布局,渲染等等相关的工作
* JavaScriptCore解析,执行JavaScript代码

## v8引擎

```javascript
v8  是使用 c++来编写的  用于chrome和node
可以单独运行，也可以嵌入到c++中运行
```

![image-20220529142356499](https://s2.loli.net/2022/05/29/QpeO7igvRYaJh1u.png)

1. 将我们的JavaScript代码解析成抽象语法树
2. 在ignition中会将我们的抽象语法树转换成字节码,在虚拟机中运行
   1. 也有可能存在将我们的字节码通过turbofan转换成优化后的机器码  运行在虚拟机上
   2. 当我们函数的类型不一致的时候 还会通过Deoptimization反优化 转换成字节码(`见下方`)

```js
// 函数类型不一致 反优化
function foo(num1, num2) {
  return num1 + num2
}

foo(10, 20)
foo(10, 20)
foo(10, 20)
foo(10, 20)
foo(10, 20)
//上面我们一直在对我们的foo进行一个数字传参,v8引擎会将我们的函数转换成的字节码通过TurboFan转换成优化后的字节码
//但是如果我们现在突然给他传递一个 字符串参数 v8就会进行逆优化 将我们的代码转换成字节码后 再进行一遍优化操作
foo('可莉', '刻晴')
```

![image-20220529145302564](https://s2.loli.net/2022/05/29/mdkBlUIXbNzrRc2.png)

![image-20220529145952817](https://s2.loli.net/2022/05/29/1FCin5eu4mtQWBq.png)



## 全局执行上下文

```javascript
在我们进行第一步和第二步的时候会生成一个叫 js代码--->parse
globalObject的对象  里面存放的就是我们全局的变量   而且  window 就是globalObject
GlobalObject = {
    String,
    Number,
    object,
    setTimeOut,
    alert,
    console.log,
    ...
    后续定义的一些变量   
}
现在代码还没有运行 这个只是一个预解析  也就是说这个现象就叫做变量 提升 现在的变量的值 没有运行 所以他的值为 undefined

1. js代码中  我们的每个函数都会存放在函数执行上下文中(ECStack Execution Context Stack) 
2. 但是我们很多代码都是没有在函数中的 所以浏览器想要执行 在执行的时候需要把我们那些不是函数的代码存放在全局执行上下文中GEC(Global Execution Context) 
	然后再将我们的全局执行上下文函数存放在我们的函数执行上下文中 执行代码
3. 存放进去之后 我们的GEC会生成一个叫VO(viarible Object)的对象  这个VO指向的就是我们的GO
4. 之后开始执行代码
```

## 函数执行上下文

```javascript
在我们函数创建的时候 会创建一个函数执行上下文 AO(Activation Object)对象 
在我们还没有调用函数的时候浏览器会帮我预解析 但是还没有进栈  在我们调用这个函数的时候 我们就开始进栈  此后就是和栈结构一样的理念了
每一个AO作用域都是 AO本身+parentScope  也就是说 每个函数只能在本身AO对象和父组件中的AO对象中查找  当我们函数执行完毕之后我们的函数就会从我们的栈中弹出来然后销毁
在我们函数创建的时候 我们已经开始了预编译  也就是说 单是ES5中的function函数  他的this是和创建时的位置有关的 不是和调用的位置有关
```

## 纯函数

* 函数在相同的输入值的时候产生相同的输出
* 函数的输出和输入值以外的其他隐藏信息或状态无关,也和由i/o设备产生的外部输出无关  (不产生闭包 不使用io设备)
* 该函数不能有语义上可观察的函数副作用,例如"触发事件",使输出设备输出,或者更改输出值以外的物件内容等等
  * 在执行函数的时候 除了`返回值`以外,不能对`调用函数产生附加的影响`   比如 不能修改全局变量   不能修改参数  或者改变外部存储

```javascript
function(obj){
  obj.name = '张三' //我们这个就叫副作用 修改了我们这边的参数 影响了外部存储
}
```

## This指向

```javascript
函数的绑定主要分为四种   this 的指向
ES5 
直接调用 ---  foo()   ---   this = window
隐式调用 ---  obj.foo()  ---  this = obj(谁调用函数 this 就是谁)
显示调用 ---  foo.call('abc') foo.apply(obj) --- this = 第一个参数
bind调用 --- const fn = foo.bind('abc') fn() --- this = 'abc'
	需要注意的语法
    	obj.foo()()   (foo中是一个闭包，返回一个ES5函数的时候)   这样调用依然是直接调用
        (const fn = obj.foo())()  这样调用 依然是直接调用  直接调用我们的  fn()
		(obj.foo)()  如果这样调用 依然是隐式调用 前面的括号是可有可无的
ES6
箭头函数中没有this   this是undefined  所以 在我们使用this的时候 浏览器引擎会往我们上级作用域中查找
obj.foo() --- this = window
	需要注意的是 ES6中的this 是不能识别到 显示调用和bind调用(用了等于没用 依然会往上层作用域去寻找this)  使用new调用会报错

总结：  ES5中的this 是在调用的时候才确定的        而ES6由于没有this 我们使用的this 是创建这个函数的时候就决定好的
由于obj对象是没有作用域的 所以我们在使用箭头函数的时候 不会在obj对象中寻找 this       ---end
```

## 手动实现call apply bind

```javascript
//模拟 call函数执行过程

Function.prototype.keyieCall = function (useThis, ...args) {
  const fn = this //由于是foo隐式调用的 keyieCall 所以我们的this 必定是这个函数
  if (useThis === undefined || useThis === null) {
    useThis = window
  } else {
    useThis = Object(useThis) // 为了避免传递的this不是Object类型 我们可以在这里将他转成Object类型
  }
  useThis.fn = fn
  const res = useThis.fn(...args)
  delete useThis.fn
  return res
}

function foo() {}

foo.keyieCall('zhangsan')

//模拟 apply函数执行过程

Function.prototype.KeyieApply = function (useThis,data) {
  switch (useThis) {
    case undefined : useThis = window ; break
    case null : useThis = window ; break
    default : useThis = Object(useThis)  //防止用户传递非对象类型
  }
  useThis.fn = this
  data = (data===undefined || data===null) ? [] : data
  const res = useThis.fn(...data)
  delete useThis.fn
  return res
}
function mikus(name,age,gender) {
  console.log(this)
  console.log(name,age,gender)
  return name+gender
}

const res = mikus.KeyieApply('abc',['张三',18,'男'])
console.log(res)

//模拟 bind 函数的执行过程
Function.prototype.KeyieBind = function (useThis,...args) {
  switch (useThis) {
    case undefined : useThis = window ; break
    case null : useThis = window; break
    default : useThis = Object(useThis)
  }
  useThis.fn = this
  const data = (args === undefined || args === null) ? [] : args
  return function proxyFn(...args) {
    const data2 = (args === undefined || args === null) ? [] : args
    const res = useThis.fn(...data,...data2)
    delete useThis.fn
    console.log(res,useThis)
  }
}

function keyie(...args) {
  console.log(this)
  console.log(...args)
  return '收到结果了'
}

const Ke = keyie.KeyieBind('abc',1,2,3)
Ke('haha')
```

## 纯函数

```js
什么是纯函数
1.具有确定的输出     输入什么 输出什么 不会改变我们原先的数据  也就是说 如果我们发生了严格意义上的闭包 那么我们这个函数就不是一个纯函数 这个也是闭包的一个缺点之一
2.不会产生副作用     向控制台输出一些不必要的内容 和 调用一些事件对象都是会产生副作用的
function printInfo(info){
    // info.name = '18'  //如果有了这行语句 函数肯定不是纯函数  因为他修改了函数外的数据  不是传递进来什么数据 就返回什么数据了
    // console.log(info.name,info.age)  //如果有了这行语句，这个函数在严格意义上来说 也不是一个纯函数，
    //他向控制台输出了一些不必要的内容，  但是也可以说他是一个纯函数，因为这个输出并不会对我们的内容产生一些比较恶劣的影响
    return {
        ...info,
        gender:'男'
    }
    //这样的返回 返回的就是我们的一个新对象，而不会对我们原有的对象产生影响， 所以我们这个函数就是纯函数
}

纯函数的优点
我们的JavaScript 函数作为一等公民 如果我们的函数编写采用纯函数的话，可以避免很多报错  因为我们自始至终都没有修改我们原有的数据
我们可以 安心的编写 和 安心的使用
你在 写的时候 保证的函数的纯度，只是 单纯实现自己的业务逻辑 即可， 不需要关心传入的内容是如何获得的 或者 依赖其他的外部变量 是否已经发生了修改
在你用的时候 ，你确定你的输入内容不会被任意篡改， 并且自己确定的输入，一定会有确定的输出
```

## 柯里化

```js
什么是柯里化
	只 传递给函数一部分参数来调用它，让 它返回一个函数去处理剩余的参数
    这个过程就称之为柯里化   柯里化会产生闭包以及回调地狱
function foo(a,b,c){
    return a+b+c
}
foo(1,2,3)
function bar(a){
    return function (b){
        return function (c){
            return a+b+c
        }
    }
}
bar(1)(2)(3)
//以上这个过程就叫做柯里化
const bar2 = a => b => c => a+b+c
bar2(1)(2)(3)
const res = bar2(1)(2)
res(3)
res(4)
res(5)
res(6)
//以上为简化柯里化
优点
1.让函数的处理 和返回的结果 尽可能单一
2.可以优化函数的复用

手写柯里化函数
const keyieCurrying = (fn) => {
  const curried = (...args)=>{  //看起来比较别扭，我们最后会将这个函数返回出去
    if (fn.length <= args.length){
      return fn(...args)  //这里如果我们使用的是ES5中的function要使用call调用 因为不知道用户下次给我们执行这个函数的时候是使用直接调用还是隐式绑定
    }else{
      return (...args2) => {
        return curried(...[...args,...args2]) //在我们条件不成立时要进行递归运算
      }
    }
  }
  return curried
}

const sum = (num1,num2,num3)=> num1+num2+num3

const curried = keyieCurrying(sum)
console.log(curried(10,20)(30))
console.log(curried(10)(20)(30));
```

## 原型原型链

```js
隐式原型 [[prototype]]      我们可以直接通过 obj.__proto__ 来获取到 或者是是用 Object.getPrototypeOf(obj) 这个是标准 来获取到
	对象是仅仅具有隐式原型的 只有函数才会有 prototype  而隐式原型指向的就是我们的顶层原型
函数的原型 prototype    我们的函数会多出来一个显示原型    在我们通过 new 关键字来调用这个函数的时候  内部会将我们的 [[prototype]] === prototype
	也就是说  只有我们的构造函数本身具有这个显示原型  我们通过 new 关键字 new 出来的对象是不具有这个显示原型这个对象的  只有隐式原型 __proto__ 这个东西
函数原型中的constructor   fun.prototype.constructor === fun

// Object的原型的理解
const obj = { name: "keyie" }
console.log(obj.__proto__) // [Object: null prototype] {}    当我们显示这个东西的时候   我们这个原型 就是顶层原型了

(obj1 = {}) === (new Object()) //创建了一个对象

//构造函数的原型理解
function Person(){
    
}
const p = new Person() 
	1.在内存中创建了一个对象，赋值给this  const this = {}
    2.将Person函数的显示原型prototype赋值给隐式原型__proto__  this.__proto__ = Person.prototype
		顶层原型的特殊性： 该对象上有原型属性，但是它的原型属性已经是指向null了    该对象上有很多默认的属性和方法
        
//js中实现继承方法1：原型链继承方案(不推荐)  直接将Student.prototype = new Person()
//js中实现继承(借用构造函数的方案+原型式继承--对象) / 寄生组合式继承
const Person = function (name,age,gender) {
    //弊端1在这里 我们的Person 在 new的时候会执行一次 然后在我们赋值传递参数的时候又会被调用一次
  this.name = name
  this.age = age
  this.gender = gender
}
Person.prototype.running = function(){
  console.log(this.name+"在跑步")
}
Person.prototype.eating = function(){
  console.log(this.name+"在吃东西")
}
Person.prototype.bomb = function () {
  console.log(this.name+"在炸鱼")
}

function inheritPrototype(subType,superType){
    subType.prototype = Object.create(superType.prototype)
    Object.defineProperty(subType.prototype,"constructor",{
        configurable:true,
        enumerable:false,
        value:subType,
        writable:false
    })
}

const Student = function (name,age,gender) {
  Person.call(this,name,age,gender)  //我们在这里通过call的方式传递我们需要传递过去的this 就可以实现参数的传递了
    //我们原本是调用的是Person中的函数  但是我们赋值的东西 却是帮我们的Student赋值的
}

"解决弊端的方法"
inheritPrototype(Student,Person)
/*
subType.prototype = Object.create(Person.prototype)  //在这里我们将Student的原型赋值给了一个新的对象，而这个对象的原型指向我们的Person类
Object.defineProperty(Student.prototype,"constructor",{
    configurable:true,
    enumerable:false,
    value:Student,
    writable:false
})
*/

//使用下面 new 的方式产生的弊端  上方还有产生的弊端1
//Student.prototype = new Person()  //在这里我们在Student原型对象上new Person就相当于我们重新规划了prototype 让他直接指向Person的显示原型
//弊端2在这里,当我们在原型对象上 new.Person() 的时候我们JS引擎还会在原型对象上保存 name age gender 值为 undefined
Student.prototype.study = function () {
  console.log(this.name+"在读书")
}

const s1 = new Student('可莉',12,'喜欢炸鱼')
console.log(s1)
s1.bomb()
```

### 原型继承关系

![image-20220605093157987](https://s2.loli.net/2022/06/05/Le4H7sBt5l1YcTa.png)

1. foo 是Foo的实例对象
2. obj是Object的实例对象
3. Function Object Foo 都是Function的实例对象
4. 原型对象默认创建时,都是指向Object的显示原型的(Object隐式原型指向的是null)
5. Object是Foo的父类也是Function的父类(Object是Function创建出来的  而Function又是Object的子类)

## 响应式

```js
const obj = {
  name:'可莉',
  age: 12
}
//现在我们要对obj对象做一个响应式 , 现在我们将方法都封装到一个类中 这样可以增加代码的扩展性和复用性
let activeReactiveFn = null  //当前需要收集的响应式函数
class Depend{
  constructor() {
    this.reactiveFns = new Set() //当我们一个函数中获取多次get的话 里面就会多出很多相同的函数 所以我们就应该使用set
  }

  notify(){
    this.reactiveFns.forEach(item => item()) //当监测到数据发生改变调用我们这个方法
  }

  depend(){
    if (activeReactiveFn)
      this.reactiveFns.add(activeReactiveFn)
  }
}
// 自动上传监听的函数
function watchFn(fn){
  activeReactiveFn = fn
  fn()
  activeReactiveFn = null
}

//因为在我们监听的时候 无法获取到准确的depend对象 所以我们要再次封装一个函数 来专门获取正确的depend
const targetMap = new WeakMap()
function getDepend(target,key){
  let map = targetMap.get(target)
  if (!map){
    map = new Map() //新建这个map 如果第一次取没有的话
    targetMap.set(target,map)
  }

  //现在我们的map已经设置好了，  我们需要根据我们的map来获取对应的depend对象了
  let depend = map.get(key)
  if (!depend){
    depend = new Depend()
    map.set(key,depend)
  }
  return depend
}

// 上面我们完成了自动收集数据和执行 现在我们要检测数据变化自动执行了
function watchObj(obj){
  return new Proxy(obj, {
    get(target, p,receiver) {
      const depend = getDepend(target,p)  //在函数一执行 我们其实就可以获取到对应的depend了
      // if(activeReactiveFn)
      //   depend.addReactive(activeReactiveFn) //再一次封装
      depend.depend()
      return Reflect.get(target,p,receiver)
    },
    set(target, p, value, receiver) {
      Reflect.set(target,p,value,receiver)
      const depend = getDepend(target,p)
      depend.notify()
    }
  })
}
const proxyObj = watchObj(obj)
//一旦我们这里进行了代理， 我们下面就再也不要使用我们原先的对象了 全部使用我们的代理对象

//添加对象监听方法
watchFn(function (){
  proxyObj.name   //我们开始一来就调用我们需要执行的get方法
  // proxyObj.age
  proxyObj.name
  console.log('这个是name/age发生变化需要执行的',proxyObj)
})

Reflect.set(proxyObj,'name','赵雷')
// Reflect.set(proxyObj,'name','香奈儿')
// Reflect.set(proxyObj,'name','露可娜娜')
// Reflect.set(proxyObj,'name','亚索')
// Reflect.set(proxyObj,'age','19')
// Reflect.set(proxyObj,'name','香奈儿')

const proxyInfo = watchObj({
  name:'玩泥巴',
  age:15,
  gender:'女'
})

watchFn(function () {
  proxyInfo.gender
  console.log(proxyInfo)
})

Reflect.set(proxyInfo,'gender','男')                          
```

## 宏任务,微任务

规范: 在执行任何的宏任务之前, 都需要先保证微任务队列已经被清空

![image-20220418154041478](https://raw.githubusercontent.com/dianjiqiang/picGoEnt/main/image-20220418154041478.png)



## node中的事件循环

![image-20220424222631467](https://raw.githubusercontent.com/dianjiqiang/picGoEnt/main/image-20220424222631467.png)

![image-20220424222741329](https://raw.githubusercontent.com/dianjiqiang/picGoEnt/main/image-20220424222741329.png)

### 事件队列循环顺序

![image-20220424222834403](https://raw.githubusercontent.com/dianjiqiang/picGoEnt/main/image-20220424222834403.png)

## 导入/导出

### 异步import函数

```js
import("./base.js").then((res=>) console.log(res)) // 异步的import 直接调用我们的import函数 他会返回promise对象
```

### import解析流程

一般es module解析分为三个阶段

* 构建,根据地址查找到js文件 并且`下载`,将其解析成模块记录(module record) 模块记录也是我们模块中的数据结构
  * 构建阶段会将我们的代码进行一些(静态分析)   
    * 静态分析只会解析我们最顶层的一些 导入 代码
    * 所以只能将我们的import代码放置顶层 静态分析解析到我们的import代码之后会在我们创建的数据结构(模块记录)中记录我们的依赖的文件 并帮助下载
      * 下载完毕之后 再对我们刚下载的文件做一个静态解析 直到调用顶层  
    * 在我们请求的时候会将我们的依赖文件存放到 map 映射中 所以在请求同文件的时候不会对其进行重复下载
* 实例化,对模块记录进行实例化,并且分配到内存空间,解析模块的导入和导出语句 把模块指向对应的内存地址
* 运行  执行代码,计算值,并且将值填充到内存地址中

所以 import 既有`静态分析`也有`动态运行`

## JSON

```js
//以数组的方式传递第二个参数会控制哪几个进行转换
JSON.stringify(data, ['name', 'age'])

//以函数的方式传递第二个参数可以具体控制返回值
JSON.stringify(data, (key, value) => {
  console.log(key, value)
  if (key === 'age') value++
  return value
})

//第三个参数可以控制转换之后的格式  数字类型代表每个变量换行并且添加几个空格
  //当然也可以添加其他符号
console.log(JSON.stringify(data, null, 2))

JSON.parse 也是和上方stringify同理
```

## 拷贝

* 直接拷贝

  * 直接拷贝是 AB指向同一个内存地址

* 浅拷贝

  ```js
  const a = {
    name: '可莉',
    age: 12,
    hobby: {
      name: '琴',
      age: 16
    }
  }
  
  //这样就完成了浅拷贝,浅拷贝只能是拷贝到基础变量 内层 bobby是object类型指向的是一块内存地址 所以无法进行浅拷贝
  const b = { ...a }
  const obj = Object.assign({},info)  //这是创建一个新对象 将info的值放到该对象中
  a.hobby.name = '迪卢克' // 现在我们改变了a中的hobby属性
  console.log(b.hobby) //现在 b 的hobby也跟着改变了,  这就是浅拷贝
  ```

* 深拷贝(将一个对象中的所有属性完全拷贝 也就是生成一些新的数据 指向的是另一块内存地址)

  ```js
  const a ={
    name: '可莉',
    age: 12,
    hobby: {
      name: '琴',
      age: 16
    }
  }
  
  //第一种方式
  const b = JSON.stringify(a)
  const c = JSON.parse(b)
  a.hobby.name = '迪卢克'
  console.log(c)  //现在我们打印的依然是 琴   通过JSON转换虽然方便 但是JSON是无法对函数进行处理的
  ```

### 手写深拷贝

```js
function deepCopy(obj) {    
  //如果是原始类型 直接返回
  if (!(obj instanceof Object)) return obj

  //如果是set类型
  if (obj instanceof Set) {
    const newSet = new Set()
    for (const setItem of obj) {
      newSet.add(deepCopy(setItem))
    }
    return new Set()
  }

  //如果是函数类型 是不需要做深拷贝的
  if (obj instanceof Function) return obj

  //如果是对象类型 才需要创建
  let newObj = null
  if (Array.isArray(obj)) {
    newObj = []
  } else {
    newObj = {}
  }
  for (const key in obj) {
    newObj[key] = deepCopy(obj[key])
  }
  return newObj
}
```

## 浏览器存储方式

### Storage

WebStorage主要提供了一种机制,可以他那个浏览器提供一种比cookie更直观的key  value的存储方式

* localStorage : 本地存储,提供的是一种永久性的存储方式,在关闭掉网页重新打开时,存储的内容依然保留
* sessionStorage : 回话存储,提供的是本次会话的存储,在关闭掉会话时,存储的内容会被清除

常见的属性和方法

```js
//localStorage 和 sessionStorage 两个的属性和方法是一致的
localStorage.setItem('name', '可莉') //向localStorage中保存 JSON属性 属性名为name 属性值为 可莉
localStorage.getItem('name') //获取localStorage中对应的 key 值的属性
localStorage.removeItem('name') //删除对应key值的属性
localStorage.clear() //清空
localStorage.key(0) //获取localStorage中对应 index 的属性

console.log(localStorage.length) //获取localStorage中保存的变量数 可用作遍历操作
```

### cookie

cookie曾经是浏览器非常流行的存储方案  现在一般都是服务器自动给我们带过去

* cookie在浏览器一般做身份验证 存储在本地终端

cookie可以分为内存cookie 和 硬盘cookie

* 内存cookie由浏览器维护,保存在内存中,浏览器关闭时,cookie就会消失
* 硬盘cookie保存在硬盘,有一个过期时间,用户手动清理或者是时间到时才会被清理.

cookie的生命周期

* 默认情况下的cookie是内存cookie
* 如下 可以在set cookie的时候给我们cookie设置过期事件

cookie作用域(允许cookie发送给哪些URL)

* Domain:指定哪些主机可以接受cookie
  * 如果不指定,默认是origin  不包括子域名
  * 如果指定Domain,则包括子域名. 例如.如果设置Domain = meant.cc 则 cookie 也包含在子域名中如 www.meant.cc
* Path:指那些主句可以接受cookie
  * 设置Path=/docs    /docs   /docs/web   docs/web/http  都能被匹配到

```js
const Koa = require('koa')
const Router = require('koa-router')

const app = new Koa()

const testRouter = new Router() // 创建koarouter实例

testRouter.get('/test', (ctx, next) => {
  ctx.cookies.set('name', 'keyie', {
    maxAge: 50 * 1000, //设置过期秒钟
    expires: 设置的是date.toUTCString() 设置格式是 expires = date-in-GMTString-format
  })
  ctx.body = 'test'
})

testRouter.get('/demo', (ctx, next) => {
  const value = ctx.cookies.get('name')
  ctx.body = `在cookie中获取到的名字是:${value}`
}) 

app.use(testRouter.routes()) //调用这个函数 激活koa路由实例

app.listen(3003, () => {
  console.log('端口启动成功:http://localhost:3003/test')
})
```

通过JS代码是可以增加我们的cookie的

```js
document.cookie = "age=18"  //这样是能增加的  增加之后 我们拿到的也仅仅只有我们在客户端设置的cookie

//如果我们想将客户端给我携带过来的cookie删除掉的话 我们是无法进行删除操作的  只能强行将我们的cookie设置过期掉
document.cookie = "name=keyie;max-age=0"// 设置过期时间 将cookie过期掉
```

### indexDB

是一种底层的API 可以在客户端存储大量的数据  是一种事物型的数据库

indexDB本身就是基于事物的,我们只需要指定数据库模式,打开与数据库的链接,然后检索和更新一系列事物即可

```html
<body>
  <button>新增</button>
  <button>查询</button>
  <button>删除</button>
  <button>修改</button>
  <script>
    // 打开数据库(这个方法会返回一个request对象  open 打开这个数据库 如果有打开,如果没有创建后打开)
    const DBrequest = indexedDB.open('keyie')
    DBrequest.onerror = function () {
      console.log('打开数据库失败')
    }
    let db = null
    DBrequest.onsuccess = function () {
      db = event.target.result //在这里拿到我们的数据库对象
      console.log('打开数据库成功')
    }
    //第一次打开或者是我们版本发生了更新执行回调
    DBrequest.onupgradeneeded = function (event) {
      //在这里拿到我们的数据库对象
      const db = event.target.result

      //创建一些存储对象  这个表的名字叫users 主键是 id
      db.createObjectStore('users', { keyPath: 'id' })
    }

    class User {
      constructor(id, name, age, height) {
        this.id = id
        this.name = name
        this.age = age
        this.height = height
      }
    }

    const users = [
      new User('001', '可莉', '12', '123'),
      new User('002', '迪卢克', '15', '177'),
      new User('003', '公子', '16', '179'),
      new User('004', '琴', '16', '162')
    ]

    const btns = document.querySelectorAll('button')
    btns.forEach((item, index) => {
      item.onclick = function () {
        //在这里告诉我们 点击这个事物对象之后 需要操作哪张表 第二个传递我们的模式
        const transaction = db.transaction('users', 'readwrite')
        //我们要拿到的是我们 transaction中对应的 users表
        const store = transaction.objectStore('users')

        switch (index) {
          case 0:
            for (const user of users) {
              const request = store.add(user) //每次对我们数据库进行操作都会返回一个request对象
              request.onsuccess = function () {
                console.log(`${user},插入成功`)
              }
            }
            //在所有事物完成之后会回调我们的 oncomplete 函数
            transaction.oncomplete = function () {
              console.log('数据全部存储成功')
            }
            break
          case 1:
            //查询方式1(知道主键且确定主键的值,并且只有一个值)
            // const request = store.get('001')
            // request.onsuccess = function (event) {
            //   console.log(event.target.result)
            // }
            //查询方式2(根据游标查询所有的值,如果想要查询另一条需要调用continue)
            const request = store.openCursor()
            request.onsuccess = function (evnet) {
              const cursor = event.target.result
              if (cursor) {
                if (cursor.key === '004') {
                  console.log(cursor.key, cursor.value)
                } else cursor.continue() //如果查询的不是 id=004 那么就再把游标往下查
              }
            }
            break
          case 2:
            const removeRequest = store.openCursor()
            removeRequest.onsuccess = function (evnet) {
              const cursor = event.target.result
              if (cursor) {
                if (cursor.key === '004') {
                  cursor.delete() //拿到游标之后直接点击删除就可以了
                } else cursor.continue() //如果查询的不是 id=004 那么就再把游标往下查
              }
            }
            break
          case 3:
            const updateRequest = store.openCursor()
            updateRequest.onsuccess = function (evnet) {
              const cursor = event.target.result
              if (cursor) {
                if (cursor.key === '004') {
                  const value = cursor.value
                  value.name = 'Miku'
                  cursor.update(value) //拿到对象后修改放入就可以了
                } else cursor.continue() //如果查询的不是 id=004 那么就再把游标往下查
              }
            }
        }
      }
    })
  </script>
</body>
```

## 防抖和节流

### 防抖

一般当我们在搜索引擎输入数据的时候 都会生成一些帮助搜索的联想项目  如果我们输入特别快 一秒钟输入了9个字符的话 我们就需要发送9次网络请求 很浪费性能 我们想让用户输入完成过500ms再进行网络请求 我们就采用防抖

防抖想达到的效果 是不让一些东西频繁触发影响我们的性能

> 采用库的方式实现(Underscore)

```html
<body>
  <input type="text" />
  <script src="./node_modules/underscore/underscore-min.js"></script>
  <script>
    const input = document.querySelector('input')
    let counter = 0
    const inputChange = function () {
      console.log(`发送了${++counter}次网络请求`)
    }

    input.oninput = _.debounce(inputChange, 500) //在我们等待500ms之后 没有改变再执行 这就是防抖
  </script>
</body>
```

> 手写

```js
const inputEl = document.querySelector('input')
let counter = 0

function inputChange() {
  console.log(`发送了${++counter}次网络请求`, this)
}
function debounce(fn, timeout, immediate = false) {
  let timer = null
  let onceIn = immediate //采用第三个变量来控制是否立即执行
  const _debounce = function (...args) {
    //如果我们下次执行过来的时候 我们的timer有值的情况下的话 关闭上次的
    if (timer) {
      if (onceIn === true) {
        onceIn = false
        fn.apply(this, args)
      }
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      //我们执行的时候 fn() 是直接调用的我们的this是指向window的
      fn.apply(this, args) // 我们应该在执行的时候改变我们的this
    }, timeout)
  }
  //这个我们返回出去就相当于 我们oninput的时候实际上是在执行这个函数
  return _debounce
}
inputEl.oninput = debounce(inputChange, 500, true)
```

### 节流

在一定的时间内 限制某一事件的频率

如果说防抖是让我们执行的事件延迟执行 那么节流就是在我们一定时间内执行若干次后只进行一次操作

> 采用库的方式实现

```html
<body>
  <input type="text" />
  <script src="./node_modules/underscore/underscore-min.js"></script>
  <script>
    const inputEl = document.querySelector('input')
    let counter = 0
    function inputChange() {
      console.log(++counter)
    }
    inputEl.oninput = _.throttle(inputChange, 2000)
  </script>
</body>
```

> 自己的方式实现

```js
const inputEl = document.querySelector('input')
let counter = 0
function inputChange(...args) {
  console.log(++counter, this, args)
}
function throttle(fn, interval, options = { leading: true, trailing: false }) {
  const { leading, trailing } = options
  let lastTime = 0
  let timer = null
  const _throttle = function (...args) {
    const nowTime = new Date().getTime() //现在的时间
    if (lastTime === 0 && leading === false) {
      //如果我们的lastTime === 0  并且我们第一次决定不触发的时候 我们才会将lastTime 赋值nowTime
      lastTime = nowTime
    }
    //用现在的时间减去上一次执行后的时间 与 我们的时间间隔相比较 推出现在是否应该执行
    const remainTime = interval - (nowTime - lastTime)
    if (remainTime <= 0) {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
      fn.apply(this, ...args)
      lastTime = nowTime
      // 一旦我们这里开始执行之后 我们就没必要再在下面增加定时器了 如果增加会出现执行多次情况
      return
    }
    if (trailing && timer === null) {
      timer = setTimeout(() => {
        timer = null
        fn.apply(this, ...args)
        // 为了避免我们我们leading为true的时候重复执行  我们这边必须将lastTime置为我们现在正在执行的时间
        lastTime = !leading ? 0 : new Date().getTime()
      }, remainTime)
    }
  }
  return _throttle
}

inputEl.oninput = throttle(inputChange, 1000, { leading: false, trailing: true })
```

>  添加取消按钮和返回值

```html
  <body>
    <input type="text" />
    <button>取消</button>
    <script>
      const inputEl = document.querySelector('input')
      const btnEl = document.querySelector('button')
      let counter = 0
      function inputChange(...args) {
        console.log(++counter, this, args)
        return '这是我返回来的值'
      }
      function throttle(
        fn,
        interval,
        options = { leading: true, trailing: false }
      ) {
        const { leading, trailing, resultCallback } = options
        let lastTime = 0
        let timer = null
        const _throttle = function (...args) {
          const nowTime = new Date().getTime() //现在的时间
          if (lastTime === 0 && leading === false) {
            //如果我们的lastTime === 0  并且我们第一次决定不触发的时候 我们才会将lastTime 赋值nowTime
            lastTime = nowTime
          }
          //用现在的时间减去上一次执行后的时间 与 我们的时间间隔相比较 推出现在是否应该执行
          const remainTime = interval - (nowTime - lastTime)
          if (remainTime <= 0) {
            if (timer) {
              clearTimeout(timer)
              timer = null
            }
            const result = fn.apply(this, ...args)
            if (resultCallback) resultCallback(result)
            lastTime = nowTime
            // 一旦我们这里开始执行之后 我们就没必要再在下面增加定时器了 如果增加会出现执行多次情况
            return
          }
          if (trailing && timer === null) {
            timer = setTimeout(() => {
              timer = null
              const result = fn.apply(this, ...args)
              if (resultCallback) resultCallback(result)
              // 为了避免我们我们leading为true的时候重复执行  我们这边必须将lastTime置为我们现在正在执行的时间
              lastTime = !leading ? 0 : new Date().getTime()
            }, remainTime)
          }
        }
        //添加取消方法
        _throttle.cancel = function () {
          if (timer) clearTimeout(timer)
        }
        return _throttle
      }
      const throttleFn = throttle(inputChange, 1000, {
        leading: false,
        trailing: true,
        resultCallback: function (res) {
          console.log('接收到的结果是' + res)
        }
      })
      inputEl.oninput = throttleFn
      btnEl.onclick = throttleFn.cancel
    </script>
  </body>
```

## 事件总线

```js
class EventBus {
    on(eventName, callback) {
        if (this[eventName]) {
            this[eventName].push(callback)
        } else {
            this[eventName] = [callback]
        }
    }
    emit(eventName, ...args) {
        let result = this[eventName].length > 1 ? [] : null
        if (this[eventName]) {
            this[eventName].forEach((item) => {
                let res = item(...args)
                res === undefined || res === null ? '' : result.push(res)
            })
        }
        result = result.length === 1 ? result[0] : result
        return result
    }
}
//mitt 库中的内容
const eventBus = new EventBus()
eventBus.on('navclick', (zs) => {
    console.log(zs)
    return '返回回来的数值'
})
eventBus.on('navclick', () => {
    console.log('navclick listener -2')
})
//当前组件发出的监听
const btn = document.querySelector('button')
btn.onclick = function () {
    const res = eventBus.emit('navclick', 'zs')
    console.log(res)
}
```

## 包管理工具

> package.json文件

```json
scripts 属性用于配置一些脚本命令
dependencies 属性指无论是开发坏境还是生产环境都需要的包 默认是--save 也就是安装在 dependencies  
devDependencies 是在生产环境不需要的包  -D(--save-dev)
```

### npm

> npm install

![image-20220701212705891](https://picgoload-1310759961.cos.ap-nanjing.myqcloud.com/image-20220701212705891.png)

### *pnpm

pnpm是非常优秀的包管理工具 (pnpm add xxx)

具有快速,高效,支持monorepos(内置单仓库多包),严格(创建了一个非平铺的包管理目录node_modules,因此代码无法访问任意包)的特点

> 硬链接和软连接(符号链接)

硬链接是指电脑文件系统中的多个文件`平等`地共享同一个文件存储单元,删除一个文件名字后,还可以用其他名字继续访问该文件(相当于JS中的引用赋值,这是不占空间的,复制+同步更新)

* 如果单纯的是复制的话,我们的两个文件指向的就是不同的数据 mklink /H foo.js bar.js(通过硬链接的方式创建一个叫foo.js的文件 参照与 bar.js)

符号链接是一类特殊的文件,其包含有一条绝对路径或者相对路径的形式指向其他文件或目录的引用(相当于磁盘中的快捷方式)

* mklink foo.js bar.js

> `pnpm的优势`

`优势1:管理包都存储到同一个位置,需要使用的时候采用硬链接链接,不消耗磁盘空间`

当你使用npm或yarn的时候,如果你有100个项目,并且所有的项目都有一个相同依赖的包,那么,你在硬盘上就要保存100份该依赖包的副本.

如果你使用的时候pnpm,依赖包将被存放在一个统一的位置

* 如果你同一依赖包使用相同的版本,那么磁盘上就只有这个依赖包的一份文件
* 如果你对同一依赖包需要使用不同的版本,则仅有版本之间不同的文件会被存储起来
* 所有的文件都保存在磁盘的统一位置
  * 当你安装软件包的时候,其包含的所有文件都会硬链接到此位置,且不占用额外的磁盘空间(这能够方便地共享相同版本的依赖包)

`优势2:非扁平化管理node_modules目录,包更安全`

当使用yarn和npm安装依赖包的时候,所有软件包都将被提升到node_modules的根目录下.其结果是,源码可以访问本不属于当前项目所设定的依赖包

> 指令

```shell
pnpm install   #安装dependencies所有包
pnpm add <pkg>  #安装对应的包
pnpm remove <pkg>   #卸载
pnpm <cmd>  #执行script指令
```

> 包存储位置

在windows上:%LOCALAPPDATA%/pnpm/sotre

### 发布

写好东西且有自己的npm账号后

账号:keyie

邮箱:QQ邮箱

密码:zgy1234561

> npm login(登录自己的邮箱)

> npm publish(发布包)

更新包

> 首先修改我们的版本号
>
> npm publish(再次发布)

> npm unpublish(删除包)

> npm deprecate(过期包) 但是还是能下载 不过下载的时候显示已过期



# ES新特性

## class

```js
//定义一个Person类
class Person{
  //在内存中创建一个对象  this = {}
  //在类的原型prototype赋值给创建出来的对象  moni.__proto__ = Person.prototype
  //执行constructor 中的代码  返回  this
  constructor(name,age){
    this.name = name
    this.age = age
    this.firstName = '张'
    this.lastName = '三'
   	// this.fullName = '张-三'  // 因为下面就有我们的get fullName方法 所以我们这里的fullName 是可写可不写的
  }
  //在构造器中定义方法
  eating(){   //这里编写的方法就相当于 Person.prototype.eating = function(){  }  这个东西就相当于一个语法糖而已
    console.log(this.name + "在吃东西")
  }
  running(){
    console.log(this.name + "在吃东西")
  }
  //在类中编写我们的类的访问器方法
  get fullName(){
    return this.firstName+"-"+this.lastName
  }
  set fullName(newValue){
    const arr = newValue.split('-')
    this.firstName = arr[0]
    this.lastName = arr[1]
  }
  //在类中创建静态方法(类方法)
  static randomPerson(){
    return new Person(随机的姓名,随机的年龄)
  }
}
const p1 = new Person('keli',12)
const p2 = Person.randomPerson()

typeof Person  // Function
Person.prototype  // {}
Person.prototype.__proto__ // 顶层Obj原型
Person.prototype.constructor  // Person
```

### 继承

```js
class Person {
  constructor(name,age) {
    this.name = name
    this.age = age
  }
  running(){
    console.log(this.name+"在跑步")
  }
  zhayu(){
    console.log(this.name+'炸鱼')
  }
  static randomNames(){
    return new Person('随机的姓名','随机的年龄')
  }
}

class Student extends Person{
  constructor(name,age,gender) {
    super(name,age);  //这个就相当于 Person.call(this,name,age) 的语法糖
    this.gender = gender
  }
  //这个就叫做方法的重写
  running() {
    console.log('可以在这里添加前增强')
    super.running();
    console.log('可以在这里添加后增强')
  }
  //在这里也可以重写父类中的静态方法
  static randomNames(){
    const p1 = super.randomNames()
    console.log('在这里写上增强')
    return p1
  }
}

const s1 = new Student('可莉',12,'吃可爱长大')
console.log(s1)
s1.running()
s1.zhayu()

运用class 关键字的时候要时刻明白  class关键字  只是我们es5中 构造方法的语法糖而已 不是另外的东西
```

### 多态

在严格意义的面向对象的语言中,多态存在的条件是

1. 必须有继承(实现接口)
2. 必须有父类引用指向子类对象

什么是多态

* 不同数据类型的实体提供了统一的接口,或使用一个单一的符号来表示多个不同的类型

```js
function sum(s1,s2){
  return s1+s2
}
sum(123,321) 
sum('abc','cba')
// 我现在对函数接口 sum 传递了数字,又传递了字符串 如果我们按照维基百科上的解释的话  我们这个表现 就是多态的表现
// 那么我们可以得出结论 JS 中到处都是多态
```

## 全局执行上下文

```js
在ES6发布之后我们的全局执行上下文已经改名为了VE,他的作用和以前的VO对象是类似的
V8引擎将曾经的GO对象，改成了variables_: 这样一个变量中了 他的类型为 VariableMap(哈希表),并且我们在variables_中定义的变量不会共享到window中
在曾今的JS中 window 就是我们的GO对象 但是ES改进之后 window 只是一个浏览器添加的全局对象而已不过依然保持着和var的联系 但是const和let不再共享到window中
```

## 作用域

```js
在ES5中 只有两个作用域 全局作用域 和 函数作用域
在ES6中 const 和 let 具有块级作用域了 在{}里的数据具有块级作用于
在不同的浏览器中 函数有不同的作用域 在既支持es5代码又支持es6代码的浏览器中，我们的函数不具有块级作用域，但是在仅支持ES6的浏览器中 函数也具有块级作用域
if,switch,for 也具有块级作用域 
```

## symbol

```js
//这是es6中新引入的一种数据类型   类似字符串 表示独一无二的值   不能进行运算
	//对象的属性 不能使用for...in 循环遍历,但是可以使用Reflect.ownKeys来获取对象的所有键名
#创建Symbol(1)
let s = Symbol();
console.log(s,typeof s)	//Symbol() , "symbol"  这边内部给你做了唯一处理 所以第一个输出s 并不是一长串字符串
#创建Symbol(2)
let s2 = Symbol('这是描述字符串')	//这个就跟注释差不多 这边是让我们更好理解 这个Symbol是代表什么的 即使这两个描述字符串 这两个Symbol也不一样
let s3 = Symbol('这是描述字符串')
console.log(s2===s3)			//false
#创建Symbol(3)
let s4 = Symbol.for('这里也可以传入函数字符串')		//这是函数对象
let s5 = Symbol.for('这里也可以传入函数字符串')		//这是函数对象
console.log(s4 === s5)  //true
#遍历Symbol(4)
const obj = {}
let s6 = Symbol()
obj.s6 = s6
Object.defineProperty(obj,s6,{
  enumerable:true,
  writable:true,
  configurable:true,
  value:'value'
})
const syms = Object.getOwnPropertySymbols(obj)  //获取对象的所有symbol属性
for(const skey of skeys){
  console.log(obj[skey])
}

const key = Symbol.keyFor(s6)
const val = Symbol.for(key)
sym.description = sym描述字符串
#向对象中添加方法  up down
let game = {...}  //例如现在有一个对象 game  我们不知道这里面有什么 
//我们需要在里面添加两个方法 一个是和up相关的  一个是和down相关的
//这个时候 我们如果按照以前添加  game.up  game.down 有风险 
//有可能替换到我们原来里面都有的值 造成未知错误  这个时候就需要用到 Symbol
let methods = {
  up: Symbol(),
 	down: Symbol()
}
game[methods.up] = function(){ console.log('我可以改变形状') }
game[methods.down] = function(){ console.log('我可以快速下降') }
console.log(game)			//这样我们就能快速安全的添加进这些方法到里面去
#创建对象的时候就往里面添加响应的Symbol方法
let killed = {
  name:'狼人杀',
  [Symbol('say')] : function(){ console.log('我可以发言') },
  [Symbol('boom')] : function(){ console.log('自爆') }
}
console.log(killed)
#Symbol内置值(11个属性)		//这些对象一般就是控制内置函数的  可以修改内置函数的方法
1. Symbol.hasInstance  当其他对象使用instanceof运算符,判断是否为该对象的实例时 会调用这个方法
class Person{
  static [Symbol.hasInstance](param){
    console.log(param)		//可以把前面使用instanceof的对象传进来 由我们来决定 instanceof
    console.log('我被用来检测类型了')
    return true  // 本来这边应该会返回false  但是我们可以根据return的值来手动干涉这个值的输出
  }
}
let o = {}
console.log(o instanceof person)		//这个函数和其他的不一样 他会自动检测现在的环境自动执行

2. Symbol.isConcatSpreadable  属性是一个布尔值 如果该对象 [].concat()的时候,是否可以展开
let arr = [1,2,3]
console.log(arr.concat([4,5,6][Symbol.isConcatSpreadable] = false))		//这样就是不展开
//输出的答案就是 [1,2,3,[4,5,6]]		//展开的话顾名思义 就相当于 [...arr,...arr2]  concat是合成数组的方法

3.Symbol.iterator  对象进行for...of (for...in) 循环时,会调用这个方法 该回对象的默认遍历器
var myIterable = {}
myIterable[Symbol.iterator] = function* () {
    yield 1;
    yield 2;
    yield 3;
};
console.log([...myIterable]);   // [1, 2, 3]  这个就相当于给对象提供了一个新的可以遍历的方法

4.Symbol.toStringTag 在该对象调用toString方法的时候,返回该方法的返回值  一般用来添加自定义标签
{}.toString.call('foo')		//	[Object String]
{}.toString.call([1, 2]);    // "[object Array]"
{}.toString.call(3);         // "[object Number]"
...
{}.toString.call(new Person())		//[object Person]
...			//	以上都是es 中默认给 Symbol.toStringTag 的设置 当然我们也可以更改
class Person{
  get [Symbol.toStringTag]() {
    return "Validator";
  }
}
{}.toString.call(new Person())		//这样输出的就是 [object Validator] 
```

## set和weakSet

```js
WeakSet只能存放对象类型，不能存放基本数据类型
WeakSet对元素的引用是弱引用，如果没有其他引动对象对这个对象进行引用 那么GC对象会将其回收
.add(val)
.delete(val)
.has(val)
WeekSet不能遍历

WeakSet的应用场景
const personSet = new WeakSet()

class Person{
  constructor({name}){
    this.name = name
    personSet.add(this)
  }
  running(){
    if(!personSet.has(this)){
      throw new Error("不能通过非构造方法创建出来的对象调用running方法")
    }
    console.log(this.name,"running...");
  }
}
let p = new Person({name:'why'}) //通过构造方法创建出来的对象  可以在WeakSet中保存一份，不会重复且具有弱引用
//我们到时候如果不想用 p 的时候 我们直接将 p 指向 null  GC对象就会将其回收
//但是如果我们采用的是强引用的set  我们将 p 置空 Person中的this并不会被GC回收
const p1 = {}
p1.running = p.running
p1.running()

p = null   // 现在我们将P置空 我们的GC对象便会稍后回收这块内存
```

## map和weakmap

```js
WeakMap只能存放对象类型，不能存放基本数据类型
WeakMap对元素的引用是弱引用，如果没有其他引动对象对这个对象进行引用 那么GC对象会将其回收
.get(obj) //获取数据
.has(obj) //判断元素是否包含
.delete(obj) //删除元素

//WeakMap响应式原理的应用
const obj1 = {
  name:"可莉",
  age:12
}
const obj2 = {
  name:'七七',
  age:16
}

function obj1NamesMethods1() {
  console.log(obj1.name + '发生了改变1')
}
function obj1NamesMethods2() {
  console.log(obj1.name + '发生了改变1')
}
function obj1AgesMethods1() {
  console.log(obj1.name + '发生了改变1')
}
function obj1AgesMethods2() {
  console.log(obj1.name + '发生了改变1')
}

const weakMap = new WeakMap()

const obj1Map = new Map()  //预先创建我们的 obj1Map 用来存储我们 obj1对象里面的methods
obj1Map.set("name",[obj1NamesMethods1,obj1NamesMethods2])  // 在对应name属性中添加我们的val值 val值为name属性关联的方法
obj1Map.set("age",[obj1AgesMethods1,obj1AgesMethods2])  // age同样
weakMap.set(obj1,obj1Map)  // 将obj1对象作为key  obj1Map方法作为val 存储进弱引用的WeakMap中
//WeakMap只能存储引用数据类型 而且是弱引用 所以在这里要比使用map更好

obj1.name = '刻晴'
const targetMap = weakMap.get(obj1)   //数据发生改变 取出对应的map
const fns = targetMap.get('name')  // 从map中取出对应的方法
fns.forEach(item => item())  //执行方法
```

## fromEntries应用场景

```js
const queryString = 'name=可莉&age=18&gender=吃可爱长大'
const queryParams = new URLSearchParams(queryString)
//URLSearchParams { 'name' => '可莉', 'age' => '18', 'gender' => '吃可爱长大' }
console.log(Object.fromEntries(queryParams)); //{ name: '可莉', age: '18', gender: '吃可爱长大' }
```

## 极大的int数字

```js
const maxInt = Number.MAX_SAFE_INTEGER  //9007199254740991 这个数字是JS中最大的处理的INT数组 再大就不能保证准确运算了
console.log(maxInt)
const bigInt = 9007199254740991n  在后面加上这个n 就可以进行准确的数字运算了
```

## 问号语法

```js
可选链操作符
const obj = {
    name:'哈撒尅'
}
console.log(obj.name.name.name) // 错误
console.log(obj.name.name?.name) //undefined
```

## 全局对象

```js
globalThis   会自动识别环境 到底是浏览器环境还是node 环境如果是  node给我们的就是global 如果是浏览器给我们的就是window
```

## 回收调用函数

```js
const finalRegistry = new FinalizationRegistry((val) => {
  console.log('注册在finalRegistry里的'+val+'对象销毁的时候 我执行')
})

let obj = {name:'why'}

finalRegistry.register(obj,'why')  //第二个参数为传递进去的名字

obj = null
```

## WeakRef

```js
let info = new WeakRef(obj)   //和 let info = obj  相比  这个weakRef是弱引用
console.log(info.deref().name) // 这样获取就能获取info对象的值了
```

##  Proxy和Reflect进行动态监听

### defineProperty的基本方法

```js
//defineProperty的方法
const obj = {
  name:'keli',
  age :12
}

Object.keys(obj).forEach(key=>{
  let val = obj[key]
  Object.defineProperty(obj,key,{
    get(){
      console.log('监听到我们的'+key+'被获取了');
      return val
    },
    set(newVal){
      val = newVal
      console.log('监听到我们的'+key+'属性被改变了'+newVal);
    }
  })
})
console.log(obj.name);
console.log(obj.age);
obj.name = 'keqing'

obj.gender = '女'  //我们这个difineProperty的缺陷有两点
//第一个是因为 我们这个方法设计的初衷就不是为了支持set方法的   我们再监听这个属性的set方法的时候 本身就修改了这个属性
//第二个是因为 我们新添加的数据，删除，修改等 都无法监听到
```

### proxy的捕获器和Reflect的操作

| 捕获器                                          | 描述                                                         |
| ----------------------------------------------- | ------------------------------------------------------------ |
| get(*target*,*key*,*receiver*)                  | Reflect.get(target,key,recerive)     读取操作捕获器          |
| set(*target*,*key*,*newValue*,*reveiver*)       | Reflect.set(target,key,newValue,recerive)   设置操作捕获器   |
| has(*target*,*key*)                             | Reflect.has(target,key)      in操作符的捕获器                |
| deleteProperty(*target*,*key*)                  | Reflect.deleteProperty(target,key)    delete操作符的捕获器   |
| getPrototypeOf(*target*)                        | Reflect.getPrototypeOf方法的捕获器(获取对象的原型)           |
| setPrototypeOf(*target*,*newPrototype*)         | Reflect.setPrototypeOf方法的捕获器(设置对象的原型)           |
| isExtensible(*target*)                          | Reflect.isExtensible方法的捕获器(判断一个对象是否是可以扩展的) |
| preventExtensions(*target*)                     | Reflect.preventExtensions方法的捕捉器(使一个对象变得不可以扩展) |
| getOwnPropertyDescriptor(*target*,*key*)        | Reflect.getOwnPropertyDescriptor方法的捕捉器(获取对象的某个属性的描述符) |
| defineProperty(*target*,*key*,*keyAttr*)        | Reflect.defineProperty方法的捕捉器                           |
| ownKeys(*target*)                               | Reflect.getOwnPropertyNames方法和Reflect.getOwnPropertySymbols方法方法的捕获器(获取操作对象中的key) |
| apply(*target*,*thisArg*,*argumentsList*)       | Reflect.apply(target,thisArgument,argumentList)  函数的显示调用操作的捕获器 |
| construct(*target*,*argumentsList*,*newTarget*) | Reflect.construct(target,argumentList[,newTarget])    new 操作符的捕获器 |

### Proxy的基本方法

```js
1. Proxy 是一个类   我们将我们需要托管的对象托付给我们的proxy对象 使用Proxy提供的捕获器方法对我们对象属性进行一些增强
2. 如果我们使用这个方法对我们的方法进行一个增强，我们就需要完成原本自动完成的东西  见下
const obj = {
  name:"keli",
  age:12,
  foo:function(){
    console.log('调用了foo函数，我的this指向的是'+this);
  }
}

const proxyObj = new Proxy(obj,{
  get(target,key,receiver){
    const val = target[key]  //如果我们在这里这样返回的话 我们还是对 对象 在进行 "直接操作" 的 我们的Proxy的产生就是让你不要在对象上进行直接操作
    //现在我们就应该使用Reflect的方法 进行操作
    return Reflect.get(target,key,receiver)  //这样做就好了
  },
  set(target,key,newValue,receiver){
    Reflect.set(target,key,newValue,receiver)
  }
}

'gender' in proxyObj  // 使用了in操作符..
proxyObj.foo.apply('123') //显示调用了...
delete proxyObj.name // 删除了...
```

### Reflect的作用

```js
Reflect 是es6新增的一个API 是一个对象 我们直接可以使用 Reflect.xxx
	出现的原因：
    	1. Object作为一个对象，不合适放一些方法，Object本身就是一个构造函数，只需要完成构造函数的一些操作就好了
        2. in delete 操作符让JS看起来比较奇怪
需要注意的是  我们的Reflect中的construct方法还可以改变我们的原型名字
当我们直接const stu = new Student() 的时候 我们的stu的原型名字就叫做Student
但是当我们采用 construct 的时候就可以借用我们的Student的函数来执行
function Student(name,age){
    this.name = name
    this.age = age
}
function Teacher(){
    
}
const teacher = Reflect.construct(Student,['why',18],Teacher)  //第一个是要继承的对象 第二个是参数 第三个是原型的名字
console.log(teacher.__proto__ === Teacher.prototype)
```

### receiver参数的作用

```js
1. receiver参数是是我们的代理对象本身
2. 如果我们在传递参数的时候 传递进了receiver js会自动把this转换成receiver(代理对象)
const obj = {
  _name :'可莉',
  get name(){
    //这样的话 我们在这里的this 就是我们的代理对象 我们的会再次回到代理对象的get方法里 这样我们的代理对象的get方法就会被访问两次
    return Reflect.get(this,"_name")  
  },
  set name(newValue){
    Reflect.set(this,'obj_name',newValue)
  }
}

const proxyObj = new Proxy(obj,{
  get(target,key,receiver){
    return Reflect.get(target,key,receiver)  //如果我们在这里传递进了receiver参数 我们的JS会自动帮我们把this转换成receiver(代理对象)
  },
  set(target,key,newValue,receiver){
    Reflect.set(target,key,newValue,receiver)
  }
})

console.log(proxyObj.name)
```

## Promise

```js
const promise1 = Promise.resove('可莉')   === const promise = new Promise((res,rej)=>{ res('可莉') })
const promise2 = Promise.reject('刻晴')  ===  const promise = new Promise((res,rej)=>{ rej('刻晴') })

promise.then(data=>{
  console.log(data);
},err=>{
  console.log(err)
}).finally(()=>{
    console.log('不论上面是调用res还是rej 我们这边的finally都会执行的')
})
```

### 类方法

> finally 方法 无论结果是 fulfilled 或者是 rejected，都会执行指定的回调函数。

> all方法 全部都是res才执行then 要不执行catch

> allSettled方法

```js
const promise1 = new Promise((res, rej) => {
  setTimeout(() => {
    res('返回的结果1')
  }, 1000)
})
const promise2 = new Promise((res, rej) => {
  setTimeout(() => {
    res('返回的结果2')
  }, 2000)
})
const promise3 = new Promise((res, rej) => {
  setTimeout(() => {
    rej('返回的错误1')
  }, 3000)
})
const promise4 = new Promise((res, rej) => {
  setTimeout(() => {
    res('返回的结果3')
  }, 4000)
})

Promise.allSettled([promise1, promise2, promise3, promise4]).then((res) => {
  //他会等我们所有的 promise 都执行完毕后 再返回结果 如果是res 就是value值 如果是 rej 就是reason值
  // [
  //   { status: 'fulfilled', value: '返回的结果1' },
  //   { status: 'fulfilled', value: '返回的结果2' },
  //   { status: 'rejected', reason: '返回的错误1' },
  //   { status: 'fulfilled', value: '返回的结果3' }
  // ]
  console.log(res)
})
```

> race方法  让多个promise一起执行 谁先有 就用谁的  rej也执行 执行catch

> any方法  也是竞赛  等到一个fulfilled结果才执行 如果都是rejected就执行catch

### 手写Promise

#### 我的方法

```js
const PROMISE_STATE_PENDING = 'pending'  //需要有变量来管理我们的状态
const PROMISE_STATE_FULFILLED = 'fulfilled'
const PROMISE_STATE_REJECTED = 'rejected'

class keyiePromise{
  constructor(executor){
    this.status = PROMISE_STATE_PENDING
    this.value = undefined
    this.reason = undefined

    const resove = (value)=>{
      if(this.status === 'pending'){
        this.status = PROMISE_STATE_FULFILLED
        this.value = value
      }
    }
    const reject = (reason)=>{
      if(this.status === 'pending'){
        this.status = PROMISE_STATE_REJECTED
        this.reason = reason
      }
    }
    executor(resove,reject)
  }
  then(onFulfilled,onRejected){
    const status = this.value?.status || this.reason?.status
    if(this.value instanceof keyiePromise || this.reason instanceof keyiePromise){
      switch(status){
        case PROMISE_STATE_FULFILLED : {
          const res = onFulfilled(this.value?.value || this.value?.reason || this.reason?.value || this.reason?.reason)
          return new keyiePromise((resove,reject)=>{
            resove(res)
          })
        }
        case PROMISE_STATE_REJECTED : {
          const rej = onFulfilled(this.value?.value || this.value?.reason || this.reason?.value || this.reason?.reason)
          return new keyiePromise((resove,reject)=>{
            reject(rej)
          })
        }
      }
    }else{
      switch(this.status){
        case PROMISE_STATE_FULFILLED : {
          const res = onFulfilled(this.value)
          return new keyiePromise((resove,reject)=>{
            resove(res)
          })
        }
        case PROMISE_STATE_REJECTED :{
          const rej = onRejected(this.reason)
          return new keyiePromise((resove,reject)=>{
            reject(rej)
          })
        } 
        default : return 'loading...'
      }
    }
  }
}
```

#### why的方法

```js
const PROMISE_STATE_PENDING = 'pending'  //需要有变量来管理我们的状态
const PROMISE_STATE_FULFILLED = 'fulfilled'
const PROMISE_STATE_REJECTED = 'rejected'

class keyiePromise{
  constructor(executor){
    this.status = PROMISE_STATE_PENDING
    this.value = undefined
    this.reason = undefined
    this.onFulfilledCallBacks = [] //保存 reosve 的函数
    this.onRejectedCallBacks = []  //保存 reject 的函数

    const resove = (value)=>{
      if(this.status === 'pending'){
        queueMicrotask(() => {    //宏任务
          if(!this.reason){
            this.status = PROMISE_STATE_FULFILLED
            this.value = value
            this.onFulfilledCallBacks.forEach(fn => {
              const res = fn(this.value)
              return new keyiePromise((resove,reject)=>{
                resove(res)
              })
            })
          }
        });
      }	
    }
    const reject = (reason)=>{
      if(this.status === 'pending'){
        queueMicrotask(()=>{
          if(!this.value){
            this.status = PROMISE_STATE_REJECTED
            this.reason = reason
            this.onRejectedCallBacks.forEach(fn => {
              const rej = fn(reason)
              return new keyiePromise((resove,reject)=>{
                reject(rej)
              })
            })
          }
        })
      }
    }
    executor(resove,reject)
  }
  then(onFulfilled,onRejected){
    //如果在我们then调用的时候 我们的状态已经确定下来的 我们这边就可以直接执行这个函数就行了 
    //防止 用户后续 延迟调用
    switch(this.status){
      case PROMISE_STATE_FULFILLED && this.value : {
        onFulfilled(this.value)
        break
      }
      case PROMISE_STATE_REJECTED && this.reason : {
        onRejected(this.reason)
        break
      }
      default : { //当状态为pedding的时候我们这边可以这样采用
        if(onFulfilled){
          this.onFulfilledCallBacks.push(onFulfilled)
        }
        if(onRejected){
          this.onRejectedCallBacks.push(onRejected)
        }
      }
    }
    
  }
}

const promise = new keyiePromise((resove,reject)=>{
  reject('错误')
  resove('答案')
})
promise.then(res => {
  console.log(res);
  return 'aaa'
},rej =>{
  console.log(rej);
  return 'bbb'
})
```

## 生成器&迭代器

```js
iterator  迭代器(出现的目的是为了帮助我们遍历容器对象)
function createArrayIterator(arr){
  let index = 0
  return {
    next: function (){  //next函数接收0或者1个参数
      //迭代器必须是我们的next属性 对应的是函数 返回的必须是一个对象  第一个属性必须是 done对应的是boolean
      if (index < arr.length){
        return { done:false, value: arr[index++] }
      }else{
        return { done:true, value: undefined }
      }
    }
  }
}
const hobby = ['可莉喜欢炸鱼','宵宫喜欢烟花','刻晴喜欢旅行者']
const names = ['可莉','宵宫','迪卢克','公子']

const hobbyIterator = createArrayIterator(hobby)
console.log(hobbyIterator.next());
console.log(hobbyIterator.next());
console.log(hobbyIterator.next());
console.log(hobbyIterator.next());


generator 生成器(特殊的迭代器)

function *foo(){
  console.log('函数开始执行');
  yield '张三'
  console.log('函数第一次暂停后启动');
  yield '李四'
  console.log('函数执行完毕');
  return '王五'
}

const fn = foo() //在我调用这个函数的时候会返回一个生成器对象
const f1 = fn.next()  //{value:'张三',done:false}
const f2 = fn.next() // {value:'李四',done:false}
const f3 = fn.next()  // {value:'王五',done:true}
const f4 = fn.next() // {value:undefined,done:true}
console.log(f1,f2,f3,f4);

// 由于生成器本身就是可迭代对象 所以我们依然可以用 for来遍历
// for(const i of fn);
```

### 可迭代对象

```js
//这个对象就是可迭代对象
const iterableObj = {
  names: ['刻晴','可莉','宵宫','申鹤'],
  [Symbol.iterator]: function (){
    let index = 0
    return {
      next: () => {
        if (index < this.names.length) {
          return {
            done: false,
            value: this.names[index++]
          }
        }else{
          return {
            done:true,
            value: undefined
          }
        }
      }
    }
  }
}
//这个的好处就在于 我们的symbol是唯一的 也就是说 每次我们next的时候 都会返回一个新的可迭代对象
const iterator = iterableObj[Symbol.iterator]()
// console.log(iterator.next());
// console.log(iterator.next());
// console.log(iterator.next());
// console.log(iterator.next());

const iterator1 = iterableObj[Symbol.iterator]() //现在生成的是一个新的可迭代对象

for (const i of iterableObj){ //现在我们这个对象就已经可以迭代了  内部就是根据我们这个 [Symbol.iterator]函数进行迭代的
  console.log(i)
}

有些内置属性都会自动帮我们生成 可迭代对象的  string array map set arguments nodeList

给类创建可迭代对象
class Person{
  constructor(name,age,gender,hobby){
    this.name = name
    this.age = age
    this.gender = gender
    this.hobby = hobby
  }

  [Symbol.iterator](){
    let index = 0
    const keys = Object.keys(this)
    return {
      next:() => {
        if(index < keys.length){
          return { done: false, value: this[keys[index++]]}
        }else{
          return { done: true, value: undefined }
        }
      },
      return: ()=>{
        console.log('迭代器提前停止了');
        return { done: true, value: undefined }
      }
    }
  }
}

const p1 = new Person('张三',12,'男','犯罪')
const p1Iterator = p1[Symbol.iterator]()
console.log(p1Iterator.next());
console.log(p1Iterator.next());
console.log(p1Iterator.next());

for(const value of p1){
  console.log(value);
  if(value === 12) break
}
for(const index in p1){
  console.log(index);
}

```

### 生成器的参数传递

```js
function* foo(value) {
  console.log('第一次传递进来的值' + value)

  const value2 = yield value // 将我的value值返回出去 并将下一次next传递进来的值赋值给value2变量
  console.log('第二次传递进来的值' + value2)

  const value3 = yield value2
  console.log('第四次传递进来的值' + value3)

  return value3  //在函数中写return代表函数是真正执行完了
}
const fooIterator = foo('传递值1') // 我们不在第一次next中传递第一个参数 在调用的时候传递第一个
console.log(fooIterator.next()) //这里接收到的是我们第一次yield value的值
console.log(fooIterator.return('传递值2')) // 调用return方法 表示迭代器提前终止 但是依然会接收到第二次返回的值
console.log(fooIterator.next('传递值3'))
```

### 生成器可迭代对象写法

```js
function *createArrayIterator(arr){
  //生成器迭代器对象写法
  for(const item of arr){
    yield item
  }
}
 这个就是我们上面代码的语法糖
function *createArrayIterator(arr){
  //yield*
  yield* arr
}
//类的可迭代
class Person {
  name
  age
  gender
  firends
  constructor(name, age, gender, firends) {
    this.name = name
    this.age = age
    this.gender = gender
    this.firends = firends
  }

  *[Symbol.iterator]() {
    yield* this.firends // 迪卢克 公子 旅行者 {done : true ,value:'迪卢克'}
  }
}

const p1 = new Person('张三', 12, '男', ['迪卢克', '公子', '旅行者'])

```

## FinalizationRegistry

> 回收监听,传入钩子,当添加的对象被销毁执行这个钩子(ES12)

```js
let obj = {
  name: '张三',
  age: 12
}
//在ES12中添加的一个可以监听某个对象是否回收的类型  FinalizationRegistry
const finaRegistry = new FinalizationRegistry(() => {
  //当我们通过 register 添加的监听对象之后 该对象被回收便会调用这个函数
  console.log('某一个对象被回收了')
})

console.log(finaRegistry)
finaRegistry.register(obj)

obj = null
```

## WeakRef

> 对象弱引用

```js
const obj = {
  name: '张三',
  age: 12
}
const obj2 = new WeakRef(obj)

bj2.deref().name // weakRef 的东西 只能通过这个方法获取到的对象获取到
```

