<template>
  <BlogHeader title="My Blog"></BlogHeader>
</template>

<script>
import BlogHeader from './components/BlogHeader.vue';

export default {
  name: 'App',
  components: {
    BlogHeader,
 }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

*{
  margin: 0;
  padding: 0;
}
</style>
