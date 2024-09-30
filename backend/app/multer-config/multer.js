import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
    destination : function(req,file,cb) {
        cb(null , './upload')
    },
    filename : function(req,file,cb) {
         cb(null , `${Date.now()}-${file.originalname}`)
    }
})

const fileFilter = (req,file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png|mp4|avi|mov|wmv/
    const mimetype = allowedFileTypes.test(file.mimetype)
    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase())
    if(mimetype && extname){
        return cb(null , true)
    }

    cb(new Error(`Error: File upload only supports the following filetypes - ${allowedFileTypes}`))
}

const upload = multer({
    storage : storage,
    limits : {fileSize : 1024 * 1024 * 100 },
    fileFilter : fileFilter
}).single('media')

export default upload