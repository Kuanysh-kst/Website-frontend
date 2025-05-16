<script setup>
import ProductCard from "@/components/ProductCard.vue";

defineProps({
  items: Array,
  isFavorites: Boolean,
});

const emit = defineEmits(["addToFavorite", "addToCart"]);
</script>

<template>
  <div class="grid grid-cols-4" v-auto-animate>
    <ProductCard
      v-for="item in items"
      :key="item.id"
      :id="item.productId"
      :title="item.title"
      :image-url="item.imageUrl"
      :price="item.price"
      :description="item.description"
      :onClickAdd="isFavorites ? null : () => emit('addToCart', item)"
      :onClickFavorite="isFavorites ? null : () => emit('addToFavorite', item)"
      :isFavorite="item.isFavorite"
      :isAdded="item.isAdded"
    />
  </div>
</template>
