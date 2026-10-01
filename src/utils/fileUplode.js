import { v2 as cloudinary } from "cloudinary"
import fs from "fs"


cloudinary.config({
     cloud_name: process.env.CLOUDE_NAME,
     api_key: process.env.API_KEY,
     api_secret: process.env.API_SECRET
});

const uplodeOnClodinary = async (localFilePath) => {
     try {
          if (!localFilePath) return null

          
          const responce = await cloudinary.uploader.upload(localFilePath, {
               resource_type: "auto"
          })
          // console.log("file has been uploaded succ", responce.url);
          // console.log(responce);
          fs.unlinkSync(localFilePath)
          return responce;  
     }
   
     catch (error) {
          fs.unlinkSync(localFilePath)  
     }
}

export { uplodeOnClodinary }