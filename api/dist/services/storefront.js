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
exports.StorefrontService = void 0;
/**
 * Storefront Service
 *
 * Service class used to execute scripts & transactions on the Flow blockchain to buy & sell Kitty Items.
 * Also contains queries to interact with listings table to show Store/Marketplace listings on site.
 *
 */
const fcl = __importStar(require("@onflow/fcl"));
const t = __importStar(require("@onflow/types"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const listing_1 = require("../models/listing");
const fungibleTokenPath = '"../../contracts/FungibleToken.cdc"';
const nonFungibleTokenPath = '"../../contracts/NonFungibleToken.cdc"';
const metadataViewsPath = '"../../contracts/MetadataViews.cdc"';
const flowTokenPath = '"../../contracts/FlowToken.cdc"';
const kittyItemsPath = '"../../contracts/KittyItems.cdc"';
const storefrontPath = '"../../contracts/NFTStorefrontV2.cdc"';
const PER_PAGE = 12;
class StorefrontService {
    constructor(flowService, fungibleTokenAddress, flowTokenAddress, nonFungibleTokenAddress, metadataViewsAddress, storefrontAddress, minterAddress) {
        this.flowService = flowService;
        this.fungibleTokenAddress = fungibleTokenAddress;
        this.flowTokenAddress = flowTokenAddress;
        this.nonFungibleTokenAddress = nonFungibleTokenAddress;
        this.metadataViewsAddress = metadataViewsAddress;
        this.storefrontAddress = storefrontAddress;
        this.minterAddress = minterAddress;
        this.setupAccount = () => {
            const authorization = this.flowService.authorizeMinter();
            const transaction = fs
                .readFileSync(path.join(__dirname, `../../../cadence/transactions/nftStorefront/setup_account.cdc`), "utf8")
                .replace(storefrontPath, fcl.withPrefix(this.storefrontAddress));
            return this.flowService.sendTx({
                transaction,
                args: [],
                authorizations: [authorization],
                payer: authorization,
                proposer: authorization,
            });
        };
        this.getItem = (account, itemID) => {
            const script = fs
                .readFileSync(path.join(__dirname, `../../../cadence/scripts/nftStorefront/get_listing.cdc`), "utf8")
                .replace(storefrontPath, fcl.withPrefix(this.storefrontAddress));
            return this.flowService.executeScript({
                script,
                args: [fcl.arg(account, t.Address), fcl.arg(itemID, t.UInt64)],
            });
        };
        this.getItems = (account) => {
            const script = fs
                .readFileSync(path.join(__dirname, `../../../cadence/scripts/nftStorefront/get_listings.cdc`), "utf8")
                .replace(storefrontPath, fcl.withPrefix(this.storefrontAddress));
            return this.flowService.executeScript({
                script,
                args: [fcl.arg(account, t.Address)],
            });
        };
        this.buy = (account, itemID) => {
            const authorization = this.flowService.authorizeMinter();
            const transaction = fs
                .readFileSync(path.join(__dirname, `../../../cadence/transactions/nftStorefront/purchase_listing.cdc`), "utf8")
                .replace(fungibleTokenPath, fcl.withPrefix(this.fungibleTokenAddress))
                .replace(nonFungibleTokenPath, fcl.withPrefix(this.nonFungibleTokenAddress))
                .replace(flowTokenPath, fcl.withPrefix(this.flowTokenAddress))
                .replace(kittyItemsPath, fcl.withPrefix(this.minterAddress))
                .replace(storefrontPath, fcl.withPrefix(this.storefrontAddress));
            return this.flowService.sendTx({
                transaction,
                args: [fcl.arg(itemID, t.UInt64), fcl.arg(account, t.Address)],
                authorizations: [authorization],
                payer: authorization,
                proposer: authorization,
            });
        };
        this.sell = (itemID, price) => {
            const authorization = this.flowService.authorizeMinter();
            const transaction = fs
                .readFileSync(path.join(__dirname, `../../../cadence/transactions/nftStorefront/create_listing.cdc`), "utf8")
                .replace(fungibleTokenPath, fcl.withPrefix(this.fungibleTokenAddress))
                .replace(nonFungibleTokenPath, fcl.withPrefix(this.nonFungibleTokenAddress))
                .replace(flowTokenPath, fcl.withPrefix(this.flowTokenAddress))
                .replace(kittyItemsPath, fcl.withPrefix(this.minterAddress))
                .replace(storefrontPath, fcl.withPrefix(this.storefrontAddress));
            return this.flowService.sendTx({
                transaction,
                args: [
                    fcl.arg(itemID, t.UInt64),
                    fcl.arg(price.toFixed(8).toString(), t.UFix64),
                ],
                authorizations: [authorization],
                payer: authorization,
                proposer: authorization,
                skipSeal: true,
            });
        };
        this.getListingItem = async (account, listingResourceID) => {
            const script = fs
                .readFileSync(path.join(__dirname, "../../../cadence/scripts/nftStorefront/get_listing_item.cdc"), "utf8")
                .replace(nonFungibleTokenPath, fcl.withPrefix(this.nonFungibleTokenAddress))
                .replace(metadataViewsPath, fcl.withPrefix(this.metadataViewsAddress))
                .replace(kittyItemsPath, fcl.withPrefix(this.minterAddress))
                .replace(storefrontPath, fcl.withPrefix(this.storefrontAddress));
            return this.flowService.executeScript({
                script,
                args: [fcl.arg(account, t.Address), fcl.arg(listingResourceID, t.UInt64)],
            });
        };
        this.addListing = async (listingEvent) => {
            const owner = listingEvent.data.storefrontAddress;
            const listingResourceID = listingEvent.data.listingResourceID;
            const item = await this.getListingItem(owner, listingResourceID);
            return listing_1.Listing.transaction(async (tx) => {
                return await listing_1.Listing.query(tx)
                    .insert({
                    listing_resource_id: listingResourceID,
                    item_id: item.itemID,
                    item_kind: item.kind,
                    item_rarity: item.rarity,
                    name: item.name,
                    image: item.image,
                    owner: owner,
                    price: item.price,
                    transaction_id: listingEvent.transactionId,
                })
                    .returning("transaction_id")
                    .onConflict("listing_resource_id")
                    .ignore()
                    .catch(e => {
                    console.log(e);
                });
            });
        };
        this.removeListing = async (listingEvent) => {
            const listingResourceID = listingEvent.data.listingResourceID;
            return listing_1.Listing.transaction(async (tx) => {
                return await listing_1.Listing.query(tx)
                    .where({
                    listing_resource_id: listingResourceID,
                })
                    .del();
            });
        };
        this.findListing = itemID => {
            return listing_1.Listing.transaction(async (tx) => {
                return await listing_1.Listing.query(tx)
                    .select("*")
                    .where("item_id", itemID)
                    .limit(1);
            });
        };
        this.findMostRecentSales = params => {
            return listing_1.Listing.transaction(async (tx) => {
                const query = listing_1.Listing.query(tx).select("*").orderBy("updated_at", "desc");
                if (params.owner) {
                    query.where("owner", params.owner);
                }
                if (params.kind) {
                    query.where("item_kind", params.kind);
                }
                if (params.rarity) {
                    query.where("item_rarity", Number(params.rarity));
                }
                if (params.minPrice) {
                    query.where("price", ">=", parseFloat(params.minPrice));
                }
                if (params.maxPrice) {
                    query.where("price", "<=", parseFloat(params.maxPrice));
                }
                if (params.marketplace) {
                    query.where("owner", "!=", this.minterAddress);
                }
                if (params.page) {
                    query.page(Number(params.page) - 1, PER_PAGE);
                }
                return await query;
            });
        };
    }
}
exports.StorefrontService = StorefrontService;
