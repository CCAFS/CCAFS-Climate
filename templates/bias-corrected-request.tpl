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

<div class="hd">  Requested Data Review </div>
  <div class="reviewTable">
    
    <table>
        <tbody>
          <tr>
            <th class="var">Geographic location</th>
            <td class="val">Lon: {$lon}, Lat: {$lat}</td>
          </tr>
          <tr>
            <th class="var">GCM File Set</th>
            <td class="val">Raw GCM CMIP5 daily</td>
          </tr>
          <tr>
            <th class="var">Scenario</th>
            <td class="val">{$scenariosAcronym}</td>
          </tr>
          <tr>
            <th class="var">Model</th>
            <td class="val">{$models}</td>
          </tr>
          <tr>
            <th class="var">Observation dataset</th>
            <td class="val">{$observationAcronym}</td>
          </tr>
          <tr>
            <th class="var">Period historical</th>
            <td class="val">{$periodh}</td>
          </tr>
          <tr>
            <th class="var">Period future</th>
            <td class="val">{$period}</td>
          </tr>
          <tr>
            <th class="var">Variables</th>
            <td class="val">{$variablesAcronym}</td>
          </tr>
          <tr>
            <th class="var">Correction Method</th>
            <td class="val">{$methodAcronym}</td>
          </tr>
          <tr>
            <th class="var">Ouput formats</th>
            <td class="val">{$formatsAcronym}</td>
          </tr>
        </tbody>
    </table>

</div>
   
    
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