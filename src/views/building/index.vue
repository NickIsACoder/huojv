<template>
  <div class="building-page">
    <van-nav-bar
            title="正在建设中"
            left-arrow
            @click-left="onClickLeft"
    />
    <img src="../../assets/images/bg-jianshe@2x.png">
    <div class="building-text">正在建设中...</div>
  </div>
</template>

<script>
import scrollFixed from '@/mixin/scroll-fixed';
import tabbar from '@/components/Tabbar/index'
import { NavBar } from 'vant';


export default {
  mixins: [scrollFixed],

  data() {
    return {
      isLoading: false
    };
  },

  created() {

  },

  methods: {
    onClickLeft(){
      window.history.go(-1);
    }
  },

  components: {
    tabbar,
    [NavBar.name]:NavBar
  }
};
</script>


<style lang="scss" scoped>
.building-page{
  text-align: center;

  & > img{
    width: 134px;
    height: 134px;
    margin-top: 150px;
  }

  .building-text{
    font-size: 14px;
    color: #999999;
    margin-top: 30px;
  }
}
</style>
