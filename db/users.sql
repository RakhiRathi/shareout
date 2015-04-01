SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `email` varchar(100) NOT NULL,
  `name` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--- Default password
--- "00ea1da4192a2030f9ae023de3b3143ed647bbab" is hash of "asdasdasd"
---

INSERT INTO `users` (`id`, `name`, `email`, `password`) VALUES
(3, 'zhomart', 'zhomart@shareout.pw', '00ea1da4192a2030f9ae023de3b3143ed647bbab'),
(5, 'Nadya Ek', 'nadya@yahoo.com', '00ea1da4192a2030f9ae023de3b3143ed647bbab');
