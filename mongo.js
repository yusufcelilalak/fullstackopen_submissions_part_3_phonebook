const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

if(process.argv.length<3) {
    console.log('give password as argument');
    process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://${process.env.DB_USER_NAME}:${password}${process.env.LINK}`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema);

if(process.argv.length === 3)
{
    console.log('phonebook:');
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`);
        });
    
        mongoose.connection.close();
    });
}else if(process.argv.length === 5){
    const name = process.argv[3];
    const number = process.argv[4];

    const person = new Person({
        name: name,
        number: number
    });
    
    person.save().then(result => {
        console.log(`added ${name} number ${number} to phonebook`);
        mongoose.connection.close(url);
    })
}



