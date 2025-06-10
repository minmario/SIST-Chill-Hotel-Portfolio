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
-- Table structure for table `admin_activity_log`
--

DROP TABLE IF EXISTS `admin_activity_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin_activity_log` (
  `log_idx` bigint NOT NULL AUTO_INCREMENT,
  `admin_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `activity_type` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `activity_details` text COLLATE utf8mb4_unicode_ci,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`log_idx`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_activity_log`
--

LOCK TABLES `admin_activity_log` WRITE;
/*!40000 ALTER TABLE `admin_activity_log` DISABLE KEYS */;
INSERT INTO `admin_activity_log` VALUES (1,'testadmin','ADMIN_GIFT_UPDATE','상품 수정: 로그테스트','0:0:0:0:0:0:0:1','2025-04-17 10:46:50'),(2,'testadmin','ADMIN_GIFT_DELETE','상품 삭제: ID=65','0:0:0:0:0:0:0:1','2025-04-17 10:47:07'),(3,'testadmin','ADMIN_GIFT_CREATE','상품 생성: 이미지 테스트','0:0:0:0:0:0:0:1','2025-04-22 12:42:57'),(4,'testadmin','ADMIN_GIFT_UPDATE','상품 수정: 이미지 테스트','0:0:0:0:0:0:0:1','2025-04-23 16:03:55'),(5,'daewoo','ADMIN_GIFT_UPDATE','상품 수정: 이미지 테스트','0:0:0:0:0:0:0:1','2025-04-23 16:06:47'),(6,'daewoo','ADMIN_GIFT_UPDATE','상품 수정: 이미지 테스트','0:0:0:0:0:0:0:1','2025-04-23 16:07:06'),(7,'testadmin','ADMIN_GIFT_UPDATE','상품 수정: 이미지 테스트','0:0:0:0:0:0:0:1','2025-04-23 16:17:52'),(8,'testadmin','ADMIN_GIFT_UPDATE','상품 수정: 이미지 테스트','0:0:0:0:0:0:0:1','2025-04-23 16:19:30'),(9,'testadmin','ADMIN_GIFT_UPDATE','상품 수정: 이미지 테스트','0:0:0:0:0:0:0:1','2025-04-23 16:24:55'),(10,'testadmin','ADMIN_GIFT_CREATE','상품 생성: 이미지 기능 테스트 최종','0:0:0:0:0:0:0:1','2025-04-23 17:31:00'),(11,'anonymousUser','DINING_RESERVATION_UPDATE','다이닝 예약 상태를 [PENDING]로 변경','0:0:0:0:0:0:0:1','2025-04-27 07:52:28'),(12,'anonymousUser','QNA_ANSWER','문의 번호 [3]에 답변 작성 완료','0:0:0:0:0:0:0:1','2025-04-27 07:55:12'),(13,'anonymousUser','QNA_ANSWER','문의 번호 [3]에 답변 작성 완료','0:0:0:0:0:0:0:1','2025-04-27 07:58:01'),(14,'anonymousUser','ADMIN_GIFT_UPDATE','상품 수정: 평온한 순간 아로마 디퓨저 세트','0:0:0:0:0:0:0:1','2025-04-27 17:51:56'),(15,'anonymousUser','ADMIN_GIFT_UPDATE','상품 수정: 숲의 숨결 공기정화 미니 식물','0:0:0:0:0:0:0:1','2025-04-27 17:52:14'),(16,'testadmin','ADMIN_GIFT_UPDATE','상품 수정: 평온한 시간 티 세트','0:0:0:0:0:0:0:1','2025-04-27 17:52:44'),(17,'testadmin','ADMIN_GIFT_UPDATE','상품 수정: 마음의 평화 명상 키트','0:0:0:0:0:0:0:1','2025-04-27 17:53:00'),(18,'testadmin','ADMIN_GIFT_UPDATE','상품 수정: Chill Moment 포토 프레임','0:0:0:0:0:0:0:1','2025-04-27 17:53:08'),(19,'testadmin','ADMIN_GIFT_UPDATE','상품 수정: 간편한 힐링 미니 아로마 세트','0:0:0:0:0:0:0:1','2025-04-27 17:53:50'),(20,'anonymousUser','ADMIN_GIFT_DELETE','상품 삭제: ID=19','0:0:0:0:0:0:0:1','2025-04-27 17:54:37'),(21,'anonymousUser','QNA_ANSWER','문의 번호 [12]에 답변 작성 완료','0:0:0:0:0:0:0:1','2025-04-27 18:14:55'),(22,'testadmin','ADMIN_GIFT_DELETE','상품 삭제: ID=59','0:0:0:0:0:0:0:1','2025-04-27 19:20:14'),(23,'testadmin','ADMIN_GIFT_UPDATE','상품 수정: 포레스트 뷰 가을','0:0:0:0:0:0:0:1','2025-04-27 19:20:34'),(24,'testadmin','ADMIN_GIFT_CREATE','상품 생성: 진짜 최종 CRUD 테스트','0:0:0:0:0:0:0:1','2025-04-27 19:22:02'),(25,'anonymousUser','QNA_ANSWER','문의 번호 [13]에 답변 작성 완료','0:0:0:0:0:0:0:1','2025-04-27 19:33:37'),(26,'anonymousUser','DINING_RESERVATION_UPDATE','다이닝 예약 상태를 [CONFIRMED]로 변경','0:0:0:0:0:0:0:1','2025-04-27 19:33:53'),(27,'anonymousUser','DINING_RESERVATION_UPDATE','다이닝 예약 상태를 [PENDING]로 변경','0:0:0:0:0:0:0:1','2025-04-27 19:33:54'),(28,'anonymousUser','QNA_ANSWER','문의 번호 [13]에 답변 작성 완료','172.18.0.3','2025-04-28 07:34:02'),(29,'admin','ADMIN_GIFT_UPDATE','상품 수정: 진짜 최종 CRUD 테스트123','172.18.0.3','2025-04-28 08:22:52'),(30,'anonymousUser','QNA_ANSWER','문의 번호 [12]에 답변 작성 완료','172.18.0.3','2025-04-28 08:24:08'),(31,'testadmin','ADMIN_GIFT_DELETE','상품 삭제: ID=1','172.18.0.3','2025-05-03 16:24:37'),(32,'testadmin','ADMIN_GIFT_UPDATE','상품 수정: 마음의 평화 명상 키트','172.18.0.3','2025-05-05 05:51:54'),(33,'testadmin','ADMIN_GIFT_UPDATE','상품 수정: Chill Moment 포토 프레임','172.18.0.3','2025-05-05 05:52:17'),(34,'testadmin','ADMIN_GIFT_UPDATE','상품 수정: 간편한 힐링 미니 아로마 세트','172.18.0.3','2025-05-05 05:52:34'),(35,'testadmin','ADMIN_GIFT_UPDATE','상품 수정: 평온한 순간 아로마 디퓨저 세트','172.18.0.3','2025-05-05 05:54:23'),(36,'testadmin','ADMIN_GIFT_UPDATE','상품 수정: Ultimate Chill 목욕 소금 & 입욕제 세트','172.18.0.3','2025-05-05 05:54:44'),(37,'testadmin','ADMIN_GIFT_UPDATE','상품 수정: Chill Night 베개커버 세트','172.18.0.3','2025-05-05 05:55:15'),(38,'testadmin','ADMIN_GIFT_UPDATE','상품 수정: 마음의 평화 명상 키트','172.18.0.3','2025-05-05 05:55:19'),(39,'testadmin','ADMIN_GIFT_UPDATE','상품 수정: 깊은 휴식 수면 키트','172.18.0.3','2025-05-05 05:55:43'),(40,'testadmin','ADMIN_GIFT_UPDATE','상품 수정: 숲의 선물 아로마테라피 오일 세트','172.18.0.3','2025-05-05 05:56:25'),(41,'testadmin','ADMIN_GIFT_UPDATE','상품 수정: 지구를 위한 휴식 친환경 텀블러','172.18.0.3','2025-05-05 05:57:05'),(42,'testadmin','ADMIN_GIFT_UPDATE','상품 수정: 순수한 휴식 유기농 비누 & 샴푸 바','172.18.0.3','2025-05-05 05:58:10'),(43,'testadmin','ADMIN_GIFT_UPDATE','상품 수정: 여행하는 평화 재사용 가능 여행 키트','172.18.0.3','2025-05-05 05:58:41'),(44,'testadmin','ADMIN_GIFT_UPDATE','상품 수정: Chill Tea 시그니처 차 컬렉션','172.18.0.3','2025-05-05 05:59:53'),(45,'testadmin','ADMIN_GIFT_UPDATE','상품 수정: 자연의 달콤함 유기농 꿀 & 잼 세트','172.18.0.3','2025-05-05 06:00:25'),(46,'testadmin','ADMIN_GIFT_UPDATE','상품 수정: 평온한 저녁 와인 셀렉션','172.18.0.3','2025-05-05 06:00:59'),(47,'testadmin','ADMIN_GIFT_UPDATE','상품 수정: 간편한 힐링 미니 아로마 세트','172.18.0.3','2025-05-05 06:01:03'),(48,'testadmin','ADMIN_GIFT_UPDATE','상품 수정: 가족 힐링 타임 보드게임 컬렉션','172.18.0.3','2025-05-05 06:01:22'),(49,'testadmin','ADMIN_GIFT_UPDATE','상품 수정: 럭셔리 힐링 프리미엄 웰빙 박스','172.18.0.3','2025-05-05 06:01:48'),(50,'testadmin','ADMIN_GIFT_UPDATE','상품 수정: 계절의 평온 봄 에디션','172.18.0.3','2025-05-05 06:02:25'),(51,'testadmin','ADMIN_GIFT_UPDATE','상품 수정: Chill Haven 드림 미니어처','172.18.0.3','2025-05-05 06:02:49'),(52,'anonymousUser','DINING_RESERVATION_UPDATE','다이닝 예약 상태를 [CONFIRMED]로 변경','122.37.78.163','2025-05-05 16:44:55');
/*!40000 ALTER TABLE `admin_activity_log` ENABLE KEYS */;
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
