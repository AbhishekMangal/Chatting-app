const  express = require("express");
const { getRequestRoute, sendRequest, acceptRequest } = require("../Controllers/requestController");
const friendsModel = require("../model/friendsModel");
const { addFriendRoute } = require("../Controllers/FriendsController");

const router = express.Router();

router.get('/getRequest/:id', getRequestRoute)
router.post('/sendRequest/:id', sendRequest)
router.post('/acceptRequest', acceptRequest)
module.exports = router;