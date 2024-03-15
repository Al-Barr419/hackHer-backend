const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const port = 3000;
const app = express();
app.use(cors());
app.use(express.json());
app.get("/greeting", (req,res) => {
    const {first_name, last_name} = req.body;
    res.send(`Hello, ${first_name} ${last_name}!`);
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

