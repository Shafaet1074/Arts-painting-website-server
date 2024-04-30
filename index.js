const express = require('express');
const cors = require('cors');
require('dotenv').config();



const app=express();
const port =process.env.port || 5003;


// ArtsWebsite
// ujBgG2eLFp4eQmIp

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


// middleware
app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5ftvpmn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    const artsCollection =client.db('artsDB').collection('paintings')
    await client.connect();
   

    app.get('/addpaintings', async(req,res) =>{
      const cursor =artsCollection.find();
      const result=await cursor.toArray();
      res.send(result)
    })

    app.get("/addpaintings/:email", async(req,res)=>{
      console.log(req.params.email);
      const result= await  artsCollection.find({email:req.params.email}).toArray();
      res.send(result);
    })

    app.get("/allPaintings/:id", async(req,res)=>{
      console.log(req.params.id);
      const result = await artsCollection.findOne({_id:
     new ObjectId(req.params.id) ,
    })
     console.log(result);
      res.send(result)
    })


    app.get("/myArts/:id", async(req,res)=>{
      console.log(req.params.id);
      const result = await artsCollection.findOne({_id:
     new ObjectId(req.params.id) ,
    })
     console.log(result);
      res.send(result)
    })

    app.put("/myArts/:id" ,async(req,res)=>{
      console.log(req.params.id)
      const id = req.params.id;
      const filter ={_id: new ObjectId(id)}

     const data=req.body;
      const fulldata ={
        $set:{
          paintingname:data.paintingname,
          SubcategoryName:data.SubcategoryName,
          price:data.price,
          Rating:data.Rating,
          Customization:data.Customization,
          ProcessingTime:data.ProcessingTime,
          photo:data.photo,
          ShortDescription:data.ShortDescription
        }
      }
      const result = await artsCollection.updateOne(filter,fulldata);
      
      res.send(result);
      console.log(result);
    })


    app.post('/addpaintings', async(req,res) =>{
      const newPaintings =req.body;
      console.log(newPaintings);
      const result = await artsCollection.insertOne(newPaintings);
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir); 





app.get('/', (req,res) => {
  res.send('arts server is running')
})

app.listen(port,  () =>{
  console.log(`Arts Server is running on port: ${port}`);
})