<template xmlns="http://www.w3.org/1999/html">
  <div class="d-flex justify-center align-center flex-column">
    <form ref="form" :action="false">
      <input
        ref="file-input"
        type="file"
        class="d-none"
      >
    </form>

    <v-btn
      v-if="$store.state.parser.status === 'prepared'"
      block
      color="purple"
      @click="onButtonClick"
    >
      <span>Загрузить файл</span>
      <v-icon right>mdi-arrow-up-bold-box-outline</v-icon>
    </v-btn>
    <v-btn
      v-if="$store.state.parser.status === 'processing'"
      block
      :loading="true"
      disabled
      color="purple"
    >
      <span>Подготовка ...</span>
    </v-btn>
    <v-btn
      v-else-if="$store.state.parser.status === 'ready'"
      block
      depressed
      @click="onFileCloseClick"
    >
      <span>{{$store.state.parser.file.name}} - {{$store.state.parser.file.size}} bytes</span>
      <v-icon right>mdi-file</v-icon>
    </v-btn>

  </div>
</template>

<script lang="ts">
  import {Component, Ref, Vue} from 'vue-property-decorator'

  @Component
  export default class FileInput extends Vue {
    @Ref('file-input') readonly fileInput!: HTMLInputElement
    @Ref('form') readonly form!: HTMLFormElement

    mounted() {
      this.fileInput.onchange = async e => {
        const files = (e.target as any).files as FileList
        if (files.length > 0) {
          try {
            await this.$store.dispatch("analyze", files[0])
            this.$emit('change')
          } catch (e) {
            this.$emit('error', e)
          }
        }
      }
    }

    onButtonClick() {
      this.fileInput.click()
    }

    onFileCloseClick() {
      this.$store.dispatch("reset")
      this.form.reset()
    }
  }
</script>

<style scoped lang="stylus">
</style>
