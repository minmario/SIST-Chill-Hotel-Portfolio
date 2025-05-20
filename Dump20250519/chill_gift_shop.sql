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
-- Table structure for table `gift_shop`
--

DROP TABLE IF EXISTS `gift_shop`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gift_shop` (
  `item_idx` bigint NOT NULL AUTO_INCREMENT,
  `price` decimal(10,2) NOT NULL,
  `stock_quantity` int NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `category` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `item_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`item_idx`)
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gift_shop`
--

LOCK TABLES `gift_shop` WRITE;
/*!40000 ALTER TABLE `gift_shop` DISABLE KEYS */;
INSERT INTO `gift_shop` VALUES (1,85000.00,50,'2025-05-03 16:13:21.000000','2025-05-05 05:54:22.794078','signature-aroma','평온한 순간 아로마 디퓨저 세트','호텔 로비와 객실에서 사용되는 시그니처 향','https://sist-chill-hotel.s3.ap-northeast-2.amazonaws.com/images/products/2025/05/05/a47d07e4-8e3d-4486-b9ba-ac7dc03248db_평온한 순간 아로마 디퓨저 세트.jpg'),(2,55000.00,40,'2025-05-03 16:13:21.000000','2025-05-05 05:54:43.856931','signature-bath','Ultimate Chill 목욕 소금 & 입욕제 세트','스위트 객실 전용 럭셔리 배스 제품','https://sist-chill-hotel.s3.ap-northeast-2.amazonaws.com/images/products/2025/05/05/9502ef85-ec7f-46da-a8ea-6cd75e6f3f8a_Ultimate Chill 목욕 소금 & 입욕제 세트.png'),(3,120000.00,35,'2025-05-03 16:13:21.000000','2025-05-05 05:55:14.663322','signature-bedding','Chill Night 베개커버 세트','호텔에서 사용하는 것과 동일한 베개커버','https://sist-chill-hotel.s3.ap-northeast-2.amazonaws.com/images/products/2025/05/05/032465b6-0502-4330-b171-0410d900e842_Night 베개커버 세트.jpg'),(4,75000.00,25,'2025-05-03 16:13:21.000000','2025-05-05 05:55:18.715279','wellness-meditation','마음의 평화 명상 키트','명상 가이드북, 캔들, 명상 음악 앱 이용권','https://sist-chill-hotel.s3.ap-northeast-2.amazonaws.com/images/products/2025/05/05/4c0791ef-fa16-465f-b28c-f8ac213f40fe_명상키트.jpg'),(5,65000.00,40,'2025-05-03 16:13:21.000000','2025-05-05 05:55:42.982628','wellness-sleep','깊은 휴식 수면 키트','수면 마스크, 베개 미스트, 이어플러그, 수면 유도 음악','https://sist-chill-hotel.s3.ap-northeast-2.amazonaws.com/images/products/2025/05/05/0f13a77d-ea7e-40a4-a268-dec16046c849_깊은 휴식 수면 키트.jpg'),(6,70000.00,25,'2025-05-03 16:13:21.000000','2025-05-05 05:56:25.454931','wellness-aromatherapy','숲의 선물 아로마테라피 오일 세트','야생 허브, 나무, 꽃에서 추출한 에센셜 오일','https://sist-chill-hotel.s3.ap-northeast-2.amazonaws.com/images/products/2025/05/05/e9382aa5-3456-4729-aef8-a1705e6d84dd_숲의 선물 아로마테라피 오일 세트.jpg'),(7,35000.00,60,'2025-05-03 16:13:21.000000','2025-05-05 05:57:05.083112','eco-eco-living','지구를 위한 휴식 친환경 텀블러','재활용 소재로 만든 보온-보냉 텀블러','https://sist-chill-hotel.s3.ap-northeast-2.amazonaws.com/images/products/2025/05/05/c9ab726d-b052-432c-93ec-854b512e2090_지구를 위한 휴식 친환경 텀블러.jpg'),(8,40000.00,50,'2025-05-03 16:13:21.000000','2025-05-05 05:58:10.086356','eco-organic','순수한 휴식 유기농 비누 & 샴푸 바','환경에 무해한 고체 형태의 세면용품','https://sist-chill-hotel.s3.ap-northeast-2.amazonaws.com/images/products/2025/05/05/ef34164b-acb8-4bda-8644-1c7773380397_순수한 휴식 유기농 비누 & 샴푸 바.jpg'),(9,48000.00,35,'2025-05-03 16:13:21.000000','2025-05-05 05:58:41.355411','eco-travel','여행하는 평화 재사용 가능 여행 키트','반복 사용 가능한 여행용 병, 파우치 등','https://sist-chill-hotel.s3.ap-northeast-2.amazonaws.com/images/products/2025/05/05/93cb00fe-6a05-452f-ab1c-6b69dfb5e6ac_여행하는 평화 재사용 가능 여행 키트.jpg'),(10,45000.00,50,'2025-05-03 16:13:21.000000','2025-05-05 05:59:52.904312','food-tea','Chill Tea 시그니처 차 컬렉션','호텔 레스토랑과 라운지에서 제공되는 차 모음','https://sist-chill-hotel.s3.ap-northeast-2.amazonaws.com/images/products/2025/05/05/7da7fec2-fb2e-45d9-b7eb-11a864f0166a_Tea 시그니처 차 컬렉션.jpg'),(11,50000.00,40,'2025-05-03 16:13:22.000000','2025-05-05 06:00:24.504828','food-organic-food','자연의 달콤함 유기농 꿀 & 잼 세트','지역 농장에서 생산된 유기농 제품','https://sist-chill-hotel.s3.ap-northeast-2.amazonaws.com/images/products/2025/05/05/5d01b5bb-89fd-4adb-a116-e204f4b42a6d_자연의 달콤함 유기농 꿀 & 잼 세트.jpg'),(12,120000.00,25,'2025-05-03 16:13:22.000000','2025-05-05 06:00:58.983987','food-wine','평온한 저녁 와인 셀렉션','Chill Elegance 레스토랑에서 제공되는 와인','https://sist-chill-hotel.s3.ap-northeast-2.amazonaws.com/images/products/2025/05/05/81060092-93e8-46df-bbf2-2e5f35a25407_평온한 저녁 와인 셀렉션.jpg'),(13,50000.00,45,'2025-05-03 16:13:22.000000','2025-05-05 06:01:02.535228','room-comfort','간편한 힐링 미니 아로마 세트','컴팩트한 크기의 아로마 디퓨저와 오일','https://sist-chill-hotel.s3.ap-northeast-2.amazonaws.com/images/products/2025/05/05/a974b474-3e8f-416a-8c69-226943618d11_아로마세트.jpg'),(14,85000.00,20,'2025-05-03 16:13:22.000000','2025-05-05 06:01:21.618311','room-family','가족 힐링 타임 보드게임 컬렉션','가족이 함께하는 보드게임 세트','https://sist-chill-hotel.s3.ap-northeast-2.amazonaws.com/images/products/2025/05/05/37515a36-8f87-4289-a2a7-995d6f5f51e4_가족 힐링 타임 보드게임 컬렉션.png'),(15,250000.00,15,'2025-05-03 16:13:22.000000','2025-05-05 06:01:48.303261','room-ultimate','럭셔리 힐링 프리미엄 웰빙 박스','최고급 힐링 제품 종합 세트','https://sist-chill-hotel.s3.ap-northeast-2.amazonaws.com/images/products/2025/05/05/0edc06ff-ab01-47f9-916d-46cbe7b874c0_럭셔리 힐링 프리미엄 웰빙 박스.jpg'),(16,45000.00,40,'2025-05-03 16:13:22.000000','2025-05-05 05:52:16.611016','memory-photo','Chill Moment 포토 프레임','호텔 로고가 새겨진 고급 사진 액자','https://sist-chill-hotel.s3.ap-northeast-2.amazonaws.com/images/products/2025/05/05/3309701a-c31f-43dc-9054-770766b34b86_포토 프레임.png'),(17,55000.00,25,'2025-05-03 16:13:22.000000','2025-05-05 06:02:48.582256','memory-miniature','Chill Haven 드림 미니어처','호텔 건물의 소형 모델','https://sist-chill-hotel.s3.ap-northeast-2.amazonaws.com/images/products/2025/05/05/c1677090-788e-45e0-b5b8-16571c237a93_드림 미니어처.jpg'),(18,95000.00,20,'2025-05-03 16:13:22.000000','2025-05-05 06:02:25.016495','memory-seasonal','계절의 평온 봄 에디션','봄을 테마로 한 한정판 제품 세트','https://sist-chill-hotel.s3.ap-northeast-2.amazonaws.com/images/products/2025/05/05/7d9dbfd6-a19a-4486-82c6-4cf29cef8738_계절의 평온 봄 에디션.jpg');
/*!40000 ALTER TABLE `gift_shop` ENABLE KEYS */;
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
