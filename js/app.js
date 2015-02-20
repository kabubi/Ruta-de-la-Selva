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

  // Add here the controllers of the Modules you are using on this project
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
  
  app.controller('alojamientosController', [ '$http', '$scope', '$rootScope', function($http, $scope, $rootScope){

	$scope.yourAPI = 'http://recorramisiones.com.ar/rutadelaselva/api';
	$scope.items = [];
	$scope.totalPages = 0;
	$scope.currentPage = 1;
	$scope.pageNumber = 1;
	$scope.isFetching = true;
	$scope.collapsed = false;

	$scope.collapse = function(){
		return $scope.collapsed=!$scope.collapsed;
	}
	
	$scope.imgLoadedEvents = {
        done: function(instance) {
            angular.element(instance.elements[0]).removeClass('is-loading').addClass('is-loaded');
        }
    };

	$scope.getAllRecords = function(pageNumber){

		$scope.isFetching = true;

        $http.jsonp($scope.yourAPI+'/?json=get_category_posts&slug=alojamientos&status=publish'+$scope.pageNumber+'&callback=JSON_CALLBACK').success(function(response) {

			$scope.items = $scope.items.concat(response.posts);
			$scope.totalPages = response.pages;
			$scope.isFetching = false;
			if($scope.currentPage==$scope.totalPages){
				$('.alojamientos-page #moreButton').fadeOut('fast');	
			}
    	});
	 
	};

	$scope.showPost = function(item){
			
		$rootScope.postContent = item;
	    $scope.ons.navigator.pushPage('post.html');

	};

	$scope.nextPage = function(){
		
		$scope.pageNumber = ($scope.currentPage + 1);
		if($scope.pageNumber <= $scope.totalPages){
			$scope.getAllRecords($scope.pageNumber);
			$scope.currentPage++;
		}

	}


}]);

// Atractivos Controller

app.filter('htmlToPlaintext', function() {
    return function(text) {
      return String(text).replace(/<[^>]+>/gm, '');
    }
  }
);

app.controller('atractivosController', [ '$http', '$scope', '$rootScope', function($http, $scope, $rootScope){

	$scope.yourAPI = 'http://recorramisiones.com.ar/rutadelaselva/api';
	$scope.items = [];
	$scope.totalPages = 0;
	$scope.currentPage = 1;
	$scope.pageNumber = 1;
	$scope.isFetching = true;

	$scope.getAllRecords = function(pageNumber){

		$scope.isFetching = true;

        $http.jsonp($scope.yourAPI+'/?json=get_category_posts&slug=atractivos-actividades&status=publish'+$scope.pageNumber+'&callback=JSON_CALLBACK').success(function(response) {

			$scope.items = $scope.items.concat(response.posts);
			$scope.totalPages = response.pages;
			$scope.isFetching = false;
			if($scope.currentPage==$scope.totalPages){
				$('.alojamientos-page #moreButton').fadeOut('fast');	
			}
    	});
	 
	};

	$scope.showPost = function(item){
			
		$rootScope.postContent = item;
	    $scope.ons.navigator.pushPage('post.html');

	};

	$scope.nextPage = function(){
		
		$scope.pageNumber = ($scope.currentPage + 1);
		if($scope.pageNumber <= $scope.totalPages){
			$scope.getAllRecords($scope.pageNumber);
			$scope.currentPage++;
		}

	}


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

// Informes Controller

app.filter('htmlToPlaintext', function() {
    return function(text) {
      return String(text).replace(/<[^>]+>/gm, '');
    }
  }
);

app.controller('informesController', [ '$http', '$scope', '$rootScope', function($http, $scope, $rootScope){

	$scope.yourAPI = 'http://recorramisiones.com.ar/rutadelaselva/api';
	$scope.items = [];
	$scope.totalPages = 0;
	$scope.currentPage = 1;
	$scope.pageNumber = 1;
	$scope.isFetching = true;

	$scope.getAllRecords = function(pageNumber){

		$scope.isFetching = true;

        $http.jsonp($scope.yourAPI+'/?json=get_category_posts&slug=informes-turisticos&status=publish'+$scope.pageNumber+'&callback=JSON_CALLBACK').success(function(response) {

			$scope.items = $scope.items.concat(response.posts);
			$scope.totalPages = response.pages;
			$scope.isFetching = false;
			if($scope.currentPage==$scope.totalPages){
				$('.informes-page #moreButton').fadeOut('fast');	
			}
    	});
	 
	};

	$scope.showPost = function(item){
			
		$rootScope.postContent = item;
	    $scope.ons.navigator.pushPage('post.html');

	};

	$scope.nextPage = function(){
		
		$scope.pageNumber = ($scope.currentPage + 1);
		if($scope.pageNumber <= $scope.totalPages){
			$scope.getAllRecords($scope.pageNumber);
			$scope.currentPage++;
		}

	}


}]);

// Areas naturales Controller

app.filter('htmlToPlaintext', function() {
    return function(text) {
      return String(text).replace(/<[^>]+>/gm, '');
    }
  }
);

app.controller('areasController', [ '$http', '$scope', '$rootScope', function($http, $scope, $rootScope){

	$scope.yourAPI = 'http://recorramisiones.com.ar/rutadelaselva/api';
	$scope.items = [];
	$scope.totalPages = 0;
	$scope.currentPage = 1;
	$scope.pageNumber = 1;
	$scope.isFetching = true;
	$scope.collapsed = false;

	$scope.collapse = function(){
		return $scope.collapsed=!$scope.collapsed;
	}

	$scope.getAllRecords = function(pageNumber){

		$scope.isFetching = true;

        $http.jsonp($scope.yourAPI+'/?json=get_category_posts&slug=areas-naturales-protegidas&status=publish'+$scope.pageNumber+'&callback=JSON_CALLBACK').success(function(response) {

			$scope.items = $scope.items.concat(response.posts);
			$scope.totalPages = response.pages;
			$scope.isFetching = false;
			if($scope.currentPage==$scope.totalPages){
				$('.informes-page #moreButton').fadeOut('fast');	
			}
    	});
	 
	};

	$scope.showPost = function(item){
			
		$rootScope.postContent = item;
	    $scope.ons.navigator.pushPage('post.html');

	};

	$scope.nextPage = function(){
		
		$scope.pageNumber = ($scope.currentPage + 1);
		if($scope.pageNumber <= $scope.totalPages){
			$scope.getAllRecords($scope.pageNumber);
			$scope.currentPage++;
		}

	}


}]);

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

app.controller('postController', [ '$scope', '$rootScope', '$sce', function($scope, $rootScope, $sce){
	
	$scope.item = $rootScope.postContent;

	$scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };
	
	$scope.openSocialSharing = function(){		
		window.plugins.socialsharing.share(null, null, null, $scope.item.url);
	};

}]);


})();

