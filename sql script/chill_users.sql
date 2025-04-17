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
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime(6) DEFAULT NULL,
  `user_idx` bigint NOT NULL AUTO_INCREMENT,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pwd` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('ADMIN','STAFF','USER') COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('ACTIVE','BLOCKED','INACTIVE') COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`user_idx`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`),
  UNIQUE KEY `UK6jvqtxgs6xvh0h0t261hurgqo` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('2025-04-09 07:56:04',NULL,1,'0-0-0','관1','a@a','admin','$2a$10$1a2RHB3eEbeBI9Gpu2fYTuto8qJhZj.k2z0RShkLNpKOy14IHa1di','ADMIN','ACTIVE',NULL,NULL),('2025-04-09 07:58:44',NULL,2,'0-0-0','관2','b@b','admin2','$2a$10$KS15p3y2zqu9YbpbxL/4A.6rdpXpxGvmdB7yA/J4yDjJry1C0Hfoi','ADMIN','ACTIVE',NULL,NULL),('2025-04-09 08:17:09',NULL,3,'1-1-1','스1','c@c','staff','$2a$10$lEuEfi3T/wxHW3LfyY1G6OuVKfj7Wy77TXmlJA3B/2pSx3JXOIy7G','STAFF','ACTIVE',NULL,NULL),('2025-04-09 08:17:09',NULL,4,'1-1-1','스2','d@d','staff2','staff1234','STAFF','ACTIVE',NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
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
