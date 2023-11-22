const express = require("express");
const cookieParser = require('cookie-parser')
const bodyParser = require("body-parser");
const tokenValidator = require("./tokenValidator");
const blobOperations = require("./blobStoreOperations");

const app = express();

const PORT = process.env.PORT || 8080;

app.use(cookieParser());
app.use(bodyParser.json());
app.listen(PORT, () => console.log("Server started at port: " + PORT));

app.get("/api/issues", async (req, res) => {
    console.log(req.cookies);
    try {
        //var tokenValid = await tokenValidator.validateToken(req.headers.authorization.split(" ")[1]);        
        //console.log(tokenValid);
        //res.cookie("mycookie", "joshi");
        let items = await blobOperations.getIssues();
        res.send(items);
    } catch (error) {
        res.status(401).send(error.message);
    }
})

app.post("/api/issues", async (req, res) => {
    console.log(req.body);
    try {
        let issue = req.body;
        issue.createDate = new Date().valueOf();
        let createdIssue = await blobOperations.createIssue(issue);
        res.send(createdIssue);            
    } catch (error) {
        res.status(500).send(error.message);
    }
})

app.delete("/api/issues/:uid", async (req, res) => {
    try {
        await blobOperations.deleteIssue(req.params.uid);
        res.send("Issue deleted successfully");
    } catch (error) {
        res.status(500).send(error.message);
    }
})

app.get("/api/issues/:uid", async (req, res) => {
    try {
        let issue = await blobOperations.getIssue(req.params.uid);
        res.send(issue);
    } catch (error) {
        res.status(404).send(error.message);
    }
})

app.use(express.static('build'));