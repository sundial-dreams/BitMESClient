## BitMES Client（基于遗传算法的作业车间调度系统）
> 系统总体技术路线：采用前后端分离模式开发，基于C/S模式，客户端使用JavaScript，Electron， React，Node.js等进行组件化开发，服务端使用express，nodejs，typescript，python，sanic，graphql等开发独立的graphql服务或http服务，数据库使用mysql来存储基本的信息，redis来实现id生成，mongodb来存储调度结果。

![](https://github.com/sundial-dreams/BitMESClient/blob/master/BitMES.png?raw=true)

+ Client端：使用JavaScript来开发PC端应用程序。基于Electron进行开发，在Electron基础上使用React、Redux、Antd、Echarts等前端技术和包，以模块化、组件化的方式构建一个独立的UI页面，对于页面的切换使用了前端路由React-router。除此之外，通过封装一个GraphQL类来做GraphQL查询，以此和后端进行数据交互。通过这种方式能快速的构建一个可维护性好，UI美观的PC端应用程序。

+ GrapgQL Service端：使用Typescript开发的一个GraphQL服务，提供GraphQL查询。基于NodeJS、Express、GraphQL等来构建一个GraphQL服务器，由于Node.js的异步非阻塞特性，使得构建的服务器并发能力更强。除此之外，使用TypeORM来做数据库的对象关系映射，加快开发速度。通过这种方式能快速搭建起一个GraphQL服务端，使用GraphQL查询来替代传统的RESTful API能使提供的API服务可维护性、扩展性更强。

+ Schedule Service端：使用Python开发，提供作业调度服务。基于Python异步Web框架Sanic，使得构建的服务器运行效率和并发能力都比较强，并且使用Python来实现作业车间调度算法（遗传算法）一方面是比较容易，另一方面是Python支持多线程编程，因此多线程来优化算法也能实现。

+ Data Storage端：数据存储，使用MySQL来存储一些基本的数据，如机器信息、工件信息、工件工艺信息、员工信息等等。使用Redis来存储一些健值对信息以及Id生成，由于Redis的单线程异步非阻塞特性，使得生成的Id不存在重复。使用MongoDB来存储调度结果，由于调度结果完全是JSON格式数据，与使用MySQL存储相比，使用文档数据库MongoDB来存储比较容易，而且查询也比较方便。

## 运行
+ 运行
![](https://github.com/sundial-dreams/BitMESClient/blob/master/2019-07-22_21-37-19.gif?raw=true)
+ 首页
![](https://github.com/sundial-dreams/BitMESClient/blob/master/electron_2019-07-09_12-02-36.jpg?raw=true)
+ 机器管理
![](https://github.com/sundial-dreams/BitMESClient/blob/master/electron_2019-07-09_12-03-08.jpg?raw=true)
+ 作业调度
![](https://github.com/sundial-dreams/BitMESClient/blob/master/electron_2019-07-09_12-04-44.jpg?raw=true)

## 项目运行
进入项目根目录，执行
```bash
yarn dev
```

## 依赖后端
项目还需要后端的支持
1. BitMESServer.JS：js服务端，提供GraphQL接口，项目地址：https://github.com/sundial-dreams/BitMESServer.JS
2. BitMESServer.Python服务端，提供调度算法，项目地址：https://github.com/sundial-dreams/BitMESServer.Python
