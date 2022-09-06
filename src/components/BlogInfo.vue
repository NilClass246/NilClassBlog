<template>
    <div id="info_container">
        <div id="info_content">
            {{content}}
        </div>
    </div>
</template>

<script>
    export default{
        data(){
            return{
                content:"Hello World级别的三角形，用webgl2绘制。"
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
    bottom: 100px;
    border-radius: 5px;
    padding: 5px;
    box-shadow: 3px 3px 10px rgba(0, 0, 0, .4);
}
</style>