import { useEffect } from "react";
import { useSocketContext } from "../contexts/SocketContext.jsx";

export const useSocket = (event, handler) => {
  const { socketService } = useSocketContext();

  useEffect(() => {
    if (!handler) return;
    return socketService.on(event, handler);
  }, [event, handler, socketService]);
};
