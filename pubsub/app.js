const express = require('express');

const redis = require('redis');

const WebSocket = require('ws');

const redis_port = 6379;

const client = redis.createClient(redis_port);

const publish = redis.createClient(redis_port);

const app = express();

app.use(express.json());

app.set("view engine","hbs");

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

wss.on("connection",(ws)=>{
    client.on("message",(channel,message)=>{
        console.log("channel :",channel,"message :",message);
        ws.send("channel :"+channel+"message :"+message);
    })
    ws.on("message",(msg)=>{
        console.log(msg);
        client.subscribe(msg);
        // ws.send(msg);
    })
});


app.get("",(req,res)=>{
    // console.log("hello");
    return res.render("index");
})