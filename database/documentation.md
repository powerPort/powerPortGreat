** database documentation:
--------------------------

[ ] we have two schemas cities schema and weather schema.

[ ] for the mvp project we wrote our own static data to fill the database with ..

[ ] we started by gathering the names of the capitals of all contries we gathered 91 of them.

[ ] then we gathered numiric data (scores) that represent the relative 

[ ] rank of the city with respect to other cities in the following criterias:
	- safety
	- cost of living.

[ ] we got the data from the follwoing website:
	- www.numbeo.com

[ ] the scores are out of 100 the higher the safety score the safer the city, the higher the cost score the cheaper the city.

[ ] when the txt file was written (first row is name of the city the second represents safety and the third repesents cost) we used fs.read to fill our mongodb with that data. 

[ ] our third critiria was weather. we used and api to get new data every day for each cities weather. the api responds with tempretuar of the city in kelvin.
	- we used math to calculate the tempruture in cilcuse and to convert it to a relative score out of 100. then we saved the score in the database.
	- we assumed that the optimal tempreture is 21 and then we calculated the difference in tem and we subtract from 100% to get the weather score of the city.
	- for this data changes everyday our program needs to refresh the database every day we made a file named LASTUPDATE this file will safe the number that represents the current day and it will be rewritten everyday.
	- in the code the current day will be checked against the lastupdate to update the data or not (the case where the day is 0 and previous day is 7 was taken into consideration) 
	- now our database has safety, cost and weather.

[ ] we wrote an algorithm to calculate the mark for every city based on the three criteria and taking into consideration the weight the user gave to each criteria.
	- this part of the code is responsible for returning the top 10 cities to live in.

============================================================

**schemas**
-----------

[ ] now in the cities schema we have: __name, security __ and __cost.__
[ ] in the weather schema we have the __weather__ and then we added the __longitude__ and __latitude__ to use for the next part of the project.

============================================================

- we used the name of the city for flickr api to get 10 pics from flickr we put the name of the city in the tag part of url 

- we used the longitude and latitude for the hotels api we only used hotels with high rating.