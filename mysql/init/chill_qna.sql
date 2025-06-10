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
-- Table structure for table `qna`
--

DROP TABLE IF EXISTS `qna`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `qna` (
  `answer_date` datetime(6) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `qna_idx` bigint NOT NULL AUTO_INCREMENT,
  `updated_at` datetime(6) DEFAULT NULL,
  `write_date` datetime(6) NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `answer` text COLLATE utf8mb4_unicode_ci,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'PENDING',
  PRIMARY KEY (`qna_idx`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `qna`
--

LOCK TABLES `qna` WRITE;
/*!40000 ALTER TABLE `qna` DISABLE KEYS */;
INSERT INTO `qna` VALUES ('2025-04-27 07:57:56.809821','2025-04-24 18:15:40.048536',3,'2025-04-24 18:15:40.048536','2025-04-24 18:15:40.048536','reservation','ㅇㄻㄴㅇ','이메일 테스트','fprhelwkdlsj@naver.com','이메일 발송 문의 테스트','ANSWERED'),('2025-04-24 20:44:59.946432','2025-04-24 20:44:40.561451',4,'2025-04-24 20:44:40.561451','2025-04-24 20:44:40.561451','dining','상태 변경 짠','db 업데이트 테스트','fprhelwkdlsj@naver.com','라 테라스 예약 문의 드립니다.','ANSWERED'),('2025-04-25 09:55:14.202504','2025-04-25 09:37:46.536008',5,'2025-04-25 09:37:46.536008','2025-04-25 09:37:46.536008','reservation','다시 테스트22','e','fprhelwkdlsj@naver.com','e','ANSWERED'),('2025-04-25 09:54:25.576838','2025-04-25 09:51:20.879320',6,'2025-04-25 09:51:20.879320','2025-04-25 09:51:20.879320','facility','이메일 발송 테스트','테스트 발송','fprhelwkdlsj@naver.com','테스트입니다','ANSWERED'),('2025-04-25 15:27:50.107580','2025-04-25 15:10:06.951320',7,'2025-04-25 15:10:06.951320','2025-04-25 15:10:06.951320','others','answer test','정확한 위치를 알고 싶어요','fprhelwkdlsj@naver.com','기타 문의','ANSWERED'),('2025-04-25 15:31:23.767418','2025-04-25 15:30:50.457648',8,'2025-04-25 15:30:50.457648','2025-04-25 15:30:50.457648','dining','네 한 예약 당 총 5명까지 제한되어 있습니다. 감사합니다.','한 예약에 인원 제한이 있나요?','park594663@gmail.com','테스트2','ANSWERED'),('2025-04-25 15:35:20.129792','2025-04-25 15:34:45.716176',9,'2025-04-25 15:34:45.716176','2025-04-25 15:34:45.716176','event','이벤트는 매달 마지막 주 주말까지 진행됩니다. 감사합니다.','이벤트 기간 언제까지 인가요?','park5946@daum.net','이벤트 기간 문의드립니다.','ANSWERED'),('2025-04-25 15:37:07.210041','2025-04-25 15:36:57.580818',10,'2025-04-25 15:36:57.580818','2025-04-25 15:36:57.580818','reservation','네답','네테2','fprhelwkdlsj@naver.com','네이버테스트','ANSWERED'),('2025-04-25 15:44:29.489473','2025-04-25 15:44:15.796659',11,'2025-04-25 15:44:15.796659','2025-04-25 15:44:15.796659','facility','스팸 처리 테스트용 답변','스팸 처리 테스트용','park594663@gmail.com','스팸 처리 테스트','ANSWERED'),('2025-04-28 08:24:03.871647','2025-04-27 18:12:42.060769',12,'2025-04-27 18:12:42.060769','2025-04-27 18:12:42.060769','dining','테스트 답변입니다','테스트입니다.','fprhelwkdlsj@naver.com','테스트','ANSWERED'),('2025-04-28 07:33:57.865463','2025-04-27 19:32:55.750896',13,'2025-04-27 19:32:55.750896','2025-04-27 19:32:55.750896','dining','test','1','fprhelwkdlsj@naver.com','1','ANSWERED'),(NULL,'2025-04-28 11:13:15.441485',14,'2025-04-28 11:13:15.441485','2025-04-28 11:13:15.441485','reservation',NULL,'3번 이름 부르고 무시하면 빠따들고 찾아감','inuyasha@gmail.com','퉁퉁퉁퉁퉁퉁퉁퉁퉁사후르','PENDING'),(NULL,'2025-04-28 05:42:48.014694',15,'2025-04-28 05:42:48.014698','2025-04-28 05:42:48.014677','reservation',NULL,'fg','a@a.com','d','PENDING'),(NULL,'2025-04-28 07:39:52.572969',16,'2025-04-28 07:39:52.572974','2025-04-28 07:39:52.572952','reservation',NULL,'1','fprhelwkdlsj@naver.com','1','PENDING');
/*!40000 ALTER TABLE `qna` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-19 23:56:30
