//obtener modelos de schemas de la base de datos
"use strict";
const models = require("../../Utils/schemas");
const mongoose = require("mongoose");

const jwt = require("jsonwebtoken");
const config = require("../../Utils/config");

exports.api = (req, res) => {
  res.json({
    msg: "reactchatapp rest-api working with no fails",
  });
};

exports.verifyUserAuthTokenExpiredController = (req, res) => {
  try {
    jwt.verify(req.params.token, "user", (err, data) => {
      if (err) {
        return res.json(undefined);
      }
      return res.status(200).json(data);
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.userDataByTokenController = (req, res) => {
  try {
    jwt.verify(req.params.token, "user", (err, data) => {
      if (err) {
        return res.json({
          userIsAuthenticated: false,
        });
      }
      return res.status(200).json(data);
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.notificationsController = async(req, res) => {
  try{
    const notifications = await models.notificationsSchemaModel.find({
      To: new mongoose.Types.ObjectId(req.params.Id),
    }).sort('-SendDate');
  
    if(notifications.length === 0){
      return res.json([]);
    }
    return res.status(200).json(notifications);
  } catch (err){res.status(500).json(err)}
};

exports.myContactsController = async (req, res) => {
  try{
    const myChatFriends = await models.userContactListSchemaModel.findOne({
      IDUser: new mongoose.Types.ObjectId(req.params.Id)
    }).exec()
    if (myChatFriends == null || myChatFriends.ContactList.length === 0) {
      return res.status(200).json([]);
    }

    var temp = [];
    var i = 1;
    myChatFriends.ContactList.forEach(async (contact) => {
      const friendData = await models.userSchemaModel.findOne({
        _id: new mongoose.Types.ObjectId(contact.IDContact),
      });
      temp.push({
        Id: friendData._id.toString(),
        FullName: `${contact.Name || friendData.Name} ${contact.Lname || friendData.Lname}`,
        UserName: friendData.UserName,
        ConnData: friendData.ConnData,
        Email: friendData.Email,
        Status2: '',
        ProfilePhoto: config.DEFAULTPROFILE,
      });
      if (i === myChatFriends.ContactList.length) {
        res.status(200).json(temp);
      }
      i++;
    });
  } catch(err){
    res.status(500).json(err)}
};

exports.selectedChatMessagesController = async (req, res) => {
  try {
    const chatMessages = await models.msgSchemaModel
      .find({
        $or: [
          {
            From: new mongoose.Types.ObjectId(req.params.Id),
            To: new mongoose.Types.ObjectId(req.params.Id2),
          },
          {
            From: new mongoose.Types.ObjectId(req.params.Id2),
            To: new mongoose.Types.ObjectId(req.params.Id),
          },
        ],
      })
      .sort({SendDate: -1, _id: -1})
//.skip(req.params.offset).limit(Number(req.params.offset) + 15);
    await models.msgSchemaModel.updateMany(
      {
        From: new mongoose.Types.ObjectId(req.params.Id2),
        To: new mongoose.Types.ObjectId(req.params.Id),
        Unread: true
      },
      { $set: { Unread: false } }
    );

    res.status(200).json(chatMessages);
  } catch (err) { res.status(500).json(err) }
};

exports.recentChatsController = async (req, res) => {
  try{
    const lastMessages = await models.msgSchemaModel.aggregate([
      {
        $match: {
          $or: [
            {
              From: new mongoose.Types.ObjectId(req.params.Id),
              Unread: true,
            },
            {
              To: new mongoose.Types.ObjectId(req.params.Id),
              Unread: true,
            },
            {
              From: new mongoose.Types.ObjectId(req.params.Id),
              Unread: false,
            },
            {
              To: new mongoose.Types.ObjectId(req.params.Id),
              Unread: false,
            },
          ],
        },
      },
      {
        $sort: {
          SendDate: -1,
        },
      },
      {
        $addFields: {
          FromTo: {
            $cond: {
              if: { $lt: ["$From", "$To"] },
              then: ["$From", "$To"],
              else: ["$To", "$From"],
            },
          },
        },
      },
      {
        $group: {
          _id: "$FromTo",
          Body: {
            $first: "$Body",
          },
          SendDate: {
            $first: "$SendDate",
          },
          Unread: {
            $first: "$Unread"
          },
          Source: {
            $first: "$Source"
          }
        },
      },
      {
        $project: {
          _id: 0,
          FromTo: "$_id",
          Body: 1,
          SendDate: 1,
          Unread: 1,
          Source: 1
        },
      },
    ]);

//    console.log(lastMessages);

    if (lastMessages.length === 0) {
      return res.json([]);
    }

    var temp = [];
    for (let i = 0; i < lastMessages.length; i++) {
      const lastMsg = lastMessages[i];

      for (let j = 0; j < lastMsg.FromTo.length; j++) {
        const ft = lastMsg.FromTo[j];

        if (ft.toString() != req.params.Id) {
          const friendData = await models.userSchemaModel.findOne({
            _id: ft,
          });
          temp.unshift({
            Id: friendData._id.toString(),
            FullName: `${friendData.Name} ${friendData.Lname}`,
            ProfilePhoto: config.DEFAULTPROFILE,
            Email: friendData.Email,
            LastMsgData: {
              Msg: lastMsg.Body,
              SendDate: lastMsg.SendDate,
              Unread: lastMsg.Unread,
              Source: lastMsg.Source
            },
            NewMsgCount: 0,
            ConnData: friendData.ConnData,
          });

          if (i === lastMessages.length - 1) {
            res.json(temp);
            break;
          }
        }
      }
    }
  } catch(err){ res.status(500).json(err) }
/*const lmc = await models.msgSchemaModel.aggregate([
    {
      $match: {
        $or: [
          {
            $and: [
              {
                From: new mongoose.Types.ObjectId(req.params.Id),
                Status2: "New",
              },
            ],
          },
          {
            $and: [
              {
                To: new mongoose.Types.ObjectId(req.params.Id),
                Status2: "New",
              },
            ],
          },
        ],
      },
    },
    {
      $sort: {
        SendDate: -1,
      },
    },
    {
      $addFields: {
        FromTo: {
          $cond: {
            if: { $lt: ["$From", "$To"] },
            then: ["$From", "$To"],
            else: ["$To", "$From"],
          },
        },
      },
    },
    // Grouping pipeline
    {
      $group: {
        _id: "$FromTo",
        count: {
          $sum: 1,
        },
      },
    },
    // Project pipeline, similar to select
    {
      $project: {
        _id: 0,
        FromTo: "$_id",
        count: 1,
      },
    },
  ]);*/

/*var temp = [];
  for (let i = 0; i < lastMessages.length; i++) {
    const lastMsg = lastMessages[i];

    for (let j = 0; j < lastMsg.FromTo.length; j++) {
      const ft = lastMsg.FromTo[j];

      if (
        ft.toString() != req.params.Id &&
        lmc[i].FromTo.toString().includes(ft) === true
      ) {
        const friendData = await models.userSchemaModel.findOne({
          _id: ft,
        });
        temp.push({
          Id: friendData._id.toString(),
          FullName: friendData.Name + " " + friendData.Lname,
          ProfilePhoto: friendData.Source,
          LastMsgData: {
            Msg: lastMsg.Body,
            SendDate: lastMsg.SendDate,
          },
          NewMsgCount: lmc[lastMessages.indexOf(lastMsg)].count,
          ConnData: friendData.ConnData
        });

        if (i === lastMessages.length - 1) {
          res.json({
            successCode: 10,
            lastMsg: temp,
          });
          break;
        }
      }
    }
  }*/
};