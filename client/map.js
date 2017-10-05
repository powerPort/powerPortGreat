function appendMap () {
	$("#map").append('<iframe width="300" height="170" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://maps.google.com/maps?q='+currentCity.latitude+','+currentCity.longitude + '&hl=es;z=14&amp;output=embed" ></iframe>')	 
}