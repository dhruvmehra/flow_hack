"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Listing = void 0;
const base_1 = require("./base");
class Listing extends base_1.BaseModel {
    static get tableName() {
        return "listings";
    }
}
exports.Listing = Listing;
