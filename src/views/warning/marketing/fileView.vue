<template>
	<div class="file-view-panel" style="padding-bottom: 0;">
		<van-nav-bar
				title="附件预览"
				left-arrow
				@click-left="onClickLeft"
				v-eventlisten="{isChangePage:true,pageEvent:'点击返回按钮'}"
		/>
		<iframe class="file-view-ifr" id="ifr" :src="url" frameBorder=0></iframe>
	</div>
</template>


<script>
    import { NavBar,PullRefresh } from 'vant';
    import $ from 'jquery';

    export default {
        name: 'file-view',
        data() {
            return {
                url:''
            }
        },
	    mounted(){
            this.url = this.$route.query.url;
            const navHeight = $('.van-nav-bar')[0].clientHeight;
            const docHeight = document.body.clientHeight;
            $('.file-view-ifr').height(docHeight - navHeight);
	    },
        methods: {
            onClickLeft(){
                window.history.go(-1);
            }
        },
        components: {
            [NavBar.name]:NavBar
        },
	    // updated() {
        //     let imgs = ifr.contentWindow.document.getElementsByTagName('img');
        //     console.log(imgs);
        // }
    };
</script>

<style lang="scss" scoped>

</style>
