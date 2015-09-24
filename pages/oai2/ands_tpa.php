<?php

/**
 * \file
 * \brief classes related to generating RIF-CS XML response file for ANDS from repository.
 * It also serves as an exmaple how class ANDS_RIFCS can be used in a particular case.
 *
 */
require_once('ands_rifcs.php');

/**
 * \brief For creating RIF-CS metadata to meet the requirement of ANDS.
 *
 * Class ANDS_RIFCS provides all essential functionalities for creating ANDS RIF-CS records.
 * The protected member functions are the backbone functions which can be used for creating any ANDS RIF-CS records.
 * At the time of design only data source is database and there is only one set of outputs. Therefore there is only one class has been designed. 
 * Ideally, there should be a separated class for creating actual records which reflect data source and data models.
 *
 * Example usage: publish records meet ANDS RIF-CS requirements
 *
 * \code
 * $metadata_node = $outputObj->create_metadata($cur_record);
 * $obj_node = new ANDS_TPA($outputObj, $metadata_node, $db);
 * try {
 * 	$obj_node->create_obj_node($record[$SQL['set']], $identifier);
 * } catch (Exception $e) {
 * 		echo 'Caught exception: ',  $e->getMessage(), " when adding $identifier\n";
 * } 
 * \endcode
 * \see Code in action can be seen in record_rif.php
 */
class ANDS_TPA extends ANDS_RIFCS {

    //! Type: PDO. The database connection of the data source. 
    //! \see __construct. 
    private $db;

    /**
     * Constructor
     * The first two parameters are used by its parent class ANDS_RIFCS. The third is its own private property.
     *
     * \param $ands_response_doc ANDS_Response_XML. A XML Doc acts as the parent node.
     * \param $metadata_node DOMElement. The meta node which all subsequent nodes will be added to.
     * \param $db Type: PDO. The database connection of the data source.
     */
    function __construct($ands_response_doc, $metadata_node, $db) {
        parent::__construct($ands_response_doc, $metadata_node);
        $this->db = $db;
    }

    /**
     * This is the general entrence of creating actual content. It calls different functions for different type of RIF-CS model.
     * When anything goes wrong, e.g. found no record, or $set_name is not recognised, an exception will be thrown.
     * And for this implementation, data are stored in a database therefore a PDO is needed. But the source can be any.
     *
     * \param $set_name Type: string. The name of set is going to be created. Can be one of activity, collection or party.
     * \param $key Type: string. The main identifier used in ANDS system. There can be other identifier.
     *
     * \see create_activity, create_collection, create_party
     */
    function create_obj_node($set_name, $key) {

        $db = $this->db;
        $set_name = strtolower($set_name);
        if (in_array($set_name, prepare_set_names())) {

            try {
                // Get ori_id and which the original table is:
                $query = "select ori_table_name, ori_id from oai_headers where oai_identifier = '" . $key . "'";
                $res = exec_pdo_query($db, $query);
                $record = $res->fetch(PDO::FETCH_ASSOC);
            } catch (PDOException $e) {
                echo "$key returned no record.\n";
                echo $e->getMessage();
            }
            $processor = "create_metadatatrial";
            $this->create_metadatatrial($record['ori_table_name'], $record['ori_id']);
        } else {
            throw new Exception('Wrong set name was used: ' . $set_name);
        }
    }

    /** The processor for creating metadata node of Activity. Called from create_obj_node.
     * \param $table_name Type: string. The table name will be used to retrieve data from.
     * \param $id_project Type: integer. Internal project id associated to this activity-project.
     * \see Function create_obj_node.
     */
    private function create_metadatatrial($table_name, $key) {
        $db = $this->db;
        $query = sprintf("SELECT * FROM vw_metadata WHERE id = $key");

        try {
            $res = exec_pdo_query($db, $query);
            $record = $res->fetch(PDO::FETCH_ASSOC);

//            $coveragecountry = GetNameAdministrativeDivision($record['coveragecountry']);
//            $coveragesubnational = GetNameAdministrativeDivision($record['coveragesubnational']);
//            $coveragepopulatedplace = GetNameAdministrativeDivision($record['coveragepopulatedplace']);

            $this->addChild($this->working_node, 'dc:title', $record['title']);                                 //Official or unofficial title of the document, data set, image, etc. - (Trial name)
            $this->addChild($this->working_node, 'dc:creator', 'N/A');                             //Creators of the item (person, organization, or service) - (Lead of Project (last, middle, name))
            $this->addChild($this->working_node, 'cg.creator.id', 'N/A');                                          //Used if ORCID, SCOPUS, or other type of creator ID scheme is in use. Used in parallel with cg.creator.ID.type - ()
            $this->addChild($this->working_node, 'cg.creator.id.type', 'N/A');                                     //Used to indicate the type of Creator ID – ex: SCOPUS, ORCID, etc. - ()
            $this->addChild($this->working_node, 'dc:subject', $record['subject']);                             //Subject matter of the research, technologies tested, etc. - (Keywords)
            $this->addChild($this->working_node, 'cg.subject.agrovoc', 'N/A');                                     //AGROVOC subject matter or research area - ()
            $this->addChild($this->working_node, 'cg.subject.domain-specific', 'N/A');                             //Subject matter or research area from domain-specific vocabularies, if missing from AGROVOC - ()
            $this->addChild($this->working_node, 'dc:description.abstract', $record['abstract']);            //Abstract or longer description of the item - (Abstract)
            $this->addChild($this->working_node, 'dc:publisher', 'CCAFS Climate');                                           //Entity responsible for publication, distribution, or imprint - ()
            $this->addChild($this->working_node, 'dc:contributor', 'CIAT');                     //Person, organization, or service making contributions to resource content; Research Centers and offices with which creator(s) are affiliated - (Lead Institution)
            $this->addChild($this->working_node, 'cg.contributor.crp', 'CCAFS');                                     //CGIAR Research Program with which the research is affiliated - ()
//            $this->addChild($this->working_node, 'cg.contributor.funder', $record['contributorfunder']);        //Funder, funding agency or sponsor - (Donor Name)
            $this->addChild($this->working_node, 'cg.contributor.partnerid', 'CIAT, ILRI, IFRPI, PIK, HarvestChoice, IPM');  //Partners, funding agencies, other CGIAR centers - (Implementing Institutions)
            $this->addChild($this->working_node, 'cg.contributor.project', 'Flagship 1');      //Name of project with which the research is affiliated - (Project Name)
            $this->addChild($this->working_node, 'dc:date', 'N/A');                                   //Publication, creation or issue date - the formal publication date in case of manuscripts - ()
            $this->addChild($this->working_node, 'cg.date.embargoenddate', 'N/A');          //Date Project Ends and/or Final Research Output is Public - ()
            $this->addChild($this->working_node, 'dc:type', 'data set');                                        //Nature or genre of item/content; e.g., poster, data set - ()
            $this->addChild($this->working_node, 'dc:format', 'ASCII Grid Format, ESRI-Grid');                                         //File format of item e.g.: PDF; jpg etc. - () 
            $this->addChild($this->working_node, 'dc:identifier', 'oai:ccafs_climate.org:'.$record['id']);                         //Unambiguous reference to resource such as doi, uri - ()
            $this->addChild($this->working_node, 'dc:identifier.citation', '');                                 //Human-readable, standard bibliographic citation for the item - ()
            $this->addChild($this->working_node, 'dc:source', 'N/A');                                              //Journal/conference title; vol., no. (year) - ()
            $this->addChild($this->working_node, 'dc:language', 'EN');                                     //Language of the item; use ISO 639-1 (alpha-2) or ISO 639-2 (alpha-3). - ()
            $this->addChild($this->working_node, 'dc:relation', 'N/A');                           //Supplemental files, e.g. data sets related to publications or larger “whole” - (Suppplemental Information File)
            $this->addChild($this->working_node, 'dc:coverage', 'Global');                           //Geospatial coordinates, countries, regions, sub-regions, chronological period - (Latitude and Longitude)
            $this->addChild($this->working_node, 'dc:coverage.region', 'N/A');                                     //FAO or WorldBank list - ()
            $this->addChild($this->working_node, 'dc:coverage.country', 'N/A');                      //Country/countries related to the data which was collected in resource.  ISO 3166 Standard - (Country)
            $this->addChild($this->working_node, 'dc.coverage.geolocation', 'N/A');              //State, Province, County, District, etc.  GAUL (FAO) - (District/State/Province Level)
            $this->addChild($this->working_node, 'dc:coverage.admin-unit', 'N/A');        //City, Town, Village, etc. - (Village Level)
            $this->addChild($this->working_node, 'dc:coverage.start-date', 'N/A');       //Chronological period: start date of activity described in resource - (Trial implementing period start date)
            $this->addChild($this->working_node, 'dc:coverage.end-date', 'N/A');           //Chronological period: end date of activity described in resource - (Trial implementing period end date)
            $this->addChild($this->working_node, 'dc:rights', 'Creative Commons Attribution-NonCommercial 4.0 International License.');                               //Rights, licensing, permission statement - (License)
        } catch (Exception $e) {
            echo $e->getMessage();
        }
    }

}

function GetNameAdministrativeDivision($val) {
    $Ret = '';
    if ($val != '') {
        $ArrVal = split(",", $val);
        $Ret = $ArrVal[1];
    }
    return $Ret;
}

// end of class ANDS_TPA

