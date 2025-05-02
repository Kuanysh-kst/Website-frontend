<script setup>
import ProductCard from "@/components/ProductCard.vue";

defineProps({
  items: Array,
});

const emit = defineEmits(['addToFavorite', 'addToCart']);

const onClickAdd = () => {
  alert(1111);
};

</script>

<template>
  <div class="grid grid-cols-4">
    <ProductCard
      v-for="item in items"
      :key="item.id"
      :id="item.productId"
      :title="item.title"
      :image-url="item.imageUrl"
      :price="item.price"
      :description="item.description"
      :onClickAdd="()=>emit('addToCart', item)"
      :onClickFavorite="()=>emit('addToFavorite', item)"
      :isFavorite="item.isFavorite"
      :isAdded="item.isAdded"
    />
  </div>
</template>
