var app = angular.module('app', ['onsen', 'ngAudio']);


// Alojamientos Controller

app.filter('htmlToPlaintext', function() {
    return function(text) {
      return String(text).replace(/<[^>]+>/gm, '');
    }
  }
);

app.controller('alojamientosController', [ '$http', '$scope', '$rootScope', function($http, $scope, $rootScope){

	$scope.yourAPI = 'http://recorramisiones.com.ar/rutadelaselva/api';
	$scope.items = [];
	$scope.totalPages = 0;
	$scope.currentPage = 1;
	$scope.pageNumber = 1;
	$scope.isFetching = true;

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



