/*! 
 * Roots v 2.0.0
 * Follow me @adanarchila at Codecanyon.net
 * URL: http://codecanyon.net/item/roots-phonegapcordova-multipurpose-hybrid-app/9525999
 * Don't forget to rate Roots if you like it! :)
 */

// In this file we are goint to include all the Controllers our app it's going to need

(function(){
  'use strict';

  var app = angular.module('app', ['onsen','angular-images-loaded','ngMap']);

  // Filter to convert HTML content to string by removing all HTML tags
  app.filter('htmlToPlaintext', function() {
      return function(text) {
        return String(text).replace(/<[^>]+>/gm, '');
      }
    }
  );
    // controlador de conexion a internet
  app.controller('networkController', function($scope){

    // Check if is Offline
    document.addEventListener("offline", function(){

      offlineMessage.show();

      /* 
       * With this line of code you can hide the modal in 8 seconds but the user will be able to use your app
       * If you want to block the use of the app till the user gets internet again, please delete this line.       
       */

      setTimeout('offlineMessage.hide()', 8000);  

    }, false);

    document.addEventListener("online", function(){
      // If you remove the "setTimeout('offlineMessage.hide()', 8000);" you must remove the comment for the line above      
      // offlineMessage.hide();
    });

  });
  
  Storage.prototype.setObject = function(key, value) {
      this.setItem(key, JSON.stringify(value));
  }

  Storage.prototype.getObject = function(key) {
      var value = this.getItem(key);
      return value && JSON.parse(value);
  }
  
  // This directive will allow us to cache all the images that have the img-cache attribute in the <img> tag
  app.directive('imgCache', ['$document', function ($document) {
    return {
      link: function (scope, ele, attrs) {
        var target = $(ele);

        scope.$on('ImgCacheReady', function () {

          ImgCache.isCached(attrs.src, function(path, success){
            if(success){
              ImgCache.useCachedFile(target);
            } else {
              ImgCache.cacheFile(attrs.src, function(){
                ImgCache.useCachedFile(target);
              });
            }
          });
        }, false);

      }
    };
  }]);      

  
  // Controlador Informes
  app.controller('informesController', [ '$http', '$scope', '$rootScope', function($http, $scope, $rootScope){

    // I'm using the same post type video, but you will need another custom post type for this one
    $scope.yourAPI = 'http://www.recorramisiones.com.ar/rutadelaselva/api/get_category_posts/?slug=informes-turisticos'; 
    $scope.items = [];
    $scope.totalPages = 0;
    $scope.currentPage = 1;
    $scope.pageNumber = 1;
    $scope.isFetching = true;
    $scope.lastSavedPage = 0;
    $scope.localSavePrefix = 'informes_';
	$scope.collapsed = false;

	$scope.collapse = function(){
		return $scope.collapsed=!$scope.collapsed;
	}

    // Let's initiate this on the first Controller that will be executed.
    ons.ready(function() {
      
      // Cache Images Setup
      // Set the debug to false before deploying your app
      ImgCache.options.debug = true;

      ImgCache.init(function(){

        //console.log('ImgCache init: success!');
        $rootScope.$broadcast('ImgCacheReady');
        // from within this function you're now able to call other ImgCache methods
        // or you can wait for the ImgCacheReady event

      }, function(){
        //console.log('ImgCache init: error! Check the log for errors');
      });

    });


    $scope.pullContent = function(){
      
      $http.jsonp($scope.yourAPI+'&page='+$scope.pageNumber+'&callback=JSON_CALLBACK').success(function(response) {

        if($scope.pageNumber > response.pages){

          // hide the more news button
          $('#moreButton').fadeOut('fast');  

        } else {

          $scope.items = $scope.items.concat(response.posts);
          window.localStorage.setObject($scope.localSavePrefix+'rootsPosts', $scope.items); // we save the posts in localStorage
          window.localStorage.setItem($scope.localSavePrefix+'rootsDate', new Date());
          window.localStorage.setItem($scope.localSavePrefix+"rootsLastPage", $scope.currentPage);
          window.localStorage.setItem($scope.localSavePrefix+"rootsTotalPages", response.pages);

          // For dev purposes you can remove the comment for the line below to check on the console the size of your JSON in local Storage
          // for(var x in localStorage)console.log(x+"="+((localStorage[x].length * 2)/1024/1024).toFixed(2)+" MB");

          $scope.totalPages = response.pages;
          $scope.isFetching = false;

          if($scope.pageNumber == response.pages){

            // hide the more news button
            $('#moreButton').fadeOut('fast'); 

          }

        }

      });

    }

    $scope.getAllRecords = function(pageNumber){

      $scope.isFetching = true;    

      if (window.localStorage.getItem($scope.localSavePrefix+"rootsLastPage") == null ) {

        $scope.pullContent();

      } else {
        
        var now = new Date();
        var saved = new Date(window.localStorage.getItem($scope.localSavePrefix+"rootsDate"));

        var difference = Math.abs( now.getTime() - saved.getTime() ) / 3600000;

        // Lets compare the current dateTime with the one we saved when we got the posts.
        // If the difference between the dates is more than 24 hours I think is time to get fresh content
        // You can change the 24 to something shorter or longer

        if(difference > 24){
          // Let's reset everything and get new content from the site.
          $scope.currentPage = 1;
          $scope.pageNumber = 1;
          $scope.lastSavedPage = 0;
          window.localStorage.removeItem($scope.localSavePrefix+"rootsLastPage");
          window.localStorage.removeItem($scope.localSavePrefix+"rootsPosts");
          window.localStorage.removeItem($scope.localSavePrefix+"rootsTotalPages");
          window.localStorage.removeItem($scope.localSavePrefix+"rootsDate");

          $scope.pullContent();
        
        } else {
          
          $scope.lastSavedPage = window.localStorage.getItem($scope.localSavePrefix+"rootsLastPage");

          // If the page we want is greater than the last saved page, we need to pull content from the web
          if($scope.currentPage > $scope.lastSavedPage){

            $scope.pullContent();
          
          // else if the page we want is lower than the last saved page, we have it on local Storage, so just show it.
          } else {

            $scope.items = window.localStorage.getObject($scope.localSavePrefix+'rootsPosts');
            $scope.currentPage = $scope.lastSavedPage;
            $scope.totalPages = window.localStorage.getItem($scope.localSavePrefix+"rootsTotalPages");
            $scope.isFetching = false;

          }

        }

      }

    };

    $scope.imgLoadedEvents = {
        done: function(instance) {
            angular.element(instance.elements[0]).removeClass('is-loading').addClass('is-loaded');
        }
    };
	
	$scope.showPost = function(item){
			
		$rootScope.postContent = item;
	    $scope.ons.navigator.pushPage('post.html');

	};

    $scope.nextPage = function(){

      $scope.currentPage++; 
      $scope.pageNumber = $scope.currentPage;                 
      $scope.getAllRecords($scope.pageNumber);        

    }

  }]);
  
  // Controlador Atractivos
  app.controller('atractivosController', [ '$http', '$scope', '$rootScope', function($http, $scope, $rootScope){

    // I'm using the same post type video, but you will need another custom post type for this one
    $scope.yourAPI = 'http://www.recorramisiones.com.ar/rutadelaselva/api/get_category_posts/?slug=atractivos-actividades'; 
    $scope.items = [];
    $scope.totalPages = 0;
    $scope.currentPage = 1;
    $scope.pageNumber = 1;
    $scope.isFetching = true;
    $scope.lastSavedPage = 0;
    $scope.localSavePrefix = 'atractivos_';
	$scope.collapsed = false;

	$scope.collapse = function(){
		return $scope.collapsed=!$scope.collapsed;
	}

    // Let's initiate this on the first Controller that will be executed.
    ons.ready(function() {
      
      // Cache Images Setup
      // Set the debug to false before deploying your app
      ImgCache.options.debug = true;

      ImgCache.init(function(){

        //console.log('ImgCache init: success!');
        $rootScope.$broadcast('ImgCacheReady');
        // from within this function you're now able to call other ImgCache methods
        // or you can wait for the ImgCacheReady event

      }, function(){
        //console.log('ImgCache init: error! Check the log for errors');
      });

    });


    $scope.pullContent = function(){
      
      $http.jsonp($scope.yourAPI+'&page='+$scope.pageNumber+'&callback=JSON_CALLBACK').success(function(response) {

        if($scope.pageNumber > response.pages){

          // hide the more news button
          $('#moreButton').fadeOut('fast');  

        } else {

          $scope.items = $scope.items.concat(response.posts);
          window.localStorage.setObject($scope.localSavePrefix+'rootsPosts', $scope.items); // we save the posts in localStorage
          window.localStorage.setItem($scope.localSavePrefix+'rootsDate', new Date());
          window.localStorage.setItem($scope.localSavePrefix+"rootsLastPage", $scope.currentPage);
          window.localStorage.setItem($scope.localSavePrefix+"rootsTotalPages", response.pages);

          // For dev purposes you can remove the comment for the line below to check on the console the size of your JSON in local Storage
          // for(var x in localStorage)console.log(x+"="+((localStorage[x].length * 2)/1024/1024).toFixed(2)+" MB");

          $scope.totalPages = response.pages;
          $scope.isFetching = false;

          if($scope.pageNumber == response.pages){

            // hide the more news button
            $('#moreButton').fadeOut('fast'); 

          }

        }

      });

    }

    $scope.getAllRecords = function(pageNumber){

      $scope.isFetching = true;    

      if (window.localStorage.getItem($scope.localSavePrefix+"rootsLastPage") == null ) {

        $scope.pullContent();

      } else {
        
        var now = new Date();
        var saved = new Date(window.localStorage.getItem($scope.localSavePrefix+"rootsDate"));

        var difference = Math.abs( now.getTime() - saved.getTime() ) / 3600000;

        // Lets compare the current dateTime with the one we saved when we got the posts.
        // If the difference between the dates is more than 24 hours I think is time to get fresh content
        // You can change the 24 to something shorter or longer

        if(difference > 24){
          // Let's reset everything and get new content from the site.
          $scope.currentPage = 1;
          $scope.pageNumber = 1;
          $scope.lastSavedPage = 0;
          window.localStorage.removeItem($scope.localSavePrefix+"rootsLastPage");
          window.localStorage.removeItem($scope.localSavePrefix+"rootsPosts");
          window.localStorage.removeItem($scope.localSavePrefix+"rootsTotalPages");
          window.localStorage.removeItem($scope.localSavePrefix+"rootsDate");

          $scope.pullContent();
        
        } else {
          
          $scope.lastSavedPage = window.localStorage.getItem($scope.localSavePrefix+"rootsLastPage");

          // If the page we want is greater than the last saved page, we need to pull content from the web
          if($scope.currentPage > $scope.lastSavedPage){

            $scope.pullContent();
          
          // else if the page we want is lower than the last saved page, we have it on local Storage, so just show it.
          } else {

            $scope.items = window.localStorage.getObject($scope.localSavePrefix+'rootsPosts');
            $scope.currentPage = $scope.lastSavedPage;
            $scope.totalPages = window.localStorage.getItem($scope.localSavePrefix+"rootsTotalPages");
            $scope.isFetching = false;

          }

        }

      }

    };

    $scope.imgLoadedEvents = {
        done: function(instance) {
            angular.element(instance.elements[0]).removeClass('is-loading').addClass('is-loaded');
        }
    };

    $scope.showPost = function(item){
			
		$rootScope.postContent = item;
	    $scope.ons.navigator.pushPage('post.html');

	};

    $scope.nextPage = function(){

      $scope.currentPage++; 
      $scope.pageNumber = $scope.currentPage;                 
      $scope.getAllRecords($scope.pageNumber);        

    }

  }]);
  
  // Controlador Alojamientos
  app.controller('alojamientosController', [ '$http', '$scope', '$rootScope', function($http, $scope, $rootScope){

    // I'm using the same post type video, but you will need another custom post type for this one
    $scope.yourAPI = 'http://www.recorramisiones.com.ar/rutadelaselva/api/get_category_posts/?slug=alojamientos'; 
    $scope.items = [];
    $scope.totalPages = 0;
    $scope.currentPage = 1;
    $scope.pageNumber = 1;
    $scope.isFetching = true;
    $scope.lastSavedPage = 0;
    $scope.localSavePrefix = 'alojamientos_';
	$scope.collapsed = false;

	$scope.collapse = function(){
		return $scope.collapsed=!$scope.collapsed;
	}

    // Let's initiate this on the first Controller that will be executed.
    ons.ready(function() {
      
      // Cache Images Setup
      // Set the debug to false before deploying your app
      ImgCache.options.debug = true;

      ImgCache.init(function(){

        //console.log('ImgCache init: success!');
        $rootScope.$broadcast('ImgCacheReady');
        // from within this function you're now able to call other ImgCache methods
        // or you can wait for the ImgCacheReady event

      }, function(){
        //console.log('ImgCache init: error! Check the log for errors');
      });

    });


    $scope.pullContent = function(){
      
      $http.jsonp($scope.yourAPI+'&page='+$scope.pageNumber+'&callback=JSON_CALLBACK').success(function(response) {

        if($scope.pageNumber > response.pages){

          // hide the more news button
          $('#moreButton').fadeOut('fast');  

        } else {

          $scope.items = $scope.items.concat(response.posts);
          window.localStorage.setObject($scope.localSavePrefix+'rootsPosts', $scope.items); // we save the posts in localStorage
          window.localStorage.setItem($scope.localSavePrefix+'rootsDate', new Date());
          window.localStorage.setItem($scope.localSavePrefix+"rootsLastPage", $scope.currentPage);
          window.localStorage.setItem($scope.localSavePrefix+"rootsTotalPages", response.pages);

          // For dev purposes you can remove the comment for the line below to check on the console the size of your JSON in local Storage
          // for(var x in localStorage)console.log(x+"="+((localStorage[x].length * 2)/1024/1024).toFixed(2)+" MB");

          $scope.totalPages = response.pages;
          $scope.isFetching = false;

          if($scope.pageNumber == response.pages){

            // hide the more news button
            $('#moreButton').fadeOut('fast'); 

          }

        }

      });

    }

    $scope.getAllRecords = function(pageNumber){

      $scope.isFetching = true;    

      if (window.localStorage.getItem($scope.localSavePrefix+"rootsLastPage") == null ) {

        $scope.pullContent();

      } else {
        
        var now = new Date();
        var saved = new Date(window.localStorage.getItem($scope.localSavePrefix+"rootsDate"));

        var difference = Math.abs( now.getTime() - saved.getTime() ) / 3600000;

        // Lets compare the current dateTime with the one we saved when we got the posts.
        // If the difference between the dates is more than 24 hours I think is time to get fresh content
        // You can change the 24 to something shorter or longer

        if(difference > 24){
          // Let's reset everything and get new content from the site.
          $scope.currentPage = 1;
          $scope.pageNumber = 1;
          $scope.lastSavedPage = 0;
          window.localStorage.removeItem($scope.localSavePrefix+"rootsLastPage");
          window.localStorage.removeItem($scope.localSavePrefix+"rootsPosts");
          window.localStorage.removeItem($scope.localSavePrefix+"rootsTotalPages");
          window.localStorage.removeItem($scope.localSavePrefix+"rootsDate");

          $scope.pullContent();
        
        } else {
          
          $scope.lastSavedPage = window.localStorage.getItem($scope.localSavePrefix+"rootsLastPage");

          // If the page we want is greater than the last saved page, we need to pull content from the web
          if($scope.currentPage > $scope.lastSavedPage){

            $scope.pullContent();
          
          // else if the page we want is lower than the last saved page, we have it on local Storage, so just show it.
          } else {

            $scope.items = window.localStorage.getObject($scope.localSavePrefix+'rootsPosts');
            $scope.currentPage = $scope.lastSavedPage;
            $scope.totalPages = window.localStorage.getItem($scope.localSavePrefix+"rootsTotalPages");
            $scope.isFetching = false;

          }

        }

      }

    };

    $scope.imgLoadedEvents = {
        done: function(instance) {
            angular.element(instance.elements[0]).removeClass('is-loading').addClass('is-loaded');
        }
    };

    $scope.showPost = function(item){
			
		$rootScope.postContent = item;
	    $scope.ons.navigator.pushPage('post.html');

	};

    $scope.nextPage = function(){

      $scope.currentPage++; 
      $scope.pageNumber = $scope.currentPage;                 
      $scope.getAllRecords($scope.pageNumber);        

    }

  }]);
  
    // This controller let us print the Post Content in the post.html template
  app.controller('postController', [ '$scope', '$rootScope', '$sce', function($scope, $rootScope, $sce){
    
    $scope.item = $rootScope.postContent;

    $scope.renderHtml = function (htmlCode) {
      return $sce.trustAsHtml(htmlCode);
    };

    $scope.imgLoadedEvents = {
        done: function(instance) {
            angular.element(instance.elements[0]).removeClass('is-loading').addClass('is-loaded');
        }
    }; 
    $scope.openSocialSharing = function(){		
		window.plugins.socialsharing.share(null, null, null, $scope.item.url);
	};	

  }]); 
  
  // Map Markers Controller
	app.controller('markersController', function($scope, $compile){
		
		$scope.infoWindow = {
			title: 'title',
			image: 'image',
			content: 'content'
		};

		$scope.markers = [
			{
				'title' : 'YUCUMA Logde',
				'content' : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras a viverra magna',
				'image': 'images/yucuma.png',
				'location'	: [-27.251, -54.049],
			}, 
			{
				'title' : 'SHERATON Hotel',
				'content' : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras a viverra magna',
				'image': 'images/sheraton.png',
				'location'	: [-25.6799, -54.445],
			}, 
			{
				'title' : 'AMERIAN Hotel',
				'content' : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras a viverra magna',
				'image': 'images/amerian.png',
				'location'	: [-25.595, -54.589],
			},
			{
				'title' : 'Posada PUERTO BEMBERG',
				'content' : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras a viverra magna',
				'image': 'images/puertobemberg.png',
				'location'	: [-25.915, -54.615],
			},
			{
				'title' : 'IGUAZU JUNGLE Lodge',
				'content' : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras a viverra magna',
				'image': 'images/iguazujungle.png',
				'location'	: [-25.594, -54.565],
			},
			{
				'title' : 'LA ALDEA DE LA SELVA Lodge',
				'content' : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras a viverra magna',
				'image': 'images/aldeaselva.png',
				'location'	: [-25.606, -54.551],
			},
			{
				'title' : 'YTORORO Lodge',
				'content' : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras a viverra magna',
				'image': 'images/ytororo.png',
				'location'	: [-26.999, -54.628],
			},
			{
				'title' : 'TACUAPI Lodge',
				'content' : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras a viverra magna',
				'image': 'images/tacuapi.png',
				'location'	: [-27.055, -54.842],
			},
			{
				'title' : 'CUÑA PIRU Lodge',
				'content' : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras a viverra magna',
				'image': 'images/cunapiru.png',
				'location'	: [-27.133, -54.900],
			},
			{
				'title' : 'MOCONA REFUGIO Lodge',
				'content' : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras a viverra magna',
				'image': 'images/refugiomocona.png',
				'location'	: [-27.141, -53.926],
			},
			{
				'title' : 'YACUTINGA Lodge',
				'content' : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras a viverra magna',
				'image': 'images/yacutinga.png',
				'location'	: [-25.577, -54.074],
			}
		];

		$scope.showMarker = function(event){

			$scope.marker = $scope.markers[this.id];
			$scope.infoWindow = {
				title: $scope.marker.title,
				content: $scope.marker.content
			};
			$scope.$apply();
			$scope.showInfoWindow(event, 'marker-info', this.getPosition());
		}

	}); 
  
  // Mapa Controller
  app.controller('mapaController', function($scope){

	$scope.start = function() {

	  $('#mapplic').mapplic({
		source: 'lugares.json',
		sidebar: false,
		minimap: true,
		locations: true,
		deeplinking: false,
		fullscreen: false,
		hovertip: false,
		developer: false,
		maxscale: 4
	  });

	}

  });


})();

