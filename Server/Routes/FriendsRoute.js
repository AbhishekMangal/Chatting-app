const express = require('express');
const { addFriendRoute, getFriends } = require('../Controllers/FriendsController');
const router = express.Router();
router.post('/addFriends' ,addFriendRoute)
router.post('/getFriend' ,getFriends)
module.exports = router; 