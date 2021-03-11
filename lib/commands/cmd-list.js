/**
 * Gravi Bin CDM : gravi ls
 * 查看所有模板列表
 * @author liyang
 * 2021/03/10
 */

const chalk = require('chalk');
const { readTemplateJson } = require('../util/ioTemplateData');
const { stopSpinner } = require('../util/spinner');
const { log } = require('../util/logger');

/**
 * listAllTemplate
 * 枚举所有模板
 * @author liyang
 * 2021/03/10
 */
async function listAllTemplate() {
  const templateGitRepoJson = readTemplateJson();
  for (let key in templateGitRepoJson) {
    stopSpinner();
    log();
    log(
      `➡️  Template name ${chalk.cyan(key)},  Github address ${chalk.yellow(
        templateGitRepoJson[key]['github']
      )}`
    );
    log();
  }
  if (!Object.keys(templateGitRepoJson).length) {
    stopSpinner();
    log();
    log(`💔  No any template.`);
    log();
  }
}

module.exports = () => {
  return listAllTemplate().catch(err => {
    console.error(err);
    process.exit(1);
  });
};
