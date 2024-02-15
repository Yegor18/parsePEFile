export default class Entropy {
  private static async throttle(ms: number) {
    return new Promise(resolve => {
      setTimeout(() => resolve(true), ms)
    })
  }

  // Расчёт энтропии энтропию в диапазоне от 0 до 1
  // Где 1 значит, что каждый байт встречается одинаковое количество раз
  static async calc(bytes: Uint8Array) {
    // Вероятность встречи каждого байта
    let prob = new Array(256).fill(0)
    bytes.forEach(byte => prob[byte]++)
    prob.forEach((n, i) => prob[i] = n / bytes.length)

    // Расчёт энтропии
    let sum = 0
    prob.forEach(p => {
      // Не берём во внимание значения без вероятностей
      if (p > 0) {
        sum += p * Math.log2(1 / p)
      }
    })

    return sum / 8
  }
}
