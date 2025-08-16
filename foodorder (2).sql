-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 16, 2025 at 02:22 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `foodorder`
--

-- --------------------------------------------------------

--
-- Table structure for table `menu`
--

CREATE TABLE `menu` (
  `menu_id` int(11) NOT NULL,
  `menu_name` varchar(255) NOT NULL,
  `menu_image` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `special` tinyint(1) DEFAULT 0,
  `detail_menu` text DEFAULT NULL,
  `menu_type_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `menu`
--

INSERT INTO `menu` (`menu_id`, `menu_name`, `menu_image`, `price`, `special`, `detail_menu`, `menu_type_id`, `created_at`, `updated_at`) VALUES
(39, 'ไก่อบซอส', '1752845718495.jpg', 45.00, 1, 'ไม่มีรายละเอียด', 16, '2025-07-18 20:35:18', '2025-07-18 20:59:24'),
(41, 'ข้าวขาหมู', '1752845758958.jpg', 45.00, 1, 'ไม่มีรายละเอียด', 16, '2025-07-18 20:35:58', '2025-07-18 20:59:28'),
(43, 'คะน้าหมูกรอบ', '1752845920807.jpg', 45.00, 1, 'ไม่มีรายละเอียด', 16, '2025-07-18 20:37:35', '2025-07-18 20:59:31'),
(44, 'ราดหน้าเส้นใหญ่หมู', '1752845975709.jpg', 45.00, 1, 'ไม่มีรายละเอียด', 17, '2025-07-18 20:39:35', '2025-07-18 20:59:35'),
(45, 'ราดหน้าหมี่กรอบหมู', '1752846157276.jpg', 45.00, 1, 'ไม่มีรายละเอียด', 17, '2025-07-18 20:42:37', '2025-07-18 20:59:41'),
(46, 'สุกี้น้ำหมู', '1752846210163.jpg', 45.00, 1, 'ไม่มีรายละเอียด', 18, '2025-07-18 20:43:30', '2025-07-18 20:59:44'),
(47, 'สุกี้แห้งหมู', '1752846322227.jpg', 45.00, 1, 'ไม่มีรายละเอียด', 18, '2025-07-18 20:45:22', '2025-07-18 20:59:48'),
(49, 'ผัดซีอิ๊วหมู', '1752846448155.jpg', 45.00, 1, 'ไม่มีรายละเอียด', 19, '2025-07-18 20:47:28', '2025-07-18 20:59:54'),
(50, 'ผัดพริกแกงใต้หมู', '1752846660867.jpg', 45.00, 1, 'ไม่มีรายละเอียด', 20, '2025-07-18 20:51:00', '2025-07-18 20:59:58');

-- --------------------------------------------------------

--
-- Table structure for table `menu_type`
--

CREATE TABLE `menu_type` (
  `menu_type_id` int(11) NOT NULL,
  `type_name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `menu_type`
--

INSERT INTO `menu_type` (`menu_type_id`, `type_name`, `created_at`, `updated_at`) VALUES
(16, 'หมวดเมนูข้าวราด/ข้าวจานเดียว', '2025-07-18 13:25:15', '2025-07-18 13:25:15'),
(17, 'หมวดราดหน้า', '2025-07-18 13:25:25', '2025-07-18 13:25:25'),
(18, 'หมวดสุกี้', '2025-07-18 13:25:33', '2025-07-18 13:25:33'),
(19, 'หมวดเส้นผัด', '2025-07-18 13:25:41', '2025-07-18 13:25:41'),
(20, 'หมวดผัดพริกแกง', '2025-07-18 13:25:48', '2025-07-18 13:25:48');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `table_number` varchar(10) NOT NULL,
  `order_time` datetime DEFAULT current_timestamp(),
  `status` varchar(50) DEFAULT 'pending',
  `total_price` decimal(10,2) DEFAULT 0.00,
  `order_code` varchar(30) NOT NULL,
  `receipt_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `table_number`, `order_time`, `status`, `total_price`, `order_code`, `receipt_id`) VALUES
(1, '1', '2025-08-13 15:46:44', 'completed', 45.00, 'T1-250813154644', NULL),
(2, '2', '2025-08-13 20:16:32', 'completed', 45.00, 'T2-250813201632', NULL),
(3, '1', '2025-08-13 20:15:56', 'completed', 45.00, 'T1-250813201556', NULL),
(4, '1', '2025-08-13 21:19:42', 'completed', 45.00, 'T1-250813211942', NULL),
(5, '1', '2025-08-13 21:20:21', 'cancelled', 45.00, 'T1-250813212021', NULL),
(6, '1', '2025-08-14 21:21:16', 'completed', 45.00, 'T1-250814212116', NULL),
(7, '1', '2025-08-14 21:41:08', 'cancelled', 45.00, 'T1-250814214108', NULL),
(8, '1', '2025-08-14 21:41:41', 'cancelled', 90.00, 'T1-250814214141', NULL),
(9, '1', '2025-08-16 16:54:29', 'completed', 135.00, 'T1-250816165429', NULL),
(10, '1', '2025-08-16 17:15:25', 'cancelled', 45.00, 'T1-250816171525', NULL),
(11, '1', '2025-08-16 17:15:34', 'completed', 45.00, 'T1-250816171525', NULL),
(12, '1', '2025-08-16 17:18:50', 'completed', 45.00, 'T1-250816171850', NULL),
(13, '1', '2025-08-16 17:19:34', 'cancelled', 45.00, 'T1-250816171850', NULL),
(14, '1', '2025-08-16 17:25:01', 'cancelled', 45.00, 'T1-250816172501', NULL),
(15, '1', '2025-08-16 17:38:24', 'completed', 45.00, 'T1-250816173824', NULL),
(16, '1', '2025-08-16 18:09:02', 'cancelled', 45.00, 'T1-250816180902', NULL),
(17, '1', '2025-08-16 18:09:16', 'cancelled', 45.00, 'T1-250816180902', NULL),
(18, '1', '2025-08-16 18:16:06', 'cancelled', 45.00, 'T1-250816181606', NULL),
(19, '1', '2025-08-16 18:17:11', 'cancelled', 45.00, 'T1-250816181606', NULL),
(20, '1', '2025-08-16 18:17:50', 'cancelled', 45.00, 'T1-250816181606', NULL),
(21, '1', '2025-08-16 18:22:37', 'cancelled', 45.00, 'T1-250816182237', NULL),
(22, '1', '2025-08-16 18:27:08', 'cancelled', 45.00, 'T1-250816182708', NULL),
(23, '1', '2025-08-16 18:28:06', 'cancelled', 45.00, 'T1-250816182708', NULL),
(24, '1', '2025-08-16 18:33:43', 'completed', 45.00, 'T1-250816183343', NULL),
(25, '1', '2025-08-16 18:34:15', 'cancelled', 45.00, 'T1-250816183343', NULL),
(26, '1', '2025-08-16 18:34:54', 'cancelled', 45.00, 'T1-250816183343', NULL),
(27, '1', '2025-08-16 18:45:25', 'completed', 45.00, 'T1-250816184525', NULL),
(28, '1', '2025-08-16 18:45:36', 'completed', 45.00, 'T1-250816184525', NULL),
(29, '1', '2025-08-16 19:07:14', 'completed', 90.00, 'T1-250816190714', NULL),
(30, '1', '2025-08-16 19:07:27', 'completed', 90.00, 'T1-250816190714', NULL),
(31, '1', '2025-08-16 19:10:12', 'completed', 90.00, 'T1-250816191012', NULL),
(32, '1', '2025-08-16 19:10:35', 'completed', 90.00, 'T1-250816191012', NULL),
(33, '1', '2025-08-16 19:11:21', 'completed', 45.00, 'T1-250816191012', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `item_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `menu_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `note` varchar(255) NOT NULL,
  `specialRequest` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`item_id`, `order_id`, `menu_id`, `quantity`, `price`, `note`, `specialRequest`) VALUES
(1, 1, 50, 1, 45.00, 'ไม่มี', 'ธรรมดา'),
(2, 2, 47, 1, 45.00, 'ไม่มี', 'ธรรมดา'),
(3, 3, 45, 1, 45.00, 'ไม่มี', 'ธรรมดา'),
(4, 4, 50, 1, 45.00, 'ไม่มี', 'ธรรมดา'),
(5, 5, 45, 1, 45.00, 'ไม่มี', 'ธรรมดา'),
(6, 6, 44, 1, 45.00, 'ไม่มี', 'ธรรมดา'),
(7, 7, 45, 1, 45.00, 'ไม่มี', 'ธรรมดา'),
(8, 8, 45, 2, 45.00, 'ไม่มี', 'ธรรมดา'),
(9, 9, 50, 1, 45.00, 'ไม่มี', 'ธรรมดา'),
(10, 9, 44, 1, 45.00, 'ไม่มี', 'ธรรมดา'),
(11, 9, 47, 1, 45.00, 'ไม่มี', 'ธรรมดา'),
(12, 10, 50, 1, 45.00, 'ไม่มี', 'ธรรมดา'),
(13, 11, 45, 1, 45.00, 'ไม่มี', 'ธรรมดา'),
(14, 12, 45, 1, 45.00, 'ไม่มี', 'ธรรมดา'),
(15, 13, 44, 1, 45.00, 'ไม่มี', 'ธรรมดา'),
(16, 14, 45, 1, 45.00, 'ไม่มี', 'ธรรมดา'),
(17, 15, 50, 1, 45.00, 'ไม่มี', 'ธรรมดา'),
(18, 16, 45, 1, 45.00, 'ไม่มี', 'ธรรมดา'),
(19, 17, 45, 1, 45.00, 'ไม่มี', 'ธรรมดา'),
(20, 18, 45, 1, 45.00, 'ไม่มี', 'ธรรมดา'),
(21, 19, 45, 1, 45.00, 'ไม่มี', 'ธรรมดา'),
(22, 20, 45, 1, 45.00, 'ไม่มี', 'ธรรมดา'),
(23, 21, 45, 1, 45.00, 'ไม่มี', 'ธรรมดา'),
(24, 22, 44, 1, 45.00, 'ไม่มี', 'ธรรมดา'),
(25, 23, 44, 1, 45.00, 'ไม่มี', 'ธรรมดา'),
(26, 24, 45, 1, 45.00, 'ไม่มี', 'ธรรมดา'),
(27, 25, 44, 1, 45.00, 'ไม่มี', 'ธรรมดา'),
(28, 26, 47, 1, 45.00, 'ไม่มี', 'ธรรมดา'),
(29, 27, 45, 1, 45.00, 'ไม่มี', 'ธรรมดา'),
(30, 28, 50, 1, 45.00, 'ไม่มี', 'ธรรมดา'),
(31, 29, 44, 1, 45.00, 'ไม่มี', 'ธรรมดา'),
(32, 29, 50, 1, 45.00, 'ไม่มี', 'ธรรมดา'),
(33, 30, 47, 1, 45.00, 'ไม่มี', 'ธรรมดา'),
(34, 30, 43, 1, 45.00, 'ไม่มี', 'ธรรมดา'),
(35, 31, 50, 1, 45.00, 'ไม่มี', 'ธรรมดา'),
(36, 31, 45, 1, 45.00, 'ไม่มี', 'ธรรมดา'),
(37, 32, 39, 1, 45.00, 'ไม่มี', 'ธรรมดา'),
(38, 32, 41, 1, 45.00, 'ไม่มี', 'ธรรมดา'),
(39, 33, 49, 1, 45.00, 'ไม่มี', 'ธรรมดา');

-- --------------------------------------------------------

--
-- Table structure for table `pending_orders`
--

CREATE TABLE `pending_orders` (
  `pending_order_id` int(11) NOT NULL,
  `order_code` varchar(30) NOT NULL,
  `table_number` varchar(10) NOT NULL,
  `order_time` datetime DEFAULT current_timestamp(),
  `status` varchar(50) DEFAULT 'pending',
  `total_price` decimal(10,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pending_orders`
--

INSERT INTO `pending_orders` (`pending_order_id`, `order_code`, `table_number`, `order_time`, `status`, `total_price`) VALUES
(20, 'T1-250816165429', '1', '2025-08-16 16:54:29', 'completed', 135.00),
(21, 'T1-250816171525', '1', '2025-08-16 17:15:34', 'completed', 45.00),
(22, 'T1-250816171525', '1', '2025-08-16 17:15:25', 'completed', 45.00),
(23, 'T1-250816171525', '1', '2025-08-16 17:15:25', 'completed', 45.00),
(24, 'T1-250816171850', '1', '2025-08-16 17:18:50', 'completed', 45.00),
(25, 'T1-250816171850', '1', '2025-08-16 17:19:34', 'completed', 45.00),
(26, 'T1-250816173824', '1', '2025-08-16 17:38:24', 'completed', 45.00),
(27, 'T1-250816183343', '1', '2025-08-16 18:33:43', 'completed', 45.00),
(28, 'T1-250816183343', '1', '2025-08-16 18:34:15', 'completed', 45.00),
(29, 'T1-250816183343', '1', '2025-08-16 18:34:54', 'completed', 45.00),
(30, 'T1-250816184525', '1', '2025-08-16 18:45:36', 'completed', 45.00),
(31, 'T1-250816184525', '1', '2025-08-16 18:45:25', 'completed', 45.00),
(32, 'T1-250816190714', '1', '2025-08-16 19:07:14', 'completed', 90.00),
(33, 'T1-250816190714', '1', '2025-08-16 19:07:27', 'completed', 90.00),
(34, 'T1-250816191012', '1', '2025-08-16 19:11:21', 'completed', 45.00),
(35, 'T1-250816191012', '1', '2025-08-16 19:10:35', 'completed', 90.00),
(36, 'T1-250816191012', '1', '2025-08-16 19:10:12', 'completed', 90.00);

-- --------------------------------------------------------

--
-- Table structure for table `pending_order_items`
--

CREATE TABLE `pending_order_items` (
  `pending_item_id` int(11) NOT NULL,
  `pending_order_id` int(11) NOT NULL,
  `menu_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `note` varchar(255) DEFAULT NULL,
  `specialRequest` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pending_order_items`
--

INSERT INTO `pending_order_items` (`pending_item_id`, `pending_order_id`, `menu_id`, `quantity`, `price`, `note`, `specialRequest`) VALUES
(2, 20, 50, 1, 45.00, 'ไม่มี', 'ธรรมดา'),
(3, 20, 44, 1, 45.00, 'ไม่มี', 'ธรรมดา'),
(4, 20, 47, 1, 45.00, 'ไม่มี', 'ธรรมดา'),
(5, 21, 45, 1, 45.00, 'ไม่มี', 'ธรรมดา'),
(6, 22, 50, 1, 45.00, 'ไม่มี', 'ธรรมดา'),
(7, 23, 50, 1, 45.00, 'ไม่มี', 'ธรรมดา'),
(8, 24, 45, 1, 45.00, 'ไม่มี', 'ธรรมดา'),
(9, 25, 44, 1, 45.00, 'ไม่มี', 'ธรรมดา'),
(10, 26, 50, 1, 45.00, 'ไม่มี', 'ธรรมดา'),
(11, 27, 45, 1, 45.00, 'ไม่มี', 'ธรรมดา'),
(12, 28, 44, 1, 45.00, 'ไม่มี', 'ธรรมดา'),
(13, 29, 47, 1, 45.00, 'ไม่มี', 'ธรรมดา'),
(14, 30, 50, 1, 45.00, 'ไม่มี', 'ธรรมดา'),
(15, 31, 45, 1, 45.00, 'ไม่มี', 'ธรรมดา'),
(16, 32, 44, 1, 45.00, 'ไม่มี', 'ธรรมดา'),
(17, 32, 50, 1, 45.00, 'ไม่มี', 'ธรรมดา'),
(19, 33, 47, 1, 45.00, 'ไม่มี', 'ธรรมดา'),
(20, 33, 43, 1, 45.00, 'ไม่มี', 'ธรรมดา'),
(22, 34, 49, 1, 45.00, 'ไม่มี', 'ธรรมดา'),
(23, 35, 39, 1, 45.00, 'ไม่มี', 'ธรรมดา'),
(24, 35, 41, 1, 45.00, 'ไม่มี', 'ธรรมดา'),
(26, 36, 50, 1, 45.00, 'ไม่มี', 'ธรรมดา'),
(27, 36, 45, 1, 45.00, 'ไม่มี', 'ธรรมดา');

-- --------------------------------------------------------

--
-- Table structure for table `receipts`
--

CREATE TABLE `receipts` (
  `receipt_id` int(11) NOT NULL,
  `receipt_code` varchar(30) NOT NULL,
  `receipt_order_id` int(11) DEFAULT NULL,
  `receipt_time` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `receipts`
--

INSERT INTO `receipts` (`receipt_id`, `receipt_code`, `receipt_order_id`, `receipt_time`) VALUES
(1, 'T1-250816165429', 20, '2025-08-16 09:54:35'),
(2, 'T1-250816171525', 21, '2025-08-16 10:15:47'),
(5, 'T1-250816171850', 24, '2025-08-16 10:19:00'),
(7, 'T1-250816173824', 26, '2025-08-16 10:40:57'),
(8, 'T1-250816183343', 27, '2025-08-16 11:35:20'),
(11, 'T1-250816184525', 30, '2025-08-16 11:45:59'),
(13, 'T1-250816190714', 32, '2025-08-16 12:07:47'),
(14, 'T1-250816191012', 34, '2025-08-16 12:11:44');

-- --------------------------------------------------------

--
-- Table structure for table `store`
--

CREATE TABLE `store` (
  `id` int(11) NOT NULL,
  `store_name` varchar(50) NOT NULL,
  `image_res` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `phone_number` varchar(10) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `operating_hours` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `store`
--

INSERT INTO `store` (`id`, `store_name`, `image_res`, `address`, `phone_number`, `description`, `operating_hours`, `created_at`, `updated_at`) VALUES
(1, 'ร้านอาหารป้าอ้อ', '1751798308431.jpg', '682/9 หมู่11ตลาดเคเจมอลล์ Unnamed Road ตำบล เมือง ', '0936641534', 'ร้านป้าอ้อ จ.จานด่วน เป็นร้านอาหารที่ตั้งอยู่ใกล้มหาวิทยาลัยราชภัฏเลย ในบริเวณตลาดเคเจมอลล์ ซึ่งเป็นศูนย์รวมของร้านค้าและแหล่งชุมชน โดยตั้งอยู่ที่ 682/9 หมู่ 11  ตำบลเมือง  อำเภอเมืองเลย จังหวัดเลย 42000', '{\"monday\":{\"is_open\":true,\"open_time\":\"06:00\",\"close_time\":\"20:00\"},\"sunday\":{\"is_open\":false,\"open_time\":\"01:06\",\"close_time\":\"03:06\"},\"wednesday\":{\"is_open\":true,\"open_time\":\"06:00\",\"close_time\":\"20:00\"},\"tuesday\":{\"is_open\":true,\"open_time\":\"06:00\",\"close_time\":\"20:00\"},\"thursday\":{\"is_open\":true,\"open_time\":\"06:00\",\"close_time\":\"21:00\"},\"friday\":{\"is_open\":true,\"open_time\":\"06:00\",\"close_time\":\"20:30\"},\"saturday\":{\"is_open\":false}}', '2025-07-06 00:08:01', '2025-07-13 17:52:46');

-- --------------------------------------------------------

--
-- Table structure for table `tables`
--

CREATE TABLE `tables` (
  `table_id` int(11) NOT NULL,
  `table_number` varchar(10) NOT NULL,
  `table_name` varchar(100) NOT NULL,
  `qrcode_image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tables`
--

INSERT INTO `tables` (`table_id`, `table_number`, `table_name`, `qrcode_image`, `created_at`, `updated_at`) VALUES
(11, '1', 'โต๊ะ', 'table_1.png', '2025-06-21 14:03:56', '2025-06-21 14:03:56'),
(12, '2', 'โต๊ะไหน', 'table_2.png', '2025-06-22 15:01:11', '2025-06-22 15:01:11');

-- --------------------------------------------------------

--
-- Table structure for table `temp_receipts`
--

CREATE TABLE `temp_receipts` (
  `temp_receipt_id` int(11) NOT NULL,
  `temp_receipt_code` varchar(30) NOT NULL,
  `table_number` varchar(20) DEFAULT NULL,
  `temp_receipt_time` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `temp_receipts`
--

INSERT INTO `temp_receipts` (`temp_receipt_id`, `temp_receipt_code`, `table_number`, `temp_receipt_time`) VALUES
(1, 'TR-1755342542768', '1', '2025-08-16 11:09:02'),
(2, 'TR-1755342556023', '1', '2025-08-16 11:09:16'),
(3, 'T1-250816182708', '1', '2025-08-16 11:27:08'),
(4, 'T1-250816182708', '1', '2025-08-16 11:28:06'),
(5, 'T1-250816183343', '1', '2025-08-16 11:33:43'),
(6, 'T1-250816184525', '1', '2025-08-16 11:45:25'),
(7, 'T1-250816190714', '1', '2025-08-16 12:07:14'),
(8, 'T1-250816191012', '1', '2025-08-16 12:10:12');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone_number` varchar(20) NOT NULL,
  `role` enum('owner','staff') NOT NULL DEFAULT 'staff',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `username`, `password`, `phone_number`, `role`, `created_at`, `updated_at`) VALUES
(1, 'สมชาย', 'ไม่รู้', 'owner', '$2b$10$a0zrcHECF1gSPN42hk8B/edCMxNODuO.EHaPUkBqebjIm4XTM7F6K', '1234567891', 'owner', '2025-06-16 05:41:29', '2025-06-16 05:41:29'),
(3, 'สม', 'ใจ', 'staff', '$2b$10$ZTuIu2ancFUyfgBL92ImCOHFkXK.nXWbV4.1i7QYN4eQ5sDEodTkK', '0812345678', 'staff', '2025-06-21 05:16:54', '2025-07-14 19:03:27'),
(10, 'ด', 'ด', 't', '$2b$10$31HRBqxmTjiq1GgZVQYbzeM1pAp0fdwYja3rYmIhCINz2sIFNfbC.', '5', 'staff', '2025-07-14 08:09:18', '2025-07-14 08:09:18');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `menu`
--
ALTER TABLE `menu`
  ADD PRIMARY KEY (`menu_id`),
  ADD KEY `menu_type_id` (`menu_type_id`);

--
-- Indexes for table `menu_type`
--
ALTER TABLE `menu_type`
  ADD PRIMARY KEY (`menu_type_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `fk_orders_receipts` (`receipt_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`item_id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `pending_orders`
--
ALTER TABLE `pending_orders`
  ADD PRIMARY KEY (`pending_order_id`);

--
-- Indexes for table `pending_order_items`
--
ALTER TABLE `pending_order_items`
  ADD PRIMARY KEY (`pending_item_id`),
  ADD KEY `pending_order_id` (`pending_order_id`);

--
-- Indexes for table `receipts`
--
ALTER TABLE `receipts`
  ADD PRIMARY KEY (`receipt_id`),
  ADD UNIQUE KEY `receipt_code` (`receipt_code`),
  ADD KEY `fk_receipt_order` (`receipt_order_id`);

--
-- Indexes for table `store`
--
ALTER TABLE `store`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tables`
--
ALTER TABLE `tables`
  ADD PRIMARY KEY (`table_id`),
  ADD UNIQUE KEY `table_number` (`table_number`);

--
-- Indexes for table `temp_receipts`
--
ALTER TABLE `temp_receipts`
  ADD PRIMARY KEY (`temp_receipt_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `phone_number` (`phone_number`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `menu`
--
ALTER TABLE `menu`
  MODIFY `menu_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT for table `menu_type`
--
ALTER TABLE `menu_type`
  MODIFY `menu_type_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `pending_orders`
--
ALTER TABLE `pending_orders`
  MODIFY `pending_order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `pending_order_items`
--
ALTER TABLE `pending_order_items`
  MODIFY `pending_item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `receipts`
--
ALTER TABLE `receipts`
  MODIFY `receipt_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `store`
--
ALTER TABLE `store`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tables`
--
ALTER TABLE `tables`
  MODIFY `table_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `temp_receipts`
--
ALTER TABLE `temp_receipts`
  MODIFY `temp_receipt_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `menu`
--
ALTER TABLE `menu`
  ADD CONSTRAINT `menu_ibfk_1` FOREIGN KEY (`menu_type_id`) REFERENCES `menu_type` (`menu_type_id`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `fk_orders_receipts` FOREIGN KEY (`receipt_id`) REFERENCES `receipts` (`receipt_id`);

--
-- Constraints for table `pending_order_items`
--
ALTER TABLE `pending_order_items`
  ADD CONSTRAINT `pending_order_items_ibfk_1` FOREIGN KEY (`pending_order_id`) REFERENCES `pending_orders` (`pending_order_id`);

--
-- Constraints for table `receipts`
--
ALTER TABLE `receipts`
  ADD CONSTRAINT `fk_receipt_order` FOREIGN KEY (`receipt_order_id`) REFERENCES `pending_orders` (`pending_order_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
