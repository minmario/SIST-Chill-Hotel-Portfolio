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
-- Table structure for table `dining_menu`
--

DROP TABLE IF EXISTS `dining_menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dining_menu` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `restaurant_id` bigint NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `price` int DEFAULT NULL,
  `category` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '메뉴 미리보기 이미지 URL',
  PRIMARY KEY (`id`),
  KEY `fk_dining_menu_restaurant` (`restaurant_id`),
  CONSTRAINT `fk_dining_menu_restaurant` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`restaurants_idx`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dining_menu`
--

LOCK TABLES `dining_menu` WRITE;
/*!40000 ALTER TABLE `dining_menu` DISABLE KEYS */;
INSERT INTO `dining_menu` VALUES (1,1,'샐러드 바','신선한 채소와 다양한 드레싱이 준비된 셀프 샐러드 코너입니다.',NULL,'메인','2025-04-23 08:10:40','2025-04-23 08:47:51','https://images.unsplash.com/photo-1660120447916-123439b05c40?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8JUVCJUI3JTk0JUVEJThFJTk4fGVufDB8fDB8fHww'),(2,1,'디저트 플래터','케이크, 과일, 마카롱 등 달콤한 디저트를 즐기세요.',NULL,'사이드','2025-04-23 08:10:40','2025-04-23 08:50:34','https://images.unsplash.com/photo-1474045326708-cdc78c2487cb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDh8fCVFQiU5NCU5NCVFQyVBMCU4MCVFRCU4QSVCOHxlbnwwfHwwfHx8MA%3D%3D'),(3,2,'스테이크 세트','프리미엄 소고기를 사용한 정통 스테이크와 사이드 메뉴 제공.',NULL,'메인','2025-04-23 08:10:40','2025-04-27 13:45:54','https://images.unsplash.com/photo-1583953623787-ada99d338235?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fCVFQyU4QSVBNCVFRCU4NSU4QyVFQyU5RCVCNCVFRCU4MSVBQ3xlbnwwfHwwfHx8MA%3D%3D'),(4,2,'하우스 와인','레드 및 화이트 와인으로 구성된 엄선된 와인 리스트.',NULL,'주류','2025-04-23 08:10:40','2025-04-27 13:46:24','https://plus.unsplash.com/premium_photo-1674852175694-008fc8f96d23?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8d2luZXxlbnwwfHwwfHx8MA%3D%3D'),(5,3,'모둠 사시미','신선한 참치, 연어, 광어가 포함된 셰프 추천 사시미 세트입니다.',NULL,'메인','2025-04-23 08:10:40','2025-04-27 13:42:50','https://images.unsplash.com/photo-1638866381709-071747b518c8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8JUVDJTgyJUFDJUVDJThCJTlDJUVCJUFGJUI4fGVufDB8fDB8fHww'),(6,3,'스시 플래터','정통 니기리 스시와 롤 스시가 조화를 이루는 프리미엄 세트.',NULL,'메인','2025-04-23 08:10:40','2025-04-27 13:43:21','https://images.unsplash.com/photo-1676037150408-4b59a542fa7c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8JUVDJThBJUE0JUVDJThCJTlDJTIwJUVEJTk0JThDJUVCJUEwJTg4JUVEJTg0JUIwfGVufDB8fDB8fHww'),(7,3,'소바 정식','담백한 메밀 소바와 계절 반찬이 함께 제공되는 일식 정식.',NULL,'메인','2025-04-23 08:10:40','2025-04-27 13:45:18','https://media.istockphoto.com/id/1219958453/ko/%EC%82%AC%EC%A7%84/%ED%8A%80%EA%B9%80-%EC%86%8C%EB%B0%94.webp?a=1&b=1&s=612x612&w=0&k=20&c=1w1eWNF22fJBXLm5O5GkxNKm9vkxqo0sBvp95LiBEVI='),(8,6,'탕수육','겉은 바삭 속은 촉촉한 대표적인 중식 요리입니다.',NULL,'메인','2025-04-23 08:24:47','2025-04-27 13:48:19','https://media.istockphoto.com/id/2203168179/ko/%EC%82%AC%EC%A7%84/tangsuyuk-a-korean-chinese-dish-featuring-crispy-deep-fried-pork-or-beef-pieces-served-with-a.webp?a=1&b=1&s=612x612&w=0&k=20&c=tni30LDKup4lqzaeTzBDDfyTd2HpQPcJre_ZnDbQzLM='),(9,6,'양장피','다양한 해산물과 채소가 어우러진 냉채 요리입니다.',NULL,'사이드','2025-04-23 08:24:47','2025-04-27 13:49:19','https://homecuisine.co.kr/files/attach/images/142/777/001/3e039ba9f54df6ab52e6fc377b21a8e9.JPG'),(10,6,'자스민차','향긋한 꽃향의 중국차입니다.',NULL,'음료','2025-04-23 08:24:47','2025-04-27 13:49:53','https://plus.unsplash.com/premium_photo-1731696604052-d0c8527e7831?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8amFzbWluZSUyMHRlYXxlbnwwfHwwfHx8MA%3D%3D'),(11,5,'크루아상','바삭하고 부드러운 프랑스식 크루아상입니다.',NULL,'사이드','2025-04-23 08:34:12','2025-04-27 13:49:53','https://plus.unsplash.com/premium_photo-1670333242784-46b220ef90a2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8Y3JvaXNzYW50fGVufDB8fDB8fHww'),(12,5,'카페라떼','부드러운 라떼와 우유 거품의 조화.',NULL,'음료','2025-04-23 08:34:12','2025-04-27 13:50:26','https://plus.unsplash.com/premium_photo-1664970900098-2676029e6a99?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGxhdHRlfGVufDB8fDB8fHww'),(13,5,'에스프레소','진한 커피의 풍미를 즐기세요.',NULL,'음료','2025-04-23 08:34:12','2025-04-27 13:50:26','https://plus.unsplash.com/premium_photo-1669687924558-386bff1a0469?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8ZXNzcHJlc3NvfGVufDB8fDB8fHww'),(14,4,'티본 스테이크','최고급 숙성 티본 스테이크를 제공합니다.',NULL,'메인','2025-04-23 08:34:15','2025-04-27 13:47:18','https://images.unsplash.com/photo-1598577789978-b87168a57b69?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzF8fCVFRCU4QiVCMCVFQiVCMyVCOCUyMCVFQyU4QSVBNCVFRCU4NSU4QyVFQyU5RCVCNCVFRCU4MSVBQ3xlbnwwfHwwfHx8MA%3D%3D'),(15,4,'감자 퓌레','부드러운 감자로 만든 클래식 스테이크 사이드.',NULL,'사이드','2025-04-23 08:34:15','2025-04-27 13:51:08','https://images.unsplash.com/photo-1726514733355-02fe48ae6795?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fG1hc2hlZHBvdGF0b3xlbnwwfHwwfHx8MA%3D%3D'),(16,4,'샤르도네','고급 화이트 와인입니다.',NULL,'주류','2025-04-23 08:34:15','2025-04-27 13:51:08','https://images.unsplash.com/photo-1599113656124-b96bf21e30d3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2hhcmRvbm5heXxlbnwwfHwwfHx8MA%3D%3D'),(17,1,'콜라','톡 쏘는 탄산이 매력적인 대표적인 음료입니다.',NULL,'음료','2025-04-23 08:36:01','2025-04-23 08:44:38','https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20240206_285%2F1707181984901QafW1_JPEG%2F108317768612477847_1592198695.jpg&type=a340'),(18,1,'사이다','깔끔한 청량감을 자랑하는 탄산음료입니다.',NULL,'음료','2025-04-23 08:36:01','2025-04-23 08:46:26','https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20210125_98%2F1611545510456Gv9aG_JPEG%2F12681353165490770_11384160.jpg&type=a340'),(19,1,'제로콜라','당분은 낮추고 맛은 그대로인 제로 탄산음료입니다.',NULL,'음료','2025-04-23 08:36:01','2025-04-23 08:37:42','https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/10/0000/0018/B00000018730519ko.jpg?qt=80'),(20,2,'콜라','톡 쏘는 탄산이 매력적인 대표적인 음료입니다.',NULL,'음료','2025-04-23 08:36:01','2025-04-23 08:44:38','https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20240206_285%2F1707181984901QafW1_JPEG%2F108317768612477847_1592198695.jpg&type=a340'),(21,2,'사이다','깔끔한 청량감을 자랑하는 탄산음료입니다.',NULL,'음료','2025-04-23 08:36:01','2025-04-23 08:46:26','https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20210125_98%2F1611545510456Gv9aG_JPEG%2F12681353165490770_11384160.jpg&type=a340'),(22,2,'제로콜라','당분은 낮추고 맛은 그대로인 제로 탄산음료입니다.',NULL,'음료','2025-04-23 08:36:01','2025-04-23 08:37:42','https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/10/0000/0018/B00000018730519ko.jpg?qt=80'),(23,3,'콜라','톡 쏘는 탄산이 매력적인 대표적인 음료입니다.',NULL,'음료','2025-04-23 08:36:01','2025-04-23 08:44:38','https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20240206_285%2F1707181984901QafW1_JPEG%2F108317768612477847_1592198695.jpg&type=a340'),(24,3,'사이다','깔끔한 청량감을 자랑하는 탄산음료입니다.',NULL,'음료','2025-04-23 08:36:01','2025-04-23 08:46:26','https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20210125_98%2F1611545510456Gv9aG_JPEG%2F12681353165490770_11384160.jpg&type=a340'),(25,3,'제로콜라','당분은 낮추고 맛은 그대로인 제로 탄산음료입니다.',NULL,'음료','2025-04-23 08:36:01','2025-04-23 08:37:42','https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/10/0000/0018/B00000018730519ko.jpg?qt=80'),(26,4,'콜라','톡 쏘는 탄산이 매력적인 대표적인 음료입니다.',NULL,'음료','2025-04-23 08:36:01','2025-04-23 08:44:38','https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20240206_285%2F1707181984901QafW1_JPEG%2F108317768612477847_1592198695.jpg&type=a340'),(27,4,'사이다','깔끔한 청량감을 자랑하는 탄산음료입니다.',NULL,'음료','2025-04-23 08:36:01','2025-04-23 08:46:26','https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20210125_98%2F1611545510456Gv9aG_JPEG%2F12681353165490770_11384160.jpg&type=a340'),(28,4,'제로콜라','당분은 낮추고 맛은 그대로인 제로 탄산음료입니다.',NULL,'음료','2025-04-23 08:36:01','2025-04-23 08:37:42','https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/10/0000/0018/B00000018730519ko.jpg?qt=80'),(29,5,'콜라','톡 쏘는 탄산이 매력적인 대표적인 음료입니다.',NULL,'음료','2025-04-23 08:36:01','2025-04-23 08:44:38','https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20240206_285%2F1707181984901QafW1_JPEG%2F108317768612477847_1592198695.jpg&type=a340'),(30,5,'사이다','깔끔한 청량감을 자랑하는 탄산음료입니다.',NULL,'음료','2025-04-23 08:36:01','2025-04-23 08:46:26','https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20210125_98%2F1611545510456Gv9aG_JPEG%2F12681353165490770_11384160.jpg&type=a340'),(31,5,'제로콜라','당분은 낮추고 맛은 그대로인 제로 탄산음료입니다.',NULL,'음료','2025-04-23 08:36:01','2025-04-23 08:37:42','https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/10/0000/0018/B00000018730519ko.jpg?qt=80'),(32,6,'콜라','톡 쏘는 탄산이 매력적인 대표적인 음료입니다.',NULL,'음료','2025-04-23 08:36:01','2025-04-23 08:44:38','https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20240206_285%2F1707181984901QafW1_JPEG%2F108317768612477847_1592198695.jpg&type=a340'),(33,6,'사이다','깔끔한 청량감을 자랑하는 탄산음료입니다.',NULL,'음료','2025-04-23 08:36:01','2025-04-23 08:46:26','https://search.pstatic.net/common/?src=http%3A%2F%2Fshop1.phinf.naver.net%2F20210125_98%2F1611545510456Gv9aG_JPEG%2F12681353165490770_11384160.jpg&type=a340'),(34,6,'제로콜라','당분은 낮추고 맛은 그대로인 제로 탄산음료입니다.',NULL,'음료','2025-04-23 08:36:01','2025-04-23 08:37:42','https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/thumbnails/10/0000/0018/B00000018730519ko.jpg?qt=80');
/*!40000 ALTER TABLE `dining_menu` ENABLE KEYS */;
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
