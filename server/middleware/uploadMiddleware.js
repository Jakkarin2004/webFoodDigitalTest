const multer = require("multer");// เรียกใช้ multer สำหรับจัดการการอัพโหลดไฟล์
const path = require("path");// โมดูลจัดการ path ของไฟล์และโฟลเดอร์
const fs = require("fs").promises;// โมดูลไฟล์ระบบแบบ promise เพื่อใช้งาน async/then ได้ง่ายขึ้น

// ฟังก์ชัน ensureDir: ตรวจสอบว่าโฟลเดอร์มีอยู่หรือไม่ ถ้าไม่มีจะสร้างใหม่
// รับพารามิเตอร์ dirPath (path ของโฟลเดอร์ที่ต้องการตรวจสอบ)
// ใช้ .then/.catch (promise) แทน async/await
function ensureDir(dirPath) {
    return fs.access(dirPath)// ตรวจสอบสิทธิ์เข้าถึงโฟลเดอร์
    .catch(() => {// ถ้าไม่เจอโฟลเดอร์หรือไม่สามารถเข้าถึงได้
        console.log(`📂 Directory ${dirPath} not found. Creating...`);
        // สร้างโฟลเดอร์ใหม่แบบ recursive (ถ้าโฟลเดอร์ระดับบนยังไม่มีด้วยจะสร้างให้หมด)
        return fs.mkdir(dirPath, { recursive: true });
    });
}

// ฟังก์ชัน createMulterStorage: สร้างตัวเก็บไฟล์ของ multer เพื่อบอกว่าจะเก็บไฟล์ที่ไหนและตั้งชื่ออย่างไร
// uploadPath คือพาธที่เราต้องการเก็บไฟล์
function createMulterStorage(uploadPath) {
    return multer.diskStorage({
        // กำหนดโฟลเดอร์เก็บไฟล์แบบ async โดยเรียก ensureDir แล้วใช้ then เพื่อรอให้สร้างโฟลเดอร์เสร็จ
        destination: (req, file, cb) => {
            ensureDir(uploadPath)// เรียกตรวจสอบ/สร้างโฟลเดอร์ก่อนเก็บไฟล์
                .then(() => cb(null, uploadPath)) // ถ้าสำเร็จ ส่งพาธไปเก็บไฟล์
                .catch(err => cb(err)); // ถ้าเกิด error ส่ง error กลับ multer
        },
        // กำหนดชื่อไฟล์ใหม่ให้ไม่ซ้ำ ใช้ timestamp + นามสกุลไฟล์เดิม
        filename: (req, file, cb) => {
            const newFileName = Date.now() + path.extname(file.originalname);
            cb(null, newFileName);
        }
    });
}

// ตัวกรองประเภทไฟล์ที่อนุญาตให้ upload
// รับแค่ไฟล์รูปภาพชนิด jpeg, jpg, png, gif เท่านั้น
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);// อนุญาตให้ upload ไฟล์นี้
    } else {
        cb(new Error("❌ Invalid file type. Only JPG, PNG, and GIF are allowed."), false);// ปฏิเสธไฟล์
    }
};

// ฟังก์ชัน createUploader: สร้าง middleware upload ของ multer สำหรับโฟลเดอร์ที่กำหนด
// รับชื่อ folderName เป็นพารามิเตอร์ เช่น "food", "profile" เพื่อสร้างพาธเก็บไฟล์
function createUploader(folderName) {
     // สร้าง path ที่เป็น absolute path ของโฟลเดอร์เก็บไฟล์ (ในโฟลเดอร์ public/uploads/ชื่อโฟลเดอร์)
    const uploadPath = path.resolve(__dirname, `../public/uploads/${folderName}`);
    const storage = createMulterStorage(uploadPath); // สร้าง multer storage ด้วย uploadPath ข้างบน
        // คืน multer instance ที่กำหนด storage, กรองไฟล์, และจำกัดขนาดไฟล์ 2MB
    return multer({
        storage,
        fileFilter,
        limits: { fileSize: 2 * 1024 * 1024 } // 2MB
    });
}


function deleteOldImage(folderName) {
  return (req, res, next) => {
    // เฉพาะตอนมีการอัปโหลดรูปใหม่เท่านั้น
    if (!req.file) {
      return next(); // ไม่มีไฟล์ใหม่ ไม่ต้องลบอะไร
    }

    const oldImage = req.body.oldImage;
    if (oldImage) {
      const oldImagePath = path.join(__dirname, `../public/uploads/${folderName}`, oldImage);

      fs.access(oldImagePath) // ตรวจสอบว่ามีไฟล์เก่าไหม
        .then(() => fs.unlink(oldImagePath)) // ถ้ามี → ลบ
        .then(() => {
          console.log("✅ ลบรูปเดิมเรียบร้อยแล้ว:", oldImage);
          next();
        })
        .catch(err => {
          console.warn("⚠️ ไม่พบรูปเดิมหรือไม่สามารถลบได้:", err.message);
          next(); // ลบไม่สำเร็จก็ไม่เป็นไร ไปต่อ
        });
    } else {
      next(); // ไม่มี oldImage → ไปต่อ
    }
  };
}

module.exports = {
    uploadFoodImage: createUploader("food"),// middleware upload ไฟล์ในโฟลเดอร์ food
    uploadStoreImage: createUploader("store"),
    uploadQrcodeImage: createUploader("qrcode"),
    deleteOldFoodImage: deleteOldImage("food"),// middleware ลบรูปเก่าในโฟลเดอร์ food
    deleteOldStoreImage: deleteOldImage("store"),
    // deleteOldQrcodeImage: deleteOldImage("qrcode"),
    
    ensureDir
};
