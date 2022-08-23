const express = require('express')
const path = require('path')
const cors = require('cors')

const { logger } = require('./middleware/logEvent')
const errorHandler = require('./middleware/errorHandler')

const app = express()
const PORT = process.env.PORT || 3000

//custom middleware logger

app.use(logger)

// cross-origin resource sharing
const whitelist = ['https://www.google.com', 'http://localhost:3000']
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) != -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not Allowed by CORS'))
    }
  },
  optionSuccessStatus: 200
}
app.use(cors(corsOptions))
//built-in middleware to handle urlencoded data
// in other words foem data
// content-type: application/x-form-urlencoded
app.use(express.urlencoded({ extended: false }))

// built-in middleware for json
app.use(express.json())

//serve static files
app.use(express.static(path.join(__dirname, '/public')))

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


// app.get('/*', (req, res) => {
//   res.status(404).sendFile(path.join(__dirname, 'views', '404.html'))
// })

app.all('*', (req,res) => {
  res.status(404)
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'))
  } else if (req.accepts('json')) {
    res.sendFile({ error: "404 not found"})
  } else {
    res.type('txt').send("404 not found")
  }
})

app.use(errorHandler)

app.listen(PORT, () => { console.log(`Server is running on port ${PORT}`)})
