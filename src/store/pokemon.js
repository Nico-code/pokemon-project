import { defineStore } from 'pinia';
import axios from 'axios'

export const pokemonStore = defineStore('pokemon', {
  state: () => ({
    pokemons: [],
    pokemonsOriginal: [],
    pokemonsRender: [],
    pokemonLenght: 0,
    searchStatus: {
      count: 0,
      active: false
    },
    loading: false
  }),
  actions: {
    filterPokemons(filters) {
      this.pokemonsRender = []
      let pokemons = []
      let filterByMoves = filters.moves
      let filterByLevel = filters.level
      let filterByTypes = filters.types
      let filterByMovesAndLevel = filterByMoves && filterByLevel && !filterByTypes
      let filterByMovesAndTypes = filterByMoves && filterByTypes && !filterByLevel
      let filterByLevelAndTypes = filterByLevel && filterByTypes && !filterByMoves
      let filterByAll = filterByLevel && filterByTypes && filterByMoves
      let filterActive = filters.name || filterByMoves || filterByLevel || filterByTypes || filterByMovesAndLevel || filterByLevelAndTypes || filterByMovesAndTypes || filterByAll

      if(filters.name) {
        pokemons = this.pokemons.filter(p => {
          return p.name.includes(filters.name)
        })
      }

      if(filterByAll) {
        pokemons = this.pokemons.filter(p => {
          let containType = false
          p.types.forEach(t => {
            if(filters?.types?.includes(t?.type?.name)) {
              containType = true
            }
          })
          return containType && p.base_experience == filters.level && p.moves.length == filters.moves
        })
      }
      else if (filterByLevelAndTypes) {
        pokemons = this.pokemons.filter(p => {
          let containType = false
          p.types.forEach(t => {
            if(filters?.types?.includes(t?.type?.name)) {
              containType = true
            }
          })
          return containType && p.base_experience == filters.level
        })
      }
      else if(filterByMovesAndTypes) {
        pokemons = this.pokemons.filter(p => {
          let containType = false
          p.types.forEach(t => {
            if(filters?.types?.includes(t?.type?.name)) {
              containType = true
            }
          })
          return containType && p.moves.length == filters.moves
        })
      }
      else if(filterByMovesAndLevel) {
        pokemons = this.pokemons.filter(p => {
          return p.moves.length == filters.moves && p.base_experience == filters.level
        })
      }
      else if(filterByTypes) {
        pokemons = this.pokemons.filter(p => {
          let containType = false
          p.types.forEach(t => {
            if(filters?.types?.includes(t?.type?.name)) {
              containType = true
            }
          })
          return containType
        })
      }
      else if(filterByLevel) {
        pokemons = this.pokemons.filter(p => {
          return p.base_experience == filters.level
        })
      }
      else if(filterByMoves) {
        pokemons = this.pokemons.filter(p => {
          return p.moves.length == filters.moves
        })
      }

      
      if(!pokemons.length && filters.navigator && !filters.filter) {
        pokemons = this.pokemons
      }
      
      if(!pokemons.length && filters.search && !filters.name) {
        pokemons = this.pokemons
      }
      
      this.pokemonLenght = pokemons.length

      pokemons.forEach((p, index) => {
        if(index <= filters.page * 5 && index >= filters.page * 5 - 5) {
          this.pokemonsRender.push(p)
        }
      })

      if(pokemons.length && filterActive) {
        this.searchStatus.active = true
        this.searchStatus.count = pokemons.length
      } else {
        this.searchStatus.count = 0
        this.searchStatus.active = false
      }
    },
    getPokemons() {
      let promises = [];
      this.loading = true
      this.searchStatus.count = 0
      this.searchStatus.active = false
      setTimeout(async () => {
        await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=1153`)
        .then(res => {
          this.pokemonLenght = res.data.count
          this.pokemons = []
          this.pokemonsRender = []
          res.data.results.forEach((p, index) => {
            promises.push(
              axios.get(`https://pokeapi.co/api/v2/pokemon/${p.name}`)
              .then(res => {
                this.pokemons.push({
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
                })
                if(index+1 < 6) {
                  this.pokemonsRender.push({
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
                  })
                }
              })
              .catch(err => console.log(err))
              .finally(() => this.loading = false)
            )
          });
        })
        .catch(err => console.log(err))
        await Promise.all(promises)
      }, 1000)
    }
  },
});