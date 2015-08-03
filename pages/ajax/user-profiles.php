<?php
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$profile = $_REQUEST['profile'];

switch ($profile) {
  case 0:
    ?>
    <h1><strong>Who are you?</strong></h1>
    <div class="profiles-container">
      <div id="policy" class="icon-container">
        <div class="policy icon-l">
        </div>
        <div class="icon-text-l">
          Policy/Deciton-Maker
        </div>
      </div>
      <div id="govermental" class="icon-container">
        <div class="govermental icon-l">
        </div>
        <div class="icon-text-l">
          Governmental Staff
        </div>
      </div>
      <div id="academic" class="icon-container">
        <div class="academic icon-l">
        </div>
        <div class="icon-text-l">
          Academic
        </div>
      </div>
      <div id="researcher" class="icon-container">
        <div class="researcher icon-l">
        </div>
        <div class="icon-text-l">
          Researcher
        </div>
      </div>
    </div>
    <?php
    break;
  case 1:
    ?>
    <h1><strong>Who are you?</strong></h1>
    <div class="profiles-container">
      <div class="icon-detail-container">
        <div id="policy" class="icon-container">
          <div class="policy icon-l">
          </div>
          <div class="icon-text-l">
            Policy/Deciton-Maker
          </div>
        </div>
      </div>
    </div>
    <div class="profile-detail">
      <div class="profile-detail-1">
      
      </div>
      <div class="profile-detail-2">
      
      </div>
    </div>
    <?php
    break;
  case 2:
    ?>
    <h1><strong>Who are you?</strong></h1>
    <div class="profiles-container">
      <div class="icon-detail-container">
        <div id="govermental" class="icon-container">
          <div class="govermental icon-l">
          </div>
          <div class="icon-text-l">
            Governmental Staff
          </div>
        </div>
      </div>
    </div>
    <div class="profile-detail">
      <div class="profile-detail-1">
      
      </div>
      <div class="profile-detail-2">
      
      </div>
    </div>
    <?php
    break;
  case 3:
    ?>
    <h1><strong>Who are you?</strong></h1>
    <div class="profiles-container">
      <div class="icon-detail-container">
        <div id="academic" class="icon-container">
          <div class="academic icon-l">
          </div>
          <div class="icon-text-l">
            Academic
          </div>
        </div>
      </div>
    </div>
    <div class="profile-detail">
      <div class="profile-detail-1">
      
      </div>
      <div class="profile-detail-2">
      
      </div>
    </div>
    <?php
    break;
  case 4:
    ?>
    <h1><strong>Who are you?</strong></h1>
    <div class="profiles-container">
      <div class="icon-detail-container">
        <div id="researcher" class="icon-container">
          <div class="researcher icon-l">
          </div>
          <div class="icon-text-l">
            Researcher
          </div>
        </div>
      </div>
    </div>
    <div class="profile-detail">
      <div class="profile-detail-1">
      
      </div>
      <div class="profile-detail-2">
      
      </div>
    </div>
    <?php
    break;
  default:
    break;
}