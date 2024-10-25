import express from "express";
import multer from "multer";
import * as mc from "./multerControllers.js";

const app = express()
const port = 3000;

const upload = multer({storage: mc.storage, fileFilter: mc.imageFilter})
const uploadDocuments = multer({storage: mc.storage, fileFilter: mc.pdfFilter})
const uploadMultipleFields = multer({storage: mc.storage, fileFilter: mc.multipleFilter})

app.get('/', (req, res) => {
    res.status(200).send('Uploading files in NodeJS with Multer.')
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


app.listen(port, () => {
    console.log(`Server running on port: ${3000}`);
})