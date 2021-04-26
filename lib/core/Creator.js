const chalk = require('chalk');
const execa = require('execa'); // 一个child_process封装库
const EventEmitter = require('events');
const fs = require('fs-extra');
const { clearConsole } = require('./../util/clearConsole');
const { logWithSpinner, stopSpinner } = require('./../util/spinner');
const { log, warn, error } = require('./../util/logger');
const { hasGit, hasProjectGit } = require('./../util/env');
const fetchRemotePreset = require('./../util/loadRemotePreset');
const { readTemplateJson } = require('./../util/IOTemplateData');

/**
 * Creator类，指令核心
 * @author liyang
 * 2021/03/11
 */
module.exports = class Creator extends EventEmitter {
  constructor({ name, context }) {
    super();
    this.name = name;
    this.context = process.env.GRAVI_CLI_CONTEXT = context; // 项目绝对路径
  }

  /**
   * create 主方法
   * @param {object} cliOptions 参数对象
   * @author liyang
   * 2021/03/11
   */
  async create(cliOptions = {}) {
    const { name, context } = this;
    const templateGitRepoJson = readTemplateJson();
    const gitRepoUrl = templateGitRepoJson[process.env.GRAVI_CLI_TEMPLATE_NAME];
    let tmpdir;
    //  1. 输出日志
    await clearConsole(true);
    log(`✨ Creating project in ${chalk.yellow(context)}`);
    log(`✨ 当前选择模板  ${chalk.cyan(process.env.GRAVI_CLI_TEMPLATE_NAME)}`);
    log();

    //  2. 从git拉取模板
    try {
      stopSpinner();
      logWithSpinner(
        `⠋`,
        `Download project template. This might take a while...`
      );
      tmpdir = await fetchRemotePreset(gitRepoUrl['download']);
    } catch (e) {
      stopSpinner();
      error(`Failed fetching remote git repo ${chalk.cyan(gitRepoUrl)}:`);
      throw e;
    }
    // 3. 拷贝到项目文件下
    try {
      fs.copySync(tmpdir, context);
    } catch (error) {
      return console.error(chalk.red.dim(`Error: ${error}`));
    }

    //  4. 检查是否需要初始化git项目
    const shouldInitGit = this.shouldInitGit();
    if (shouldInitGit) {
      // 已经安装git
      stopSpinner();
      log();
      logWithSpinner(`🗃`, `Initializing git repository...`);
      this.emit('creation', { event: 'git-init' });
      // 执行git init
      await this.run('git init');
    }

    // commit init state
    let gitCommitFailed = false;
    if (shouldInitGit) {
      await this.run('git add -A');
      try {
        await this.run('git', ['commit', '-m', 'init']);
      } catch (error) {
        gitCommitFailed = true;
      }
    }

    stopSpinner();
    log();
    log(`🎉 Successfully created project ${chalk.yellow(name)}`);
    log();
    log(`🎉 cd ${chalk.cyan(name)} && yarn`);
    log(`🎉 ${chalk.cyan('yarn dev:local')}`);

    this.emit('creation', { event: 'done' });
    if (gitCommitFailed) {
      // commit fail
      warn(
        `Skipped git commit due to missing username and email in git config.\n` +
          `You will need to perform the initial commit yourself.\n`
      );
    }
  }

  /**
   * run
   * @param {string} command 运行指令
   * @param {string} args 参数
   * @author liyang
   */
  run(command, args) {
    if (!args) {
      [command, ...args] = command.split(/\s+/);
    }
    return execa(command, args, { cwd: this.context });
  }

  shouldInitGit() {
    if (!hasGit()) {
      return false;
    }
    return !hasProjectGit(this.context);
  }
};
