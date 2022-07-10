const express = require('express')
const mysql = require('mysql')
const BodyParser = require('body-parser')

const app = express()

app.use(BodyParser.urlencoded({ extended: true }))

app.set("view engine", "ejs")
app.set("views", "views")

const db = mysql.createConnection({
    host: "localhost",
    database: "school",
    user: "root",
    password: "",
})

db.connect((err) => {
    if (err) throw err
    console.log("database connected....")

    //Get All Data
    app.get("/", (req, res) => {
        const SQL = "SELECT * FROM users"
        db.query(SQL, (err, result) => {
            const users = JSON.parse(JSON.stringify(result))
            res.render("pages/index", { users: users, title: "Fatz Programming" })
        })
    })

    //Insert Data
    app.post("/tambah", (req, res) => {
        const insertSQL = `INSERT INTO users (nama,kelas) VALUES ('${req.body.nama}', '${req.body.kelas}');`
        db.query(insertSQL, (err, result) => {
            if (err) throw err
            res.redirect("/")
        })
    })

    //Get Data By ID
    app.get('/user/:id', (req, res) => {
        const getByIDSQL = 'SELECT * FROM users WHERE id = ' + req.params.id
        db.query(getByIDSQL, function (err, rows, fields) {
            if (err) throw err
            // if user not found
            if (rows.length <= 0) {
                req.flash('error', 'users not found with id = ' + req.params.id)
                res.redirect('/users')
            }
            else { // if user found
                // render to views/user/edit.ejs template file
                res.render('pages/edit', {
                    title: 'Edit Data',
                    //data: rows[0],
                    id: rows[0].id,
                    nama: rows[0].nama,
                    kelas: rows[0].kelas
                })
            }
        })
    })

    //Update Data
    app.post("/update/:id", (req, res) => {
        const updateSQL = `UPDATE users SET nama='${req.body.nama}', kelas='${req.body.kelas}' WHERE id=` + req.params.id
        db.query(updateSQL, (err, result) => {
            if (err) throw err
            res.redirect("/")
        })
    })

    //Delete Data
    app.get("/delete/:id", (req, res) => {
        const deleteSQL = 'DELETE FROM users WHERE id = ' + req.params.id
        db.query(deleteSQL, (err, result) => {
            if (err) throw err
            res.redirect("/")
        })
    })
})

app.listen(8000, () => {
    console.log("server ready....")
})