//angular main component i.e. App
angular.module('app')
   .component('cities' , {
   	
	bindings:{
		cities : '<'
	},	

   	templateUrl :`../templates/cities.html`
   	

   })