"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListingHandler = void 0;
/**
 * Listing Event Handler
 *
 * This worker extends Base Event Handler & listens for Listing events from Flow.
 * It will run callback functions to INSERT or DELETE entries from the listing table.
 *
 */
const fcl = __importStar(require("@onflow/fcl"));
const base_event_handler_1 = require("./base-event-handler");
class ListingHandler extends base_event_handler_1.BaseEventHandler {
    constructor(storefrontService, blockCursorService, flowService) {
        super(blockCursorService, flowService, []);
        this.storefrontService = storefrontService;
        this.eventListingAvailable = `A.${fcl.sansPrefix(storefrontService.storefrontAddress)}.NFTStorefrontV2.ListingAvailable`;
        this.eventListingCompleted = `A.${fcl.sansPrefix(storefrontService.storefrontAddress)}.NFTStorefrontV2.ListingCompleted`;
        this.eventNames = [
            this.eventListingAvailable,
            this.eventListingCompleted
        ];
    }
    async onEvent(event) {
        switch (event.type) {
            case this.eventListingAvailable:
                await this.storefrontService.addListing(event);
                break;
            case this.eventListingCompleted:
                await this.storefrontService.removeListing(event);
                break;
            default:
                return;
        }
    }
}
exports.ListingHandler = ListingHandler;
