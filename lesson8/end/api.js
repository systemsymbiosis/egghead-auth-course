const express = require("express");
const bodyParser = require("body-parser");
const expressjwt = require("express-jwt");
const cors = require("cors");
const path = require('path');
const router = express.Router();
const jwksRsa = require('jwks-rsa');
var public = path.join(__dirname, 'public');

const app = express();

const PORT = process.env.API_PORT || 8888;

//add the router
app.use('/', router);
app.use(bodyParser.json());
app.use(cors());
app.use('/', express.static(public));


const secret = jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://effective-computing.auth0.com/.well-known/jwks.json',
})

const jwtCheck = expressjwt({
    secret: secret,
    audience: 'https://effective-computing.auth0.com/api/v2/',
    issuer: 'https://effective-computing.auth0.com/',
    algorithms: ['RS256'],
})

app.get("/resource", (req, res) => {
    res
        .status(200)
        .send("Public resource, you can see this");
});

app.get("/resource/secret", jwtCheck, (req, res) => {
    res
        .status(200)
        .send("Secret resource, you should be logged in to see this");
});

// viewed at http://localhost:8080
app.get('/', function (req, res) {
    res.sendFile(path.join(public, 'index.html'));
});

app.get("*", (req, res) => {
    res.sendStatus(404);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});