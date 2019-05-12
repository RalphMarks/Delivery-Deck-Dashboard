import io from 'socket.io-client';
import feathers from '@feathersjs/client';

const socket = io('http://localhost:3030');
const client = feathers();

client.configure(feathers.socketio(socket));
// Available options are listed in the "Options" section
client.configure(feathers.authentication());

export default client;