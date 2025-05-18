// Study this

import { NextApiRequest, NextApiResponse } from "next";

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { file } = req.body;

    try {
      const uploadedImage = await cloudinary.uploader.upload(file, {
        upload_preset: "your_upload_preset", 
      });

      res.status(200).json({ url: uploadedImage.secure_url });
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      res.status(500).json({ error: "Image upload failed" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
};
