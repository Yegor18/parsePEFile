import DataSection from "../binary/dataSection";
import DataUnit from "../binary/dataUnit";
import {DataType} from "../binary/dataType";
import ExeParser from "../../ExeParser";

// Описывает таблицу секций
export default class ImportDirectory extends DataSection {
  // Поля структуры
  fields = {
    //
    ImportLookupTable: new DataUnit(DataType.DWord),
    //
    TimeDateStamp: new DataUnit(DataType.DWord),
    //
    ForwarderChain: new DataUnit(DataType.DWord),
    //
    ModuleName: new DataUnit(DataType.DWord),
    //
    ImportAddressTable: new DataUnit(DataType.DWord),
  }

  // Поля приведённые в читабельный вид
  meta = {
    // Имя библиотеки
    name: '',
    // Название импортируемых методов
    funcs: [] as string[],
  }

  private exe?: ExeParser

  constructor(exe?: ExeParser) {
    super();
    this.exe = exe
  }

  parse(file: DataUnit, offset: number = 0) {
    super.parse(file, offset);

    // Чтение имени модуля импорта
    this.meta.name = file.copyNT(this.exe?.rvaToRaw(this.fields.ModuleName.toNumber())).toString()

    // Чтение имён импортируемых функций
    const rawLookupTable = this.exe?.rvaToRaw(this.fields.ImportLookupTable.toNumber())
    if (rawLookupTable) {
      const lookups = file.toBlockArrayNT(rawLookupTable, DataType.DWord)
      lookups.forEach(lookup => {
        // is ordinal?
        if (lookup.toNumber() & 1 << 31) {
          // console.log('isOrdinal')
        } else {
          const rvaFunctionName = lookup.toNumber() & 0b011111111_11111111_11111111_11111111
          const name = file.copyNT(this.exe?.rvaToRaw(rvaFunctionName)! + DataType.Word).toString()
          this.meta.funcs.push(name)
        }
      })
    }

    return this
  }
}
