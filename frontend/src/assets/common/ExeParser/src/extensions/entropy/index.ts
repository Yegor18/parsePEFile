import ExeParser from "@/assets/common/ExeParser";
import Entropy from "@/assets/lib/entropy";

export type EntropySectionData = {
  name: string,
  entropy: number,
}

export class EntropyData {
  file: number = 0
  sections: Array<EntropySectionData> = []
}

export default async function CalcEntropy(exe: ExeParser) {
  const entropy = new EntropyData()

  // Энтропия всего файла
  entropy.file = await Entropy.calc(exe.file.data)

  // Энтропия секций
  for (let section of exe.headers.sections) {
    const entro = {
      name: section.meta.name,
      entropy: await Entropy.calc(section.sectionData.data),
    }
    entropy.sections.push(entro)
  }

  return entropy
}
