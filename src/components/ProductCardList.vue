<script setup>
import ProductCard from "@/components/ProductCard.vue";

const onClickAdd = () => {
  alert(1111);
};
</script>

<template>
  <div class="grid grid-cols-4">
    <ProductCard
      title="Nike Air Max"
      image-url="/sneakers/sneakers-1.jpg"
      :price="1000"
      :is-added="true"
      :is-favorite="true"
      :onClickAdd="onClickAdd"
    />
    <ProductCard
      title="Nike Air Max"
      image-url="/sneakers/sneakers-2.jpg"
      :price="2000"
    />
    <ProductCard
      title="Nike Air Max"
      image-url="/sneakers/sneakers-3.jpg"
      :price="3000"
    />
    <ProductCard
      title="Nike Air Max"
      image-url="/sneakers/sneakers-4.jpg"
      :price="4000"
    />
  </div>
</template>
