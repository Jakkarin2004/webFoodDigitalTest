const db = require("../../config/db");
/*
 * ฟังก์ชัน getTodayCount
 * ใช้สำหรับดึงจำนวนรายการออเดอร์ในฐานข้อมูลที่ถูกสร้างขึ้นในวันปัจจุบัน
 * และมีสถานะเป็น 'pending', 'preparing', หรือ 'ready'
 */

async function getTodayCount() {
  // กำหนดวันที่ปัจจุบันตาม timezone ของกรุงเทพในรูปแบบ 'YYYY-MM-DD'
  // ตัวอย่างผลลัพธ์: "2025-07-21"
  const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Bangkok" });

  // ใช้ MySQL query เพื่อดึงจำนวนออเดอร์จากตาราง orders
  // เงื่อนไข: วันที่ตรงกับวันนี้ และสถานะอยู่ในชุดที่กำหนด

  const [rows] = await db.promise().query(
    `
    SELECT COUNT(*) AS count
    FROM orders
    WHERE DATE(order_time) = ?
      AND status IN ('pending', 'preparing', 'ready')
    `,
    [today]// ใช้ today เป็น parameter เพื่อป้องกัน SQL injection
  );
  // คืนค่าจำนวนออเดอร์ที่ตรงกับเงื่อนไข
  // หากไม่มีข้อมูล จะคืนค่าเป็น 0 แทน
  return rows?.[0]?.count ?? 0;
}
// ส่งออกฟังก์ชัน getTodayCount สำหรับใช้ในไฟล์อื่น
module.exports = { getTodayCount };
