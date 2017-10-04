//angular main component i.e. App
angular.module('app')
.component('cities' , {
	bindings:{
		cities : '<'
	},
	controller : ($scope, $location)=> {

	    $scope.changeView = function(view){
	    	currentCity = this.city ;
	    	var name = this.city.name
	    	$.ajax({ 
			type : 'POST',
			url : "http://127.0.0.1:3000/cities" ,
			data :  name,
			success : function(data) {
				currentCity = data
				$location.path(view);
				appendMap(); 


		$scope.changeView = function(view){
			currentCity = this.city ;
			var cityInfo = {
				name : currentCity.name ,
				long : currentCity.longitude ,
				lat : currentCity.latitude 

			}
			$.ajax({ 
				type : 'POST',
				url : "http://127.0.0.1:3000/cities" ,
				data :  cityInfo,
				success : function(data) {
					currentCity.images = data.images
					currentCity.description = data.description
					$location.path(view);
					appendMap(); 

				}
			})
		}
	},
	templateUrl :`../templates/cities.html`
})