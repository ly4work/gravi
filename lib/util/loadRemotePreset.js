const fs = require('fs-extra');
const os = require('os');
const path = require('path');
const download = require('download-git-repo');

/**
 * fetchRemotePreset 获取远程仓库
 * @param {string} name 仓库地址
 * @param {boolean} clone 克隆标志
 * @author liyang
 * 2021/03/11
 */
module.exports = async function fetchRemotePreset(name, clone = false) {
  // 生成临时目录, 方便后续中间件对其抓取下来的模板进行处理
  // 这里一定要对gravi-cli临时目录再分成子目录

  //  区分windows和linux/mac

  // mac/linux
  if (process.platform === 'darwin') {
    const tmpdir = path.resolve(os.tmpdir(), `gravi-cli/${name}`);
    if (clone) {
      await fs.remove(tmpdir);
    }
    // console.log('name => ' + name);
    return new Promise((resolve, reject) => {
      // console.log('download: url', name, tmpdir);
      download(name, tmpdir, { clone }, err => {
        if (err) {
          return reject(err);
        }
        return resolve(tmpdir);
      });
    });
  } else {
    //  windows
    await fs.remove(tmpdir);
    const tmpdir = path.resolve(os.tmpdir(), `gravi-cli`);
    // console.log('name => ' + name);
    return new Promise((resolve, reject) => {
      // console.log('download: url', name, tmpdir);
      download(name, tmpdir, { clone }, err => {
        if (err) {
          return reject(err);
        }
        return resolve(tmpdir);
      });
    });
  }
};
