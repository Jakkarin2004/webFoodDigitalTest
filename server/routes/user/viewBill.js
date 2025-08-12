const express = require("express");
const router = express.Router();
const db = require("../../config/db");

router.get("/:order_code", async (req, res) => {
  const { order_code } = req.params;

  try {
    // ✅ 1. ดึงข้อมูลคำสั่งซื้อ
    const [orders] = await db
      .promise()
      .query(`SELECT * FROM pending_orders WHERE order_code = ?`, [order_code]);

    if (!orders.length) {
      return res.status(404).json({ message: "ไม่พบคำสั่งซื้อนี้" });
    }

    const order = orders[0];
    const pendingOrderId = order.pending_order_id;

    const [items] = await db.promise().query(
      `SELECT 
     poi.pending_item_id,
     poi.pending_order_id,
     m.menu_name,
     poi.quantity,
     poi.price,
     poi.note,
     poi.specialRequest,
     (poi.quantity * poi.price) AS subtotal
   FROM pending_order_items poi
   JOIN menu m ON poi.menu_id = m.menu_id
   WHERE poi.pending_order_id = ?
   ORDER BY poi.pending_item_id`,
      [pendingOrderId]
    );

    // ✅ 3. ส่งข้อมูลกลับ client
    res.json({
      success: true,
      order: {
        order_id: order.order_id,
        order_code: order.order_code,
        status: order.status,
        table_number: order.table_number,
        total_price: order.total_price,
        created_at: order.created_at,
        // เพิ่ม field อื่นได้ เช่น customer_name, phone ฯลฯ
      },
      items,
    });
  } catch (err) {
    console.error("❌ ดึงข้อมูลล้มเหลว:", err);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการดึงคำสั่งซื้อ",
    });
  }
});

router.put("/cancel-order/:order_code", async (req, res) => {
  const { order_code } = req.params;
  const { status } = req.body;

  try {
    // 1. Update status
    const [result] = await db
      .promise()
      .query(`UPDATE orders SET status = ? WHERE order_code = ?`, [
        status,
        order_code,
      ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "ไม่พบคำสั่งซื้อนี้" });
    }

    // 2. ดึง order_id เพื่อใช้ emit
    const [rows] = await db
      .promise()
      .query(`SELECT order_id FROM orders WHERE order_code = ?`, [order_code]);

    const orderId = rows[0]?.order_id;

    // 3. Emit realtime
    const io = req.app.get("io");
    if (io) {
      const { getTodayCount } = require("../owner/getTodayCount");
      const count = await getTodayCount();

      io.emit("order_status_updated", {
        orderId, // ใช้ id จริง
        status,
      });

      io.emit("orderCountUpdated", { count });
    }

    res.json({ message: "ยกเลิกคำสั่งซื้อเรียบร้อยแล้ว" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "ไม่สามารถยกเลิกคำสั่งซื้อได้" });
  }
});

module.exports = router;
