import ExeHeader from "./modules/headers/exeHeader";
import DataUnit from "./modules/binary/dataUnit";
import ExportDirectory from "./modules/dataDirectory/exportDirectory";
import DataDirectories from "./modules/dataDirectory/dataDirectories";

// Ошибка App
class AppError extends Error {
  name = 'App'
}

// Занимается парсингом и анализом файлов
export default class ExeParser {
  // Заголовки файла
  headers = new ExeHeader()
  // Разделы данных
  directories!: DataDirectories

  file!: DataUnit

  constructor(file: DataUnit) {
    this.file = file
    this.headers.parse(file)
    this.directories = new DataDirectories(this).parse(file)
    return this
  }

  // Высчитывает адрес смещения относительно файла из RVA адреса
  // RAW - Смещение относительно начала файла
  // VA = ImageBase + RVA
  rvaToRaw(rva: number) {
    // Выравнивание числа
    const alignUp = (n: number, align: number) => Math.ceil(n / align) * align
    // Определение индекса секции которой принадлежит RVA
    const getRvaSection = () => {
      const sections = this.headers.sections
      for (let i = 0; i < sections.length; i++) {
        const start = sections[i].fields.VirtualAddress.toNumber()
        const end = start + alignUp(
          sections[i].fields.VirtualSize.toNumber(),
          this.headers.to.nt.to.optional.fields.SectionAlignment.toNumber()
        )
        if (rva >= start && rva < end) return sections[i]
      }
      return null
    }
    // Конвертация адреса в смещение
    const section = getRvaSection()
    // Если не удалось найти секцию (возможно она не существует, например export для *.exe)
    if (!section) return undefined
    return rva - section.fields.VirtualAddress.toNumber() + section.fields.PointerToRawData.toNumber()
  }
}
