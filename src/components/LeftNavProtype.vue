<template>
<!-- 没用到，是很早很早的侧边栏原型了 -->
    <div id = "sideNavbar" :class = "['side-navbar ',left_nav_isOpen? 'open':'close']">
		<a href="javascript:void(0)" id = "triggerTab" class="close-btn" v-on:click="triggerTab">
				<!-- <span class="ham-add hamb-top "></span>
				<span class="ham-add hamb-middle "></span>
				<span class="ham-add hamb-bottom " ></span> -->
				<i v-show='left_nav_isOpen==false' class="el-icon-s-unfold"></i>
                <i v-show='left_nav_isOpen==true' class="el-icon-s-fold"></i>
		</a>
		<a href="#"></a>
        <a v-for="item in left_nav_details" v-bind:key="item.txt" v-on:click="changePage(item.left_link)" style="font-size:3.5vh;">
              <i :class="['left-icon',item.left_icon_class]"></i>&nbsp;&nbsp;&nbsp;&nbsp;{{item.left_txt}}
　　　　 </a>
	</div>
</template>

<script>

export default {
    data(){
        return{
            left_nav_isOpen: false,
            left_nav_details:this.$attrs.left_nav_details
        }
    },
    methods:{
        openNav(){
			//document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
			// $(".hamburger").click(function(){
			// 	$(this).toggleClass("is-active");
			// });
            this.left_nav_isOpen = true;
            this.$emit('leftOpen',this.left_nav_isOpen)
		},
		closeNav(){
			//document.body.style.backgroundColor = "rgba(0,0,0,1)";
			// $(".hamburger").click(function(){
			// 	$(this).toggleClass("toggled");
			// });
            this.left_nav_isOpen = false;
            this.$emit('leftOpen',this.left_nav_isOpen)
		},
		triggerTab(){
			if (this.left_nav_isOpen==true){
				this.closeNav();
            }
            else{
				this.openNav();
			}
        },
        changePage(val){
            this.$emit('page',val)

        }
    }

}
</script>

<style scoped>
@import '../SunnyCss.css';


</style>>
