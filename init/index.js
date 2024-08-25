const mongoose=require('mongoose')
const Listing=require('../modules/listing')
const initData=require('./data')

main().then(()=>{
    console.log("connected to db")
})
.catch((err)=>{
    console.log(err)
})
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
}

const initDb= async()=>{
    await Listing.deleteMany({})
    await Listing.insertMany(initData.data)
    console.log("Data Saved")
}

initDb()