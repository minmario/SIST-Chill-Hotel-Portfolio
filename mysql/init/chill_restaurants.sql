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
-- Table structure for table `restaurants`
--

DROP TABLE IF EXISTS `restaurants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `restaurants` (
  `capacity` int NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `restaurants_idx` bigint NOT NULL AUTO_INCREMENT,
  `updated_at` datetime(6) DEFAULT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `breakfast_open` time DEFAULT NULL,
  `breakfast_close` time DEFAULT NULL,
  `lunch_open` time DEFAULT NULL,
  `lunch_close` time DEFAULT NULL,
  `dinner_open` time DEFAULT NULL,
  `dinner_close` time DEFAULT NULL,
  `close` time(6) NOT NULL,
  `open` time(6) NOT NULL,
  `price_adult` int NOT NULL DEFAULT '0',
  `price_child` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`restaurants_idx`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `restaurants`
--

LOCK TABLES `restaurants` WRITE;
/*!40000 ALTER TABLE `restaurants` DISABLE KEYS */;
INSERT INTO `restaurants` VALUES (150,'2025-04-11 12:37:19.000000',1,'2025-04-11 12:37:19.000000','라 테라스','뷔페','신선한 제철 식재료로 준비한 인터내셔널 뷔페 레스토랑. 아침, 점심, 저녁 다양한 요리를 즐기실 수 있습니다.','https://images.unsplash.com/photo-1583338917496-7ea264c374ce?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8JUVCJUI3JTk0JUVEJThFJTk4fGVufDB8fDB8fHww','호텔 1층','06:30:00','10:30:00','12:00:00','14:30:00','18:00:00','22:00:00','00:00:00.000000','00:00:00.000000',95000,55000),(80,'2025-04-11 12:37:19.000000',2,'2025-04-11 12:37:19.000000','아리아','이탈리안','정통 이탈리안 요리를 현대적으로 재해석한 파인 다이닝 레스토랑. 엄선된 와인 리스트와 함께 특별한 식사를 즐겨보세요.','https://images.unsplash.com/photo-1611765083444-a3ce30f1c885?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGl0YWxpYW4lMjByZXN0YXVyYW50fGVufDB8fDB8fHww','호텔 2층',NULL,NULL,'12:00:00','15:00:00','18:00:00','22:00:00','00:00:00.000000','00:00:00.000000',120000,60000),(30,'2025-04-11 12:37:19.000000',3,'2025-04-11 12:37:19.000000','사쿠라','일식','최고급 식재료로 준비한 정통 일식 오마카세. 숙련된 일본 요리사가 선보이는 계절 요리를 카운터에서 직접 즐겨보세요.','https://images.unsplash.com/photo-1512132411229-c30391241dd8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8amFwYW5lc2UlMjByZXN0YXVyYW50fGVufDB8fDB8fHww','호텔 3층',NULL,NULL,'12:00:00','14:30:00','18:00:00','22:00:00','00:00:00.000000','00:00:00.000000',150000,80000),(40,'2025-04-11 12:39:15.000000',4,'2025-04-11 12:39:15.000000','더 그릴','스테이크','프리미엄 스테이크와 와인을 즐길 수 있는 고급 레스토랑입니다. 엄선된 숙성육과 정통 그릴 요리를 선보입니다.','https://images.unsplash.com/photo-1712746785126-e9f28b5b3cc0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3RlYWslMjByZXN0YXVyYW50fGVufDB8fDB8fHww','호텔 4층',NULL,NULL,NULL,NULL,'18:00:00','22:00:00','00:00:00.000000','00:00:00.000000',100000,90000),(20,'2025-04-11 12:39:15.000000',5,'2025-04-11 12:39:15.000000','블루베이커리','카페','향긋한 커피와 매일 구워낸 베이커리를 제공하는 카페. 오전 브런치와 여유로운 오후 디저트를 즐겨보세요.','https://images.unsplash.com/photo-1723071895762-c6c65bceba3e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGJha2VyeSUyMGNhZmV8ZW58MHx8MHx8fDA%3D','호텔 로비','09:00:00','11:30:00',NULL,NULL,NULL,NULL,'00:00:00.000000','00:00:00.000000',25000,18000),(60,'2025-04-11 12:39:15.000000',6,'2025-04-11 12:39:15.000000','샹그릴라 티룸','중식','정통 광동식 요리와 고급 중국차를 즐길 수 있는 프리미엄 중식당. 여유로운 점심과 저녁 코스 운영.','https://images.unsplash.com/photo-1559667709-eabb5b50117a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDR8fGNoaW5lc2UlMjByZXN0YXVyYW50fGVufDB8fDB8fHww','호텔 5층',NULL,NULL,'11:30:00','14:30:00','18:00:00','21:00:00','00:00:00.000000','00:00:00.000000',40000,30000);
/*!40000 ALTER TABLE `restaurants` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-19 23:56:33
