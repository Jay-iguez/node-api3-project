const express = require('express');
const { validateUserId, validateUser, validatePost } = require('../middleware/middleware')
const users = require('./users-model')
const posts = require('../posts/posts-model')
// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const usersData = await users.get()
    res.status(200).json(usersData)
  } catch (error) {
    res.status(500).json({
      message: 'Error grabbing users.'
    })
  }
});

router.get('/:id', validateUserId, async (req, res) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  try {
    res.status(200).json(req.user)
  } catch (error) {
    res.status(500).json({
      message: 'Error grabbing user by id + ' + req.params.id
    })
  }
});

router.post('/', validateUser, async (req, res) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  try {
    const newUser = await users.insert(req.body)
    res.status(201).json(newUser)
  } catch (error) {
    res.status(500).json({
      message: 'Error in creating new user'
    })
  }
});

router.put('/:id', [validateUserId, validateUser], async (req, res) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  try {
    const updatedUser = await users.update(req.params.id, req.body)
    res.status(200).json(updatedUser)
  } catch (error) {
    res.status(500).json({
      message: 'Error in updating user'
    })
  }
});

router.delete('/:id', validateUserId, async (req, res) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  try {
    const { id } = req.params
    const deletedUser = await users.getById(id)
    await users.remove(id)
    res.status(200).json(deletedUser)
  } catch(error) {
    res.status(500).json({
      message: "Error in deleting user"
    })
  }
});

router.get('/:id/posts', validateUserId, async (req, res) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  try {
    const userPosts = await users.getUserPosts(req.params.id)
    res.status(200).json(userPosts)
  } catch(error) {
    res.status(500).json({
      message: 'Error in getting user posts.'
    })
  }
});

router.post('/:id/posts', [validateUserId, validatePost], async (req, res) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  try {
    const createdPost = await posts.insert({ text: req.body.text, user_id: req.params.id})
    res.status(201).json(createdPost)
  } catch(error){
    res.status(500).json({
      message: "Error in creating new post of user. "  + error.message
    })
  }
});

// do not forget to export the router

module.exports = router