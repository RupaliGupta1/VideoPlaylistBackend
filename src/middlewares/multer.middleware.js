import multer from "multer"

//https://github.com/expressjs/multer
const storage = multer.diskStorage({//cb->cll bck
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
  
 export const upload = multer(
    {
         storage,
    })