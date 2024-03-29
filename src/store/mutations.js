export default {
    auth_success(state, payload) {
        // state.status = 'success';
        state.token = payload.token;
        state.currentUser = payload.username;
        state.logId = payload.logid;

        if (payload.avator.indexOf('http') != -1) {
            state.avator = payload.avator;
        } else {
            state.avator = '/api/' + payload.avator;
        }
    },

    logout(state) {
        state.status = '';
        state.token = '';
        state.avator = '';
        state.logId = '';
    },
    UpdateCommentList(state, comment) {
        state.commentList = comment;
    },
    avatorChange(state, avator) {
        if (avator.indexOf('http') != -1) {
            state.avator = avator;
        } else {
            state.avator = '/api/' + avator;
        }

        sessionStorage.setItem('avator', state.avator);
    },
    statusChange(state, status) {
        state.status = status;
    },
    setAvator(state) {
        state.originalAvator = sessionStorage.getItem('originalAvator');
    },
    setContent(state, item) {
        state.content = item;
    },
    updateArticle(state, payload) {
        let m = JSON.parse(sessionStorage.getItem('articleList'));
        if (typeof payload.editId != 'number') {
            m.push(payload.data);
        } else {
            m[payload.editId] = payload.data;
        }
        sessionStorage.articleList = JSON.stringify(m);
        state.lists = JSON.stringify(m);
    },
    timechange(state, time) {
        state.timer = time;
    },
    infoChange(state, obj) {
        state.usrCard = obj;
    }
};