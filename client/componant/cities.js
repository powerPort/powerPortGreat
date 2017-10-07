//angular main component i.e. App
angular.module('app')
.component('cities' , {
	bindings:{
		cities : '<'
	},
	controller : ($scope, $location)=> {
		//http://localhost:3000/cities
		//https://safe-lowlands-94171.herokuapp.com/cities
		$scope.changeView = function(){
			var name = this.city.name
			$.ajax({ 
				type : 'POST',
				url : "http://localhost:3000/cities" ,
				data :  {name: name},
				success : function(data) {
                    console.log(data);
					window.currentCity = data
					alert('click on info page to view information about : ' + name)
					$location.path('cityinfo'); //redirect works after three clicks - this will make the api block us
					appendMap(); 
				}
			})
		}

	},
	templateUrl :`../templates/cities.html`
})