// numberStore.js
import { defineStore } from "pinia";

export default defineStore("notifications", {
  state: () => ({
    number: null,
  }),
  actions: {
    setNumber(newNumber) {
      this.number = newNumber;
    },
   
  },
});

