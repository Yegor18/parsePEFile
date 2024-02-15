<template>
  <AppLayout>

    <template #main>
          <FileInput @change="onFileChange" @error="onFileError"/>
    </template>

    <!-- МАГИЯ ОПИСАНИЯ -->
    <template #block-magic v-if="$store.state.parser.status === 'ready'">
      <v-btn
        size="x-large"
        @click="$store.state.buttons.statusReport = !$store.state.buttons.statusReport"
      >
        {{$store.state.buttons.statusReport ? "Скрыть статус" : "Показать статус"}}
      </v-btn>

      <v-snackbar
      v-model="$store.state.buttons.statusReport"
      timeout=5000000000000000
      location="center"
    >

    <v-expand-x-transition>
        <v-card v-if="$store.state.parser.status === 'ready'" >
          <v-card-title>
            <v-icon class="mr-2">mdi-auto-fix</v-icon>
            <span>Отчёт</span>
          </v-card-title>
          <v-card-text>
            {{ magicString }}
          </v-card-text>
        </v-card>
      </v-expand-x-transition>

      <template v-slot:actions>
        <v-btn @click="() => {
          $store.state.buttons.statusReport= false
        }">Close</v-btn>
      </template>
    </v-snackbar>
    </template>

    <!-- ОБЩАЯ ИНФОРМАЦИЯ -->
    <template #block-info v-if="$store.state.parser.status === 'ready'">
      <v-btn
        size="x-large"
        @click="$store.state.buttons.statusInfo = !$store.state.buttons.statusInfo"
      >
      {{$store.state.buttons.statusInfo ? "Скрыть инфо" : "Показать инфо"}}
      </v-btn>

      <v-snackbar
      v-model="$store.state.buttons.statusInfo"
      timeout=5000000000000000
      location="center"
    >

      <v-expand-x-transition >
        <v-card v-if="$store.state.parser.status === 'ready'" >
          <v-card-title>
            <v-icon class="mr-2">mdi-application</v-icon>
            <span>О файле</span>
          </v-card-title>
          <v-card-text>
            Тип файла: <b>{{ $store.state.parser.exe.headers.to.nt.to.optional.meta.magic }}</b>
            <br>
            Архитектура: <b>{{ $store.state.parser.exe.headers.to.nt.to.file.meta.machine }}</b>
            <br>
            Минимальная ОС: <b>{{ $store.state.parser.exe.headers.to.nt.to.optional.meta.osVersion }}</b>
            <br>
            Подсистема: <b>{{ $store.state.parser.exe.headers.to.nt.to.optional.meta.subsystem }}</b>
            <br>
            Флаги:
            <v-chip
              v-for="char in $store.state.parser.exe.headers.to.nt.to.file.meta.chars"
              x-small>
              {{ char }}
            </v-chip>
            <br>
            DLL Флаги:
            <v-chip
              v-for="char in $store.state.parser.exe.headers.to.nt.to.optional.meta.dllChars"
              x-small>
              {{ char }}
            </v-chip>
            <br>
          </v-card-text>
        </v-card>
      </v-expand-x-transition>
      </v-snackbar>
    </template>

<template #block-threats v-if="$store.state.parser.status === 'ready'">
      <v-btn
        size="x-large"
        @click="$store.state.buttons.statusThreat = !$store.state.buttons.statusThreat"
      >
        {{$store.state.buttons.statusThreat ? "Скрыть Наличие угроз" : "Показать наличие угроз"}}
      </v-btn>

      <v-snackbar
      v-model="$store.state.buttons.statusThreat"
      timeout=5000000000000000
      location="center"
    >

    <v-expand-x-transition>
        <v-card v-if="$store.state.parser.status === 'ready'" >
          <v-card-title>
            <v-icon class="mr-2">mdi-auto-fix</v-icon>
            <span>Отчёт</span>
          </v-card-title>
          <v-card-text>
            {{$store.state.parser.extensions.threats.data.name}}
            <br>
            {{$store.state.parser.extensions.threats.data.description}}
          </v-card-text>
        </v-card>
      </v-expand-x-transition>

      <template v-slot:actions>
        <v-btn @click="() => {
          $store.state.buttons.statusThreat= false
        }">Close</v-btn>
      </template>
    </v-snackbar>
    </template>

    <!-- ДОСТУПЫ -->
    <template #block-access v-if="$store.state.parser.status === 'ready'">
      <v-btn
        size="x-large"
        @click="$store.state.buttons.statusAccesses = !$store.state.buttons.statusAccesses"
      >
        {{$store.state.buttons.statusAccesses ? "Скрыть доступы" : "Показать доступы"}}
      </v-btn>
      <v-snackbar
      v-model="$store.state.buttons.statusAccesses"
      timeout=5000000000000000
      location="center"
    >
      <v-expand-transition>
        <v-card v-if="$store.state.parser.extensions.accesses.status === 'ready'">
          <v-card-title>
            <v-icon class="mr-2">mdi-lock-open-variant</v-icon>
            <span>Доступы: {{ $store.state.parser.extensions.accesses.data.length }}</span>
          </v-card-title>
          <v-card-text>

            <v-expansion-panels v-if="$store.state.parser.extensions.accesses.data.length">
              <v-expansion-panel
                v-for="category in $store.state.parser.extensions.accesses.data"
                :key="category.category"
              >
                <v-expansion-panel-header>
                  <div>
                    <v-icon class="mr-2" :color="category.color">{{ category.icon }}</v-icon>
                    <span class="mr-2">{{ category.category }}</span>
                    <v-chip
                      x-small
                      v-for="access in category.accesses"
                    >{{ access.name }}
                    </v-chip>
                  </div>
                </v-expansion-panel-header>
                <v-expansion-panel-content>

                  <v-simple-table>
                    <template #default>
                      <thead>
                      <tr>
                        <th class="text-left">Доступ</th>
                        <th class="text-left">Библиотека</th>
                        <th class="text-left">Функция</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr
                        v-for="access in category.accesses"
                        :key="access.name"
                      >
                        <td>
                          <v-icon class="mr-2" :color="access.color">{{ access.icon }}</v-icon>
                          <span>{{ access.name }}</span>
                        </td>
                        <td>{{ access.lib }}</td>
                        <td>{{ access.func }}</td>
                      </tr>
                      </tbody>
                    </template>
                  </v-simple-table>

                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>

          </v-card-text>
        </v-card>
      </v-expand-transition>
      </v-snackbar>
    </template> <!-- -->

    <!-- ПРЕДУПРЕЖДЕНИЯ -->
    <template #block-alerts v-if="$store.state.parser.status === 'ready'">
      <v-btn
        size="x-large"
        @click="$store.state.buttons.statusWarnings = !$store.state.buttons.statusWarnings"
      >
        {{$store.state.buttons.statusWarnings ? "Скрыть предупреждения" : "Показать предупреждения"}}
      </v-btn>
      <v-snackbar
      v-model="$store.state.buttons.statusWarnings"
      timeout=5000000000000000
      location="center"
    >
      <v-expand-transition>
        <v-card v-if="$store.state.parser.extensions.alarms.status === 'ready'">
          <v-card-title>
            <v-icon class="mr-2">mdi-alert</v-icon>
            <span>Предупреждения</span>
          </v-card-title>
          <v-card-text>

            <v-simple-table>
              <template #default>
                <tbody>
                <tr
                  v-for="alarm in $store.state.parser.extensions.alarms.data"
                  :key="alarm.description"
                >
                  <td>
                    <v-icon class="mr-2">{{ alarm.icon }}</v-icon>
                    <span>{{ alarm.description }}</span>
                  </td>
                </tr>
                </tbody>
              </template>
            </v-simple-table>

          </v-card-text>
        </v-card>
      </v-expand-transition>
      </v-snackbar>
    </template> <!-- -->

    <!-- ЭНТРОПИЯ -->

     <template #block-entropy v-if="$store.state.parser.status === 'ready'">
      <v-btn
        size="x-large"
        @click="$store.state.buttons.statusEntropy = !$store.state.buttons.statusEntropy"
      >
        {{$store.state.buttons.statusEntropy ? "Скрыть энтропию" : "Показать энтропию"}}
      </v-btn>
      <v-snackbar
      v-model="$store.state.buttons.statusEntropy"
      timeout=5000000000000000
      location="center"
    >
      <v-expand-transition>
        <v-card v-if="$store.state.parser.extensions.entropy.status === 'ready'">
          <v-card-title>
            <v-icon class="mr-2">mdi-dots-horizontal-circle</v-icon>
            <span>Энтропия</span>
          </v-card-title>
          <v-card-text>

            <v-progress-linear
              class="mb-2"
              :value="$store.state.parser.extensions.entropy.data.file * 100"
              :color="entropyInfo($store.state.parser.extensions.entropy.data.file).color"
              height="40"
              rounded
            >
              <template v-slot="{ value }">
                <strong>Файл: {{ Math.ceil(value) }}% - {{ entropyInfo(value/100).text }}</strong>
              </template>
            </v-progress-linear>

            <v-progress-linear
              class="mb-2"
              v-for="section in $store.state.parser.extensions.entropy.data.sections"
              :key="section.name"
              :value="section.entropy * 100"
              :color="entropyInfo(section.entropy).color"
              height="20"
              rounded
            >
              <template v-slot="{ value }">
                <strong>{{ section.name }}: {{ Math.ceil(value) }}% - {{ entropyInfo(value/100).text }}</strong>
              </template>
            </v-progress-linear>

          </v-card-text>
        </v-card>
      </v-expand-transition>
      </v-snackbar>
    </template> <!---->

    <!-- СЕКЦИИ -->

     <template #block-sections v-if="$store.state.parser.status === 'ready'">
      <v-btn
        size="x-large"
        @click="$store.state.buttons.statusSections = !$store.state.buttons.statusSections"
      >
        {{$store.state.buttons.statusSections ? "Скрыть секции" : "Показать секции"}}
      </v-btn>
      <v-snackbar
      v-model="$store.state.buttons.statusSections"
      timeout=5000000000000000
      location="center"
    >
      <v-expand-transition>
        <v-card v-if="$store.state.parser.status === 'ready'">
          <v-card-title>
            <v-icon class="mr-2">mdi-chart-donut-variant</v-icon>
            <span>Секции</span>
          </v-card-title>
          <v-card-text>
            <v-simple-table dense>
              <template #default>
                <thead>
                <tr>
                  <th class="text-left">Название</th>
                  <th class="text-left">Флаги</th>
                  <th class="text-left">Смещение</th>
                  <th class="text-left">Размер</th>
                </tr>
                </thead>
                <tbody>
                <tr
                  v-for="section in $store.state.parser.exe.headers.sections"
                  :key="section.fields.Name.toNumber()"
                >
                  <td>{{ section.meta.name }}</td>
                  <td>
                    <v-chip
                      v-for="char in section.meta.chars"
                      :key="char"
                      x-small
                      :color="{
                        MEM_EXECUTE: color.red.lighten1,
                        CNT_CODE: color.blue.lighten1,
                        MEM_WRITE: color.yellow.lighten2,
                        MEM_READ: color.green.lighten4,
                        CNT_INITIALIZED_DATA: color.indigo.lighten4,
                        CNT_UNINITIALIZED_DATA: color.deepPurple.lighten4,
                      }[char] || null"
                    >
                      {{ char }}
                    </v-chip>
                  </td>
                  <td>{{ section.fields.PointerToRawData.toNumber() }}</td>
                  <td>{{ section.fields.SizeOfRawData.toNumber() }}</td>
                </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card-text>
        </v-card>
      </v-expand-transition>
      </v-snackbar>
    </template> <!---->

    <!--ИМПОРТЫ -->
     <template #block-imports v-if="$store.state.parser.status === 'ready'">
      <v-btn
        size="x-large"
        @click="$store.state.buttons.statusImports = !$store.state.buttons.statusImports"
      >
        {{$store.state.buttons.statusImports ? "Скрыть импорты" : "Показать импорты"}}
      </v-btn>
      <v-snackbar
      v-model="$store.state.buttons.statusImports"
      timeout=5000000000000000
      location="center"
    >
      <v-expand-transition>
        <v-card v-if="$store.state.parser.status === 'ready'">
          <v-card-title>
            <v-icon class="mr-2">mdi-import</v-icon>
            <span>Импортирует {{ $store.state.parser.exe.directories.dir.imports.length ? '' : '- Нет зависимостей' }}</span>
          </v-card-title>
          <v-card-text v-if="$store.state.parser.exe.directories.dir.imports.length">
            <v-expansion-panels>
              <v-expansion-panel>
                <v-expansion-panel-header>
                  Импортирует
                  {{ $store.state.parser.exe.directories.dir.imports.length }}
                  библиотек
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-simple-table dense>
                    <template #default>
                      <thead>
                      <tr>
                        <th class="text-left">Название</th>
                        <th class="text-left">Функции</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr v-for="imp in $store.state.parser.exe.directories.dir.imports"
                          :key="imp.fields.ModuleName.toNumber()">
                        <td>{{ imp.meta.name }}</td>
                        <td>
                          <v-chip
                            v-for="func in imp.meta.funcs"
                            :key="`${imp.meta.name}.${func}`"
                            x-small
                            :color="importColor(imp.meta.name, func)"
                          >
                            {{ func }}
                          </v-chip>
                        </td>
                      </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card-text>
        </v-card>
      </v-expand-transition>
      </v-snackbar>
    </template> <!---->

    <!--ЭКСПОРТЫ -->
     <template #block-exports v-if="$store.state.parser.status === 'ready'">
      <v-btn
        size="x-large"
        @click="$store.state.buttons.statusExports = !$store.state.buttons.statusExports"
      >
        {{$store.state.buttons.statusExports ? "Скрыть экспорты" : "Показать экспорты"}}
      </v-btn>
      <v-snackbar
      v-model="$store.state.buttons.statusExports"
      timeout=5000000000000000
      location="center"
    >
      <v-expand-transition>
        <v-card v-if="$store.state.parser.status === 'ready'">
          <v-card-title>
            <v-icon class="mr-2">mdi-export</v-icon>
            <span>Экспортирует - {{ $store.state.parser.exe.directories.dir.export.meta.name || 'Нет экспортов' }}</span>
          </v-card-title>
          <v-card-text v-if="$store.state.parser.exe.directories.dir.export.meta.name">
            <v-expansion-panels>
              <v-expansion-panel>
                <v-expansion-panel-header>
                  Экспортирует
                  {{ $store.state.parser.exe.directories.dir.export.fields.NumberOfFunctions.toNumber() }}
                  функций и
                  {{ $store.state.parser.exe.directories.dir.export.fields.NumberOfNames.toNumber() }}
                  имён
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  Сдвиг ординалов: {{ $store.state.parser.exe.directories.dir.export.fields.Base.toNumber() }}
                  <v-simple-table dense>
                    <template #default>
                      <thead>
                      <tr>
                        <th class="text-left">Название</th>
                        <th class="text-left">Ординал</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr v-for="exp in $store.state.parser.exe.directories.dir.export.meta.exports" :key="exp.ordinal">
                        <td>{{ exp.name }}</td>
                        <td>{{ exp.ordinal }}</td>
                      </tr>

                      </tbody>
                    </template>
                  </v-simple-table>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card-text>
        </v-card>
      </v-expand-transition>
      </v-snackbar>
    </template> <!---->

  </AppLayout>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import colors from 'vuetify/es5/util/colors'
  import AppLayout from "@/components/AppLayout/AppLayout.vue";
  import FileInput from "@/components/FileInput/FileInput.vue";
  import { defineAsyncComponent } from 'vue';
  @Component({
    components: {
      AppLayout,
      FileInput,
    }
  })
  export default class MainPage extends Vue {
    onFileChange() {
      // console.log('store', this.$store.state.parser.exe)
    }

    onFileError(e: Error) {
      console.warn(e)
    }

    entropyInfo(entropy: number) {
      const infos = [
        {
          value: 0.3,
          color: colors.blue.lighten4,
          text: 'Очень низкий'
        },
        {
          value: 0.4,
          color: colors.blue.lighten2,
          text: 'Ниже нормы'
        },
        {
          value: 0.75,
          color: colors.blue.base,
          text: 'В пределах нормы'
        },
        {
          value: 0.85,
          color: colors.indigo.lighten1,
          text: 'Выше нормы'
        },
        {
          value: 0.95,
          color: colors.deepPurple.lighten1,
          text: 'Очень высокий'
        },
        {
          value: 0.9,
          color: colors.purple.lighten1,
          text: 'Предельно'
        },
        {
          value: 1.0,
          color: colors.red.lighten1,
          text: 'Максимально'
        },
      ]
      let info = infos[0]
      for (let i = infos.length - 1; i > 0; i--) {
        if (infos[i].value > entropy) {
          info = infos[i]
        }
      }
      return info
    }

    get color() {
      return colors
    }

    get magicString() {
      const parser = this.$store.state.parser
      const exe = parser.exe

      // Общая информация

      let bits = '64'
      switch (exe.headers.to.nt.to.optional.meta.magic) {
        case 'PE32':
          bits = '32 битный'
          break
        case 'PE64':
          bits = '64 битный'
          break
        case 'ROM':
          bits = 'ROM'
          break
      }

      let isNet = false
      if (exe.directories.dir.imports.find((imp: any) => imp.meta.name === 'mscoree.dll')) isNet = true

      let isGUI = false
      if (exe.headers.to.nt.to.optional.meta.subsystem === 'WindowsGui') isGUI = true

      let arch = exe.headers.to.nt.to.file.meta.machine
      let isDLL = !!exe.headers.to.nt.to.file.meta.chars.find((char: string) => char === 'DLL')
      let osVersion = exe.headers.to.nt.to.optional.meta.osVersion

      let sectionsNames = exe.headers.sections.map((sec: any) => sec.meta.name).join(', ')
      let executableSections = exe.headers.sections.filter((sec: any) => !!sec.meta.chars.find((char: any) => char === 'MEM_EXECUTE')).map((sec: any) => sec.meta.name).join(', ')

      let exportsNames = exe.directories.dir.export.meta.exports.map((exp: any) => exp.name).join(', ')
      let importsNames = exe.directories.dir.imports.map((imp: any) => imp.meta.name).join(', ')

      let fileEntropy = ((parser.extensions.entropy.data.file * 1000) | 0) / 10

      let accesses = parser.extensions.accesses.data.map((access: any) => access.category).join(', ')
      let alarms = parser.extensions.alarms.data.map((alarm: any) => alarm.description).join(', ')

      return `
      ${parser.file.name} (${parser.file.size} байт) - это ${bits} ${isGUI ? 'графический' : 'консольный'}
      ${isNet ? '.NET' : 'классический'} ${isDLL ? 'файл динамической библиотеки' : 'запускаемый файл'}
      на архитектуре ${arch} под ${osVersion}.
      Файл содержит секций ${exe.headers.sections.length}: ${sectionsNames}
      из них исполняемые ${executableSections || 'отсутствуют'}.
      ${exportsNames ? `Экспортирует: ${exportsNames}` : 'Не экспортирует функций'}.
      ${importsNames ? `Зависит от внешних библиотек: ${importsNames}` : `Не импортирует внешние зависимости`}.
      Энтропия всего файла составляет ${fileEntropy}%.
      ${accesses ? `Имеет доступ к системам: ${accesses}` : 'Специальных доступов не требует'}.
      ${alarms ? `Предупреждения системы: ${alarms}` : `Предупреждений от системы нет`}.
      `
    }

    async getHashesInTable() {
      // const knex = require('knex')({
      //     client: 'sqlite3',
      //     connection: {
      //       filename: "ksgmprh.db"
      //     },
      //     useNullAsDefault: true
      //   });
      // return await knex.raw("select * from b").then((result) => {
      //   console.log("Hash: ", result[0].hash)
      //   return result[0].hash;
      // });
    }

    // Возвращает цвет плашки для импорта от имени библиотеки и функции
    importColor(lib: string, func: string) {
      const patterns = [
        {
          color: colors.green.lighten4,
          lib: 'KERNEL32.dll',
          matches: [
            /^get/i,
          ]
        },
        {
          color: colors.purple.lighten4,
          lib: 'USER32.dll',
          matches: [
            /window/i,
          ]
        },
        {
          color: colors.pink.lighten3,
          lib: 'USER32.dll',
          matches: [
            /message/i,
          ]
        },

        // Остаточные пометки по предугадыванию

        {
          color: colors.blueGrey.lighten2,
          matches: [
            /event/i,
          ]
        },
        {
          color: colors.red.lighten3,
          matches: [
            /reg/i,
          ]
        },
        {
          color: colors.red.base,
          matches: [
            /shell/i,
          ]
        },
        {
          color: colors.lightBlue.lighten4,
          matches: [
            /mem/i,
          ]
        },
        {
          color: colors.lightBlue.lighten4,
          matches: [
            /alloc/i,
          ]
        },
        {
          color: colors.brown.lighten3,
          matches: [
            /file/i,
          ]
        },
        {
          color: colors.brown.lighten3,
          matches: [
            /directory/i,
          ]
        },
        {
          color: colors.blue.lighten2,
          matches: [
            /Module/,
            /Library/,
          ]
        },
        {
          color: colors.yellow.lighten4,
          matches: [
            /Proc/,
            /Thread/,
          ]
        },
        {
          color: colors.teal.lighten3,
          lib: 'KERNEL32.dll',
          matches: [
            /debug/i,
          ]
        },
      ]
      const pattern = patterns.find(pattern => {
        if (pattern.lib && pattern.lib !== lib) return false
        return pattern.matches.find(match => {
          if (match as any instanceof RegExp) {
            return (match as any as RegExp).test(func)
          } else {
            return (match as any as string) === func
          }
        })
      })
      return pattern?.color
    }
  }
</script>

<style scoped lang="stylus">
  .block-magic
    flex-direction:column
</style>
