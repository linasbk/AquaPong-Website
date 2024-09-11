




export const webSocketProv = ({children}) => {
   
    useEffect(()=>{

            socket = new WebSocket(url);

            socket.onopen = ()=> setReady(true);
            socket.onclose = () => setReady(false)

            socket.onmessage = (event) => {
                setValue(event);

            }

            websock.current = socket;
            const sendMessage = () => {
                if (ws.current && ws.current.readyState === WebSocket.OPEN) {
                  ws.current.send('Hello, WebSocket!');
                } else {
                  console.error('WebSocket is not open. Ready state: ', ws.current?.readyState);
                }
              };

            return(
                socket.close()
            )
    },[])

    const ret = [ready,setReady,val,setValue,sendMessage];


    <WebSocket.provider value= {ret}>
        {children}
    </WebSocket.provider>

}