//Set year filter on browse buttons (only show things published in last XX years)
var yearFilter = new Date().getFullYear() - 10;

//-----------------------------------HEADER-----------------------------------//
$('#kids_head').wrapInner('<a href="/"></a>');

//Searchbar
$('#searchsubmit').text('').append('<img style="width:80%;" src="https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Magnifying%20glass%20tilted%20left/3D/magnifying_glass_tilted_left_3d.png">');
$('#translControl1').attr('placeholder', 'Look for...');

//Results header
$('#results #opac-main-search, #opac-detail #opac-main-search').removeClass('col-sm-9').addClass('col-6');
$('#results #opac-main-search').after('<div class="col" id="startover-results"><a href="/"><i class="fa fa-repeat" aria-hidden="true"></i> START OVER</a></div>');
$('#opac-detail #opac-main-search').after('<div class="col" id="startover-details"><a href="/"><i class="fa fa-repeat" aria-hidden="true"></i> START OVER</a></div>');

$('#results #kids_head').parent().parent().parent().addClass('head_container').removeClass('row');
$('#results #kids_head').parent().parent().addClass('row').removeClass('col');

//-----------------------------------HOMEPAGE-----------------------------------//
//Hide existing browse categories
$('img[src*="/bywatersolutions/"]').parent().parent().hide();

//-----------------------------------SEARCH RESULTS-----------------------------------//
if ($('#results').length)  {
  
  //Replace period with exclamation mark
  var resultsText = $("#numresults").contents().filter(function() {
  return this.nodeType == Node.TEXT_NODE;
  }).text();

  resultsText = resultsText.replace('.', '!');

  $('#numresults').text(resultsText);
  
  //Add sorts and filters
  var curPage = window.location.href;
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  
  var querystring2 = (querystring === undefined)? '' : querystring;
  
  let offset = params.offset;
  let index = params.idx;
  let sort_by = params.sort_by;
  let count = params.count;
  let limit = (params.limit === null )? '' : params.limit;
  let prevOffset = offset - count;
  
  //Fix broken "Back button"
  $('.page-link[aria-label="Go to the previous page"]').replaceWith('<a class="page-link" href="/cgi-bin/koha/opac-search.pl?idx='+ index + '&amp;q=' + querystring2 + '&amp;limit=' + limit + '&amp;offset=' + prevOffset + '&amp;sort_by=' + sort_by + '&amp;count=' + count +'" aria-label="Go to the previous page"> <i class="fa fa-fw fa-angle-left" aria-hidden="true"></i>  Back</a>');

  //Add query_desc to image links
  $(".coverimages a.p1").each(function() {
   var $this = $(this);       
   var _href = $this.attr("href"); 
   $this.attr("href", _href + '&query_desc=');
  });
  
  //Generate links for sort buttons
  var sortNew = new URL(curPage);
  sortNew.searchParams.set("sort_by", "pubdate_dsc");
  var sortNewUrl = sortNew.href;
  
  var sortPop = new URL(curPage);
  sortPop.searchParams.set("sort_by", "popularity_dsc");
  var sortPopUrl = sortPop.href;

  var sortAZ = new URL(curPage);
  sortAZ.searchParams.set("sort_by", "title_az");
  var sortAZUrl = sortAZ.href;
  

  
  //Add sort/filter options to search results
  if ($('#numresults').text() !== "No results found!") {
    $('#numresults').after('<div class="filter_bar"><div class="filter_options"><ul><h2>Sort:</h2><li class="sort_option"><a id="sort-new" href="' + sortNewUrl + '">New</a></li><li class="sort_option"><a id="sort-pop" href="' + sortPopUrl + '">Popular</a></li><li class="sort_option"><a id="sort-az" href="' + sortAZUrl + '">Title</a></li></ul></div><div class="filter_options" id="showme"><ul><h2>Show me:</h2></ul></div></div>');
   }

  //Adjust the X to remove a filter
  $('a[title^="Remove facet"]').addClass('removeX').html('<span><i class="fa fa-times" aria-hidden="true"></i> Clear</span>');
  
  if($('#results #location_id li').children("a").length) {
       $(this).addClass('filter-selected');
   }
  
  $('a[title^="Remove facet"]').each(function(){
    var prev = $(this.previousSibling).remove()[0].textContent;
    var next = $(this.nextSibling).remove()[0].textContent;
  });

  //Relocate and relabel facets
  //Easy > Picture books
  $('#results #location_id a:contains("Juvenile Easy")').parent().parent().appendTo('#showme ul').css('color', 'white').css('display', 'inline-block');
  $('#results #location_id .facet-label:contains("Juvenile Easy")').parent().appendTo('#showme ul').css('color', 'white').css('display', 'inline-block');
  $('.facet-label a:contains("Juvenile Easy")').text('Picture Books');
  $('.facet-label:contains("Juvenile Easy")').text('Picture Books').parent().addClass('filter-selected');
  
  //Beginning reader > Easy readers
  $('#results #location_id a:contains("Juvenile Beginning Reader")').parent().parent().appendTo('#showme ul').css('color', 'white').css('display', 'inline-block');
  $('#results #location_id .facet-label:contains("Juvenile Beginning Reader")').parent().appendTo('#showme ul').css('color', 'white').css('display', 'inline-block');
  $('.facet-label a:contains("Juvenile Beginning Reader")').text('Early Readers');
  $('.facet-label:contains("Juvenile Beginning Reader")').text('Early Readers').parent().addClass('filter-selected');  

  //Juvenile Fiction
  $("#results #location_id a").filter(function() {return $(this).text() === "Juvenile Fiction";}).text('Chapter Books');  
  $("#results #location_id .facet-label").filter(function() {return $(this).text() === "Juvenile Fiction";}).text('Chapter Books');
  $('.facet-label a[title*="140500JUVFIC"]').parent().parent().appendTo('#showme ul').css('color', 'white').css('display', 'inline-block');
  $('li a[title="Remove facet Juvenile Fiction"]').parent().appendTo('#showme ul').addClass('filter-selected');

  /*
  //Juvenile Large Print
  $("#results .facet-label a").filter(function() {return $(this).text() === "Large Print Juvenile Fiction";}).text('Large Print Chapter Books'); 
  $("#results .facet-label").filter(function() {return $(this).text() === "Large Print Juvenile Fiction";}).text('Large Print Chapter Books'); 
  $('.facet-label a[title*="140800JUVFICLP"]').parent().parent().appendTo('#showme ul').css('color', 'white').css('display', 'inline-block');
  $('li a[title="Remove facet 140800JUVFICLP"]').parent().appendTo('#showme ul').addClass('filter-selected');
  */

  //Graphic Novels
  $('#results #location_id a:contains("Juvenile Graphic Novel")').parent().parent().appendTo('#showme ul').css('color', 'white').css('display', 'inline-block');
  $('#results #location_id .facet-label:contains("Juvenile Graphic Novel")').parent().appendTo('#showme ul').css('color', 'white').css('display', 'inline-block');
  $('.facet-label a:contains("Juvenile Graphic Novel")').text('Graphic Novels');
  $('.facet-label:contains("Juvenile Graphic Novel")').text('Graphic Novels').parent().addClass('filter-selected');  
  
  //Set "New" filter as active
  if (window.location.href.indexOf("pubdate_dsc") > -1) {
    $('#sort-new').parent().addClass('filter-selected');
  }
  
  //Set "Popular" filter as active
  if (window.location.href.indexOf("popularity_dsc") > -1) {
    $('#sort-pop').parent().addClass('filter-selected');
  }
  
  //Set "Title" filter as active
  if (window.location.href.indexOf("title_az") > -1) {
    $('#sort-az').parent().addClass('filter-selected');
  }
  
  //Remove backslashes in titles
  $('.title_resp_stmt').remove();
  $('.title').each(function () {
  let title_text = $(this).text();
  let title_lastChar = title_text.charAt(title_text.length - 2);
    if (title_lastChar == '/') {
    let new_text = title_text.slice(0, -2);
     $(this).text(new_text);
    }
  });
   
}


//-----------------------------------DETAILS-----------------------------------//
  //Remove slashes from the pagination list
  if ($('.nav_results').length) {
    $('#ul_pagination_lists > li > a').each(function () {
      let title_text = $(this).text();
      let title_lastChar = title_text.charAt(title_text.length - 3);
      if (title_lastChar == '/') {
        let new_text = title_text.slice(0, -3);
        $(this).text(new_text);
      }
    });
  }

  $('.l_Results').append('     <i class="fa fa-level-down" aria-hidden="true"></i>');

//-----------------------------------NO RESULTS PAGE-----------------------------------//
//Add browse categories when a search is empty
$('.noresults').after('<div id="kids_browse"></div>');


//-----------------------------------BROWSE CATEGORIES-----------------------------------//

//Animals
$('#kids_browse').append('<div class="subject"><a href="/cgi-bin/koha/opac-search.pl?advsearch=1&idx=su%2Cwrdl&q=animals&weight_search=on&limit=mc-ccode%3AJB&sort_by=pubdate_dsc&limit-yr=' + yearFilter + '-&do=Search"><img alt="sloth" src="https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Sloth/3D/sloth_3d.png"><div class="caption">Animals</div></a></div>');

//Construction
$('#kids_browse').append('<div class="subject"><a href="/cgi-bin/koha/opac-search.pl?idx=su%2Cphr&q=construction&weight_search=on&limit=mc-ccode%3AJB&sort_by=pubdate_dsc&limit-yr=' + yearFilter + '-&do=Search"><img alt="construction crane" src="https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Building%20construction/3D/building_construction_3d.png"><div class="caption">Construction</div></a></div>');

//Dinosaurs
$('#kids_browse').append('<div class="subject"><a href="/cgi-bin/koha/opac-search.pl?idx=su%2Cphr&q=dinosaurs&weight_search=on&limit=mc-ccode%3AJB&sort_by=pubdate_dsc&limit-yr=' + yearFilter + '-&do=Search"><img alt="tyrannosaurus" src="https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/T-rex/3D/t-rex_3d.png"><div class="caption">Dinosaurs</div></a></div>');

//Fairy Tales
$('#kids_browse').append('<div class="subject"><a href="/cgi-bin/koha/opac-search.pl?idx=su%2Cphr&q=fairy+tales&weight_search=on&limit=mc-ccode%3AJB&sort_by=pubdate_dsc&limit-yr=' + yearFilter + '-&do=Search"><img alt="fairy" src="https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Woman%20fairy/Medium-Light/3D/woman_fairy_3d_medium-light.png"><div class="caption">Fairy Tales</div></a></div>');

//Feelings
$('#kids_browse').append('<div class="subject"><a href="/cgi-bin/koha/opac-search.pl?idx=kw%2Cwrdl&q=feelings&weight_search=on&limit=mc-ccode%3AJB&sort_by=pubdate_dsc&limit-yr=' + yearFilter + '-&do=Search"><img alt="smiling face" src="https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Smiling%20face%20with%20smiling%20eyes/3D/smiling_face_with_smiling_eyes_3d.png"><div class="caption">Feelings</div></a></div>');

//Friends
$('#kids_browse').append('<div class="subject"><a href="/cgi-bin/koha/opac-search.pl?idx=su%2Cwrdl&q=friends&op=OR&idx=su%2Cwrdl&q=friendship&weight_search=on&limit=mc-ccode%3AJB&sort_by=pubdate_dsc&limit-yr=' + yearFilter + '-&do=Search"><img alt="two hands forming a heart" src="https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Heart%20hands/Default/3D/heart_hands_3d_default.png"><div class="caption">Friends</div></a></div>');

//Gamer
$('#kids_browse').append('<div class="subject"><a href="/cgi-bin/koha/opac-search.pl?idx=kw&q=computer+game&op=OR&idx=su%2Cphr&q=video+games&weight_search=on&limit=mc-ccode%3AJB&sort_by=pubdate_dsc&limit-yr=' + yearFilter + '-&do=Search"><img alt="alien" src="https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Alien%20monster/3D/alien_monster_3d.png"><div class="caption">Gamer</div></a></div>');

//Kansas
$('#kids_browse').append('<div class="subject"><a href="/cgi-bin/koha/opac-search.pl?idx=su%2Cwrdl&q=Kansas&weight_search=on&limit=mc-ccode%3AJB&sort_by=pubdate_dsc&do=Search"><img alt="sunflower" src="https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Sunflower/3D/sunflower_3d.png"><div class="caption">Kansas </a></div>');

//Pirates
$('#kids_browse').append('<div class="subject"><a href="/cgi-bin/koha/opac-search.pl?idx=su%2Cwrdl&q=pirates&weight_search=on&limit=mc-ccode%3AJB&sort_by=pubdate_dsc&limit-yr=' + yearFilter + '-&do=Search"><img alt="black flag with skull and crossbones" src="https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Pirate%20flag/3D/pirate_flag_3d.png"><div class="caption">Pirates</div></a></div>');

//Princesses
$('#kids_browse').append('<div class="subject"><a href="/cgi-bin/koha/opac-search.pl?idx=kw%2Cwrdl&q=princesses&weight_search=on&limit=mc-ccode%3AJB&sort_by=pubdate_dsc&limit-yr=' + yearFilter + '-&do=Search"><img alt="princess" src="https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Princess/Medium-Dark/3D/princess_3d_medium-dark.png"><div class="caption">Princesses</div></a></div>');

//Rhymes
$('#kids_browse').append('<div class="subject"><a href="/cgi-bin/koha/opac-search.pl?idx=su%2Cphr&q=stories+in+rhyme&weight_search=on&limit=mc-ccode%3AJB&sort_by=pubdate_dsc&limit-yr=' + yearFilter + '-&do=Search"><img alt="coconut tree" src="https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Palm%20tree/3D/palm_tree_3d.png"><div class="caption">Rhymes</div></a></div>');

//School
$('#kids_browse').append('<div class="subject"><a href="/cgi-bin/koha/opac-search.pl?idx=su%2Cphr&q=school&weight_search=on&limit=mc-ccode%3AJB&sort_by=pubdate_dsc&limit-yr=' + yearFilter + '-&do=Search"><img alt="teacher holding book" src="https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Teacher/Light/3D/teacher_3d_light.png"><div class="caption">School</div></a></div>');

//Sports
$('#kids_browse').append('<div class="subject"><a href="/cgi-bin/koha/opac-search.pl?idx=su%2Cphr&q=sports&weight_search=on&limit=mc-ccode%3AJB&sort_by=pubdate_dsc&limit-yr=' + yearFilter + '-&do=Search"><img alt="person bouncing a basketball" src="https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Person%20bouncing%20ball/Medium-Light/3D/person_bouncing_ball_3d_medium-light.png"><div class="caption">Sports</div></a></div>');

//Superheroes
$('#kids_browse').append('<div class="subject"><a href="/cgi-bin/koha/opac-search.pl?idx=su%2Cphr&q=superheroes&weight_search=on&limit=mc-ccode%3AJB&sort_by=pubdate_dsc&limit-yr=' + yearFilter + '-&do=Search"><img alt="superhero" src="https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Man%20superhero/Dark/3D/man_superhero_3d_dark.png"><div class="caption">Superheroes</div></a></div>');

//Things that go
$('#kids_browse').append('<div class="subject"><a href="/cgi-bin/koha/opac-search.pl?idx=kw%2Cwrdl&q=trucks&op=OR&idx=kw%2Cwrdl&q=cars&op=OR&idx=kw%2Cwrdl&q=transportation&op=OR&idx=kw%2Cwrdl&q=automobiles&op=OR&idx=kw%2Cwrdl&q=airplanes&op=OR&idx=kw%2Cwrdl&q=submarines&weight_search=on&limit=mc-ccode%3AJB&sort_by=pubdate_dsc&limit-yr=' + yearFilter + '-&do=Search"><img alt="firetruck" src="https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Fire%20engine/3D/fire_engine_3d.png"><div class="caption">Things That Go</div></a></div>');

//-----------------------------------Footer-----------------------------------//
$('#report-koha-url').before('<div class="subfooter"><div class="row"><div class="col subfooter-text">Go to the <a href="https://www.seknfind.org/" target="_blank" rel="noopener">Full Catalog</a></div><div class="col subfooter-text">A service of the <a href="http://www.sekls.org/" target="_blank" rel="noopener">Southeast Kansas Library System</a></div><div class="col subfooter-text"><a href="http://sekls.net/Documents/ConfidentialityPolicy.pdf" target="_blank" rel="noopener">Confidentiality Policy</a></div><div class="col subfooter-text"><a href="https://seklstest.bywatersolutions.com/cgi-bin/koha/opac-reportproblem.pl" class="probreport" target="_blank" rel="noopener"><i class="fa fa-exclamation-triangle fa-icon" aria-hidden="true"></i> Report a problem</a> | Powered by <em><a id="kohalink" href="http://www.koha-community.org/" target="_blank" rel="noopener">koha</a></em></div></div></div>');
