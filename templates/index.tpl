{include file='head.tpl' jsIncludes=['jquery', 'index'] pageTitle="CCAFS Climate" pageDescription="Climate change downscaled data portal provided by CIAT and CCAFS." keywords="downscaling,GCM,climate change,CIAT,CCAFS"}
{include file='header.tpl' current="home"}

<div id="content" class="home">
  <table id="sections">
    <tbody>
      <tr>
        <td>
          <a href="/spatial_downscaling/">
            <div id="section">
              <img class="color" src="{$smarty.const.SMARTY_IMG_URI}/icon_spatial_downscaling.png" />
            </div>
          </a>
        </td>
        <td>
          <a href="/spatial_disaggregation/">
            <div id="section">
              <img class="color" src="{$smarty.const.SMARTY_IMG_URI}/icon_spatial_disaggregation.png">
            </div>
          </a>
        </td>
        <td>
          <a href="/downloading_data/">
            <div id="section">
              <img class="color" src="{$smarty.const.SMARTY_IMG_URI}/icon_data.png">
            </div>
          </a>
        </td>
        <td>
          <a href="/documentation/">
            <div id="section">
              <img class="color" src="{$smarty.const.SMARTY_IMG_URI}/icon_docs.png">
            </div>
          </a>
        </td>
        <td>
          <a href="/links/">
            <div id="section">
              <img class="color" src="{$smarty.const.SMARTY_IMG_URI}/icon_links.png">
            </div>
          </a>
        </td>
        <td>
          <a href="/citations/">
            <div id="section">
              <img class="color" src="{$smarty.const.SMARTY_IMG_URI}/icon_citations.png">
            </div>
          </a>
        </td>
        <td>
          <a href="/contact/">
            <div id="section">
              <img class="color" src="{$smarty.const.SMARTY_IMG_URI}/icon_contact.png">
            </div>
          </a>
        </td>
      </tr>
    </tbody>
  </table>
  <div id="content-description">
    <h4>Data Provided by the CGIAR Research Program on Climate Change, Agriculture and Food Security (CCAFS)</h4>
    <p>
      The data distributed here are in ARC GRID, and ARC ASCII format, in decimal degrees and datum WGS84. CCAFS and its partners have processed this data to provide seamless continuous future climate surfaces.
      Users are prohibited from any commercial, non-free resale, or redistribution without explicit written permission from CCAFS or the data-developing institutions.
      Users should acknowledge CCAFS as the source used in the creation of any reports, publications, new data sets, derived products, or services resulting from the use of this data set.
      For commercial access to the data, send requests to <a href="mailto:a.jarvis@cgiar.org">Andy Jarvis</a> at the International Center for Tropical Agriculture (CIAT).
    </p>
    <p>
      These open-access datasets are hosted by <a href="http://aws.amazon.com/datasets/0241269495883982" target="_blank">Amazon Web Services</a>.
    </p>
    <p>
      CCAFS provides these data without any warranty of any kind whatsoever, either express or implied, including warranties of merchantability and fitness for a particular purpose.
      CCAFS shall not be liable for incidental, consequential, or special damages arising out of the use of any data published here.
    </p>
    <p>
    <a rel="license" href="http://creativecommons.org/licenses/by-nc/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc/4.0/88x31.png" /></a><br />This work by <a xmlns:cc="http://creativecommons.org/ns#" href="http://ccafs-climate.org/" property="cc:attributionName" rel="cc:attributionURL">http://ccafs-climate.org/</a> is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc/4.0/">Creative Commons Attribution-NonCommercial 4.0 International License</a>
    </p>
  </div>
</div>
<div class="remodal" style="display:none;" data-remodal-id="modal" data-remodal-options='{ "hashTracking": false }'>
  <div id="whatisamkn" class="modal"> 
    <div class="modal-first modal-whatis">
      <h2><strong>What is CCAFS-Climate?</strong></h2>
      <p>
        The CCAFS-Climate data portal provides users global and regional future high-resolution climate datasets that can help assess the impacts of climate change in a variety of fields related to biodiversity, agriculture in others. 
      </p>
    </div>
    <h2><strong>Who are you?</strong></h2>
    <div class="modal-first modal-whoare">

      {*    <p>  *}
      Applications of CCAFS-Climate data include assessing  agriculture, ecosystem functioning, options for policy-making, food security and adaptation planning, in others. 
      <a id="profiles" href="#">See how CCAFS-Climate can help to your specific field</a>
      {*    <p>*}
      <p class="chkmsg"><input type="checkbox" id="chk_showmsg">&nbsp;Don't show this message again</p>
    </div>
    <div class="modal-first modal-whoare modal-icons">
      <div id="policy" class="icon-container-p">
        <div class="policy icon">
        </div>
        <div class="icon-text">
          Policy/Decision Maker
        </div>
      </div>
      <div id="govermental" class="icon-container-p">
        <div class="govermental icon">
        </div>
        <div class="icon-text">
          Governmental Staff
        </div>
      </div>
      <div id="academic" class="icon-container-p">
        <div class="academic icon">
        </div>
        <div class="icon-text">
          Academic
        </div>
      </div>
      <div id="researcher" class="icon-container-p">
        <div class="researcher icon">
        </div>
        <div class="icon-text">
          Researcher
        </div>
      </div>
      {*      <img src="{$smarty.const.SMARTY_IMG_URI}/modal/policy_decision_maker.png">*}
    </div>
  </div>
  <div>
    <div id="info" class="left">
      <p >For more information on CCAFS-Climate, visit the <a href="/about/">About</a> page.</p>
    </div>
    <div class="buttons">
      <div class="buttons-c">
        <a id="goback1" class="gotoclimate" style="display:none">Back</a>
        <a id="goback" class="gotoclimate" style="display:none">Back</a>
        <a id="gotoclimate" class="gotoclimate">Return to Website</a>
      </div>
    </div>
  </div>
</div>
{include file='footer.tpl'}