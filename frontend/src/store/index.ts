import Vue from 'vue'
import Vuex from 'vuex'
import ExeParser from "@/assets/common/ExeParser";
import DataUnit from "@/assets/common/ExeParser/src/modules/binary/dataUnit";
import CalcEntropy, {EntropyData} from "@/assets/common/ExeParser/src/extensions/entropy";
import FindAccesses, {Category} from "@/assets/common/ExeParser/src/extensions/access";
import FindAlarms, {Alarm} from "@/assets/common/ExeParser/src/extensions/alarms";
import FindThreats, {ThreatData} from "@/assets/common/ExeParser/src/extensions/threats";

Vue.use(Vuex)

type StateStatus = "prepared" | "processing" | "ready"
type Extension = {
  status: StateStatus,
}

export default new Vuex.Store({
  state: {
    buttons: {
      statusReport:false,
      statusInfo:false,
      statusThreat:false,
      statusAccesses:false,
      statusWarnings:false,
      statusEntropy:false,
      statusSections:false,
      statusImports:false,
      statusExports:false
    },
    parser: {
      status: "prepared" as StateStatus,
      file: {} as File,
      exe: {} as ExeParser,
      extensions: {

        entropy: {
          status: "prepared" as StateStatus,
          data: {} as EntropyData,
        },

        accesses: {
          status: "prepared" as StateStatus,
          data: [] as Category[],
        },

        alarms: {
          status: "prepared" as StateStatus,
          data: [] as Alarm[],
        },

        threats: {
          status: "prepared" as StateStatus,
          data: { }as ThreatData,
        },

      },
    },

  },
  mutations: {
    _parse(state, data: DataUnit) {
      state.parser.exe = new ExeParser(data)
    }
  },
  actions: {

    // Запускает анализ файла
    // Актуальное состояние можно узнать в статусе и расширениях
    async analyze(ctx, file: File) {
      ctx.state.parser.status = "processing"
      try {

        ctx.state.parser.file = file
        const data = await new DataUnit().setFile(file)
        ctx.commit("_parse", data)

        // Модуль энтропии
        ctx.state.parser.extensions.entropy.status = "processing"
        ctx.state.parser.extensions.entropy.data = await CalcEntropy(ctx.state.parser.exe)
        ctx.state.parser.extensions.entropy.status = "ready"

        // Модуль доступов
        ctx.state.parser.extensions.accesses.status = "processing"
        ctx.state.parser.extensions.accesses.data = await FindAccesses(ctx.state.parser.exe)
        ctx.state.parser.extensions.accesses.status = "ready"

        // Модуль предупреждений
        ctx.state.parser.extensions.alarms.status = "processing"
        ctx.state.parser.extensions.alarms.data = await FindAlarms(ctx.state.parser.exe, ctx.state.parser)
        ctx.state.parser.extensions.alarms.status = "ready"

        // Модуль предупреждений
        ctx.state.parser.extensions.threats.status = "processing"
        ctx.state.parser.extensions.threats.data = await FindThreats(data)
        ctx.state.parser.extensions.threats.status = "ready"

        ctx.state.parser.status = "ready"
      } catch (e) {
        ctx.state.parser.status = "prepared"
        throw e
      }
    },

    // Сбрасывает обработку
    // Дабы не сломать логику не останавливает текущую работу
    async reset(ctx) {
      if (ctx.state.parser.status === "ready") {
        ctx.state.parser.status = "prepared"
        for (let extName in ctx.state.parser.extensions) {
          const ext = (ctx.state.parser.extensions as any)[extName]
          ext.status = "prepared"
        }
      }
    }

  },
  modules: {}
})
