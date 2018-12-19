import Vue from "vue";
import Router from "vue-router";
import Login from "@/views/login";
import Main from "@/views/main";

const systemName = "演出装备管理平台";
Vue.use(Router);
const router = new Router({
  routes: [
    {
      path: "/",
      name: "login",
      meta: {
        title: `${systemName}`
      },
      component: Login
    },
    {
      path: "/main",
      name: "main",
      component: Main,
      meta: {
        title: `${systemName}-主页`
      },
      redirect: "/main/equips-shows/equips",
      children: [
        {
          path: "equips-shows",
          name: "EquipsShows",
          meta: {
            title: `${systemName}-我的装备`
          },
          redirect: "/main/equips-shows/equips",
          component: () => import("@/components/equipsShows"),
          children: [
            {
              path: "equips",
              name: "Equips",
              meta: {
                title: `${systemName}-管理我的装备`
              },
              component: () => import("@/components/equips")
            },
            {
              path: "shows",
              name: "Shows",
              meta: {
                title: `${systemName}-管理演出`
              },
              component: () => import("@/components/shows")
            }
          ]
        },
        {
          path: "equips-check",
          name: "EquipsCheck",
          meta: {
            title: `${systemName}-装备卸载校对`
          },
          redirect: "/main/equips-check/check",
          component: () => import("@/components/equipsCheck"),
          children: [
            {
              path: "check",
              name: "Check",
              meta: {
                title: `${systemName}-出库装备`
              },
              component: () => import("@/components/check")
            }
          ]
        },{
          path: "equips-notice",
          name: "EquipsNotice",
          meta: {
            title: `${systemName}-装备卸载校对`
          },
          component: () => import("@/components/notice"),
        }
      ]
    }
  ]
});

router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
});

export default router;
