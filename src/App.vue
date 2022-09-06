
<template>
  <BlogHeader title="今日着色器 | Today's Shader"></BlogHeader>
  <BlogCanvas></BlogCanvas>
  <BlogInfo></BlogInfo>
</template>

<script>
import BlogHeader from './components/BlogHeader.vue';
import BlogCanvas from './components/BlogCanvas.vue';
import BlogInfo from './components/BlogInfo.vue';

export default {
  name: 'App',
  components: {
    BlogHeader,
    BlogCanvas,
    BlogInfo
}
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

*{
  margin: 0;
  padding: 0;
}
</style>
