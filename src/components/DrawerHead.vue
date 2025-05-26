<script setup>
import { inject, onMounted, onUnmounted } from "vue";

const { closeDrawer } = inject("cart");

// Функция для обработки нажатия ESC
const handleKeyDown = (event) => {
  if (event.key === "Escape") {
    closeDrawer();
  }
};

// Добавляем слушатель при монтировании
onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
});

// Удаляем слушатель при размонтировании (очистка)
onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyDown);
});
</script>

<template>
  <div class="flex items-center gap-5 mb-5">
    <svg
      @click="closeDrawer"
      width="24"
      height="24"
      viewBox="0 0 7 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="opacity-30 cursor-pointer rotate-180 hover:opacity-100 hover:-translate-x-1 transition-all duration-300"
    >
      <path
        d="M1 0.999999L6 6L1 11"
        stroke="#C8C8C8"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
    <h2 class="text-2xl font-bold">Корзина</h2>
  </div>
</template>
