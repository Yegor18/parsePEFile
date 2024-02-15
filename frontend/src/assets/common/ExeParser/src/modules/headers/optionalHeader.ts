import {DataUnit, DataType, DataSection} from '../binary'
import DataDirectories from "./sections/dataDirectories"

// Описывает Optional Header
export default class OptionalHeader extends DataSection {
  // Поля заголовка
  fields = {
    // State of the image file
    Magic: new DataUnit(DataType.Word),
    // Major version of linker
    MajorLinkerVersion: new DataUnit(DataType.Byte),
    // Minor version of linker
    MinorLinkerVersion: new DataUnit(DataType.Byte),
    // Size of the code section
    SizeOfCode: new DataUnit(DataType.DWord),
    // Size of the initialized data section
    SizeOfInitializedData: new DataUnit(DataType.DWord),
    // Size of the uninitialized data section
    SizeOfUninitializedData: new DataUnit(DataType.DWord),
    // Pointer to the entry point function, relative to the image base address, or zero if no entry point is present
    AddressOfEntryPoint: new DataUnit(DataType.DWord),
    // Pointer to the beginning of the code section, relative to the image base
    BaseOfCode: new DataUnit(DataType.DWord),
    // Pointer to the beginning of the data section, relative to the image base
    BaseOfData: new DataUnit(DataType.DWord),
    // Preferred address of the first byte of the image when it is loaded in memory
    // TODO: В большистве случаев равен 0x00400000.
    ImageBase: new DataUnit(DataType.DWord),
    // Alignment of the section loaded in memory
    SectionAlignment: new DataUnit(DataType.DWord),
    // Alignment of the raw data of sections in the image file
    FileAlignment: new DataUnit(DataType.DWord),
    // Major version number of the required operating system
    MajorOperatingSystemVersion: new DataUnit(DataType.Word),
    // Minor version number of the required operating system
    MinorOperatingSystemVersion: new DataUnit(DataType.Word),
    //
    MajorImageVersion: new DataUnit(DataType.Word),
    //
    MinorImageVersion: new DataUnit(DataType.Word),
    //
    MajorSubsystemVersion: new DataUnit(DataType.Word),
    //
    MinorSubsystemVersion: new DataUnit(DataType.Word),
    // Reserved
    Win32VersionValue: new DataUnit(DataType.DWord),
    // Size of the image including all headers
    // TODO: Проверять этот пункт. Если не совпадает с размером файла - подозрительно
    SizeOfImage: new DataUnit(DataType.DWord),
    //
    SizeOfHeaders: new DataUnit(DataType.DWord),
    // Image file checksum
    CheckSum: new DataUnit(DataType.DWord),
    // Subsystem required to run this image
    Subsystem: new DataUnit(DataType.Word),
    // DLL characteristics of the image
    DllCharacteristics: new DataUnit(DataType.Word),
    // Number of bytes to reserve for the stack
    SizeOfStackReserve: new DataUnit(DataType.DWord),
    // Number of bytes to commit for the stack
    SizeOfStackCommit: new DataUnit(DataType.DWord),
    // Number of bytes to reserve for the local heap
    SizeOfHeapReserve: new DataUnit(DataType.DWord),
    // Number of bytes to commit for the local heap
    SizeOfHeapCommit: new DataUnit(DataType.DWord),
    // Obsolete
    LoaderFlags: new DataUnit(DataType.DWord),
    // Number of directory entries in the remainder of the optional header
    // TODO: Всегда равно 16
    NumberOfRvaAndSizes: new DataUnit(DataType.DWord),
  }

  // ВЛоженные секции
  to = {
    dataDirectory: new DataDirectories(),
  }

  meta = {
    dllChars: [] as string[],
    subsystem: "",
    osVersion: "",
    magic: "",
  }

  parse(data: DataUnit, offset: number = 0) {
    super.parse(data, offset);

    this.meta.dllChars = this.decodeDllChars(this.fields.DllCharacteristics.toNumber())
    this.meta.subsystem = this.decodeSubsystem(this.fields.Subsystem.toNumber())
    this.meta.osVersion = this.decodeOSVersion(
      this.fields.MajorOperatingSystemVersion.toNumber(),
      this.fields.MinorOperatingSystemVersion.toNumber()
    )
    this.meta.magic = this.decodeMagic(this.fields.Magic.toNumber())

    return this
  }

  private decodeDllChars(id: number) {
    let dllchars = {
      [String(0x0020)]: 'HighEntropyVa',
      [String(0x0040)]: 'DynamicBase',
      [String(0x0080)]: 'ForceIntegrity',
      [String(0x0100)]: 'NxCompat',
      [String(0x0200)]: 'NoIsolation',
      [String(0x0400)]: 'NoSeh',
      [String(0x0800)]: 'NoBind',
      [String(0x1000)]: 'Appcontainer',
      [String(0x2000)]: 'WdmDriver',
      [String(0x4000)]: 'GuardCf',
      [String(0x8000)]: 'TerminalServerAware'
    }
    let dllcharsList = []
    for (let code in dllchars) if ((id & +code) === +code) dllcharsList.push(dllchars[code])
    return dllcharsList
  }

  private decodeSubsystem(id: number): string {
    let subsystems = {
      [String(0x0000)]: 'Unknown',
      [String(0x0001)]: 'Native',
      [String(0x0002)]: 'WindowsGui',
      [String(0x0003)]: 'WindowsCui',
      [String(0x0005)]: 'Os2Cui',
      [String(0x0007)]: 'PosixCui',
      [String(0x0008)]: 'NativeWindows',
      [String(0x0009)]: 'WindowsCeGui',
      [String(0x000A)]: 'EfiApplication',
      [String(0x000B)]: 'EfiBootServiceDriver',
      [String(0x000C)]: 'EfiRuntimeDriver',
      [String(0x000D)]: 'EfiRom',
      [String(0x000E)]: 'Xbox',
      [String(0x0010)]: 'WindowsBootApplication'
    }
    return subsystems[id] || 'Unknown'
  }

  private decodeOSVersion(maj: number, min: number): string {
    let version = maj + '.' + min
    let versions = {
      '1.1': 'Windows 1.0',
      '1.2': 'Windows 1.02',
      '1.3': 'Windows 1.03',
      '1.4': 'Windows 1.04',
      '2.3': 'Windows 2.03',
      '2.10': 'Windows 2.10',
      '2.11': 'Windows 2.11',
      '3.0': 'Windows 3.0',
      '3.10': 'Windows 3.1',
      '3.11': 'Windows 3.11',
      '3.2': 'Windows 3.2',
      '3.50': 'Windows 3.5',
      '3.51': 'Windows 3.51',
      '4.0': 'Windows 95',
      '4.10': 'Windows 98',
      '5.0': 'Windows 2000',
      '4.90': 'Windows ME',
      '5.1': 'Windows XP',
      '5.2': 'Windows XP Professional x64 Edition',
      '6.0': 'Windows Vista',
      '6.1': 'Windows 7',
      '6.2': 'Windows 8',
      '6.3': 'Windows 8.1',
      '10.0': 'Windows 10'
    }
    return (<any>versions)[version] || 'Unknown'
  }

  private decodeMagic(id: number): string {
    let magics = {
      [String(0x010B)]: 'PE32',
      [String(0x020B)]: 'PE64',
      [String(0x0107)]: 'ROM'
    }
    return magics[id] || 'Unknown'
  }
}
