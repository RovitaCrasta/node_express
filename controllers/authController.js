
const User = require('../model/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body
  if (!user || !pwd) return res.status(400).json({ 'message': 'username and password are required' })
  const foundUser = await User.findOne({ username: user}).exec()
  if (!foundUser) {
    return res.status(401).json({ 'message': 'user not found' }) //Unauthorized
  }
  if (await bcrypt.compare(pwd, foundUser.password)) {
    const roles = Object.values(foundUser.roles)
    // create JWTs
    const accessToken = jwt.sign(
      {
        "userInfo": {
          "username": foundUser.username,
          "roles": roles
        }
      }, 
       process.env.ACCESS_TOKEN_SECRET, 
       { expiresIn: '2m' })
    const refreshToken = jwt.sign(
      { "username": foundUser.username }, 
      process.env.REFRESH_TOKEN_SECRET, 
      { expiresIn: '1d' })

    // const result  = await User.updateOne({"_id": foundUser._id}, {$set: {"refreshToken": refreshToken}})
    foundUser.refreshToken = refreshToken
    const result = await foundUser.save()
    res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 }) //1d
    res.status(200).json({ 'message': `${user} login successfull`, accessToken })
  } else {
    res.sendStatus(401)
  }
}


module.exports = { handleLogin }