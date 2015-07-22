-- MySQL dump 10.13  Distrib 5.6.13, for osx10.6 (i386)
--
-- Host: 172.16.206.16    Database: fixedAsset
-- ------------------------------------------------------
-- Server version	5.5.29-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `fixedAsset`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `fixedAsset` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `fixedAsset`;

--
-- Table structure for table `ASSETEVENT`
--

DROP TABLE IF EXISTS `ASSETEVENT`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ASSETEVENT` (
  `aetId` varchar(120) NOT NULL DEFAULT '',
  `aetpId` int(11) DEFAULT NULL,
  `atId` varchar(45) DEFAULT NULL,
  `userId` varchar(45) DEFAULT NULL,
  `aeDesc` varchar(100) DEFAULT NULL,
  `aeTime` datetime DEFAULT NULL,
  `operateId` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`aetId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='资产事件记录';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ASSETEVENT`
--

LOCK TABLES `ASSETEVENT` WRITE;
/*!40000 ALTER TABLE `ASSETEVENT` DISABLE KEYS */;
/*!40000 ALTER TABLE `ASSETEVENT` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ASSETEVENTYPE`
--

DROP TABLE IF EXISTS `ASSETEVENTYPE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ASSETEVENTYPE` (
  `aetId` int(11) NOT NULL,
  `aetName` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`aetId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='资产事件类型';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ASSETEVENTYPE`
--

LOCK TABLES `ASSETEVENTYPE` WRITE;
/*!40000 ALTER TABLE `ASSETEVENTYPE` DISABLE KEYS */;
INSERT INTO `ASSETEVENTYPE` VALUES (1,'入库'),(2,'报废'),(3,'派发'),(4,'收回'),(5,'');
/*!40000 ALTER TABLE `ASSETEVENTYPE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ASSETS`
--

DROP TABLE IF EXISTS `ASSETS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ASSETS` (
  `newId` varchar(45) NOT NULL,
  `oldId` varchar(45) DEFAULT NULL,
  `userId` varchar(45) DEFAULT NULL,
  `departmentId` varchar(45) DEFAULT NULL,
  `typeId` int(11) DEFAULT NULL,
  `assetName` varchar(50) DEFAULT NULL,
  `assetBelong` varchar(45) DEFAULT NULL,
  `currentStatus` varchar(45) DEFAULT NULL,
  `brand` varchar(45) DEFAULT NULL,
  `model` varchar(45) DEFAULT NULL,
  `specifications` varchar(150) DEFAULT NULL,
  `price` decimal(12,2) DEFAULT NULL,
  `purchaseDate` date DEFAULT NULL,
  `possessDate` date DEFAULT NULL,
  `serviceCode` varchar(45) DEFAULT NULL,
  `mac` varchar(45) DEFAULT NULL,
  `reject` int(11) DEFAULT NULL,
  `rejectDate` date DEFAULT NULL,
  `remark1` varchar(100) DEFAULT NULL,
  `remark2` varchar(50) DEFAULT NULL,
  `qrcode` varchar(400) DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  PRIMARY KEY (`newId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='所有的资产总表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ASSETS`
--

LOCK TABLES `ASSETS` WRITE;
/*!40000 ALTER TABLE `ASSETS` DISABLE KEYS */;
/*!40000 ALTER TABLE `ASSETS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ASSETTYPE`
--

DROP TABLE IF EXISTS `ASSETTYPE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ASSETTYPE` (
  `typeId` int(11) NOT NULL,
  `typeName` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`typeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='资产类型';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ASSETTYPE`
--

LOCK TABLES `ASSETTYPE` WRITE;
/*!40000 ALTER TABLE `ASSETTYPE` DISABLE KEYS */;
INSERT INTO `ASSETTYPE` VALUES (1,'笔记本'),(2,'主机'),(3,'显示器'),(4,'服务器'),(6,'移动设备'),(7,'办公设备'),(10,'一体机');
/*!40000 ALTER TABLE `ASSETTYPE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `AUTHUSER`
--

DROP TABLE IF EXISTS `AUTHUSER`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `AUTHUSER` (
  `uid` varchar(50) NOT NULL,
  `pwd` varchar(400) DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL,
  `lastLoginTime` datetime DEFAULT NULL,
  `uName` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='管理员表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AUTHUSER`
--

LOCK TABLES `AUTHUSER` WRITE;
/*!40000 ALTER TABLE `AUTHUSER` DISABLE KEYS */;
/*!40000 ALTER TABLE `AUTHUSER` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `COMPANY`
--

DROP TABLE IF EXISTS `COMPANY`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `COMPANY` (
  `companyId` int(11) NOT NULL AUTO_INCREMENT,
  `companyName` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`companyId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COMMENT='公司表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `COMPANY`
--

LOCK TABLES `COMPANY` WRITE;
/*!40000 ALTER TABLE `COMPANY` DISABLE KEYS */;
/*!40000 ALTER TABLE `COMPANY` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DEPARTMENT`
--

DROP TABLE IF EXISTS `DEPARTMENT`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `DEPARTMENT` (
  `departmentId` int(11) NOT NULL AUTO_INCREMENT,
  `departmentName` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`departmentId`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8 COMMENT='部门表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DEPARTMENT`
--

LOCK TABLES `DEPARTMENT` WRITE;
/*!40000 ALTER TABLE `DEPARTMENT` DISABLE KEYS */;
/*!40000 ALTER TABLE `DEPARTMENT` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `GIFT`
--

DROP TABLE IF EXISTS `GIFT`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `GIFT` (
  `giftId` varchar(120) NOT NULL,
  `brand` varchar(45) DEFAULT NULL,
  `name` varchar(45) DEFAULT NULL,
  `unit` varchar(45) DEFAULT NULL,
  `price` decimal(5,0) DEFAULT NULL,
  `expireDate` varchar(45) DEFAULT NULL,
  `categoryId` varchar(120) DEFAULT NULL,
  PRIMARY KEY (`giftId`),
  UNIQUE KEY `giftId_UNIQUE` (`giftId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `GIFT`
--

LOCK TABLES `GIFT` WRITE;
/*!40000 ALTER TABLE `GIFT` DISABLE KEYS */;
/*!40000 ALTER TABLE `GIFT` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `GIFTCATEGORY`
--

DROP TABLE IF EXISTS `GIFTCATEGORY`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `GIFTCATEGORY` (
  `categoryId` varchar(120) NOT NULL,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`categoryId`),
  UNIQUE KEY `categoryId_UNIQUE` (`categoryId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `GIFTCATEGORY`
--

LOCK TABLES `GIFTCATEGORY` WRITE;
/*!40000 ALTER TABLE `GIFTCATEGORY` DISABLE KEYS */;
/*!40000 ALTER TABLE `GIFTCATEGORY` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `INVENTORY`
--

DROP TABLE IF EXISTS `INVENTORY`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `INVENTORY` (
  `inventoryId` varchar(120) NOT NULL,
  `giftId` varchar(120) DEFAULT NULL,
  `num` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`inventoryId`),
  UNIQUE KEY `inventoryId_UNIQUE` (`inventoryId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `INVENTORY`
--

LOCK TABLES `INVENTORY` WRITE;
/*!40000 ALTER TABLE `INVENTORY` DISABLE KEYS */;
/*!40000 ALTER TABLE `INVENTORY` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `LIMITATION`
--

DROP TABLE IF EXISTS `LIMITATION`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `LIMITATION` (
  `giftId` varchar(120) NOT NULL,
  `limitNum` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`giftId`),
  UNIQUE KEY `giftId_UNIQUE` (`giftId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `LIMITATION`
--

LOCK TABLES `LIMITATION` WRITE;
/*!40000 ALTER TABLE `LIMITATION` DISABLE KEYS */;
/*!40000 ALTER TABLE `LIMITATION` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PAYMENTTYPE`
--

DROP TABLE IF EXISTS `PAYMENTTYPE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `PAYMENTTYPE` (
  `ptId` varchar(120) NOT NULL,
  `ptName` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`ptId`),
  UNIQUE KEY `ptId_UNIQUE` (`ptId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PAYMENTTYPE`
--

LOCK TABLES `PAYMENTTYPE` WRITE;
/*!40000 ALTER TABLE `PAYMENTTYPE` DISABLE KEYS */;
/*!40000 ALTER TABLE `PAYMENTTYPE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `REPAIR`
--

DROP TABLE IF EXISTS `REPAIR`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `REPAIR` (
  `rpId` varchar(120) NOT NULL DEFAULT '',
  `newId` varchar(45) NOT NULL,
  `rptpId` int(11) DEFAULT NULL,
  `atId` varchar(45) DEFAULT NULL,
  `reportTime` datetime DEFAULT NULL,
  `repairTime` varchar(100) DEFAULT NULL,
  `parts` varchar(200) DEFAULT NULL,
  `cost` varchar(45) DEFAULT NULL,
  `model` varchar(45) NOT NULL,
  `reportUser` varchar(45) DEFAULT NULL,
  `deptId` varchar(45) DEFAULT NULL,
  `remark` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`rpId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='维修记录';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `REPAIR`
--

LOCK TABLES `REPAIR` WRITE;
/*!40000 ALTER TABLE `REPAIR` DISABLE KEYS */;
/*!40000 ALTER TABLE `REPAIR` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `REPAIRTYPE`
--

DROP TABLE IF EXISTS `REPAIRTYPE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `REPAIRTYPE` (
  `rptpId` int(11) NOT NULL,
  `rptpName` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`rptpId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='维修类型';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `REPAIRTYPE`
--

LOCK TABLES `REPAIRTYPE` WRITE;
/*!40000 ALTER TABLE `REPAIRTYPE` DISABLE KEYS */;
/*!40000 ALTER TABLE `REPAIRTYPE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `STOCKIN`
--

DROP TABLE IF EXISTS `STOCKIN`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `STOCKIN` (
  `siId` varchar(120) NOT NULL,
  `giftId` varchar(120) DEFAULT NULL,
  `num` int(11) DEFAULT NULL,
  `amount` decimal(5,0) DEFAULT NULL,
  `supplier` varchar(120) DEFAULT NULL,
  `siTypeId` varchar(120) DEFAULT NULL,
  `ptId` varchar(120) DEFAULT NULL,
  `siDate` varchar(45) DEFAULT NULL,
  `remark` varchar(45) DEFAULT NULL,
  `other` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`siId`),
  UNIQUE KEY `siId_UNIQUE` (`siId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `STOCKIN`
--

LOCK TABLES `STOCKIN` WRITE;
/*!40000 ALTER TABLE `STOCKIN` DISABLE KEYS */;
/*!40000 ALTER TABLE `STOCKIN` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`%`*/ /*!50003 TRIGGER `TGR_STOCKIN_INSERT` AFTER INSERT ON STOCKIN FOR EACH ROW
-- Edit trigger body code below this line. Do not edit lines above this one
BEGIN
	DECLARE new_si_num INT DEFAULT 0;
	DECLARE new_so_num INT DEFAULT 0;
	DECLARE exist_gift_in_inventory INT;

	SELECT COUNT(1) INTO exist_gift_in_inventory FROM INVENTORY WHERE giftId = NEW.giftId;

	IF exist_gift_in_inventory = 0 THEN		-- not exist do insert
		INSERT INTO INVENTORY VALUES(UUID(), NEW.giftId, NEW.num);
		#set default inventory for every gift 
		INSERT INTO LIMITATION VALUES(NEW.giftId, 10);
	ELSE									-- exist do update
		BEGIN 
			SELECT SUM(num) INTO new_si_num FROM STOCKIN WHERE giftId = NEW.giftId;
			SELECT SUM(num) INTO new_so_num FROM STOCKOUT WHERE giftId = NEW.giftId;

			IF new_si_num IS NULL THEN
				SET new_si_num = 0;
			END IF;

			IF new_so_num IS NULL THEN 
				SET new_so_num = 0;
			END IF;

			UPDATE INVENTORY SET num = new_si_num - new_so_num WHERE giftId = NEW.giftId;
		END;
	END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`%`*/ /*!50003 TRIGGER `TGR_STOCKIN_UPDATE` AFTER UPDATE ON STOCKIN FOR EACH ROW
-- Edit trigger body code below this line. Do not edit lines above this one
BEGIN
	DECLARE new_si_num INT DEFAULT 0;
	DECLARE new_so_num INT DEFAULT 0;
	DECLARE exist_gift_in_inventory INT;

	SELECT COUNT(1) INTO exist_gift_in_inventory FROM INVENTORY WHERE giftId = NEW.giftId;

	IF exist_gift_in_inventory != 0 THEN		-- not exist do insert									-- exist do update
		BEGIN 
			SELECT SUM(num) INTO new_si_num FROM STOCKIN WHERE giftId = NEW.giftId;
			SELECT SUM(num) INTO new_so_num FROM STOCKOUT WHERE giftId = NEW.giftId;

			IF new_si_num IS NULL THEN
				SET new_si_num = 0;
			END IF;

			IF new_so_num IS NULL THEN 
				SET new_so_num = 0;
			END IF;

			UPDATE INVENTORY SET num = new_si_num - new_so_num WHERE giftId = NEW.giftId;
		END;
	END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`%`*/ /*!50003 TRIGGER `TGR_STOCKIN_DELETE` AFTER DELETE ON STOCKIN FOR EACH ROW
-- Edit trigger body code below this line. Do not edit lines above this one
BEGIN
	DECLARE new_si_num INT DEFAULT 0;
	DECLARE new_so_num INT DEFAULT 0;
	DECLARE exist_gift_in_inventory INT;

	SELECT COUNT(1) INTO exist_gift_in_inventory FROM INVENTORY WHERE giftId = OLD.giftId;

	IF exist_gift_in_inventory != 0 THEN		-- exist do update								
		BEGIN 
			SELECT SUM(num) INTO new_si_num FROM STOCKIN WHERE giftId = OLD.giftId;
			SELECT SUM(num) INTO new_so_num FROM STOCKOUT WHERE giftId = OLD.giftId;

			IF new_si_num IS NULL THEN
				SET new_si_num = 0;
			END IF;

			IF new_so_num IS NULL THEN 
				SET new_so_num = 0;
			END IF;

			UPDATE INVENTORY SET num = new_si_num - new_so_num WHERE giftId = OLD.giftId;
		END;
	END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `STOCKINTYPE`
--

DROP TABLE IF EXISTS `STOCKINTYPE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `STOCKINTYPE` (
  `sitId` varchar(120) NOT NULL,
  `typeName` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`sitId`),
  UNIQUE KEY `sitId_UNIQUE` (`sitId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `STOCKINTYPE`
--

LOCK TABLES `STOCKINTYPE` WRITE;
/*!40000 ALTER TABLE `STOCKINTYPE` DISABLE KEYS */;
/*!40000 ALTER TABLE `STOCKINTYPE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `STOCKOUT`
--

DROP TABLE IF EXISTS `STOCKOUT`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `STOCKOUT` (
  `soId` varchar(120) NOT NULL,
  `giftId` varchar(120) DEFAULT NULL,
  `num` int(11) DEFAULT NULL,
  `amount` decimal(12,0) DEFAULT NULL,
  `applyUserId` varchar(20) DEFAULT NULL,
  `underDept` varchar(120) DEFAULT NULL,
  `ptId` varchar(120) DEFAULT NULL,
  `soDate` varchar(45) DEFAULT NULL,
  `remark` varchar(45) DEFAULT NULL,
  `other` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`soId`),
  UNIQUE KEY `soId_UNIQUE` (`soId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `STOCKOUT`
--

LOCK TABLES `STOCKOUT` WRITE;
/*!40000 ALTER TABLE `STOCKOUT` DISABLE KEYS */;
/*!40000 ALTER TABLE `STOCKOUT` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`%`*/ /*!50003 TRIGGER `TGR_STOCKOUT_INSERT` AFTER INSERT ON STOCKOUT FOR EACH ROW
-- Edit trigger body code below this line. Do not edit lines above this one
BEGIN
	DECLARE new_si_num INT;
	DECLARE new_so_num INT;
	DECLARE exist_gift_in_inventory INT;

	SELECT COUNT(1) INTO exist_gift_in_inventory FROM INVENTORY WHERE giftId = NEW.giftId;

	IF exist_gift_in_inventory != 0 THEN		-- exist do update
		BEGIN 
			SELECT SUM(num) INTO new_si_num FROM STOCKIN WHERE giftId = NEW.giftId;
			SELECT SUM(num) INTO new_so_num FROM STOCKOUT WHERE giftId = NEW.giftId;

			IF new_si_num IS NULL THEN
				SET new_si_num = 0;
			END IF;

			IF new_so_num IS NULL THEN 
				SET new_so_num = 0;
			END IF;

			UPDATE INVENTORY SET num = new_si_num - new_so_num WHERE giftId = NEW.giftId;
		END;
	END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`%`*/ /*!50003 TRIGGER `TGR_STOCKOUT_UPDATE` AFTER UPDATE ON STOCKOUT FOR EACH ROW
-- Edit trigger body code below this line. Do not edit lines above this one
BEGIN
	DECLARE new_si_num INT;
	DECLARE new_so_num INT;
	DECLARE exist_gift_in_inventory INT;

	SELECT COUNT(1) INTO exist_gift_in_inventory FROM INVENTORY WHERE giftId = NEW.giftId;

	IF exist_gift_in_inventory != 0 THEN		-- exist do update
		BEGIN 
			SELECT SUM(num) INTO new_si_num FROM STOCKIN WHERE giftId = NEW.giftId;
			SELECT SUM(num) INTO new_so_num FROM STOCKOUT WHERE giftId = NEW.giftId;

			IF new_si_num IS NULL THEN
				SET new_si_num = 0;
			END IF;

			IF new_so_num IS NULL THEN 
				SET new_so_num = 0;
			END IF;

			UPDATE INVENTORY SET num = new_si_num - new_so_num WHERE giftId = NEW.giftId;
		END;
	END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`%`*/ /*!50003 TRIGGER `TRG_STOCKOUT_DELETE` AFTER DELETE ON STOCKOUT FOR EACH ROW
-- Edit trigger body code below this line. Do not edit lines above this one
BEGIN
	DECLARE new_si_num INT;
	DECLARE new_so_num INT;
	DECLARE exist_gift_in_inventory INT;

	SELECT COUNT(1) INTO exist_gift_in_inventory FROM INVENTORY WHERE giftId = OLD.giftId;

	IF exist_gift_in_inventory != 0 THEN		-- exist do update
		BEGIN 
			SELECT SUM(num) INTO new_si_num FROM STOCKIN WHERE giftId = OLD.giftId;
			SELECT SUM(num) INTO new_so_num FROM STOCKOUT WHERE giftId = OLD.giftId;

			IF new_si_num IS NULL THEN
				SET new_si_num = 0;
			END IF;

			IF new_so_num IS NULL THEN 
				SET new_so_num = 0;
			END IF;

			UPDATE INVENTORY SET num = new_si_num - new_so_num WHERE giftId = OLD.giftId;
		END;
	END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `TEMPP`
--

DROP TABLE IF EXISTS `TEMPP`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `TEMPP` (
  `USERID` varchar(20) DEFAULT NULL,
  `USERNAME` varchar(45) DEFAULT NULL,
  `DEPARTMENT` varchar(100) DEFAULT NULL,
  `phone` varchar(45) DEFAULT NULL,
  `mail` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TEMPP`
--

LOCK TABLES `TEMPP` WRITE;
/*!40000 ALTER TABLE `TEMPP` DISABLE KEYS */;
/*!40000 ALTER TABLE `TEMPP` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TMP_STOCKIN`
--

DROP TABLE IF EXISTS `TMP_STOCKIN`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `TMP_STOCKIN` (
  `tsiDate` varchar(45) DEFAULT NULL,
  `tsiCategory` varchar(45) DEFAULT NULL,
  `tsiBrand` varchar(45) DEFAULT NULL,
  `tsiName` varchar(45) DEFAULT NULL,
  `tsiUnit` varchar(45) DEFAULT NULL,
  `tsiNum` int(11) DEFAULT NULL,
  `tsiPrice` decimal(5,0) DEFAULT NULL,
  `tsiAmount` decimal(5,0) DEFAULT NULL,
  `tsiSupplier` varchar(45) DEFAULT NULL,
  `tsiState` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TMP_STOCKIN`
--

LOCK TABLES `TMP_STOCKIN` WRITE;
/*!40000 ALTER TABLE `TMP_STOCKIN` DISABLE KEYS */;
/*!40000 ALTER TABLE `TMP_STOCKIN` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `USER`
--

DROP TABLE IF EXISTS `USER`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `USER` (
  `userId` varchar(20) NOT NULL,
  `userName` varchar(30) DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL,
  `phone` varchar(40) DEFAULT NULL,
  `mail` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `USER`
--

LOCK TABLES `USER` WRITE;
/*!40000 ALTER TABLE `USER` DISABLE KEYS */;
/*!40000 ALTER TABLE `USER` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'fixedAsset'
--

--
-- Dumping routines for database 'fixedAsset'
--
/*!50003 DROP PROCEDURE IF EXISTS `asset_user_insert_procedure` */;
ALTER DATABASE `fixedAsset` CHARACTER SET latin1 COLLATE latin1_swedish_ci ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `asset_user_insert_procedure`(loop_times INT)
BEGIN
	DECLARE var INT DEFAULT 0;  
	WHILE var<loop_times DO  
	SET var=var+1;  
	INSERT INTO USERASSETS (assetsid,userid,equipmenttypeid) 
	VALUES (var+101,CONCAT('01312',var+101),var%11);  
	END WHILE; 
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
ALTER DATABASE `fixedAsset` CHARACTER SET utf8 COLLATE utf8_general_ci ;
