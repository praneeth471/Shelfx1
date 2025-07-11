import { v2 as cloudinary } from "cloudinary";

// Ensure 'process' is accessible by importing 'dotenv' and configuring it
import dotenv from 'dotenv';

dotenv.config();

console.log(process.env.CLOUD_NAME);
console.log(process.env.API_KEY);
console.log(process.env.API_SECRET);
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET,
});

export default cloudinary;
