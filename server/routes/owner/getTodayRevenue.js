// utils/getTodayRevenue.js
const db = require("../../config/db");

async function getTodayRevenue() {
  const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Bangkok" });

  const [result] = await db.promise().query(
    `SELECT 
      COALESCE(SUM(total_price), 0) AS totalRevenue,
      COUNT(*) AS totalOrders
    FROM orders
    WHERE DATE(order_time) = ?
      AND status = 'completed'`,
    [today]// ป้องกัน SQL injection 

  );
  // คืนค่าเป็น object ที่ประกอบด้วย:
  // - totalRevenue: แปลงเป็น float และ fallback เป็น 0 ถ้าไม่ได้รับค่า
  // - totalOrders: จำนวนออเดอร์ที่สำเร็จ
  // - date: วันที่ในรูปแบบไทย เช่น "21/7/2568"
  return {
    totalRevenue: parseFloat(result[0].totalRevenue) || 0,
    totalOrders: result[0].totalOrders,
    date: new Date().toLocaleDateString("th-TH"),
  };
}
// ส่งออกฟังก์ชันเพื่อใช้ในส่วนอื่นของระบบ เช่น dashboard
module.exports = { getTodayRevenue };
