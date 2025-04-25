<template>
  <div class="bg-white w-4/5 m-auto h-fit rounded-xl shadow-xl mt-10">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  mounted() {
    fetch("https://jsonplaceholder.typicode.com/todos?_limit=3")
      .then((response) => response.json())
      .then((json) => {
        this.todos = json;
      });
  },
};
</script>
