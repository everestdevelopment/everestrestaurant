import ImageKit from "imagekit";
import dotenv from 'dotenv';

dotenv.config();

// ImageKit konfiguratsiyasi - o'z kalitlaringizni kiriting
const imagekit = new ImageKit({
  publicKey: "public_DoW9EG6j7aExOddHQrl+FFCH1tA=", // <-- O'z public key'ingizni kiriting
  privateKey: "private_r6IX9w37Omu5He6C6b0LXufhkas=", // <-- O'z private key'ingizni kiriting
  urlEndpoint: "https://ik.imagekit.io/everestrestaurant" // <-- O'z endpoint'ingizni kiriting
});

export const uploadProductImage = async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ error: "No image file provided" });
    }

    const file = req.files.image;
    
    // Fayl turini tekshirish
    if (!file.mimetype.startsWith('image/')) {
      return res.status(400).json({ error: "File must be an image" });
    }

    const uploadResponse = await imagekit.upload({
      file: file.data, // buffer
      fileName: file.name,
      folder: "/products"
    });

    console.log('Image uploaded successfully:', uploadResponse.url);
    res.json({ url: uploadResponse.url });
  } catch (err) {
    console.error('Image upload error:', err);
    res.status(500).json({ error: "Image upload failed", details: err.message });
  }
}; 