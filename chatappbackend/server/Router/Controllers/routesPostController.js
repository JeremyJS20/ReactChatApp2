//obtener modelos de schemas de la base de datos
'use strict'
const models = require('../../Utils/schemas');
const mongoose = require('mongoose');

const jwt = require('jsonwebtoken');
const CryptoJS = require("crypto-js");
const nodemailer = require("../../Utils/nodemailer");
const transporter = new nodemailer();

exports.createNewUserController = (req, res) => {
  /**
   * Se recibe la data del usuario a registrar y se crea un nuevo usuario en la base de datos
   * con clave encriptada
   */
  try {
    const newUser = new models.userSchemaModel({
      Name: req.body.name,
      Lname: req.body.lname,
      Email: req.body.email,
      UserName: req.body.username,
      Password: CryptoJS.AES.encrypt(req.body.password, 'password').toString()
    });
  
    newUser.save((err, result) => {
      if (err) {
        return res.status(500).json(err);
      }
  
      return res.status(200).json([{
        successMsg: 'User created successfully'
      }]);
    });
  } catch (error) {
    res.status(500).json(err)
  }
};

exports.verifyAndAuthUserController = async (req, res) => {
  try {
    /**
     * Para autenticar a un usuario al momento de loguearse en el sistema, se reciben el username
     * y la clave ingresada, se busca el usuario con el usernem ingresado, si existe se comparan las 
     * claves y dependiendo el resultado se le dara acceso al usuario al sistema
     */
    const getUser = await models.userSchemaModel.findOne({
      UserName: req.body.username
    }).exec();

    if (getUser === null) {
      return res.json([]);
    }

    // se desencripta la clave para compararla con la clave que se recibe
    const userPassword = CryptoJS.AES.decrypt(getUser.Password, 'password').toString(CryptoJS.enc.Utf8);

    if (req.body.password != userPassword) {
      return res.json([]);
    }

    // // una vez se confirman los datos se genera un token para autenticar al usuario
    const token = jwt.sign({
      Id: getUser._id,
      Name: getUser.Name,
      LName: getUser.Lname,
      Email: getUser.Email,
      UserName: getUser.UserName,
      ProfilePhoto: getUser.Source
    }, 'user', {
      expiresIn: '1h'
    });

    return res.status(200).json([{
      Id: getUser._id,
      Name: getUser.Name,
      LName: getUser.Lname,
      Email: getUser.Email,
      UserName: getUser.UserName,
      ProfilePhoto: getUser.Source,
      token: token
    }]);
  } catch (err) { res.status(500).json(err) }
};

exports.sendMessageWithFileController = async (req, res) => {
  const io = req.app.get('socketio');
  try {
    const source = [];
    if (req.files.files.length != undefined) {
      let i=0;
      req.files.files.forEach(file => {

        file.mv(`./public/${
          file.mimetype.split('/')[0] === 'image'? 'img': 
          file.mimetype.split('/')[0] === 'video'? 'videos':
          file.mimetype.split('/')[0] === 'audio'? 'audios':
          file.mimetype.split('/')[0] === 'application'? 'docs': ''
        }/${file.name}`, (err) => {
          if (err)  res.status(500).json(err);
          source.push({
            FileData: file.data,
            FileName: file.name,
            FileSize: file.size,
            FileMimetype: file.mimetype
          });
          if(i === req.files.files.length -1) return continuation()
          i++;
        });
      });
    }

    if (req.files.files.length === undefined) {
      req.files.files.mv(`./public/${
          req.files.files.mimetype.split('/')[0] === 'image'? 'img': 
          req.files.files.mimetype.split('/')[0] === 'video'? 'videos':
          req.files.files.mimetype.split('/')[0] === 'audio'? 'audios':
          req.files.files.mimetype.split('/')[0] === 'application'? 'docs': ''
      }/${req.files.files.name}`, (err) => {
        if (err)  throw err;
        source.push({
          FileData: req.files.files.data,
          FileName: req.files.files.name,
          FileSize: req.files.files.size,
          FileMimetype: req.files.files.mimetype
        });
        continuation()
      });
    }

    function continuation(){
      const newFileMessage = new models.msgSchemaModel({
        From: req.body.From,
        To: req.body.To,
        Body: req.body.Body === '' ? 'none' : req.body.Body,
        MsgType: req.body.MsgType,
        Source: source
      });
  
      newFileMessage.save((err, result) => {
        if (err) return res.status(500).json(err);
  
        io.to(process.env.SESSIONSMAP[req.body.From]).emit('Update Chats', result);
        io.to(process.env.SESSIONSMAP[req.body.From]).emit('Update Messages', result);
        io.to(process.env.SESSIONSMAP[req.body.To]).emit('Update Chats', result);
        io.to(process.env.SESSIONSMAP[req.body.To]).emit('Update Messages', result);
        io.to(process.env.SESSIONSMAP[req.body.To]).emit('Message sended', req.body.from, req.body.to);
  
        res.status(200).json(result);
      });
    }

  } catch (exc) {
    res.status(500).json(exc);
  }
};

exports.sendMessageController = async (req, res) => {
  const io = req.app.get('socketio');

  try {
    const newMessage = new models.msgSchemaModel({
      From: new mongoose.Types.ObjectId(req.body.from),
      To: new mongoose.Types.ObjectId(req.body.to),
      Body: req.body.msg,
      MsgType: "single",
    });

    newMessage.save((err, result) => {
      if (err) return res.status(500).json(err);
  
      io.to(process.env.SESSIONSMAP[req.body.from]).emit('Update Chats', result);
      io.to(process.env.SESSIONSMAP[req.body.to]).emit('Update Chats', result);
      io.to(process.env.SESSIONSMAP[req.body.to]).emit('Update Messages', result);
      io.to(process.env.SESSIONSMAP[req.body.to]).emit('Message sended', req.body.from, req.body.to);

      res.status(200).json(result);
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.forwardMessageController = async (req, res) => {
  try {
    const io = req.app.get('socketio');

    const forwadedMessage = await models.msgSchemaModel.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(req.body.IdForwardMessage)
      },
      {
        Forwarded: true
      }
    );

    const newForwardMessage = new models.msgSchemaModel(
      {
        From: req.body.From,
        MsgType: 'Forwarding',
        To: req.body.To,
        Body: forwadedMessage.Body,
        IsForwarding: true,
        Source: forwadedMessage.Source
      }
    );

    newForwardMessage.save((err, result) => {
      if (err) return res.status(500).json(err);

      io.to(process.env.SESSIONSMAP[req.body.From]).emit('Update Chats', result);
      io.to(process.env.SESSIONSMAP[req.body.From]).emit('Update Messages', result);
      io.to(process.env.SESSIONSMAP[req.body.To]).emit('Update Chats', result);
      io.to(process.env.SESSIONSMAP[req.body.To]).emit('Update Messages', result);
      io.to(process.env.SESSIONSMAP[req.body.To]).emit('Message sended', req.body.From, req.body.To);

      res.status(200).json(result);
    });
  } catch (exc) {
    res.status(500).json(exc);
  }
};

exports.replyMessageController = async (req, res) => {
  try {
    const io = req.app.get('socketio');

    const repliedMessage = await models.msgSchemaModel.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(req.body.IdReplyMessage)
      },
      {
        Replied: true
      }
    );

    const newReplyMessage = new models.msgSchemaModel(
      {
        From: req.body.From,
        MsgType: 'Replying',
        To: req.body.To,
        Body: req.body.Body,
        IsReplying: true,
        IsReplyingInfo: {
          IdRepliedMsg: repliedMessage._id,
          BodyRepliedMsg: repliedMessage.Body,
          IdSender: repliedMessage.From
        }
      }
    );

    newReplyMessage.save((err, result) => {
      if (err) return res.status(500).json(err);

      io.to(process.env.SESSIONSMAP[req.body.From]).emit('Update Chats', result);
      //      io.to(process.env.SESSIONSMAP[req.body.From]).emit('Update Messages', result);
      io.to(process.env.SESSIONSMAP[req.body.To]).emit('Update Chats', result);
      io.to(process.env.SESSIONSMAP[req.body.To]).emit('Update Messages', result);
      io.to(process.env.SESSIONSMAP[req.body.To]).emit('Message sended', req.body.From, req.body.To);

      res.status(200).json(result);
    });
  } catch (exc) {
    res.status(500).json(exc);
  }
};

exports.sendFriendRequestController = async (req, res) => {
  try {
    const sol = await models.notificationsSchemaModel.findOne({
      $or: [
        {
          Type: "FriendRequest",
          From: new mongoose.Types.ObjectId(req.body.from),
          To: new mongoose.Types.ObjectId(req.body.to),
          Status: "waiting",
        },
        {
          Type: "FriendRequest",
          From: new mongoose.Types.ObjectId(req.body.from),
          To: new mongoose.Types.ObjectId(req.body.to),
          Status: "accepted",
        },
        {
          Type: "FriendRequest",
          From: new mongoose.Types.ObjectId(req.body.to),
          To: new mongoose.Types.ObjectId(req.body.from),
          Status: "waiting",
        },
        {
          Type: "FriendRequest",
          From: new mongoose.Types.ObjectId(req.body.to),
          To: new mongoose.Types.ObjectId(req.body.from),
          Status: "accepted",
        },
      ],
    });

    if (sol != null) {
      var msg = "";
      if (sol.Status === "accepted") {
        msg = "Este usuario ya es su amigo";
      } else {
        msg = "You have already sent a friend request to this user";
      }
      return res.json({
        errCode: 6,
        errMsg: msg,
      });
    }
    const user = await models.userSchemaModel.findOne({
      _id: new mongoose.Types.ObjectId(req.body.from),
    });

    const newFriendRequest = new models.notificationsSchemaModel({
      From: new mongoose.Types.ObjectId(req.body.from),
      To: [new mongoose.Types.ObjectId(req.body.to)],
      Type: "FriendRequest",
      Body: "want to add you to his contacts list",
      Status: "waiting",
      UserName: user.UserName,
      ProfilePhoto: user.Source.ProfilePhoto,
    });

    newFriendRequest.save((err, result) => {
      if (err) return res.status(500).json(err);
      const io = req.app.get('socketio');

      io.to(process.env.SESSiONSMAP[req.body.to]).emit("New Notification", result);

      return res.status(200).json({
        successCode: 6,
        successMsg: "Friend request was sended",
      });
    });
  } catch (err) { 
    res.status(500).json(err)
  }
};

exports.addContactController = async (req, res) => {
  try {
    let fl1 = await models.userContactListSchemaModel.updateOne(
      {
        IDUser: new mongoose.Types.ObjectId(req.body.IDUser),
      },
      {
        $push: { ContactList: {IDContact: new mongoose.Types.ObjectId(req.body.IDContact), Name: req.body.Name, Lname: req.body.LName} },
      }
    );

    if (fl1.modifiedCount === 0) {
      fl1 = await new models.userContactListSchemaModel({
        IDUser: new mongoose.Types.ObjectId(req.body.IDUser),
        ContactList: [{IDContact: new mongoose.Types.ObjectId(req.body.IDContact), Name: req.body.Name, Lname: req.body.LName}],
      }).save();
    } else{
      fl1 = await models.userContactListSchemaModel.findOne({
        IDUser: new mongoose.Types.ObjectId(req.body.IDUser),
      });
    }

    const friendData = await models.userSchemaModel.findOne({
      _id: new mongoose.Types.ObjectId(req.body.IDContact),
    });

    const cont = fl1.ContactList.find((contact) => contact.IDContact.toString() == req.body.IDContact);

    res.status(200).json({
      Id: friendData._id.toString(),
      FullName: `${cont.Name || friendData.Name} ${cont.Lname || friendData.Lname}`,
      UserName: friendData.UserName,
      ConnData: friendData.ConnData,
      Email: friendData.Email,
      Status2: '',
      ProfilePhoto: process.env.DEFAULTPROFILE,
    });
  } catch (error) {
    
  }
};

exports.acceptFriendRequestController = async (req, res) => {
  try {
    await models.notificationsSchemaModel.updateOne(
      {
        Type: "FriendRequest",
        From: new mongoose.Types.ObjectId(req.body.from),
        To: new mongoose.Types.ObjectId(req.body.to),
        Status: "waiting",
      },
      {
        $set: {
          Status: "accepted",
          Body: "has been added to your contacts list",
        },
      }
    );

    const not = await models.notificationsSchemaModel.updateOne(
      {
        Type: "FriendRequest",
        From: new mongoose.Types.ObjectId(req.body.to),
        To: new mongoose.Types.ObjectId(req.body.from),
        Status: "waiting",
      },
      {
        $set: {
          Status: "accepted",
          Body: "has accepted your friend request and was added to your contacts list",
        },
      }
    );

    const io = req.app.get('socketio');

    if (not.modifiedCount === 0) {
      const user = await models.userSchemaModel.findOne({
        _id: new mongoose.Types.ObjectId(req.body.to),
      });
      new models.notificationsSchemaModel({
        From: new mongoose.Types.ObjectId(req.body.to),
        To: [new mongoose.Types.ObjectId(req.body.from)],
        Type: "FriendRequest",
        Body: "has accepted your friend request and was added to your contacts list",
        Status: "accepted",
        UserName: user.UserName,
        ProfilePhoto: user.Source.ProfilePhoto,
      }).save();
      io.to(process.env.SESSiONSMAP[req.body.from]).emit("New Notification");
      io.to(process.env.SESSiONSMAP[req.body.from]).emit("Update Contacts List");
    }

    if (not.modifiedCount > 0) {
      io.to(process.env.SESSiONSMAP[req.body.from]).emit("New Notification");
      io.to(process.env.SESSiONSMAP[req.body.from]).emit("Update Contacts List");
    }

    const fl1 = await models.userContactListSchema.findOneAndUpdate(
      {
        IDUser: new mongoose.Types.ObjectId(req.body.from),
      },
      {
        $push: { FriendList: new mongoose.Types.ObjectId(req.body.to) },
      }
    );

    if (fl1 === null) {
      new models.userContactListSchema({
        IDUser: new mongoose.Types.ObjectId(req.body.from),
        FriendList: [new mongoose.Types.ObjectId(req.body.to)],
      }).save();
    }

    const fl2 = await models.userContactListSchema.findOneAndUpdate(
      {
        IDUser: new mongoose.Types.ObjectId(req.body.to),
      },
      {
        $push: { FriendList: new mongoose.Types.ObjectId(req.body.from) },
      }
    );

    if (fl2 === null) {
      new models.userContactListSchema({
        IDUser: new mongoose.Types.ObjectId(req.body.to),
        FriendList: [new mongoose.Types.ObjectId(req.body.from)],
      }).save();
    }

    io.to(process.env.SESSiONSMAP[req.body.to]).emit("New Notification");
    io.to(process.env.SESSiONSMAP[req.body.to]).emit("Update Contacts List");

    res.json({
      successCode: 8,
      successMsg: "A new contact was added to your contacts list",
    });
  } catch (err) { }
};

exports.sendPasswordRecoveryEmail = async (req, res) => {
  try {
    const emailTo = req.body.email;

    let token = jwt.sign({
      email: emailTo,
    },
    "resetpassword", {
      expiresIn: 3600,
    });

    const user = await models.userSchemaModel.findOne({
      Email: emailTo,
    }).exec();

    transporter.sendEmail({
      from: `Forgotten password - Chat App   <${process.env.NODEMAILER_AUTH_EMAIL}>`,
      to: emailTo,
      subject: "Forgotten Password", // Subject line
      html: `<h3>Hey ${user.Name}</h3><hr><p>Para continar con el proceso, </p> <a href="${process.env.ORIGIN}/resetPassword/${token}">haga click aqui</a> <p>El enlace expira en 10 minutos, asi que acceda lo mas pronto posible.</p>`, // html body
    });

    res.json({msg: 'email sended'});
  } catch (err) { }
};

exports.resetPassword = async (req, res) => {
  try {

    await models.userSchemaModel.findOneAndUpdate({
      Email: req.body.email,
    },
    {
      Password: CryptoJS.AES.encrypt(req.body.password, 'password').toString(),
    }
    ).exec();

    res.json({msg: 'password resetted'});
  } catch (err) { }
};