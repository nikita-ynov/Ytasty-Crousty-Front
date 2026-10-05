import { io, type Socket } from "socket.io-client";
import type { Order } from "../types/order";

class SocketService {
    private static instance: SocketService;

    public socket: Socket;

    private constructor() {
        const URL =
            import.meta.env.VITE_API_URL ||
            "http://localhost:8000";

        this.socket = io(URL, {
            autoConnect: false
        });
    }

    public static getInstance(): SocketService {
        if (!SocketService.instance) {
            SocketService.instance = new SocketService();
        }

        return SocketService.instance;
    }

    public connect(): void {
        if (!this.socket.connected) {
            this.socket.connect();
        }
    }

    public disconnect(): void {
        if (this.socket.connected) {
            this.socket.disconnect();
        }
    }

    public onNewOrder(
        callback: (order: Order) => void
    ): void {
        this.socket.on("new_order", callback);
    }

    public offNewOrder(
        callback: (order: Order) => void
    ): void {
        this.socket.off("new_order", callback);
    }
}

export const socketService =
    SocketService.getInstance();

export default SocketService;