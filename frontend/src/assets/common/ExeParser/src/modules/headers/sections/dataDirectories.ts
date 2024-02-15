import {DataSection} from '../../binary'
import DataDirectory from "./dataDirectory";

// Описывает таблицу секций
export default class DataDirectories extends DataSection {
  to = {
    // Export Directory
    export: new DataDirectory(),
    // Import Directory
    import: new DataDirectory(),
    // Resource Directory
    resource: new DataDirectory(),
    // Exception Directory
    exception: new DataDirectory(),
    // Security Directory
    security: new DataDirectory(),
    // Base Relocation Table
    baseRelocation: new DataDirectory(),
    // Debug Directory
    debug: new DataDirectory(),
    // Architecture Specific Data
    architecture: new DataDirectory(),
    // RVA of GP
    globalPtr: new DataDirectory(),
    // TLS Directory
    tls: new DataDirectory(),
    // Load Configuration Directory
    loadConfig: new DataDirectory(),
    // // Bound Import Directory in headers
    boundImport: new DataDirectory(),
    // Import Address Table
    importAddressTable: new DataDirectory(),
    // Delay Load Import Descriptors
    delayImport: new DataDirectory(),
    // .NET Metadata
    netMetadata: new DataDirectory(),
    //
    reserved: new DataDirectory(),
  }
}
