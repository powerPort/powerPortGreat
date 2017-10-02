//angular main component i.e. App
angular.module('app')
   .component('cityinfo' , {
	bindings:{
		cityinfo : '<'
	},	
   	templateUrl :`../templates/cityinfo.html`
   })