//angular main component i.e. App
angular.module('app')
   .component('cityinfo' , {
	bindings:{
		cityinfo : '<'
	},
	controller : ($scope) => {
		$scope.cityinfo = this.cityinfo
		$scope.renderUrl = () => {
			console.log('https://maps.google.com/maps?q='+$scope.cityinfo.latitude+','+$scope.cityinfo.longitude +'&hl=es;z=14&amp;output=embed')
			return ('https://maps.google.com/maps?q='+$scope.cityinfo.latitude+','+$scope.cityinfo.longitude +'&hl=es;z=14&amp;output=embed')
		}
	},
   	templateUrl :`../templates/cityinfo.html`
   })