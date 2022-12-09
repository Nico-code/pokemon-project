<template>
  <q-page class="filter-body">
    <div>
      <a @click="redirectHome"><img src="../assets/close.svg" class="filter-close-icon"></a>
      <div class="card-name" style="margin-bottom: 20px">Filtrer pokemon list</div>
      <q-select class="select-input mb-4" v-model="moveSelected" :options="movesOptions" label="Select movement number" />
      <q-select class="select-input mb-4" v-model="levelSelected" :options="levelsOptions" label="Select experience level" />
      <q-select class="select-input" v-model="typesSelected" multiple :options="types" use-chips stack-label label="Pokemon type" />
    </div>
    {{pokemons.length }}
    <div class="d-flex justify-content-between container-buttons-bottom">
      <button @click="redirectHome" class="button-secondary">Cancel</button>
      <button @click="filter" class="button-primary">Filter</button>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { typesStore } from '../store/types';
import { pokemonStore } from '../store/pokemon';
import { storeToRefs } from 'pinia';

export default defineComponent({
  name: 'FilterPage',
  data: () => {
    return {
      moveSelected: null,
      levelSelected: null,
      typesSelected: null,
      movesOptions: [],
      levelsOptions: [],
    }
  },
  methods: {
    redirectHome(){
      this.$router.push('/')
    },
    filter(){
      this.$router.push({ path: '/', query: { filter: true, moves: this.moveSelected, level: this.levelSelected, types: this.typesSelected } })
    }
  },
    setup() {
    const storePokemon = pokemonStore();
    const { pokemons } = storeToRefs(storePokemon);
    const { filterPokemons } = storePokemon;

    const storeType = typesStore();
    const { types } = storeToRefs(storeType);
    const { getTypes } = storeType;
    return {
      pokemons,
      types,
      getTypes,
      filterPokemons
    };
  },
  created(){
    this.getTypes()
    for(let i = 0; i < 101; i++){
      this.movesOptions.push(i)
    }
    for(let i = 0; i < 300; i++){
      this.levelsOptions.push(i)
    }
  }
})
</script>
