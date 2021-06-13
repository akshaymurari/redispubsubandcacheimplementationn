const express = require('express');

const redis = require('redis');

const cors = require("cors");

require("./database/connect");

const db = require("./database/connect");

const WebSocket = require('ws');

const redis_port = 6379;

const client = redis.createClient(redis_port);

var cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name:"djbxbjuvu",
    api_key:"332967746993917",
    api_secret:"s6bIQpzAvBkNEitwWe2ne-SN80U"
})

const publish = redis.createClient(redis_port);

const app = express();

app.use(cors());

app.use(express.json());

app.set("view engine","hbs");

app.post("/getmsgs",async (req,res)=>{
    try{
        const user1 = req.body.username;
        console.log(user1);
        const result = await db.chats.findOne({
            where:{
                user1
            }
        })
        console.log(result);
        res.status(200).send(result);
    }
    catch(error){
        console.log(error);
        res.status(400).send("error in getmsgs");
    }
});

client.on("connect",function(error){
    if(!error){
        console.log("connected to redis");
    }else{
        console.log(error);
    }
});

const server = app.listen(8000,(error)=>{
    if(!error){
        console.log("connected")
    }else{
        console.log(error);
    }
});

const wss = new WebSocket.Server({
    server
});

app.post("/pub/:data/:msg",(req,res)=>{
    console.log(req.params);
    publish.publish(req.params.data,req.params.msg,(error,reply)=>{
        if(error){
            console.log(error);
            return res.status(400).send("publishing failed");
        }
        else{
            console.log(reply);
            return res.status(200).send("published");
        }
    });
});

app.post("/subscribe",(req,res)=>{
    console.log(req.body.username)
    client.subscribe(req.body.username,(error)=>{
        if(error){
            console.log(error);
            return res.status(400).send("invalid user");
        }
        else{
            return res.status(200).send("valid user");
        }
    });
})

app.post("/publish",(req,res)=>{
    console.log(req.body.username);
    publish.publish(req.body.data.username,req.body.data.message,(error)=>{
        if(error){
            console.log(error);
            return res.status(400).send("invalid user");
        }
        else{
            return res.status(200).send("valid user");
        }
    });
})

wss.on("connection",(ws)=>{
    client.on("message",(channel,message)=>{
        console.log("channel :",channel,"message :",message);
        ws.send("channel :"+channel+"message :"+message);
    });
    // ws.on("message",(msg)=>{
    // });

});


app.get("/:name",(req,res)=>{
    // console.log("hello");
    return res.render("index",{name:req.params.name});
})
