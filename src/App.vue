<template>
  <el-container>
    <el-header>
      <div class="nav">
        <!-- <div class="sidebar-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="img"
            viewBox="0 0 448 512"
            width="18"
            height="18"
          >
            <path
              fill="currentColor"
              d="M436 124H12c-6.627 0-12-5.373-12-12V80c0-6.627 5.373-12 12-12h424c6.627 0 12 5.373 12 12v32c0 6.627-5.373 12-12 12zm0 160H12c-6.627 0-12-5.373-12-12v-32c0-6.627 5.373-12 12-12h424c6.627 0 12 5.373 12 12v32c0 6.627-5.373 12-12 12zm0 160H12c-6.627 0-12-5.373-12-12v-32c0-6.627 5.373-12 12-12h424c6.627 0 12 5.373 12 12v32c0 6.627-5.373 12-12 12z"
            />
          </svg>
        </div>-->

        <div class="maintab">
          <img src="./assets/images/show3.png" width="54px" height="55px" />
        </div>
        <div :class="[{ 'nav-slidedown': isActive }, staticClass]">
          <button type="button" class="nav-more-btn" @click="slideDown()">
            <i></i>
            <i></i>
            <i></i>
          </button>

          <ul class="list-body">
            <li>
              <router-link to="/home">首页</router-link>
            </li>
            <li>
              <router-link to="/tag">标签</router-link>
            </li>
            <li>
              <router-link to="/about">关于</router-link>
            </li>
            <li>
              <router-link to="/msgboard">留言板</router-link>
            </li>
            <li>
              <router-link
                to="/markdown"
                v-if="isLogin() && username.split(',')[1] == 'lff'"
                >编写博客</router-link
              >
            </li>
          </ul>
        </div>

        <div class="search-box">
          <input
            class="search-box_ins"
            placeholder="请搜索..."
            v-model="content"
          />
          <i class="icon" @click="searchArticle()">
            <svg
              class="Zi Zi--Search SearchBar-searchIcon"
              fill="currentColor"
              viewBox="0 0 24 24"
              width="18"
              height="18"
            >
              <path
                d="M17.068 15.58a8.377 8.377 0 0 0 1.774-5.159 8.421 8.421 0 1 0-8.42 8.421 8.38 8.38 0 0 0 5.158-1.774l3.879 3.88c.957.573 2.131-.464 1.488-1.49l-3.879-3.878zm-6.647 1.157a6.323 6.323 0 0 1-6.316-6.316 6.323 6.323 0 0 1 6.316-6.316 6.323 6.323 0 0 1 6.316 6.316 6.323 6.323 0 0 1-6.316 6.316z"
                fill-rule="evenodd"
              />
            </svg>
          </i>
        </div>
        <div class="btn" v-if="!isLogin()">
          <button class="Button" @click="login()">登陆</button>
          <button class="Button" @click="register()">注册</button>
        </div>
        <div class="userHome" v-else>
          <el-dropdown @command="handleMessages">
            <router-link to="/msg" tag="div" class="msg-color"
              >消息</router-link
            >
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="1">
                <span>回复我的</span>
              </el-dropdown-item>
              <el-dropdown-item command="2">
                <span>@我的</span>
              </el-dropdown-item>
              <el-dropdown-item command="3">
                <span>点赞我的</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown @command="handleCommand">
            <el-avatar
              v-if="userImg"
              :size="40"
              :src="userImg"
              :key="userImg"
            ></el-avatar>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="1">
                <i class="el-icon-user-solid"></i>个人中心
              </el-dropdown-item>
              <el-dropdown-item command="2">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span class="msg">{{ username }}</span>
        </div>
      </div>
    </el-header>

    <el-main>
      <keep-alive>
        <router-view v-if="this.$route.meta.keepAlive"></router-view>
      </keep-alive>
      <!-- <router-view v-if="isRouterAlive"></router-view> -->
      <router-view v-if="!this.$route.meta.keepAlive"></router-view>
      <login v-show="show" @cancle="show = false"></login>
      <el-backtop :bottom="100">
        <div
          style="{
        height: 100%;
        width: 100%;
        background-color: #f2f5f6;
        box-shadow: 0 0 6px rgba(0,0,0, .12);
        text-align: center;
        line-height: 40px;
        color: #1989fa;
      }"
        >
          UP
        </div>
      </el-backtop>
      <el-backtop>
        <i class="el-icon-caret-top"></i>
      </el-backtop>
      <div
        :class="[
          options.classChange ? 'userTooltip-pos' : 'userTooltip-default'
        ]"
        id="userCard"
        v-show="showCard"
        @mouseover="showInfo()"
        @mouseout="hideInfo()"
      >
        <div class="info-div clearfix">
          <dt class="touxiang">
            <el-avatar :size="56" :src="options.avatar"></el-avatar>
          </dt>
          <div class="left-info">
            <dd class="person-info">{{ options.username }}</dd>
            <dd>个性签名:{{ options.signature }}</dd>
          </div>
        </div>
        <div class="follow-div clearfix">
          <a
            href="javascript:void(0)"
            class="person_deliver person_deliver_letter_un"
            >关注</a
          >
          <a class="visoter" target="_blank" href>访问主页</a>
          <a class="visoter" target="_blank" href>私信</a>
        </div>
      </div>
    </el-main>
    <el-footer></el-footer>
  </el-container>
</template>

<script>
// import { mapState } from 'vuex';
import Login from './views/Login';

export default {
  // provide() {
  //   return {
  //     reload: this.reload
  //   }
  // },
  name: 'app',
  components: {
    Login
  },
  data() {
    return {
      floatTop: '',
      floatLeft: '',
      infoShow: false,
      content: '',
      searchContent: '',
      isActive: false,
      staticClass: 'list',
      showCard: false
    };
  },
  mounted() {},
  computed: {
    // ...mapState({
    ...Vuex.mapState({
      options: state => state.usrCard,
      time: state => state.timer,
      userImg: state => state.avator,
      username: state => {
        let currentTime = new Date().getHours();
        switch (true) {
          case currentTime <= 12 && currentTime > 0:
            return '上午好,' + state.currentUser;

            break;
          case currentTime <= 18 && currentTime > 12:
            return '下午好,' + state.currentUser;

            break;
          default:
            return '晚上好,' + state.currentUser;
        }
      }
    }),
    show: {
      get() {
        return this.$store.state.status;
      },
      set(value) {
        this.$store.commit('statusChange', value);
      }
    }
  },
  watch: {
    content: function(newValue, oldValue) {
      // console.log(this.$route.matched[0].props.default)

      if (this.$route.fullPath.indexOf('/home') == -1) {
        this.searchContent = newValue;
      } else {
        this.$route.matched[0].props.default.searchString = newValue;
      }

      // console.log(this.$route.matched[0].props.default)
    }
  },
  methods: {
    showInfo() {
      // console.log(this.options);
      if (this.time) clearTimeout(this.time);
      this.showCard = true;
    },
    hideInfo() {
      let time = setTimeout(() => {
        this.showCard = false;
      }, 1000);
      this.$store.commit('timechange', time);
    },
    slideDown() {
      this.isActive = !this.isActive;
    },
    searchArticle() {
      this.$router.push('/home');
      this.$route.matched[0].props.default.searchString = this.searchContent;
    },
    // reload() {
    //   this.$route.meta.keepAlive = true
    //   this.$nextTick(function() {
    //     this.$route.meta.keepAlive = false
    //   })
    // },
    isLogin() {
      // console.log(this.$store.state.avator)
      return this.$store.getters.isLoggedIn;
    },
    login() {
      this.show = true;
      // this.$router.push({
      //   path: '/login'
      // })
    },
    register() {
      this.$router.push({
        path: '/register'
      });
    },
    handleMessages(command) {
      switch (command) {
        case '1':
          this.$router.push('/msg/reply');
          break;
        case '2':
          this.$router.push('/msg/at');
          break;
        case '3':
          this.$router.push('/msg/like');
          break;
        default:
          this.$message.error('出错');
      }
    },
    handleCommand(command) {
      switch (command) {
        case '1':
          this.$router.push('/profile');
          break;
        case '2':
          this.logOut();
          break;
        default:
          this.$message.error('出错');
      }
    },
    logOut() {
      if (this.$route.fullPath == '/profile') {
        this.$router.replace('/home');
      }
      this.$store.dispatch('LogOut').then(res => {
        console.log(res);
      });
    }
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  outline: none;
  /* word-break: break-all; */
}

body {
  /* min-width: 1116px; */
  line-height: 24px;
  font-size: 16px;
  background: #f5f6f7;
}
.msg-color {
  color: #fff;
  margin: -10px 5px;

  font-size: 14px;
}
.list .nav-more-btn {
  display: none;
}
.userTooltip-default:after,
.userTooltip-pos:after {
  display: block;
  position: absolute;
  left: 13px;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 6px;
  border-color: transparent transparent #fff #fff;
  -webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  content: '';
}
.userTooltip-default:after {
  bottom: -5px;
  -webkit-transform: rotate(-45deg);
  transform: rotate(-45deg);
}
.userTooltip-pos:after {
  top: -5px;
  -webkit-transform: rotate(135deg);
  transform: rotate(135deg);
}
#userCard {
  display: none;
  position: absolute;
  z-index: 9990;
  width: 266px;
  height: 130px;
  background-color: #fff;
  border: 1px #e9e9e9 solid;
  border-radius: 4px;
  padding: 14px 15px 7px;
  -webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  box-sizing: content-box;
  font-weight: 400 !important;
  -moz-box-sizing: content-box;
  -webkit-box-sizing: content-box;
}
#userCard .follow-div {
  border-top: 1px solid #f0f0f0;
  margin-top: 18px;
}
#userCard a:link,
a:focus,
a:hover,
a:visited {
  text-decoration: none !important;
}
.visoter {
  float: right;
  margin-top: 8px;
  margin-right: 10px;
}
#userCard .person_deliver {
  border-radius: 4px;
  background: none repeat scroll 0 0 #e33e33;
  color: #fff;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  height: 24px;
  width: 48px;
  line-height: 24px;
  text-align: center;
  margin-top: 8px;
  margin-left: 10px;
  margin-bottom: 0;
  display: inline-block;
}
.touxiang {
  float: left;
}
.left-info {
  float: left;
}
.clearfix::after {
  display: block;
  content: '';
  clear: both;
}
@media screen and (max-width: 1090px) {
  .userHome {
    margin-right: 10px;
  }
  .userHome .msg {
    display: none;
  }
  .list .nav-more-btn {
    position: absolute;
    display: block;
    width: 44px;
    height: 44px;
    top: 11px;
    right: 10px;
    border: none;
    cursor: default;
    background: #444;
  }
  .nav-slidedown .nav-more-btn i:first-child {
    transform: translateY(9px) rotate(-45deg);
  }
  .nav-slidedown .nav-more-btn i:nth-child(2) {
    opacity: 0;
  }
  .nav-slidedown .nav-more-btn i:nth-child(3) {
    transform: translateY(-9px) rotate(45deg);
  }
  .list .list-body {
    position: absolute;
    top: 60px;
    right: 10px;
    width: 200px;
    background-color: #fff;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1), 1px 1px 2px rgba(0, 0, 0, 0.2);
    transition: 0.2s ease-in-out;
    visibility: hidden;
    opacity: 0;
  }
  .list .list-body li {
    float: none;
    margin: 0;
  }
  .list .list-body a {
    display: inline-block;
    width: 100%;
    text-align: center;
    color: #444;
    padding: 0;
  }
  .el-backtop {
    position: fixed;
    background-color: #fff;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    color: #409eff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.12);
    cursor: pointer;
    z-index: 5;
  }
  .el-icon-caret-top {
    font-family: element-icons !important;
    /* speak: none; */
    font-style: normal;
    font-weight: 400;
    font-variant: normal;
    text-transform: none;
    line-height: 1;
    vertical-align: baseline;
    display: inline-block;
    -webkit-font-smoothing: antialiased;
  }
  .list .list-body a:hover {
    background-color: #444;
    color: #fff;
    /* text-decoration: underline; */
  }
  .nav-slidedown .list-body {
    visibility: visible;
    opacity: 1;
  }
  .list .nav-more-btn i:first-child {
    top: 10px;
  }
  .list .nav-more-btn i:nth-child(2) {
    top: 19px;
  }
  .list .nav-more-btn i:nth-child(3) {
    top: 28px;
  }
  .list .nav-more-btn i {
    display: block;
    position: absolute;
    width: 26px;
    height: 4px;
    left: 9px;
    border-radius: 4px;
    background-color: #fff;
    transition: 0.2s ease-in-out;
  }
}
.el-avatar > img {
  height: 100%;
  width: 100%;
  /* object-fit: cover; */
}

/* .maintab {
  margin-left: 30px;
} */

.el-header {
  /* min-width: 1032px; */
  padding: 0.7rem 1.5rem;
  line-height: 2.2rem;
  position: fixed;
  height: 3.6rem;
  z-index: 1;
  left: 0;
  right: 0;
  padding: 0;
  background-color: #444;
}

.nav {
  display: flex;
  /* max-width: 1260px; */
  align-items: center;
  justify-content: space-between;
  margin: 0 44px;
  align-items: center;
}

.btn {
  /* flex: 1; */
  margin: 0 10px;
}

.Button {
  margin-left: 16px;
  padding: 0 16px;
  font-size: 14px;
  line-height: 32px;
  color: wheat;
  text-align: center;
  cursor: pointer;
  background: none;
  border: 1px solid;
  border-radius: 3px;
}

.Button:hover {
  color: tomato;
}

ul,
li {
  list-style: none;
}

.list li {
  float: left;
  margin-right: 30px;
}

ul::after {
  content: '';
  display: block;
  clear: both;
}

li a {
  border-radius: 0.5em;
  color: white;
  text-align: center;
  padding: 16px;
  text-decoration: none;
}

li a:hover {
  background-color: #888;
}

.el-main {
  width: 90%;
  margin: 60px auto 0;
}

.el-footer {
  position: absolute;
  bottom: 0;
}

.list {
  flex: 1;
  margin-left: 18px;
}

.search-box {
  display: flex;
  /*使用flew布局，排列图标和输入框*/
  align-items: center;
  margin-right: 15px;
}

.search-box input {
  /* width: 100px; */
  margin-left: 100px;
  flex: 1;
  height: 30px;
  line-height: 30px;
  border-radius: 6px;
  color: black;
  /* background-color: #ccc; */
}

.icon {
  margin: 5px 0 0 -25px;
  cursor: pointer;
}
/*输入框默认内容样式*/

::-webkit-input-placeholder {
  color: #ccc;
  font-size: 12px;
}
.userHome {
  margin-left: 20px;
  margin-top: 5px;
}
.userHome img {
  cursor: pointer;
}
.msg {
  margin-left: 5px;
  color: wheat;
}

@media screen and (max-width: 719px) {
  .search-box {
    display: none;
  }
  .btn {
    display: none;
  }
}
</style>
