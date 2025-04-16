-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: ted19horse.mysql.database.azure.com    Database: chill
-- ------------------------------------------------------
-- Server version	8.0.40-azure

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `reservation`
--

DROP TABLE IF EXISTS `reservation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservation` (
  `reservation_idx` bigint NOT NULL AUTO_INCREMENT,
  `room_idx` bigint NOT NULL,
  `user_idx` bigint DEFAULT NULL,
  `room_types_idx` bigint NOT NULL,
  `children` int DEFAULT NULL,
  `check_in` date NOT NULL,
  `check_out` date NOT NULL,
  `adults` int NOT NULL,
  `total` int NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `reservation_num` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `special_request` text COLLATE utf8mb4_unicode_ci,
  `status` enum('CANCELLED','COMPLETED','CONFIRMED') COLLATE utf8mb4_unicode_ci NOT NULL,
  `card_number` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `card_expiry` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_name` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `room_count` int DEFAULT NULL,
  `room_price` int DEFAULT NULL,
  `adult_breakfast_price` int DEFAULT NULL,
  `child_break_price` int DEFAULT NULL,
  `subtotal` int DEFAULT NULL,
  `discount` int DEFAULT NULL,
  `adults_breakfast` int DEFAULT NULL,
  `children_breakfast` int DEFAULT NULL,
  `check_in_date` date NOT NULL,
  `check_out_date` date NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `bed_type` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`reservation_idx`),
  UNIQUE KEY `UKcycbm5p8nrsmsji6isq4a2pgh` (`reservation_num`),
  KEY `FKrsoc4phcje2yk5telym4fslrl` (`room_idx`),
  KEY `FKroomtypes_idx` (`room_types_idx`),
  KEY `FKuser` (`user_idx`),
  KEY `FKrm0mrl7lqmvmylpmgtivm9j0o` (`bed_type`),
  CONSTRAINT `FKroomType` FOREIGN KEY (`room_types_idx`) REFERENCES `room_types` (`room_types_idx`),
  CONSTRAINT `FKrsoc4phcje2yk5telym4fslrl` FOREIGN KEY (`room_idx`) REFERENCES `rooms` (`room_idx`),
  CONSTRAINT `FKuser` FOREIGN KEY (`user_idx`) REFERENCES `users` (`user_idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservation`
--

LOCK TABLES `reservation` WRITE;
/*!40000 ALTER TABLE `reservation` DISABLE KEYS */;
/*!40000 ALTER TABLE `reservation` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-10  9:13:21
