-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- ホスト: db
-- 生成日時: 2022 年 6 月 01 日 09:47
-- サーバのバージョン： 8.0.29
-- PHP のバージョン: 8.0.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- データベース: `ssw_hr`
--
CREATE DATABASE IF NOT EXISTS `ssw_hr` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `ssw_hr`;

-- --------------------------------------------------------

--
-- テーブルの構造 `department`
--

CREATE TABLE IF NOT EXISTS `department` (
  `id` varchar(18) COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- テーブルのデータのダンプ `department`
--

INSERT INTO `department` (`id`, `name`) VALUES
('726737845091303474', '翻訳部門'),
('751418209273511986', 'コーディング部門'),
('751426084259627068', 'グラフィクス部門'),
('751426086222561390', 'シナリオ部門'),
('813043555638444032', 'ライター部門'),
('840648409395363861', '広報部門'),
('862627751789330442', '技術部門');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
