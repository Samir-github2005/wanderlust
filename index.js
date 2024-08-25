const express = require('express')
const app = express()
const mongoose=require("mongoose")
const Listing  = require('./modules/listing')
const path=require('path')
const methodOverride=require('method-override')
const ejsMate=require('ejs-mate')

app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname,"/public")))
app.engine("ejs",ejsMate)

app.set("view engine","ejs")
app.set("views", path.join(__dirname,"views"))

main().then(()=>{
    console.log("connected to db")
})
.catch((err)=>{
    console.log(err)
})
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
}

app.get("/",(req,res)=>{
    res.send("root is working")
})

app.get("/listings",async(req,res)=>{
    const allListings= await Listing.find({})
    res.render("./listings/index.ejs",{allListings})
})

//new Route
app.get("/listings/new",(req,res)=>{
    res.render("./listings/new.ejs")
})

//show route
app.get("/listings/:id",async (req,res)=>{
    let id=req.params.id
    const listing=await Listing.findById(id)
    res.render("./listings/show.ejs",{listing})
})

//create route
app.post("/listings",async (req,res)=>{
    let {title,description,image,price,location,country}=req.body
    const newListing= await new Listing({
        title:title,
        description:description,
        image:image,
        price:price,
        location:location,
        country:country
    }).save()
    res.redirect("/listings")
})

//Edit route
app.get("/listings/:id/edit",async(req,res)=>{
    let {id}=req.params
    let listing= await Listing.findById(id)
    res.render("./listings/edit.ejs",{listing})
})

//Update route
app.put("/listings/:id", async(req,res)=>{
    let {id}=req.params
    let updatedListing= await Listing.findByIdAndUpdate(id,{...req.body.Listing})
    res.redirect(`/listings/${id}`)
})

//Delete Route
app.delete("/listings/:id",async(req,res)=>{
    let {id}=req.params
    let deletedListing= await Listing.findByIdAndDelete(id)
    console.log(deletedListing)
    res.redirect("/listings")
})


// app.get("/testListings", async (req,res)=>{
//     let sampleListing= new Listing({
//         title: "My new villa",
//         description: "This is a beautiful villa with a pool",
//         price: 1000,
//         location: "Goa",
//         country :"India"
//     })
//     await sampleListing.save()
//     res.send("sample succesfully saved")
// })

app.listen(8080,()=>{
    console.log("server is running on 8080")
})