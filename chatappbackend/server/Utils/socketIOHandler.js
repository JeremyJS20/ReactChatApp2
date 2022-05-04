//modelos de esquemas de la base de datos
const models = require('./schemas');
const mongoose = require("mongoose");
const config = require('./config');

module.exports = (socket, io) => {
  socket.on("User authenticated", async (id, email) => {
    try {   
      /**
       * Cuando se autentica un usuario en el sistema, se le creara una room para fines de emitir y
       * recibir datos desde el servidor o desde otro usuario a un usuario en especifico.
       * Por ejemplo, si esta escribiendo a un usuario especifico este recibira un aviso de que esta escribiendo
       */
      await models.userSchemaModel
        .findOneAndUpdate(
          {
            _id: new mongoose.Types.ObjectId(id),
          },
          {
            ConnData: {
              Status: "Online",
            },
          }
        )
        .exec();

          config.SESSIONSMAP[id] = socket.id;

      socket.join(id);

      const myChatFriends = await models.userFriendListSchemaModel.findOne({
        IDUser: new mongoose.Types.ObjectId(id),
      });

      if (myChatFriends != null) {
        myChatFriends.FriendList.forEach((chat) => {
          socket.join(chat.toString());
        });
      }

      socket.to(id).emit("Friend connected", id);

    } catch (err) {
      throw err;
    }
  });

  socket.on("User unauthenticated", async (id, date) => {
    try {
      await models.userSchemaModel.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(id),
        },
        {
          ConnData: {
            Status: "Offline",
            LastConn: date,
          },
        }
      );
      socket.to(id).emit("Friend disconnected", id, date);
    } catch (err) { }
  });

  socket.on("User disconnected", async (id, date) => {
    await models.userSchemaModel
      .findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(id),
        },
        {
          ConnData: {
            Status: "Offline",
            LastConn: date,
          },
        }
      )
      .exec();
    socket.to(id).emit("Friend disconnected", id);
  });

  socket.on("verify email", async (email, callback) => {
    try {
      /**
       * Es para verificar si existe un email en la base de datos, ya que el email es unico
       * y se le retornara un valor bool con el cual se le hara saber al usuario en el lado del cliente
       * si existe el email al momento de registrarse
       */
      const getUserByEmail = await models.userSchemaModel
        .findOne({
          Email: email,
        })
        .exec();
      if (getUserByEmail === null) {
        return callback({
          emailExists: false,
        });
      }

      return callback({
        emailExists: true,
      });
    } catch (err) { }
  });

  socket.on("verify username", async (username, callback) => {
    try {
      /**
       * Es para verificar si existe un username en la base de datos, ya que el usermane es unico
       * y se le retornara un valor bool con el cual se le hara saber al usuario en el lado del cliente
       * si existe el usuario al momento de registrarse
       */
      const getUserByUsername = await models.userSchemaModel
        .findOne({
          UserName: username,
        })
        .exec();
      if (getUserByUsername === null) {
        return callback({
          userNameExists: false,
        });
      }

      return callback({
        userNameExists: true,
      });
    } catch (err) { }
  });

  socket.on('working', () => console.log('working'));

  socket.on("add new friend", async (id, username, callback) => {
    try {
      /**
       * Basicamente desde el formulario de agregar amigos en el cliente recibira
       * un id del usuario autenticado y el username del usuario al que se quiere agregar
       * y mediante una funcion callback le retornaremos los datos del usuario que se encuentre
       */
      const getUserByUsername = await models.userSchemaModel
        .findOne({
          UserName: username,
        })
        .exec();
      if (
        getUserByUsername === null ||
        getUserByUsername._id.toString() === id
      ) {
        return callback({
          errCode: 5,
          errMsg: "No se ha encontrado al usuario",
        });
      }

      return callback({
        successCode: 5,
        userData: {
          Id: getUserByUsername._id,
          Name: getUserByUsername.Name,
          LName: getUserByUsername.Lname,
          Email: getUserByUsername.Email,
          UserName: getUserByUsername.UserName,
        },
      });
    } catch (err) { }
  });

  socket.on("Typing message", (id, id2) => {
    socket.to(config.SESSIONSMAP[id]).emit("Typing message", id2)
  });

  socket.on("No typing message", (id, id2) => {
    socket.to(config.SESSIONSMAP[id]).emit("No typing message", id2);
  });
};