/**
 * Gravi Bin CDM : gravi rm
 * 移除模板
 * @author liyang
 * 2021/03/10
 */

const chalk = require('chalk');
const inquirer = require('inquirer');
const { stopSpinner } = require('./util/spinner');
const { log } = require('./util/logger');
const {
  readTemplateJson,
  writeTemplateJson
} = require('../util/IOTemplateData');

/**
 * deleteTemplate 删除模板
 * @param {string} templateName 模板名称
 * @author liyang
 * 2021/03/10
 */
async function deleteTemplate(templateName) {
  const templateGitRepoJson = readTemplateJson();
  //  模板不存在
  if (!templateGitRepoJson[templateName]) {
    console.log(
      `  ` + chalk.red(`template name ${templateName} has not exists.`)
    );
    return;
  }
  const { ok } = await inquirer.prompt([
    {
      name: 'ok',
      type: 'confirm',
      message: `Make sure you want to delete template name ${templateName}?`
    }
  ]);
  if (!ok) {
    return;
  }
  delete templateGitRepoJson[templateName];

  //  删除配置json
  writeTemplateJson(templateGitRepoJson);
  stopSpinner();
  log();
  log(
    `🎉  Successfully delete project template ${chalk.yellow(templateName)}.`
  );
  log();
}

module.exports = (...args) => {
  return deleteTemplate(...args).catch(err => {
    console.error(err);
    process.exit(1);
  });
};
