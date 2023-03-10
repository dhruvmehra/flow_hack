"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = require("body-parser");
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const path_1 = __importDefault(require("path"));
const kitty_items_1 = __importDefault(require("./routes/kitty-items"));
const storefront_1 = __importDefault(require("./routes/storefront"));
const V1 = "/v1/";
// Init all routes, setup middlewares and dependencies
const initApp = (kittyItemsService, storefrontService) => {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)());
    app.use((0, body_parser_1.json)());
    app.use((0, body_parser_1.urlencoded)({ extended: false }));
    app.use(V1, (0, kitty_items_1.default)(kittyItemsService));
    app.use(V1, (0, storefront_1.default)(storefrontService));
    const serveReactApp = () => {
        app.use(express_1.default.static(path_1.default.resolve(__dirname, "../../web/out")));
        app.get("/profiles/:address", function (req, res) {
            res.sendFile(path_1.default.resolve(__dirname, "../../web/out/profiles/[address]/index.html"));
        });
        app.get("/profiles/:address/kitty-items/:id", function (req, res) {
            res.sendFile(path_1.default.resolve(__dirname, "../../web/out/profiles/[address]/kitty-items/[id]/index.html"));
        });
        app.get("*", function (req, res) {
            res.sendFile(path_1.default.resolve(__dirname, "../../web/out/index.html"));
        });
    };
    if (process.env.IS_HEROKU) {
        // Serve React static site using Express when deployed to Heroku.
        serveReactApp();
    }
    app.all("*", async (req, res) => {
        return res.sendStatus(404);
    });
    return app;
};
exports.default = initApp;
