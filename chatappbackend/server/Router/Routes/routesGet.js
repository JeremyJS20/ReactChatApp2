const router = require('express').Router();
const controller = require('../Controllers/routesGetController');

router.get('/api', controller.api);

router.get('/api/getUserData/', controller.verifyUserAuthTokenExpiredController);

router.get('/api/myContacts/:Id', controller.myContactsController);

router.get('/api/recentChats/:Id', controller.recentChatsController);

router.get('/api/notifications/:Id', controller.notificationsController);

router.get('/api/selectedChatMessages/:Id-:Id2', controller.selectedChatMessagesController);

router.get('/api/verifyUserAuthTokenExpired/:token', controller.verifyUserAuthTokenExpiredController);

router.get('/api/userDataByToken/:token', controller.userDataByTokenController);

module.exports = router;