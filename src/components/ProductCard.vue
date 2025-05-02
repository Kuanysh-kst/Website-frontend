<script setup>

defineProps({
  id: Number,
  title: String,
  description: String,
  imageUrl: String,
  price: Number,
  isFavorite: Boolean,
  isAdded: Boolean,
  onClickFavorite: Function,
  onClickAdd: Function
});

</script>

<template>
  <div>
    <div
      class="relative m-10 border border-slate-200 rounded-3xl p-8 cursor-pointer hover:-translate-y-2 hover:shadow-xl transition bg-white"
    >
      <img
        :src="isFavorite ? '/like-1.svg' : '/like-2.svg'"
        alt="Like 1 "
        class="absolute top-8 left-8"
        @click="onClickFavorite"
      />
      <img :src="imageUrl" alt="Computer" />
      <h2 mt-2>Товар: {{ title }}</h2>
      <h2 mt-2>Описание: {{ description }}</h2>
      <div class="flex justify-between mt-5">
        <div class="flex flex-col">
          <span class="text-slate-400">Цена:</span>
          <b>{{ price }}</b>
        </div>
        <img
          :src="!isAdded ? '/plus.svg' : '/checked.svg'"
          alt="Plus"
          @click="onClickAdd"
        />
      </div>
    </div>
  </div>
</template>
