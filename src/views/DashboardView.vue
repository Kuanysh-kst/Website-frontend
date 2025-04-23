<script setup>
import { useRouter } from "vue-router";
import ProductCard from "@/components/ProductCard.vue";

const router = useRouter();

const logout = () => {
  localStorage.removeItem("access_token");
  router.push("/login");
};
</script>

<template>
  <div>
    <h1>Welcome to Dashboard</h1>
    <button @click="logout">Logout</button>
  </div>

  <ProductCard title="Nike" :price="10000" :is-added=true />
</template>
