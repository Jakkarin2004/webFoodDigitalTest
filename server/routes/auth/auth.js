const express = require("express");
const router = express.Router();
const db = require("../../config/db"); // แบบ callback ไม่ใช่ promise
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// สร้าง endpoint POST /login สำหรับการเข้าสู่ระบบ
router.post("/login", (req, res) => {
  const { username, password } = req.body;
// ตรวจสอบว่ามีการกรอกข้อมูลชื่อผู้ใช้และรหัสผ่านหรือไม่

  if (!username || !password) {
    return res.status(400).json({ message: "กรุณากรอกชื่อผู้ใช้และรหัสผ่าน" });
  }
 // ค้นหาผู้ใช้ในฐานข้อมูลด้วยชื่อผู้ใช้
  db.query("SELECT * FROM users WHERE username = ?", [username], (err, results) => {
    if (err) {
      // หากเกิดข้อผิดพลาดในการค้นหาผู้ใช้ในฐานข้อมูล
      console.error(err);
      return res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err.message });
    }

    const user = results[0];
    // หากไม่พบผู้ใช้ที่มีชื่อผู้ใช้ดังกล่าว
    if (!user) {
      console.log(`Login fail: username ${username} not found`);
      return res.status(401).json({ message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
    }
     // เปรียบเทียบรหัสผ่านที่กรอกเข้ามากับรหัสผ่านที่เก็บในฐานข้อมูล
    bcrypt.compare(password, user.password, (err, match) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err.message });
      }
      if (!match) {
        // หากรหัสผ่านไม่ตรงกัน
        console.log(`Login fail: wrong password for username ${username}`);
        return res.status(401).json({ message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
      }
      // สร้าง JWT token ด้วยข้อมูล id และ role ของผู้ใช้
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "24h" } // กำหนดเวลาให้ token หมดอายุภายใน 24 ชั่วโมง

      );
// ส่งข้อมูล token และข้อมูลผู้ใช้กลับไปยัง client
      res.json({
        token,
            user: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                username: user.username,
                phone_number: user.phone_number,
                role: user.role,
                created_at: user.created_at,
                updated_at: user.updated_at,
            },
      });
    });
  });
});
// ส่งออก router เพื่อให้ไฟล์อื่นสามารถเรียกใช้ endpoint นี้ได้
module.exports = router;
