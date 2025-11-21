// server.js — simple Express + Socket.io server
// Run: npm init -y && npm i express socket.io cors body-parser
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
app.use(cors()); app.use(bodyParser.json());

// In-memory stores (replace with DB in prod)
const drivers = {}; // id -> {id, name, lat,lng,available}
const rides = {};   // id -> ride object

// Seed sample drivers
for(let i=1;i<=6;i++){ drivers['D'+i] = {id:'D'+i, name:'Driver'+i, lat:0.0236 + (Math.random()-0.5)/100, lng:37.9062 + (Math.random()-0.5)/100, available:true, socketId:null}; }

app.get('/api/drivers', (req,res)=>{
  res.json(Object.values(drivers));
});

app.post('/api/book', (req,res)=>{
  const {pickup, dropoff, rideType, riderId} = req.body;
  // naive driver assignment: nearest available
  let best=null; let bestDist=Infinity;
  Object.values(drivers).forEach(d=>{
    if(!d.available) return;
    const dx = d.lat - pickup.lat; const dy = d.lng - pickup.lng; const dist = Math.sqrt(dx*dx+dy*dy);
    if(dist<bestDist){ bestDist=dist; best=d; }
  });
  if(!best) return res.status(503).json({error:'No drivers available'});
  const rideId = 'R'+Date.now();
  const ride = {id:rideId, pickup, dropoff, rideType, driverId:best.id, riderId, status:'requested', createdAt:Date.now()};
  rides[rideId]=ride; best.available=false;
  // notify driver via socket
  if(best.socketId) io.to(best.socketId).emit('rideAssigned', ride);
  return res.json({ride, message:'Assigned driver '+best.id});
});

app.post('/api/driver/update', (req,res)=>{ const {id,lat,lng,available} = req.body; if(!drivers[id]) return res.status(404).end(); drivers[id].lat=lat; drivers[id].lng=lng; drivers[id].available = available!==undefined?available:drivers[id].available; res.json(drivers[id]); });

// Websocket for driver/rider real-time
io.on('connection', (socket)=>{
  console.log('sock connected', socket.id);
  socket.on('registerDriver', (payload)=>{ const {id} = payload; if(drivers[id]) drivers[id].socketId=socket.id; socket.join('drivers'); });
  socket.on('registerRider', (payload)=>{ socket.join('riders'); });
  socket.on('updateLocation', (payload)=>{ // broadcast to admins
    socket.broadcast.emit('driverLocation', payload);
  });
  socket.on('disconnect', ()=>{ console.log('sock disconnect', socket.id); });
});

const PORT = process.env.PORT || 3000; server.listen(PORT, ()=>console.log('Server running on',PORT));