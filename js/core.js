var app = angular.module('app', ['onsen', 'ngAudio', 'ngMap']);

// Mostrar/Ocultar buscador
app.controller('buscar',['$scope', function($scope){
        $scope.custom = false;
        $scope.toggleCustom = function() {
            $scope.custom = $scope.custom === false ? true: false;
        };
}]);

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
			'image': 'img/yucuma.png',
			'location'	: [-27.251, -54.049],
			'icon' : 'img/pin.png'
		}, 
		{
			'title' : 'SHERATON Hotel',
			'content' : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras a viverra magna',
			'image': 'img/sheraton.png',
			'location'	: [-25.6799, -54.445],
			'icon' : 'img/pin.png'
		}, 
		{
			'title' : 'AMERIAN Hotel',
			'content' : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras a viverra magna',
			'image': 'img/amerian.png',
			'location'	: [-25.595, -54.589],
			'icon' : 'img/pin.png'
		},
		{
			'title' : 'Posada PUERTO BEMBERG',
			'content' : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras a viverra magna',
			'image': 'img/puertobemberg.png',
			'location'	: [-25.915, -54.615],
			'icon' : 'img/pin.png'
		},
		{
			'title' : 'IGUAZU JUNGLE Lodge',
			'content' : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras a viverra magna',
			'image': 'img/iguazujungle.png',
			'location'	: [-25.594, -54.565],
			'icon' : 'img/pin.png'
		},
		{
			'title' : 'LA ALDEA DE LA SELVA Lodge',
			'content' : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras a viverra magna',
			'image': 'img/aldeaselva.png',
			'location'	: [-25.606, -54.551],
			'icon' : 'img/pin.png'
		},
		{
			'title' : 'YTORORO Lodge',
			'content' : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras a viverra magna',
			'image': 'img/ytororo.png',
			'location'	: [-26.999, -54.628],
			'icon' : 'img/pin.png'
		},
		{
			'title' : 'TACUAPI Lodge',
			'content' : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras a viverra magna',
			'image': 'img/tacuapi.png',
			'location'	: [-27.055, -54.842],
			'icon' : 'img/pin.png'
		},
		{
			'title' : 'CUÑA PIRU Lodge',
			'content' : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras a viverra magna',
			'image': 'img/cunapiru.png',
			'location'	: [-27.133, -54.900],
			'icon' : 'img/pin.png'
		},
		{
			'title' : 'MOCONA REFUGIO Lodge',
			'content' : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras a viverra magna',
			'image': 'img/refugiomocona.png',
			'location'	: [-27.141, -53.926],
			'icon' : 'img/pin.png'
		},
		{
			'title' : 'YACUTINGA Lodge',
			'content' : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras a viverra magna',
			'image': 'img/yacutinga.png',
			'location'	: [-25.577, -54.074],
			'icon' : 'img/pin.png'
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



