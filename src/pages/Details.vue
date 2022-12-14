<template>
  <q-page>
    <div class="details-top">
      <div v-if="loading" class="d-flex justify-content-center">
        <q-spinner
          class="my-5"
          color="primary"
          size="3em"
        />
      </div>
      <div v-else>
        <img @click="redirectHome" src="../assets/arrow-back.svg" alt="">
        <div class="d-flex align-items-center justify-content-center">
          <div class="details-top-title"> {{ pokemon.name }} </div>
          <div class="details-top-subtitle"> #{{ pokemon.order < 10 ? "0"+pokemon.order : pokemon.order }} </div>
        </div>
        <div class="w-100">
          <img class="details-top-img" :src="pokemon.sprites?.front_default" :alt="pokemon.name" />
        </div>
      </div>
    </div>
    <div class="details-body pt-3 pb-5">
      <div v-if="loading" class="d-flex justify-content-center">
        <q-spinner
          class="my-5"
          color="primary"
          size="3em"
        />
      </div>
      <div v-else>
        <q-tabs v-model="tab" class="text-primary">
          <q-tab name="about" label="About" class="details-tab" />
          <q-tab name="moves" label="Moves" class="details-tab" />
        </q-tabs>
        <div v-if="tab === 'about'" class="mt-3">
          <div class="details-about-box">
            <div class="details-about-title details-about-title-width">Height:</div>
            <div class="details-about-info"> {{ pokemon.height }} </div>
          </div>
          <div class="details-about-box">
            <div class="details-about-title details-about-title-width">Weight:</div>
            <div class="details-about-info"> {{ pokemon.weight }} </div>
          </div>
          <div class="details-about-box">
            <div class="details-about-title details-about-title-width">Experience:</div>
            <div class="details-about-info"> {{ pokemon.base_experience }} </div>
          </div>
          <div class="details-about-box">
            <div class="details-about-title details-about-title-width">Type:</div>
            <div class="details-about-info-box" v-for="(type, index) in pokemon.types" :key="index">
              {{ type.type.name }}
            </div>
          </div>
          <div class="card-name mt-3">Base stats</div>
          <div class="details-graphic-container">
            <img class="details-graphic" src="../assets/graphic.svg" alt="">
            <div class="details-about-container">
              <div class="d-flex align-items-end" v-for="(stat, index) in pokemon.stats" :key="index">
                <div class="details-about-title" style="width: 100px; margin-bottom: -3px;"> {{ stat.stat.name === 'special-defense' ? 'Sp Defense' : stat.stat.name === 'special-attack' ? 'Sp Attack' : stat.stat.name }} </div>
                <div></div>
                <div style="width: 100%">
                  <q-linear-progress size="15px" :value="stat.base_stat/100" class="q-mt-md" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="tab === 'moves'" class="mt-3">
          <div  class="row align-items-center">
            <div class="col-4" v-for="(move, index) in pokemon.moves" :key="index">
              <div class="col-details"> {{ move.move.name }} </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import axios from 'axios'

export default defineComponent({
  name: 'DetailsPage',
  data: () => {
    return {
      pokemon: {},
      tab: "about",
      loading: false
    }
  },
  methods: {
    redirectHome(){
      this.$router.push('/')
    }
  },
  created(){
    this.loading = true
    let pokemonId = this.$route.query.pokemonId
    axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
      .then(res => {
        this.pokemon = res.data
        this.loading = false
      })
      .catch(err => console.log(err))
  }
})
</script>
