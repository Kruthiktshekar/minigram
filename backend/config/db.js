import mongoose from "mongoose";

export const ConfigDb = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URL,{
       useNewUrlParser: true,
       useUnifiedTopology: true,
     serverSelectionTimeoutMS: 30000, 
     }
    );
    if (connection) {
      console.log("Db is connected successfully");
    }
  } catch (error) {
    console.error(error);
  }
};
