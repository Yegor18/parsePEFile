import {DataUnit, DataSection} from '../binary'
import DosHeader from "./dosHeader";
import NtHeader from "./ntHeader";
import Section from "./sections/section";

// Объединяет в себе все заголовки приложения
export default class ExeHeader extends DataSection {
  // Вложенные заголовки
  to = {
    dos: new DosHeader(),
    nt: new NtHeader(),
  }
  // Секции
  sections = [] as Section[]

  // Парсинг заголовков и секций файла
  parse(data: DataUnit, offset: number = 0) {
    // Используется перегруженный метод т.к. точка парса для nt берётся из dos
    console.log("exeHeader Look at this fields from data section ", this.fields)
    this.to.dos.parse(data, offset);
    this.to.nt.parse(data, this.to.dos.fields.e_lfanew.toNumber())
    this.parseSections(data)
    return this
  }

  // Парсинг для секций
  private parseSections(data: DataUnit) {
    const offset = this.to.dos.fields.e_lfanew.toNumber() + this.to.nt.totalLength()
    const sectionsCount = this.to.nt.to.optional.fields.NumberOfRvaAndSizes.toNumber()

    for (let i = 0; i < sectionsCount; i++) {
      const section = new Section()
      section.parse(data, offset + i * section.totalLength())
      if (section.fields.VirtualSize.toNumber() === 0) break
      this.sections.push(section)
    }
  }

  // Валиден ли заголовок файла
  isValid() {
    return this.to.dos.isValid() && this.to.nt.isValid()
  }
}
