<?php /* Smarty version Smarty-3.1.11, created on 2013-10-08 09:21:52
         compiled from "/home/jramirezv/ccafs-climate.org/templates/contact.tpl" */ ?>
<?php /*%%SmartyHeaderCode:1258012886506ea1fd212f33-97596792%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    'ebbd77bf458653c143ce716cf8cffd9f89d80bf1' => 
    array (
      0 => '/home/jramirezv/ccafs-climate.org/templates/contact.tpl',
      1 => 1381249308,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '1258012886506ea1fd212f33-97596792',
  'function' => 
  array (
  ),
  'version' => 'Smarty-3.1.11',
  'unifunc' => 'content_506ea1fd294e04_64911929',
  'has_nocache_code' => false,
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_506ea1fd294e04_64911929')) {function content_506ea1fd294e04_64911929($_smarty_tpl) {?><?php echo $_smarty_tpl->getSubTemplate ('head.tpl', $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array('pageTitle'=>"Contact - CCAFS Climate",'pageDescription'=>"Who to contact in the case of any problems with downscaled CCAFS datasets.",'keywords'=>"CCAFS,contact,issues,recommendations"), 0);?>

<?php echo $_smarty_tpl->getSubTemplate ('header.tpl', $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array('current'=>"contact"), 0);?>

<div id="subheader-image">
    <img src="<?php echo @SMARTY_IMG_URI;?>
/ribbon_header_contact.gif" />
</div>
<div id="content" class="contact">
    <h3>Contact us</h3>
    <hr>
    <br>
    
    <p>
        If you have any comment or have any particular question regarding the data or the methods, please address an email to the following contact people:
    </p>

    <br>

    <table id="table-contact">
        <tbody>
            <tr>
                <td>
                    <img src="<?php echo @SMARTY_IMG_URI;?>
/contact_ciat.png" />
                    <br>
                    <b>CIAT Data Support</b>
                    <br>
                    <br>
                </td>
                <td>
                    <img src="<?php echo @SMARTY_IMG_URI;?>
/contact_irli_ifpri.png" />
                    <br>
                    <b>IFPRI / ILRI Data Support</b>
                    <br>
                    <br>
                </td>
                <td>
                    <img src="<?php echo @SMARTY_IMG_URI;?>
/contact_ciat.png" />
                    <br>
                    <b>CIAT Technical Support</b>
                    <br>
                    <br>
                </td>
            </tr>
            <tr>
                <td>

                    <b>Carlos Navarro</b>
                    <br>
                    <span class="contact-info">
                        Research Assistant &amp; Web Designer<br>
                        Decision and Policy Analysis (DAPA)<br>
                        International Center for Tropical Agriculture (CIAT)<br>
                        <a href="mailto:c.e.navarro@cgiar.org">c.e.navarro@cgiar.org</a>
                    </span>
                    <br>
                    <br>
                    
                    <b>Jaime Tarapues</b>
                    <br>
                    <span class="contact-info">
                    Technical Support
                    <br>
                    Decision and Policy Analysis (DAPA)
                    <br>
                    International Center for Tropical Agriculture (CIAT)
                    <br>
                    <a href="mailto:j.e.tarapues@cgiar.org ">j.e.tarapues@cgiar.org </a>
                    </span>
                    <br>
                    <br>

                    <b>Julián Ramírez-Villegas</b>
                    <br>
                    <span class="contact-info">
                    Researcher
                    <br>
                    Decision and Policy Analysis (DAPA)
                    <br>
                    International Center for Tropical Agriculture (CIAT)
                    <br>
                    <a href="mailto:j.r.villegas@cgiar.org">j.r.villegas@cgiar.org</a>
                    </span>

                </td>
                <td>
                    <b>Jawoo Koo</b>
                    <br>
                    <span class="contact-info">
                    Senior Research Staff
                    <br>
                    Environment and Production Technology
                    <br>
                    International Food Policy Research Institute
                    <br>
                    <a href="mailto:j.koo@cgiar.org">j.koo@cgiar.org</a>
                    </span>
                </td>
                <td>
                    <b>Héctor Tobón</b>
                    <br>
                    <span class="contact-info">
                    Data Manager &amp; Web Developer
                    <br>
                    Decision and Policy Analysis (DAPA)
                    <br>
                    International Center for Tropical Agriculture (CIAT)
                    <br>
                    <a href="mailto:h.f.tobon@cgiar.org">h.f.tobon@cgiar.org</a>
                    </span>
                </td>
            </tr>
        </tbody>
    </table>

    <br>



</div>
<?php echo $_smarty_tpl->getSubTemplate ('footer.tpl', $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>
<?php }} ?>