import React from "react";
import axios from "axios";

const Chats = (props: any) => {
  const [message, setmessage] = React.useState("");
  const [username, setusername] = React.useState("");
  const [mymsgs, setmymsgs] = React.useState([]);
  React.useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000");
    ws.onopen = () => {
      console.log("opened");
    };
    ws.onmessage = (msg: any) => {
      setmymsgs(JSON.parse(msg.data));
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
        setmymsgs(result.data);
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
    };
    getmsgs();
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
        data: { data: { user1:props.match.params.name,user2:username, message } },
      });
      console.log(result.data);
      setmymsgs(result.data);
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
      <br></br>
      <br></br>
      <br></br>
      <div className="msgs">
        {mymsgs.map((ele:{user1:string,message:string,user2:string}) => {
          return (<>
            <h3>{ele.user1}</h3>
            <h3>{ele.user2}</h3>
            <p>{ele.message}</p>
            <br></br>
            <br></br>
          </>)
        })}
      </div>
    </>
  );
};

export default Chats;
