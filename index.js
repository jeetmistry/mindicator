const dotenv = require('dotenv');

dotenv.config({
    path: './.env'
});
const express = require("express");
const path = require("path");
const mysql = require("mysql");
const app = express();



const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
});
const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());




db.connect((error) => {
    if (error) {
        console.log(error);
    } else {
        console.log("MYSQL CONNECTED SUCCESSFULLY!!")
    }

});

app.post("/app/user",(req,res)=>{
    const data = req.body;
    const username = data.username;
    const password = data.password;

    db.query("INSERT INTO users SET ?",{
        username:username,
        password:password
    },
    (error,result)=>{
        if(error){
            console.log(error);
            const response = {
                "status": "Cannot Register",
                "status_code": 401
                }
            res.send(response);
        }else{
            const response =  {
                "status": 'Account Successfully created',
                "status_code": 200
                }
                res.send(response);
        }
    }
    )
})

app.post("/app/user/login",(req,res)=>{
    const data = {...req.body};

    db.query("Select username, password from users where username = ?",[data.username],(error,result)=>{
        if(error){
            const response = {
                "status": "Cannot Login",
                "status_code": 401
                }
                res.send(response);
        }else{
            console.log(result);
            if(result[0].password===data.password){
                const response =  {
                    "status": 'Success',
                    "username":data.username,
                    "status_code": 200
                    }
                    res.send(response);
            }else{
                const response = {
                    "status": "Incorrect username/password provided. Please retry",
                    "status_code": 401
                    }
                    res.send(response);
            }
        }
    })
})



app.listen(8002, () => {
    console.log("Server started on port 8002");
})