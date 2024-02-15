import { getFiles  } from "../models/fileModel.js";
 
// Get All Files
export const showFiles = (req, res) => {
    getFiles((err, results) => {
        if (err){
            res.send(err);
        }else{
            res.json(results);
        }
    },req);
}
