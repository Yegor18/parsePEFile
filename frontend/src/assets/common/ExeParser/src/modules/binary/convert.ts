// Ошибки конвертации данных
class ConvertError extends Error {
  name = 'Convert'

  constructor(msg: string) {
    super(msg)
  }
}

// Позволяет производить различные манипуляции конвертаций бинарных данных
export default class Convert {

  // Приводит целое не отрицательное число к массиву байт (обратный порядок)
  // 259 => [1, 3]
  static numToArr(num: number) {
    if (num !== (num | 0)) throw new ConvertError(`unexpected num ${num}, must be integer`)
    if (num < 0) throw new ConvertError(`unexpected num ${num}, must be positive`)
    let arr = []
    while (num > 0) {
      arr.push(num % 256)
      num = (num - num % 256) / 256
    }
    return new Uint8Array(arr)
  }

  // Приводит массив байт к целому не отрицательному числу
  // [1, 3] => 259
  static arrToNum(arr: Uint8Array) {
    const initialValue = 0
    return [...<any>arr]
      .map((num, pos) => (256 ** pos) * num)
      .reduce((acc: number, num) => acc + num,initialValue)
  }

  // Приводит строку к массиву байт
  static strToArr(str: string) {
    return new TextEncoder().encode(str)
  }

  // Приводит массив байт к строке
  static arrToStr(arr: Uint8Array, encoding = 'utf-8') {
    return new TextDecoder(encoding).decode(arr)
  }

  // Приводит байт к hex строке
  // static byteToHex(byte: number) {
  //   if (byte !== (byte | 0)) throw new ConvertError(`unexpected byte ${byte}, must be integer`)
  //   if (byte < 0) throw new ConvertError(`unexpected byte ${byte}, must be positive`)
  //   if (byte > 255) throw new ConvertError(`unexpected byte ${byte}, must be less than 256`)
  // }

}
