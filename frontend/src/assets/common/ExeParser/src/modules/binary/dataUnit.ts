import Convert from './convert';
import {DataType} from './dataType'

// Ошибки DataUnit класса
class DataUnitError extends Error {
  name = 'DataUnit'
}

// Выделяет блок из файла для дальнейшей обработки
export default class DataUnit {

  // Байты блока
  private _data = new Uint8Array()
  get data() {
    return this._data
  }

  // Смещение блока
  private _offset = 0
  get offset() {
    return this._offset
  }

  private resetMeta() {
    this._offset = 0
  }

  constructor(bytes?: Uint8Array | DataType | number) {
    if (bytes) {
      if (bytes instanceof Uint8Array) {
        this.setBytes(bytes)
      } else {
        this._data = new Uint8Array(bytes)
      }
    }
  }

  // Проверят, что блоки содержат один набор данных
  isEqual(block: DataUnit) {
    if (this.data.length != block.data.length) return false
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i] !== block.data[i]) return false
    }
    return true
  }

  // Устанавливает файл или блок из него
  async setFile(file: File, offset = 0, length: DataType | number = file.size - offset) {
    if (offset < 0 || offset > file.size)
      throw new DataUnitError(`incorrect offset ${offset} for file length ${file.size}`)
    if (offset + length > file.size)
      throw new DataUnitError(
        `incorrect offset ${offset} or length ${length}, it's greater than file size ${file.size}`)

    this.resetMeta()
    this._offset = offset

    const blob = file.slice(offset, offset + length)
    const arr = await blob.arrayBuffer()
    this._data = new Uint8Array(arr)
    return this
  }

  // // Устанавливает строку
  // setString(str: string) {
  //   this._data = Convert.strToArr(str)
  //   return this
  // }
  //
  // // Устанавливает число
  // setNumber(num: number, size?: DataType | number) {
  //   let arr = Convert.numToArr(num)
  //   if (size) {
  //     let parts = [...<any>arr] as number[]
  //     parts.unshift(...new Array(size - arr.length).fill(0))
  //     arr = new Uint8Array(parts)
  //   }
  //   this._data = arr
  //   return this
  // }

  // Устанавливает байты
  setBytes(bytes: Uint8Array, offset: number = 0, length: number = bytes.length - offset!) {
    this.resetMeta()
    this._offset = offset
    this._data = bytes.slice(offset, offset + length)
    return this
  }

  // Переводит данные в строку
  toString(encoding = 'utf-8') {
    return Convert.arrToStr(this.data, encoding)
  }

  // Переводит данные в Null-Terminated строку
  toStringNT(encoding = 'utf-8') {
    let str = this.toString(encoding)
    const pos = str.indexOf('\0')
    if (pos >= 0) {
      str = str.substr(0, pos)
    }
    return str
  }

  // Переводит данные в число
  toNumber() {
    return Convert.arrToNum(this.data)
  }

  // Представляет число в виде hex строки
  toHex() {
    return this.toNumber().toString(16)
  }

  // Представляет данные в виде массива hex байт
  toHexArr() {
    return Array.from(this.data).map(n => n.toString(16))
  }

  // Копирует блок или его часть
  copy(offset = 0, length = this.data.length - offset) {
    const data = this.data.buffer.slice(offset, offset + length)
    const block = new DataUnit(new Uint8Array(data))
    block._offset = offset
    return block
  }

  // Копирует блок начиная со сдвига и до \0 символа, либо конца родительского блока
  copyNT(offset = 0) {
    let end = offset
    for (let i = offset; i < this.data.length; i++) {
      if (this.data[i] === 0) {
        end = i
        break
      }
    }
    return this.copy(offset, end - offset)
  }

  // Читает объекты в массив блоков пока не получит \0 элемент
  toBlockArrayNT(offset: number, type: DataType | number) {
    let arr = [] as DataUnit[]
    for (let i = 0; ; i++) {
      const block = this.copy(offset + i * type, type)
      if (block.toNumber() === 0) break
      arr.push(block)
    }
    return arr
  }

  // Читает указанное количество объектов в массив
  toBlockArray(offset: number, type: DataType | number, length: number) {
    let arr = [] as DataUnit[]
    for (let i = 0; i < length; i++) {
      const block = this.copy(offset + i * type, type)
      arr.push(block)
    }
    return arr
  }
}
