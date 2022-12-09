<template>
  <q-page class="background" v-c>
    <div class="top-section">
      <img class="top-section-img" src="../assets/pokebola.svg" alt="">  
      <div class="top-section-title">What pokemon are you looking for?</div>
      <div class="search-bar-blue-container">
        <div class="search-bar-blue-body">
          <input @keyup="searchPokemons" v-model="pokemonQuery" type="text" class="search-bar-blue" style="max-width: 400px" placeholder="Search pokemon">
          <img src="../assets/search.svg" alt="">
        </div>
        <a @click="redirectFilters" class="search-bar-filter-container"><img class="search-bar-filter" src="../assets/filters.svg" alt=""></a>
      </div>
    </div>

    <div class="d-flex justify-content-center">
      <q-spinner
        class="my-5"
        v-if="loading"
        color="primary"
        size="3em"
      />
    </div>

    <div class="search-result-box" v-if="searchStatus.active">
      {{ searchStatus.count }} {{ searchStatus.count > 1 ? "Resultados" : "Resultado" }}
        
    </div>

    <div class="search-result-box" v-if="!pokemonsRender.length && pokemons.length">
      No results found
    </div>


    <a @click="viewDetails(pokemon.id)" class="card" v-else v-for="pokemon in pokemonsRender" :key="pokemon.name">
      <div class="card-header">
        <img class="card-image" :src="pokemon.imageUrl" :alt="pokemon.name" />
      </div>
      <div class="card-body">
        <div class="card-name">{{ pokemon.name }}</div>
        <div class="card-order"> # {{ pokemon.order < 10 ? '0' + pokemon.order : pokemon.order }}</div>
        <div class="card-info-body">
          <div class="card-info card-info-left">
            <div class="card-info-title">Moves</div>
            <div class="card-info-value">{{ pokemon?.moves?.length }}</div>
          </div>
          <div class="card-info">
            <div class="card-info-title">Experience</div>
            <div class="card-info-value">{{ pokemon.base_experience }}</div>
          </div>
        </div>
        <div class="card-types">
          <div v-for="(types, index) in pokemon.types" :key="index" class="card-type">
            {{ types.type.name }}
          </div>
        </div>
      </div>
    </a>

    <q-pagination
      v-if="pokemonsRender.length >= 5"
      class="pagination"
      v-model="currentPage"
      :max="pokemonLenght / 5"
      :max-pages="5"
      direction-links
    />
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { pokemonStore } from '../store/pokemon';
import { storeToRefs } from 'pinia';

export default defineComponent({
  name: 'IndexPage',
  data: () => {
    return {
      currentPage: 1,
      pokemonQuery: "",
    }
  },
  watch: {
    currentPage(newPage, oldPage) {
      this.filterPokemons({page: newPage, navigator: true, name: this.pokemonQuery, moves: this.$route.query.moves, level: this.$route.query.level, types: this.$route.query.types})
    }
  },
  methods: {
    searchPokemons(){
      this.filterPokemons({ name: this.pokemonQuery, search: true, page: this.currentPage })
    },
    redirectFilters(){
      this.$router.push('/filters')
    },
    viewDetails(pokemonId){
      this.$router.push({ path: '/details', query: { pokemonId }})
    }
  },
  setup() {
    const store = pokemonStore();
    const { pokemons, pokemonsRender, pokemonLenght, searchStatus, loading } = storeToRefs(store);
    const { getPokemons, filterPokemons } = store;
    return {
      pokemons,
      pokemonLenght,
      pokemonsRender,
      searchStatus,
      loading,
      getPokemons,
      filterPokemons
    };
  },
  created(){
    if (this.$route.query.filter) {
      this.filterPokemons({ page: 1, filter: true, moves: this.$route.query.moves, level: this.$route.query.level, types: this.$route.query.types})
    } else {
      this.getPokemons({ page: 1})
    }
  }
})
</script>
