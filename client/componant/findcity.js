angular.module('app')
   .component('findcity' , {
	controller : ($scope, $location) => {
		this.find = () => {
			var city = $('#cityname').val()
			$.ajax({ 
				type : 'POST',
				url : 'http://127.0.0.1:3000/cities' ,
				data :  city,
				success : function(data) {
					currentCity = data;
					$location.path('cityinfo');
					appendMap(); 
				}, 
				error : ()=>{
					console.log('error')
				}
			}) 
		}
	},
   	templateUrl : `../templates/findcity.html`
   })









