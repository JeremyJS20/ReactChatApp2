'use strict';

const schema = require('mongoose').Schema;
const model = require('mongoose').model;

const usersSchema = new schema({
    Name: { type: String, required: true },
    Lname: { type: String, required: true },
    Email: { type: String, required: true },
    UserName: { type: String, required: true },
    Password: { type: String, required: true },
    ConnData: {
        Status: { type: String, required: false },
        LastConn: { type: Date, required: false }
    },
    Source: {
        ProfilePhoto: { type: Buffer, required: false },
        Filename: { type: String, required: false },
        Mimetype: { type: String, required: false }
    }
});

exports.userSchemaModel = model('userModel', usersSchema);

const messageSchema = new schema({
    From: { type: schema.Types.ObjectId, required: true },
    To: { type: schema.Types.ObjectId, required: true },
    MsgType: { type: String, required: true },
    Body: { type: String, required: true },
    SendDate: { type: Date, default: Date.now },
    Unread: { type: Boolean, default: true },
    Forwarded: { type: Boolean, default: false },
    IsForwarding: { type: Boolean, default: false },
    ForwardedInfo: [
        {
            IdMsg: { type: schema.Types.ObjectId, required: false },
            BodyMsg: { type: String, required: false },
            From: { type: schema.Types.ObjectId, required: false },
            FullName: { type: String, required: false }
        }
    ],
    IsForwardingInfo: [
        {
            IdMsg: { type: schema.Types.ObjectId, required: false },
            BodyMsg: { type: String, required: false },
            From: { type: schema.Types.ObjectId, required: false },
            FullName: { type: String, required: false }
        }
    ],
    Replied: { type: Boolean, default: false },
    IsReplying: { type: Boolean, default: false },
    RepliedInfo: [
        {
            IdRepliedMsg: { type: schema.Types.ObjectId, required: false },
            BodyRepliedMsg: { type: String, required: false },
            From: { type: schema.Types.ObjectId, required: false },
            FullName: { type: String, required: false }
        }
    ],
    IsReplyingInfo: {
        IdRepliedMsg: { type: schema.Types.ObjectId, required: false },
        BodyRepliedMsg: { type: String, required: false },
        IdSender: { type: schema.Types.ObjectId, required: false },
    },
    Source: [
        {
            FileName: { type: String, required: false },
            FileSize: { type: Number, required: false },
            FileMimetype: { type: String, required: false }
        }
    ]
});

exports.msgSchemaModel = model('messageModel', messageSchema);
/*629d8dcd9b998a18936d644c
62afb694968b8e1ab3211c53*/
const userContactListSchema = new schema({
    IDUser: { type: schema.Types.ObjectId, required: true },
    ContactList: { type: [{IDContact: {type: schema.Types.ObjectId, required: true}, Name: {type: String, required: false}, Lname: {type: String, required: false}}], required: false }
});

exports.userContactListSchemaModel = model('userContactListModel', userContactListSchema);

const notificationsSchema = new schema({
    From: { type: schema.Types.ObjectId, required: true },
    To: { type: [schema.Types.ObjectId], required: true },
    Type: { type: String, required: true },
    Body: { type: String, required: true },
    Status: { type: String, required: false },
    SendDate: { type: Date, default: Date.now },
    New: { type: Boolean, default: true },
    Seen: { type: Boolean, default: false },
    UserName: { type: String, required: true },
    ProfilePhoto: { type: Buffer, required: false }
});

exports.notificationsSchemaModel = model('notificationsSchemaModel', notificationsSchema);