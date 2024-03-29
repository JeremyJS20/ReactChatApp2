const router = require('express').Router();
const controller = require('../Controllers/routesPostController');

router.post('/api/createNewUser', controller.createNewUserController);

router.post('/api/VerifyAndAuthUser', controller.verifyAndAuthUserController);

router.post('/api/SendMessageWithFile', controller.sendMessageWithFileController);

router.post('/api/sendMessage', controller.sendMessageController);

router.post('/api/SendFriendRequest', controller.sendFriendRequestController);

router.post('/api/AcceptFriendRequest', controller.acceptFriendRequestController);

router.post('/api/addContact', controller.addContactController);

router.post('/api/ForwardMessage', controller.forwardMessageController);

router.post('/api/ReplyMessage', controller.replyMessageController);

router.post('/api/sendPasswordRecoveryEmail', controller.sendPasswordRecoveryEmail);

router.post('/api/resetPassword', controller.resetPassword);

module.exports = router;