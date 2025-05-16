<script setup>
import DrawerHead from "./DrawerHead.vue";
import CartItemList from "./CartItemList.vue";
import InfoBlock from "./InfoBlock.vue";

import { ref, inject, computed } from "vue";
import axios from "axios";

const emit = defineEmits(["createOrder"]);

const props = defineProps({
  totalPrice: Number,
  vatPrice: Number,
});

const { cart } = inject("cart");

const isCreating = ref(false);
const orderId = ref(null);

const createOrder = async () => {
  try {
    isCreating.value = true;
    const plainCart = JSON.parse(JSON.stringify(cart.value));
    const requestData = {
      items: plainCart.map((item) => ({
        productId: item.id,
        quantity: item.quantity || 1,
      })),
      totalPrice: props.totalPrice.value,
    };
    const { data } = await axios.post(`http://localhost:8080/api/orders`, requestData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      withCredentials: true,
    });
    cart.value = [];

    orderId.value = data.id;

    return data;
  } catch (error) {
    console.error("Error creating order:", error);
  } finally {
    isCreating.value = false;
  }
};

const buttonDisabled = computed(() => isCreating.value || cartIsEmpty.value);

const cartIsEmpty = computed(() => {
  return cart.value.length === 0;
});
</script>

<template>
  <div class="fixed top-0 left-0 h-full w-full bg-black z-10 opacity-70"></div>
  <div class="bg-white w-96 h-full fixed right-0 top-0 z-20 p-8">
    <DrawerHead />

    <div v-if="!totalPrice || orderId" class="flex h-full items-center">
      <InfoBlock
        v-if="!totalPrice && !orderId"
        title="Корзина пуста"
        description="Добавьте хотя бы один товар в корзину"
        imageUrl="/package-icon.png"
      />

      <InfoBlock
        v-if="orderId"
        title="Заказ оформлен!"
        :description="`Ваш заказ #${orderId}. Мы свяжемся с вами в ближайшее время`"
        imageUrl="/order-success-icon.png"
      />
    </div>

    <div v-else>
      <CartItemList v-if="totalPrice" />

      <div class="flex flex-col gap-4 mt-7">
        <div class="flex gap-2">
          <span>Итого:</span>
          <div class="flex-1 border-b border-dashed"></div>
          <b>{{ totalPrice }}</b>
        </div>

        <div class="flex gap-2">
          <span>Налог 5%:</span>
          <div class="flex-1 border-b border-dashed"></div>
          <b>{{ vatPrice }}</b>
        </div>

        <button
          :disabled="buttonDisabled"
          @click="createOrder"
          class="mt-4 transition bg-lime-500 w-full rounded-xl py-3 text-white hover:bg-lime-600 active:bg-lime-700 disabled:bg-slate-300 cursor-pointer"
        >
          Оформить заказ
        </button>
      </div>
    </div>
  </div>
</template>
