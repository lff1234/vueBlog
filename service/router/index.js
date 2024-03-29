const express = require('express');
const multer = require('multer'); // 引入
const router = express.Router();
const services = require('../api/userApi.js');
const Article = require('../util/schema/article_schema');
const md = require('../util/marked_it');
const mongoose = require('mongoose');
// 设置图片存储路径
let fs = require('fs');
let storage = multer.diskStorage({
    destination: function(req, file, cb) {
            cb(null, 'public/myUpload/resource/');
        }
        // filename: function(req, file, cb) {
        //     cb(null, `${Date.now()}`);
        // }
});
let createFolder = function(folder) {
    try {
        // 测试 path 指定的文件或目录的用户权限,我们用来检测文件是否存在
        // 如果文件路径不存在将会抛出错误"no such file or directory"
        fs.accessSync(folder);
    } catch (e) {
        // 文件夹不存在，以同步的方式创建文件目录。
        fs.mkdirSync(folder);
    }
};

let uploadImgs = './public/myUpload/resource/';
createFolder(uploadImgs);
// 添加配置文件到multer对象。
let articleUpload = multer({ storage: storage });

const upload = multer({
    dest: 'public/myUpload/' //上传文件存放路径
});
router.post('/home', function(req, res, next) {
    let { id, initial } = req.body;

    // id = mongoose.Types.ObjectId(id);
    if (!id) {
        id = mongoose.Types.ObjectId();
    }
    let tag = req.query.tag;
    if (tag) {
        Article.find({
                tags: {
                    $elemMatch: { $eq: tag }
                },
                _id: { $lt: id }
            })
            .sort({ _id: -1 })
            .limit(20)
            .lean()
            .populate('userId')
            .then(data => {
                // console.log(data);
                if (data.length > 0) {
                    for (let item of data) {
                        item['username'] = item.userId.username;
                        item['userId'] = item.userId._id;
                        // delete item.userId;
                    }
                }
                return res.send(data);
            })
            .catch(err => {
                if (err) {
                    console.log(err);
                    return err;
                }
            });
    } else {
        let arr = [];
        // arr[0] = Article.aggregate

        //     .unwind('tags')
        //     .group({
        //         _id: '$tags',
        //         sum: {
        //             $sum: 1
        //         }
        //     })
        arr[0] = Article.aggregate([{
                $unwind: '$tags'
            },
            {
                $group: {
                    _id: '$tags',
                    sum: {
                        $sum: 1
                    }
                }
            }
        ]).then(res => {
            // console.log(res);
            return res;
        });
        arr[1] = Article.find({ _id: { $lt: id } })
            .sort({ _id: -1 })
            .limit(20)
            .lean()
            .populate('userId')
            .then(data => {
                if (data.length > 0) {
                    for (let item of data) {
                        item['username'] = item.userId.username;
                        item['contentHtml'] = md.render(`${item.contentMd + '\n${toc}'}`);

                        // console.log(md.render(`${item.contentMd + '${toc}'}`));
                        item['userId'] = item.userId._id;
                        // delete item.userId;
                    }
                }
                // return res.send(data);
                return data;
            })
            .catch(err => {
                if (err) {
                    console.log(err);
                    return err;
                }
            });
        if (initial) {
            Promise.all(arr).then(sum => {
                return res.send(sum);
            });
        } else {
            Promise.resolve(arr[1]).then(sum => {
                return res.send(sum);
            });
        }
    }
});
// router.get('/myUpload/:picture', function(req, res) {
//     // console.log(req.params.picture);
//     res.sendFile(process.cwd() + '/myUpload/' + req.params.picture); //服务器该文件的绝对路径
// });
router.post(
    '/articleImgUpload',
    articleUpload.single('image'),
    services.articleImgUpload
);
router.post('/userCard', services.userCard);
router.post('/refreshToken', services.refreshToken);
router.post('/addArticle', services.addArticle);
router.post('/editArticle', services.editArticle);
router.post('/upload', upload.single('imgFile'), services.imgUpload);
router.post('/dianzan', services.dianZan);
router.post('/canclezan', services.cancleZan);
router.get('/home/:id', services.contentGet);
router.post('/home/:id', services.comment);
router.get('/logout', function(req, res, next) {
    return res.send('登出成功');
});
// router.get('/home/:id', function(req, res, next) {
//     Article.findOne({ id: parseInt(req.params.id) }, function(err, data) {
//         // console.log(data);
//         return res.json(data);
//     });
// });
router.get('/tag', function(req, res, next) {
    return res.send('好好');
});
// 登录功能
router.post('/login', services.login);
// 注册功能
router.post('/register', services.register);
module.exports = router;