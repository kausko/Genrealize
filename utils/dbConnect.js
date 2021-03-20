import mongoose from 'mongoose'

async function dbConnect() {
  if (!!mongoose.connection.readyState)
    return

  return mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
}

export default dbConnect