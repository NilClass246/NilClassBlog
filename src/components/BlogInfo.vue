<template>
    <div id="info_container">
        <div id="info_content" v-html="content2">
        </div>
    </div>
</template>

<script>
    export default{
        data(){
            return{
                content1:"来自ShaderToy的美丽螺旋<br><br>Saturday Torus <br> Created By mrange <br> <a href='https://www.shadertoy.com/view/fd33zn'>https://www.shadertoy.com/view/fd33zn</a>",
                content2:"来自ShaderToy的辉光管时钟<br><br>Nixie Tube Clock <br> Created By timmaffett & picoplanetdev <br> <a href='https://www.shadertoy.com/view/Dds3WB'>https://www.shadertoy.com/view/Dds3WB</a>"
            
            }
        }
    }
</script>

<style scoped>
#info_container{
    display: flex;
  justify-content: center;
  align-items: center;
}

#info_content{
    background: rgba(255, 255, 255, .8);
    position: absolute;
    bottom: 80px;
    border-radius: 5px;
    padding: 7px;
    box-shadow: 3px 3px 10px rgba(0, 0, 0, .4);
}
</style>