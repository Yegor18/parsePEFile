<!--
AppLayout - Компоненты - карточки приложения с адаптивной вёрсткой
Позволяет удобно предоставить информацию

В компоненте используются слоты имена которых начинаются на "block"
Такие слоты будут переведены в раскладку карт.

Условная схема слотов:

[      main     ]
[block*] [block*]
[block*] [block*]

-->

<template>
  <v-container class="d-flex justify-content-center " style="flex-direction: column;justify-content: center;align-items: center;height: 100vh">

<!--    <v-row-->
<!--      :no-gutters="$vuetify.breakpoint.smAndDown"-->
<!--    >-->

<!--      &lt;!&ndash; Главный слот для объекта в полную ширину &ndash;&gt;-->
<!--      <v-col-->
<!--        cols="12"-->
<!--        :class="{-->
<!--          'mb-4': $vuetify.breakpoint.smAndDown-->
<!--        }"-->
<!--      >-->
<!--        <slot name="main"></slot>-->
<!--      </v-col>-->

<!--      &lt;!&ndash; Слоты начинающиеся с "block" &ndash;&gt;-->
<!--      <v-col-->
<!--        v-for="(slotName, i) in getCardBlocksNames()"-->
<!--        :key="i"-->
<!--        cols="12"-->
<!--        lg="6"-->
<!--        :class="{-->
<!--          'mb-4': $vuetify.breakpoint.smAndDown-->
<!--        }"-->
<!--      >-->
<!--        <slot :name="slotName"></slot>-->
<!--      </v-col>-->

<!--    </v-row>-->

    <div
      class="mb-5"
    >
      <slot name="main"></slot>
    </div>

    <div
      v-for="(slotName, i) in getCardBlocksNames()"
      style="width: 100%;position: center"
      class="mb-5"
    >
      <slot :name="slotName" ></slot>
    </div>

  </v-container>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'

  @Component
  export default class AppLayout extends Vue {
    // Возвращает имена слотов которые относят себя к блокам
    getCardBlocksNames() {
      return Object.keys(this.$scopedSlots).filter(slot => slot.match(/^block/im))
    }
  }
</script>

<style scoped lang="stylus">
  .card
    wigth:100%
</style>
