<template>
    <div id="post_panel">
        <img id="post_img" :src="image" v-if="image">
        <div class="content">
            <div id="post_title">{{title}}</div>
            <div id="post_desc">{{desc}}</div>
        </div>
    </div>
</template>

<script>
export default{
    name: "BlogPost",
    props: {
        title: String,
        desc: String,
        image: String
    }
}
</script>

<style scoped>
#post_panel{
    display: flex;
    margin: 20px;
    transition-duration: 0.2s;
    /* border: 1px solid darkslategray; */
    border-radius: 5px;
    box-shadow: 
        7px 7px 12px rgba(0, 0, 0, .4),
        -7px -7px 12px rgba(255, 255, 255, .9);
    cursor: pointer;
    padding: 10px;
}

#post_panel:hover{
        box-shadow: 
        4px 4px 9px rgba(0, 0, 0, .4),
        -4px -4px 9px rgba(255, 255, 255, .9);
}

.content {
    /* flex: 0 0 auto; */
    overflow: hidden;
}

#post_img {
    padding-right: 10px;
}

#post_title {
    font-size: x-large;
    /* font-weight: bold; */
}

#post_desc {
    color: gray;
}

</style>