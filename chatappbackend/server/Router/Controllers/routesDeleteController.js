const models = require('../../Utils/schemas');
const mongoose = require('mongoose');
const config = require('../../Utils/config');

exports.emptyChatController = async (req, res) => {
    try {
        const emptyChat = await models.msgSchemaModel.deleteMany({
            $or: [
                {
                    From: new mongoose.Types.ObjectId(req.params.Id),
                    To: new mongoose.Types.ObjectId(req.params.Id2),
                },
                {
                    From: new mongoose.Types.ObjectId(req.params.Id2),
                    To: new mongoose.Types.ObjectId(req.params.Id),
                }
            ]
        });

        if (emptyChat.deletedCount === 0) {
            return res.json(false);
        }

        const io = req.app.get('socketio');

        io.to(config.SESSIONSMAP[req.params.Id]).emit('Update Chats', [], 'emptyChat');
        io.to(config.SESSIONSMAP[req.params.Id]).emit('Update Messages', [], 'emptyChat');

        res.status(200).json(true);
    } catch (err) { res.status(500).json(err) }
};

exports.deleteMessageController = async (req, res) => {
    try {
        const messageDeleted = await models.msgSchemaModel.findOneAndDelete({
            _id: new mongoose.Types.ObjectId(req.params.idMessage)
        });
        
        const io = req.app.get('socketio');

        io.to(config.SESSIONSMAP[req.params.Id2]).emit('Update Chats', null, 'deletedMessage');
        io.to(config.SESSIONSMAP[req.params.Id2]).emit('Update Messages', messageDeleted, 'deletedMessage');

        res.status(200).json(true);
    } catch (err) { res.status(500).json(err) }
};

exports.deleteContactController = async (req, res) => {
    res.json({
        msg: 'working',
        data: req.data
    });
};