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
-- Table structure for table `special_offer`
--

DROP TABLE IF EXISTS `special_offer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `special_offer` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subtitle` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `price` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `intro` text COLLATE utf8mb4_unicode_ci,
  `room_idx` bigint NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `room_idx` (`room_idx`),
  CONSTRAINT `special_offer_ibfk_1` FOREIGN KEY (`room_idx`) REFERENCES `room_types` (`room_types_idx`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `special_offer`
--

LOCK TABLES `special_offer` WRITE;
/*!40000 ALTER TABLE `special_offer` DISABLE KEYS */;
INSERT INTO `special_offer` VALUES (1,'스테이케이션 패키지','일상 속 특별한 휴식','https://plus.unsplash.com/premium_photo-1664475924785-7ded40a12945?q=80&w=2610&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D','2025-02-01','2025-11-30','350000','도심 속 완벽한 휴가를 경험하세요.',1,'2025-04-27 12:47:14','2025-04-27 13:15:44'),(2,'허니문 스페셜','로맨틱한 신혼여행','https://images.unsplash.com/photo-1648538923547-074724ca7a18?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cm9tYW50aWMlMjBob25leW1vb258ZW58MHx8MHx8fDA%3D','2025-03-01','2025-10-31','450000','평생 기억에 남을 신혼여행을 위한 특별한 패키지',2,'2025-04-27 12:47:14','2025-04-27 13:17:35'),(3,'위켄드 이스케이프','주말 특별 휴식','https://media.istockphoto.com/id/519867614/ko/%EC%82%AC%EC%A7%84/%EB%B2%A8%EB%AA%AC%ED%8A%B8%EC%97%90-%EC%8B%9C%EA%B0%84.webp?a=1&b=1&s=612x612&w=0&k=20&c=wwTCst9UZc6AgqRopPtjKVasGgH-7QoJpqGR-qwbqGk=','2025-01-01','2025-12-31','580000','즐거움이 가득한 주말 패키지',3,'2025-04-27 12:47:14','2025-04-27 13:23:23'),(4,'가족 패키지','가족 여행 맞춤형','https://plus.unsplash.com/premium_photo-1663091105701-3201658e1c82?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGZhbWlseSUyMHZhY2F0aW9uJTIwaG90ZWx8ZW58MHx8MHx8fDA%3D','2025-05-01','2025-08-31','500000','아이들과 함께하는 가족 여행 패키지',4,'2025-04-27 12:47:14','2025-04-27 13:23:23'),(5,'비즈니스 트래블 패키지','출장자를 위한 맞춤 혜택','https://plus.unsplash.com/premium_photo-1661903986017-673f1bd6b47e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZXhlY3V0aXZlJTIwYnVzaW5lc3MlMjBzdWl0ZXxlbnwwfHwwfHx8MA%3D%3D','2025-01-01','2025-12-31','600000','업무 출장을 편안하게',5,'2025-04-27 12:47:14','2025-04-27 13:26:21'),(6,'시즌 스페셜 - 여름 패키지','무더운 여름을 시원하게','https://images.unsplash.com/photo-1613192195514-6ae0febccc29?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHN1bW1lciUyMHJlc29ydCUyMHBvb2x8ZW58MHx8MHx8fDA%3D','2025-06-01','2025-08-31','780000','여름 한정 특별 패키지',6,'2025-04-27 12:47:14','2025-04-27 13:26:21');
/*!40000 ALTER TABLE `special_offer` ENABLE KEYS */;
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
