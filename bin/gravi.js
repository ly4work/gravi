#!/usr/bin/env node
/**
 * Gravi Bin 指令
 * @author liyang
 * 2021/03/10
 */

const program = require('commander'); // 命令行工具
const chalk = require('chalk'); // 命令行输出美化
const didYouMean = require('didyoumean'); // 简易的智能匹配引擎
const semver = require('semver'); // npm的语义版本包
const enhanceErrorMessages = require('../lib/util/enhanceErrorMessages.js');
const requiredNodeVersion = require('../package.json').engines.node;
const validateArgsLenEnum = require('../lib/constant/validateArgsLenEnum');
const processCodeEnum = require('../lib/constant/processCodeEnum');
const dymConfig = require('../lib/constant/dymConfig');

//  设置匹配阈值
didYouMean.threshold = dymConfig.THRESHOLD;

main();

/**
 * checkNodeVersion 检查Node版本
 * @param {string} expect 预期版本
 * @param {string} cliName cli名称
 * @author liyang
 * 2021/03/10
 */
function checkNodeVersion(expect, cliName) {
  // 检测node版本是否符合要求范围
  if (!semver.satisfies(process.version, expect)) {
    console.log(
      chalk.red(
        'You are using Node ' +
          process.version +
          ', but this version of ' +
          cliName +
          ' requires Node ' +
          expect +
          '.\nPlease upgrade your Node version.'
      )
    );
    // 退出进程
    process.exit(processCodeEnum.UncaughtException);
  }
}

/**
 * suggestCommands  建议命令，当用户输入了错误指令时执行
 * @param {string} cmd 命令
 * @author liyang
 * 2021/03/10
 */
function suggestCommands(cmd) {
  const avaliableCommands = program.commands.map(function(cmd) {
    return cmd._name;
  });
  // 简易智能匹配用户命令
  const suggestion = didYouMean(cmd, avaliableCommands);
  if (suggestion) {
    console.log(
      '  ' + chalk.red('Did you mean ' + chalk.yellow(suggestion) + '?')
    );
  }
}

/**
 * lowercase 字母小写化
 * @param {string} str
 * @author liyang
 * 2021/03/10
 */
function lowercase(str) {
  return str.toLocaleLowerCase();
}

/**
 * validateArgsLen 校验参数数量
 * @param {number} argvLen 参数数量
 * @param {number} maxArgvLens 最大参数数量
 * @author liyang
 * 2021/03/10
 */
function validateArgsLen(argvLen, maxArgvLens) {
  if (argvLen > maxArgvLens) {
    console.log(
      chalk.yellow(
        '\n Info: You provided more than argument. the rest are ignored.'
      )
    );
  }
}

function main() {
  // 1. 检测node版本
  checkNodeVersion(requiredNodeVersion, '@easy/cli');

  // 2. --version 版本签名
  program
    .version(require('../package').version, '-v, --version') // 版本
    .usage('<command> [options]'); // 使用信息

  // 3. init 初始化项目模板
  program
    .command('init <template-name> <project-name>')
    .description('init a new project from a template')
    .action(function(templateName, projectName, cmd) {
      // 输入参数校验
      validateArgsLen(process.argv.length, validateArgsLenEnum.Init);
      require('../lib/commands/cmd-init')(lowercase(templateName), projectName);
    });

  // 4. add 添加一个项目模板
  program
    .command('add <template-name> <git-repo-address>')
    .description('add a project template')
    .action(function(templateName, gitRepoAddress, cmd) {
      validateArgsLen(process.argv.length, validateArgsLenEnum.Add);
      require('../lib/commands/cmd-add')(
        lowercase(templateName),
        gitRepoAddress
      );
    });

  // 5. ls 列出支持的项目模板
  program
    .command('ls')
    .description('list all available project template')
    .action(function(cmd) {
      validateArgsLen(process.argv.length, validateArgsLenEnum.List);
      require('../lib/commands/cmd-list')();
    });

  // 6. rm 删除一个项目模板
  program
    .command('rm <template-name>')
    .description('remove a project template')
    .action(function(templateName, cmd) {
      validateArgsLen(process.argv.length, validateArgsLenEnum.Remove);
      require('../lib/cmd-remove')(templateName);
    });

  // 7. 处理非法命令
  program.arguments('<command>').action(function(cmd) {
    // 不退出输出帮助信息
    console.log();
    console.log(chalk.red('Unknown command ' + chalk.yellow(cmd) + '.'));
    console.log();
    program.outputHelp();
    suggestCommands(cmd);
  });

  // 8. 重写commander某些事件
  enhanceErrorMessages('missingArgument', function(argsName) {
    return 'Missing required argument ' + chalk.yellow('<' + argsName + '>');
  });

  // 9. 把命令行参数传给commander解析
  program.parse(process.argv);

  // 10. 输入gravi显示帮助信息
  if (!process.argv.slice(2).length) {
    program.outputHelp();
  }
}
