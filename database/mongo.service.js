import mongoose from "mongoose";
// mongoose.Promise = global.Promise;

let connect = () => {
  const options = {
    
  };
  const db = mongoose.connect(process.env.MONGO_URL, options);

  mongoose.connection.on('connected', () => {
    console.log("database connected");
  });

  // If the connection throws an error
  mongoose.connection.on('error', (err) => {
    console.log('handle mongo errored connections: ' + err);
  });

  // When the connection is disconnected
  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose default connection disconnected');
  });
  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      console.log('App terminated, closing mongo connections');
      process.exit(0);
    });
  });
  return db
};

export default connect