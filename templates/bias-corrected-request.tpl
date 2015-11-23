{include file='head.tpl' jsIncludes=["jquery", "tiptip","modernizr","icheck", "map"] pageTitle="Data - CCAFS Climate" pageDescription="High resolution climate change data for download, downscaled using different methods." keywords="IPCC,data,download,downscaling,high resolution,delta method,climate change,projections,MarkSim,MetOffice,PRECIS"}
{include file='header.tpl' current="data"}


<div id="subheader-image">
  <img src="{$smarty.const.SMARTY_IMG_URI}/ribbon_header_data.gif" />
</div>
<div id="content" class="data" style="margin-bottom:45px">
  <div style="height: 43px;">
    <div style="width:70%; float:left; height: 38px;" >
      <h3>Bias request</h3>
    </div>
  </div>

<hr>
<p>
    Please review these selected items from request: dataset, date ranges, output format, data types and selected location.
</p>
<p>
  Once your order is checked, enter a valid email address and click the "SUBMIT ORDER" button to finalize the order. No actual data
  will be emailed directly. Only the links to access your ordered data from an FTP site will be sent.
</p>
<p>
  By submitting this request, you agree with both the disclaimer and the privacy policy.
</p>

<h1>Enter email address</h1>
<p>
  Please enter your email address. This is the address to which your data links and information regarding this order will be sent.
</p>
<form method="POST" action="/bias-corrected-request.php">
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
  <label for="email">Email address</label>
  <input type="email" name="email" id="email">
  <label for="email_ver">Veerify Email address</label>
  <input type="email" name="email_ver" id="email_ver">
  <button id="download-button-bottom" class="download-button" type="submit" >SUBMIT ORDER</button>
</form>
<div>
  CCAFS will not share your email address with anyone. The email address will not be used for any purpuse other than communicating order status
</div>
</div>
{include file='footer.tpl'}