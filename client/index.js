//angular main component i.e. App
angular.module('app', [])
   .component('index' , {
   	controller : function() {
   		this.generatore = [0,1,2,3,4,5,6,7,8,9,10];
   		this.cities;
   		this.find = function() {
   			console.log('alaa')
   			var security = document.getElementById('security').value;
   			var cost = document.getElementById('cost').value;
   			var wheater = document.getElementById('wheater').value;
   			console.log(security , cost , wheater)

   			$.ajax({
   				type : 'POST',
   				url : 'http://127.0.0.1:3000/',
   				data : {cost : cost, security : security, wheater : wheater} ,
   				success : function(data) {
   					this.cities = data;
   				}
   			})
   		}
   	},


   	templateUrl :`./templates/choose.html`
   	

   })