

// module.exports = router;
const express = require("express");
const router = express.Router();
const db = require("../../config/db");
const { getTodayCount } = require("../owner/getTodayCount"); // ปรับ path ให้ถูกต้องตามโครงสร้างคุณ

router.post("/", async (req, res) => {
  const { table_number, items, order_code } = req.body;

  if (!table_number || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "ข้อมูลไม่ถูกต้อง" });
  }

  try {
    const totalPrice = items.reduce((sum, item) => {
      const price = parseFloat(item.price);
      const quantity = parseInt(item.quantity) || 1;
      return sum + (isNaN(price) ? 0 : price * quantity);
    }, 0);

    // insert order
    const [result] = await db
      .promise()
      .query(
        "INSERT INTO pending_orders (order_code,table_number, status, total_price, order_time) VALUES (?, ?, ?, ?, NOW())",
        [order_code, table_number, "pending", totalPrice]
      );

    const orderId = result.insertId;

    // insert order_items ทีละรายการ
    const insertItemsPromises = items.map((item) => {
      const menuId = item.menu_id || item.id;
      if (!menuId || !item.price) {
        throw new Error(`ข้อมูลรายการอาหารไม่ครบ: ${JSON.stringify(item)}`);
      }
      return db
        .promise()
        .query(
          "INSERT INTO pending_order_items (pending_order_id, menu_id, quantity, price, note, specialRequest) VALUES (?, ?, ?, ?, ?, ?)",
          [
            orderId,
            menuId,
            item.quantity,
            item.price,
            item.note || null,
            item.specialRequest || null,
          ]
        );
    });

    await Promise.all(insertItemsPromises);

    // ดึงจำนวนออเดอร์วันนี้ใหม่หลังเพิ่ม order
    const io = req.app.get("io");
    if (io) {
      const count = await getTodayCount();

      io.emit("new_order", {
        order_id: orderId,
        table_number,
        status: "pending",
        total_price: totalPrice,
        items,
        order_time: new Date().toISOString(),
      });

      io.emit("orderCountUpdated", { count });
    }

    return res.json({
      message: "บันทึกคำสั่งซื้อเรียบร้อย",
      orderId,
      order_code,
      total_price: totalPrice,
    });
  } catch (error) {
    console.error("❌ เพิ่มคำสั่งซื้อไม่สำเร็จ:", error);
    return res.status(500).json({
      message: error.message || "เกิดข้อผิดพลาดในการบันทึกคำสั่งซื้อ",
    });
  }
});

module.exports = router;
