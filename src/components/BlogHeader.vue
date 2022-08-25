<template>
    <div id="outer_header">
        <div id="inner_header">{{title}}</div>
    </div>
</template>

<script>
export default {
    name: "BlogHeader",
    props: {
        title: String
    }
}
</script>

<style scoped>
#outer_header {
    position: absolute;
    height: 50px;
    width: 100%;
    background-color: darkslategrey;
    color: white;
    text-align: left;
}
#inner_header {
    margin-left: 20px;
    line-height: 50px;
    font-size:x-large;
}
</style>