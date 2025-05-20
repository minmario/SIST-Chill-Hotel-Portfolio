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
  `total_count` int DEFAULT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_types`
--

LOCK TABLES `room_types` WRITE;
/*!40000 ALTER TABLE `room_types` DISABLE KEYS */;
INSERT INTO `room_types` VALUES (2,130000.00,150000.00,28,10,90000.00,110000.00,'2025-04-16 08:29:00.000000',1,'2025-04-16 08:29:00.000000','Comfort','City View','Chill Comfort','기본적인 휴식에 적합한 아늑한 객실입니다.','/images/rooms/comfort/comfort1.png'),(3,160000.00,180000.00,32,8,120000.00,140000.00,'2025-04-16 08:29:00.000000',2,'2025-04-16 08:29:00.000000','Comfort+','Garden View','Chill Harmony','차분한 인테리어로 심신의 조화를 느낄 수 있는 객실입니다.','/images/rooms/harmony/harmony1.png'),(4,220000.00,250000.00,36,6,160000.00,190000.00,'2025-04-16 08:29:00.000000',3,'2025-04-16 08:29:00.000000','Deluxe','Ocean View','Chill Serenity','조용하고 넓은 공간에서 여유로운 휴식을 취할 수 있는 객실입니다.','/images/rooms/serenity/serenity1.png'),(5,260000.00,300000.00,42,5,190000.00,220000.00,'2025-04-16 08:29:00.000000',4,'2025-04-16 08:29:00.000000','Family','Mountain View','Chill Family','가족 단위 고객을 위한 넓은 객실로 아이도 편안한 휴식을 즐길 수 있습니다.','/images/rooms/family/family1.png'),(5,320000.00,360000.00,48,4,240000.00,280000.00,'2025-04-16 08:29:00.000000',5,'2025-04-16 08:29:00.000000','Suite','Lake View','Chill Lake','호숫가 전망과 고급 인테리어가 매력적인 객실입니다.','/images/rooms/lake/lake1.png'),(6,450000.00,500000.00,55,2,350000.00,400000.00,'2025-04-16 08:29:00.000000',6,'2025-04-16 08:29:00.000000','Premium Suite','Panoramic View','Ultimate Chill Suite','궁극의 휴식과 럭셔리를 모두 담은 최상급 객실입니다.','/images/rooms/ultimate/ultimate1.png');
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

-- Dump completed on 2025-05-19 23:56:31
