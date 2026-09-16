import multer from "multer"

const storage = multer.diskStorage({
    destination: function (req,file,cd){
        cd(null,'./public/temp')
    },
    filename: function (req, file,cb){
        const uniqueSuffix = Date.now()+'-'+Math.round(Math.random()* 1E9)
        cb(null,file.filename + '-'+ uniqueSuffix)
    }
})
 export const upload = multer({storage : storage})