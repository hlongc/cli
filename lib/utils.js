const ora = require('ora')

const sleep = n => new Promise(resolve => setTimeout(() => resolve(), n))

// 远程拉取的代码都加一个loading的效果
async function wrapLoadingFn(fn, message, ...args) {
  const spinner = ora(message)
  try {
    spinner.start()
    const ret = await fn(...args)
    spinner.succeed()
    return ret
  } catch (e) {
    spinner.fail('request failed, try again')
    await sleep(1000)
    return wrapLoadingFn(...arguments)
  }
}

module.exports = {
  wrapLoadingFn
}