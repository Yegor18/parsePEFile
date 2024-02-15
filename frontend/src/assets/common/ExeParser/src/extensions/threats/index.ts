import { DataUnit } from '../../modules/binary';
import { Md5FileHasher } from 'ts-md5';

export class ThreatData {
  name:string=''
  description:string=''
}
export default async function findThreats(file:DataUnit) {
  const threatInfo = new ThreatData()
  let maliousHash:any = null
  let md5FileHasher = new Md5FileHasher(async(md5) => {
    console.log("Md5 hash ",md5.result)
    let firstLetter = md5.result ? md5.result[0] : null
    switch (firstLetter) {
      case '0': firstLetter = 'zero';
      break;
      case '1': firstLetter = 'one';
      break;
      case '2': firstLetter = 'two';
      break;
      case '3': firstLetter = 'three';
      break;
      case '4': firstLetter = 'four';
      break;
      case '5': firstLetter = 'five';
      break;
      case '6': firstLetter = 'six';
      break;
      case '7': firstLetter = 'seven';
      break;
      case '8': firstLetter = 'eight';
      break;
      case '9': firstLetter = 'nine';
      break;
    }
    if (firstLetter && md5.result) {
    const axios = await require('axios');
    // Make a request for a user with a given ID
    try {
        let responseDataBase = await axios.get(`http://localhost:5000/files/${firstLetter}`)
      // .then(function (responseDataBase:any) {
        responseDataBase = responseDataBase.data
        for (let element of responseDataBase) {
        }
        maliousHash = await responseDataBase.find(function(element:any) {return element.hash.trim() == md5.result? md5.result:null})
    } catch(error) {
      console.log(error);
    }
    }
    if (!maliousHash) {
      threatInfo.name = ''
      threatInfo.description = ``
    } else {
      threatInfo.name = maliousHash.hash
      threatInfo.description = maliousHash.variant
    }
  }

  )
  await md5FileHasher.hash(new Blob([file.data]))
  console.log("maliousHash ",maliousHash)



  return threatInfo;
}
