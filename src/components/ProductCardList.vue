<script setup>
import ProductCard from "@/components/ProductCard.vue";

defineProps({
  items: Array,
});

const onClickAdd = () => {
  alert(1111);
};
</script>

<template>
  <div class="grid grid-cols-4">
    <ProductCard
      v-for="item in items"
      :key="item.id"
      :title="item.title"
      :image-url="item.imageUrl"
      :price="item.price"
      :description="item.description"
      :onClickAdd="onClickAdd"
    />
  </div>
</template>
