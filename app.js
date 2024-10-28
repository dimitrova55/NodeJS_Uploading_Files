import express from "express";
import multer from "multer";
import * as mc from "./multerControllers.js";
import fs from "fs";

const app = express()
const port = 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const upload = multer({storage: mc.storage, fileFilter: mc.imageFilter})
const uploadSingleImage = upload.single('image')
const uploadDocuments = multer({storage: mc.storage, fileFilter: mc.pdfFilter})
const uploadMultipleFields = multer({storage: mc.storage, fileFilter: mc.multipleFilter})
 
app.get('/', (req, res) => {
    res.status(200).render('index.ejs')
    // res.status(200).send('Uploading files in NodeJS with Multer.')
})

app.post('/single-image', upload.single('image'), (req, res) => {
    if(req.errorMessage){
        return res.status(422).json({message: req.errorMessage})
    }
    console.log(req.file);
    res.status(200).json({message: 'Image uploaded successfully.'})
})

app.post('/multiple-files', uploadDocuments.array('documents', 2), (req, res) => {
    console.log(req.files);

    if(req.invalidFiles) {
        return res.status(200).json({
            warning: true,
            message: 'Some documents did not upload due to wrong type: ' + req.invalidFiles.join(', ')
        })
    }

    return res.status(200).json({
        warning: false,
        message: 'Documents uploaded successfully.'
    })
})

app.post('/multiple-fields', uploadMultipleFields.fields(mc.fields), (req, res) => {
    console.log(req.files);

    /**
        req.files is an object (String -> Array) where fieldname is the key, and the value is array of files
        
        e.g.
        [
         { name: 'avatar', maxCount: 1 },
         { name: 'gallery', maxCount: 8 }
        ]
        req.files['avatar'][0] -> File
        req.files['gallery'] -> Array
        
        req.body will contain the text fields, if there were any
    */

    if(req.invalidFiles) {
        return res.status(200).json({
            warning: true,
            message: 'Some documents did not upload due to wrong type: ' + req.invalidFiles.join()
        })
    }
    
    return res.status(200).json({
        warning: false,
        message: 'Documents uploaded successfully.'
    })
})

app.post('/error-handling', (req, res) => {
    uploadSingleImage(req, res, (error) => {
        if(error)
            res.send('Error: ' + error)
        else {
            console.log(req.file);
            return res.status(200).json({message: 'Image uploaded successfully.'})
        }
    })
})


const uploadMemoryStorage = multer({
    storage: multer.memoryStorage()
})

app.post('/memory-storage', uploadMemoryStorage.single('file'), (req, res) => {
    // Validate file format
    if(req.file.mimetype != 'application/pdf'){
        return res.send('File must be a pdf')
    }

    // Check and create directory
    const dir = 'uploads'

    if(!fs.existsSync(dir)){
        fs.mkdirSync(dir)
    }

    // Build the file name
    const filename = Date.now() + '_' + req.file.originalname

    // Save the file to directory
    fs.writeFileSync(dir + '/' + filename, req.file.buffer)

    res.send('Success.')
})

app.listen(port, () => {
    console.log(`Server running on port: ${3000}`);
})