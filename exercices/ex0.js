/**
 *
 * @param client Axios
 * @returns {Promise<void>}
 */


module.exports = async function (session) {
    const csv = require('csvtojson');
    const csvFilePath = 'exercices/titanic-full.csv';
    const jsonArray = await csv().fromFile(csvFilePath);

    for (const row of jsonArray) {
        try {
            const fullName = row.Name;
            const nameParts = fullName.split(', ');

            const lastName = nameParts[0];
            const firstName = nameParts[1];

            const result = await session.run(
                'MERGE (p:Passenger { PassengerId: $passengerId }) ' +
                'ON CREATE SET p.Name = $name, p.FirstName = $firstName, p.LastName = $lastName, p.Sex = $sex, p.Age = $age, p.Survived = $survived, p.Hometown = $hometown ' +
                'MERGE (b:Body { Body: $body }) ' +
                'MERGE (c:Class { Class: $class }) ' +
                'MERGE (t:Ticket { Ticket: $ticket }) ' +
                'ON CREATE SET t.Fare = $fare ' +
                'MERGE (cb:Cabin { Cabin: $cabin }) ' +
                'MERGE (l:Lifeboat { Lifeboat: $lifeboat }) ' +
                'MERGE (origin:City { City: $origin }) ' +
                'MERGE (dest:City { City: $destination }) ' +
                'MERGE (p)-[:FIND]->(b) ' +
                'MERGE (p)-[:BELONGS_TO_CLASS]->(c) ' +
                'MERGE (p)-[:USED_TICKET]->(t) ' +
                'MERGE (p)-[:SAVED_IN_LIFEBOAT]->(l) ' +
                'MERGE (t)-[:HAD_CABIN]->(cb) ' +
                'MERGE (t)-[:EMBARKED_FROM]->(origin) ' +
                'MERGE (t)-[:DESTINED_TO]->(dest)',
                {
                    passengerId: parseInt(row.PassengerId),
                    name: row.Name,
                    firstName: firstName,
                    lastName: lastName,
                    sex: row.Sex,
                    age: row.Age ? parseInt(row.Age) : null,
                    survived: parseInt(row.Survived),
                    hometown: row.Hometown,
                    body: row.Body,
                    class: parseInt(row.Pclass),
                    ticket: row.Ticket,
                    cabin: row.Cabin,
                    lifeboat: row.Lifeboat,
                    fare: row.Fare ? parseInt(row.Fare) : null,
                    origin: row.Embarked,
                    destination: row.Destination
                }
            );
            console.log('Passenger created and relationships established for ' + row.Name);
        } catch (error) {
            console.error('Error processing row:', error);
        }
    }

    console.log("🎉 Import completed");
}