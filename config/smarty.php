<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

require_once dirname(__FILE__).'/'.'config.php';

require_once LIB_DIR . '/Smarty-3.1.11/Smarty.class.php';

$smarty = new Smarty();
$smarty->setTemplateDir(WORKSPACE_DIR . '/templates');
$smarty->setCompileDir(WORKSPACE_DIR . '/templates_c');
$smarty->setCacheDir(WORKSPACE_DIR . '/cache');
$smarty->setConfigDir(WORKSPACE_DIR . '/config');

/* FIREPHP Temporal Debugger while developing process */
require_once(LIB_DIR . '/FirePHPCore/FirePHP.class.php');

$firephp = new FirePHP(true); //TODO - Remove this variable when the development of this page finalize.

?>
