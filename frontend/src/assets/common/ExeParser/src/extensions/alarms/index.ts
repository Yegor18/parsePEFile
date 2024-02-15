import ExeParser from "@/assets/common/ExeParser";
import {Category} from "@/assets/common/ExeParser/src/extensions/access";
import {EntropyData} from "@/assets/common/ExeParser/src/extensions/entropy";

export type Alarm = {
  icon: string,
  description: string,
  check: (parser: any) => boolean,
}

export default async function FindAlarms(exe: ExeParser, parser: any) {
  const alarms = <Alarm[]>[
    {
      icon: "mdi-file-tree",
      description: "Управление реестром",
      check: pars => {
        const access = pars.extensions.accesses.data as Category[]
        for (let acc of access) {
          if (acc.category === "Реестр") return true
        }
      }
    },
    {
      icon: "mdi-bug",
      description: "Функции отладки",
      check: pars => {
        const access = pars.extensions.accesses.data as Category[]
        for (let acc of access) {
          if (acc.category === "Отладка") return true
        }
      }
    },
    {
      icon: "mdi-transit-connection-variant",
      description: "Динамические модули",
      check: pars => {
        const access = pars.extensions.accesses.data as Category[]
        for (let acc of access) {
          if (acc.category === "Отладка") return true
        }
      }
    },
    {
      icon: "mdi-powershell",
      description: "Доступ к командной строке",
      check: pars => {
        const access = pars.extensions.accesses.data as Category[]
        for (let acc of access) {
          if (acc.category === "Командная строка") return true
        }
      }
    },
    {
      icon: "mdi-bus-double-decker",
      description: "Несколько исполняемых секций",
      check: pars => {
        const exe = pars.exe as ExeParser
        let exeSections = 0
        exe.headers.sections.forEach(sec => {
          sec.meta.chars.forEach(char => {
            if (char === "MEM_EXECUTE") exeSections++
          })
        })
        if (exeSections > 1) return true
      }
    },
    {
      icon: "mdi-zip-box",
      description: "Файл упакован",
      check: pars => {
        const exe = pars.exe as ExeParser
        for (let sec of exe.headers.sections)
          if (sec.meta.name === "UPX0") return true
      }
    },
    {
      icon: "mdi-dots-horizontal-circle",
      description: "Высокая энтропия, возможно сжатые или шифрованные данные",
      check: pars => {
        const entropy = pars.extensions.entropy.data as EntropyData
        for (let sec of entropy.sections)
          if (sec.entropy > 0.90) return true
      }
    },
  ]

  let active = [] as Alarm[]
  alarms.forEach(alarm => {
    if (alarm.check(parser)) active.push(alarm)
  })

  return active
}
