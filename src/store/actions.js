import { request } from '../utils/network/request';
import axios from 'axios';
export default {
    Login({ commit }, user) {
        return new Promise((resolve, reject) => {
            // commit('auth_request');
            // 向后端发送请求，验证用户名密码是否正确，请求成功接收后端返回的token值，利用commit修改store的state属性，并将token存放在sessionStorage中
            request({
                    method: 'post',
                    url: '/api/login',
                    data: user
                })
                .then(res => {
                    // console.log(res);
                    if (res.err == 0) {
                        const token = res.data.tokenObj;
                        const username = res.data.userInfo.username;
                        const logid = res.data.userInfo._id;
                        const avator = res.data.userInfo.avator;
                        sessionStorage.setItem('token', JSON.stringify(token));
                        sessionStorage.setItem('username', username);
                        sessionStorage.setItem('logid', logid);
                        sessionStorage.setItem('avator', avator);
                        //每次请求接口时，需要在headers添加对应的Token验证
                        axios.defaults.headers.common['authorization'] = 'Bearer ' + token;

                        //更新token
                        commit('auth_success', { token, username, logid, avator });
                    }
                    resolve(res);
                })
                .catch(err => {
                    // commit('auth_error');
                    sessionStorage.removeItem('token');
                    reject(err);
                });
        });
    },
    LogOut({ commit, state }) {
        return new Promise((resolve, reject) => {
            request({
                    url: '/api/logout'
                })
                .then(response => {
                    commit('logout');
                    // localStorage.clear();
                    // sessionStorage.clear();

                    let arr = ['articleList', 'commentList'];
                    // for (let i = 0, len = sessionStorage.length; i < len; i++) {
                    //     if (!arr.includes(sessionStorage.key(i))) {
                    //         sessionStorage.removeItem(sessionStorage.key(i));
                    //     }
                    // }
                    for (let key in sessionStorage) {
                        if (!arr.includes(key)) {
                            sessionStorage.removeItem(key);
                        }
                    }
                    // sessionStorage.removeItem('logid');
                    // sessionStorage.removeItem('avator');
                    // sessionStorage.removeItem('username');
                    // 移除之前在axios头部设置的token,现在将无法执行需要token的事务
                    delete axios.defaults.headers.common['Authorization'];
                    resolve(response);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }
};