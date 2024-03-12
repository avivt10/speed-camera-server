const express = require('express');
const connect = require('./mongoConnection');
require('dotenv').config();
var cors = require("cors");
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());


connect()


app.use('/', require('./routes'));

app.listen(PORT ,() => {
    console.log(`Port is listing ${PORT}...`)
})
