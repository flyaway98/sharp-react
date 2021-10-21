# sharp-react
[![npm version](https://badge.fury.io/js/sharp-react.svg)](https://badge.fury.io/js/sharp-react)
[![npm](https://img.shields.io/npm/dt/sharp-react.svg)](https://github.com/flyaway98/sharp-react)

通过angular-schematic库生成灵活的react应用。

工程没有做太多的抽象，初级工程师可以学习到webpack、babel相关的配置知识；对于有经验的工程师，可以基于此建立自己的工程化构建方案。


## 主要功能
- 基于最佳实践的可重用webpack链式配置和Babel配置
- 通过模板生成react应用: ** react16+webpack5+babel7+eslint+prettier**
- 可选开发语言: **ts**
- 可选择CSS预编译语言: **less || scss**
- 可选择的功能: **css moudle、redux、router**
- 可选择是否集成antd ui库: **ant-design**
- css处理: 自动对特定属性、根据浏览器增加浏览器专用前缀、flex布局bug自动修复
- 开发服务器集成react局部热刷新、响应数据mock、请求代理功能
- 通过预览服务器来浏览构建出来的文件
- 只对用到的es6+ api进行polyfill
- 在git提交前对代码风格进行格式化、对代码规范进行检查

## 安装
- npm:
  ```bash
  npm install -g @angular-devkit/schematics-cli
  npm install --save-dev sharp-react
  ```

- yarn:
  ```bash
  yarn global add @angular-devkit/schematics-cli
  yarn add -D sharp-react
  ```

## 使用

```bash
schematics sharp-react:app
```

