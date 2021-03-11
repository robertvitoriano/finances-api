const express = require('express');
const {v4: uuidv4} = require('uuid')

const app = express();

const costumers = []
app.use(express.json())

// Middleware

const verifyIfExistsAccountCPF = (request, response, next) =>{
    const {cpf} = request.headers

    const costumer = costumers.find((costumer)=>costumer.cpf===cpf)

    if(!costumer) return response.status(422).json({error:'Costumer not found'})

    request.costumer = costumer

    next()
}

const getBalance = (statement) =>{
    statement.reduce((accumulator, statementElement)=>{

        switch(statementElement.type ){
            case 'credit':
              return accumulator + statementElement.amount
            case 'debit':
              return accumulator - statementElement.amount
        }
    }, 0 )


}
app.post('/account',(request, response)=>{

    const  { cpf, name } = request.body
    
  const  costumerAlreadyExists = costumers.some((registeredCostumer)=>registeredCostumer.cpf ===cpf)
  if(costumerAlreadyExists) return response.status(422).json({error:'CPF already registered'})

  costumers.push({
    cpf,
    name,
    id: uuidv4(),
    statement:[]
})
  const createdCostumer = costumers.find((registeredCostumer)=>registeredCostumer.cpf ===cpf)

    return response.status(201).json(createdCostumer)
})
app.get('/statement',verifyIfExistsAccountCPF,(request, response)=>{
    const costumer = request.costumer

    return response.status(200).json(costumer.statement)
})
app.post('/deposit',verifyIfExistsAccountCPF,(request, response)=>{
    const { description, amount } = request.body
    const costumer= request.costumer

    const statementOperation = {
        description,
        amount,
        created_at: new Date(),
        type:"credit"
    }
    costumer.statement.push(statementOperation)

    return response.status(200).json(costumer)
})

app.post('/withdraw',verifyIfExistsAccountCPF,(request, response)=>{
    
    const {amount} = request.body

    const {costumer} = request

    const balance = getBalance(costumer.statement)
    if(balance < amount) response.status(400).jsons({error:'insufficient funds'})
    

})
app.listen(3001,()=>{
    console.log('My app is running')
})