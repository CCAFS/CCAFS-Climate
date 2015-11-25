{include file='head.tpl' jsIncludes=["jquery", "bias_request", "tiptip","modernizr","icheck"] pageTitle="Data - CCAFS Climate" pageDescription="High resolution climate change data for download, downscaled using different methods." keywords="IPCC,data,download,downscaling,high resolution,delta method,climate change,projections,MarkSim,MetOffice,PRECIS"}
{include file='header.tpl' current="data"}


<div id="subheader-image">
  <img src="{$smarty.const.SMARTY_IMG_URI}/ribbon_header_data.gif" />
</div>
<div id="content" class="data" style="margin-bottom:45px">
  <div style="height: 43px;">
    <div style="width:70%; float:left; height: 38px;" >
      <h3>Send request</h3>
    </div>
  </div>

  <hr>
  <p>
    Please review these selected items from request. Once your order is checked, enter a valid email address and click the "SUBMIT ORDER" button to finalize the order. No actual data
    will be emailed directly. Only the links to access your ordered data from an FTP site will be sent.
  </p>

  <table class="reviewTable">
    <thead>
      <tr>
        <th colspan="2">Requested Data Review</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="var">Geographic location</td>
        <td class="val">Lon: {$lon}, Lat: {$lat}</td>
      </tr>
      <tr>
        <td class="var">GCM File Set</td>
        <td class="val">Raw GCM CMIP5 daily</td>
      </tr>
      <tr>
        <td class="var">Scenario</td>
        <td class="val">{$scenariosAcronym}</td>
      </tr>
      <tr>
        <td class="var">Model</td>
        <td class="val">{$models}</td>
      </tr>
      <tr>
        <td class="var">Observation dataset</td>
        <td class="val">{$observationAcronym}</td>
      </tr>
      <tr>
        <td class="var">Period historical</td>
        <td class="val">{$periodh}</td>
      </tr>
      <tr>
        <td class="var">Period future</td>
        <td class="val">{$period}</td>
      </tr>
      <tr>
        <td class="var">Variables</td>
        <td class="val">{$variablesAcronym}</td>
      </tr>
      <tr>
        <td class="var">Correction Method</td>
        <td class="val">{$methodAcronym}</td>
      </tr>
      <tr>
        <td class="var">Ouput formats</td>
        <td class="val">{$formatsAcronym}</td>
      </tr>
    </tbody>
  </table>

  <h2>Enter email address</h2>
  <p>
    Please enter your email address. This is the address to which your data links and information regarding this order will be sent.
  </p>
  <form id="sentform" method="POST" action="/bias-corrected-request.php">
    <input type="hidden" name="lat" id="lat" value="{$lat}">
    <input type="hidden" name="lon" id="lon" value="{$lon}">
    <input type="hidden" name="fileSet" id="fileSet" value="{$fileSets}">
    <input type="hidden" name="scenarios" id="scenarios" value="{$scenarios}">
    <input type="hidden" name="model" id="model" value="{$models}">
    <input type="hidden" name="observation" id="observation" value="{$observation}">
    <input type="hidden" name="periodh" id="periodh" value="{$periodh}">
    <input type="hidden" name="period" id="period" value="{$period}">
    <input type="hidden" name="variables" id="variables" value="{$variables}">
    <input type="hidden" name="method" id="method" value="{$method}">
    <input type="hidden" name="formats" id="formats" value="{$formats}">
    <div class="boxblock clearfix">
      <label for="email">Email address</label>
      <input type="email" class="emailIcon" name="email" id="email" />
      <br>
      <label for="email_ver">Verify Email address</label>
      <input type="email" class="emailIcon" name="email_ver" id="email_ver">
      <br>
      <div class="setCookieDesc">
        CCAFS will not share your email address with anyone. The email address will not be used for any purpuse other than communicating order status
      </div>   
      <br>   
      <button id="download-button-bottom" class="download-button" type="submit" >SUBMIT ORDER</button>
      <br><br>
    </div>
  </form>

</div>


{include file='footer.tpl'}