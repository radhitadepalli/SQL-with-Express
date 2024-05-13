const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require("express");
const app = express();

const path = require("path");

const methodOverRide = require("method-override");
app.use(methodOverRide("_method"));
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'delta_app',
    password: 'Radhi@13',
});

let getRandomUser = () => {
    return [
        faker.string.uuid(),
        faker.internet.userName(),
        faker.internet.email(),
        faker.internet.password(),
    ];
};


// let q = "INSERT INTO user(id,username,email,password) VALUES ?";


// let data=[];
// for(let i=1;i<=100;i++){
//     data.push(getRandomUser());//100 fake users
// }




app.get("/", (req, res) => {
    let q = `select count(*) FROM user`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            let count = result[0]["count(*)"];
            res.render("home.ejs", { count });
        })
    } catch (err) {
        console.log(err);
        res.send("some error in database");
    }
});

app.get("/user", (req, res) => {
    let q = `select * from user`;
    try {
        connection.query(q, (err, users) => {
            if (err) throw err;
            // console.log(result);
            // res.send(result);
            res.render("showusers.ejs", { users });
        })
    } catch (err) {
        console.log(err);
        res.send("some error in database");
    }
})

app.get("/user/:id/edit", (req, res) => {
    let { id } = req.params;
    let q = `select * from user where id='${id}'`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            // res.send(result);
            let user = result[0];
            console.log(user);
            res.render("edit.ejs", { user });
        })
    } catch (err) {
        console.log(err);
        res.send("some error in database");
    }
});


app.patch("/user/:id", (req, res) => {
    let { id } = req.params;
    // res.send(req.body);
    // let { password: formpass, username: newUsername } = req.body;
    let newUsername = req.body.username;
    let formpass = req.body.password;
    //res.send(formpass);
    let q = `select * from user where id='${id}'`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            let user = result[0];
            console.log(user.password);
            console.log(typeof user.password);
            console.log(formpass);
            console.log(typeof formpass);
            if (formpass === user.password) {
                let q2 = `UPDATE user set username='${newUsername}' where id='${id}'`;
                connection.query(q2, (err, result) => {
                    if (err) throw err;
                    res.redirect("/user");
                });

            } else {
                res.send("wrong password");
            }
        })
    } catch (err) {
        console.log(err);
        res.send("some error in database");
    }
});



app.get("/user/:id/delete", (req, res) => {
    let { id } = req.params;
    let q = `select * from user where id='${id}'`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            let user = result[0];
            res.render("deletepage.ejs", { user });
        })
    } catch (err) {
        console.log(err);
        res.send("some error in database");
    }
});

app.delete("/user/:id", (req, res) => {
    // res.send("working");
    let { id } = req.params;
    let formPass = req.body.password;

    let p = `select * from user where id='${id}'`;
    try {
        connection.query(p, (err, result) => {
            if (err) throw err;
            let user = result[0];
            if (formPass === result[0].password) {
                let q = `DELETE FROM user WHERE id = '${id}';`;
                try {
                    connection.query(q, (err, result) => {
                        if (err) throw err;
                        res.redirect("/user");
                    })
                } catch (err) {
                    console.log(err);
                    res.send("some error in database");
                }
            }else{
                res.send("Entered wrong password");
            }
        });
    } catch (err) {
        console.log(err);
        res.send("some error in database");
    }
});

app.get("/user/add",(req,res)=>{
    // res.send("app working");
    res.render("adduser.ejs");
});


app.post("/user/add",(req,res)=>{
    // res.send("working");
    // console.log(req.body);
    // res.send(req.body);
    let q=`insert into user (id, username, email, password) VALUES ( ${req.body.id},'${req.body.username}','${req.body.email}','${req.body.password}');`
    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            res.redirect("/user");
        });
    }catch(err){
        console.log(err);
        res.send("some error in database");
    };
});

app.listen("8080", () => {
    console.log("server is listening to port 8080");
});

