<script setup>
defineProps({
  imageUrl: String,
});
</script>

<template>
  <div class="flex items-center border border-slate-200 p-4 rounded-xl gap-4">
    <img :src="imageUrl" alt="Computer" class="w-16 h-16" />
    <div class="flex flex-col">
      <p>Computer</p>
      <div class="flex justify-between mt-2">
        <b>10000</b>
        <img class="opacity-40 hover:opacity-100 transition" src="/close.svg" alt="Close" />
      </div>
    </div>
  </div>
</template>
