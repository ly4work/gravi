/**
 * clearConsole 格式化console信息，包含版本提示升级信息
 * @author liyang
 * 2021/03/11
 */
const chalk = require('chalk');
const semver = require('semver');

const { clearConsole } = require('./logger.js');
const getVersions = require('./getVersions.js');

exports.generateTitle = async function(checkUpdate) {
  const { current, latest } = await getVersions();
  let title = chalk.bold.blue(`GRAVI CLI v${current}`);
  if (checkUpdate && semver.gt(latest, current)) {
    // 提示升级
    title += chalk.green(`
    ┌────────────────────${`─`.repeat(latest.length)}──┐
    │  Update available: ${latest}  │
    └────────────────────${`─`.repeat(latest.length)}──┘`);
  }
  return title;
};

exports.clearConsole = async function clearConsoleWithTitle(checkUpdate) {
  const title = await exports.generateTitle(checkUpdate);
  clearConsole(title);
};
