const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getTasks } = require('../controllers/taskController');

// This route is protected. The 'auth' middleware will run first.
// If the token is valid, it will attach the user to the request object (req.user)
// and then pass control to getTasks.
router.get('/', auth, getTasks);

module.exports = router;