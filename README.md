<hr>
<p>
  <a><img src="https://img.shields.io/github/issues/ly4work/gravi.svg" /></a>
  <a><img src="https://img.shields.io/github/forks/ly4work/gravi.svg"  /></a>
  <a><img src="https://img.shields.io/github/stars/ly4work/gravi.svg"  /></a>
  <a><img src="https://img.shields.io/badge/license-MIT-brightgreen.svg" /></a>
  <a><img src="https://img.shields.io/badge/build-passing-green.svg" /></a>
  <a><img src="https://img.shields.io/npm/v/gravi-cli.svg" /></a>
</p>
<hr>

# gravi-cli

一个快速上手的前端脚手架, 轻松创建项目模板, 快速开发基于 React/Vue 的 PC 端或移动端应用。

## ✨ Features

- 支持多类型项目模板, 模板都会集成代码扫描, 工作流等, 具体查看模板 github 地址。
- 支持添加项目模板, 删除项目模板(folk 作为自己的工具推荐使用)
- 支持自动检测脚手架更新

## ☘️ Installation & Quick start

### 安装

Windows 系统安装

```
$ npm i gravi-cli -g
或 yarn  global add gravi-cli
```

Mac 下安装

```
$ sudo npm i gravi-cli -g
或 sudo yarn global add gravi-cli
```

### 查看帮助信息

```
$ gravi
```

### 创建项目

```
# 指定项目名字创建项目
$ gravi init 模板名<template-name> 项目名字<project-name>

# 在当前目录创建项目
$ gravi init 模板名<template-name> .
```

### 查看所有支持的项目模板

```
$ gravi ls
```

### 添加项目模板

```
$ gravi add 模板名<template-name> 模板github仓库地址,支持ssh/https格式<git-repo-address>
```

### 删除项目模板

```
$ gravi rm 模板名<template-name>
```

### 发布到 npm

执行 pkg 下的脚本, 自动发版并且生成 changelog, travis 就会执行检测后续自动发到 npm.

```
npm run release
```

## 🔥Changelog

[Changelog](https://github.com/ly4work/gravi/blob/master/CHANGELOG.md)

## 🧭TODOLIST

- [ ] pc-admin-template
- [ ] h5-react-template
- [ ] h5-vue-template
