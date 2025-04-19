-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 10, 2024 at 01:45 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `quriapp`
--

-- --------------------------------------------------------

--
-- Table structure for table `billingaddress`
--

CREATE TABLE `billingaddress` (
  `BillingID` int(11) NOT NULL,
  `CustomerID` int(11) DEFAULT NULL,
  `Country` varchar(150) DEFAULT NULL,
  `City` varchar(150) DEFAULT NULL,
  `ZipCode` varchar(50) DEFAULT NULL,
  `Created_AT` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `billingaddress`
--

INSERT INTO `billingaddress` (`BillingID`, `CustomerID`, `Country`, `City`, `ZipCode`, `Created_AT`) VALUES
(1, 33, 'USA', 'New York', '10001', '2024-07-18 10:30:15'),
(2, 34, 'Canada', 'Toronto', 'M5H 2N2', '2024-07-18 10:30:15'),
(3, 35, 'UK', 'London', 'EC1A 1BB', '2024-07-18 10:30:15'),
(4, 36, 'Australia', 'Sydney', '2000', '2024-07-18 10:30:15');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `CategoryID` int(11) NOT NULL,
  `CategoryName` varchar(255) NOT NULL,
  `RestaurantID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`CategoryID`, `CategoryName`, `RestaurantID`) VALUES
(2, 'Main Courses', 9404),
(3, 'Desserts', 41),
(4, 'Beverages', 9404),
(5, 'Sides', 41),
(6, 'Salads', 9404),
(7, 'Soups', 41),
(8, 'Specials', 9404),
(23, 'Appetizers', 41),
(24, 'Chicken', 41),
(25, 'Beef', 41),
(26, 'Chinese', 41),
(40, 'Delicious Creamy', 9404),
(41, 'Burgers', 41),
(42, 'Steaks', 41),
(43, 'Beverages', 41),
(44, 'Food', 3468),
(45, 'Beverages', 3468),
(46, 'BBQ', 3468),
(47, ' Appetizers', 1853),
(48, 'Salads', 1853),
(49, ' Main Course', 1853),
(50, 'Desserts', 1853),
(51, 'Beverages', 1853),
(52, 'Food', 7675),
(53, 'Cold Drinks', 7675),
(54, 'Appetizers', 19),
(55, 'Main Course', 19),
(56, 'Appetizers', 22),
(57, 'Main Course', 22),
(58, 'Beverages', 22),
(59, 'food', 23),
(60, 'chips', 23),
(61, 'Sabzi', 8684),
(62, 'BBQ', 6270),
(63, 'Main Course', 6270),
(64, 'Pulao', 6270),
(65, 'Chicken', 6270),
(66, 'Appetizer', 8569),
(68, 'Salads', 8569),
(69, 'Drinks', 8569),
(70, 'Desserts', 8569),
(71, 'Main Course', 8569),
(72, 'Appetizers', 5138),
(73, 'MainCourse', 5138);

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `CustomerID` int(11) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `PhoneNumber` varchar(20) DEFAULT NULL,
  `CreatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `RestaurantID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`CustomerID`, `Name`, `Email`, `PhoneNumber`, `CreatedAt`, `RestaurantID`) VALUES
(33, 'Testing', 'Testing47@gmail.com', '0900-78601', '2024-07-10 07:30:11', 41),
(34, 'Hello Boss', 'hello@world.com', '+92-317541656', '2024-07-10 07:40:48', 41),
(35, 'Sarmad Ahmad', 'sarmad87@gmail.com', '561521515656564', '2024-07-10 07:42:12', 9404),
(36, 'Haseeb ', 'haseebgreat78@live.com', '0700-78601', '2024-07-10 07:42:45', 9404),
(37, 'Zaeem Mirza', 'zaeem47@hotmail.com', '090078601', '2024-08-29 06:35:16', 8569);

-- --------------------------------------------------------

--
-- Table structure for table `menus`
--

CREATE TABLE `menus` (
  `MenuID` int(11) NOT NULL,
  `RestaurantID` int(11) DEFAULT NULL,
  `ItemName` varchar(255) NOT NULL,
  `ItemDescription` text DEFAULT NULL,
  `Price` decimal(10,2) NOT NULL,
  `Image` varchar(512) DEFAULT NULL,
  `CategoryID` int(11) DEFAULT NULL,
  `MenuStatus` enum('active','inactive') NOT NULL DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `menus`
--

INSERT INTO `menus` (`MenuID`, `RestaurantID`, `ItemName`, `ItemDescription`, `Price`, `Image`, `CategoryID`, `MenuStatus`) VALUES
(23, 41, 'Samosa', 'Mashed Potato', 20.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3Z1o8YBuRjMrmkr72OCHTm6HobOrI5g2Wiw&s', NULL, ''),
(24, 41, 'Pakoras', 'Mashed Potato\n', 50.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3eQK_HmlZOJxTG-p1PJlReZjDnUEqJJQM1w&s', NULL, ''),
(26, 9404, 'Bhindi', 'onion, oil etc ', 10.00, 'https://www.indianhealthyrecipes.com/wp-content/uploads/2018/07/bhindi-fry-500x500.jpg', NULL, ''),
(27, 9404, 'Aloo Qeema', 'Potato and Mutton', 40.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcxc20-Ohc8gGhBM5QF8K3CGsPRBSbXMQJ_w&s', NULL, ''),
(35, 41, 'Ice Cream', 'Kulfa Falooda', 12.99, 'http://example.com/image.jpg', 3, 'inactive'),
(47, 41, 'Kulfi Falooda', 'Description of the item', 10.99, 'https://miro.medium.com/v2/resize:fit:1400/1*SoEIG-WDkY5g9uDep1nbeA.jpeg', 3, 'active'),
(48, 41, 'Chicken Corn Soup ', 'adghdhdg', 70.00, 'https://img.taste.com.au/lecJ3E4J/taste/2016/11/creamy-chicken-and-corn-soup-61100-1.jpeg', 7, 'inactive'),
(49, 41, 'Mozzarella Sticks', 'Crispy breaded mozzarella sticks served with marinara sauce.', 18.50, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRk5YLOMZ1bzkG6uzxSaYfCcy2ojUeJi8Na9g&s', 23, 'active'),
(50, 41, 'Buffalo Wings', 'Spicy buffalo wings served with celery sticks and blue cheese dressing.', 22.50, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzUGmyDZeioF_cSwTobCWFT_o09hR1ZHI6RA&s', 23, 'active'),
(51, 41, 'Onion Rings', 'Golden fried onion rings served with a side of ketchup.', 15.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVmBENlVJ0tYGsvxxBmkihqIQB8oSRfsvv2A&s', 23, 'active'),
(52, 41, 'French Fries', 'Crispy golden fries lightly salted.', 15.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVmBENlVJ0tYGsvxxBmkihqIQB8oSRfsvv2A&s', 5, 'active'),
(53, 41, 'Classic Cheeseburger', 'Juicy beef patty topped with cheddar cheese, lettuce, tomato, and pickles', 18.50, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEmr_GKj6k1bKAd0fcpojawHhXmtddp05lfg&s', 41, 'active'),
(54, 41, 'Bacon Burger', 'Beef patty with crispy bacon, lettuce, tomato, and a smoky BBQ sauce.', 22.50, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSz9OVvBXoajEIMeSwec85Cnsvro4exCgh_sA&s', 41, 'active'),
(55, 41, 'Ribeye Steak', 'Premium filet mignon with a side of garlic butter.', 35.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIiwaVNptAp_KvEcpzv7Os87mVGBiomWKFKA&s', 42, 'active'),
(56, 41, 'Filet Mignon', 'Premium filet mignon with a side of garlic butter.', 30.00, 'https://hips.hearstapps.com/hmg-prod/images/delish-filet-mignon-horizontal-1541189043.jpeg?crop=1xw:0.84375xh;center,top&resize=1200:*', 42, 'active'),
(57, 41, 'Chocolate Brownie', 'Fusion', 10.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsS_jebdmZYqW_HYUFEryYf9Lq8r11xBDI4w&s', 3, 'active'),
(58, 41, 'Coca-Cola', 'Refreshing Coca-Cola served cold.', 5.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7rWMPA1ZF3-TybCXATfi180ZYR-zxeUkmhg&s', 43, 'active'),
(59, 41, 'Iced Tea', 'Hot brewed coffee, perfect for a caffeine boost', 5.50, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnugCzoODsSAT8SFWUpchdwpzUwH7F-2TjCw&s', 43, 'active'),
(60, 3468, 'Aalo Palak', 'Very greeny', 18.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcUJLmWqNS3B4883bfxRxy-FvC2hmSfKoj8g&s', 44, 'active'),
(61, 3468, 'Chicken Tikka', 'Laal mirchi, chicken', 80.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxnzlB6mfp12CqgfTmhsrNf1su8PdN-g5kTQ&s', 46, 'active'),
(62, 1853, 'Garlic Bread', 'Baguette, Garlic, Butter, Parsley, Parmesan Cheese', 20.00, 'https://www.allrecipes.com/thmb/ymrjQ3GFq_Fc7Fu2yfvIj108tcM=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/21080-great-garlic-bread-DDMFS-4x3-e1c7b5c79fde4d629a9b7bce6c0702ed.jpg', 47, 'active'),
(63, 1853, 'Chicken Wings', 'Chicken Wings, Hot Sauce, Butter, Garlic Powder, Paprika', 30.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnsI7-ujmFLHfWFRT4XV5oOiNdq3UvMitYoA&s', 47, 'active'),
(64, 1853, 'Caesar Salad', 'Romaine Lettuce, Croutons, Caesar Dressing, Parmesan Cheese, Grilled Chicken', 15.00, 'https://s23209.pcdn.co/wp-content/uploads/2023/01/220905_DD_Chx-Caesar-Salad_051.jpg', 48, 'active'),
(65, 1853, 'Garden Salad', 'Mixed Greens, Carrots, Cucumbers, Cherry Tomatoes, Balsamic Vinaigrette', 15.00, 'https://www.recipetineats.com/uploads/2021/08/Garden-Salad_47.jpg', 48, 'active'),
(66, 1853, 'Grilled Chicken Breast', 'Chicken Breast, Olive Oil, Garlic, Lemon Juice, Rosemary, Black Pepper', 30.00, 'https://hips.hearstapps.com/hmg-prod/images/grilled-chicken-breast-index-6626cdb057b5b.jpg?crop=0.503xw:1.00xh;0.249xw,0&resize=1200:*', 49, 'active'),
(67, 1853, 'Beef Steak', 'Beef Steak, Salt, Black Pepper, Garlic Butter, Rosemary', 30.00, 'https://i.ytimg.com/vi/nsw0Px-Pho8/maxresdefault.jpg', 49, 'active'),
(68, 7675, 'Sprite Zero', '500ml', 150.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQ0L2g_iBoXDrpU-qVbT9Dykq1pTHt2sXvIw&s', 53, 'active'),
(69, 7675, 'Biryani', 'chicken, rice', 250.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdZaamJuq6TAMQhM35ymXx1ijnFzFuGpCYZQ&s', 52, 'active'),
(70, 19, 'Beef Steak', 'gagaeg', 50.00, 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUSExMWFRUXGBgVFRgYFxgYGBcXGBcYFxcYFxcdHSggGBolHRUXITEhJikrLi4uFx8zODMtNygtLisBCgoKDg0OGxAQGy0lHyUvLS0tLS0tLS8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAKgBLAMBIgACEQEDEQH/xAAcAAACAgMBAQAAAAAAAAAAAAAEBQMGAAIHAQj/xAA+EAACAQIEBAQDBwQBAwMFAAABAhEAAwQSITEFBkFREyJhcTKBkRRCobHB0fAHI1LhM2Jy8VOCkhUWFyRE/8QAGgEAAwEBAQEAAAAAAAAAAAAAAQIDAAQFBv/EACsRAAICAgIBAgYCAgMAAAAAAAABAhEDIRIxQQQTIjJRYXGBFPChwUNSkf/aAAwDAQACEQMRAD8A53w1gZUiCHI+QplxO', 55, 'active'),
(71, 19, 'French Fries', 'agdfh', 10.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJV1RVOmJGwrWjio1p4M40W-ijLmZiVS0Swg&s', 54, 'active'),
(73, 22, 'French Fries', 'spicy and salty', 50.00, 'https://www.recipetineats.com/tachyon/2022/09/Fries-with-rosemary-salt_1.jpg', 56, 'active'),
(74, 22, 'Beef Steak', 'Yummy yummy beefy', 80.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMCBLMiNLCaunzTYj0M8ZIM39cSR8nSquSig&s', 57, 'active'),
(75, 22, 'Coca Cola', 'Caffeine ', 10.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_ql27guBd_JqiP7aSqQD7aJKRtHmEAIMtzA&s', 58, 'active'),
(76, 23, 'chips', '', 120.00, 'https://images.immediate.co.uk/production/volatile/sites/30/2020/12/Web-Air-Fryer-Chips-305f379.jpg?quality=90&resize=556,505', 60, 'active'),
(77, 23, 'chicken karhai', '', 1600.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0mkNvgBKVcWLgHUxleKosq6Qd5m8x5zMGJQ&s', 59, 'active'),
(79, 22, 'Bread Sticks', 'Bread Sticks', 70.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAwJ0v2NhN_Oy0E1b3Uf0zZDgy0h5JgPHHdw&s', 56, 'active'),
(80, 22, 'Grilled Chicken', 'Chicken, lemon spicy', 80.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH0MrDsVBYh1BOpLAtoxsSLOz9vnNOjKtyRA&s', 57, 'active'),
(81, 22, 'Lemonade', 'Ice, lemonade ', 70.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzixmJm1j6aLFZpncyOjQHSS3vI1BSrFLaow&s', 58, 'active'),
(82, 22, 'Honey Wings', 'Honey glazing', 25.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNndUU_pUuIBHJQBCtltsWQI8W-fkJfE5Qjg&s', 56, 'active'),
(83, 8684, 'Aalo palak', 'fafas', 70.00, 'https://www.indianhealthyrecipes.com/wp-content/uploads/2022/03/aloo-palak.jpg', 61, 'active'),
(84, 6270, 'Chicken Tikka', 'Chicken, spices', 70.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRto4n4dAoSeIQeytbn5kfpjFtLlTqTqc0aqw&s', 62, 'active'),
(85, 6270, 'Nargasi Kofta', 'Kofta, curry', 70.00, 'https://www.naushkitchenroutine.com/wp-content/uploads/2020/10/20201006_172538-fff-scaled.jpg', 63, 'active'),
(86, 6270, 'Kabuli Pulao', 'Rice, Carrots, Beef', 20.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR56RkxnINgmhZ9uY3VWDGxfSTPr8B_U2e1Yg&s', 64, 'active'),
(87, 6270, 'Chicken Shinwari', 'Chicken, Curry', 80.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHCJrsTyR7qc41tjGgKbzCrfX2NAYYDeXyjg&s', 65, 'active'),
(89, 8569, 'French Fries', '70', 80.00, 'https://www.recipetineats.com/tachyon/2022/09/Crispy-Fries_8.jpg', 66, 'active'),
(90, 8569, 'Honey Wings', 'Blah Blah', 50.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSR5Fvl24F0dOPpIucJp3Es_zi1ncVI9qV8CA&s', 66, 'active'),
(91, 8569, 'Fruit and Cheese Board', 'Fruits\n', 80.00, 'https://www.tasteofhome.com/wp-content/uploads/2018/04/Fruit-Charcuterie-Board_EXPS_JMZ18_224813_C03_07_8b.jpg?fit=300,300&webp=1', 66, 'active'),
(92, 8569, 'Cheese Sticks', 'Cheesy', 100.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRU56jhu-ZjbO6y1a_tYRzx--aGkBqNXsRfrQ&s', 66, 'active'),
(93, 8569, 'Caesar Salad', 'Cabbage,Carrots', 70.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSo_mxxnrIh5p0zp3er5AvY_uU_lt_urPJvEQ&s', 68, 'active'),
(94, 8569, 'Japanese Salad', 'Cucumber', 70.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRCkYU9JjpDtfTpCE1eVJRIlZWfbDUdnZkVQ&s', 68, 'active'),
(95, 8569, 'Chinese Chicken Salad', 'Marinated Chicken', 10.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTctcjRVA0ucBF1BSVsDuUnJjdNaT6inogxmw&s', 68, 'active'),
(96, 8569, 'Portugese Salad', 'Beans', 54.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4YyhcSQVXJaKKdp9Pg1NpFkS8MVpQDgSHAw&s', 68, 'active'),
(97, 8569, 'Fanta', 'Chilled Cold Drink ', 10.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhrbMrED8j5C2U5vUU8YeRN4VG6o8rF19jYg&s', 69, 'active'),
(98, 8569, 'Coke', 'Chilled Drink', 10.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLSD6EMjZdZA91asf7C_U7VuQGVwe39Qd_eQ&s', 69, 'active'),
(99, 8569, 'Pepsi', 'Chilled Drink', 10.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToYtKoLls-Pg68-fkdx_fXf3wLYcgYTniWtQ&s', 69, 'active'),
(100, 5138, 'French Fries', 'gagf', 70.00, 'https://www.inspiredtaste.net/wp-content/uploads/2023/09/Baked-French-Fries-Video.jpg', 72, 'active'),
(101, 5138, 'Grilled Chicken', 'asg', 70.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPmyN0zUX_cgIw0Hy9ueViXjtyUcr80pEATQ&s', 73, 'active'),
(105, 5138, 'Honey Wing', 'gsdds', 70.00, 'food-uploads/food-1727851464264.jpg', 72, 'inactive'),
(106, 5138, 'Grilled Chicken', 'Perfection', 70.00, 'food-uploads/food-1727851844822.jpg', 73, 'active');

-- --------------------------------------------------------

--
-- Table structure for table `orderdetails`
--

CREATE TABLE `orderdetails` (
  `OrderDetailID` int(11) NOT NULL,
  `OrderID` int(11) DEFAULT NULL,
  `MenuID` int(11) DEFAULT NULL,
  `Quantity` int(11) DEFAULT NULL,
  `Price` decimal(10,2) DEFAULT NULL,
  `isServed` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orderdetails`
--

INSERT INTO `orderdetails` (`OrderDetailID`, `OrderID`, `MenuID`, `Quantity`, `Price`, `isServed`) VALUES
(23, 15, 23, 2, 19.99, 'No'),
(24, 15, 24, 1, 9.99, 'Yes'),
(25, 16, 26, 3, 29.99, 'No'),
(26, 16, 27, 2, 14.99, 'Yes'),
(27, 17, 23, 1, 19.99, 'Yes'),
(28, 17, 24, 2, 9.99, 'No'),
(29, 18, 26, 1, 29.99, 'Yes'),
(30, 18, 27, 3, 14.99, 'No'),
(31, 19, 23, 3, 19.99, 'No'),
(32, 19, 24, 2, 9.99, 'Yes'),
(33, 20, 26, 1, 29.99, 'No'),
(34, 20, 27, 1, 14.99, 'Yes'),
(35, 21, 23, 2, 19.99, 'Yes'),
(36, 21, 24, 3, 9.99, 'No'),
(37, 22, 26, 1, 29.99, 'Yes'),
(38, 22, 27, 2, 14.99, 'No'),
(39, 23, 23, 1, 19.99, 'No'),
(40, 23, 24, 2, 9.99, 'Yes'),
(41, 24, 26, 3, 29.99, 'No'),
(42, 24, 27, 1, 14.99, 'Yes'),
(43, 25, 23, 2, 19.99, 'Yes'),
(44, 25, 24, 1, 9.99, 'No'),
(45, 26, 26, 2, 29.99, 'Yes'),
(46, 26, 27, 3, 14.99, 'No'),
(47, 27, 23, 1, 19.99, 'Yes'),
(48, 27, 24, 3, 9.99, 'No'),
(49, 28, 26, 2, 29.99, 'Yes'),
(50, 28, 27, 1, 14.99, 'No'),
(51, 29, 23, 3, 19.99, 'Yes'),
(52, 29, 24, 2, 9.99, 'No'),
(53, 30, 26, 1, 29.99, 'Yes'),
(54, 30, 27, 2, 14.99, 'No'),
(69, 256, 23, 2, 19.99, 'No'),
(70, 256, 24, 1, 9.99, 'No'),
(71, 257, 23, 2, 19.99, 'No'),
(72, 257, 24, 1, 9.99, 'No'),
(73, 258, 23, 2, 19.99, 'No'),
(74, 258, 24, 1, 9.99, 'No'),
(81, 262, 50, 2, 22.50, 'No'),
(82, 262, 51, 1, 15.00, 'No'),
(83, 262, 49, 2, 18.50, 'No'),
(84, 262, 53, 1, 18.50, 'No'),
(85, 262, 58, 1, 5.00, 'No'),
(86, 263, 50, 1, 22.50, 'No'),
(87, 263, 51, 2, 15.00, 'No'),
(88, 263, 49, 1, 18.50, 'No'),
(89, 263, 58, 1, 5.00, 'No'),
(90, 263, 59, 1, 5.50, 'No'),
(91, 264, 62, 1, 20.00, 'No'),
(92, 264, 63, 1, 30.00, 'No'),
(93, 264, 65, 2, 15.00, 'No'),
(94, 265, 68, 2, 150.00, 'No'),
(95, 266, 51, 2, 15.00, 'No'),
(96, 267, 76, 2, 120.00, 'No'),
(97, 268, 76, 1, 120.00, 'No'),
(98, 269, 86, 2, 20.00, 'No'),
(99, 269, 84, 1, 70.00, 'No'),
(100, 270, 84, 1, 70.00, 'No'),
(101, 270, 87, 1, 80.00, 'No'),
(102, 270, 86, 1, 20.00, 'No'),
(103, 271, 90, 2, 50.00, 'No'),
(104, 271, 89, 2, 80.00, 'No'),
(105, 272, 91, 3, 80.00, 'No'),
(106, 272, 92, 2, 100.00, 'No'),
(107, 272, 89, 2, 80.00, 'No'),
(108, 272, 90, 1, 50.00, 'No'),
(109, 273, 100, 2, 70.00, 'No'),
(110, 273, 101, 2, 70.00, 'No');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `OrderID` int(11) NOT NULL,
  `RestaurantID` int(11) DEFAULT NULL,
  `CustomerID` int(11) DEFAULT NULL,
  `Status` enum('Received','Processing','Ready for pickup','Saved','Completed','Cancelled','Paid','Refunded') DEFAULT NULL,
  `TotalAmount` decimal(10,2) DEFAULT NULL,
  `OrderDate` varchar(10) DEFAULT NULL,
  `TableID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`OrderID`, `RestaurantID`, `CustomerID`, `Status`, `TotalAmount`, `OrderDate`, `TableID`) VALUES
(15, 41, 33, 'Saved', 100.00, '07-12-2024', NULL),
(16, 41, 33, 'Paid', 150.00, '07-12-2024', NULL),
(17, 41, 34, 'Saved', 200.00, '07-12-2024', NULL),
(18, 41, 34, 'Saved', 250.00, '07-12-2024', NULL),
(19, 41, 35, 'Cancelled', 300.00, '07-12-2024', NULL),
(20, 41, 35, 'Cancelled', 350.00, '07-12-2024', NULL),
(21, 41, 36, 'Paid', 400.00, '07-12-2024', NULL),
(22, 41, 36, 'Refunded', 450.00, '07-12-2024', NULL),
(23, 9404, 33, 'Received', 500.00, '07-12-2024', NULL),
(24, 9404, 33, 'Processing', 550.00, '07-12-2024', NULL),
(25, 9404, 34, 'Ready for pickup', 600.00, '07-12-2024', NULL),
(26, 9404, 34, 'Saved', 650.00, '07-12-2024', NULL),
(27, 9404, 35, 'Completed', 700.00, '07-12-2024', NULL),
(28, 9404, 35, 'Cancelled', 750.00, '07-12-2024', NULL),
(29, 9404, 36, 'Paid', 800.00, '07-12-2024', NULL),
(30, 9404, 36, 'Refunded', 850.00, '07-12-2024', NULL),
(31, 41, 33, '', 40.00, '07-24-2024', NULL),
(32, 41, 34, 'Paid', 80.00, '07-24-2024', NULL),
(33, 41, 33, 'Refunded', 90.00, '07-24-2024', NULL),
(34, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(35, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(36, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(37, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(38, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(39, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(40, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(41, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(42, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(43, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(44, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(45, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(46, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(47, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(48, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(49, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(50, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(51, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(52, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(53, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(54, 41, 33, '', 40.00, '07-24-2024', NULL),
(55, 41, 34, 'Paid', 80.00, '07-24-2024', NULL),
(56, 41, 33, 'Refunded', 90.00, '07-24-2024', NULL),
(57, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(58, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(59, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(60, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(61, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(62, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(63, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(64, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(65, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(66, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(67, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(68, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(69, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(70, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(71, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(72, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(73, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(74, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(75, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(76, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(77, 41, 33, '', 40.00, '07-24-2024', NULL),
(78, 41, 34, 'Paid', 80.00, '07-24-2024', NULL),
(79, 41, 33, 'Refunded', 90.00, '07-24-2024', NULL),
(80, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(81, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(82, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(83, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(84, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(85, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(86, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(87, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(88, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(89, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(90, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(91, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(92, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(93, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(94, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(95, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(96, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(97, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(98, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(99, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(100, 41, 33, '', 40.00, '07-24-2024', NULL),
(101, 41, 34, 'Paid', 80.00, '07-24-2024', NULL),
(102, 41, 33, 'Refunded', 90.00, '07-24-2024', NULL),
(103, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(104, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(105, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(106, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(107, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(108, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(109, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(110, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(111, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(112, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(113, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(114, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(115, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(116, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(117, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(118, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(119, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(120, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(121, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(122, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(123, 41, 33, '', 40.00, '07-24-2024', NULL),
(124, 41, 34, 'Paid', 80.00, '07-24-2024', NULL),
(125, 41, 33, 'Refunded', 90.00, '07-24-2024', NULL),
(126, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(127, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(128, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(129, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(130, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(131, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(132, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(133, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(134, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(135, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(136, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(137, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(138, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(139, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(140, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(141, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(142, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(143, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(144, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(145, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(146, 41, 33, '', 40.00, '07-24-2024', NULL),
(147, 41, 34, 'Paid', 80.00, '07-24-2024', NULL),
(148, 41, 33, 'Refunded', 90.00, '07-24-2024', NULL),
(149, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(150, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(151, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(152, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(153, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(154, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(155, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(156, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(157, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(158, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(159, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(160, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(161, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(162, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(163, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(164, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(165, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(166, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(167, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(168, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(169, 41, 33, '', 40.00, '07-24-2024', NULL),
(170, 41, 34, 'Paid', 80.00, '07-24-2024', NULL),
(171, 41, 33, 'Refunded', 90.00, '07-24-2024', NULL),
(172, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(173, 41, 34, 'Completed', 85.00, '07-24-2024', NULL),
(174, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(175, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(176, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(177, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(178, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(179, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(180, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(181, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(182, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(183, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(184, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(185, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(186, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(187, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(188, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(189, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(190, 41, 34, 'Cancelled', 85.00, '07-24-2024', NULL),
(256, 41, NULL, 'Completed', 49.99, NULL, 33),
(257, 41, NULL, 'Completed', 49.99, NULL, 33),
(258, 41, NULL, 'Completed', 49.99, NULL, 33),
(259, 41, NULL, 'Completed', 78.00, NULL, 33),
(262, 41, NULL, 'Completed', 42.00, '08-08-2024', 33),
(263, 41, NULL, 'Completed', 52.50, '08-13-2024', 33),
(264, 1853, NULL, 'Completed', 80.00, '08-20-2024', 73),
(265, 7675, NULL, 'Received', 300.00, '08-20-2024', 74),
(266, 41, NULL, 'Received', 30.00, '08-20-2024', 33),
(267, 23, NULL, 'Completed', 240.00, '08-21-2024', 77),
(268, 23, NULL, 'Received', 120.00, '08-21-2024', 78),
(269, 6270, NULL, 'Received', 110.00, '08-23-2024', 79),
(270, 6270, NULL, 'Received', 170.00, '08-27-2024', 81),
(271, 8569, NULL, 'Completed', 260.00, '08-29-2024', 83),
(272, 8569, NULL, 'Completed', 210.00, '09-23-2024', 86),
(273, 5138, NULL, 'Received', 280.00, '09-30-2024', 88);

-- --------------------------------------------------------

--
-- Table structure for table `paymentoptionsavailable`
--

CREATE TABLE `paymentoptionsavailable` (
  `PaymentOptionsID` int(11) NOT NULL,
  `RestaurantID` int(11) DEFAULT NULL,
  `PaymentTypeID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `PaymentID` int(11) NOT NULL,
  `OrderID` int(11) DEFAULT NULL,
  `PaymentDate` timestamp NOT NULL DEFAULT current_timestamp(),
  `PaymentMethod` varchar(50) DEFAULT NULL,
  `Amount` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `paymenttype`
--

CREATE TABLE `paymenttype` (
  `PaymentTypeID` int(11) NOT NULL,
  `PaymentTypeName` varchar(50) NOT NULL,
  `PaymentTypeImage` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `people`
--

CREATE TABLE `people` (
  `Id` int(11) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `TableID` int(11) DEFAULT NULL,
  `RestaurantID` int(11) DEFAULT NULL,
  `Status` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `people`
--

INSERT INTO `people` (`Id`, `Name`, `TableID`, `RestaurantID`, `Status`) VALUES
(3, 'Paul', 34, 41, 'Unpaid'),
(4, 'Smith', 34, 41, 'Unpaid'),
(5, 'Smith', 34, 41, 'Unpaid'),
(6, 'Smith', 34, 41, 'Unpaid'),
(7, 'Smith', 34, 41, 'Unpaid'),
(8, 'Smith', 34, 41, 'Unpaid'),
(91, 'Sarmad', 33, 41, 'Unpaid'),
(93, 'Haseeb', 33, 41, 'Unpaid'),
(95, 'sarmad', 74, 7675, 'Unpaid');

-- --------------------------------------------------------

--
-- Table structure for table `restaurantadmins`
--

CREATE TABLE `restaurantadmins` (
  `ID` int(11) NOT NULL,
  `RestaurantID` int(11) NOT NULL,
  `Username` varchar(100) DEFAULT NULL,
  `Password` varchar(255) DEFAULT NULL,
  `verificationToken` varchar(255) DEFAULT NULL,
  `isVerified` int(11) DEFAULT NULL,
  `Role` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `restaurantadmins`
--

INSERT INTO `restaurantadmins` (`ID`, `RestaurantID`, `Username`, `Password`, `verificationToken`, `isVerified`, `Role`) VALUES
(37, 5138, 'sarmadahmad83@gmail.com', '$2b$10$68LHiH6z8oG.7RgrlHBSUOqhiRL./lp./NUqRKzS6MR/UABmTDfAm', NULL, 1, 'restaurant'),
(48, 5381, 'admintesting@gmail.com', '$2b$10$jxnBFxNCsgFo3GL5jUDVJebxohQFrGd98AQ9XROLW5tlurco6ESIO', '', 1, 'admin'),
(49, 6546, 'restauranttesting78@gmail.com', '$2b$10$8CZrZj/hQZtL/NmX0jSwgu0fb85y/2GE4FoKcIUYmjWFYWGTfORd6', '', 1, 'restaurant'),
(55, 5245, 'AlphaTesting', '$2b$10$BZ3Z2NXUBwSutACxss93lO3GRzoe2Hw26naXjJCdJiO3k.DSNyyO.', NULL, 1, 'restaurant'),
(56, 7883, 'AlphaTestings', '$2b$10$TM5HWA9O17x5N4psyFJP.egzdmmK4vNsaxYjwBL5MUVng29Sopsvq', NULL, 1, 'restaurant'),
(57, 4097, 'newAdminUser', '$2b$10$JmEDsKSdt8Oqh2..wI9qLelUQ4QpOOVsdIrWL4m0ZP/HXQzx4l/1m', NULL, 1, 'restaurant'),
(58, 7983, 'newAdminUserssss', '$2b$10$3VidZf3iqEMIEsDI.4BZqeK6qXyrYhI3vdSTMB/OJXvXxLAuQFM0C', NULL, 1, 'restaurant'),
(64, 3610, 'gourmetadmin@example.com', '$2b$10$Z6zmthnTwyE5pV2m1glc.eMEvOrMcCMHZRp0FVehIJUQ.JCHIN3sW', NULL, 1, 'restaurant'),
(65, 9457, 'bellapasta@example.com', '$2b$10$XPaejXgk0MjnfKnRp6HCSek8J4HZSk6wJBAS6NqY7rnB.G/qtEI.K', NULL, 1, 'restaurant'),
(66, 5932, 'sushizen@example.com', '$2b$10$2/f6fE9lzhlZxbufd3WwqeKmXr6Ja1xzSNxjU9zDF2IANT5OqKLu.', NULL, 1, 'restaurant'),
(67, 1324, 'burgershack@example.com', '$2b$10$VA9RRNMMwg5gXR2wlswjyeNDLzFsgommESPOULdo4LR2F0XDYgw26', NULL, 1, 'restaurant'),
(68, 1196, 'currydelight@example.com', '$2b$10$PeHVpGne2yvUaDa26/49HOspRV.M5mGQAIDoXQIbSJA3tF6a7GjnC', NULL, 1, 'restaurant'),
(69, 7917, 'asianwok47@gmail.com', '$2b$10$AefyY.fFUeHmf6L.D4gPL.wgHzP.FkD2HUO52cQGYSaKLea33FJOa', NULL, 1, 'restaurant'),
(76, 3805, 'testing123@gmail.com', '$2b$10$pxdot9NvTJoPBwIN7vFYhuzuiYS781JgWRzI0xL.ieTWwbLf3KVDq', NULL, 1, 'restaurant');

-- --------------------------------------------------------

--
-- Table structure for table `restaurants`
--

CREATE TABLE `restaurants` (
  `RestaurantID` int(11) NOT NULL,
  `RestaurantName` varchar(255) NOT NULL,
  `Address` varchar(255) DEFAULT NULL,
  `PhoneNumber` varchar(20) DEFAULT NULL,
  `CreatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `restaurants`
--

INSERT INTO `restaurants` (`RestaurantID`, `RestaurantName`, `Address`, `PhoneNumber`, `CreatedAt`, `status`) VALUES
(19, 'your res', NULL, NULL, '2024-08-20 11:08:37', NULL),
(22, 'Tasty Spot', NULL, NULL, '2024-08-21 05:06:14', NULL),
(23, 'Fresh Cafe', NULL, NULL, '2024-08-21 06:30:56', NULL),
(41, 'The Gourmet Kitchen', '123 Culinary St, Flavor Town', '123-456-7890', '2024-07-08 04:59:11', NULL),
(1087, 'Zesty Corner', NULL, NULL, '2024-09-24 07:23:00', NULL),
(1196, 'Curry Delight', NULL, NULL, '2024-10-10 07:28:07', 'Inactive'),
(1324, 'Burger Co', NULL, NULL, '2024-10-10 07:27:25', 'active'),
(1679, 'Cozy Place', NULL, NULL, '2024-10-07 06:40:03', NULL),
(1853, 'Delicious Bites', '123 Flavor Street, Gourmet City, FL 12345', '090078601', '2024-08-20 06:53:32', NULL),
(3233, 'Delicious Place', NULL, NULL, '2024-09-24 07:19:31', NULL),
(3468, 'Haseeb Restaurant', '14th street', NULL, '2024-08-19 12:29:00', NULL),
(3610, 'The Gourmet Hub', NULL, NULL, '2024-10-10 07:16:54', 'Active'),
(3686, 'Hearty Place', NULL, NULL, '2024-10-07 06:42:21', NULL),
(3805, 'Chinese Testing ', NULL, NULL, '2024-10-10 10:51:11', 'inactive'),
(3861, 'Savory Diner', NULL, NULL, '2024-09-30 06:05:52', NULL),
(3939, 'Zesty Spot', NULL, NULL, '2024-10-03 06:04:10', NULL),
(4097, 'Tasty Corner', NULL, NULL, '2024-10-08 10:49:11', NULL),
(5138, 'Asian Wok', NULL, NULL, '2024-09-24 08:00:57', 'active'),
(5245, 'Tasty Cafe', NULL, NULL, '2024-10-08 10:24:13', NULL),
(5254, 'Gourmet Eatery', NULL, NULL, '2024-08-30 06:43:51', NULL),
(5355, 'Zesty Spot', NULL, NULL, '2024-08-23 06:27:18', NULL),
(5464, 'Fresh Diner', NULL, NULL, '2024-09-30 06:29:49', NULL),
(5537, 'Gourmet Spot', NULL, NULL, '2024-08-21 11:25:08', NULL),
(5932, 'Sushi Zen', NULL, NULL, '2024-10-10 07:26:21', 'active'),
(6270, 'Savory Bistro', NULL, NULL, '2024-08-23 06:29:18', NULL),
(6546, 'Spicy Place', NULL, NULL, '2024-10-07 06:54:38', NULL),
(7232, 'Spicy Kitchen', NULL, NULL, '2024-10-09 10:23:37', 'Active'),
(7502, 'Gourmet Bistro', NULL, NULL, '2024-09-24 07:18:07', NULL),
(7675, 'Desi Dhaba ', '14th Street', '090078601', '2024-08-20 10:03:29', NULL),
(7720, 'Tasty Diner', NULL, NULL, '2024-09-24 07:44:47', NULL),
(7883, 'Spicy Grill', NULL, NULL, '2024-10-08 10:25:23', NULL),
(7917, 'Asian Woks', NULL, NULL, '2024-10-10 07:29:14', 'active'),
(7925, 'Spicy Corner', NULL, NULL, '2024-09-24 07:24:35', NULL),
(7983, 'Tasty Eatery', NULL, NULL, '2024-10-08 10:52:49', NULL),
(8109, 'Fresh Spot', NULL, NULL, '2024-09-30 06:38:02', NULL),
(8569, 'Zesty Corner', NULL, NULL, '2024-08-29 06:27:36', NULL),
(8684, 'Spicy Place', NULL, NULL, '2024-08-23 05:32:49', NULL),
(8973, 'Delicious Grill', NULL, NULL, '2024-09-24 07:56:09', NULL),
(9248, 'Zesty Bistro', NULL, NULL, '2024-09-24 07:59:03', NULL),
(9404, 'Savory Bites', '456 Delicious Ave, Tasty City', '098-765-4321', '2024-07-08 05:25:48', NULL),
(9457, 'Bella Pasta', NULL, NULL, '2024-10-10 07:21:44', 'inactive'),
(9700, 'Cozy Spot', NULL, NULL, '2024-10-09 09:35:01', 'Active'),
(9797, 'Tasty Spot', NULL, NULL, '2024-09-30 06:51:59', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `ReviewID` int(11) NOT NULL,
  `RestaurantID` int(11) DEFAULT NULL,
  `MenuID` int(11) DEFAULT NULL,
  `OrderID` int(11) DEFAULT NULL,
  `CustomerID` int(11) DEFAULT NULL,
  `Rating` enum('1','2','3','4','5') NOT NULL,
  `Comments` varchar(255) DEFAULT NULL,
  `CreatedAt` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`ReviewID`, `RestaurantID`, `MenuID`, `OrderID`, `CustomerID`, `Rating`, `Comments`, `CreatedAt`) VALUES
(5, 41, 35, 18, 33, '5', 'Excellent Dish', '07-15-2024'),
(7, 41, 35, 18, 34, '3', 'Poor Dish', '07-18-2024'),
(10, 41, 47, 18, 33, '4', 'Delicious', '07-24-2024'),
(11, 9404, 47, 18, 33, '4', 'Worst of all time', '07-24-2024'),
(12, 9404, 48, 22, 34, '1', 'The chef doesnot knows how to cook', '07-24-2024'),
(13, 41, 48, 22, 34, '1', 'The chef doesnot knows how to cook', '07-24-2024'),
(14, 41, 35, 15, 33, '5', 'Delicious', '07-24-2024'),
(15, 41, 47, 16, 34, '3', 'Worst of all time', '07-24-2024'),
(16, 41, 48, 17, 33, '2', 'The chef doesn’t know how to cook', '07-24-2024'),
(17, 41, 35, 18, 34, '1', 'The chef doesn’t know how to cook', '07-24-2024'),
(18, 41, 35, 19, 33, '5', 'Excellente', '07-24-2024'),
(19, 41, 35, 20, 33, '1', 'The chef doesn’t know how to cook', '07-24-2024'),
(20, 41, 48, 21, 34, '1', 'The chef doesn’t know how to cook', '07-24-2024'),
(21, 41, 48, 22, 34, '4', 'Bravo', '07-24-2024'),
(22, 41, 48, 20, 33, '1', 'The chef doesn’t know how to cook', '07-24-2024'),
(23, 41, 48, 21, 34, '1', 'The chef doesn’t know how to cook', '07-24-2024');

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `SettingID` int(11) NOT NULL,
  `RestaurantID` int(11) DEFAULT NULL,
  `KeyID` varchar(255) DEFAULT NULL,
  `Value` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`SettingID`, `RestaurantID`, `KeyID`, `Value`) VALUES
(37, 41, 'image', 'uploads/1721284300334.png'),
(38, 9404, 'image', 'uploads/1720684310286.png'),
(39, 41, 'RestaurantName', 'Ajees Kitchen'),
(40, 41, 'Address', '123 Street'),
(41, 41, 'PhoneNumber', '0318-54122780'),
(42, 41, 'Description', 'WE Are Open Always for You'),
(43, 41, 'Email', 'ajees@gmail.com'),
(44, 9404, 'RestaurantName', 'Al Baik Restaurants'),
(45, 9404, 'Address', 'Gulberg Greens Islamabad'),
(46, 9404, 'PhoneNumber', '0900-78601'),
(47, 9404, 'Description', 'Awesome Fried Chicken '),
(48, 9404, 'Email', 'albaik47@gmail.com'),
(49, 41, 'monday', '{\"open\":\"18:20\",\"close\":\"16:18\"}'),
(50, 41, 'tuesday', '{\"open\":\"16:18\",\"close\":\"16:18\"}'),
(51, 41, 'wednesday', '{\"open\":\"19:21\",\"close\":\"07:21\"}'),
(52, 41, 'thursday', '{\"open\":\"16:18\",\"close\":\"16:18\"}'),
(53, 41, 'friday', '{\"open\":\"16:18\",\"close\":\"16:18\"}'),
(54, 41, 'saturday', '{\"open\":\"22:24\",\"close\":\"21:23\"}'),
(55, 41, 'sunday', '{\"open\":\"22:28\",\"close\":\"22:27\"}'),
(56, 9404, 'monday', '10:00 AM - 06:00 PM'),
(57, 9404, 'tuesday', '11:00 AM - 08:00 PM'),
(58, 9404, 'wednesday', '9:00 AM - 08:00 PM'),
(59, 9404, 'thursday', '09:00 AM - 08:00 PM'),
(60, 9404, 'friday', '10:00 AM - 10:00 PM'),
(61, 9404, 'saturday', '09:00 AM - 08:00 PM'),
(62, 9404, 'sunday', '11:00 AM - 084:00 PM'),
(63, 19, 'RestaurantName', 'Desi Dhaba'),
(64, 19, 'Address', '14th Street'),
(65, 19, 'PhoneNumber', '090078601'),
(66, 19, 'Description', 'Awesome'),
(67, 19, 'Email', 'ranaSheikh12@gmail.com'),
(68, 22, 'image', 'uploads/1724216865374.png'),
(69, 8569, 'image', 'uploads/1724913419247.png'),
(70, 8569, 'RestaurantName', 'Desi Dhaba Restaurant'),
(71, 8569, 'Address', '14th Street'),
(72, 8569, 'PhoneNumber', '090078601'),
(73, 8569, 'Description', 'blaah '),
(74, 8569, 'Email', 'desidhaba@47hotmail.com'),
(75, 8569, 'monday', '{\"open\":\"12:13\",\"close\":\"00:13\"}'),
(76, 8569, 'tuesday', '{\"open\":\"00:13\",\"close\":\"12:13\"}'),
(77, 8569, 'wednesday', '{\"open\":\"12:13\",\"close\":\"12:13\"}'),
(78, 8569, 'thursday', '{\"open\":\"12:13\",\"close\":\"00:13\"}'),
(79, 8569, 'friday', '{\"open\":\"00:13\",\"close\":\"12:13\"}'),
(80, 8569, 'saturday', '{\"open\":\"12:18\",\"close\":\"12:13\"}'),
(81, 8569, 'sunday', '{\"open\":\"12:13\",\"close\":\"12:17\"}'),
(82, 5138, 'RestaurantName', 'Asian Wok'),
(83, 5138, 'Address', '14th Address'),
(84, 5138, 'PhoneNumber', '03145965959'),
(85, 5138, 'Description', 'dummy'),
(86, 5138, 'Email', 'asianwok@57.com'),
(87, 5138, 'image', 'uploads/1727934899277.png'),
(161, 3939, 'image', 'uploads/1727946224323.jpg'),
(162, 3939, 'RestaurantName', 'Habibi Restaurant'),
(163, 3939, 'Address', '14th Street '),
(164, 3939, 'PhoneNumber', '1486568'),
(165, 3939, 'Description', 'gsfagsdfg'),
(166, 3939, 'Email', 'Habib47@gmail.com'),
(167, 4097, 'Description', 'This is just a test alpha.'),
(168, 4097, 'Address', '14th Address'),
(169, 4097, 'PhoneNumber', '1486568'),
(170, 7983, 'Description', 'This is just a test alpha.'),
(171, 7983, 'Address', '14th Address'),
(172, 7983, 'PhoneNumber', '1486568'),
(173, 7232, 'restaurantName', NULL),
(174, 7232, 'restaurantAddress', '1234 Elm Street, Springfield, IL 62704'),
(175, 7232, 'phoneNumber', '+1 312 555 1234'),
(176, 7232, 'description', 'A fine dining restaurant offering a fusion of contemporary and classic dishes.'),
(177, 7232, 'image', 'uploads/1728469417057.jpg'),
(193, 3610, 'restaurantName', 'The Gourmet Hub'),
(194, 3610, 'restaurantAddress', '123 Main St, Springfield, IL 62701'),
(195, 3610, 'phoneNumber', '+1 217-555-0198'),
(196, 3610, 'description', 'A high-end dining experience with a mix of traditional and contemporary cuisines.'),
(197, 3610, 'image', 'uploads/1728544614365.jpg'),
(198, 9457, 'restaurantName', 'Bella Pasta'),
(199, 9457, 'restaurantAddress', '456 Pasta Ln, Rome, NY 13440'),
(200, 9457, 'phoneNumber', '+1 315-555-0234'),
(201, 9457, 'description', 'An authentic Italian restaurant specializing in homemade pasta dishes.'),
(202, 9457, 'image', 'uploads/1728544904761.jpg'),
(203, 5932, 'restaurantName', 'Sushi Zen'),
(204, 5932, 'restaurantAddress', '789 Sushi Blvd, San Francisco, CA 94109'),
(205, 5932, 'phoneNumber', '+1 415-555-0678'),
(206, 5932, 'description', 'Experience the art of Japanese sushi made with the freshest ingredients.'),
(207, 5932, 'image', 'uploads/1728545181431.jpg'),
(208, 1324, 'restaurantName', 'Burger Shack'),
(209, 1324, 'restaurantAddress', '321 Burger Ave, Austin, TX 78701'),
(210, 1324, 'phoneNumber', '+1 512-555-0456'),
(211, 1324, 'description', 'A casual spot for the best burgers and shakes in town, made from locally-sourced ingredients.'),
(212, 1324, 'image', 'uploads/1728545245655.jpg'),
(213, 1196, 'restaurantName', 'Curry Delight'),
(214, 1196, 'restaurantAddress', '654 Spice Rd, Houston, TX 77002'),
(215, 1196, 'phoneNumber', '+1 713-555-0879'),
(216, 1196, 'description', 'Serving traditional Indian curries with a modern twist, offering vegetarian and vegan options.'),
(217, 1196, 'image', 'uploads/1728545287693.jpg'),
(218, 7917, 'restaurantName', 'Asian Wok'),
(219, 7917, 'restaurantAddress', 'Beverly Center'),
(220, 7917, 'phoneNumber', '+1 315-555-0234'),
(221, 7917, 'description', 'A fine chinese restaurant'),
(222, 7917, 'image', 'uploads/1728545354026.jpg'),
(238, 5138, 'restaurantAddress', '123 Main St, Springfield, IL 62701'),
(239, 5138, 'phoneNumber', '+1 217-555-0198'),
(240, 5138, 'description', 'A high-end dining experience with a mix of traditional and contemporary cuisines.'),
(241, 5138, 'image', 'uploads/1728549896214.jpg'),
(242, 1324, 'restaurantAddress', '321 Burger Ave, Austin, TX 78701'),
(243, 1324, 'phoneNumber', '+1 512-555-0456'),
(244, 1324, 'description', 'A casual spot for the best burgers and shakes in town, made from locally-sourced ingredients.'),
(245, 1324, 'restaurantAddress', '321 Burger Ave, Austin, TX 78701'),
(246, 1324, 'phoneNumber', '+1 512-555-0456'),
(247, 1324, 'description', 'A casual spot for the best burgers and shakes in town, made from locally-sourced ingredients.'),
(248, 1324, 'restaurantAddress', '321 Burger Ave, Austin, TX 78701'),
(249, 1324, 'phoneNumber', '+1 512-555-0456'),
(250, 1324, 'description', 'A casual spot for the best burgers and shakes in town, made from locally-sourced ingredients.'),
(251, 1324, 'restaurantAddress', '321 Burger Ave, Austin, TX 78701'),
(252, 1324, 'phoneNumber', '+1 512-555-0456'),
(253, 1324, 'description', 'A casual spot for the best burgers and shakes in town, made from locally-sourced ingredients.'),
(254, 1324, 'restaurantAddress', '321 Burger Ave, Austin, TX 78701'),
(255, 1324, 'phoneNumber', '+1 512-555-0456'),
(256, 1324, 'description', 'A casual spot for the best burgers and shakes in town, made from locally-sourced ingredients.'),
(257, 1324, 'restaurantAddress', '321 Burger Ave, Austin, TX 78701'),
(258, 1324, 'phoneNumber', '+1 512-555-0456'),
(259, 1324, 'description', 'A casual spot for the best burgers and shakes in town, made from locally-sourced ingredients.'),
(260, 1324, 'restaurantAddress', '321 Burger Ave, Austin, TX 78701'),
(261, 1324, 'phoneNumber', '+1 512-555-0456'),
(262, 1324, 'description', 'A casual spot for the best burgers and shakes in town, made from locally-sourced ingredients.'),
(263, 1324, 'restaurantAddress', '321 Burger Ave, Austin, TX 78701'),
(264, 1324, 'phoneNumber', '+1 512-555-0456'),
(265, 1324, 'description', 'A casual spot for the best burgers and shakes in town, made from locally-sourced ingredients.'),
(266, 1324, 'restaurantAddress', '321 Burger Ave, Austin, TX 78701'),
(267, 1324, 'phoneNumber', '+1 512-555-0456'),
(268, 1324, 'description', 'A casual spot for the best burgers and shakes in town, made from locally-sourced ingredients.'),
(269, 9457, 'restaurantAddress', '456 Pasta Ln, Rome, NY 13440'),
(270, 9457, 'phoneNumber', '+1 315-555-0234'),
(271, 9457, 'description', 'An authentic Italian restaurant specializing in homemade pasta dishes.'),
(293, 1324, 'restaurantAddress', '321 Burger Ave, Austin, TX 78701'),
(294, 1324, 'phoneNumber', '+1 512-555-0456'),
(295, 1324, 'description', 'A casual spot for the best burgers and shakes in town, made from locally-sourced ingredients.'),
(299, 1324, 'restaurantAddress', '321 Burger Ave, Austin, TX 78701'),
(300, 1324, 'phoneNumber', '+1 512-555-0456'),
(301, 1324, 'description', 'A casual spot for the best burgers and shakes in town, made from locally-sourced ingredients.'),
(302, 5932, 'restaurantAddress', '789 Sushi Blvd, San Francisco, CA 94109'),
(303, 5932, 'phoneNumber', '+1 415-555-0678'),
(304, 5932, 'description', 'Experience the art of Japanese sushi made with the freshest ingredients.'),
(314, 7917, 'restaurantAddress', 'Beverly Center'),
(315, 7917, 'phoneNumber', '+1 315-555-0234'),
(316, 7917, 'description', 'A fine chinese restaurant'),
(317, 7917, 'restaurantAddress', 'Beverly Center'),
(318, 7917, 'phoneNumber', '+1 315-555-0234'),
(319, 7917, 'description', 'A fine chinese restaurant'),
(320, 7917, 'restaurantAddress', 'Beverly Center'),
(321, 7917, 'phoneNumber', '+1 315-555-0234'),
(322, 7917, 'description', 'A fine chinese restaurant'),
(323, 7917, 'restaurantAddress', 'Beverly Center'),
(324, 7917, 'phoneNumber', '+1 315-555-0234'),
(325, 7917, 'description', 'A fine chinese restaurant'),
(326, 7917, 'restaurantAddress', 'Beverly Center'),
(327, 7917, 'phoneNumber', '+1 315-555-0234'),
(328, 7917, 'description', 'A fine chinese restaurant'),
(329, 7917, 'restaurantAddress', 'Beverly Center'),
(330, 7917, 'phoneNumber', '+1 315-555-0234'),
(331, 7917, 'description', 'A fine chinese restaurant'),
(332, 7917, 'restaurantAddress', 'Beverly Center'),
(333, 7917, 'phoneNumber', '+1 315-555-0234'),
(334, 7917, 'description', 'A fine chinese restaurant'),
(361, 3805, 'restaurantName', 'Asian Woks'),
(362, 3805, 'restaurantAddress', '121badfgsdg'),
(363, 3805, 'phoneNumber', '+1 217-555-0198'),
(364, 3805, 'description', 'gasfggdfgsfdg'),
(365, 3805, 'image', 'uploads/1728557471458.jpg'),
(366, 3805, 'restaurantAddress', '121badfgsdg'),
(367, 3805, 'phoneNumber', '+1 217-555-0198'),
(368, 3805, 'description', 'gasfggdfgsfdg'),
(369, 3805, 'image', 'uploads/1728557483864.jpg'),
(370, 3805, 'restaurantAddress', '121badfgsdg'),
(371, 3805, 'phoneNumber', '+1 217-555-0198'),
(372, 3805, 'description', 'gasfggdfgsfdg'),
(373, 3805, 'image', 'uploads/1728557492247.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `tables`
--

CREATE TABLE `tables` (
  `TableID` int(11) NOT NULL,
  `RestaurantID` int(11) DEFAULT NULL,
  `QRCode` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tables`
--

INSERT INTO `tables` (`TableID`, `RestaurantID`, `QRCode`) VALUES
(33, 41, 'QR7758'),
(34, 41, 'QR5706'),
(36, 41, 'QR2159'),
(37, 41, 'QR5548'),
(38, 41, 'QR2501'),
(45, 9404, 'QR7910'),
(46, 9404, 'QR9952'),
(51, 9404, 'QR3663'),
(52, 9404, 'QR9670'),
(58, 9404, 'QR3445'),
(61, 9404, 'QR5186'),
(62, 9404, 'QR7848'),
(63, 9404, 'QR2497'),
(67, 41, 'QR5985'),
(68, 41, 'QR2656'),
(69, 41, 'QR8742'),
(70, 3468, 'QR5117'),
(71, 3468, 'QR8362'),
(72, 1853, 'QR6853'),
(73, 1853, 'QR7416'),
(74, 7675, 'QR2204'),
(75, 19, 'QR9576'),
(76, 22, 'QR7228'),
(77, 23, 'QR5675'),
(78, 23, 'QR1704'),
(79, 6270, 'QR3346'),
(80, 6270, 'QR7173'),
(81, 6270, 'QR6349'),
(82, 6270, 'QR4970'),
(83, 8569, 'QR2882'),
(85, 8569, 'QR4065'),
(86, 8569, 'QR8348'),
(87, 5138, 'QR9466'),
(88, 5138, 'QR5603'),
(89, 5138, 'QR2514'),
(94, 5138, 'QR9676'),
(96, 5138, 'QR7651');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `billingaddress`
--
ALTER TABLE `billingaddress`
  ADD PRIMARY KEY (`BillingID`),
  ADD KEY `fk_customer` (`CustomerID`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`CategoryID`),
  ADD KEY `fk_restaurant` (`RestaurantID`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`CustomerID`),
  ADD KEY `RestaurantID` (`RestaurantID`);

--
-- Indexes for table `menus`
--
ALTER TABLE `menus`
  ADD PRIMARY KEY (`MenuID`),
  ADD KEY `RestaurantID` (`RestaurantID`),
  ADD KEY `fk_category` (`CategoryID`);

--
-- Indexes for table `orderdetails`
--
ALTER TABLE `orderdetails`
  ADD PRIMARY KEY (`OrderDetailID`),
  ADD KEY `OrderID` (`OrderID`),
  ADD KEY `MenuID` (`MenuID`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`OrderID`),
  ADD KEY `RestaurantID` (`RestaurantID`),
  ADD KEY `CustomerID` (`CustomerID`),
  ADD KEY `fk_constraint_name` (`TableID`);

--
-- Indexes for table `paymentoptionsavailable`
--
ALTER TABLE `paymentoptionsavailable`
  ADD PRIMARY KEY (`PaymentOptionsID`),
  ADD KEY `RestaurantID` (`RestaurantID`),
  ADD KEY `PaymentTypeID` (`PaymentTypeID`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`PaymentID`),
  ADD KEY `OrderID` (`OrderID`);

--
-- Indexes for table `paymenttype`
--
ALTER TABLE `paymenttype`
  ADD PRIMARY KEY (`PaymentTypeID`);

--
-- Indexes for table `people`
--
ALTER TABLE `people`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `FK_TableID` (`TableID`),
  ADD KEY `FK_RestaurantID` (`RestaurantID`);

--
-- Indexes for table `restaurantadmins`
--
ALTER TABLE `restaurantadmins`
  ADD PRIMARY KEY (`ID`) USING BTREE;

--
-- Indexes for table `restaurants`
--
ALTER TABLE `restaurants`
  ADD PRIMARY KEY (`RestaurantID`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`ReviewID`),
  ADD KEY `RestaurantID` (`RestaurantID`),
  ADD KEY `MenuID` (`MenuID`),
  ADD KEY `OrderID` (`OrderID`),
  ADD KEY `CustomerID` (`CustomerID`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`SettingID`),
  ADD KEY `RestaurantID` (`RestaurantID`);

--
-- Indexes for table `tables`
--
ALTER TABLE `tables`
  ADD PRIMARY KEY (`TableID`),
  ADD UNIQUE KEY `QRCode` (`QRCode`),
  ADD KEY `RestaurantID` (`RestaurantID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `billingaddress`
--
ALTER TABLE `billingaddress`
  MODIFY `BillingID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `CategoryID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=74;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `CustomerID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `menus`
--
ALTER TABLE `menus`
  MODIFY `MenuID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=107;

--
-- AUTO_INCREMENT for table `orderdetails`
--
ALTER TABLE `orderdetails`
  MODIFY `OrderDetailID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=111;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `OrderID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=274;

--
-- AUTO_INCREMENT for table `paymentoptionsavailable`
--
ALTER TABLE `paymentoptionsavailable`
  MODIFY `PaymentOptionsID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `PaymentID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `paymenttype`
--
ALTER TABLE `paymenttype`
  MODIFY `PaymentTypeID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `people`
--
ALTER TABLE `people`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=96;

--
-- AUTO_INCREMENT for table `restaurantadmins`
--
ALTER TABLE `restaurantadmins`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=77;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `ReviewID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
  MODIFY `SettingID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=374;

--
-- AUTO_INCREMENT for table `tables`
--
ALTER TABLE `tables`
  MODIFY `TableID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=97;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `billingaddress`
--
ALTER TABLE `billingaddress`
  ADD CONSTRAINT `fk_customer` FOREIGN KEY (`CustomerID`) REFERENCES `customers` (`CustomerID`);

--
-- Constraints for table `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `fk_restaurant` FOREIGN KEY (`RestaurantID`) REFERENCES `restaurants` (`RestaurantID`);

--
-- Constraints for table `customers`
--
ALTER TABLE `customers`
  ADD CONSTRAINT `customers_ibfk_1` FOREIGN KEY (`RestaurantID`) REFERENCES `restaurants` (`RestaurantID`);

--
-- Constraints for table `menus`
--
ALTER TABLE `menus`
  ADD CONSTRAINT `fk_category` FOREIGN KEY (`CategoryID`) REFERENCES `categories` (`CategoryID`),
  ADD CONSTRAINT `menus_ibfk_1` FOREIGN KEY (`RestaurantID`) REFERENCES `restaurants` (`RestaurantID`);

--
-- Constraints for table `orderdetails`
--
ALTER TABLE `orderdetails`
  ADD CONSTRAINT `orderdetails_ibfk_1` FOREIGN KEY (`OrderID`) REFERENCES `orders` (`OrderID`),
  ADD CONSTRAINT `orderdetails_ibfk_2` FOREIGN KEY (`MenuID`) REFERENCES `menus` (`MenuID`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `fk_constraint_name` FOREIGN KEY (`TableID`) REFERENCES `tables` (`TableID`),
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`RestaurantID`) REFERENCES `restaurants` (`RestaurantID`),
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`CustomerID`) REFERENCES `customers` (`CustomerID`);

--
-- Constraints for table `paymentoptionsavailable`
--
ALTER TABLE `paymentoptionsavailable`
  ADD CONSTRAINT `paymentoptionsavailable_ibfk_1` FOREIGN KEY (`RestaurantID`) REFERENCES `restaurants` (`RestaurantID`),
  ADD CONSTRAINT `paymentoptionsavailable_ibfk_2` FOREIGN KEY (`PaymentTypeID`) REFERENCES `paymenttype` (`PaymentTypeID`);

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`OrderID`) REFERENCES `orders` (`OrderID`);

--
-- Constraints for table `people`
--
ALTER TABLE `people`
  ADD CONSTRAINT `FK_RestaurantID` FOREIGN KEY (`RestaurantID`) REFERENCES `restaurants` (`RestaurantID`),
  ADD CONSTRAINT `FK_TableID` FOREIGN KEY (`TableID`) REFERENCES `tables` (`TableID`);

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`RestaurantID`) REFERENCES `restaurants` (`RestaurantID`),
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`MenuID`) REFERENCES `menus` (`MenuID`),
  ADD CONSTRAINT `reviews_ibfk_3` FOREIGN KEY (`OrderID`) REFERENCES `orders` (`OrderID`),
  ADD CONSTRAINT `reviews_ibfk_4` FOREIGN KEY (`CustomerID`) REFERENCES `customers` (`CustomerID`);

--
-- Constraints for table `settings`
--
ALTER TABLE `settings`
  ADD CONSTRAINT `settings_ibfk_1` FOREIGN KEY (`RestaurantID`) REFERENCES `restaurants` (`RestaurantID`);

--
-- Constraints for table `tables`
--
ALTER TABLE `tables`
  ADD CONSTRAINT `tables_ibfk_1` FOREIGN KEY (`RestaurantID`) REFERENCES `restaurants` (`RestaurantID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
