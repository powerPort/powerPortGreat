//angular main component i.e. App
angular.module('app')
   .component('cityinfo' , {
	controller : ($scope) => {
		$scope.cityinfo = window.currentCity;
		$scope.originalUrl = 'https://maps.google.com/maps?q='+$scope.cityinfo.latitude+','+$scope.cityinfo.longitude + '&hl=es;z=14&amp;output=embed' ;
	},
   	templateUrl :`../templates/cityinfo.html`
   })