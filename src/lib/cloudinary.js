import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dfdhclyt7',
  api_key: process.env.CLOUDINARY_API_KEY || '157724822944896',
  api_secret: process.env.CLOUDINARY_API_SECRET || '1en_BUk1VlRaZ3Kog9neAUPw8DA',
});

export async function uploadToCloudinary(file) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const mime = file.type;
  const encoding = 'base64';
  const base64Data = buffer.toString('base64');
  const fileUri = 'data:' + mime + ';' + encoding + ',' + base64Data;
  
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(fileUri, {
      resource_type: "auto",
      folder: "albayan"
    }, (error, result) => {
      if (error) reject(error);
      else resolve(result.secure_url);
    });
  });
}
