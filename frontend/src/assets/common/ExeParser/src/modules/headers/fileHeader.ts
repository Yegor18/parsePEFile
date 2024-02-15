import {DataUnit, DataType, DataSection} from '../binary'

// Описывает File Header
export default class FileHeader extends DataSection {
  // Поля заголовка
  fields = {
    // Architecture type of the computer
    Machine: new DataUnit(DataType.Word),
    // Size of the section table
    NumberOfSections: new DataUnit(DataType.Word),
    // Date and time the image was created
    TimeDataStamp: new DataUnit(DataType.DWord),
    // Offset of the symbol table, or zero if no COFF symbol table exists
    PointerToSymbolTable: new DataUnit(DataType.DWord),
    // Number of symbols in the symbol table
    NumberOfSymbols: new DataUnit(DataType.DWord),
    // NtOptional32Header
    SizeOfOptionalHeader: new DataUnit(DataType.Word),
    // ExecutableImage
    Characteristics: new DataUnit(DataType.Word),
  }

  meta = {
    machine: "",
    chars: [] as string[],
  }

  parse(data: DataUnit, offset: number = 0) {
    super.parse(data, offset);

    this.meta.machine = this.decodeMachineName(this.fields.Machine.toNumber())
    this.meta.chars = this.decodeChars(this.fields.Characteristics.toNumber())

    return this
  }

  private decodeMachineName(id: number) {
    const machines = {
      [String(0x0000)]: 'Unknown',
      [String(0x014C)]: 'I386',
      [String(0x014D)]: 'I486',
      [String(0x014E)]: 'PENTIUM',
      [String(0x0160)]: 'R3000_BE',
      [String(0x0162)]: 'R3000',
      [String(0x0166)]: 'R4000',
      [String(0x0168)]: 'R10000',
      [String(0x0169)]: 'WCEMIPSV2',
      [String(0x0184)]: 'ALPHA',
      [String(0x01A2)]: 'SH3',
      [String(0x01A3)]: 'SH3DSP',
      [String(0x01A6)]: 'SH4',
      [String(0x01A8)]: 'SH5',
      [String(0x01C0)]: 'ARM',
      [String(0x01C2)]: 'THUMB',
      [String(0x01D3)]: 'AM33',
      [String(0x01F0)]: 'POWERPC',
      [String(0x01F1)]: 'POWERPCFP',
      [String(0x0200)]: 'IA64',
      [String(0x0266)]: 'MIPS16',
      [String(0x0284)]: 'ALPHA64',
      [String(0x0366)]: 'MIPSFPU',
      [String(0x0466)]: 'MIPSFPU16',
      [String(0x0520)]: 'TRICORE',
      [String(0x0CEF)]: 'CEF',
      [String(0x0EBC)]: 'EBC',
      [String(0x8664)]: 'AMD64',
      [String(0x9104)]: 'M32R',
      [String(0xC0EE)]: 'CEE',
      [String(0x01C4)]: 'ARMNT'
    }
    return machines[id] || 'Unknown'
  }

  private decodeChars(id: number) {
    let chars = {
      [String(0x0001)]: 'RelocsStripped',
      [String(0x0002)]: 'ExecutableImage',
      [String(0x0004)]: 'LineNumsStripped',
      [String(0x0008)]: 'LocalSymsStripped',
      [String(0x0010)]: 'AggressiveWSTrim',
      [String(0x0020)]: 'LargeAddressAware',
      [String(0x0040)]: 'Reserved',
      [String(0x0080)]: 'BytesReversedLo',
      [String(0x0100)]: '32BitMachine',
      [String(0x0200)]: 'DebugStripped',
      [String(0x0400)]: 'RemovableRunFromSwap',
      [String(0x0800)]: 'NetRunFromSwap',
      [String(0x1000)]: 'System',
      [String(0x2000)]: 'DLL',
      [String(0x4000)]: 'UpSystemOnly',
      [String(0x8000)]: 'BytesReversedHi'
    }
    let charsList: Array<string> = []
    for (let code in chars) if ((id & +code) === +code) charsList.push(chars[code])
    return charsList
  }
}
