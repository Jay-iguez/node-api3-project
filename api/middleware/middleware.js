const Users = require('../users/users-model')

function logger(req, res, next) {
  // DO YOUR MAGIC
  console.log(`
    method: ${req.method} || url: ${req.url} || timestamp: ${new Date().toISOString()}
  `)
  next()
}

async function validateUserId(req, res, next) {
  // DO YOUR MAGIC
  try {
    const { id } = req.params
    const user = await Users.getById(id)
    if (!user) {
      res.status(404).json({
        message: 'user not found'
      })
    } else {
      req.user = user
      next()
    }
  } catch (error) {
    res.status(500).json({
      message: 'Problem validting user id: ' + id
    })
  }

}

async function validateUser(req, res, next) {
  // DO YOUR MAGIC
  try {
    const { name } = req.body
    if (name && typeof name === 'string'){
      next()
    } else {
      res.status(400).json({
        message: 'missing required name field'
      })
    }
  } catch(error) {
    res.status(500).json({
      message: 'Error in validating user body.'
    })
  }
}

function validatePost(req, res, next) {
  // DO YOUR MAGIC

}

// do not forget to expose these functions to other modules
module.exports = {
  logger, validateUserId, validateUser
}