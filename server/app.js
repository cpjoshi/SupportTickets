const express = require("express");
const cookieParser = require('cookie-parser')
const tokenValidator = require("./tokenValidator");  

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cookieParser());
app.listen(PORT, () => console.log("Server started at port: " + PORT));

const items = [
    {
        id: 1,
        description: "Faulty flywheel",
        priority: 3,
        status: "Open"
    },
    {
        id: 2,
        description: "Missing door handle",
        priority: 1,
        status: "Assigned"
    }
];

app.get("/api/issues", async (req, res) => {
    console.log(req.cookies);
    try {
        var tokenValid = await tokenValidator.validateToken(req.headers.authorization.split(" ")[1]);        
        console.log(tokenValid);
        res.cookie("mycookie", "joshi");
        res.send(items);    
    } catch (error) {
        res.status(401).send(error.message);
    }
})

app.use(express.static('build'));