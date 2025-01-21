import mongoose from 'mongoose';

export const ConfigDb = async () => {
  try {
    // eslint-disable-next-line no-undef
    const connection = await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    if (connection) {
      console.log('Db is connected successfully');
    }
  } catch (error) {
    console.error(error);
  }
};
