import socketio


sio = socketio.AsyncServer(
    async_mode="asgi",
    cors_allowed_origins="*",
)


@sio.event
async def connect(sid, environ):
    print("Socket connecté :", sid)


@sio.event
async def disconnect(sid):
    print("Socket déconnecté :", sid)