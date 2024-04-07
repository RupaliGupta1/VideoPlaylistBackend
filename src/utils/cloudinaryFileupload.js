//https://console.cloudinary.com/pm/c-8c8ed4ee68e1b0693e9f8a90799956/getting-started

import { v2 as cloudinary } from "cloudinary";
import fs from 'fs' //file system

          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, //here it comes from env but cloudname is taken from cloudinary
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET

});


const uploadOnCloudinary = async (localFilePath)=>{
    try {//check if file pth is there
        if(!localFilePath) return null

        //upload file on cloudinary

      const response= await cloudinary.uploader.upload(localFilePath, {
            resource_type:"auto"
        })

        //file has been uploaded successfully
        // console.log("file uploaded on cloudinary",
        // response.url)
         fs.unlinkSync(localFilePath)
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath)//remove the loclly saved temp file as a upload option got fail

        return null
    }
}


export {uploadOnCloudinary}

//https://cloud.mongodb.com/v2/660a432d3dc941329a90e516#/overview make sure cloudinary is open in ur browser
//u will get cloudname,api,keysecret from cloudinary dashboard 
//we ll keep our file in localstorage thn from locl storage upload it in cloudinary and when upload done we ll dlt that file from locl