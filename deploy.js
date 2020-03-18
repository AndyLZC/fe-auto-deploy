const {
    connectServer,
    sshExec,
    sshUpload,
    compressFile,
    selectEnv
} = require('./util.js')

async function deploy() {
  const { ssh, localDir, localFile, remoteDir, remoteFile } = await selectEnv()
  try {
    await connectServer(ssh) // 连接服务器
    console.log(chalk.blackBright(`🚀  开始部署...`))
    await compressFile(localDir, localFile)  // 压缩本地文件
    await sshUpload(localDir, `${remoteDir}/${remoteFile}`) //上传zip包
    await sshExec(`rm -rf ${remoteDir}/*`) // 删除服务器旧文件
    await sshExec(`unzip -o ${remoteDir}/${remoteFile} -d ${remoteDir}`) // 解压zip包
    await sshExec(`rm -rf ${remoteDir}/${remoteFile}`) //删除zip包
    console.log(chalk.green(`👏🤗⭐🎉  部署成功   🎉⭐🤗👏`))
  } catch(err) {
    console.log(chalk.red(`🔨 部署失败: ${err}`))
  }
}
deploy()