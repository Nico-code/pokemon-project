import { defineStore } from 'pinia';
import axios from 'axios'

export const pokemonStore = defineStore('pokemon', {
  state: () => ({
    pokemons: [],
    pokemonsRender: [],
    pokemonsFiltered: [],
    pokemonLenght: 0,
    searchStatus: {
      count: 0,
      active: false
    },
    loading: false,
  }),
  actions: {
    async getPokemons() {
      let promises = [];
      this.searchStatus.count = 0
      this.searchStatus.active = false
      if(!this.pokemons.length) {
        this.loading = true
        await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=1000`)
        .then(res => {
          this.pokemonLenght = res.data.count
          this.pokemonsRender = []
          res.data.results.forEach((p, index) => {
            promises.push(
              axios.get(`https://pokeapi.co/api/v2/pokemon/${p.name}`)
              .then(res => {
                let pokemon = {
                  abilities: res.data.abilities,
                  base_experience: res.data.base_experience,
                  forms: res.data.forms,
                  game_indices: res.data.game_indices,
                  height: res.data.height,
                  held_items: res.data.held_items,
                  id: res.data.id,
                  is_default: res.data.is_default,
                  true: res.data.true,
                  location_area_encounters: res.data.location_area_encounters,
                  moves: res.data.moves,
                  name: res.data.name,
                  order: index+1,
                  past_types: res.data.past_types,
                  species: res.data.species,
                  sprites: res.data.sprites,
                  stats: res.data.stats,
                  types: res.data.types,
                  weight: res.data.weight,
                  imageUrl: res.data.sprites.front_default
                }
                this.pokemons.push(pokemon)
                if(index < 5) {
                  this.pokemonsRender.push(pokemon)
                }
              })
              .catch(err => console.log(err))
            )
          });
        })
        .catch(err => console.log(err))
        await Promise.all(promises)
        this.loading = false
      }
    },

    filterPokemons(filters) {
      let filterActive = filters.name || filters.moves || filters.level || filters.types

      if(!filterActive && filters.navigator && !this.pokemonsFiltered.length) {
        this.pokemonsFiltered = [...this.pokemons]
      }

      if(filterActive) {
        this.pokemonsFiltered = this.pokemons.filter(p => {
          let result = false;
          if(filters.name){
            if(p.name.includes(filters.name)){
              result = true
            } else {
              return false
            }
          }
          if(filters.moves){
            if(p.moves.length == filters.moves){
              result = true
            } else {
              return false
            }
          }
          if(filters.level) {
            if(p.base_experience == filters.level){
              result = true
            }else {
              return false
            }
          }
          if(filters.types) {
            let containType = false
            p.types.forEach(t => {
              if(filters?.types?.includes(t?.type?.name)) {
                containType = true
              }
            })
            if(containType) {
              result = true
            } else {
              return false
            }
          }
          return result 
        })
      }
      
      if(filters.search && !this.pokemonsFiltered.length && filters.name){
        this.pokemonsFiltered = []
      } else if(filters.search && !filters.name){
        this.pokemonsFiltered = [...this.pokemons]
      }

      this.pokemonLenght = this.pokemonsFiltered.length

      this.pokemonsRender = []
      this.pokemonsFiltered.sort((a, b) => a.order - b.order)
      this.pokemonsFiltered.forEach((p, index) => {
        if(index <= filters.page * 5 && index >= filters.page * 5 - 5) {
          this.pokemonsRender.push(p)
        }
      })
      this.pokemonsRender.sort((a, b) => a.order - b.order)

      if(this.pokemonsFiltered.length && filterActive) {
        this.searchStatus.active = true
        this.searchStatus.count = this.pokemonsFiltered.length
      } else {
        this.searchStatus.count = 0
        this.searchStatus.active = false
      }
    }
  }
});