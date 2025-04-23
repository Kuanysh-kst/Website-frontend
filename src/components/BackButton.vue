<template>
    <button @click="navigate" class="back-button" :title="label">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="icon"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  </template>
  
  <script>
  export default {
    name: "BackButton",
    props: {
      to: {
        type: String,
        required: true,
      },
      label: {
        type: String,
        default: "Go Back",
      },
    },
    methods: {
      navigate() {
        this.$router.push(this.to);
      },
    },
  };
  </script>
  
  <style scoped>
  .back-button {
    width: 40px;
    height: 40px;
    background-color: #f0f0f0;
    border: none;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.2s ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .back-button:hover {
    background-color: #e0e0e0;
  }
  
  .icon {
    width: 20px;
    height: 20px;
    color: #333;
  }
  </style>
  