<template>
  <BlogHeader title="Blog"></BlogHeader>
  <BlogPost title="Post1" desc="post description"></BlogPost>
  <BlogPost title="Post2" desc="post description"></BlogPost>
</template>

<script>
import BlogHeader from './components/BlogHeader.vue';
import BlogPost from './components/BlogPost.vue';

export default {
  name: 'App',
  components: {
    BlogHeader,
    BlogPost,
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
