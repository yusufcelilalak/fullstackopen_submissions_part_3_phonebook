const express = require('express');
const app = express();
app.use(express.json());

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];


const generateId = () => {
  let id = Math.floor(Math.random() * 1000000000000);
  while(persons.find(person => person.id === id)){
    id = Math.floor(Math.random() * 1000000000000);
  }

  return id;
}


//**************************************************/
// GET APIs
//**************************************************/
app.get(['/','/api'], (request, response) => {
    const body = `
    <h2>info</h2>
    <p>you can get access of info from <a href="/api/info">here</a>.
    <h2>all api list</h2>
    <div>
        <b>1</b> - api for getting persons list - <a href="/api/persons">/api/persons</a>
    </div>
    <div>
      <b>2</b> - api for getting single person from list - <a href="/api/persons/1">/api/persons/1</a>
    </div>
    `
    response.send(body);
});

app.get('/api/info', (request, response) => {
    const datetime = new Date();
    const body = `
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${datetime}</p>
    `
    response.send(body);
});

app.get('/api/persons',(request, response) => {
    response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find(person => person.id === id);

  if(person)
  {
    response.json(person);
  }
  else
  {
    response.statusMessage = "This person doesn't exist in current persons list.";
    response.status(404).end();
  }
});

//**************************************************/
// POST APIs
//**************************************************/
app.post('/api/persons', (request, response) => {
  const body = request.body;

  if(!body.number || !body.name)
  {
    response.status(404).json({
      error: "name or phone number is missing."
    });
  }
  else if(persons.find(person => person.name === body.name)){
    response.status(404).json({
      error: "name must be unique"
    })
  }
  else{
    const newPerson = {
      id: generateId(),
      name: body.name,
      number: body.number
    }
  
    persons = persons.concat(newPerson);
    response.json(newPerson);
  }
});


//**************************************************/
// DELETE APIs
//**************************************************/
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find(person => person.id === id);

  if(person)
  {
    persons = persons.filter(person => person.id !== id);
    response.status(204).end();
  }
  else
  {
    response.statusMessage = "This person doesn't exist in current persons list.";
    response.status(404).end();
  }

})


const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});