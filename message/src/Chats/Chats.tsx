import React from "react";
import axios from "axios";

const Chats = (props: any) => {
  const [message, setmessage] = React.useState("");
  const [username, setusername] = React.useState("");
  React.useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000");
    ws.onopen = () => {
        console.log("opened");
      };
      ws.onmessage = (msg: any) => {
        console.log(msg);
      };
      ws.onclose = () => {
        console.log("closed");
      };
    const getmsgs = async () => {
      try {
        const result = await axios({
          url: "http://localhost:8000/getmsgs",
          method: "post",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
          },
          data: { username: props.match.params.name },
        });
        console.log(result.data);
      } catch (error) {
        console.log(error);
      }
    };
    const subscribe = async () => {
        try {
            const result = await axios({
              url: "http://localhost:8000/subscribe",
              method: "post",
              headers: {
                accept: "application/json",
                "Content-Type": "application/json",
              },
              data: { username: props.match.params.name },
            });
            console.log(result.data);
          } catch (error) {
            console.log(error);
          }
    } 
    subscribe();
  }, []);
  const sendmsg = async () => {
    try {
        const result = await axios({
          url: "http://localhost:8000/publish",
          method: "post",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
          },
          data: {data:{username,message }},
        });
        console.log(result.data);
      } catch (error) {
        console.log(error);
      }
  };
  return (
    <>
      <input
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setusername(e.target.value);
        }}
      ></input>{" "}
      <br></br> <br></br>
      <input
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setmessage(e.target.value);
        }}
      ></input>
      <br></br> <br></br>
      <button onClick={() => sendmsg()}>send</button>
    </>
  );
};

export default Chats;
