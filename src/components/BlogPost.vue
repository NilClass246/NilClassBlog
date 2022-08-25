<template>
    <div id="post_panel">
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
        desc: String
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
}

#post_panel:hover{
        box-shadow: 
        4px 4px 9px rgba(0, 0, 0, .4),
        -4px -4px 9px rgba(255, 255, 255, .9);
}

.content {
    /* flex: 0 0 auto; */
    padding: 10px;
    overflow: hidden;
}

</style>