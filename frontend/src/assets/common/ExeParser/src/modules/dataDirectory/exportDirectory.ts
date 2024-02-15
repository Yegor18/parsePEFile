import DataSection from "../binary/dataSection";
import DataUnit from "../binary/dataUnit";
import {DataType} from "../binary/dataType";
import ExeParser from "../../ExeParser";

type ExportFunc = {
  name: string,
  ordinal: number,
}

// Описывает таблицу секций
export default class ExportDirectory extends DataSection {
  // Поля структуры
  fields = {
    //
    Characteristics: new DataUnit(DataType.DWord),
    //
    TimeDateStamp: new DataUnit(DataType.DWord),
    //
    MajorVersion: new DataUnit(DataType.Word),
    //
    MinorVersion: new DataUnit(DataType.Word),
    //
    Name: new DataUnit(DataType.DWord),
    //
    Base: new DataUnit(DataType.DWord),
    //
    NumberOfFunctions: new DataUnit(DataType.DWord),
    //
    NumberOfNames: new DataUnit(DataType.DWord),
    //
    AddressOfFunctions: new DataUnit(DataType.DWord),
    //
    AddressOfNames: new DataUnit(DataType.DWord),
    //
    AddressOfNameOrdinals: new DataUnit(DataType.DWord),
  }

  // Поля приведённые в читабельный вид
  meta = {
    // Имя библиотеки
    name: '',
    // Экспорты
    exports: [] as ExportFunc[],
  }

  private exe?: ExeParser

  constructor(exe?: ExeParser) {
    super();
    this.exe = exe
  }

  parse(file: DataUnit, offset: number = 0): this {
    super.parse(file, offset);
    if (!this.exe) throw new Error(`Parse can't be invoked for empty constructor`)

    // Имя библиотеки
    const nameOffset = this.exe.rvaToRaw(this.fields.Name.toNumber())
    if (nameOffset === undefined) return this
    this.meta.name = file.copyNT(nameOffset).toString()

    // Массив ординалов
    const rawPtrOrdinals = this.exe.rvaToRaw(this.fields.AddressOfNameOrdinals.toNumber())
    if (rawPtrOrdinals === undefined) throw new Error(`can't parse exportDirectory, rawPtrOrdinals is undefined`)

    const rawPtrOrdinalsPtr = file.toBlockArray(rawPtrOrdinals, DataType.Word, this.fields.NumberOfNames.toNumber())
    const ordinals = rawPtrOrdinalsPtr.map(ptrOrdinal => ptrOrdinal.toNumber())
    ordinals.forEach(ord => {
      const exp: ExportFunc = {
        name: "",
        ordinal: ord
      }
      this.meta.exports.push(exp)
    })

    // Массив имён
    const rawPtrNames = this.exe.rvaToRaw(this.fields.AddressOfNames.toNumber())
    if (rawPtrNames === undefined) throw new Error(`can't parse exportDirectory, rawPtrNames is undefined`)

    let i = 0
    for (let exp of this.meta.exports) {
      const nameOffset = file.copy(rawPtrNames + i * DataType.DWord, DataType.DWord).toNumber()
      exp.name = nameOffset !== 0 ? file.copyNT(this.exe.rvaToRaw(nameOffset)).toString() : ''
      i++
    }

    return this
  }
}
