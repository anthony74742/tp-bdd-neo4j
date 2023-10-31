1.
MATCH (p:Passenger)
RETURN COUNT(p) AS NumberOfPassengers

2.
MATCH (p:Passenger)
WHERE p.Survived = 0
WITH COUNT(p) AS NumberOfDeaths
MATCH (b:Body)
RETURN NumberOfDeaths, COUNT(b) AS NumberOfBodiesFound

3.
MATCH (c:Class)<-[:BELONGS_TO_CLASS]-(p:Passenger)
WHERE p.Survived = 1
WITH c, COUNT(p) AS SurvivedCount
ORDER BY SurvivedCount DESC
LIMIT 1
RETURN c.Class AS MostSurvivedClass, SurvivedCount

4.
MATCH (p:Passenger)
WHERE NOT (p.Age < 18 AND p.Sex = 'female')
RETURN COUNT(p) AS AdultsAndOthers

5. 
Non

6.
MATCH (dest:City)<-[:DESTINED_TO]-(t:Ticket)<-[:USED_TICKET]-(p:Passenger)
WHERE dest.City CONTAINS "Washington" AND dest.City CONTAINS "DC"
RETURN COUNT(p) AS PassengersToWashingtonDC

7.
MATCH (t:Ticket)<-[:USED_TICKET]-(p:Passenger)
OPTIONAL MATCH (t)-[:HAD_CABIN]->(cb:Cabin)
RETURN t.Ticket AS Ticket, COLLECT(cb.Cabin) AS Cabins

8.
MATCH (p:Passenger)
WHERE p.Sex = 'female' AND p.Age IS NOT NULL
RETURN AVG(p.Age) AS AverageAgeOfFemales

9.
MATCH (t:Ticket)
RETURN AVG(t.Fare) AS AverageFare


10.
MATCH (t:Ticket)<-[:USED_TICKET]-(p:Passenger)
WITH t, COLLECT(DISTINCT p.LastName) AS Names
RETURN t.Ticket AS Ticket, Names

11.

12.

13.
MATCH (p:Passenger)
WITH SPLIT(p.Hometown, ', ') AS hometownParts
RETURN hometownParts[-1] AS Country, COUNT(*) AS NumberOfPassengers

14.
MATCH (p:Passenger)-[:USED_TICKET]->(t:Ticket)-[:DESTINED_TO]->(dest:City)
WITH SPLIT(dest.City, ', ') AS destParts
WHERE destParts[-1] = "US"
RETURN destParts[0] AS Country, COUNT(*) AS NumberOfPassengers

15.
