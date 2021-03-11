/**
 * Gravi Bin CDM : gravi add
 * 增加模板
 * @author liyang
 * 2021/03/10
 */

const chalk = require('chalk');
const isGitUrl = require('is-git-url');
const { stopSpinner } = require('../util/spinner');
const { log } = require('../util/logger');
const {
  readTemplateJson,
  writeTemplateJson
} = require('../util/ioTemplateData');

/**
 * addProjectTemplate 新增项目模板
 * @param {string} templateName 模板名称
 * @param {string} gitRepoAddress git地址
 * @author liyang
 * 2021/03/11
 */
async function addProjectTemplate(templateName, gitRepoAddress) {
  const templateGitRepoJson = readTemplateJson();
  if (templateGitRepoJson[templateName]) {
    console.log(`  ` + chalk.red(`template name ${templateName} has exists.`));
    return;
  }
  if (!isGitUrl(gitRepoAddress)) {
    console.log(
      `  ` +
        chalk.red(
          `git repo address ${gitRepoAddress} is not a correct git repo.`
        )
    );
    return;
  }
  // 转化为需要的正确格式
  const correctGitRepo = getRealGitRepo(gitRepoAddress);
  templateGitRepoJson[templateName] = {
    github: gitRepoAddress,
    download: correctGitRepo
  };
  writeTemplateJson(templateGitRepoJson);
  stopSpinner();
  log();
  log(`🎉  Successfully add project template ${chalk.yellow(templateName)}.`);
  log();
}
/**
 * getRealGitRepo format git地址format规则
 * https => https://github.com/NuoHui/node_code_constructor.git
 * ssh => git@github.com:NuoHui/node_code_constructor.git
 * want => github:NuoHui/node_code_constructor
 * @param {string} gitRepo git地址
 * @author liyang
 * 2021/03/11
 */
function getRealGitRepo(gitRepo) {
  const sshRegExp = /^git@github.com:(.+)\/(.+).git$/;
  const httpsRegExp = /^https:\/\/github.com\/(.+)\/(.+).git$/;
  if (sshRegExp.test(gitRepo)) {
    // ssh
    const match = gitRepo.match(sshRegExp);
    return `github:${match[1]}/${match[2]}`;
  }
  if (httpsRegExp.test(gitRepo)) {
    // https
    const match = gitRepo.match(httpsRegExp);
    return `github:${match[1]}/${match[2]}`;
  }
}

module.exports = (...args) => {
  return addProjectTemplate(...args).catch(err => {
    console.error(err);
    process.exit(1);
  });
};
