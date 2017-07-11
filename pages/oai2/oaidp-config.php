<?php

/**
 * \file
 * \brief Configuration file of current data provider.
 *
 * This is the configuration file for the PHP OAI Data Provider.
 * Please read through the WHOLE file, there are several things, that
 * need to be adjusted.
 *
 *
 * The response may may be compressed for better performace:
 * - Compression : a compression encoding supported by the repository. The recommended values are those defined for the Content-Encoding header in Section 14.11 of RFC 2616 describing HTTP 1.1. A compression element should not be included for the identity encoding, which is implied.
 *
 *
 * Some other used variables:
 *
 * - <B>$adminEmail</B>: the e-mail addresses of administrators of the repository.
 *
 * - <b>$repositoryIdentifier</b> : For a data provider there is only one. For repositories to comply with the oai 
 * format it has to be unique identifiers for items records.  Basically using domainname will be fine.
 * See: http://www.openarchives.org/OAI/2.0/guidelines-oai-identifier.htm.
 *
 * - <b>$SETS</b>: An array with key words . List of supported SETs.
 *
 * - <b>$METADATAFORMATS</b>: List of supported metadata formats. It is a two-dimensional array with keys.
 * Each supported format is one element of this array at the first dimension. 
 * The key is the name of a metadata format.  
 * The exact number of items within each format associated array depends on the nature of a metadata format.
 * Most definitions are done here but handlers themselves are defined in separated files because only the names of PHP script are listed here.
 * 		- metadataPrefix
 * 		- schema
 * 		- metadataNamespace
 * 		- myhandler
 * 		- other optional items: record_prefix, record_namespace and etc. 
 *
 * - <b>$SQL</b>: Settings for database and queries from database
 *
 * - <b>$DSN</b>: DSN for connecting your database. Reference PDO for details.
 *
 * The rest of settings will not normally need to be adjusted. Read source code for details.
 */
/**
 * Whether to show error message for dubug.
 * For installation, testing and debuging set SHOW_QUERY_ERROR to TRUE
 * If set to TRUE, application will die and display query and database error message
 * as soon as there is a problem. Do not set this to TRUE on a production site,
 * since it will show error messages to everybody.
 * If set FALSE, will create XML-output, no matter what happens.
 */
// If everything is running ok, you should use this
define('SHOW_QUERY_ERROR', FALSE);

/**
 * \property CONTENT_TYPE
 * The content-type the WWW-server delivers back. For debug-puposes, "text/plain" 
 * is easier to view. On a production site you should use "text/xml".
 */
#define('CONTENT_TYPE','Content-Type: text/plain');
// If everything is running ok, you should use this
define('CONTENT_TYPE', 'Content-Type: text/xml');

/**
 * Identifier settings. It needs to have proper values to reflect the settings of the data provider.
 *
 * - $identifyResponse['repositoryName'] : compulsory. A human readable name for the repository;
 * - $identifyResponse['baseURL'] : compulsory. The base URL of the repository;
 * - $identifyResponse['protocolVersion'] : compulsory. The version of the OAI-PMH supported by the repository;
 * - $identifyResponse['earliestDatestamp'] : compulsory. A UTCdatetime that is the guaranteed lower limit of all datestamps recording changes, modifications, or deletions in the repository. A repository must not use datestamps lower than the one specified by the content of the earliestDatestamp element. earliestDatestamp must be expressed at the finest granularity supported by the repository.
 * - $identifyResponse['deletedRecord'] : the manner in which the repository supports the notion of deleted records. Legitimate values are no ; transient ; persistent with meanings defined in the section on deletion.
 * - $identifyResponse['granularity'] : the finest harvesting granularity supported by the repository. The legitimate values are YYYY-MM-DD and YYYY-MM-DDThh:mm:ssZ with meanings as defined in ISO8601.
 *
 */
$identifyResponse = array();

// MUST (only one)
// please adjust
//NOMBRE DEL REPOSITORIO - HESPINOSA 17-07-2015
$identifyResponse["repositoryName"] = 'CCAFS Climate Repository';

// For ANDS to harvest of RIF-CS, originatingSource is plantaccelerator.org.au
// $dataSource = "plantaccelerator.org.au";
define('DATASOURCE', 'http://ccafs-climate.org/');

// do not change
define('MY_URI', 'http://' . $_SERVER['SERVER_NAME']. $_SERVER['SCRIPT_NAME']);
// You can use a static URI as well.
// $baseURL 			= "http://my.server.org/oai/oai2.php";
$identifyResponse["baseURL"] = "http://oai2.ccafs-climate.org/oai2.php";

// do not change
$identifyResponse["protocolVersion"] = '2.0';

// MUST (multiple)
// please adjust
// CORREO DE CONTACTO - HESPINOSA - 16-07-2015
$adminEmail = 'ccafsclimate@gmail.com';
$identifyResponse["adminEmail"] = $adminEmail;


// MUST (only one)
// the earliest datestamp in your repository,
// please adjust
// Only date is needed even later it will be formatted according to the granularity.
$identifyResponse["earliestDatestamp"] = '2011-01-01';

// How your repository handles deletions
// no: 			The repository does not maintain status about deletions.
//				It MUST NOT reveal a deleted status.
// persistent:	The repository persistently keeps track about deletions 
//				with no time limit. It MUST consistently reveal the status
//				of a deleted record over time.
// transient:   The repository does not guarantee that a list of deletions is 
//				maintained. It MAY reveal a deleted status for records.
// 
// If your database keeps track of deleted records change accordingly.
// Currently if $record['deleted'] is set to 'true', $status_deleted is set.
// Some lines in listidentifiers.php, listrecords.php, getrecords.php  
// must be changed to fit the condition for your database.
$identifyResponse["deletedRecord"] = 'no';
$deletedRecord = $identifyResponse["deletedRecord"]; // a shorthand for checking the configuration of Deleted Records
// MAY (only one)
//granularity is days
//$granularity          = 'YYYY-MM-DD';
// granularity is seconds
$identifyResponse["granularity"] = 'YYYY-MM-DD';

// this is appended if your granularity is seconds.
// do not change
if (strcmp($identifyResponse["granularity"], 'YYYY-MM-DDThh:mm:ssZ') == 0) {
    $identifyResponse["earliestDatestamp"] = $identifyResponse["earliestDatestamp"] . 'T00:00:00Z';
}



/** Compression methods supported. Optional (multiple). Default: null.
 * 
 * Currently only gzip is supported (you need output buffering turned on, 
 * and php compiled with libgz). 
 * The client MUST send "Accept-Encoding: gzip" to actually receive 
 */
// $compression		= array('gzip');
$compression = null;

// MUST (only one)
// You may choose any name, but for repositories to comply with the oai 
// format it has to be unique identifiers for items records. 
// see: http://www.openarchives.org/OAI/2.0/guidelines-oai-identifier.htm
// Basically use domainname
// please adjust
// REPOSITORIO - HESPINOSA - 16-07-2015
$repositoryIdentifier = 'http://ccafs-climate.org/oai2';

// For RIF-CS, especially with ANDS, each registryObject much has a group for the ownership of data.
// For detail please see ANDS guide on its web site. Each data provider should have only one REG_OBJ_GROUP
// for this purpose.
define('REG_OBJ_GROUP', 'Something agreed on');

// If Identifier needs to show NODE description. It is defined in identify.php 
// You may include details about your community and friends (other
// data-providers).
// Please check identify.php for other possible containers 
// in the Identify response
$show_identifier = false;
// MUST (only one)
// should not be changed. Only useful when NODE description is included in the response to Identifier
$delimiter = ':';


/** Maximum mumber of the records to deliver
 * (verb is ListRecords)
 * If there are more records to deliver
 * a ResumptionToken will be generated.
 */
define('MAXRECORDS', 10);

/** Maximum mumber of identifiers to deliver
 * (verb is ListIdentifiers)
 * If there are more identifiers to deliver
 * a ResumptionToken will be generated.
 */
define('MAXIDS', 40);

/** After 24 hours resumptionTokens become invalid. Unit is second. */
define('TOKEN_VALID', 24 * 3600);
$expirationdatetime = gmstrftime('%Y-%m-%dT%TZ', time() + TOKEN_VALID);
/** Where token is saved and path is included */
define('TOKEN_PREFIX', '/tmp/ANDS_DBPD-');
//define('TOKEN_PREFIX', __FILE__);

// define all supported sets in your repository
$SETS = array(
//    array('setSpec' => 'photo_testimonials', 'setName' => 'Adaptation and mitigation knowledge network'),
//    array('setSpec' => 'video_testimonials', 'setName' => 'Adaptation and mitigation knowledge network'),
    array('setSpec' => 'data set', 'setName' => 'CCAFS Climate')
  );

// define all supported metadata formats, has to be an array
//
// myhandler is the name of the file that handles the request for the 
// specific metadata format.
// [record_prefix] describes an optional prefix for the metadata
// [record_namespace] describe the namespace for this prefix

$METADATAFORMATS = array(
    'oai_dc' => array('metadataPrefix' => 'oai_dc',
        'schema' => 'http://www.openarchives.org/OAI/2.0/oai_dc.xsd',
        'metadataNamespace' => 'http://www.openarchives.org/OAI/2.0/oai_dc/',
        'myhandler' => 'record_dc.php',
        'record_prefix' => 'dc',
        'record_namespace' => 'http://purl.org/dc/elements/1.1/'
    )
);

if (!is_array($METADATAFORMATS)) {
    exit("Configuration of METADATAFORMAT has been wrongly set. Correct your " . __FILE__);
}

// The shorthand of xml schema namespace, no need to change this
define('XMLSCHEMA', 'http://www.w3.org/2001/XMLSchema-instance');

// 
// DATABASE SETUP
//
// change according to your local DB setup.
// DB - HESPINOSA - 16-07-2015
$DB_HOST = '127.0.0.1';
$DB_USER = 'postgres';
$DB_PASSWD = 'bNs2IJ0L6i4h';
$DB_NAME = 'ccafs_climate';


// Data Source Name: This is the universal connection string
// if you use something other than mysql edit accordingly.
// Example for MySQL
// $DSN = "mysql://$DB_USER:$DB_PASSWD@$DB_HOST/$DB_NAME";
// Example for Oracle
// $DSN = "oci8://$DB_USER:$DB_PASSWD@$DB_NAME";

//$DSN = "mysql:host=$DB_HOST;port=5432;dbname=$DB_NAME;user=$DB_USER;password=$DB_PASSWD";
$DSN = "pgsql:host=$DB_HOST;port=5432;dbname=$DB_NAME;user=$DB_USER;password=$DB_PASSWD";

// the charset you store your metadata in your database
// currently only utf-8 and iso8859-1 are supported
$charset = "utf-8";

// if entities such as < > ' " in your metadata has already been escaped 
// then set this to true (e.g. you store < as &lt; in your DB)
$xmlescaped = false;

// We store multiple entries for one element in a single row 
// in the database. SQL['split'] lists the delimiter for these entries.
// If you do not do this, do not define $SQL['split']
// $SQL['split'] = ';'; 
// the name of the table where your store your metadata's header
$SQL['table'] = 'oai_headers';

// the name of the column where you store the unique identifiers
// pointing to your item.
// this is your internal identifier for the item
$SQL['identifier'] = 'oai_identifier';

$SQL['metadataPrefix'] = 'oai_metadataprefix';

// If you want to expand the internal identifier in some way
// use this (but not for OAI stuff, see next line)
$idPrefix = '';

// this is your external (OAI) identifier for the item
// this will be expanded to
// oai:$repositoryIdentifier:$idPrefix$SQL['identifier']
// should not be changed
//
// Commented out 24/11/10 14:19:09 
// $oaiprefix = "oai".$delimiter.$repositoryIdentifier.$delimiter.$idPrefix; 
$oaiprefix = "";


// adjust anIdentifier with sample contents an identifier
// $sampleIdentifier     = $oaiprefix.'anIdentifier';
// the name of the column where you store your datestamps
$SQL['datestamp'] = 'datestamp';

// the name of the column where you store information whether
// a record has been deleted. Leave it as it is if you do not use
// this feature.
$SQL['deleted'] = 'no';

// to be able to quickly retrieve the sets to which one item belongs,
// the setnames are stored for each item
// the name of the column where you store sets
$SQL['set'] = 'oai_set';
?>
