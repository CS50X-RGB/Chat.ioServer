import mongoose from "mongoose";

const connectDb = () => {
    mongoose.connect(process.env.DATABSE_URL,{
        dbName:"CHATAPP"
    })
    .then((c) => console.log(`Database Connected ${c.connection.host}`))
    .catch((e) => console.log(e))
};
export default connectDb;
