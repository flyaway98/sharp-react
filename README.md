# sharp-react
[![npm version](https://badge.fury.io/js/sharp-react.svg)](https://badge.fury.io/js/sharp-react)
[![npm](https://img.shields.io/npm/dt/sharp-react.svg)](https://github.com/flyaway98/sharp-react)

Generate a variety of react applications through schematic.

The project does not do much abstraction. Junior engineers can learn the configuration knowledge related to webpack and Babel; Experienced engineers can establish their own engineering construction scheme based on this;


## Features
- Reusable webpack chain configuration and Babel configuration based on best practices
- Generates boilerplate: ** react16+webpack5+babel7+eslint+prettier**
- Optional development language: **ts**
- Optional css language: **less || scss**
- Optional features: **css moudle、redux、router**
- Optional ui lib: **ant-design**
- Css processing: special browser prefix completion and flex bug fix
- Dev server integrating react hot load、response data mock、api proxy
- Preview server for built files
- Only polyfill the used api
- Lint and format the code in the pre-commit phase
- [Chinese docs](./readme.zh-CN.md) 
## Installation
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

## Usage

```bash
schematics sharp-react:app
```

