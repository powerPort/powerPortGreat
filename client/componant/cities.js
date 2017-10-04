//angular main component i.e. App
angular.module('app')
   .component('cities' , {
	bindings:{
		cities : '<'
	},
	controller : ($scope, $location)=> {
	    $scope.changeView = function(view){
	    	window.currentCity = this.city ;
	    	var cityInfo = {
	    		name : window.currentCity.name ,
	    		long : window.currentCity.longitude ,
	    		lat : window.currentCity.latitude 
	    	}
	    	$.ajax({ 
				type : 'POST',
				url : "http://127.0.0.1:3000/cities" ,
				data :  cityInfo,
				success : function(data) {
					window.currentCity.images = data.images
					window.currentCity.description = data.description
	          		$location.path(view); 
				}
			})
        }
	},
   	templateUrl :`../templates/cities.html`
   })