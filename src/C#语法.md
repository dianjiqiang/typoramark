©游戏小分队

PS: 本文章在于 快速入门 C#   由于每个人的接受性不一样 所以笔记有很多地方写的较为啰嗦, 几乎无拓展, 但是需要其本人多多尝试其他方式, 此外 作为JavaScript为第一语言来讲 很多东西的概念如果和JavaScript一样 则不做解释;

# 基础知识

## CLI和CLR

CLI: Common Language Infrastructure  公共语言基础框架  处理我们代码编译过程的

CLR: Common Language Runtime  公共语言运行时   程序的运行环境

## 代码如何被执行

```c#
public class Program{
    public static void Main(string[] args){
        int a = 1;
        int b = 1;
        int c = a + b;
        Console.WriteLine("c=", c)
    }
}
```

C#和JAVA不一样, java是将代码转换成了字节码  C# 是利用 `CSC` 将代码转换成了一种叫 `IL 的公共中间语言`  这个语言 具有 一定的可读性 和 不可执行性 `.net` 会将对应的 中间语言   利用 `JIT`  转换成对应操作系统的机器语言

我们编译好的代码 可以访问 对应的 /bin/debug/net5.0 中的 exe 文件中看到  这个时候 我们可以采用 `ildsm` 工具进行反编译 

`ildsm工具目录` 可以在  C:\Program Files (x86)\Microsoft SDKs\Windows\v10.0A\bin\NETFX 4.8 Tools\imdasm.exe  中找到进行反编译 将对应打包好的代码拖动到 工具中 就可以看到编译好的公共中间语言了

我们这里的中间语言  就可以被 CLR 直接执行了

微软希望 能够支持 C++  C# Java 以及各种高级语言都通过 对应的CLI 编译成中间语言后  被 `CLR` 执行 所以这里才会说  C# 是一种多端兼容语言

## 性能

* 轻量级
* 适合微服务架构
* 容器化
* `不`向下兼容

# 模块

System是系统模块   对于不同的命名空间 我们需要使用using 关键词 才能把不同的命名空间引入系统. Hello World 就是我们第一个项目的命名空间 类似与模块化  其他模块如果需要使用我们的 模块 也需要使用 using将我们的Hello World 模块导入进来

在对应的 Program 类中 有对应的 Main 方法 代表主方法

## System模块

```c#
using System;

Console.Write(参数) // 我们输出什么打印什么 不换行
Console.WriteLine(参数) // 类似 console.log  我们在输出结束之后 换行
Console.Read() //程序停在这里 等待用户输入  只会读取用户第一次输入的 keyCode  也就是 ASCII 码  10是回车
ReadKey() // 使用对应的 ConsoleKeyInfo a = Console.ReadKey() 可以读取对应的回车键 输出的是对象 可以使用对应的 a.key 获取到对应的字符串
ReadLine() // 程序会停在这里 读取一行的内容 程序会读取用户输入的字符  return 的不是 keyCode 是对应的字符
Clear() // 清除命令行
```

# 变量和数据类型

需要注意的是 char只能保存 utf-16 的Unicode字符  char无法表示总问 中文的标准是 GBK 不属于 UTF-16   string 才能表示中文

## 基本数据类型

![image-20230604181439446](https://picgoload-1310759961.cos.ap-nanjing.myqcloud.com/img/image-20230604181439446.png)

## 内建数据类型

string  object  dynamic 动态类型 在使用时候动态指定

小写string  和 大写String是完全一样的 只是方法别名

## 模板字符串

```c#
Console.WriteLine("这是一段文字,{0}写的,{0},{1}岁","张三",18);  // 这是最基础的模板字符串
Console.WriteLine($"这是一段文字,{name}写的,{name},{age}岁");  // 类JS模板字符串
// 第三种
string message = '这是一段文字,{0}写的,{0},{1}岁';
string output = string.Format(message, "张三", 12)
Console.WriteLine(output);
当然 \n 也是可以换行的
// 在 C# 中 输出 所见即所得 相当于 `` 中的换行有效文本
string message4 = @"这是一段文字
嘿嘿
不玩了
";
// 上面的一些操作可以进行组合使用
message.ToUpper();  // 将字符串转换成大写
```

# 方法(function) 兼容js箭头函数

```c#
<访问修饰符> <声明修饰符> <返回值类型> <方法名> (变量名1, ...) { }
```

## 值传参&引用传参&输出传参

* 值传参相当于 纯函数 如果没有进行引用参数 和 js 是一样的
* 引用传参   直接将对应的内存地址传入其中  changeNumber(ref a, ref b)  这样 函数中使用a 实际上是使用的a的内存地址
* 输出传参   在函数参数中写上(out int a)  在调用的地方写上 changeNumber(out a)   这个本质就是  在不修改内存地址的情况下 当函数执行结束之后 将对应的内存地址赋值给传递进来的变量(猜测)

需要注意的是 引用传参是需要初始化的  输出传参是不需要初始化的`

# 对象

面向对象 OOP 

## 修饰符

### 访问修饰符

public 公有方法

private 私有方法  `只能在内部读写`

protected  受保护方法 `只有在本身和派生类中访问`

private protected   `受保护的私有方法`

internal    内部方法  `同一个程序集(模块)中所有类都可以访问`

protected internal    `受保护的内部方法`

### 声明修饰符

static  静态类型

abstract  抽象类型

virtual   允许派生类重写的虚函数

override 允许方法继承后重写

new 可以隐藏基类成员

sealed  不可继承

partial  在同一个程序集分散定义

extern  用于声明外部实现的 extern  (类似于 TS 中的 .d.ts 文件 ?)

## 对象的基本用法
```c#
namespace ConsoleApp3
{
    internal class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hello, World!");

            Console.WriteLine(Zhangsan.foo(12, 13));
        }

    }
    class Zhangsan
    {
        public static int foo(int a, int b)
        {
            return a + b;
        }
    }
}
```

## new class

```c#
namespace ConsoleApp3
{
    internal class Program
    {
        static void Main(string[] args)
        {
            Point point = new()
            {
                x = 110,
                y = 10
            };

            point.DrawPoint();
        }
    }
    public class Point { 
        public int x;
        public int y;
      // 这里演示箭头函数 
      // 实质上 我个人不推荐使用箭头函数  c# 中的箭头函数太鸡肋了, 只能一行语句 且写法过于畸形  在游戏开发中 不要使用
        public void DrawPoint() => Console.WriteLine($"左边点为x:{this.x}右边点为y:{this.y}");
    }
}
```

## 方法的构造函数和重载

访问符 + 对象名 + 函数

```c#
namespace ConsoleApp3
{
    internal class Program
    {
        static void Main(string[] args)
        {
            Point point = new(15,10);
            Point point2 = new(); // 这里采用我们的无参构造

            point.DrawPoint();
            point2.DrawPoint();
        }
    }
    public class Point { 
        public int x;
        public int y;
      	// 这种方案叫做 对象初始化值  这个就相当于js中的  constructor
        public Point() {
            this.x = 15;
            this.y = 10;
        }
        public Point(int x, int y) {
            // 在这里演示方法的重载 和构造函数
            this.x = x;
            this.y = y;
        }
        public void DrawPoint() => Console.WriteLine($"左边点为x:{this.x}右边点为y:{this.y}");
    }
}
```

## 对象的控制(类Java)

```c#
namespace ConsoleApp3
{
    internal class Program
    {
        static void Main(string[] args)
        {
            Point point = new(15,10);

            Console.WriteLine($"x = {point.GetX()}, y = {point.GetY()}, x + y = {point.AddXY()}");
        }
    }
    public class Point {
        private int x;
        private int y;

        public Point(int x, int y) {
            this.x = x;
            this.y = y;
        }

        public int GetX() {
          // 在C#中 方法可以省略 this.
            return x;
        }

        public int GetY() { 
          return y;
        }

        public int AddXY() {
            return x + y;
        }
    }
}
```

## 属性property

// 这里需要注意到一个 名词 `属性`  属性和变量在C#中是有严格的区别的

属性就是  property  定义出来的 包含get 和 set方法的 (变量?)

变量就是 js 中的属性  在js中 对象内部的变量叫做属性 但是在 C# 中 外部定义的变量依然是变量 在class中定义的变量还是叫做变量

```c#
namespace ConsoleApp3
{
    internal class Program
    {
        static void Main(string[] args)
        {
            Point point = new(15, 10);

            Console.WriteLine($"x = {point.X}, y = {point.Y}, x + y = {point.AddXY()}");
        }
    }
    public class Point {
        private int _x;
        private int _y;
      // 这里也可以不写 int _x int_y  直接写成  public int X {get{} set{}}
        
        // 这里相当于 方才 get 的 省略写法   set也是一样的 pointX = 15  
        public int X { 
            get {
                return _x;
            }
            set { 
                _x = value; 
            }
        }
        public int Y
        {
            get
            {
                return _y;
            }
            set
            {
                _y = value;
            }
        }

        public Point(int x, int y) {
            _x = x;
            _y = y;
        }

        public int AddXY() {
            return X + Y;
        }
    }
}
```

### 再次简化 - (常用)

务必掌握

```c#
namespace ConsoleApp3
{
    internal class Program
    {
        static void Main(string[] args)
        {
            Point point = new()
            {
                X = 15,
                Y = 10
            };

            point.X = 20;
            point.Y = 30;

            Console.WriteLine($"x = {point.X}, y = {point.Y}");
        }
    }
    public class Point {
      // 这里相当于一个简化  private 一个 隐藏的 X 和 Y  暴露出 对应的get和set方法
        public int X { get; set; }
        public int Y { get; set; }
    }
}
```

## 常量 只读 只写

read-only  write-only

顾名思义, 只给他 get方法 或者 只给 set方法 但是依然可以在 `构造方法`中赋值 也可以在初始化中赋值

```c#
public class Point {
  public int Y { get; } = 5
}
```

关键字 const 和 readonly

const 和 js 中的 const 一模一样可以照搬

readonly 和 上面的 read-only 一样 可以在构造函数中对此赋值

这个就具有很大的想象空间了,  我们可以new很多实例出来, 这些实例的 readonly 值都是不一样的

在项目中 也是和 js 一样的 能采用 const 的时候 能使用常量的时候就不要使用变量

# 数组

和JavaScript一样 在c# 中 数组就是 数组类型对象  我在这里单独给他标题 仅仅 是为了更好定位

```c#
string[] world = new string[]{
  "china",
  "japen",
  "korea"
};

Console.WriteLine(world[0]);
Console.WriteLine(world[^1]);  // world[^1] = world[world.length - 1]

Index theLast = ^1;  // 保存位置信息(脱裤子放屁1 -> 不推荐)
Range theList = 0..3;  // 保存范围信息(脱裤子放屁2 -> 不推荐)
var list = world[theList]; // 这里引申出一个 关键字 var 代表的是变量  由于上面和 JavaScript不一样 在重复使用其他变量给另一个变量赋值的时候 无法推断对应的类型 所以要使用 var
```

## 在对象中使用数组

```c#
namespace ConsoleApp3
{
    internal class Program
    {
        static void Main(string[] args)
        {
            Point point = new();

            Console.WriteLine(point[0]);
            point[0] = "迪奥撒吗";
            Console.WriteLine(point[0]);
        }
    }
    public class Point {
        public int X { get; set; }
        public int Y { get; set; }

        private readonly string[] world = new string[]{
            "china",
            "japen",
            "korea"
        };
        // 在这里定义对应的 属性
        public string this[int index]
        {
            get { return world[index]; }
            set { world[index] = value; }
        }
      	// 在这里重载对应的逆查找方法
      	public int this[string str]
        {
            get { return Array.IndexOf(world, str); }
        }
    }
}
```

> 需要注意的

* 创建索引需要使用this关键词
* 索引可以用于快速访问一组数据的某一项
* 索引的使用需要通过方括号
* 索引不能使用static、ref和out来修饰
* 索引可以被重载

# 异常与错误函数

```c#
throw new Exception('类似warning');
```



















