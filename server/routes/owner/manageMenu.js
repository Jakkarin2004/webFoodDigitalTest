const express = require("express");
const router = express.Router();
const db = require("../../config/db");
const path = require("path");
const fs = require("fs");
const {
  uploadFoodImage,
  deleteOldFoodImage,
} = require("../../middleware/uploadMiddleware");

// GET /menus - ดึงข้อมูลเมนูทั้งหมด พร้อมประเภท
router.get("/", (req, res) => {
  const sql = `SELECT menu.*, menu_type.type_name AS menu_type_name
               FROM menu 
               INNER JOIN menu_type ON menu.menu_type_id = menu_type.menu_type_id`;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Query Error:", err);
      return res
        .status(500)
        .json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลเมนู" });
    }
    res.json(results);
  });
});

// GET /menus/menu_type - ดึงประเภทเมนูทั้งหมด
router.get("/menu_type", (req, res) => {
  const sql = `SELECT * FROM menu_type`;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Query Error:", err);
      return res
        .status(500)
        .json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลประเภทเมนู" });
    }
    res.json(results);
  });
});

// ✅ POST /menus - เพิ่มเมนูใหม่ พร้อมอัพโหลดรูป
router.post("/", uploadFoodImage.single("menu_image"), (req, res) => {
  const { menu_name, price, special, detail_menu, menu_type_id } = req.body;
  const menu_image = req.file ? req.file.filename : null;

  const menuTypeId = parseInt(menu_type_id, 10);
  if (isNaN(menuTypeId)) {
    return res.status(400).json({ error: "menu_type_id ต้องเป็นตัวเลขที่ถูกต้อง" });
  }

  if (!menuTypeId) {
    return res.status(400).json({ error: "กรุณาเลือกหมวดหมู่เมนู" });
  }

  // ตรวจสอบชื่อเมนูซ้ำในหมวดหมู่เดียวกัน
  const checkSql = `
    SELECT * FROM menu 
    WHERE menu_name = ?
  `;

  db.query(checkSql, [menu_name], (err, results) => {
    if (err) {
      console.error("❌ Query Error:", err.message);
      return res.status(500).json({ error: "เกิดข้อผิดพลาดในการตรวจสอบเมนู" });
    }

    if (results.length > 0) {
      return res.status(409).json({ error: "ชื่อเมนูนี้ถูกใช้งานแล้ว กรุณาเลือกชื่ออื่น" });
    }

    // ถ้าไม่ซ้ำ ให้เพิ่มเมนู
    const insertSql = `
      INSERT INTO menu (menu_name, price, special, detail_menu, menu_type_id, menu_image)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
      insertSql,
      [menu_name, price, special, detail_menu, menuTypeId, menu_image],
      (err, result) => {
        if (err) {
          console.error("❌ Insert Error:", err.message, err.sqlMessage);
          return res.status(500).json({ error: "ชื่อเมนูนี้ถูกใช้งานแล้ว กรุณาเลือกชื่ออื่น" });
        }
        res.status(201).json({ message: "เพิ่มเมนูสำเร็จ", id: result.insertId });
      }
    );
  });
});


router.put(
  "/:id",
  uploadFoodImage.single("menu_image"),
  deleteOldFoodImage,
  (req, res) => {
    const id = req.params.id;
    const { menu_name, price, detail_menu, menu_type_id, oldImage, special } = req.body;
    const isSpecial = special === "1" || special === 1 || special === true;

    // Validation
    if (!menu_name || !price || !menu_type_id) {
      return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return res.status(400).json({ error: "ราคาต้องเป็นตัวเลขที่มากกว่า 0" });
    }

    let menu_image = oldImage || null;
    if (req.file) {
      menu_image = req.file.filename;
    }

    // ตรวจสอบชื่อเมนูซ้ำในหมวดเดียวกัน (ยกเว้นเมนูเดิม)
    const checkSql = `
      SELECT * FROM menu 
      WHERE menu_name = ? AND menu_id != ?
    `;

    db.query(checkSql, [menu_name.trim(), id], (err, results) => {
      if (err) {
        console.error("❌ Error checking duplicate:", err);
        return res.status(500).json({ error: "เกิดข้อผิดพลาดในการตรวจสอบชื่อเมนู" });
      }

      if (results.length > 0) {
        return res.status(409).json({ error: "มีเมนูชื่อนี้อยู่แล้วในหมวดหมู่เดียวกัน" });
      }

      // ไม่ซ้ำ -> อัปเดตเมนู
      const updateSql = `
        UPDATE menu
        SET menu_name = ?, menu_image = ?, price = ?, special = ?, detail_menu = ?, menu_type_id = ?
        WHERE menu_id = ?
      `;

      db.query(
        updateSql,
        [
          menu_name.trim(),
          menu_image,
          parsedPrice,
          isSpecial ? 1 : 0,
          detail_menu?.trim() || "",
          parsedMenuTypeId,
          id,
        ],
        (err, results) => {
          if (err) {
            console.error("❌ Error updating menu:", err);
            return res.status(500).json({ message: "เกิดข้อผิดพลาดในการแก้ไขเมนู" });
          }

          if (results.affectedRows === 0) {
            return res.status(404).json({ message: "ไม่พบเมนูที่ต้องการแก้ไข" });
          }

          res.json({ message: "แก้ไขเมนูสำเร็จ" });
        }
      );
    });
  }
);



// DELETE /menus/:id - ลบเมนูพร้อมลบรูปภาพ
router.delete("/:id", (req, res) => {
  const id = req.params.id;

  // ตรวจสอบว่า id เป็นตัวเลขหรือไม่
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ error: "ID เมนูไม่ถูกต้อง" });
  }

  // 1. ดึงข้อมูลเมนูและชื่อรูปภาพก่อน
  const getMenuSql = `SELECT menu_id, menu_name, menu_image FROM menu WHERE menu_id = ?`;

  db.query(getMenuSql, [id], (err, results) => {
    if (err) {
      console.error("❌ ดึงข้อมูลเมนูล้มเหลว:", err);
      return res
        .status(500)
        .json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลเมนู" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "ไม่พบเมนูที่ต้องการลบ" });
    }

    const menu = results[0];
    const imageName = menu.menu_image;

    console.log(`🗑️ กำลังลบเมนู: ${menu.menu_name} (ID: ${menu.menu_id})`);

    // 2. ลบเมนูจากฐานข้อมูล
    const deleteSql = `DELETE FROM menu WHERE menu_id = ?`;

    db.query(deleteSql, [id], async (err, deleteResult) => {
      if (err) {
        console.error("❌ ลบเมนูจากฐานข้อมูลล้มเหลว:", err);
        return res.status(500).json({ error: "เกิดข้อผิดพลาดในการลบเมนู" });
      }

      // ตรวจสอบว่าลบสำเร็จหรือไม่
      if (deleteResult.affectedRows === 0) {
        return res.status(404).json({ error: "ไม่พบเมนูที่ต้องการลบ" });
      }

      // 3. ลบไฟล์รูปภาพ (ถ้ามี)
      if (imageName && imageName.trim() !== "") {
        const imagePath = path.join(
          __dirname,
          "../../public/uploads/food",
          imageName
        );

        try {
          // ตรวจสอบว่าไฟล์มีอยู่จริงหรือไม่
          await fs.promises.access(imagePath);
          await fs.promises.unlink(imagePath);
          console.log(`🗑️ ลบรูปภาพ ${imageName} สำเร็จ`);
        } catch (fileErr) {
          // ไม่ใช่ error ร้าywแรง ถ้าไฟล์ไม่พบ
          if (fileErr.code === "ENOENT") {
            console.warn(`⚠️ ไม่พบรูปภาพ: ${imagePath}`);
          } else {
            console.warn(
              `⚠️ ไม่สามารถลบรูปภาพได้: ${imagePath}`,
              fileErr.message
            );
          }
        }
      }

      console.log(`✅ ลบเมนู "${menu.menu_name}" สำเร็จ`);
      res.json({
        message: "ลบเมนูสำเร็จ",
        deletedMenu: {
          menu_id: menu.menu_id,
          menu_name: menu.menu_name,
        },
      });
    });
  });
});

module.exports = router;
