const mongoose = require('mongoose');
const connectDatabase =( )=>{
    mongoose.connect(process.env.DB_URI , {useNewUrlParser:true}).then((data)=>{
    
        console.log(`Mongodb connected with server ${data.connection.host}:${data.connection.port}`);
    })
}
module.exports = connectDatabase;