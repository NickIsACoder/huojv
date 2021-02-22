<template>
	<div class="md_field" :class="{md_field_hasIcon: !!icon, md_field_isError: isError}">
		<!--		<van-icon v-if="icon" :name="icon" class="md_feld_icon"/>-->
<!--		<img :src="icon" class="md_feld_icon">-->
		<img v-if="icon == 'user'" src="../../assets/images/icon-zhanghu@2x.png" class="md_feld_icon">
		<img v-if="icon == 'password'" src="../../assets/images/log_code@2x.png" class="md_feld_icon">
		<div class="md_field_control">
			<input
					:type="type"
					v-on="listeners"
					v-bind="$attrs"
					:value="value">
		</div>
		<div>
			<slot name="rightIcon">
				<van-icon class="remove-ico" :name="rightIcon" v-eventlisten="{isChangePage:false,pageEvent:'删除输入框里的数据'}" @click="rightClick" v-show="value"/>
			</slot>
		</div>
	</div>
</template>

<script>
    import {Icon} from 'vant';
    export default {
        name: 'md-field',

        props: {
            value: {},
            type: {
                type: String,
                default: 'text'
            },
            rightIcon: String,
            icon: String,
            isError: Boolean
        },
        computed: {
            listeners() {
                return {
                    ...this.$listeners,
                    input: this.onInput
                };
            }
        },
	    components:{
            [Icon.name]: Icon,
	    },

        methods: {
            onInput(event) {
                this.$emit('input', event.target.value);
            },
            rightClick(event) {
                this.$emit('right-click', event);
            }
        }
    };
</script>


<style lang="scss" scoped>
	.md_field {
		position: relative;
		border: 1px solid $border-color;
		border-radius: 5px;
		padding-top: 10px;
		padding-bottom: 10px;
		padding-left: 10px;
		display: table;
		width: 100%;
		box-sizing: border-box;
		background-color: #fff;

		> div {
			display: table-cell;
		}

		> .md_field_control {
			padding-right: 10px;
			box-sizing: border-box;

			input {
				border: 0;
				line-height: 14px;
				font-size: 14px;
				width: 100%;
			}

			input::-webkit-input-placeholder { /*Webkit browsers*/
				color: #ccc;
				font-size: 14px;
			}

			input::-moz-placeholder { /*Mozilla Firefox 4 to 8*/
				color: #ccc;
				font-size: 14px;
			}
		}

		.md_feld_icon {
			position: absolute;
			width: 14px;
			height: 16px;
			top: 50%;
			left: 5px;
			margin-top: -5px;
		}
	}

	.remove-ico{
		color: #ccc;
	}

	.md_field_hasIcon {
		padding-left: 40px;
	}

	.md_field_isError {
		color: $green;
		background-color: #fcf5f5;
		border: 1px solid $green;

		input {
			color: $green;
			background-color: #fcf5f5;
		}

		input:-webkit-autofill {
			-webkit-box-shadow: 0 0 0 1000px #fcf5f5 inset !important;
		}
	}
</style>
