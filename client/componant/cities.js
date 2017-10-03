//angular main component i.e. App
angular.module('app')
   .component('cities' , {
	bindings:{
		cities : '<'
	},
	controller : ($scope, $location)=> {
	    $scope.changeView = function(view){
                $location.path(view); // path not hash
            }
	},
   	templateUrl :`../templates/cities.html`
   })