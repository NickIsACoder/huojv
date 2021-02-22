<template>
	<div id="app" style="height: 100%;">
		<transition name="fade" mode="out-in">
			<router-view></router-view>
		</transition>
	</div>
</template>
<script>

    export default {
        name: 'AppMain'
    }
</script>
<style lang="scss" src="./assets/scss/global.scss"/>
