const config = {
  dev: {
    localDir: `${__dirname}/dist`, //需要压缩的本地文件目录
    localFile: `${__dirname}/dist.zip`, // 上传文件
    remoteDir: '',                 // 远端目录
    remoteFile: '',                // 发布文件
    ssh: {
        host: '128.232.236.82',  //服务器地址
        port: 22,                //端口
        username: 'root',        //用户名
        password: 'Happy!@#$2019' //密码
    }
  },
  prod: {
    localDir: `${__dirname}/dist`, 
    localFile: `${__dirname}/dist.zip`,
    remoteDir: '', 
    remoteFile: '',
    ssh: {
        host: '128.232.236.82',  
        port: 22,
        username: 'root',
        password: '123456',
    }
  }
}

module.exports = {
  config
}