<template>
  <div class="container">
<!--    <van-swipe :loop="false" class="nav-list">-->
<!--      <van-swipe-item :key="'swipe'+i" v-for="i in (navList.length % 5 === 0 ? parseInt(navList.length / 5) : parseInt(navList.length / 5) + 1)">-->
<!--        <ul class="nav-items">-->
<!--          <li v-for="(nav,index) in navList.slice((i-1)*5,i*5)" :key="'nav'+index" @click="goPage(nav.path,(i-1)*5 + index)" :class="[navActive === (i-1)*5 + index ? 'active' : '']">-->
<!--            <div class="item-img-box">-->
<!--              <img :src="navActive === (i-1)*5 + index ? nav.activeIco : nav.ico">-->
<!--            </div>-->
<!--            <div class="item-name" v-text="nav.text"></div>-->
<!--          </li>-->
<!--        </ul>-->
<!--      </van-swipe-item>-->
<!--    </van-swipe>-->
    <router-view/>
  </div>
</template>

<script>
  import scrollFixed from '@/mixin/scroll-fixed';
  import tabbar from '@/components/Tabbar/index'
  import { Swipe, SwipeItem } from 'vant';
  import marketing_ico_active from '@/assets/images/nav/ic_marketing_sel@2x.png';
  import marketing_ico from '@/assets/images/nav/ic_marketing@2x.png';
  import militaryorder_ico_active from '@/assets/images/nav/ic_militaryorder_sel@2x.png';
  import militaryorder_ico from '@/assets/images/nav/ic_militaryorder@2x.png';
  import fullcycle_ico_active from '@/assets/images/nav/ic_ullcycle_sel@2x.png';
  import fullcycle_ico from '@/assets/images/nav/ic_ullcycle@2x.png';
  import projectresources_ico_active from '@/assets/images/nav/ic_projectresources_sel@2x.png';
  import projectresources_ico from '@/assets/images/nav/ic_projectresources@2x.png';
  import schedule_ico_active from '@/assets/images/nav/ic_schedule_sel@2x.png';
  import schedule_ico from '@/assets/images/nav/ic_schedule@2x.png';

  export default {
    mixins: [scrollFixed],

    data() {
      return {
        navActive:0,
        navList:[
          {
            text:'营销',
            ico:marketing_ico,
            activeIco:marketing_ico_active,
            pathName: 'report',
            path:'/ranking/marketing'
          },
          {
            text:'计划进度',
            ico:schedule_ico,
            activeIco:schedule_ico_active,
            pathName: '',
            path:'/ranking/planProgress'
          }
        ]
      };
    },

    created() {

    },

    methods: {
      goPage(path,index){
        if(path == this.$route.path) return;
        this.navActive = index;
        this.$router.push({path:path})
      }
    },

    components: {
      tabbar,
      [Swipe.name]: Swipe,
      [SwipeItem.name]: SwipeItem
    }
  };
</script>


<style lang="scss" scoped>

</style>
