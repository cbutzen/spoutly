// Initialize app
var myApp = new Framework7();

var postIds = [];

// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true,
    cache: false
});


// Pull to refresh content
var ptrContent = $$('.pull-to-refresh-content');
 
	// Add 'refresh' listener on it
ptrContent.on('refresh', function (e) {
    // Emulate 2s loading
    setTimeout(function () {
		
		
		getArticles('refresh');
		// When loading done, we need to reset it
		myApp.pullToRefreshDone();
	}, 2000);
});




// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    //console.log("Device is ready!");
    
 
    getArticles('refresh');
    //myApp.initPullToRefresh(ptrContent);
    
    
    
    
    
});

$$(document).on('click, touchend', '#loadmore', function(event){
	$$(this).addClass('disabled').html('<span class="preloader preloader-white" style="position:relative;top:4px;"></span> Loading...');
	getArticles('loadmore');
});


$$(document).on('click, touchend','.external-link', function(event){
    var url = $$(this).attr('href');
    var ref = cordova.InAppBrowser.open(url, '_blank', 'location=yes');
    ref.show();
});

// Now we need to run the code that will be executed only for About page.




// Option 1. Using page callback for page (for "about" page in this case) (recommended way):
myApp.onPageInit('article', function (page) {

   getArticle(page.query.id);
   
});

myApp.onPageInit('about', function (page) {
  
});

myApp.onPageAfterAnimation('article', function(page){

});



function getArticles(type){
	
	if(type == 'refresh'){
		postIds = [];
    	$$('.article-list').html('');
	}else if(type == 'loadmore'){
	
	}
	
	var excludes = $$.unique(postIds).join(",");
	
	$$.ajax({
		url: 'http://spoutly.com/wp-json/wp/v2/posts/',
		cache: false,
		method: 'GET',
		dataType: 'json',
		crossDomain: true,
		data: {
			per_page : 10, 
			orderby : 'date',
			sort : 'desc',
			exclude : excludes
			
		},
		beforeSend: function(xhr){
			//myApp.alert('Before Send');
		},
		success: function(data, status, xhr){
			//myApp.alert('Success');
			$$.each(data, function(index, value){
			
				var date = new Date(value.date);
								
				postIds.push(value.id);
								
				$$('.article-list').append(
				
      				'<div class="card">'+
  						
  						'<a href="article.html?id='+value.id+'" style="background-image:url('+value.featured_image_url+')" valign="bottom" class="card-header color-white no-border card-featured-image"></a>'+
  						
  						'<div class="card-header card-title"><a href="article.html?id='+value.id+'">'+value.title.rendered+' - '+value.id+'</a></div>'+
  						
  						'<div class="card-content card-excerpt">'+
    						
    						'<div class="card-content-inner">'+value.raw_excerpt+'...</div>'+
  						'</div>'+
  						'<div class="card-footer">'+date.toDateString() +'</div>'+
					'</div>'
			
				);
			
			});
			
			//$$('.article-list').prepend($$.unique(postIds).join(",") +'<br/>');
			
			$$('#loadmore').remove();
			
			$$('.article-list').append('<a href="#" id="loadmore" class="button button-big button-fill">Load More </a>');
			
		},
		error: function(xhr, status){
			//$$('.article-list').prepend(status);
			//myApp.alert(status);
		}
	
	});
	
	
}
	
	

function getArticle(id){
	$$.ajax({
		url: 'http://spoutly.com/wp-json/wp/v2/posts',
		cache: false,
		dataType: 'json',
		crossDomain: true,
		data: {
			include: id,
			per_page: 1
		},
		success: function(data){
			
			//console.log(data);
			var title = data[0].title.rendered;
			var content = data[0].content.rendered;
			var featured_image_url = data[0].featured_image_url;
			
			var featured_image = '<img src="'+featured_image_url+'" />';
			
			$$('.content-block').html('<h2>'+title+'</h2>'+'<div>'+featured_image+'</div>'+content);
			
			$$.each($$('.content-block a'), function (index, url){
				$$(url).addClass('external-link');
			});

			if ( typeof window.instgrm !== 'undefined' ) {
    			window.instgrm.Embeds.process();
			}
			
			if ( typeof window.twttr !== 'undefined' ) {
    			window.twttr.widgets.load();
			}
			
			//Facebook
    		/*if (typeof window.FB !== 'undefined') {
        		window.FB.init({ status: true, cookie: true, xfbml: true });
    		}*/ 
			
		}
	
	});
}





