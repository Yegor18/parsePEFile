import {DataUnit, DataType, DataSection} from '../../binary'

// Описывает блок в таблице секций
export default class Section extends DataSection {
  fields = {
    // Название секции
    Name: new DataUnit(DataType.Byte * 8),
    // Размер секции в виртуальной памяти
    VirtualSize: new DataUnit(DataType.DWord),
    // Адрес секции в виртуальной памяти RVA
    VirtualAddress: new DataUnit(DataType.DWord),
    // Размер  секции в файле
    SizeOfRawData: new DataUnit(DataType.DWord),
    // RAW смещение до начала секции
    // TODO: Также должен быть кратен FileAligment
    PointerToRawData: new DataUnit(DataType.DWord),
    //
    PointerToRelocations: new DataUnit(DataType.DWord),
    //
    PointerToLinenumbers: new DataUnit(DataType.DWord),
    //
    NumberOfRelocations: new DataUnit(DataType.Word),
    //
    NumberOfLinenumbers: new DataUnit(DataType.Word),
    // Атрибуты доступа к секции и правила для её загрузки в вирт. память.
    // Прогуглить их: https://docs.microsoft.com/ru-ru/windows/win32/api/winnt/ns-winnt-image_section_header?redirectedfrom=MSDN
    Characteristics: new DataUnit(DataType.DWord),
  }

  meta = {
    name: "",
    chars: [] as string[],
  }

  sectionData!: DataUnit

  parse(data: DataUnit, offset: number = 0): this {
    super.parse(data, offset);
    this.sectionData = data.copy(this.fields.PointerToRawData.toNumber(), this.fields.SizeOfRawData.toNumber())
    this.meta.name = this.fields.Name.toStringNT()
    this.fillChars()
    return this
  }

  private fillChars() {
    const chars = [
      {name: "TYPE_NO_PAD", flag: 0x00000008},
      {name: "CNT_CODE", flag: 0x00000020},
      {name: "CNT_INITIALIZED_DATA", flag: 0x00000040},
      {name: "CNT_UNINITIALIZED_DATA", flag: 0x00000080},
      {name: "LNK_OTHER", flag: 0x00000100},
      {name: "LNK_INFO", flag: 0x00000200},
      {name: "LNK_REMOVE", flag: 0x00000800},
      {name: "LNK_COMDAT", flag: 0x00001000},
      {name: "NO_DEFER_SPEC_EXC", flag: 0x00004000},
      {name: "GPREL", flag: 0x00008000},
      {name: "MEM_PURGEABLE", flag: 0x00020000},
      {name: "MEM_LOCKED", flag: 0x00040000},
      {name: "MEM_PRELOAD", flag: 0x00080000},
      {name: "ALIGN_1BYTES", flag: 0x00100000},
      {name: "ALIGN_2BYTES", flag: 0x00200000},
      {name: "ALIGN_4BYTES", flag: 0x00300000},
      {name: "ALIGN_8BYTES", flag: 0x00400000},
      {name: "ALIGN_16BYTES", flag: 0x00500000},
      {name: "ALIGN_32BYTES", flag: 0x00600000},
      {name: "ALIGN_64BYTES", flag: 0x00700000},
      {name: "ALIGN_128BYTES", flag: 0x00800000},
      {name: "ALIGN_256BYTES", flag: 0x00900000},
      {name: "ALIGN_512BYTES", flag: 0x00A00000},
      {name: "ALIGN_1024BYTES", flag: 0x00B00000},
      {name: "ALIGN_2048BYTES", flag: 0x00C00000},
      {name: "ALIGN_4096BYTES", flag: 0x00D00000},
      {name: "ALIGN_8192BYTES", flag: 0x00E00000},
      {name: "LNK_NRELOC_OVFL", flag: 0x01000000},
      {name: "MEM_DISCARDABLE", flag: 0x02000000},
      {name: "MEM_NOT_CACHED", flag: 0x04000000},
      {name: "MEM_NOT_PAGED", flag: 0x08000000},
      {name: "MEM_SHARED", flag: 0x10000000},
      {name: "MEM_EXECUTE", flag: 0x20000000},
      {name: "MEM_READ", flag: 0x40000000},
      {name: "MEM_WRITE", flag: 0x80000000},
    ]
    chars.forEach(char => {
      if (this.fields.Characteristics.toNumber() & char.flag) {
        this.meta.chars.push(char.name)
      }
    })
  }
}
