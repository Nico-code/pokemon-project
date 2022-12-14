import { defineStore } from 'pinia';
import axios from 'axios'

export const typesStore = defineStore('types', {
  state: () => ({
    types: []
  }),
  actions: {
    getTypes() {
      axios.get(`https://pokeapi.co/api/v2/type`)
      .then(res => {
        this.types = res.data.results.map(type => type.name)
      })
    },
  },
});