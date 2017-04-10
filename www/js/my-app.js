// Initialize app
var myApp = new Framework7();


// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});


// Pull to refresh content
var ptrContent = $$('.pull-to-refresh-content');
 
	// Add 'refresh' listener on it
ptrContent.on('refresh', function (e) {
    // Emulate 2s loading
    setTimeout(function () {
		getArticles();
		// When loading done, we need to reset it
		myApp.pullToRefreshDone();
	}, 2000);
});




// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    //console.log("Device is ready!");
    
    
    $$('.external-link').on('click, touchend', function(event){
    
    	var ref = cordova.InAppBrowser.open('http://google.com', '_blank', 'location=yes');
    	event.preventDefault();
    });
    
    
    myApp.initPullToRefresh(ptrContent);
    
    
    
    
    getArticles();
});


// Now we need to run the code that will be executed only for About page.

myApp.onPageInit('index', function (page) {
    // Do something here for "about" page
   //console.log(page);
   
});


// Option 1. Using page callback for page (for "about" page in this case) (recommended way):
myApp.onPageInit('article', function (page) {
    // Do something here for "about" page
   
   getArticle(page.query.id);
   //console.log(page);
   
   
   
});

myApp.onPageInit('about', function (page) {
    // Do something here for "about" page
   //console.log(page);
});



function getArticles(){
	$$.ajax({
		url: 'http://spoutly.com/wp-json/wp/v2/posts',
		cache: false,
		dataType: 'json',
		crossDomain: true,
		data: {
			per_page : 10, 
			orderby : 'date',
			sort : 'desc',
			
		},
		success: function(data){
			//console.log(data);
			$$.each(data, function(index, value){
			
				var date = new Date(value.date);
				
				$$('.pre-loader-wrapper').remove();
				
				$$('.article-list').append(
				
      				'<div class="card">'+
  						
  						'<a href="article.html?id='+value.id+'" style="background-image:url('+value.featured_image_url+')" valign="bottom" class="card-header color-white no-border card-featured-image"></a>'+
  						
  						'<div class="card-header card-title"><a href="article.html?id='+value.id+'">'+value.title.rendered+'</a></div>'+
  						
  						'<div class="card-content card-excerpt">'+
    						
    						'<div class="card-content-inner">'+value.raw_excerpt+'...</div>'+
  						'</div>'+
  						'<div class="card-footer">'+date.toDateString() +'</div>'+
					'</div>'
			
				);
			
			});
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
			per_page: 1,
			
			
		},
		success: function(data){
			//console.log(data);
			var content = data[0].content.rendered;
			
			$$('.content-block').html(content);
			
		}
	
	});
}





