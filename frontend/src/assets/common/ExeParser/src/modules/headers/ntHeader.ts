import {DataUnit, DataType, DataSection} from '../binary'
import FileHeader from "./fileHeader";
import OptionalHeader from "./optionalHeader";

// Описывает NT Header
export default class NtHeader extends DataSection {
  // Поля заголовка
  fields = {
    // PE\\0\\0
    Signature: new DataUnit(DataType.DWord),
  }

  // Вложенные заголовки
  to = {
    file: new FileHeader(),
    optional: new OptionalHeader(),
  }

  isValid() {
    return this.fields.Signature.toString() === 'PE\0\0'
  }
}
