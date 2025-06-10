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
  `room_idx` bigint NOT NULL AUTO_INCREMENT,
  `room_types_idx` bigint NOT NULL,
  `floor` int NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `room_num` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `room_image` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('AVAILABLE','MAINTENANCE','OCCUPIED') COLLATE utf8mb4_unicode_ci NOT NULL,
  `bed_type` enum('Twin','Double','King','Family','Queen') COLLATE utf8mb4_unicode_ci NOT NULL,
  `view` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`room_idx`),
  UNIQUE KEY `UKp5q2pbuavtvgs57smovsb0ou3` (`room_num`),
  KEY `FK8oi3lify3v9lks6aixlih9pvg` (`room_types_idx`),
  CONSTRAINT `FK8oi3lify3v9lks6aixlih9pvg` FOREIGN KEY (`room_types_idx`) REFERENCES `room_types` (`room_types_idx`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
INSERT INTO `rooms` VALUES (1,1,1,'2025-04-16 08:35:44.000000','2025-04-16 08:35:44.000000','101','https://example.com/image/chill-comfort.jpg','AVAILABLE','Double','City View'),(2,1,1,'2025-04-16 08:35:44.000000','2025-04-16 08:35:44.000000','102','https://example.com/image/chill-comfort.jpg','AVAILABLE','Twin','City View'),(3,1,1,'2025-04-16 08:35:44.000000','2025-04-16 08:35:44.000000','103','https://example.com/image/chill-comfort.jpg','AVAILABLE','Double','City View'),(4,1,1,'2025-04-16 08:35:44.000000','2025-04-16 08:35:44.000000','104','https://example.com/image/chill-comfort.jpg','AVAILABLE','Twin','City View'),(5,1,1,'2025-04-16 08:35:44.000000','2025-04-16 08:35:44.000000','105','https://example.com/image/chill-comfort.jpg','AVAILABLE','Double','City View'),(6,1,1,'2025-04-16 08:35:44.000000','2025-04-16 08:35:44.000000','106','https://example.com/image/chill-comfort.jpg','AVAILABLE','Twin','City View'),(7,1,1,'2025-04-16 08:35:44.000000','2025-04-16 08:35:44.000000','107','https://example.com/image/chill-comfort.jpg','AVAILABLE','Double','City View'),(8,1,1,'2025-04-16 08:35:44.000000','2025-04-16 08:35:44.000000','108','https://example.com/image/chill-comfort.jpg','AVAILABLE','Twin','City View'),(9,1,1,'2025-04-16 08:35:44.000000','2025-04-16 08:35:44.000000','109','https://example.com/image/chill-comfort.jpg','AVAILABLE','Double','City View'),(10,1,1,'2025-04-16 08:35:44.000000','2025-04-16 08:35:44.000000','110','https://example.com/image/chill-comfort.jpg','AVAILABLE','Twin','City View'),(11,2,2,'2025-04-16 08:35:44.000000','2025-04-16 08:35:44.000000','201','https://example.com/image/chill-harmony.jpg','AVAILABLE','Double','Garden View'),(12,2,2,'2025-04-16 08:35:44.000000','2025-04-16 08:35:44.000000','202','https://example.com/image/chill-harmony.jpg','AVAILABLE','Twin','Garden View'),(13,2,2,'2025-04-16 08:35:44.000000','2025-04-16 08:35:44.000000','203','https://example.com/image/chill-harmony.jpg','AVAILABLE','Double','Garden View'),(14,2,2,'2025-04-16 08:35:44.000000','2025-04-16 08:35:44.000000','204','https://example.com/image/chill-harmony.jpg','AVAILABLE','Twin','Garden View'),(15,2,2,'2025-04-16 08:35:44.000000','2025-04-16 08:35:44.000000','205','https://example.com/image/chill-harmony.jpg','AVAILABLE','Double','Garden View'),(16,2,2,'2025-04-16 08:35:44.000000','2025-04-16 08:35:44.000000','206','https://example.com/image/chill-harmony.jpg','AVAILABLE','Twin','Garden View'),(17,2,2,'2025-04-16 08:35:44.000000','2025-04-16 08:35:44.000000','207','https://example.com/image/chill-harmony.jpg','AVAILABLE','Double','Garden View'),(18,2,2,'2025-04-16 08:35:44.000000','2025-04-16 08:35:44.000000','208','https://example.com/image/chill-harmony.jpg','AVAILABLE','Twin','Garden View'),(19,3,3,'2025-04-16 08:35:44.000000','2025-04-16 08:35:44.000000','301','https://example.com/image/chill-serenity.jpg','AVAILABLE','Queen','Ocean View'),(20,3,3,'2025-04-16 08:35:44.000000','2025-04-16 08:35:44.000000','302','https://example.com/image/chill-serenity.jpg','AVAILABLE','Twin','Ocean View'),(21,3,3,'2025-04-16 08:35:44.000000','2025-04-16 08:35:44.000000','303','https://example.com/image/chill-serenity.jpg','AVAILABLE','Queen','Ocean View'),(22,3,3,'2025-04-16 08:35:44.000000','2025-04-16 08:35:44.000000','304','https://example.com/image/chill-serenity.jpg','AVAILABLE','Twin','Ocean View'),(23,3,3,'2025-04-16 08:35:44.000000','2025-04-16 08:35:44.000000','305','https://example.com/image/chill-serenity.jpg','AVAILABLE','Queen','Ocean View'),(24,3,3,'2025-04-16 08:35:44.000000','2025-04-16 08:35:44.000000','306','https://example.com/image/chill-serenity.jpg','AVAILABLE','Twin','Ocean View'),(25,4,4,'2025-04-16 08:35:44.000000','2025-04-16 08:35:44.000000','401','https://example.com/image/chill-family.jpg','AVAILABLE','Family','Mountain View'),(26,4,4,'2025-04-16 08:35:44.000000','2025-04-16 08:35:44.000000','402','https://example.com/image/chill-family.jpg','AVAILABLE','Family','Mountain View'),(27,4,4,'2025-04-16 08:35:44.000000','2025-04-16 08:35:44.000000','403','https://example.com/image/chill-family.jpg','AVAILABLE','Family','Mountain View'),(28,4,4,'2025-04-16 08:35:44.000000','2025-04-16 08:35:44.000000','404','https://example.com/image/chill-family.jpg','AVAILABLE','Family','Mountain View'),(29,4,4,'2025-04-16 08:35:44.000000','2025-04-16 08:35:44.000000','405','https://example.com/image/chill-family.jpg','AVAILABLE','Family','Mountain View'),(30,5,5,'2025-04-16 08:35:44.000000','2025-04-16 08:35:44.000000','501','https://example.com/image/chill-lake.jpg','AVAILABLE','King','Lake View'),(31,5,5,'2025-04-16 08:35:44.000000','2025-04-16 08:35:44.000000','502','https://example.com/image/chill-lake.jpg','AVAILABLE','King','Lake View'),(32,5,5,'2025-04-16 08:35:44.000000','2025-04-16 08:35:44.000000','503','https://example.com/image/chill-lake.jpg','AVAILABLE','King','Lake View'),(33,5,5,'2025-04-16 08:35:44.000000','2025-04-16 08:35:44.000000','504','https://example.com/image/chill-lake.jpg','AVAILABLE','King','Lake View'),(34,6,6,'2025-04-16 08:35:44.000000','2025-04-16 08:35:44.000000','601','https://example.com/image/ultimate-chill-suite.jpg','AVAILABLE','King','Panoramic View'),(35,6,6,'2025-04-16 08:35:44.000000','2025-04-16 08:35:44.000000','602','https://example.com/image/ultimate-chill-suite.jpg','AVAILABLE','King','Panoramic View');
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

-- Dump completed on 2025-05-19 23:56:34
