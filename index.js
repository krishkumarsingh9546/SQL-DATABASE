const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');

const express = require('express');
const app = express();
const path = require("path");

const {v4: uuidv4} = require("uuid");

const methodOverride = require("method-override");
const { log } = require('console');
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended: true}));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));



const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'sql_app',
    password: 'jermey123'
  });

  // let createRandomUser = () => {
  //   return [
  //        faker.string.uuid(),
  //        faker.internet.userName(), 
  //        faker.internet.email(),
  //        faker.internet.password() 
  //   ];
  // }

  let q = "insert into user (id, username, email, password) values ?";
  let data = [];
  
  // for(let i = 1; i <= 100; i++){
  //     data.push(createRandomUser());
  // }
  
  let port = "8080";
  
  app.listen(port, () => {
    console.log(`server is listening to port ${port}`);
  })

  //  home page
  app.get("/", (req, res) => {
    let q = `select count(*) from user`;
    try{
      connection.query(q, (err, result) => {
            if(err) throw err;
            let count = (result[0] ["count(*)"]);
            res.render("home.ejs", {count});    
      })
    } catch (err){
        res.send("some error in DB");
    }
  })

//  show route 

  app.get("/user", (req, res) => {
    let q = `select * from user`;
    try{
      connection.query(q, (err, result) => {
            if(err) throw err;
            // console.log(result);
            res.render("user.ejs", {result});    
      })
    } catch (err){
        res.send("some error in DB");
    }
  
  })

  // edit route 

  app.get("/user/:id/edit", (req, res) => {
      let {id} = req.params;
      let q = `select * from user where id='${id}'`;
      try{
        connection.query(q, (err, result) => {
              if(err) throw err;
              let user = result[0];
              res.render("edit.ejs", {user});   
        })

      } catch (err){
          res.send("some error in DB");
      }
  })


  // change user name using patch method

 app.patch("/user/:id", (req, res) => {
      let {id} = req.params;
      let {password: formPass, username: newUsername} = req.body;
      let q = `select * from user where id='${id}'`;
      try{
        connection.query(q, (err, result) => {
              if(err) throw err;
              let user = result[0];
              // console.log(result);
              if(formPass != user.password){  
                res.send("Wrong password");   
              }else{
               let q2 = `update user set username='${newUsername}' where id='${id}'`;
                connection.query(q2, (err, result) => {
                  if (err) throw err;
                  res.redirect("/user");
                })
              }
        })

      } catch (err){
          res.send("some error in DB");
      }
 })


//  add new user in table 

 app.get("/user/add", (req, res) => {
      res.render("AddNewUser.ejs")
 })


 app.post("/user", (req , res) => {
     let {username, email, password} = req.body;
     id = uuidv4();

     let q = `insert into user (id, username, email, password) values 
     ('${id}', '${username}', '${email}', '${password}')`;

     try{
      connection.query(q, (err, result) => {
            if(err) throw err;
            console.log(result);
            res.redirect("/user");
               
      })

    } catch (err){
        res.send("some error in DB");
    } 
 })


 app.delete("/user/:id", (req, res) => {
  let {id} = req.params;
  let q = `delete from user where id='${id}'`;

  try{
    connection.query(q, (err, result) => {
          if(err) throw err;
          console.log(result);
          res.redirect("/user");
             
    })

  } catch (err){
      res.send("some error in DB");
  }
 })
  