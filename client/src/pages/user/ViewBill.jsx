import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/user/Navbar";
import io from "socket.io-client";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const socket = io("http://localhost:3000");

const ViewBill = ({ tableNumber: propTableNumber }) => {
  const { order_code } = useParams();
  const navigate = useNavigate();
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(false);

  const [tableNumber, setTableNumber] = useState(null);

  useEffect(() => {
    if (propTableNumber) setTableNumber(propTableNumber);
    else setTableNumber(sessionStorage.getItem("table_number"));
  }, [propTableNumber]);

  // ดึงบิลจาก temp_receipts + orders
  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/user/viewOrder-list/${order_code}`)
      .then((res) => setBill(res.data))
      .catch(() => alert("❌ ไม่พบคำสั่งซื้อนี้"));
  }, [order_code]);

  const handleCancelOrder = async () => {
    setLoading(true);
    try {
      await axios.put(
        `http://localhost:3000/api/user/viewOrder-list/cancel-order/${order_code}`,
        { status: "cancelled" }
      );

      // อัปเดตสถานะทุก order
      setBill((prev) => ({
        ...prev,
        orders: prev.orders.map((o) => ({ ...o, status: "cancelled" })),
      }));

      sessionStorage.removeItem("order_code");
      toast.error("ยกเลิกคำสั่งซื้อเรียบร้อยแล้ว!");
      navigate(`/user-menu/table/${tableNumber}`);
    } catch (error) {
      console.error(error);
      alert("❌ ไม่สามารถยกเลิกคำสั่งซื้อได้");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmOrder = async () => {
    if (!window.confirm("คุณแน่ใจหรือไม่ว่าได้รับอาหารครบถ้วนแล้ว?")) return;
    setLoading(true);
    try {
      await axios.put(
        `http://localhost:3000/api/user/confirm-order/${order_code}`,
        { status: "completed" }
      );

      setBill((prev) => ({
        ...prev,
        orders: prev.orders.map((o) => ({ ...o, status: "completed" })),
      }));

      alert("✅ ยืนยันการรับอาหารเรียบร้อยแล้ว");
    } catch (error) {
      console.error(error);
      alert("❌ ไม่สามารถยืนยันการรับอาหารได้");
    } finally {
      setLoading(false);
    }
  };

  if (!bill) return <p className="text-center py-10">กำลังโหลด...</p>;

  const { temp_receipt, orders } = bill;

  const formatPrice = (num) =>
    new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB" }).format(num);

  // รวมสถานะและราคา
  const allStatuses = orders.map((o) => o.status);
  const canCancel = allStatuses.every((s) => s === "pending");
  const canConfirm = allStatuses.every((s) => s === "ready");
  const totalPrice = formatPrice(orders.reduce((sum, o) => sum + parseFloat(o.total_price), 0));

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-20">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl p-6 shadow-xl relative">
          <h2 className="text-3xl font-bold mb-2">🧾 ใบเสร็จรับเงิน</h2>
          <p className="text-lg text-orange-100 mb-4">
            รหัสบิล: <span className="font-semibold text-white">{temp_receipt.temp_receipt_code}</span>
          </p>
          <div className="flex gap-4 text-sm text-orange-100">
            <div>📌 โต๊ะ: {temp_receipt.table_number}</div>
            <div>📅 วันที่/เวลา: {new Date(temp_receipt.temp_receipt_time).toLocaleString("th-TH")}</div>
          </div>
        </div>

        {/* Orders */}
        {orders.map((order, idx) => (
          <div key={idx} className="mt-6">
            <h3 className="text-xl font-bold text-orange-700 mb-2">Order #{order.order_id} - สถานะ: {order.status}</h3>
            {order.items.map((item, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg border border-orange-100 p-4 mb-2 flex justify-between">
                <div>
                  <h4 className="text-orange-800 font-bold">{item.menu_name}</h4>
                  <p>จำนวน: {item.quantity} × {formatPrice(item.price)}</p>
                  {item.note && <p>Note: {item.note}</p>}
                  {item.specialRequest && <p>Special: {item.specialRequest}</p>}
                </div>
                <div className="text-orange-600 font-bold">{formatPrice(item.subtotal)}</div>
              </div>
            ))}
          </div>
        ))}

        {/* Total */}
        <div className="mt-6 bg-white rounded-xl shadow-xl border-2 border-orange-200 p-4 flex justify-between text-xl font-bold">
          <span>ยอดรวมทั้งหมด:</span>
          <span>{totalPrice}</span>
        </div>

        {/* Buttons */}
        {(canCancel || canConfirm) && (
          <div className="mt-6 flex gap-4 justify-center">
            {canCancel && (
              <button onClick={handleCancelOrder} disabled={loading} className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl">
                {loading ? "กำลังยกเลิก..." : "❌ ยกเลิกคำสั่งซื้อ"}
              </button>
            )}
            {canConfirm && (
              <button onClick={handleConfirmOrder} disabled={loading} className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl">
                {loading ? "กำลังยืนยัน..." : "✅ ยืนยันรับอาหารแล้ว"}
              </button>
            )}
          </div>
        )}

        <div className="flex justify-center mt-4">
          <Link to={`/user-menu/table/${tableNumber}`} className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl">หน้าหลัก</Link>
        </div>
      </div>
    </div>
  );
};

export default ViewBill;
