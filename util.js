const archiver = require('archiver')
const fs = require('fs')
const sshClient = require('ssh2').Client
const chalk = require('chalk')
const conn = new sshClient()
const inquirer = require('inquirer')
const envList = require('./config.js/index.js')
const config = envList.config
const choices = Object.keys(config).map(item => `${item}环境`)

// 服务器连接
const connectServer = (ssh) => new Promise((resolve, reject) => {
    console.log(chalk.blackBright(`🚀  开始连接服务器...`))
    conn.connect(ssh)
        .then(() => {
            console.log(chalk.green(`📦  连接服务器成功`))
            resolve()
        })
        .catch(() => {
            reject(console.log(chalk.red(`🔨 连接服务器失败: ${err}`)))
        })
})

const sshExec = cmd => new Promise((resolve, reject) => {
    conn.exec(cmd, (err, stream) => {
        if (err) reject(err)
        stream.on('close', (code, signal) => {
            resolve([code, signal])
        }).on('data', () => {
            console.log('STDOUT: ' + data)
        }).stderr.on('data', (err) => {
            reject(err)
        })
    })
})

// 上传文件
const sshUpload = (origin, target) => new Promise((resolve, reject) => {
    conn.sftp((err, sftp) => {
        if (err) reject(err)
        sftp.fastPut(origin, target, {}, (err, result) => {
            if (err) reject(err)
            if (result) console.log(result);
            resolve()
        })
    })
})

// 压缩文件
const compressFile = (localDir, localFile) => {
    return new Promise((resolve, reject) => {
        const archive = archiver('zip', {
            zlib: { level: 9 },
        }).on('error', err => {
            throw err
        })
        const output = fs.createWriteStream(`${localFile}`)
        output.on('close', err => {
            if (err) {
                reject(err)
            }
            resolve()
        });
        archive.pipe(output)
        archive.directory(localDir, 'dist')
        archive.finalize()
    })
}

// 选择部署环境
const selectEnv = () => {
    return new Promise((resolve, reject) => {
        inquirer.prompt([{
            type: 'list',
            message: '请选择要部署的环境',
            name: 'choice',
            choices,
        }, ]).then((val) => {
            inquirer.prompt([{
                type: 'confirm',
                message: `确定要部署到${val.choice}?`,
                name: 'sure',
            }]).then(answers => {
                const { sure } = answers
                if (!sure) return process.exit(1)
                resolve(config[val.choice.slice(0, -2)])
            })
        })
    })
}


module.exports = {
    connectServer,
    sshExec,
    sshUpload,
    compressFile,
    selectEnv
}