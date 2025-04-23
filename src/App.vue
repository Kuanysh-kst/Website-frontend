<template>
  <router-view />
</template>

<script>
export default {
  name: 'App',
  mounted() {
    fetch('https://jsonplaceholder.typicode.com/todos?_limit=3')
      .then(response => response.json())
      .then(json => {
        this.todos = json
    });  
 },
}
</script>
