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
-- Table structure for table `room_types`
--

DROP TABLE IF EXISTS `room_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room_types` (
  `max_people` int NOT NULL,
  `peak_week_price` decimal(10,2) NOT NULL,
  `peak_weekend_price` decimal(10,2) NOT NULL,
  `size` int NOT NULL,
  `total_count` int NOT NULL,
  `week_price` decimal(10,2) NOT NULL,
  `weekend_price` decimal(10,2) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `room_types_idx` bigint NOT NULL AUTO_INCREMENT,
  `updated_at` datetime(6) DEFAULT NULL,
  `grade` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `view_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `room_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `room_image` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`room_types_idx`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_types`
--

LOCK TABLES `room_types` WRITE;
/*!40000 ALTER TABLE `room_types` DISABLE KEYS */;
INSERT INTO `room_types` VALUES (4,250000.00,280000.00,35,10,180000.00,220000.00,NULL,1,NULL,'Deluxe','Ocean View','오션 디럭스','넓은 오션뷰와 테라스를 갖춘 디럭스 객실입니다.','https://example.com/image/ocean-deluxe.jpg'),(4,350000.00,400000.00,50,5,250000.00,300000.00,NULL,2,NULL,'Suite','City View','시티 스위트','럭셔리한 인테리어와 도심 야경이 매력적인 스위트룸입니다.','https://example.com/image/city-suite.jpg'),(5,210000.00,240000.00,40,8,160000.00,190000.00,NULL,3,NULL,'Standard','Mountain View','패밀리 트윈','가족 단위 고객을 위한 트윈 베드 구성의 편안한 객실입니다.','https://example.com/image/family-twin.jpg');
/*!40000 ALTER TABLE `room_types` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-10  9:13:18
