import { Client } from "@stomp/stompjs";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";



const UseNotificationSocket = (handleNewThongBao) =>{

    const user = useSelector((state)=> state.auth.user);

    const clientRef = useRef(null);

     useEffect(() => {
            const client = new Client({
                brokerURL: "ws://localhost:8080/ws",
                onConnect: () => {
                   
                    console.log("Websocket connected");
    
                    client.subscribe(`/topic/nhan-vien/${user.id}`, (message) => {
                        console.log("Raw message Body:", message.body);
                        try{
                            const data = JSON.parse(message.body);
                            handleNewThongBao(data);
                        }catch (err) {
                            console.error("Error parsing message:", err);
                        }
                    });
                },
                onStompError: (frame) => {
                    console.error('STOMP Error:', frame);
                },
                onWebSocketError: (event) => {
                    console.error('Websocket Error:', event);
                },
                reconnectDelay: 5000,
                debug: str => console.log(str),
            });
    
            client.activate();
            clientRef.current = client;
    
            return () => {
                clientRef.current?.deactivate();
            }
        },[]);
    
}
export default UseNotificationSocket;