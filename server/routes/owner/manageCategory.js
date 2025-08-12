const express = require('express');
const router = express.Router();
const db = require('../../config/db'); // ดึงการเชื่อมต่อที่แยกไว้แล้ว


// ดึงข้อมูลทั้งหมด
router.get('/', (req, res) => {
  db.query('SELECT * FROM menu_type', (err, results) => {
    if (err) {
      console.error('❌ Query Error:', err);
      return res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' });
    }
    res.json(results);
  });
});

// ดึงข้อมูลตาม ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM menu_type WHERE menu_type_id = ?', [id], (err, results) => {
    if (err) {
      console.error('❌ Query Error:', err);
      return res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'ไม่พบข้อมูลที่ต้องการ' });
    }
    res.json(results[0]);
  });
});

// เพิ่มข้อมูลใหม่
// POST /menu-types
router.post('/', (req, res) => {
  const { type_name } = req.body;

  if (!type_name || type_name.trim() === "") {
    return res.status(400).json({ error: "กรุณากรอกชื่อประเภทเมนู" });
  }

  const checkSql = 'SELECT * FROM menu_type WHERE type_name = ?';
  db.query(checkSql, [type_name.trim()], (err, results) => {
    if (err) {
      console.error('❌ Check Error:', err);
      return res.status(500).json({ error: 'เกิดข้อผิดพลาดในการตรวจสอบข้อมูลซ้ำ' });
    }

    if (results.length > 0) {
      return res.status(409).json({ error: 'ประเภทเมนูนี้มีอยู่แล้ว' });
    }

    // ถ้าไม่ซ้ำ → INSERT
    const insertSql = 'INSERT INTO menu_type (type_name) VALUES (?)';
    db.query(insertSql, [type_name.trim()], (err, result) => {
      if (err) {
        console.error('❌ Insert Error:', err);
        return res.status(500).json({ error: 'เกิดข้อผิดพลาดในการเพิ่มข้อมูล' });
      }

      res.status(201).json({ message: 'เพิ่มข้อมูลสำเร็จ', id: result.insertId });
    });
  });
});


// ลบข้อมูลตาม ID
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM menu_type WHERE menu_type_id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('❌ Delete Error:', err);
      return res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลบข้อมูล' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'ไม่พบข้อมูลที่ต้องการลบ' });
    }
    res.json({ message: 'ลบข้อมูลสำเร็จ' });
  });
});

module.exports = router;
