//引入mongoose，进行数据库的连接
const mongoose = require('mongoose');
const config = require('./db');
module.exports = () => {
    mongoose.connect(config.mongodb, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: true
    });
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, '连接错误'));
    db.once('open', callback => {
        console.log('MongoDB连接成功！');
    });
    return db;
};