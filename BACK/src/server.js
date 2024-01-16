const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const router = require("./routes");
const { sequelize } = require("./DB_connection");
require('dotenv').config();
const mercadopago = require("mercadopago");

const server = express();
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cors());
server.use(morgan("dev"));
server.use((req, res, next) => {
    console.log(req);
    next();
});

mercadopago.configure({
    access_token: "...",
});

server.post("/create_preference", (req, res) => {
    let preference = {
        items: [
            {
                title: req.body.description,
                unit_price: Number(req.body.price),
                quantity: Number(req.body.quantity),
            },
        ],
        back_urls: {
            success: "http://localhost:5173",
            failure: "http://localhost:5173",
            pending: "",
        },
        auto_return: "approved",
    };

    mercadopago.preferences
        .create(preference)
        .then(function (response) {
            res.json({
                id: response.body.id,
            });
        })
        .catch(function (error) {
            console.log(error);
        });
});

server.use(router); // Utiliza el enrutador principal
server.use(express.static('src'));

module.exports = server;
