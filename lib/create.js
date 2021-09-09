const path = require('path')
const fs = require('fs-extra')
const inquirer = require('inquirer')
const Creator = require('./Creator')

module.exports = async function create(appName, args) {
  // 获取到目录的绝对路径
  const target = path.join(process.cwd(), appName)
  if (fs.existsSync(target)) {
    if (args['force']) { // 如果用户设置了强制创建，那么就删除已存在的目标目录
      try {
        await fs.remove(target)
      } catch (e) {
        console.error('删除已存在目录失败', e)
      }
    } else { // 提示用户是否删除该目录

      // action是对应的value值
      const { action } = await inquirer.prompt([
        {
          name: 'action',
          type: 'list',
          message: `${target}  target directory is exist, so pick an action to continue`,
          choices: [
            { name: 'overwrite', value: 'overwrite' },
            { name: 'exit', value: false },
          ]
        }
      ])
      // 删除目标目录
      if (action === 'overwrite') {
        console.log(`\r\nremove ${target} ...`)
        await fs.remove(target)
      }
    }
  }

  // 创建项目
  const ins = new Creator(appName, target)
  ins.create()
}