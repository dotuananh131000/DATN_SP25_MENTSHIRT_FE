import { Client, Stomp } from "@stomp/stompjs";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import SockJS from "sockjs-client";


const useSocket = ( handleNewOrder, handleError ) => {

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
                        toast.info(data.noiDung);
                        handleNewOrder();
                        // toast(data)
                    }catch (err) {
                        console.error("Error parsing message:", err);
                        // handleError?.("Lỗi xử lý dữ liệu từ máy chủ");
                    }
                });
            },
            onStompError: (frame) => {
                console.error('STOMP Error:', frame);
                // handleError?.('Kết nối websocket gặp lỗi STOMP.');
            },
            onWebSocketError: (event) => {
                console.error('Websocket Error:', event);
                // handleError?.('Không thể kết nối tới máy chủ')
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
export default useSocket;