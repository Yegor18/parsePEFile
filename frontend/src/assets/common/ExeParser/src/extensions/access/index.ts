import ExeParser from "@/assets/common/ExeParser";

export type Category = {
  category: string,
  icon: string,
  color: string,
  accesses: Array<Access>,
}

export type Access = {
  name: string,
  icon: string,
  color: string,
  lib?: string,
  func?: string,
  matches: Array<RegExp>,
}

export default async function FindAccesses(exe: ExeParser) {
  const categories = <Array<Category>>[
    {
      category: "Реестр",
      icon: "mdi-file-tree",
      color: "",
      accesses: [
        {
          name: "Удалённое соединение",
          icon: "",
          color: "",
          matches: [
            /RegConnectRegistry/i,
          ]
        },
        {
          name: "Копирование дерева",
          icon: "",
          color: "",
          matches: [
            /RegCopyTree/i,
          ]
        },
        {
          name: "Создание ключа",
          icon: "mdi-key",
          color: "",
          matches: [
            /RegCreateKey/i,
          ]
        },
        {
          name: "Удаление ключа",
          icon: "mdi-key",
          color: "",
          matches: [
            /RegDeleteKey/i,
          ]
        },
        {
          name: "Удаление дерева",
          icon: "",
          color: "",
          matches: [
            /RegDeleteTree/i,
          ]
        },
        {
          name: "Удаление значения",
          icon: "",
          color: "",
          matches: [
            /RegDeleteValue/i,
          ]
        },
        {
          name: "Список ключей",
          icon: "mdi-key",
          color: "",
          matches: [
            /RegEnumKey/i,
            /RegLoadAppKey/i,
            /RegLoadKey/i,
          ]
        },
        {
          name: "Список значений",
          icon: "",
          color: "",
          matches: [
            /RegEnumValue/i,
          ]
        },
        {
          name: "Запись аттрибутов",
          icon: "",
          color: "",
          matches: [
            /RegFlushKey/i,
          ]
        },
        {
          name: "Чтение дескриптора безопасности",
          icon: "",
          color: "",
          matches: [
            /RegGetKeySecurity/i,
          ]
        },
        {
          name: "Установка дескриптора безопасности",
          icon: "",
          color: "",
          matches: [
            /RegSetKeySecurity/i,
          ]
        },
        {
          name: "Чтение значения",
          icon: "",
          color: "",
          matches: [
            /RegGetValue/i,
            /RegLoadMUIString/i,
            /RegQueryValue/i,
          ]
        },
        {
          name: "Уведомление об изменениях",
          icon: "",
          color: "",
          matches: [
            /RegNotifyChangeKeyValue/i,
          ]
        },
        {
          name: "Открытие ключа",
          icon: "mdi-key",
          color: "",
          matches: [
            /RegOpen/i,
          ]
        },
        {
          name: "Закрытие ключа",
          icon: "mdi-key",
          color: "",
          matches: [
            /RegClose/i,
          ]
        },
        {
          name: "Информация о ключе",
          icon: "mdi-key",
          color: "",
          matches: [
            /RegQueryInfoKey/i,
          ]
        },
        {
          name: "Информация о значении",
          icon: "",
          color: "",
          matches: [
            /RegQueryMultipleValues/i,
          ]
        },
        {
          name: "Изменение ключа",
          icon: "mdi-key",
          color: "",
          matches: [
            /RegReplaceKey/i,
            /RegRestoreKey/i,
            /RegSaveKey/i,
          ]
        },
        {
          name: "Изменение значения",
          icon: "",
          color: "",
          matches: [
            /RegSetKeyValue/i,
            /RegSetValue/i,
          ]
        },
      ],
    },
    {
      category: "События",
      icon: "mdi-flash",
      color: "",
      accesses: [
        {
          name: "Создание активности",
          icon: "",
          color: "",
          matches: [
            /EventActivityIdControl/i,
            /EventDescZero/i,
            /EventRegister/i,
          ]
        },
        {
          name: "Удаление активности",
          icon: "",
          color: "",
          matches: [
            /EventUnregister/i,
          ]
        },
        {
          name: "Проверка состояния",
          icon: "",
          color: "",
          matches: [
            /EventEnabled/i,
            /EventProviderEnabled/i,
          ]
        },
        {
          name: "Изменение",
          icon: "",
          color: "",
          matches: [
            /EventActivityIdControl/i,
            /EventDescCreate/i,
            /EventDescOrKeyword/i,
            /EventDescSet/i,
            /EventSet/i,
            /EventWrite/i,
          ]
        },
        {
          name: "Чтение",
          icon: "",
          color: "",
          matches: [
            /EventDescGet/i,
          ]
        },
      ],
    },
    {
      category: "Командная строка",
      icon: "mdi-powershell",
      color: "",
      accesses: [
        {
          name: "Исполнение",
          icon: "",
          color: "",
          matches: [
            /ShellExecute/i,
          ]
        },
      ],
    },
    {
      category: "Динамические модули",
      icon: "mdi-transit-connection-variant",
      color: "",
      accesses: [
        {
          name: "Загрузка",
          icon: "",
          color: "",
          matches: [
            /LoadLibrary/i,
          ]
        },
        {
          name: "Выгрузка",
          icon: "",
          color: "",
          matches: [
            /FreeLibrary/i,
          ]
        },
      ],
    },
    {
      category: "Файловая система",
      icon: "mdi-file",
      color: "",
      accesses: [
        {
          name: "Запись",
          icon: "",
          color: "",
          matches: [
            /WriteFile/i,
          ]
        },
        {
          name: "Управление курсором",
          icon: "",
          color: "",
          matches: [
            /SetFilePointer/i,
          ]
        },
        {
          name: "Изменение аттрибутов",
          icon: "",
          color: "",
          matches: [
            /SetFileAttributes/i,
          ]
        },
        {
          name: "Изменение времени",
          icon: "",
          color: "",
          matches: [
            /SetFileTime/i,
          ]
        },
        {
          name: "Удаление директории",
          icon: "",
          color: "",
          matches: [
            /RemoveDirectory/i,
          ]
        },
        {
          name: "Чтение",
          icon: "",
          color: "",
          matches: [
            /ReadFile/i,
          ]
        },
        {
          name: "Блокировка",
          icon: "",
          color: "",
          matches: [
            /LockFile/i,
          ]
        },
      ],
    },
    {
      category: "Подсистема .NET",
      icon: "mdi-dot-net",
      color: "",
      accesses: [
        {
          name: "Исполнение как модуль",
          icon: "",
          color: "",
          matches: [
            /mscoree.*CorDllMain/i,
          ]
        },
        {
          name: "Исполнение как приложение",
          icon: "",
          color: "",
          matches: [
            /mscoree.*CorExeMain/i,
          ]
        },
      ],
    },
    {
      category: "Отладка",
      icon: "mdi-bug",
      color: "",
      accesses: [
        {
          name: "Проверка удалённого отладчика",
          icon: "",
          color: "",
          matches: [
            /CheckRemoteDebuggerPresent/i,
          ]
        },
        {
          name: "Продолжение отладки",
          icon: "",
          color: "",
          matches: [
            /ContinueDebugEvent/i,
          ]
        },
        {
          name: "Подключение к процессу",
          icon: "",
          color: "",
          matches: [
            /DebugActiveProcess$/i,
          ]
        },
        {
          name: "Отключение от процесса",
          icon: "",
          color: "",
          matches: [
            /DebugActiveProcessStop/i,
          ]
        },
        {
          name: "Вызов точки остановки",
          icon: "",
          color: "",
          matches: [
            /DebugBreak/i,
          ]
        },
        {
          name: "Проверка локального отладчика",
          icon: "",
          color: "",
          matches: [
            /IsDebuggerPresent/i,
          ]
        },
        {
          name: "Сообщение отладчику",
          icon: "",
          color: "",
          matches: [
            /OutputDebugString/i,
          ]
        },
        {
          name: "Ожидание сообщения отладчика",
          icon: "",
          color: "",
          matches: [
            /WaitForDebugEvent/i,
          ]
        },
      ],
    },
  ]

  let accesses = [] as Category[]
  categories.forEach(category => {
    // Копируем категорию и будем добавлять туда правила которые прошли
    let cat = <Category>{
      category: category.category,
      icon: category.icon,
      color: category.color,
      accesses: [],
    }
    // Проверка каждого правила в категории
    category.accesses.forEach(access => {
      for (let imp of exe.directories.dir.imports)
        for (let func of imp.meta.funcs) {
          // Имя импорта формата: "ИмяБиблиотеки.dll.ИмяФункции"
          const name = `${imp.meta.name}.${func}`
          for (let match of access.matches) {
            if (match.test(name)) {
              let acc = <Access>{
                name: access.name,
                icon: access.icon,
                color: access.color,
                lib: imp.meta.name,
                func: func,
              }
              cat.accesses.push(acc)
              return
            }
          }
        }
    })
    // Если есть хоть одно правило из категории - добавляем категорию с этими правилами
    if (cat.accesses.length) accesses.push(cat)
  })

  return accesses
}
