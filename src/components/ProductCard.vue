<script setup>
defineProps({
  title: String,
  price: Number,
  isAdded: Boolean
});
</script>

<template>
  <div class="mb-40">
    <h2 mp-5 text-slate-500>Товар: Кроссовки {{ title }}</h2>
    <h3 class="text-red-500">Цена: {{ price }}</h3>
    <h3>Добавлен: {{ isAdded }}</h3>
    <slot></slot>
  </div>
</template>

