console.log("Hare Krishna...");

const express = require("express");
const dotenv = require("dotenv").config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const apiRoutes = require('./routes/apiRoutes');
const errorHandler = require("./middleware/errorHandler");

const app = express();

const port = (process.env.ENV == "DEV") ? 5000 : process.env.PORT;

app.use(cookieParser());
app.use(
    cors({
      origin: (process.env.ENV == "DEV") ? "http://localhost:4200" : process.env.FRONTEND_URL,
      credentials: true,
    })
  );
app.use(express.json());
app.use('/api',apiRoutes);
app.use(errorHandler);

app.get('/', (req, res) => {
    res.send("Yepp!! It's working..");
})

// app.get('/api', (req, res) => {
//     res.status(200).json({message : "API is being called!!"});
// })

app.listen(port, () => {
    console.log(`Server running at port ${port}`);
})