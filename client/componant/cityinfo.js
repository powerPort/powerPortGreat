//angular main component i.e. App
angular.module('app')
   .component('cityinfo' , {
	controller : ($scope) => {
		$scope.cityinfo = window.currentCity;
	},
   	templateUrl :`../templates/cityinfo.html`
   })