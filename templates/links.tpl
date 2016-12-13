{include file='head.tpl' jsIncludes=['jquery', 'downscaling'] pageTitle="Links - CCAFS Climate" pageDescription="Links to useful information, datasets and tools related to the CCAFS downscaled data." keywords="CCAFS,tools,datases,downscaling"}
{include file='header.tpl' current="links"}
<div id="subheader-image">
    <img src="{$smarty.const.SMARTY_IMG_URI}/ribbon_header_links.gif" />
</div>
<div id="content" class="links">
    <h3>Links</h3>
    <hr>
    <br>
    <h4>Useful links</h4>

    <p>
        The above links are relevant to obtain or process data, and as support to the downscaling method used to develop the datasets used here:
    </p>
    <ul id="link-list">
        <li type="square">
            <a target="_blank" href="http://dapa.ciat.cgiar.org">
                The CIAT Decision and Policy Analysis (DAPA) program website.
            </a>
        </li>
        <li type="square">
            <a target="_blank" href="http://www.worldclim.org">
                The WorldClim dataset.
            </a>
        </li>
        <li type="square">
            <a target="_blank" href="http://srtm.csi.cgiar.org">
                Hole filled SRTM 90m resolution elevation dataset.
            </a>
        </li>
        <li type="square">
            <a target="_blank" href="http://cru.csi.cgiar.">
                CRU historical climate dataset.
            </a>
        </li>
        <li type="square">
            <a target="_blank" href="http://www.ipcc.ch/publications_and_data/publications_and_data_reports.shtml">
                IPCC fourth assessment report (AR4).
            </a>
        </li>
        <li type="square">
            <a target="_blank" href="http://www.ipcc-data.org">
                The IPCC data distribution centre.
            </a>
        </li>
        <li type="square">
            <a target="_blank" href="https://esg.llnl.gov:8443">
                The IPCC multimodel database (WCRP CMIP3 Multi-Model Data).
            </a>
        </li>
        <li type="square">
            <a target="_blank" href="http://www.diva-gis.org">
                The DIVA-GIS software website (latest version 7.1.7).
            </a>
        </li>
    </ul>
</div>
{include file='footer.tpl'}