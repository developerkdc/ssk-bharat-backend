io.on("connection", (socket) => {
    console.log("A new User Has connected", socket.id );
    socket.on("activeUser", ({userID, token}) => {
      try {
        AddActiveUser({
          userID:userID,
          token,
          socketID:socket.id
        });
      } catch (error) {
        console.log(error);
      }
    });
  
    socket.on("logoutactiveUser", ({userID,...data}) => {
      try {
        // console.log(data,";a;a;a;a",socket.id)
        RemoveActiveUser({
          userID,
          socketID:socket.id
        });
      } catch (error) {
        console.log(error);
      }
    });
  
    socket.on("activeUserList",async function(queryData = {}){
      const Data = {...queryData};
  
      socket.emit("getActiveUserList",await ActiveUsersList(Data))
  
    })
  
    socket.on('error', (err) => {
      console.error('Socket.IO Error:', err);
    });
  
    socket.on("disconnecting", () => {
      console.log("User disconnecting", socket.id);
    });
  
    // Listen for disconnection
    socket.on("disconnect", () => {
      console.log("User disconnected", socket.id);
      try {
        socket.emit("logoutactiveUser",{
          socketID:socket.id
        })
        // socket.emit("activeUserList",{})
      } catch (error) {
        console.log(error);
      }
    });
  });