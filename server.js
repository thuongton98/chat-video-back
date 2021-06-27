const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const socket = require("socket.io");



require('dotenv').config();

const app = express();


const port=process.env.PORT || 5000;

var bodyParser = require('body-parser')

app.use(cors());
app.use(bodyParser.json());

// DB Config
const db = require('./config/key').mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));



  const messRouter = require('./routes/mess');

  app.use('/mess',messRouter);
  const roomRouter = require('./routes/room');

  app.use('/room',roomRouter);


  const  server = app.listen(port,()=>{
    console.log(`Server is running on port: ${port}`);
});


const io = socket(server);





// xem bao nhieu nguoi online 
var users=[]
const addUser = ({ id,name,token}) => {
  


  const user = { id,name}
  users.push(user);


}


let MessDb = require('./models/mess-model')
let RoomDb = require('./models/room-model')



io.on("connection", function (socket) {


  /////
  socket.on('join-room', (data) => {
    
    socket.join(data.ROOM_ID)
   
    socket.broadcast.emit('user-connected', data.id)

    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', data.id)
    })
})
    /////

  
    socket.on('user', data => {
        MessDb.find()
        .then(mess => io.emit('allmess',mess))
        
  //add vap user
    const user = addUser({id:socket.id,name:data.username})
    io.emit('getuser',users)
   
    
     });

   
     socket.on('mess', data => {
      
       
        MessDb.find()
        .then(mess => {
          
            const newMess = new MessDb({
                name:data.username,
                mess:data.mess,
                room_id:data.room_id,
               
                
            });
            newMess.save()

            mess.push(newMess)
            io.emit('allmess',mess)
        }
            
            )
          
    
           });
          
           socket.on('room', data => {
             
            RoomDb.find()
              .then(room =>{
                const find = room.filter(function(value){
                  return (value.room_id[0]===data[0]||value.room_id[0]===data[1])&&(value.room_id[1]===data[0]||value.room_id[1]===data[1])
                })
                if(find.length<1){
                  const newRoom = new RoomDb({
                    
                    room_id:data
                    
                });
                newRoom.save()
                }
              });
              MessDb.find()
              .then(mess =>{
                
               socket.emit('allmess',mess)
              
              })
           socket.emit('join_room',data)
           
           
         });
     socket.on('disconnect',data=>{
        if(users.length>0){
          for(let i=0;i<users.length;i++){
            if(users[i].id===socket.id){
              users.splice(i,1)
              io.emit('getuser',users)
            }
          }
       
        }
        
       })
       socket.on('out',data=>{
       if(users.length>0){
        for(let i=0;i<users.length;i++){
         for(let j=0;j<data.length;j++){
           if(users[i].id === data[j].id){
              users.splice(i,1)
              io.emit('getuser',users)
           }
         }
        }
     
      }
       })
    })



