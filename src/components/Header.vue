<template>
  <header>{{ title }}</header>
</template>

<script lang="ts">
import { ref } from "@vue/composition-api";

export default {
  props: {
    title: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="sass"></style>
