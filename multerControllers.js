import fs from "fs";
import multer from "multer";
import path from "path";
import { log } from "console";


export const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = 'uploads'

        // check if the folder exists
        if(!fs.existsSync(dir))
            fs.mkdirSync(dir)

        cb(null, dir)
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }    
})

/** Filters Images */
export const imageFilter = function (req, file, cb) {
    if(file.mimetype == 'image/png' || file.mimetype == 'image/jpeg'){
        cb(null, true)
    } else {
        req.errorMessage = 'File is not a valid image.'
        cb(null, false)
    }
}

/** Filters PDF documents */
// this function is envoked for every single file uploaded
export const pdfFilter = function(req, file, cb) {
    if(file.mimetype == 'application/pdf'){
        cb(null, true)
    } else {
        !req.invalidFiles ? req.invalidFiles = [file.originalname] : req.invalidFiles.push(file.originalname)
        cb(null, false)
    }
}

/** Filters multiple fields */
export const fields = [
    {
        name: 'avatar',
        maxCount: 1
    },
    {
        name: 'banner',
        maxCount: 1
    },
    {
        name: 'document',
        maxCount: 1
    }
]

export const multipleFilter = function(req, file, cb) {

    let flag = false
    if(file.fieldname == 'avatar' || file.fieldname == 'banner') {

        if(file.mimetype == 'image/png' || file.mimetype == 'image/jpeg')
            flag = true

    } else if(file.fieldname == 'document'){

        if(file.mimetype == 'application/pdf')
            flag = true

    }
    if(!flag) {
        const message = `${file.mimetype} is wrong type for ${file.fieldname} field. \n`
        !req.invalidFiles ? req.invalidFiles = [message] : req.invalidFiles.push(message)
    }
    
    cb(null, flag)
}