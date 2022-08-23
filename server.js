require('dotenv').config()
const express = require('express')
const path = require('path')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')

const { logger } = require('./middleware/logEvent')
const errorHandler = require('./middleware/errorHandler')
const verifyJWT = require('./middleware/verifyJWT')
// const credentials = require('./middleware/credentials')

const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/dbConn')

const app = express()
const PORT = process.env.PORT || 3000

//connect to MongoDB
connectDB()

//custom middleware logger
app.use(logger)

// app.use(credentials)
app.use(cors(corsOptions))

//built-in middleware to handle urlencoded data form data content-type: application/x-form-urlencoded
app.use(express.urlencoded({ extended: false }))

// built-in midd leware for json
app.use(express.json())

//middleware for cookies
app.use(cookieParser())

//serve static files
app.use('/', express.static(path.join(__dirname, '/public')))
app.use('/subdir', express.static(path.join(__dirname, '/public')))

app.use('/', require('./routes/root'))
app.use('/register', require('./routes/register'))
app.use('/login', require('./routes/auth'))
app.use('/refresh', require('./routes/refresh'))
app.use('/logout', require('./routes/logout'))

app.use(verifyJWT)
app.use('/employees', require('./routes/api/employees'))

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

mongoose.connection.once('open', () => {
  console.log('Connected to mongoDB')
  app.listen(PORT, () => { console.log(`Server is running on port ${PORT}`)})
})