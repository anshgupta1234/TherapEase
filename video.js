import { StreamVideoClient, User } from '@stream-io/video-client';

console.log("your mother")

const apiKey = '2ggc99pm25er';
const token = 'gm47gugt9gsn5y52ah4js7ymxr7m6ypcv7cfhxnab6zbmpf4gdkg442q9x7umh8w';
const user = { id: 'user-id' };

const client = new StreamVideoClient({ apiKey, token, user });
const call = client.call('default', 'call-id');
call.join({ create: true });