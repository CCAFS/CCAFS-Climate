<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
    <head>
        <title>OAI-PMH - AMKN</title>
        <meta http-equiv="Content-Type" content="text/html;" charset="Windows-1252" />
        <link rel="shortcut icon" href="images/favicon.ico" />
        <link rel="schema.DC" href="http://purl.org/dc/elements/1.1/" />
        <meta content="OAI-PMH - AMKN" name="DC.Title" />
        <meta content="Data Query,Web Page OAI2 " name="DC.Title.alternative" />
        <meta name="DC.Subject" content="Query" /><meta name="DC.Subject" content="búsqueda" />
        <meta name="DC.Subject" content="Agricultural Trial" />
        <meta content="OAI-PMH - AgTrials" name="DC.Publisher" />
        <meta content="2030-12-31 16:3030" name="DC.Date" />
        <meta content="text/html; charset=iso-8859-1" name="DC.Type" />
        <meta content="http://oai2.agtrials.org" name="DC.Identifier" />
        <meta content="En" name="DC.Language" />
        <link href="css/style.css" rel="stylesheet" type="text/css" />
        <script>
            function ListIdentifiers() {
                var url = "oai2.php?verb=ListIdentifiers&metadataPrefix=oai_dc";
                var fromli = document.getElementById("fromli").value;
                var untilli = document.getElementById("untilli").value;
                if (fromli != '')
                    url = url + "&from=" + fromli

                if (untilli != '')
                    url = url + "&until=" + untilli

                win = window.open(url, '_blank');
                win.focus();
                return win;
            }

            function ListRecords() {
                var url = "oai2.php?verb=ListRecords&metadataPrefix=oai_dc";
                var fromlr = document.getElementById("fromlr").value;
                var untillr = document.getElementById("untillr").value;
                if (fromlr != '')
                    url = url + "&from=" + fromlr

                if (untillr != '')
                    url = url + "&until=" + untillr

                win = window.open(url, '_blank');
                win.focus();
                return win;
            }

            function GetRecord() {
                var identifier = document.getElementById("identifier").value;
                if (identifier != '') {
                    var url = "oai2.php?verb=GetRecord&metadataPrefix=oai_dc&identifier=" + identifier;
                    win = window.open(url, '_blank');
                    win.focus();
                    return win;
                }
            }


        </script>
    </head>
    <h2 align="center">Verbs OAI-PMH - CCAFS Climate </h2>
    <div class="centro">
        <form name="FormVerbs" id="FormVerbs" action="">
            <table class="lista2" >
                <tr class="FPar">
                    <td><a href="oai2.php?verb=Identify" target="_blank">Server address</a></td>
                    <td>http://oai2.agtrials.org/oai2.php</td>
                </tr>
                <tr class="FImpar">
                    <td width="20%"><a href="oai2.php?verb=Identify" target="_blank">Identify</a></td>
                    <td>This verb returns general information about trials, the information is used for the OAI-PMH.</td>
                </tr>
                <tr class="FPar">
                    <td><a href="oai2.php?verb=ListSets" target="_blank">ListSets</a></td>
                    <td>This verb provides a list of sets in which records. </td>
                </tr>
                <tr class="FImpar">
                    <td><a href="oai2.php?verb=ListMetadataFormats" target="_blank">ListMetadataFormats</a></td>
                    <td>This verb returns a list of formats supported metadata and the locations of their schemas and namespaces.</td>
                </tr>
                <tr class="FPar">
                    <td><a href="#" onclick="ListIdentifiers();" >ListIdentifiers</a></td>
                    <td>
                        <p>This verb makes a list of all unique identifiers corresponding to records in the repository.</p>
                        <div class="vacio">&nbsp;</div>
                        <ul class="sin">
                            <li>
                                <div class="columna1">from:</div>
                                <div class="columnita">
                                    <input type="text"  name='fromli' id='fromli' size='40' maxlength='40' value='2010-01-01'  class="grande" placeholder="YYYY-MM-DD" />
                                </div></li>
                            <div class="vacio">&nbsp;</div>
                            <li>
                                <div class="columna1">until:</div> 
                                <div class="columnita">
                                    <input type="text"  name='untilli' id='untilli' size='40' maxlength='40' value='2030-12-31'  class="grande" placeholder="YYYY-MM-DD"  />
                                </div>
                            </li>
                            <div class="vacio">&nbsp;</div>
                        </ul>
                    </td>
                </tr>
                <tr class="FImpar">
                    <td><a href="#" onclick="ListRecords();">ListRecords</a></td>
                    <td>
                        <p>This verb retrieves the metadata of multiple records. parameters:</p>
                        <div class="vacio">&nbsp;</div>
                        <ul class="sin">
                            <li>
                                <div class="columna1">from:</div>
                                <div class="columnita">
                                    <input type="text"  name='fromlr' id='fromlr' size='40' maxlength='40' value='2010-01-01'  class="grande" placeholder="YYYY-MM-DD" />
                                </div></li>
                            <div class="vacio">&nbsp;</div>
                            <li>
                                <div class="columna1">until:</div> 
                                <div class="columnita">
                                    <input type="text"  name='untillr' id='untillr' size='40' maxlength='40' value='2030-12-31'  class="grande" placeholder="YYYY-MM-DD"  />
                                </div>
                            </li>
                            <div class="vacio">&nbsp;</div>
                        </ul>
                    </td>
                </tr>
                <tr class="FPar">
                    <td><a href="#" onclick="GetRecord();">GetRecord</a></td>
                    <td>
                        <p>This verb retrieves a record metadata. parameters:</p>
                        <div class="vacio">&nbsp;</div>
                        <ul class="sin">
                            <li>
                                <div class="columna1">Identifiers</div>
                                <div class="columnita">
                                    <input type="text"  name='identifier' id='identifier' size='80' maxlength='80' value=''  style="width:250px;" class="grande"   placeholder="oai:agtrials.org:60"  />
                                </div>
                            </li>
                            <div class="vacio">&nbsp;</div>
                        </ul>
                    </td>
                </tr>
            </table>
        </form>
    </div>
</html>
