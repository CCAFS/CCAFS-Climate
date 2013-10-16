<?php
	/** 
    *  
    * Author: Khurram Ijaz (khurram@renai-soft.com)
    * Company: Renaissance Software / Intellicomdevelopment.com (info@renai-soft.com)
    * All rights reserved.
    *
    *
    *  
    */

 class ADODB_Iterator implements Iterator {

    private $rs;

    function __construct($rs) 
	{
        $this->rs = $rs;
    }
    function rewind() 
	{
        $this->rs->MoveFirst();
    }

	function valid() 
	{
        return !$this->rs->EOF;
    }
	
    function key() 
	{
        return $this->rs->_currentRow;
    }
	
    function current() 
	{
        return $this->rs->fields;
    }
	
    function next() 
	{
        $this->rs->MoveNext();
    }
	
	function __call($func, $params)
	{
		return call_user_func_array(array($this->rs, $func), $params);
	}

	
	function hasMore()
	{
		return !$this->rs->EOF;
	}

}


class ADODB_BASE_RS implements IteratorAggregate {
    function getIterator() {
        return new ADODB_Iterator($this);
    }
	
	/* this is experimental - i don't really know what to return... */
	function __toString()
	{
		include_once(ADODB_DIR.'/toexport.inc.php');
		return _adodb_export($this,',',',',false,true);
	}
} 

?>