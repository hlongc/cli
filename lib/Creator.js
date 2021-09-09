const inquirer = require('inquirer')
const downloadGitRepo = require('download-git-repo')
const { promisify } = require('util')
const { fetchRepoList, fetchTagList } = require('./request')
const { wrapLoadingFn } = require('./utils')

const download = promisify(downloadGitRepo)

class Creator{
  constructor(appName, targetDir) {
    this.appName = appName
    this.targetDir = targetDir
  }
  async fetchRepo() {
    let repos = await wrapLoadingFn(fetchRepoList, 'fetch repo list')
    repos = repos.map(item => item.name)
    const { repoName } = await inquirer.prompt({
      name: 'repoName',
      type: 'list',
      message: 'select a template to create project',
      choices: repos
    })
    return repoName
  }
  async fetchTagByTemplate(repo) {
    let tags = await wrapLoadingFn(fetchTagList, `fetch tags of ${repo}`, repo)
    tags = tags.map(item => item.name)
    const { tagName } = await inquirer.prompt({
      name: 'tagName',
      type: 'list',
      message: 'select a tag to create project',
      choices: tags
    })
    return tagName
  }
  async downloadTmp(repo, tag) {
    const url = `zhu-cli/${repo}${tag ? '#' + tag : ''}`
    // 拉取代码到指定目录
    await wrapLoadingFn(download, `download ${repo}#${tag} to locale`, url, this.targetDir)
    return this.targetDir
  }
  async create() {
    // 1. 拉取远程模板列表
    const template = await this.fetchRepo()
    // 2. 通过模板拉取对应的tag列表
    const tag = await this.fetchTagByTemplate(template)
    // 3. 拉取指定模板的指定tag
    await this.downloadTmp(template, tag)
  }
}

module.exports = Creator