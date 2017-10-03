//angular main component i.e. App
angular.module('app')
   .component('cities' , {
	bindings:{
		cities : '<'
	},
	controller : ($scope, $location)=> {
	    $scope.changeView = function(view){
	    	//to delete 
	    	// this.city.description = "description of city :)"
	    	// this.city.images = ['https://mdbootstrap.com/images/regular/city/img%20(16).jpg' , 'http://www.butterflyhk.com/img/city-guide-img.jpg']
	    	//
	    	window.currentCity = this.city ;
	    	//$location.path(view); // to delete when server is on
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