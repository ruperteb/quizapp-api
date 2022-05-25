require("dotenv").config();
const express = require("express");
/* var cors = require("cors"); */
const app = express();
const keycloak = require("./config/keycloak-config.js").initKeycloak();

app.use(keycloak.middleware());

/* app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000/"],
  })
); */

/* app.use(cors()); */

app.use((req, res, next) => {
  //doesn't send response just adjusts it
  res.header("Access-Control-Allow-Origin", "*"); //* to give access to any origin
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization" //to give access to all the headers provided
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET"); //to give access to all the methods provided
    return res.status(200).json({});
  }
  next(); //so that other routes can take over
});

const users = require("./routes/users");
const quizzes = require("./routes/quizzes");
const questions = require("./routes/questions");

app.use("/users/", users);
app.use("/quizzes/", quizzes);
app.use("/questions/", questions);

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
