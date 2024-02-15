import {DataUnit, DataType, DataSection} from '../binary'

// Описывает DOS заголовок
export default class DosHeader extends DataSection {
  // Поля заголовка
  fields = {
    // Magic number (MZ)
    e_magic: new DataUnit(DataType.Word),
    // Bytes on last page of file
    e_cblp: new DataUnit(DataType.Word),
    // Pages in file
    e_cp: new DataUnit(DataType.Word),
    // Relocations
    e_crlc: new DataUnit(DataType.Word),
    // Size of header in paragraphs
    e_cparhdr: new DataUnit(DataType.Word),
    // Minimum extra paragraphs needed
    e_minalloc: new DataUnit(DataType.Word),
    // Maximum extra paragraphs needed
    e_maxalloc: new DataUnit(DataType.Word),
    // Initial (relative) SS value
    e_ss: new DataUnit(DataType.Word),
    // Initial SP value
    e_sp: new DataUnit(DataType.Word),
    // Checksum
    e_csum: new DataUnit(DataType.Word),
    // Initial IP value
    e_ip: new DataUnit(DataType.Word),
    // Initial CS value
    e_cs: new DataUnit(DataType.Word),
    // File address of relocation table
    e_lfarlc: new DataUnit(DataType.Word),
    // Overlay number
    e_ovno: new DataUnit(DataType.Word),
    // Reserved
    e_res: new DataUnit(DataType.Word * 4),
    // OEM identifier
    e_oemid: new DataUnit(DataType.Word),
    // OEM information; e_oemid specific
    e_oeminfo: new DataUnit(DataType.Word),
    // Reserved
    e_res2: new DataUnit(DataType.Word * 10),
    // File address of new exe header //TODO: Не должен выходить за пределы размера файла
    e_lfanew: new DataUnit(DataType.DWord),
  }

  // Проверят, что это валидный DOS заголовок
  isValid() {
    if (this.fields.e_magic.toString() !== 'MZ') return false
    if (this.fields.e_lfanew.toNumber() < 64) return false
    return true
  }
}
