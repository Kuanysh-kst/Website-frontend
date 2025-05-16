<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";

import ProductCardList from "@/components/ProductCardList.vue";

const favorites = ref([]);

onMounted(async () => {
  try {
    const { data } = await axios.get(`http://localhost:8080/api/favorites/products`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      withCredentials: true,
    });

    favorites.value = data;
  } catch (error) {
    console.error("Error fetching favorites:", error);
  }
});
</script>

<template>
  <h2 class="text-3xl font-bold mb-8" v-auto-animate>Любимые товары</h2>
  <div class="mt-10">
    <ProductCardList :items="favorites" is-favorites />
  </div>
</template>
