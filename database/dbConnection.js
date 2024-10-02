import mongoose from 'mongoose';

export const dbConnection = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: 'HospitalManagement', //make sure no space between dbname
    })
    .then(() => {
      console.log('Connected to Database ');
    })
    .catch((err) => {
      console.log(`Some Error Occcured While Connection to Databse ${err}`);
    });
};
