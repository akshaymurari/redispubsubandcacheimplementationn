const express = require('express');
const redis = require('redis');
const mongoose = require('mongoose');

const redis_port = 6379;

const client = redis.createClient(redis_port);

client.on("connect",(error)=>{
    if(error){
        console.log(error);
    }
    else{
        console.log("connected to redis");
    }
});

mongoose.connect("mongodb://localhost:27017/mydb",{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("connected to mongodb");
}).catch((error)=>{
    console.log(error);
});

const app = express();

app.use(express.json());

app.listen(8000,(error)=>{
    if(error){
        console.log(error);
    }
    else{
        console.log("connected listening at port 8000");
    }
});

const users = new mongoose.Schema({
    name:String,
    pass:String,
    desc:String
});

const user =  mongoose.model("user",users);

app.get("/get",async (req,res)=>{
    console.log(req.body);
    const user1 = await user.find({});
    console.log(user1);
    return res.status(200).send(user1);
});


app.get("/get/:user",(req,res)=>{
    console.log(req.body);
    client.get(req.params.user,async (error,reply)=>{
        console.log(reply);
        if(!reply){
            const user1 = await user.find({
                name:req.params.user
            });
            console.log(user1);
            client.set(req.params.user,JSON.stringify(user1),(error,reply)=>{
                console.log(reply);
                client.expire(req.params.user,10,(reply)=>{
                    console.log(reply);
                    return res.status(200).send(user1);
                });
            });
        }
        else{
            console.log("present in redis");
            return res.status(200).send(reply);
        }
    });
});


app.post("/add",async (req,res)=>{
    try{
        console.log(req.body);
        const user1 = user({...req.body.data});
        console.log(user1);
        await user1.save();
        return res.status(200).send("added");
    }
    catch(error){
        console.log(error);
        return res.status(400).send("not added");
    }
});

