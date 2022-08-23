const User = require('../model/User')

const handleLogout = async (req, res) => {
  //On client, also delte the accessToken
  const cookies = req.cookies
  if (!cookies?.jwt) return res.sendStatus(204)
  const refreshToken = cookies.jwt

  const foundUser = await User.findOneAndDelete({ refreshToken }).exec()
  if (!foundUser) {
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    return res.sendStatus(204)
  }

  // saving refreshToken with current user
  foundUser.refreshToken = ' '
  // const result  = await User.updateOne({"_id": foundUser._id}, {$unset: ["refreshToken"]})
  const result = await foundUser.save()
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
  res.status(200).json({ 'message': 'logot succesfull' }) //secure:true - only serves on https
}


module.exports = { handleLogout }