const express = require('express')
const path = require('path')
const { nextTick } = require('process')

const app = express()
const PORT = process.env.PORT || 3000

app.get('^/$|/index(.html)?', (req, res) => {
  console.log('req', req.baseUrl)
  res.sendFile(path.join(__dirname, 'views', 'index.html'))
})
app.get('/new-page(.html)?', (req, res) => {
  console.log('req', req.baseUrl)
  res.sendFile(path.join(__dirname, 'views', 'new-page.html'))
})

app.get('/old-page(.html)?', (req, res) => {
  console.log('req', req.baseUrl)
  res.redirect(301, '/new-page.html') //302 by default
})
app.get('/hello(.html)?', (req, res, next) => {
  console.log('Attempted to load hello.html')
  next()
}, (req, res) => {
  res.send('Hello World')
})
const one = (req, res, next) => {
  console.log('one')
  next()
}
const two = (req, res, next) => {
  console.log('two')
  next()
}
const three = (req, res, next) => {
  console.log('finished')
}
app.get('/chain(.html)?', [one, two, three])


app.get('/*', (req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'))
})

app.listen(PORT, () => { console.log(`Server is running on port ${PORT}`)})
