<template>
  <q-page class="flex flex-center">
    <img alt="Quasar logo" src="../assets/logo.png">
    <div>

    </div>
    <div id="example">
      <p>amount = {{ amount | currency('EUR') }}</p>
      <p>{{x}}</p>
      <p>Original message: "{{ message }}"</p>
      <p>Computed reversed message: "{{ reversedMessage }}"</p>
      <p>ALLCAPS    = {{ message | ALLCAPS }}</p>
      <p>capitalize = {{ message | capitalize }}</p>
    </div>
  </q-page>
</template>

<style>
</style>

<script>
import Hero from '../business/hero';

const h = new Hero('Fighter', 6).greet();

export default {
  name: 'PageHome',
  computed: {
    // a computed getter
    reversedMessage() {
      // `this` points to the vm instance
      return this.message.split('').reverse().join('');
    },
  },
  data() {
    return {
      x: h,
      amount: 1234.56,
      message: 'helloo',
    };
  },
};
</script>
