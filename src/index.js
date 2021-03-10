const express = require('express');
const {v4: uuidv4} = require('uuid')

const app = express();

const costumers = []
app.use(express.json())

/**
 * cpf -string
 * name - string
 * id - uuid
 * statement []
 * 
 */
app.post('/account',(request, response)=>{

    const  { cpf, name } = request.body
    
    costumers.push({
        cpf,
        name,
        id: uuidv4(),
        statetement:[]
    })

  const  costumerAlreadyExists = costumers.some((registeredCostumer)=>registeredCostumer.cpf ===cpf)

    if(costumerAlreadyExists) return response.status(422).json({error:'CPF already registered'})

    return response.status(201).json({
        cpf,
        name,
        id,
        statetement:[]
    })
})
app.put('/courses/:id',(request, response)=>{

    return response.json(['curso 6', 'curso 2', 'curso 3', 'curso 4'])
})
app.patch('/courses/:id',(request, response)=>{

    return response.json(['curso 6', 'curso 2', 'curso 3', 'curso 4'])
})
app.delete('/courses/:id',(request, response)=>{

    return response.json(['curso 1', 'curso 2', 'curso 4'])
})

app.listen(3001,()=>{
    console.log('My app is running')
})