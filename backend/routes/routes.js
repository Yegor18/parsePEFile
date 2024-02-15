import express from "express";
 
// import function from controller
import { getTables } from "../models/fileModel.js";
import { showFiles} from "../controllers/file.js";
 
// init express router
const router = express.Router();
    getTables((err, results) => {
        if (err){
            throw "Error"
        }else{
            for (let result of results) {
                router.get(`/files/${result.name.trim()}`, (res) => {showFiles(result.name.trim(),res.res)});
            }
            

        }
    });
// Get All Files


export default router;