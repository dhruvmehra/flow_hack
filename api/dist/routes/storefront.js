"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Storefront Router
 *
 * Router class that defines API REST endpoints used for buying & selling Kitty Items.
 * Endpoints call storefront service with request data.
 *
 */
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const validate_request_1 = require("../middlewares/validate-request");
function initStorefrontRouter(storefrontService) {
    const router = express_1.default.Router();
    router.post("/market/buy", [(0, express_validator_1.body)("account").exists(), (0, express_validator_1.body)("itemID").isInt()], validate_request_1.validateRequest, async (req, res) => {
        const { account, itemID } = req.body;
        const tx = await storefrontService.buy(account, itemID);
        return res.send({
            transactionId: tx,
        });
    });
    router.post("/market/setup", async (req, res) => {
        const tx = await storefrontService.setupAccount();
        return res.send({
            transactionId: tx,
        });
    });
    router.post("/market/sell", [(0, express_validator_1.body)("itemID").isInt(), (0, express_validator_1.body)("price").isDecimal()], validate_request_1.validateRequest, async (req, res) => {
        const { itemID, price } = req.body;
        const tx = await storefrontService.sell(itemID, price);
        return res.send({
            transactionId: tx,
        });
    });
    router.get("/market/collection/:account", async (req, res) => {
        const items = await storefrontService.getItems(req.params.account);
        return res.send({
            items,
        });
    });
    router.get("/market/collection/:account/:item", async (req, res) => {
        const item = await storefrontService.getItem(req.params.account, parseInt(req.params.item));
        return res.send({
            item,
        });
    });
    router.get("/market/latest", async (req, res) => {
        const latestListings = await storefrontService.findMostRecentSales(req.query);
        return res.send(latestListings);
    });
    router.get("/market/:id", async (req, res) => {
        const listing = await storefrontService.findListing(req.params.id);
        return res.send(listing);
    });
    return router;
}
exports.default = initStorefrontRouter;
