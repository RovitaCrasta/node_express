
const User = require('../model/User')
const fsPromises = require('fs').promises
const path = require('path')
const bcrypt = require('bcrypt')

const handleNewUser = async (req,res) => {
  const { user, pwd } = req.body
  if(!user || !pwd) return res.status(400).json({'message': 'username and password are required'})
  //check for duplicate usernames in the db
  const duplicate = await User.findOne({ username: user}).exec()
  if (duplicate) return res.sendStatus(409) //conflict
  try {
    const salt = await bcrypt.genSalt(10)
    const hasedPassword = await bcrypt.hash(pwd, salt)
    // store the new user
    const result = await User.create({
      "username": user, 
      "password": hasedPassword
    })
    res.status(201).json({'success': `New user created ${user} created`})
  } catch (err) {
    res.status(500).json({ 'message': err.message})
  }
}

module.exports = { handleNewUser }