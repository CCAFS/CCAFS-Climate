CREATE TABLE sessions (
   ses_id varchar(32) NOT NULL default '',
   ses_time int(11) NOT NULL default '0',
   ses_start int(11) NOT NULL default '0',
   ses_value text NOT NULL,
   PRIMARY KEY  (ses_id)
) TYPE=MyISAM; 
