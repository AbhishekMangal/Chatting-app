const { addMessage, getAllMessage, blockUser, unBlock } = require('../Controllers/messageController');

const router = require('express').Router();

router.post('/addmsg', addMessage);
router.post('/getmsg', getAllMessage);
router.post('/block', blockUser);
router.post('/unblock', unBlock);
module.exports = router;