import { Application } from 'https://deno.land/x/abc@v1.3.3/mod.ts'
import companyData from './company_data.js'

const app = new Application()

app
  .get('/', (server) => {})
  .get('/companies', getCompanies)
  .post('/companies', handleCompaniesPost)
  .delete('/companies/:id', handleCompaniesDelete)
  .start({ port: 8080 })

async function handleCompaniesDelete(server) {
  const { id } = await server.body
  if (id) {
    // let companyIndex = companyData.indexOf(id == parseInt(id))
    const company = companyData.filter((company) => company.id === parseInt(id))
    console.log(company)
    companyData.splice(companyData.indexOf(company), 1)

    return server.json({ response: 'Success' }, 200)
  } else {
    server.json({ error: 'Id must be defined!' }, 400)
  }
}

async function handleCompaniesPost(server) {
  const { name, id, domain, country, stock } = await server.body
  if (name && id) {
    companyData.unshift({
      id,
      name,
      domain: domain || '',
      country: country || '',
      stock: stock || ''
    })
    console.log(companyData[0])
    return server.json({ response: 'Success' }, 200)
  } else {
    server.json({ error: 'Name must be defined!' }, 400)
  }
}

function getCompanies(server) {
  return server.json(companyData)
}
