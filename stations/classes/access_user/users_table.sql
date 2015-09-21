CREATE TABLE `users` (
  `id` int(11) NOT NULL auto_increment,
  `login` varchar(25) NOT NULL default '',
  `pw` varchar(32) NOT NULL default '',
  `real_name` varchar(32) NOT NULL default '',
  `extra_info` varchar(100) NOT NULL default '',
  `email` varchar(50) NOT NULL default '',
  `tmp_mail` varchar(50) NOT NULL default '',
  `access_level` tinyint(4) NOT NULL default '0',
  `active` enum('y','n','b') NOT NULL default 'n',
  PRIMARY KEY  (`id`),
  UNIQUE KEY `user` (`login`),
  UNIQUE KEY `mail` (`email`)
) TYPE=MyISAM;

#
# admin example record for table `users`
#

INSERT INTO `users` VALUES (NULL, 'administrator', '40be4e59b9a2a2b5dffb918c0e86b3d7', 'The site administrator', '', 'my@mail.com', '', 10, 'y');
