<template>
  <v-app>
    <v-content>

      <v-fade-transition>
        <router-view class="app-router"/>
      </v-fade-transition>

    </v-content>
  </v-app>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'

  @Component({
    components: {
    }
  })
  export default class App extends Vue {
  }
</script>

<style scoped lang="stylus">
  .app-router
    padding 0 0 0 0
</style>
