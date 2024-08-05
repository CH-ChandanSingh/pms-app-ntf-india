CREATE DATABASE  IF NOT EXISTS `ntf` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `ntf`;
-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: ntf
-- ------------------------------------------------------
-- Server version	8.0.34

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
-- Table structure for table `actual_price`
--

DROP TABLE IF EXISTS `actual_price`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `actual_price` (
  `id` int NOT NULL AUTO_INCREMENT,
  `part_id` varchar(45) DEFAULT NULL,
  `f_year` varchar(45) DEFAULT NULL,
  `po_type_id` varchar(45) DEFAULT NULL,
  `actual_price_q1` varchar(45) DEFAULT NULL,
  `actual_price_q2` varchar(45) DEFAULT NULL,
  `actual_price_q3` varchar(45) DEFAULT NULL,
  `actual_price_q4` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `actual_price`
--

LOCK TABLES `actual_price` WRITE;
/*!40000 ALTER TABLE `actual_price` DISABLE KEYS */;
/*!40000 ALTER TABLE `actual_price` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cost_sheet`
--

DROP TABLE IF EXISTS `cost_sheet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cost_sheet` (
  `id` int NOT NULL AUTO_INCREMENT,
  `part_id` varchar(45) DEFAULT NULL,
  `cost_type` varchar(45) DEFAULT NULL,
  `rm_name` varchar(45) DEFAULT NULL,
  `supplier_name` varchar(45) DEFAULT NULL,
  `rm_weight_kg_pc` varchar(45) DEFAULT NULL,
  `rm_rate_rs_kg` varchar(45) DEFAULT NULL,
  `rm_rate_rs_pc` varchar(45) DEFAULT NULL,
  `indexing_msil_directed` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cost_sheet`
--

LOCK TABLES `cost_sheet` WRITE;
/*!40000 ALTER TABLE `cost_sheet` DISABLE KEYS */;
/*!40000 ALTER TABLE `cost_sheet` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cost_type`
--

DROP TABLE IF EXISTS `cost_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cost_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `status` varchar(45) DEFAULT NULL,
  `createdDate` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cost_type`
--

LOCK TABLES `cost_type` WRITE;
/*!40000 ALTER TABLE `cost_type` DISABLE KEYS */;
INSERT INTO `cost_type` VALUES (1,'RM','1',NULL),(2,'BOP','1',NULL),(3,'Process','1',NULL),(4,'Other','1',NULL);
/*!40000 ALTER TABLE `cost_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `model`
--

DROP TABLE IF EXISTS `model`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `model` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `model`
--

LOCK TABLES `model` WRITE;
/*!40000 ALTER TABLE `model` DISABLE KEYS */;
INSERT INTO `model` VALUES (1,'Brezza');
/*!40000 ALTER TABLE `model` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `part_detail`
--

DROP TABLE IF EXISTS `part_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `part_detail` (
  `id` int NOT NULL AUTO_INCREMENT,
  `part_number` varchar(45) DEFAULT NULL,
  `part_name` varchar(45) DEFAULT NULL,
  `po_type_id` varchar(50) DEFAULT NULL,
  `model_id` varchar(45) DEFAULT NULL,
  `rm_base` varchar(45) DEFAULT NULL,
  `sop` varchar(45) DEFAULT NULL,
  `vendor_code` varchar(45) DEFAULT NULL,
  `pcd_1` varchar(45) DEFAULT NULL,
  `pcd_1_date` varchar(45) DEFAULT NULL,
  `pcd_2` varchar(45) DEFAULT NULL,
  `pcd_2_date` varchar(45) DEFAULT NULL,
  `pcd_3` varchar(45) DEFAULT NULL,
  `pcd_3_date` varchar(45) DEFAULT NULL,
  `pcd_4` varchar(45) DEFAULT NULL,
  `pcd_4_date` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `part_detail`
--

LOCK TABLES `part_detail` WRITE;
/*!40000 ALTER TABLE `part_detail` DISABLE KEYS */;
/*!40000 ALTER TABLE `part_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `po_type`
--

DROP TABLE IF EXISTS `po_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `po_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `po_type`
--

LOCK TABLES `po_type` WRITE;
/*!40000 ALTER TABLE `po_type` DISABLE KEYS */;
INSERT INTO `po_type` VALUES (1,'OEO'),(2,'SPO'),(3,'OES-MOES-M(Manesar)'),(4,'OES-G'),(5,'OES');
/*!40000 ALTER TABLE `po_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rm`
--

DROP TABLE IF EXISTS `rm`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rm` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `cost_type` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rm`
--

LOCK TABLES `rm` WRITE;
/*!40000 ALTER TABLE `rm` DISABLE KEYS */;
INSERT INTO `rm` VALUES (1,'SP280ACI','1'),(2,'SP292H','1'),(3,'XPPA 2408 MS-5PK','1'),(4,'ABP1520 P4AP-G017','1'),(5,'EXP0741125PK','1'),(6,'Clip (09409-08342)','2'),(7,'Clip (09409T10L01)','2'),(8,'Cap (73132T57L0)','2'),(9,'Clip (09409-08352)','2'),(10,'Felt- 1','2'),(11,'Nut (001)','2'),(12,'Nut (002)','2'),(13,'Nut (003)','2'),(14,'Bold (004)','2'),(15,'Injection Molding','3'),(16,'Assembly Cost','3'),(17,'Other Cost','4'),(18,'Other Cost - Margin spare','4');
/*!40000 ALTER TABLE `rm` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rm_movements`
--

DROP TABLE IF EXISTS `rm_movements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rm_movements` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rm_id` varchar(45) DEFAULT NULL,
  `supplier_name` varchar(45) DEFAULT NULL,
  `f_year` varchar(45) DEFAULT NULL,
  `q1` varchar(45) DEFAULT NULL,
  `q2` varchar(45) DEFAULT NULL,
  `q3` varchar(45) DEFAULT NULL,
  `q4` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rm_movements`
--

LOCK TABLES `rm_movements` WRITE;
/*!40000 ALTER TABLE `rm_movements` DISABLE KEYS */;
/*!40000 ALTER TABLE `rm_movements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'ntf'
--

--
-- Dumping routines for database 'ntf'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-08-05 12:40:13
