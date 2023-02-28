"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Kitty Items Router
 *
 * Router class that defines API REST endpoints used for minting and moving Kitty Items.
 * Endpoints call kitty-items service with request data.
 *
 */
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const validate_request_1 = require("../middlewares/validate-request");
function initKittyItemsRouter(kittyItemsService) {
    const router = express_1.default.Router();
    router.post("/kitty-items/mint", [(0, express_validator_1.body)("recipient").exists()], validate_request_1.validateRequest, async (req, res) => {
        const { recipient } = req.body;
        const tx = await kittyItemsService.mint(recipient);
        return res.send({
            transaction: tx,
        });
    });
    router.post("/kitty-items/mint-and-list", [(0, express_validator_1.body)("recipient").exists()], validate_request_1.validateRequest, async (req, res) => {
        const { recipient } = req.body;
        const tx = await kittyItemsService.mintAndList(recipient);
        return res.send({
            transaction: tx,
        });
    });
    router.post("/kitty-items/setup", async (req, res) => {
        const transaction = await kittyItemsService.setupAccount();
        return res.send({
            transaction,
        });
    });
    router.post("/kitty-items/transfer", [(0, express_validator_1.body)("recipient").exists(), (0, express_validator_1.body)("itemID").isInt()], validate_request_1.validateRequest, async (req, res) => {
        const { recipient, itemID } = req.body;
        const tx = await kittyItemsService.transfer(recipient, itemID);
        return res.send({
            transaction: tx,
        });
    });
    router.get("/kitty-items/collection/:account", async (req, res) => {
        const collection = await kittyItemsService.getCollectionIds(req.params.account);
        return res.send({
            collection,
        });
    });
    router.get("/kitty-items/item/:address/:itemID", async (req, res) => {
        const item = await kittyItemsService.getKittyItem(req.params.itemID, req.params.address);
        return res.send({
            item,
        });
    });
    router.get("/kitty-items/supply", async (req, res) => {
        const supply = await kittyItemsService.getSupply();
        return res.send({
            supply,
        });
    });
    return router;
}
exports.default = initKittyItemsRouter;
