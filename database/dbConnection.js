import mongoose from 'mongoose';

export const dbConnection = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: 'MERN Stack Hospital Management',
    })
    .then(() => {
      console.log('Connected to Database ');
    })
    .catch((err) => {
      console.log(`Some Error Occcured While Connection to Databse ${err}`);
    });
};
