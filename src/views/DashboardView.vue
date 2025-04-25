<script setup>
import DashboardHeader from "@/components/DashboardHeader.vue";
import ProductCardList from "@/components/ProductCardList.vue";
import Drawer from "@/components/Drawer.vue";
</script>

<template>
  <!-- <Drawer /> -->
  <DashboardHeader />

  <div class="p-10">
    <div class="flex justify-between">
      <h2 class="text-3xl font-bold mb-8">Весь Товар</h2>
      <div></div>
    </div>

    <ProductCardList />
  </div>
</template>
