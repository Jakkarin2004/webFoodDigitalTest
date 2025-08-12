const express = require("express");
const router = express.Router();
const db = require("../../config/db");
const { verifyToken } = require("../../middleware/auth");

// Middleware ตรวจสอบ token และสิทธิ์เจ้าของร้าน
router.use(verifyToken);
const { getTodayRevenue } = require("./getTodayRevenue"); // สร้างไฟล์ช่วยดึงยอดขาย (ดูตัวอย่างด้านล่าง)
const { getTodayCount } = require("./getTodayCount");


// ออเดอร์เฉพาะของ "วันนี้"
router.get("/all", verifyToken, async (req, res) => {
  try {
    const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Bangkok" });

    const [rows] = await db.promise().query(
      `SELECT * FROM pending_orders 
       WHERE DATE(order_time) = ?`,
      [today]
    );

    res.json({ orders: rows });
  } catch (error) {
    console.error("🔥 เกิดข้อผิดพลาดใน backend:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในฝั่งเซิร์ฟเวอร์" });
  }
});


router.get('/count', verifyToken, async (req, res) => {
  try {
    const count = await getTodayCount();

    const io = req.app.get("io");
    if (io) {
      io.emit("orderCountUpdated", { count });
    }

    return res.json({ count });
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error);
    return res.status(500).json({ message: 'ไม่สามารถดึงจำนวนออเดอร์วันนี้ได้' });
  }
});




// คำนวณยอดขายวันนี้
router.get("/today-revenue", async (req, res) => {
  try {
    const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Bangkok" });

    const [result] = await db.promise().query(
      `SELECT 
        COALESCE(SUM(total_price), 0) AS totalRevenue,
        COUNT(*) AS totalOrders
      FROM pending_orders
      WHERE DATE(order_time) = ?
        AND status = 'completed'`,
      [today]
    );

    res.json({
      totalRevenue: parseFloat(result[0].totalRevenue) || 0,
      totalOrders: result[0].totalOrders,
      date: new Date().toLocaleDateString("th-TH"),
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({
      message: "ดึงยอดขายวันนี้ล้มเหลว",
      error: err.message,
    });
  }
});


router.get("/:pendingOrderId", verifyToken, async (req, res) => {
  const pendingOrderId = Number(req.params.pendingOrderId);

  if (!pendingOrderId || isNaN(pendingOrderId)) {
    return res.status(400).json({ 
      message: "รหัสออเดอร์ไม่ถูกต้อง",
      success: false 
    });
  }

  try {
    const [results] = await db.promise().query(
      `SELECT 
         poi.pending_item_id,
         poi.pending_order_id,
         poi.menu_id,
         COALESCE(m.menu_name, 'ไม่พบชื่อเมนู') as menu_name,
         poi.quantity,
         poi.note,
         poi.specialRequest,
         poi.price,
         (poi.quantity * poi.price) as subtotal
       FROM pending_order_items poi
       LEFT JOIN menu m ON poi.menu_id = m.menu_id
       WHERE poi.pending_order_id = ?
       ORDER BY poi.pending_item_id`,
      [pendingOrderId]
    );

    if (results.length === 0) {
      return res.status(404).json({ 
        message: "ไม่พบรายการสินค้าในออเดอร์นี้",
        success: false 
      });
    }

    res.json({ 
      success: true,
      items: results,
      pendingOrderId,
      totalItems: results.length
    });

  } catch (error) {
    console.error("🔥 เกิดข้อผิดพลาดใน backend (pendingOrderId):", error);
    res.status(500).json({ 
      message: "เกิดข้อผิดพลาดในฝั่งเซิร์ฟเวอร์",
      success: false,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});




router.put("/:orderId/status", verifyToken, async (req, res) => {
  const orderId = Number(req.params.orderId);
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: "กรุณาระบุสถานะ" });
  }

  try {
    const [result] = await db.promise().query(
      "UPDATE pending_orders SET status = ? WHERE pending_order_id  = ?",
      [status, orderId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "ไม่พบ order นี้" });
    }

    const io = req.app.get("io");

    if (io) {
      try {
        // ✅ ส่ง event แบบ global (ทุก client ได้)
        io.emit("order_status_updated", { orderId, status });

        // ✅ ถ้าคุณใช้ room แยก staff / owner — ใช้แบบนี้แทน
        // io.to("staff-room").emit("order_status_updated", { orderId, status });
        // io.to("owner-room").emit("order_status_updated", { orderId, status });

        // 🔄 ยอดขายวันนี้ (optional)
        const revenueData = await getTodayRevenue();
        io.emit("today_revenue_updated", revenueData);

        // 🔢 จำนวน order ที่ยังไม่เสร็จ
        const count = await getTodayCount();
        io.emit("orderCountUpdated", { count });

      } catch (ioErr) {
        console.error("❌ ส่งข้อมูล realtime ล้มเหลว:", ioErr);
      }
    }

    // ✅ ส่งข้อมูลกลับ client
    res.json({
      message: "อัปเดตสถานะสำเร็จ",
      orderId,
      status,
      success: true
    });

  } catch (err) {
    console.error("❌ อัปเดตสถานะล้มเหลว:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในฝั่งเซิร์ฟเวอร์", success: false });
  }
});



module.exports = router;
