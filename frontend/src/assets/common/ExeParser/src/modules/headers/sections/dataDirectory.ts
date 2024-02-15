import {DataUnit, DataType, DataSection} from '../../binary'

// Описывает блок в таблице секций
export default class DataDirectory extends DataSection {
  fields = {
    VirtualAddress: new DataUnit(DataType.DWord),
    Size: new DataUnit(DataType.DWord),
  }
}
