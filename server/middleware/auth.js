const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
    // ดึงค่า Authorization header จาก request
  const authHeader = req.headers.authorization;

 // ตรวจสอบว่า header มีค่าและเป็นรูปแบบ Bearer หรือไม่
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: Token not provided" });
  }
 // แยก token ออกจาก header
  const token = authHeader.split(" ")[1];

  try {
     // ใช้ JWT_SECRET จาก .env ในการตรวจสอบและถอดรหัส token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // แปลงเวลาหมดอายุจาก epoch (วินาที) เป็น readable format
    const expiresAt = new Date(decoded.exp * 1000).toISOString();

     // เพิ่มข้อมูลผู้ใช้และเวลา expiresAt เข้าไปใน request เพื่อใช้งานต่อในระบบ
    req.user = {
      ...decoded,
      expiresAt, // เช่น "2025-06-17T06:30:00.000Z"
    };
    // เรียก next middleware เมื่อ token ถูกต้อง
    next();
  } catch (err) {
     // หาก token ผิดหรือหมดอายุ ส่งกลับ status 403
    return res.status(403).json({ message: "Token invalid or expired" });
  }
}

function isOwner(req, res, next) {
  if (req.user.role !== "owner") {
    // หากไม่ได้รับสิทธิ์ owner ส่งกลับ status 403
    return res.status(403).json({ message: "Access denied: Owner only" });
  }
  // ถ้าเป็น owner ดำเนินการต่อไปยัง middleware หรือ route ถัดไป
  next();
}


// ส่งออก middleware ทั้งสองเพื่อนำไปใช้งานในส่วนอื่นของระบบ
module.exports = { verifyToken, isOwner };
