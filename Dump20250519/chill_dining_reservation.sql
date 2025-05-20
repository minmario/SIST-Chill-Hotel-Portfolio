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
-- Table structure for table `dining_reservation`
--

DROP TABLE IF EXISTS `dining_reservation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dining_reservation` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `reservation_num` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `restaurant_id` bigint NOT NULL,
  `reservation_date` date NOT NULL,
  `meal_time` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reservation_time` time(6) NOT NULL,
  `adults` int DEFAULT NULL,
  `children` int DEFAULT NULL,
  `first_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `request` varchar(300) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `restaurant_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `reservation_num` (`reservation_num`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dining_reservation`
--

LOCK TABLES `dining_reservation` WRITE;
/*!40000 ALTER TABLE `dining_reservation` DISABLE KEYS */;
INSERT INTO `dining_reservation` VALUES (1,'79E1C759',1,'2025-04-23','DINNER','19:00:00.000000',2,0,'민수','김','010-1233-1321','kim123@naver.com','창가자리로 부탁합니다.','CANCELLED','2025-04-23 16:08:28','2025-04-28 07:38:49',NULL),(2,'C44FE6D1',1,'2025-04-23','DINNER','19:00:00.000000',2,2,'재석','유','010-1231-1555','youj000@naver.com','견과류 알러지 있음','PENDING','2025-04-23 16:10:17','2025-04-23 16:10:17',NULL),(3,'8263B022',1,'2025-04-23','DINNER','18:30:00.000000',2,0,'do','lee','01012341551','leedoo@naver.com','test','PENDING','2025-04-23 16:12:43','2025-04-23 16:12:43',NULL),(4,'8B41E36A',1,'2025-04-23','LUNCH','13:00:00.000000',2,2,'현수','박','010-1231-1412','park111@naver.com','조용한 자리로 부탁합니다','CANCELLED','2025-04-23 18:12:32','2025-04-23 18:13:18',NULL),(5,'78DC4AFE',1,'2025-04-24','LUNCH','12:00:00.000000',2,2,'철수','김','010-1324-1241','kimcs@naver.com','조용한 자리로 부탁합니다','PENDING','2025-04-24 19:46:12','2025-04-27 07:50:07',NULL),(6,'F3972866',1,'2025-04-25','LUNCH','12:00:00.000000',2,1,'1','1','010-1231-1412','test123@naver.com','dfdsaf','PENDING','2025-04-25 09:35:48','2025-04-25 09:37:17',NULL),(7,'6D7BAB00',1,'2025-04-28','LUNCH','12:00:00.000000',2,0,'민수','라','010-1231-1234','laminsu@naver.com','테스트입니다','CANCELLED','2025-04-27 03:33:44','2025-04-27 06:49:16',NULL),(8,'3884BB19',1,'2025-04-27','LUNCH','12:00:00.000000',2,2,'이','대호','010-1111-1111','daeho@naver.com','알레르기 조심','PENDING','2025-04-27 07:30:04','2025-04-27 07:52:28',NULL),(9,'18D76CB2',1,'2025-04-28','LUNCH','12:00:00.000000',2,2,'김','민수','010-1111-1111','kim123@naver.com','테스트','CANCELLED','2025-04-27 18:11:52','2025-04-27 18:12:05',NULL),(10,'58ADF89E',1,'2025-04-28','LUNCH','12:30:00.000000',2,0,'김','첨지','01033332222','vldhtmxk@naver.com','안되나요','PENDING','2025-04-27 18:39:09','2025-04-27 18:39:09',NULL),(11,'44D2CFB7',2,'2025-04-27','DINNER','18:00:00.000000',2,3,'테','스트','010-1111-1111','test11@naver.com','test','PENDING','2025-04-27 19:32:09','2025-04-27 19:33:54',NULL),(12,'F1343C41',1,'2025-04-28','LUNCH','13:00:00.000000',2,2,'그','로','010-1111-1111','log@naver.com','test','PENDING','2025-04-28 00:18:31','2025-04-28 00:18:31',NULL),(13,'1115E19F',3,'2025-04-28','LUNCH','14:30:00.000000',2,0,'1','1','1','1@naver.cpm','dfasd','PENDING','2025-04-28 01:13:54','2025-04-28 01:13:54',NULL),(14,'A2F397BB',1,'2025-04-30','LUNCH','12:00:00.000000',2,0,'개','똥','01023902122','inuyasha@gmail.com','그냥','PENDING','2025-04-28 12:05:43','2025-04-28 12:05:43',NULL),(15,'BD7133BD',2,'2025-04-28','LUNCH','13:00:00.000000',2,0,'1','1','1','dfsa@naver.com','1','CANCELLED','2025-04-28 15:24:16','2025-04-28 07:38:31',NULL),(16,'A949CC1E',3,'2025-05-05','LUNCH','12:30:00.000000',2,0,'1','1','1','1@naver.com','dfd','CONFIRMED','2025-05-05 11:32:42','2025-05-05 16:44:54',NULL);
/*!40000 ALTER TABLE `dining_reservation` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-19 23:56:28
