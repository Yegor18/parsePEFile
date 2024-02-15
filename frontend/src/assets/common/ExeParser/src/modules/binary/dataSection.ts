import DataUnit from "./dataUnit";

// Общий класс позволяющий описать структуру секции (множество DataType)
export default abstract class DataSection {
  // Поля секции
  protected fields: Object = {}
  // Вложенные блоки
  protected to: Object = {}

  // Проходится по всем полям объекта fields и заполняет структуру
  // Затем рекурсивно проходит по всем вложенным секциям
  parse(data: DataUnit, offset = 0) {
    for (let name in this.fields) {
      const block = (<any>this.fields)[name] as DataUnit
      block.setBytes(data.data, offset, block.data.length)
      offset += block.data.length
    }

    for (let name in this.to) {
      const section = (<any>this.to)[name] as DataSection
      section.parse(data, offset)
      offset += section.totalLength()
    }
    return this
  }

  // Размер собственных полей
  fieldsLength() {
    let size = 0
    for (let name in this.fields) {
      const block = (<any>this.fields)[name] as DataUnit
      size += block.data.length
    }
    return size
  }

  // Размер всей структуры включая собственные поля и поля вложенных секций
  totalLength() {
    let size = this.fieldsLength()
    for (let name in this.to) {
      const section = (<any>this.to)[name] as DataSection
      size += section.totalLength()
    }
    return size
  }
}
