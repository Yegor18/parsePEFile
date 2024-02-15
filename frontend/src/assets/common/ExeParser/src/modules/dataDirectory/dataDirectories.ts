import ExportDirectory from "./exportDirectory"
import DataUnit from "../binary/dataUnit"
import {ExeHeader} from "../../modules/headers"
import ExeParser from "../../ExeParser";
import ImportDirectory from "../../modules/dataDirectory/importDirectory";

export default class DataDirectories {
  // Список вложенных директорий на чтение
  dir = {
    export: new ExportDirectory(),
    imports: [] as Array<ImportDirectory>,
  }

  // Доступ к приложению
  private exe!: ExeParser

  constructor(exe: ExeParser) {
    this.exe = exe
  }

  // Парсинг структур файла
  parse(file: DataUnit) {

    // Export
    const exportRva = this.exe.headers.to.nt.to.optional.to.dataDirectory.to.export.fields.VirtualAddress.toNumber()
    if (exportRva) {
      this.dir.export = new ExportDirectory(this.exe).parse(file, this.exe.rvaToRaw(exportRva))
    }

    // Imports
    const importsRva = this.exe.headers.to.nt.to.optional.to.dataDirectory.to.import.fields.VirtualAddress.toNumber()
    if (importsRva) {
      let importsOffset = this.exe.rvaToRaw(importsRva)!
      for (let i = 0; i < 10; i++) {
        const imp = new ImportDirectory(this.exe).parse(file, importsOffset)
        if (imp.fields.ModuleName.toNumber() === 0) break
        importsOffset += imp.totalLength()
        this.dir.imports.push(imp)
      }
    }

    return this
  }
}
