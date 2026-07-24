-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.30 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Dumping structure for table db_uptd_parkir.beritas
CREATE TABLE IF NOT EXISTS `beritas` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `judul` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kategori` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tanggal` date NOT NULL,
  `ringkasan` text COLLATE utf8mb4_unicode_ci,
  `isi` longtext COLLATE utf8mb4_unicode_ci,
  `foto` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `beritas_slug_unique` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_uptd_parkir.beritas: ~3 rows (approximately)
INSERT INTO `beritas` (`id`, `judul`, `slug`, `kategori`, `tanggal`, `ringkasan`, `isi`, `foto`, `created_at`, `updated_at`) VALUES
	(1, 'Penertiban jukir tidak berseragam di kawasan Alun-alun Singaparna', 'penertiban-jukir-tidak-berseragam-singaparna', 'Penertiban', '2026-07-18', 'UPTD bersama petugas gabungan menindak jukir yang tidak memakai atribut resmi.', '<h3>Petugas UPTD Pengelola Parkir Dishubkominfo Kabupaten Tasikmalaya menggelar operasi penertiban juru parkir di kawasan Alun-alun Singaparna. Penertiban ini menyasar petugas parkir yang tidak mengenakan atribut resmi seperti rompi dan ID Card.&nbsp;</h3><div><br></div><div><h3><ul><li><b><a href="https://tasikmalayakab.go.id">dadtetst</a></b></li></ul></h3></div><div><br></div><div>&nbsp;Petugas UPTD Pengelola Parkir Dishubkominfo Kabupaten Tasikmalaya menggelar operasi penertiban juru parkir di kawasan Alun-alun Singaparna. Penertiban ini menyasar petugas parkir yang tidak mengenakan atribut resmi seperti rompi dan ID Card.</div>', 'berita/nsnwwWwLgQOcobGWkbBH4ipNW49xTMRHOXW7aCAu.png', '2026-07-22 18:06:18', '2026-07-23 07:47:16'),
	(2, 'Update tarif parkir sepeda motor sesuai Perbup terbaru', 'update-tarif-parkir-sepeda-motor-perbup', 'Pengumuman', '2026-07-12', 'Penyesuaian tarif resmi berlaku efektif mulai awal bulan berikutnya.', '<b>UPTD </b>Pengelola Parkir mengumumkan sosialisasi penyesuaian tarif retribusi parkir tepi jalan umum berdasarkan Peraturan Bupati Tasikmalaya yang terbaru. Tarif untuk sepeda motor ditetapkan sebesar Rp 2.000 per sekali parkir.', 'berita/update-tarif.jpg', '2026-07-22 18:06:18', '2026-07-23 07:48:43'),
	(3, 'Pembinaan rutin dan pembagian rompi reflektif untuk jukir binaan', 'pembinaan-rutin-dan-pembagian-rompi-reflektif', 'Sosialisasi', '2026-07-05', 'Meningkatkan keselamatan kerja dan kepatuhan standar pelayanan jukir.', 'Sebanyak 50 juru parkir binaan UPTD mengikuti kegiatan pembinaan etika pelayanan publik dan menerima kelengkapan rompi reflektif serta kartu identitas (ID Card) baru.', 'berita/pembinaan-rompi.jpg', '2026-07-22 18:06:18', '2026-07-22 18:06:18');

-- Dumping structure for table db_uptd_parkir.cache
CREATE TABLE IF NOT EXISTS `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_uptd_parkir.cache: ~3 rows (approximately)
INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
	('laravel-cache-5c785c036466adea360111aa28563bfd556b5fba', 'i:1;', 1784817698),
	('laravel-cache-5c785c036466adea360111aa28563bfd556b5fba:timer', 'i:1784817698;', 1784817698),
	('laravel-cache-app_settings', 'O:29:"Illuminate\\Support\\Collection":2:{s:8:"\0*\0items";a:5:{s:8:"app_name";s:21:"UPTD Pengelola Parkir";s:13:"primary_color";s:7:"#4f46e5";s:9:"wa_number";s:13:"6281234567890";s:10:"wa_message";s:171:"Halo UPTD Parkir Kab. Tasikmalaya, saya ingin membuat laporan.\r\n#Nama: \r\n#Lokasi Kejadian: \r\n#Jenis Pelanggaran (Tarif Getok/Jukir Liar/Tanpa Karcis): \r\n#Bukti Foto/Video:";s:24:"teks_hak_pengguna_parkir";s:197:"Masyarakat berhak menolak membayar retribusi parkir apabila petugas/juru parkir tidak mengenakan seragam atribut resmi atau tidak menyerahkan karcis resmi bercetak Pemerintah Kabupaten Tasikmalaya.";}s:28:"\0*\0escapeWhenCastingToString";b:0;}', 1784821035);

-- Dumping structure for table db_uptd_parkir.cache_locks
CREATE TABLE IF NOT EXISTS `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_uptd_parkir.cache_locks: ~0 rows (approximately)

-- Dumping structure for table db_uptd_parkir.failed_jobs
CREATE TABLE IF NOT EXISTS `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_uptd_parkir.failed_jobs: ~0 rows (approximately)

-- Dumping structure for table db_uptd_parkir.galeri_fotos
CREATE TABLE IF NOT EXISTS `galeri_fotos` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `kategori` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `caption` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tanggal` date NOT NULL,
  `foto` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_uptd_parkir.galeri_fotos: ~6 rows (approximately)
INSERT INTO `galeri_fotos` (`id`, `kategori`, `caption`, `tanggal`, `foto`, `created_at`, `updated_at`) VALUES
	(2, 'Penertiban', 'Razia gabungan titik parkir liar Jl. Raya Rajapolah', '2026-07-10', 'galeri/razia-rajapolah.jpg', '2026-07-22 18:06:18', '2026-07-22 18:06:18'),
	(3, 'Pembinaan', 'Pembinaan atribut dan etika juru parkir binaan UPTD', '2026-07-05', 'galeri/pembinaan-jukir.jpg', '2026-07-22 18:06:18', '2026-07-22 18:06:18'),
	(4, 'Pembinaan', 'Sosialisasi tarif resmi kepada jukir wilayah Manonjaya', '2026-06-28', 'galeri/sosialisasi-manonjaya.jpg', '2026-07-22 18:06:18', '2026-07-22 18:06:18'),
	(5, 'Penertiban', 'Penindakan tarif getok di kawasan Terminal Singaparna', '2026-06-20', 'galeri/penindakan-terminal.jpg', '2026-07-22 18:06:18', '2026-07-22 18:06:18'),
	(6, 'Pembinaan', 'Pembagian atribut rompi & ID Card baru untuk jukir', '2026-06-12', 'galeri/pembagian-atribut.jpg', '2026-07-22 18:06:18', '2026-07-22 18:06:18'),
	(7, 'Penertiban', 'testing', '2026-07-23', 'galeri/1oSAwehQ1PxFI9eR9nOY8tkp62IP63GBk0H70iFe.jpg', '2026-07-23 06:40:39', '2026-07-23 06:40:40');

-- Dumping structure for table db_uptd_parkir.galeri_foto_items
CREATE TABLE IF NOT EXISTS `galeri_foto_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `galeri_foto_id` bigint unsigned NOT NULL,
  `foto` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `galeri_foto_items_galeri_foto_id_foreign` (`galeri_foto_id`),
  CONSTRAINT `galeri_foto_items_galeri_foto_id_foreign` FOREIGN KEY (`galeri_foto_id`) REFERENCES `galeri_fotos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_uptd_parkir.galeri_foto_items: ~2 rows (approximately)
INSERT INTO `galeri_foto_items` (`id`, `galeri_foto_id`, `foto`, `created_at`, `updated_at`) VALUES
	(1, 7, 'galeri/1oSAwehQ1PxFI9eR9nOY8tkp62IP63GBk0H70iFe.jpg', '2026-07-23 06:40:40', '2026-07-23 06:40:40'),
	(2, 7, 'galeri/VYKhH4NrfRdXEukzH26hRkkGYU00Cdsyv7TpOhZ3.png', '2026-07-23 06:40:40', '2026-07-23 06:40:40');

-- Dumping structure for table db_uptd_parkir.jobs
CREATE TABLE IF NOT EXISTS `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_uptd_parkir.jobs: ~0 rows (approximately)

-- Dumping structure for table db_uptd_parkir.job_batches
CREATE TABLE IF NOT EXISTS `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_uptd_parkir.job_batches: ~0 rows (approximately)

-- Dumping structure for table db_uptd_parkir.kecamatans
CREATE TABLE IF NOT EXISTS `kecamatans` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `id_kecamatan` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nama_kecamatan` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `latitude` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `longitude` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alamat` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `kecamatans_id_kecamatan_unique` (`id_kecamatan`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_uptd_parkir.kecamatans: ~39 rows (approximately)
INSERT INTO `kecamatans` (`id`, `id_kecamatan`, `nama_kecamatan`, `latitude`, `longitude`, `alamat`, `created_at`, `updated_at`) VALUES
	(1, '3206100', 'Taraju', '-7.459600242350725', '107.98239071059889', 'Taraju, Kec. Taraju, Kabupaten Tasikmalaya, Jawa Barat 46474', '2026-07-22 18:06:17', '2026-07-22 18:06:17'),
	(2, '3206120', 'Tanjungjaya', '-7.389265642656829', '108.1218952393436', 'Jl.Cibeureum, Cikeusal, Kec. Tanjungjaya, Kabupaten Tasikmalaya, Jawa Barat 46184', '2026-07-22 18:06:17', '2026-07-22 18:06:17'),
	(3, '3206271', 'Sukaresik', '-7.155639215848148', '108.18327150374857', 'Jl. Raya Sukaratu, Kec. Sukaresik, Kabupaten Tasikmalaya, Jawa Barat 46471', '2026-07-22 18:06:17', '2026-07-22 18:06:17'),
	(4, '3206221', 'Sukaratu', '-7.2768191996102605', '108.14643491149009', 'Sukaratu, Kec. Sukaratu, Kabupaten Tasikmalaya, Jawa Barat 46415', '2026-07-22 18:06:17', '2026-07-22 18:06:17'),
	(5, '3206191', 'Sukarame', '-7.363315580264396', '108.13556938499924', 'Jl.lapang 1, Sukarame, Kec. Sukarame, Kabupaten Tasikmalaya, Jawa Barat 46461', '2026-07-22 18:06:17', '2026-07-22 18:06:17'),
	(6, '3206130', 'Sukaraja', '-7.452256943961604', '108.19138692250263', 'Jl. Raya Sukaraja - Mangunreja, Sukapura, Kec. Sukaraja, Kabupaten Tasikmalaya, Jawa Barat 46185', '2026-07-22 18:06:17', '2026-07-22 18:06:17'),
	(7, '3206231', 'Sukahening', '-7.206419739102319', '108.15281355216219', 'Calingcing, Kec. Sukahening, Kabupaten Tasikmalaya, Jawa Barat 46155', '2026-07-22 18:06:17', '2026-07-22 18:06:17'),
	(8, '3206090', 'Sodonghilir', '-7.488009929644781', '108.0530710452684', 'Sodonghilir, Kec. Sodonghilir, Kabupaten Tasikmalaya, Jawa Barat 46473', '2026-07-22 18:06:17', '2026-07-22 18:06:17'),
	(9, '3206190', 'Singaparna', '-7.3548410333752985', '108.10794648668684', 'Jl. Raya Pemda, Singasari, Kec. Singaparna, Kabupaten Tasikmalaya, Jawa Barat 46412', '2026-07-22 18:06:17', '2026-07-22 18:06:17'),
	(10, '3206211', 'Sariwangi', '-7.317131819218911', '108.0570483037251', 'Jayaratu, Kec. Sariwangi, Kabupaten Tasikmalaya, Jawa Barat 46465', '2026-07-22 18:06:17', '2026-07-22 18:06:17'),
	(11, '3206110', 'Salawu', '-7.373550254764634', '108.02970413777359', 'Jl. Raya Salawu No.95, Karangmukti, Kec. Salawu, Kabupaten Tasikmalaya, Jawa Barat 46471', '2026-07-22 18:06:17', '2026-07-22 18:06:17'),
	(12, '3206140', 'Salopa', '-7.517135978809988', '108.26996041572087', 'Kawitan, Kec. Salopa, Kabupaten Tasikmalaya, Jawa Barat 46192', '2026-07-22 18:06:17', '2026-07-22 18:06:17'),
	(13, '3206240', 'Rajapolah', '-7.220066430205213', '108.19060809995513', 'Jl. Raya Rajapolah No.200, Manggungjaya, Kec. Rajapolah, Kabupaten Tasikmalaya, Jawa Barat 46155', '2026-07-22 18:06:17', '2026-07-22 18:06:17'),
	(14, '3206111', 'Puspahiang', '-7.416990547704877', '108.04722398938989', 'Puspahiang, Kec. Puspahiang, Kabupaten Tasikmalaya, Jawa Barat 46471', '2026-07-22 18:06:17', '2026-07-22 18:06:17'),
	(15, '3206061', 'Parungponteng', '-7.497611457618918', '108.15216165392388', 'Parungponteng, Tasikmalaya, Kabupaten Tasikmalaya, Jawa Barat 46185', '2026-07-22 18:06:17', '2026-07-22 18:06:17'),
	(16, '3206040', 'Pancatengah', '-7.658046440938771', '108.27193171816582', 'Jl. Raya Pancatengha, Cibongas, Kec. Pancatengah, Kabupaten Tasikmalaya, Jawa Barat 46194', '2026-07-22 18:06:17', '2026-07-22 18:06:17'),
	(17, '3206270', 'Pagerageung', '-7.113117286803503', '108.16299598087078', 'Jl. Raya Pagerageung , Pagerageung, Kec. Pagerageung, Kabupaten Tasikmalaya, Jawa Barat 46158', '2026-07-22 18:06:17', '2026-07-22 18:06:17'),
	(18, '3206212', 'Padakembang', '-7.308682988594887', '108.12142380216507', 'Jalan Batubeulah No. 1, Cibenda, Cisaruni, Padakembang, Cisaruni, Tasikmalaya, Kabupaten Tasikmalaya, Jawa Barat 46466', '2026-07-22 18:06:17', '2026-07-22 18:06:17'),
	(19, '3206160', 'Manonjaya', '-7.350801557726917', '108.30814143863212', 'Jl. RTA. Prawira Adiningrat No.135, Manonjaya, Kec. Manonjaya, Kabupaten Tasikmalaya, Jawa Barat 46197', '2026-07-22 18:06:17', '2026-07-22 18:06:17'),
	(20, '3206192', 'Mangunreja', '-7.366141951736557', '108.09296912740257', 'Jl. Kaum Selatan, Mangunreja, Kec. Mangunreja, Kabupaten Tasikmalaya, Jawa Barat 46462', '2026-07-22 18:06:17', '2026-07-22 18:06:17'),
	(21, '3206210', 'Leuwisari', '-7.336650743829924', '108.10123123796505', 'Arjasari, Kec. Leuwisari, Kabupaten Tasikmalaya, Jawa Barat 46464', '2026-07-22 18:06:17', '2026-07-22 18:06:17'),
	(22, '3206020', 'Karangnunggal', '-7.626725807612244', '108.13448774310511', 'Jl. Raya Karangnunggal, Karangnunggal, Kec. Karangnunggal, Kabupaten Tasikmalaya, Jawa Barat 46186', '2026-07-22 18:06:17', '2026-07-22 18:06:17'),
	(23, '3206151', 'Karangjaya', '-7.433529801019394', '108.39097611851835', 'Karangjaya, Kec. Karangjaya, Kabupaten Tasikmalaya, Jawa Barat 46198', '2026-07-22 18:06:17', '2026-07-22 18:06:17'),
	(24, '3206261', 'Kadipaten', '-7.117829910350352', '108.13205734603346', 'Jl. Raya Lkr. Gentong No.17, Buniasih, Kec. Kadipaten, Kabupaten Tasikmalaya, Jawa Barat 46156', '2026-07-22 18:06:17', '2026-07-22 18:06:17'),
	(25, '3206141', 'Jatiwaras', '-7.484579284903829', '108.2328192544092', 'Jl. Raya Salopa, Jatiwaras, Kec. Jatiwaras, Kabupaten Tasikmalaya, Jawa Barat 46185', '2026-07-22 18:06:17', '2026-07-22 18:06:17'),
	(26, '3206250', 'Jamanis', '-7.189581016596397', '108.18264233335519', 'Jl. Raya Jamanis No.33, Tanjungmekar, Kec. Jamanis, Kabupaten Tasikmalaya, Jawa Barat 46175', '2026-07-22 18:06:17', '2026-07-22 18:06:17'),
	(27, '3206161', 'Gunungtanjung', '-7.415033685596093', '108.28347315040351', 'Jl. Raya Gn. Tj., Tanjungsari, Kec. Gunungtanjung, Kabupaten Tasikmalaya, Jawa Barat 46418', '2026-07-22 18:06:17', '2026-07-22 18:06:17'),
	(28, '3206072', 'Culamega', '-7.611077711632018', '108.05137688202139', 'Cintabodas, Kec. Culamega, Kabupaten Tasikmalaya, Jawa Barat 46188', '2026-07-22 18:06:17', '2026-07-22 18:06:17'),
	(29, '3206230', 'Cisayong', '-7.26042973799209', '108.15866475823783', 'Jl. Raya Cisayong No.20, Cisayong, Kec. Cisayong, Kabupaten Tasikmalaya, Jawa Barat 46153', '2026-07-22 18:06:17', '2026-07-22 18:06:17'),
	(30, '3206010', 'Cipatujah', '-7.733562082191605', '108.0194341835027', 'Jl. Raya Cipatujah No.16, Cipatujah, Kec. Cipatujah, Kabupaten Tasikmalaya, Jawa Barat 46189', '2026-07-22 18:06:17', '2026-07-22 18:06:17'),
	(31, '3206150', 'Cineam', '-7.4086271948193945', '108.35948388970664', 'Jl. Karanglayung, Cijulang, Kec. Cineam, Kabupaten Tasikmalaya, Jawa Barat 46198', '2026-07-22 18:06:17', '2026-07-22 18:06:17'),
	(32, '3206050', 'Cikatomas', '-7.622740240817114', '108.25749820242524', 'Pakemitan, Kec. Cikatomas, Kabupaten Tasikmalaya, Jawa Barat 46193', '2026-07-22 18:06:17', '2026-07-22 18:06:17'),
	(33, '3206030', 'Cikalong', '-7.762954456294539', '108.17359743068118', 'Jl. Cikalong 55-96, Cikalong, Kec. Cikalong, Kabupaten Tasikmalaya, Jawa Barat 46195', '2026-07-22 18:06:17', '2026-07-22 18:06:17'),
	(34, '3206200', 'Cigalontang', '-7.35244787406974', '108.0318920604152', 'Jayapura, Kec. Cigalontang, Kabupaten Tasikmalaya, Jawa Barat 46463', '2026-07-22 18:06:17', '2026-07-22 18:06:17'),
	(35, '3206060', 'Cibalong', '-7.515024535624832', '108.18236137943114', 'Jl. Raya Karangnunggal No.202, Cibalong, Kec. Cibalong, Kabupaten Tasikmalaya, Jawa Barat 46185', '2026-07-22 18:06:17', '2026-07-22 18:06:17'),
	(36, '3206260', 'Ciawi', '-7.159300977431608', '108.14721417251384', 'Bekanegara Jl. Kusnadi Belanegara No.110, Ciawi, Kec. Ciawi, Kabupaten Tasikmalaya, Jawa Barat 46156', '2026-07-22 18:06:17', '2026-07-22 18:06:17'),
	(37, '3206080', 'Bojonggambir', '-7.502411137085527', '107.96550579649286', 'Mangkonjaya, Kec. Bojonggambir, Kabupaten Tasikmalaya, Jawa Barat', '2026-07-22 18:06:17', '2026-07-22 18:06:17'),
	(38, '3206071', 'Bojongasih', '-7.58091955495792', '108.13063693071193', 'Bojongasih, Kec. Bojongasih, Kabupaten Tasikmalaya, Jawa Barat 46475', '2026-07-22 18:06:17', '2026-07-22 18:06:17'),
	(39, '3206070', 'Bantarkalong', '-7.621626338044874', '108.10979574913526', 'Jl. Pemuda, Hegarwangi, Kec. Bantarkalong, Kabupaten Tasikmalaya, Jawa Barat 46187', '2026-07-22 18:06:17', '2026-07-22 18:06:17');

-- Dumping structure for table db_uptd_parkir.migrations
CREATE TABLE IF NOT EXISTS `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_uptd_parkir.migrations: ~16 rows (approximately)
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
	(1, '0001_01_01_000000_create_users_table', 1),
	(2, '0001_01_01_000001_create_cache_table', 1),
	(3, '0001_01_01_000002_create_jobs_table', 1),
	(4, '2026_01_04_125526_create_permission_tables', 1),
	(5, '2026_01_04_155709_create_settings_table', 1),
	(6, '2026_01_10_143347_revoke_operator_permissions', 1),
	(7, '2026_01_16_092016_create_personal_access_tokens_table', 1),
	(8, '2026_07_21_125740_create_struktur_organisasi_personel_table', 1),
	(9, '2026_07_21_125745_create_kecamatans_table', 1),
	(10, '2026_07_21_125749_create_wilayah_parkir_table', 1),
	(11, '2026_07_21_125800_create_tarif_parkir_karcis_table', 1),
	(12, '2026_07_21_125808_create_panduan_jukir_table', 1),
	(13, '2026_07_22_000002_create_galeri_fotos_table', 1),
	(14, '2026_07_22_000003_create_beritas_table', 1),
	(15, '2026_07_23_000001_create_galeri_foto_items_table', 2),
	(16, '2026_07_23_000002_create_pengunjungs_table', 3);

-- Dumping structure for table db_uptd_parkir.model_has_permissions
CREATE TABLE IF NOT EXISTS `model_has_permissions` (
  `permission_id` bigint unsigned NOT NULL,
  `model_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`permission_id`,`model_id`,`model_type`),
  KEY `model_has_permissions_model_id_model_type_index` (`model_id`,`model_type`),
  CONSTRAINT `model_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_uptd_parkir.model_has_permissions: ~0 rows (approximately)

-- Dumping structure for table db_uptd_parkir.model_has_roles
CREATE TABLE IF NOT EXISTS `model_has_roles` (
  `role_id` bigint unsigned NOT NULL,
  `model_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`role_id`,`model_id`,`model_type`),
  KEY `model_has_roles_model_id_model_type_index` (`model_id`,`model_type`),
  CONSTRAINT `model_has_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_uptd_parkir.model_has_roles: ~2 rows (approximately)
INSERT INTO `model_has_roles` (`role_id`, `model_type`, `model_id`) VALUES
	(1, 'App\\Models\\User', 1),
	(2, 'App\\Models\\User', 2);

-- Dumping structure for table db_uptd_parkir.panduan_jukir
CREATE TABLE IF NOT EXISTS `panduan_jukir` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `foto` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `deskripsi` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `teks_info` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_uptd_parkir.panduan_jukir: ~4 rows (approximately)
INSERT INTO `panduan_jukir` (`id`, `foto`, `deskripsi`, `teks_info`, `created_at`, `updated_at`) VALUES
	(1, 'panduan-jukir/Z3N3RcgNxG1Y8MIIAKVYz9jqMvOYQBSkqSa7W8Fn.png', 'Rompi keselamatan warna oranye dengan garis reflektif dan identitas UPTD, agar petugas mudah terlihat di jalan.', 'Rompi Resmi', '2026-07-22 18:06:18', '2026-07-22 20:57:25'),
	(2, 'panduan-jukir/topi-dinas.png', 'Topi/peci seragam resmi sebagai bagian dari atribut kerja juru parkir binaan UPTD.', 'Topi Dinas', '2026-07-22 18:06:18', '2026-07-22 18:06:18'),
	(3, 'panduan-jukir/id-card.png', 'Kartu identitas resmi berlogo Pemkab Tasikmalaya, mencantumkan nama dan nomor registrasi petugas.', 'ID Card', '2026-07-22 18:06:18', '2026-07-22 18:06:18'),
	(4, 'panduan-jukir/peluit.png', 'Alat bantu resmi untuk mengatur arus kendaraan keluar-masuk di titik parkir.', 'Peluit', '2026-07-22 18:06:18', '2026-07-22 18:06:18');

-- Dumping structure for table db_uptd_parkir.password_reset_tokens
CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_uptd_parkir.password_reset_tokens: ~0 rows (approximately)

-- Dumping structure for table db_uptd_parkir.pengunjungs
CREATE TABLE IF NOT EXISTS `pengunjungs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `session_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `referer` text COLLATE utf8mb4_unicode_ci,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `device` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `browser` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `platform` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tanggal` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `pengunjungs_ip_address_index` (`ip_address`),
  KEY `pengunjungs_session_id_index` (`session_id`),
  KEY `pengunjungs_tanggal_index` (`tanggal`)
) ENGINE=InnoDB AUTO_INCREMENT=154 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_uptd_parkir.pengunjungs: ~151 rows (approximately)
INSERT INTO `pengunjungs` (`id`, `ip_address`, `session_id`, `url`, `referer`, `user_agent`, `device`, `browser`, `platform`, `tanggal`, `created_at`, `updated_at`) VALUES
	(1, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/dokumentasi', 'http://127.0.0.1:8000/dokumentasi', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 06:57:24', '2026-07-23 06:57:24'),
	(2, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/dashboard/berita', 'http://127.0.0.1:8000/dashboard/berita', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 06:57:25', '2026-07-23 06:57:25'),
	(3, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/dashboard/berita', 'http://127.0.0.1:8000/dashboard/berita', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 06:58:29', '2026-07-23 06:58:29'),
	(4, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/dashboard/berita', 'http://127.0.0.1:8000/dashboard/berita', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 06:59:11', '2026-07-23 06:59:11'),
	(5, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/dokumentasi', 'http://127.0.0.1:8000/dokumentasi', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 06:59:12', '2026-07-23 06:59:12'),
	(6, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/dashboard/berita', 'http://127.0.0.1:8000/dashboard/berita', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 06:59:37', '2026-07-23 06:59:37'),
	(7, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/dokumentasi', 'http://127.0.0.1:8000/dokumentasi', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 06:59:38', '2026-07-23 06:59:38'),
	(8, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000', 'http://127.0.0.1:8000/dokumentasi', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:00:00', '2026-07-23 07:00:00'),
	(9, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/wilayah-parkir', 'http://127.0.0.1:8000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:00:18', '2026-07-23 07:00:18'),
	(10, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/panduan-jukir', 'http://127.0.0.1:8000/wilayah-parkir', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:00:22', '2026-07-23 07:00:22'),
	(11, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000', 'http://127.0.0.1:8000/panduan-jukir', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:00:30', '2026-07-23 07:00:30'),
	(12, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000', 'http://127.0.0.1:8000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:01:52', '2026-07-23 07:01:52'),
	(13, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/dashboard/berita', 'http://127.0.0.1:8000/dashboard/berita', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:01:53', '2026-07-23 07:01:53'),
	(14, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/dashboard/berita', 'http://127.0.0.1:8000/dashboard/berita', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:04:18', '2026-07-23 07:04:18'),
	(15, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000', 'http://127.0.0.1:8000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:04:22', '2026-07-23 07:04:22'),
	(16, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/dashboard/berita', 'http://127.0.0.1:8000/dashboard/berita', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:04:38', '2026-07-23 07:04:38'),
	(17, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000', 'http://127.0.0.1:8000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:04:42', '2026-07-23 07:04:42'),
	(18, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000', 'http://127.0.0.1:8000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:06:32', '2026-07-23 07:06:32'),
	(19, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/dashboard/berita', 'http://127.0.0.1:8000/dashboard/berita', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:06:33', '2026-07-23 07:06:33'),
	(20, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/dashboard/tarif-parkir', 'http://127.0.0.1:8000/dashboard/berita', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:06:48', '2026-07-23 07:06:48'),
	(21, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/wilayah-parkir', 'http://127.0.0.1:8000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:07:21', '2026-07-23 07:07:21'),
	(22, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/wilayah-parkir?search=singaparna', 'http://127.0.0.1:8000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:10:04', '2026-07-23 07:10:04'),
	(23, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/wilayah-parkir', 'http://127.0.0.1:8000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:10:52', '2026-07-23 07:10:52'),
	(24, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000', 'http://127.0.0.1:8000/wilayah-parkir', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:10:56', '2026-07-23 07:10:56'),
	(25, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/tarif-parkir', 'http://127.0.0.1:8000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:11:24', '2026-07-23 07:11:24'),
	(26, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000', 'http://127.0.0.1:8000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:11:45', '2026-07-23 07:11:45'),
	(27, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/tarif-parkir', 'http://127.0.0.1:8000/', 'Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36', 'Mobile', 'Chrome', 'Android', '2026-07-23', '2026-07-23 07:18:44', '2026-07-23 07:18:44'),
	(28, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000', 'http://127.0.0.1:8000/tarif-parkir', 'Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Mobile Safari/537.36', 'Mobile', 'Chrome', 'Android', '2026-07-23', '2026-07-23 07:18:48', '2026-07-23 07:18:48'),
	(29, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000', 'http://127.0.0.1:8000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:22:27', '2026-07-23 07:22:27'),
	(30, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/dashboard/tarif-parkir', 'http://127.0.0.1:8000/dashboard/tarif-parkir', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:22:28', '2026-07-23 07:22:28'),
	(31, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/struktur-organisasi', 'http://127.0.0.1:8000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:24:48', '2026-07-23 07:24:48'),
	(32, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/tarif-parkir', 'http://127.0.0.1:8000/struktur-organisasi', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:25:27', '2026-07-23 07:25:27'),
	(33, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000', 'http://127.0.0.1:8000/tarif-parkir', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:25:46', '2026-07-23 07:25:46'),
	(34, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/wilayah-parkir', 'http://127.0.0.1:8000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:25:51', '2026-07-23 07:25:51'),
	(35, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/tarif-parkir', 'http://127.0.0.1:8000/wilayah-parkir', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:27:16', '2026-07-23 07:27:16'),
	(36, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/tarif-parkir', 'http://127.0.0.1:8000/tarif-parkir', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:27:32', '2026-07-23 07:27:32'),
	(37, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/dashboard/tarif-parkir', 'http://127.0.0.1:8000/dashboard/tarif-parkir', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:27:34', '2026-07-23 07:27:34'),
	(38, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/wilayah-parkir', 'http://127.0.0.1:8000/tarif-parkir', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:29:01', '2026-07-23 07:29:01'),
	(39, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/tarif-parkir', 'http://127.0.0.1:8000/wilayah-parkir', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:29:09', '2026-07-23 07:29:09'),
	(40, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/panduan-jukir', 'http://127.0.0.1:8000/wilayah-parkir', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:29:11', '2026-07-23 07:29:11'),
	(41, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/struktur-organisasi', 'http://127.0.0.1:8000/wilayah-parkir', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:29:12', '2026-07-23 07:29:12'),
	(42, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/dokumentasi', 'http://127.0.0.1:8000/wilayah-parkir', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:29:13', '2026-07-23 07:29:13'),
	(43, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/dashboard/tarif-parkir', 'http://127.0.0.1:8000/dashboard/tarif-parkir', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:29:19', '2026-07-23 07:29:19'),
	(44, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/dashboard/tarif-parkir', 'http://127.0.0.1:8000/dashboard/tarif-parkir', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:29:54', '2026-07-23 07:29:54'),
	(45, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/wilayah-parkir', 'http://127.0.0.1:8000/wilayah-parkir', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:29:56', '2026-07-23 07:29:56'),
	(46, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/dashboard/tarif-parkir', 'http://127.0.0.1:8000/dashboard/tarif-parkir', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:30:18', '2026-07-23 07:30:18'),
	(47, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/dashboard/settings/app', 'http://127.0.0.1:8000/dashboard/tarif-parkir', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:30:25', '2026-07-23 07:30:25'),
	(48, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/tarif-parkir', 'http://127.0.0.1:8000/tarif-parkir', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:30:39', '2026-07-23 07:30:39'),
	(49, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000', 'http://127.0.0.1:8000/wilayah-parkir', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:31:07', '2026-07-23 07:31:07'),
	(50, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/panduan-jukir', 'http://127.0.0.1:8000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:31:13', '2026-07-23 07:31:13'),
	(51, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/wilayah-parkir', 'http://127.0.0.1:8000/panduan-jukir', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:31:17', '2026-07-23 07:31:17'),
	(52, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000', 'http://127.0.0.1:8000/panduan-jukir', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:31:18', '2026-07-23 07:31:18'),
	(53, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000', 'http://127.0.0.1:8000/wilayah-parkir', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:31:21', '2026-07-23 07:31:21'),
	(54, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/dashboard/settings/app', 'http://127.0.0.1:8000/dashboard/settings/app', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:31:44', '2026-07-23 07:31:44'),
	(55, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/dokumentasi', 'http://127.0.0.1:8000/dokumentasi', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:31:44', '2026-07-23 07:31:44'),
	(56, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/dokumentasi', 'http://127.0.0.1:8000/dokumentasi', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:31:50', '2026-07-23 07:31:50'),
	(57, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/dashboard/settings/app', 'http://127.0.0.1:8000/dashboard/settings/app', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:31:54', '2026-07-23 07:31:54'),
	(58, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/dashboard/settings/app', 'http://127.0.0.1:8000/dashboard/settings/app', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:32:18', '2026-07-23 07:32:18'),
	(59, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/dokumentasi', 'http://127.0.0.1:8000/dokumentasi', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:32:49', '2026-07-23 07:32:49'),
	(60, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/dashboard/settings/app', 'http://127.0.0.1:8000/dashboard/settings/app', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:33:18', '2026-07-23 07:33:18'),
	(61, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/dokumentasi', 'http://127.0.0.1:8000/dokumentasi', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:33:50', '2026-07-23 07:33:50'),
	(62, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/dashboard/settings/app', 'http://127.0.0.1:8000/dashboard/settings/app', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:34:18', '2026-07-23 07:34:18'),
	(63, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/tarif-parkir', 'http://127.0.0.1:8000/tarif-parkir', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:34:23', '2026-07-23 07:34:23'),
	(64, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000', 'http://127.0.0.1:8000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:34:24', '2026-07-23 07:34:24'),
	(65, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/dashboard/settings/app', 'http://127.0.0.1:8000/dashboard/settings/app', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:34:25', '2026-07-23 07:34:25'),
	(66, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/struktur-organisasi', 'http://127.0.0.1:8000/struktur-organisasi', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:34:26', '2026-07-23 07:34:26'),
	(67, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/panduan-jukir', 'http://127.0.0.1:8000/panduan-jukir', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:34:27', '2026-07-23 07:34:27'),
	(68, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/panduan-jukir', 'http://127.0.0.1:8000/panduan-jukir', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:34:30', '2026-07-23 07:34:30'),
	(69, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/tarif-parkir', 'http://127.0.0.1:8000/tarif-parkir', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:34:31', '2026-07-23 07:34:31'),
	(70, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000', 'http://127.0.0.1:8000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:34:31', '2026-07-23 07:34:31'),
	(71, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/struktur-organisasi', 'http://127.0.0.1:8000/struktur-organisasi', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:34:32', '2026-07-23 07:34:32'),
	(72, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/tarif-parkir', 'http://127.0.0.1:8000/tarif-parkir', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:34:39', '2026-07-23 07:34:39'),
	(73, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/struktur-organisasi', 'http://127.0.0.1:8000/struktur-organisasi', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:34:40', '2026-07-23 07:34:40'),
	(74, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000', 'http://127.0.0.1:8000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:34:41', '2026-07-23 07:34:41'),
	(75, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/panduan-jukir', 'http://127.0.0.1:8000/panduan-jukir', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:34:42', '2026-07-23 07:34:42'),
	(76, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/dokumentasi', 'http://127.0.0.1:8000/dokumentasi', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:34:51', '2026-07-23 07:34:51'),
	(77, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/dokumentasi', 'http://127.0.0.1:8000/dokumentasi', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:35:05', '2026-07-23 07:35:05'),
	(78, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/struktur-organisasi', 'http://127.0.0.1:8000/struktur-organisasi', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:35:05', '2026-07-23 07:35:05'),
	(79, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/dashboard/settings/app', 'http://127.0.0.1:8000/dashboard/settings/app', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:35:06', '2026-07-23 07:35:06'),
	(80, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/dashboard/settings/app', 'http://127.0.0.1:8000/dashboard/settings/app', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:37:15', '2026-07-23 07:37:15'),
	(81, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/dashboard/roles', 'http://127.0.0.1:8000/dashboard/settings/app', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:37:22', '2026-07-23 07:37:22'),
	(82, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/dashboard/roles/2/edit', 'http://127.0.0.1:8000/dashboard/roles', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:37:25', '2026-07-23 07:37:25'),
	(83, '127.0.0.1', 'wCYXGZIKfFuqnk25Un2ZMopR7sIVEUAZsz75VyWF', 'http://127.0.0.1:8000', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:37:39', '2026-07-23 07:37:39'),
	(84, '127.0.0.1', 'wCYXGZIKfFuqnk25Un2ZMopR7sIVEUAZsz75VyWF', 'http://127.0.0.1:8000/login', 'http://127.0.0.1:8000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:37:44', '2026-07-23 07:37:44'),
	(85, '127.0.0.1', 'tquhweFxtgZMnoJUVtEDQAq5cwiuEJ7vnnJnNhFX', 'http://127.0.0.1:8000/dashboard', 'http://127.0.0.1:8000/login', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:37:51', '2026-07-23 07:37:51'),
	(86, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/panduan-jukir', 'http://127.0.0.1:8000/panduan-jukir', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:38:09', '2026-07-23 07:38:09'),
	(87, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/struktur-organisasi', 'http://127.0.0.1:8000/struktur-organisasi', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:38:13', '2026-07-23 07:38:13'),
	(88, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/tarif-parkir', 'http://127.0.0.1:8000/tarif-parkir', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:38:20', '2026-07-23 07:38:20'),
	(89, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/dashboard/roles/2/edit', 'http://127.0.0.1:8000/dashboard/roles/2/edit', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:38:21', '2026-07-23 07:38:21'),
	(90, '127.0.0.1', 'tquhweFxtgZMnoJUVtEDQAq5cwiuEJ7vnnJnNhFX', 'http://127.0.0.1:8000/dashboard', 'http://127.0.0.1:8000/dashboard', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:38:22', '2026-07-23 07:38:22'),
	(91, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000', 'http://127.0.0.1:8000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:38:23', '2026-07-23 07:38:23'),
	(92, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/dokumentasi', 'http://127.0.0.1:8000/dokumentasi', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:38:50', '2026-07-23 07:38:50'),
	(93, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/dashboard/roles/2/edit', 'http://127.0.0.1:8000/dashboard/roles/2/edit', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:38:51', '2026-07-23 07:38:51'),
	(94, '127.0.0.1', 'tquhweFxtgZMnoJUVtEDQAq5cwiuEJ7vnnJnNhFX', 'http://127.0.0.1:8000/dashboard/settings/profile', 'http://127.0.0.1:8000/dashboard', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:39:02', '2026-07-23 07:39:02'),
	(95, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/panduan-jukir', 'http://127.0.0.1:8000/panduan-jukir', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:39:09', '2026-07-23 07:39:09'),
	(96, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/struktur-organisasi', 'http://127.0.0.1:8000/struktur-organisasi', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:39:14', '2026-07-23 07:39:14'),
	(97, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/panduan-jukir', 'http://127.0.0.1:8000/panduan-jukir', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:39:35', '2026-07-23 07:39:35'),
	(98, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/struktur-organisasi', 'http://127.0.0.1:8000/struktur-organisasi', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:39:36', '2026-07-23 07:39:36'),
	(99, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/dokumentasi', 'http://127.0.0.1:8000/dokumentasi', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:39:37', '2026-07-23 07:39:37'),
	(100, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/dokumentasi', 'http://127.0.0.1:8000/dokumentasi', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:39:49', '2026-07-23 07:39:49'),
	(101, '127.0.0.1', 'tquhweFxtgZMnoJUVtEDQAq5cwiuEJ7vnnJnNhFX', 'http://127.0.0.1:8000/dashboard/settings/profile', 'http://127.0.0.1:8000/dashboard/settings/profile', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:40:02', '2026-07-23 07:40:02'),
	(102, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000', 'http://127.0.0.1:8000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:40:03', '2026-07-23 07:40:03'),
	(103, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/tarif-parkir', 'http://127.0.0.1:8000/tarif-parkir', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:40:04', '2026-07-23 07:40:04'),
	(104, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/dashboard/roles/2/edit', 'http://127.0.0.1:8000/dashboard/roles/2/edit', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:40:05', '2026-07-23 07:40:05'),
	(105, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/panduan-jukir', 'http://127.0.0.1:8000/panduan-jukir', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:40:11', '2026-07-23 07:40:11'),
	(106, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/struktur-organisasi', 'http://127.0.0.1:8000/struktur-organisasi', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:40:16', '2026-07-23 07:40:16'),
	(107, '127.0.0.1', 'tquhweFxtgZMnoJUVtEDQAq5cwiuEJ7vnnJnNhFX', 'http://127.0.0.1:8000/dashboard/settings/profile', 'http://127.0.0.1:8000/dashboard/settings/profile', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:40:22', '2026-07-23 07:40:22'),
	(108, '127.0.0.1', 'MOfNUWiMgcj5kkJjZ0Vf46OP2cwUXAN5zBYyIMlb', 'http://127.0.0.1:8000', 'http://127.0.0.1:8000/dashboard/settings/profile', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:40:26', '2026-07-23 07:40:26'),
	(109, '127.0.0.1', 'MOfNUWiMgcj5kkJjZ0Vf46OP2cwUXAN5zBYyIMlb', 'http://127.0.0.1:8000/login', 'http://127.0.0.1:8000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:40:30', '2026-07-23 07:40:30'),
	(110, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/panduan-jukir', 'http://127.0.0.1:8000/panduan-jukir', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:40:35', '2026-07-23 07:40:35'),
	(111, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/dokumentasi', 'http://127.0.0.1:8000/dokumentasi', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:40:36', '2026-07-23 07:40:36'),
	(112, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/struktur-organisasi', 'http://127.0.0.1:8000/struktur-organisasi', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:40:37', '2026-07-23 07:40:37'),
	(113, '127.0.0.1', 'IxontYRN7Ib4i3B4rkT8NIVBGFKRNpDzCyrqqynB', 'http://127.0.0.1:8000/dashboard', 'http://127.0.0.1:8000/login', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:40:38', '2026-07-23 07:40:38'),
	(114, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/panduan-jukir', 'http://127.0.0.1:8000/panduan-jukir', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:40:45', '2026-07-23 07:40:45'),
	(115, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/dokumentasi', 'http://127.0.0.1:8000/dokumentasi', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:40:46', '2026-07-23 07:40:46'),
	(116, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/struktur-organisasi', 'http://127.0.0.1:8000/struktur-organisasi', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:40:47', '2026-07-23 07:40:47'),
	(117, '127.0.0.1', 'IxontYRN7Ib4i3B4rkT8NIVBGFKRNpDzCyrqqynB', 'http://127.0.0.1:8000/dashboard/settings/profile', 'http://127.0.0.1:8000/dashboard', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:40:51', '2026-07-23 07:40:51'),
	(118, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/panduan-jukir', 'http://127.0.0.1:8000/panduan-jukir', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:41:09', '2026-07-23 07:41:09'),
	(119, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/struktur-organisasi', 'http://127.0.0.1:8000/struktur-organisasi', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:41:13', '2026-07-23 07:41:13'),
	(120, '127.0.0.1', 'IxontYRN7Ib4i3B4rkT8NIVBGFKRNpDzCyrqqynB', 'http://127.0.0.1:8000/dashboard/settings/profile', 'http://127.0.0.1:8000/dashboard/settings/profile', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:41:29', '2026-07-23 07:41:29'),
	(121, '127.0.0.1', 'IxontYRN7Ib4i3B4rkT8NIVBGFKRNpDzCyrqqynB', 'http://127.0.0.1:8000/dashboard/settings/app', 'http://127.0.0.1:8000/dashboard/settings/profile', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:41:31', '2026-07-23 07:41:31'),
	(122, '127.0.0.1', 'IxontYRN7Ib4i3B4rkT8NIVBGFKRNpDzCyrqqynB', 'http://127.0.0.1:8000/dashboard/struktur-organisasi', 'http://127.0.0.1:8000/dashboard/settings/app', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:41:37', '2026-07-23 07:41:37'),
	(123, '127.0.0.1', 'IxontYRN7Ib4i3B4rkT8NIVBGFKRNpDzCyrqqynB', 'http://127.0.0.1:8000/dashboard/berita', 'http://127.0.0.1:8000/dashboard/struktur-organisasi', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:41:45', '2026-07-23 07:41:45'),
	(124, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/dokumentasi', 'http://127.0.0.1:8000/dokumentasi', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:41:49', '2026-07-23 07:41:49'),
	(125, '127.0.0.1', 'IxontYRN7Ib4i3B4rkT8NIVBGFKRNpDzCyrqqynB', 'http://127.0.0.1:8000/dashboard/berita', 'http://127.0.0.1:8000/dashboard/berita', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:42:09', '2026-07-23 07:42:09'),
	(126, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/panduan-jukir', 'http://127.0.0.1:8000/panduan-jukir', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:42:10', '2026-07-23 07:42:10'),
	(127, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/struktur-organisasi', 'http://127.0.0.1:8000/struktur-organisasi', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:42:13', '2026-07-23 07:42:13'),
	(128, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/panduan-jukir', 'http://127.0.0.1:8000/panduan-jukir', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:42:17', '2026-07-23 07:42:17'),
	(129, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/tarif-parkir', 'http://127.0.0.1:8000/tarif-parkir', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:42:19', '2026-07-23 07:42:19'),
	(130, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/dokumentasi', 'http://127.0.0.1:8000/dokumentasi', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:42:20', '2026-07-23 07:42:20'),
	(131, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/berita/1', 'http://127.0.0.1:8000/dokumentasi', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:42:29', '2026-07-23 07:42:29'),
	(132, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000', 'http://127.0.0.1:8000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:42:30', '2026-07-23 07:42:30'),
	(133, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/struktur-organisasi', 'http://127.0.0.1:8000/struktur-organisasi', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:43:13', '2026-07-23 07:43:13'),
	(134, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000', 'http://127.0.0.1:8000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:43:30', '2026-07-23 07:43:30'),
	(135, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/struktur-organisasi', 'http://127.0.0.1:8000/struktur-organisasi', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:44:14', '2026-07-23 07:44:14'),
	(136, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000', 'http://127.0.0.1:8000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:44:30', '2026-07-23 07:44:30'),
	(137, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/struktur-organisasi', 'http://127.0.0.1:8000/struktur-organisasi', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:45:14', '2026-07-23 07:45:14'),
	(138, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000', 'http://127.0.0.1:8000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:45:30', '2026-07-23 07:45:30'),
	(139, '127.0.0.1', 'IxontYRN7Ib4i3B4rkT8NIVBGFKRNpDzCyrqqynB', 'http://127.0.0.1:8000/dashboard/berita', 'http://127.0.0.1:8000/dashboard/berita', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:45:54', '2026-07-23 07:45:54'),
	(140, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/struktur-organisasi', 'http://127.0.0.1:8000/struktur-organisasi', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:46:14', '2026-07-23 07:46:14'),
	(141, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000', 'http://127.0.0.1:8000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:46:31', '2026-07-23 07:46:31'),
	(142, '127.0.0.1', 'IxontYRN7Ib4i3B4rkT8NIVBGFKRNpDzCyrqqynB', 'http://127.0.0.1:8000/dashboard/berita', 'http://127.0.0.1:8000/dashboard/berita', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:46:32', '2026-07-23 07:46:32'),
	(143, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/berita/1', 'http://127.0.0.1:8000/dokumentasi', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:46:37', '2026-07-23 07:46:37'),
	(144, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/berita/tetst', 'http://127.0.0.1:8000/berita/1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:46:48', '2026-07-23 07:46:48'),
	(145, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/struktur-organisasi', 'http://127.0.0.1:8000/struktur-organisasi', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:47:14', '2026-07-23 07:47:14'),
	(146, '127.0.0.1', 'IxontYRN7Ib4i3B4rkT8NIVBGFKRNpDzCyrqqynB', 'http://127.0.0.1:8000/dashboard/berita', 'http://127.0.0.1:8000/dashboard/berita', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:47:17', '2026-07-23 07:47:17'),
	(147, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/berita/1', 'http://127.0.0.1:8000/dokumentasi', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:47:21', '2026-07-23 07:47:21'),
	(148, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000', 'http://127.0.0.1:8000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:47:30', '2026-07-23 07:47:30'),
	(149, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/struktur-organisasi', 'http://127.0.0.1:8000/struktur-organisasi', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:48:14', '2026-07-23 07:48:14'),
	(150, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000', 'http://127.0.0.1:8000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:48:30', '2026-07-23 07:48:30'),
	(151, '127.0.0.1', 'IxontYRN7Ib4i3B4rkT8NIVBGFKRNpDzCyrqqynB', 'http://127.0.0.1:8000/dashboard/berita', 'http://127.0.0.1:8000/dashboard/berita', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:48:44', '2026-07-23 07:48:44'),
	(152, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000/struktur-organisasi', 'http://127.0.0.1:8000/struktur-organisasi', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:49:14', '2026-07-23 07:49:14'),
	(153, '127.0.0.1', 'gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 'http://127.0.0.1:8000', 'http://127.0.0.1:8000/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'Desktop', 'Chrome', 'Windows', '2026-07-23', '2026-07-23 07:49:30', '2026-07-23 07:49:30');

-- Dumping structure for table db_uptd_parkir.permissions
CREATE TABLE IF NOT EXISTS `permissions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guard_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `permissions_name_guard_name_unique` (`name`,`guard_name`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_uptd_parkir.permissions: ~31 rows (approximately)
INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES
	(1, 'view-users', 'web', '2026-07-22 18:06:16', '2026-07-22 18:06:16'),
	(2, 'create-user', 'web', '2026-07-22 18:06:16', '2026-07-22 18:06:16'),
	(3, 'edit-user', 'web', '2026-07-22 18:06:16', '2026-07-22 18:06:16'),
	(4, 'delete-user', 'web', '2026-07-22 18:06:16', '2026-07-22 18:06:16'),
	(5, 'manage-roles', 'web', '2026-07-22 18:06:16', '2026-07-22 18:06:16'),
	(6, 'view-profile', 'web', '2026-07-22 18:06:16', '2026-07-22 18:06:16'),
	(7, 'edit-profile', 'web', '2026-07-22 18:06:16', '2026-07-22 18:06:16'),
	(8, 'view-wilayah-parkir', 'web', '2026-07-22 18:06:16', '2026-07-22 18:06:16'),
	(9, 'create-wilayah-parkir', 'web', '2026-07-22 18:06:16', '2026-07-22 18:06:16'),
	(10, 'edit-wilayah-parkir', 'web', '2026-07-22 18:06:16', '2026-07-22 18:06:16'),
	(11, 'delete-wilayah-parkir', 'web', '2026-07-22 18:06:16', '2026-07-22 18:06:16'),
	(12, 'view-struktur-organisasi', 'web', '2026-07-22 18:06:16', '2026-07-22 18:06:16'),
	(13, 'create-struktur-organisasi', 'web', '2026-07-22 18:06:16', '2026-07-22 18:06:16'),
	(14, 'edit-struktur-organisasi', 'web', '2026-07-22 18:06:16', '2026-07-22 18:06:16'),
	(15, 'delete-struktur-organisasi', 'web', '2026-07-22 18:06:16', '2026-07-22 18:06:16'),
	(16, 'view-tarif-parkir', 'web', '2026-07-22 18:06:16', '2026-07-22 18:06:16'),
	(17, 'create-tarif-parkir', 'web', '2026-07-22 18:06:16', '2026-07-22 18:06:16'),
	(18, 'edit-tarif-parkir', 'web', '2026-07-22 18:06:16', '2026-07-22 18:06:16'),
	(19, 'delete-tarif-parkir', 'web', '2026-07-22 18:06:16', '2026-07-22 18:06:16'),
	(20, 'view-panduan-jukir', 'web', '2026-07-22 18:06:16', '2026-07-22 18:06:16'),
	(21, 'create-panduan-jukir', 'web', '2026-07-22 18:06:16', '2026-07-22 18:06:16'),
	(22, 'edit-panduan-jukir', 'web', '2026-07-22 18:06:16', '2026-07-22 18:06:16'),
	(23, 'delete-panduan-jukir', 'web', '2026-07-22 18:06:16', '2026-07-22 18:06:16'),
	(24, 'view-galeri-foto', 'web', '2026-07-22 18:06:16', '2026-07-22 18:06:16'),
	(25, 'create-galeri-foto', 'web', '2026-07-22 18:06:16', '2026-07-22 18:06:16'),
	(26, 'edit-galeri-foto', 'web', '2026-07-22 18:06:16', '2026-07-22 18:06:16'),
	(27, 'delete-galeri-foto', 'web', '2026-07-22 18:06:16', '2026-07-22 18:06:16'),
	(28, 'view-berita', 'web', '2026-07-22 18:06:16', '2026-07-22 18:06:16'),
	(29, 'create-berita', 'web', '2026-07-22 18:06:16', '2026-07-22 18:06:16'),
	(30, 'edit-berita', 'web', '2026-07-22 18:06:16', '2026-07-22 18:06:16'),
	(31, 'delete-berita', 'web', '2026-07-22 18:06:16', '2026-07-22 18:06:16');

-- Dumping structure for table db_uptd_parkir.personal_access_tokens
CREATE TABLE IF NOT EXISTS `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_uptd_parkir.personal_access_tokens: ~0 rows (approximately)

-- Dumping structure for table db_uptd_parkir.roles
CREATE TABLE IF NOT EXISTS `roles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guard_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_name_guard_name_unique` (`name`,`guard_name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_uptd_parkir.roles: ~2 rows (approximately)
INSERT INTO `roles` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES
	(1, 'admin', 'web', '2026-07-22 18:06:16', '2026-07-22 18:06:16'),
	(2, 'user', 'web', '2026-07-22 18:06:16', '2026-07-22 18:06:16');

-- Dumping structure for table db_uptd_parkir.role_has_permissions
CREATE TABLE IF NOT EXISTS `role_has_permissions` (
  `permission_id` bigint unsigned NOT NULL,
  `role_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`permission_id`,`role_id`),
  KEY `role_has_permissions_role_id_foreign` (`role_id`),
  CONSTRAINT `role_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `role_has_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_uptd_parkir.role_has_permissions: ~55 rows (approximately)
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES
	(1, 1),
	(2, 1),
	(3, 1),
	(4, 1),
	(5, 1),
	(6, 1),
	(7, 1),
	(8, 1),
	(9, 1),
	(10, 1),
	(11, 1),
	(12, 1),
	(13, 1),
	(14, 1),
	(15, 1),
	(16, 1),
	(17, 1),
	(18, 1),
	(19, 1),
	(20, 1),
	(21, 1),
	(22, 1),
	(23, 1),
	(24, 1),
	(25, 1),
	(26, 1),
	(27, 1),
	(28, 1),
	(29, 1),
	(30, 1),
	(31, 1),
	(8, 2),
	(9, 2),
	(10, 2),
	(11, 2),
	(12, 2),
	(13, 2),
	(14, 2),
	(15, 2),
	(16, 2),
	(17, 2),
	(18, 2),
	(19, 2),
	(20, 2),
	(21, 2),
	(22, 2),
	(23, 2),
	(24, 2),
	(25, 2),
	(26, 2),
	(27, 2),
	(28, 2),
	(29, 2),
	(30, 2),
	(31, 2);

-- Dumping structure for table db_uptd_parkir.sessions
CREATE TABLE IF NOT EXISTS `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_uptd_parkir.sessions: ~2 rows (approximately)
INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
	('gaEcBBppB2XQtTzjFp6Su0D3Yp5hIBL3sFnUpbhZ', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'YTo1OntzOjY6Il90b2tlbiI7czo0MDoiWFZkN25SYjE4S3pSV0Z2dGpYeWloRllWN1RadjQyQTJhcTdPT1Y3WiI7czozOiJ1cmwiO2E6MDp7fXM6OToiX3ByZXZpb3VzIjthOjI6e3M6MzoidXJsIjtzOjIxOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAiO3M6NToicm91dGUiO3M6MTA6ImZlLmJlcmFuZGEiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX1zOjUwOiJsb2dpbl93ZWJfNTliYTM2YWRkYzJiMmY5NDAxNTgwZjAxNGM3ZjU4ZWE0ZTMwOTg5ZCI7aToxO30=', 1784818170),
	('IxontYRN7Ib4i3B4rkT8NIVBGFKRNpDzCyrqqynB', 2, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoia3lNMVVRRzNTY0Y1ZnE4T29neFNad1hHNnBUb3FOdlVpekNiakhHWCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6Mjt9', 1784818124);

-- Dumping structure for table db_uptd_parkir.settings
CREATE TABLE IF NOT EXISTS `settings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `settings_key_unique` (`key`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_uptd_parkir.settings: ~5 rows (approximately)
INSERT INTO `settings` (`id`, `key`, `value`, `created_at`, `updated_at`) VALUES
	(1, 'app_name', 'UPTD Pengelola Parkir', NULL, '2026-07-23 07:37:15'),
	(2, 'primary_color', '#4f46e5', NULL, '2026-07-23 07:37:15'),
	(3, 'wa_number', '6281234567890', NULL, '2026-07-23 07:37:15'),
	(4, 'wa_message', 'Halo UPTD Parkir Kab. Tasikmalaya, saya ingin membuat laporan.\r\n#Nama: \r\n#Lokasi Kejadian: \r\n#Jenis Pelanggaran (Tarif Getok/Jukir Liar/Tanpa Karcis): \r\n#Bukti Foto/Video:', NULL, '2026-07-23 07:37:15'),
	(5, 'teks_hak_pengguna_parkir', 'Masyarakat berhak menolak membayar retribusi parkir apabila petugas/juru parkir tidak mengenakan seragam atribut resmi atau tidak menyerahkan karcis resmi bercetak Pemerintah Kabupaten Tasikmalaya.', NULL, '2026-07-23 07:37:15');

-- Dumping structure for table db_uptd_parkir.struktur_organisasi_personel
CREATE TABLE IF NOT EXISTS `struktur_organisasi_personel` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nama` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nip` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `jabatan` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `foto` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_uptd_parkir.struktur_organisasi_personel: ~6 rows (approximately)
INSERT INTO `struktur_organisasi_personel` (`id`, `nama`, `nip`, `jabatan`, `foto`, `created_at`, `updated_at`) VALUES
	(1, 'Drs. H. Ahmad Fauzi, M.Si', '197503121998031002', 'Kepala UPTD Pengelola Parkir', 'personel/1VcfcK8usYMXtetz8Lw9abuPnwWE8YbwGY8BaRaB.png', '2026-07-22 18:06:18', '2026-07-22 22:07:05'),
	(2, 'Budi Santoso, S.STP', '198205142006041005', 'Kasubag Tata Usaha UPTD', NULL, '2026-07-22 18:06:18', '2026-07-22 18:06:18'),
	(3, 'Rian Hidayat', '199008202015031001', 'Kolektor Wilayah 1', NULL, '2026-07-22 18:06:18', '2026-07-22 18:06:18'),
	(4, 'Hendra Wijaya', '199211102018011003', 'Kolektor Wilayah 2', NULL, '2026-07-22 18:06:18', '2026-07-22 18:06:18'),
	(5, 'Dadan Ramdani', '199402152020021004', 'Kolektor Wilayah 3', NULL, '2026-07-22 18:06:18', '2026-07-22 18:06:18'),
	(6, 'Asep Saepuloh', '199507052021031006', 'Kolektor Wilayah 4', NULL, '2026-07-22 18:06:18', '2026-07-22 18:06:18');

-- Dumping structure for table db_uptd_parkir.tarif_parkir_karcis
CREATE TABLE IF NOT EXISTS `tarif_parkir_karcis` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `kategori_kendaraan` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nominal_tarif` bigint unsigned NOT NULL,
  `keterangan` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `foto` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_uptd_parkir.tarif_parkir_karcis: ~3 rows (approximately)
INSERT INTO `tarif_parkir_karcis` (`id`, `kategori_kendaraan`, `nominal_tarif`, `keterangan`, `foto`, `created_at`, `updated_at`) VALUES
	(1, 'Sepeda Motor (Roda 2)', 2000, '/ sekali parkir', 'tarif-parkir/karcis-motor.png', '2026-07-22 18:06:18', '2026-07-22 18:06:18'),
	(2, 'Mobil (Roda 4)', 3000, '/ sekali parkir', 'tarif-parkir/karcis-mobil.png', '2026-07-22 18:06:18', '2026-07-22 18:06:18'),
	(3, 'Bus / Truk', 5000, '/ sekali parkir', 'tarif-parkir/karcis-bus.png', '2026-07-22 18:06:18', '2026-07-22 18:06:18');

-- Dumping structure for table db_uptd_parkir.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `profile_photo_path` varchar(2048) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_uptd_parkir.users: ~2 rows (approximately)
INSERT INTO `users` (`id`, `name`, `username`, `email`, `email_verified_at`, `password`, `profile_photo_path`, `remember_token`, `created_at`, `updated_at`) VALUES
	(1, 'Admin IP', 'admin', 'admin@gmail.com', NULL, '$2y$12$DO671P77/6/QA3p.ZA/2IOba2yzuIc6KtoLqzz2sKBErKSQAW4HTi', NULL, NULL, '2026-07-22 18:06:17', '2026-07-22 18:06:17'),
	(2, 'User', 'user', 'user@gmail.com', NULL, '$2y$12$nGgXRWlDlVPMX42/XI3I2O6/uSFiBQdUe1KwuPzRPU6UIJQtNQybW', NULL, NULL, '2026-07-22 18:06:17', '2026-07-23 07:41:28');

-- Dumping structure for table db_uptd_parkir.wilayah_parkir
CREATE TABLE IF NOT EXISTS `wilayah_parkir` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `kecamatan_id` bigint unsigned DEFAULT NULL,
  `nama_jalan` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `latitude` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `longitude` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `wilayah_parkir_kecamatan_id_foreign` (`kecamatan_id`),
  CONSTRAINT `wilayah_parkir_kecamatan_id_foreign` FOREIGN KEY (`kecamatan_id`) REFERENCES `kecamatans` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table db_uptd_parkir.wilayah_parkir: ~15 rows (approximately)
INSERT INTO `wilayah_parkir` (`id`, `kecamatan_id`, `nama_jalan`, `latitude`, `longitude`, `created_at`, `updated_at`) VALUES
	(1, 9, 'Jl. Raya Singaparna No. 45', '-7.352400', '108.112300', '2026-07-22 18:06:17', '2026-07-22 18:06:17'),
	(2, 36, 'Jl. Raya Ciawi Pasar Baru', '-7.154200', '108.134500', '2026-07-22 18:06:17', '2026-07-22 18:06:17'),
	(3, 13, 'Jl. Kerajinan Rajapolah', '-7.218500', '108.193200', '2026-07-22 18:06:17', '2026-07-22 18:06:17'),
	(4, 1, 'Jl. Raya Taraju Pusat Usaha', '-7.459600', '107.982300', '2026-07-22 18:06:17', '2026-07-22 18:06:17'),
	(5, 2, 'Jl. Cibeureum Tanjungjaya', '-7.389200', '108.121800', '2026-07-22 18:06:17', '2026-07-22 18:06:17'),
	(6, 22, 'Jl. Raya Karangnunggal Pasar', '-7.632100', '108.145200', '2026-07-22 18:06:17', '2026-07-22 18:06:17'),
	(7, 30, 'Jl. Pesisir Cipatujah', '-7.745600', '108.012400', '2026-07-22 18:06:17', '2026-07-22 18:06:17'),
	(8, 19, 'Jl. Alun-Alun Manonjaya', '-7.351200', '108.274100', '2026-07-22 18:06:17', '2026-07-22 18:06:17'),
	(9, 29, 'Jl. Stasiun Cisayong', '-7.265400', '108.163200', '2026-07-22 18:06:17', '2026-07-22 18:06:17'),
	(10, 11, 'Jl. Raya Salawu Garut', '-7.391200', '108.024500', '2026-07-22 18:06:17', '2026-07-22 18:06:17'),
	(11, 33, 'Jl. Pantai Cikalong', '-7.684500', '108.223400', '2026-07-22 18:06:17', '2026-07-22 18:06:17'),
	(12, 39, 'Jl. Simpang Bantarkalong', '-7.592300', '108.115400', '2026-07-22 18:06:17', '2026-07-22 18:06:17'),
	(13, 26, 'Jl. Raya Jamanis Utara', '-7.194200', '108.172300', '2026-07-22 18:06:17', '2026-07-22 18:06:17'),
	(14, 6, 'Jl. Raya Sukaraja Pasar', '-7.398500', '108.214500', '2026-07-22 18:06:17', '2026-07-22 18:06:17'),
	(15, 21, 'Jl. Wisata Galunggung Leuwisari', '-7.332100', '108.094500', '2026-07-22 18:06:17', '2026-07-22 18:06:17');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
