const express = require("express");
const cors = require("cors");
const connection = require("./config/db");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);
const fs = require("fs");
const { UserScore } = require("./model/userScores");

// Serve static files from the "public" directory
app.use("/", express.static(__dirname + "/public"));
app.use(express.json());
app.use(cors());

const usernames = {};
let pairCount = 0;
let id;
let pgmstart = 0;
let varCounter;
const scores = {};

// Route for serving the main HTML page
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

// Handle WebSocket connections
io.sockets.on("connection", function (socket) {
  // Event handler for adding a client (user)
  socket.on("addClient", function (username) {
    socket.username = username;
    usernames[username] = username;
    scores[socket.username] = 0;
    varCounter = 0;
    pairCount++;

    if (pairCount === 1 || pairCount >= 3) {
      id = Math.round(Math.random() * 1000000);
      socket.room = id;
      pairCount = 1;
      socket.join(id);
      pgmstart = 1;
    } else if (pairCount === 2) {
      socket.join(id);
      pgmstart = 2;

      const players = {};
      let count = 1;

      for (const key in usernames) {
        const newKey = "player" + count;
        players[newKey] = usernames[key];
        count++;
      }

      // Define a route for saving game statistics
      app.post("/save", async (req, res) => {
        try {
          const p1Score = req.body.p1;
          const p2Score = req.body.p2;
          const winStats = req.body.win;
          const stats = await UserScore({
            room: id,
            players,
            player1Score: p1Score,
            player2Score: p2Score,
            winner: winStats,
          });
          await stats.save();
          res.status(200).send({ message: "Stats saved successfully" });
        } catch (error) {
          console.log(error);
          res.status(500).send({ err: "Internal Error" });
        }
      });
    }

    socket.emit(
      "updatechat",
      "SERVER",
      "You are connected! <br> Waiting for the other player to connect...",
      id
    );

    socket.broadcast
      .to(id)
      .emit("updatechat", "SERVER", username + " has joined this game!", id);

    if (pgmstart === 2) {
      fs.readFile(
        __dirname + "/public/static/questions.json",
        "utf-8",
        function (err, data) {
          if (err) {
            console.log("Error reading questions file");
          } else {
            const jsoncontent = JSON.parse(data);
            io.sockets.in(id).emit("sendQuestions", jsoncontent);
          }
        }
      );
      console.log("Player 2");
    } else {
      console.log("Player 1");
    }
  });

  // Event handler for sending the game result
  socket.on("result", function (usr, rst) {
    io.sockets.in(rst).emit("viewresult", usr);
  });

  // Event handler for disconnecting a user
  socket.on("disconnect", function () {
    delete usernames[socket.username];
    io.sockets.emit("updateusers", usernames);
    socket.leave(socket.room);
  });
});

// Route for viewing game stats
app.get("/viewstats", async (req, res) => {
  try {
    const statsData = await UserScore.find({});
    res.status(200).send({ result: statsData });
  } catch (error) {
    console.log("Error while fetching game stats", error);
    res.status(500).send({ err: "Internal Error" });
  }
});

const PORT = process.env.PORT || 8000;
// Start the server
server.listen(PORT, async () => {
  await connection();
  console.log(`Server is running on port ${PORT}`);
});
