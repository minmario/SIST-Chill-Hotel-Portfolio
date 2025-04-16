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
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rooms` (
  `floor` int NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `room_idx` bigint NOT NULL AUTO_INCREMENT,
  `room_types_idx` bigint NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `room_num` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `room_image` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('AVAILABLE','MAINTENANCE','OCCUPIED') COLLATE utf8mb4_unicode_ci NOT NULL,
  `bed_type` enum('TWIN','KING') COLLATE utf8mb4_unicode_ci NOT NULL,
  `view` enum('CITY','MOUNT') COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`room_idx`),
  UNIQUE KEY `UKp5q2pbuavtvgs57smovsb0ou3` (`room_num`),
  KEY `FK8oi3lify3v9lks6aixlih9pvg` (`room_types_idx`),
  CONSTRAINT `FK8oi3lify3v9lks6aixlih9pvg` FOREIGN KEY (`room_types_idx`) REFERENCES `room_types` (`room_types_idx`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
INSERT INTO `rooms` VALUES (10,NULL,1,1,NULL,'101','https://example.com/image/room101.jpg','AVAILABLE','TWIN','CITY'),(20,NULL,2,2,NULL,'203','https://example.com/image/room203.jpg','AVAILABLE','TWIN','CITY'),(30,NULL,3,3,NULL,'305','https://example.com/image/room305.jpg','AVAILABLE','TWIN','CITY');
/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-10  9:13:19
