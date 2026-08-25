require("dotenv").config();

const express = require("express");
    const http = require("http");
const db = require("./dbconnection/db");
const { Server } = require("socket.io");

const cors = require("cors");
const { Socket } = require("dgram");

const multer = require("multer");

const upload = multer({
    storage: multer.memoryStorage()
});

let app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});
app.use(cors());           
app.use(express.json());


io.on("connection", (socket) => {

    console.log("user connected to the server");
});
app.post("/userprofile", upload.single("profilePic"), (req, res) => {

    console.log("Text data:", req.body);
    console.log("Image:", req.file);

    const unique_id = Date.now();

    const name = req.body.name;
    const broname = req.body.broname;
    const comment = req.body.comment;

    // Image ka actual binary data
    const profile_pic = req.file ? req.file.buffer : null;

    const sql = `
        INSERT INTO user_profiles
        (unique_id, name, broname, comment, profile_pic)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [unique_id, name, broname, comment, profile_pic],
        (err, result) => {

            if (err) {
                console.log("MySQL error:", err);

                return res.status(500).json({
                    message: "Data save nahi hua",
                    error: err.message
                });
            }

            res.json({
                message: "Data MySQL mein save ho gaya",
                unique_id: unique_id
            });
        }
    );
});
app.get("/getdata", (req, res) => {

    const offset = Number(req.query.offset) || 0;

    const sql = `
        SELECT 
            unique_id,
            name,
            broname,
            comment,
            profile_pic
        FROM user_profiles
        ORDER BY id DESC
        LIMIT 5 OFFSET ${offset}
    `;

    db.query(sql, (err, result) => {

        if (err) {
            console.log("MySQL error:", err);

            return res.status(500).json({
                message: "Data nahi mila",
                error: err.message
            });
        }

        const users = result.map(user => {

            return {
                unique_id: user.unique_id,
                name: user.name,
                broname: user.broname,
                comment: user.comment,

                profile_pic: user.profile_pic
                    ? user.profile_pic.toString("base64")
                    : null
            };

        });

        res.json(users);
    });
});

app.post("/comment", (req, res) => {

    console.log("BODY:", req.body);

    const { postid, comment } = req.body;

    console.log("POST ID:", postid);
    console.log("COMMENT:", comment);

    const sql = `
        INSERT INTO comment (postid, comment)
        VALUES (?, ?)
    `;

    db.query(sql, [postid, comment], (err, result) => {

        if (err) {
            console.log("MySQL error:", err);

            return res.status(500).json({
                success: false,
                message: "Comment save nahi hua",
                error: err.message
            });
        }

        console.log("Comment database mein save ho gaya");

        res.json({
            success: true,
            message: "Comment save ho gaya"
        });
    });
});






app.post("/allcomment", (req, res) => {

    console.log("ALL COMMENT BODY:", req.body);

    const { postid } = req.body;

    const sql = `
        SELECT comment
        FROM comment
        WHERE postid = ?
        ORDER BY id DESC
    `;

    db.query(sql, [postid], (err, result) => {

        if (err) {
            console.log("MySQL error:", err);

            return res.status(500).json({
                success: false,
                message: "Comments nahi mile",
                error: err.message
            });
        }

        console.log("Comments:", result);

        res.json(result);
    });
});
const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
