const router = require('express').Router();
const controller = require('../Controllers/routesDeleteController');

router.delete('/api/EmptyChat/:Id-:Id2', controller.emptyChatController);

router.delete('/api/DeleteContact/:Id', controller.deleteContactController);

router.delete('/api/DeleteMessage/:idMessage-:Id2', controller.deleteMessageController);

module.exports = router;