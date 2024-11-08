const mongoose=require('mongoose')

const connectDb=async()=>{
   try{
    await mongoose.connect(process.env.MONGODB_URI)
    console.log(`MongoDb connected successfully`)
   }
   catch(err){
    console.error(err)
    process.exit(1)
   }
}
module.exports= connectDb