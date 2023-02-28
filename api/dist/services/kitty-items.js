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
exports.KittyItemsService = void 0;
const fcl = __importStar(require("@onflow/fcl"));
const t = __importStar(require("@onflow/types"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const nonFungibleTokenPath = '"../../contracts/NonFungibleToken.cdc"';
const metadataViewsPath = '"../../contracts/MetadataViews.cdc"';
const kittyItemsPath = '"../../contracts/KittyItems.cdc"';
const fungibleTokenPath = '"../../contracts/FungibleToken.cdc"';
const flowTokenPath = '"../../contracts/FlowToken.cdc"';
const storefrontPath = '"../../contracts/NFTStorefrontV2.cdc"';
var Kind;
(function (Kind) {
    Kind[Kind["Fishbowl"] = 0] = "Fishbowl";
    Kind[Kind["Fishhat"] = 1] = "Fishhat";
    Kind[Kind["Milkshake"] = 2] = "Milkshake";
    Kind[Kind["TukTuk"] = 3] = "TukTuk";
    Kind[Kind["Skateboard"] = 4] = "Skateboard";
})(Kind || (Kind = {}));
var Rarity;
(function (Rarity) {
    Rarity[Rarity["Blue"] = 0] = "Blue";
    Rarity[Rarity["Green"] = 1] = "Green";
    Rarity[Rarity["Purple"] = 2] = "Purple";
    Rarity[Rarity["Gold"] = 3] = "Gold";
})(Rarity || (Rarity = {}));
const randomKind = () => {
    const values = Object.keys(Kind)
        .map(n => Number.parseInt(n))
        .filter(n => !Number.isNaN(n));
    const index = Math.floor(Math.random() * values.length);
    return values[index].toString();
};
const ITEM_RARITY_PROBABILITIES = {
    [Rarity.Gold]: "10",
    [Rarity.Purple]: "20",
    [Rarity.Green]: "30",
    [Rarity.Blue]: "40",
};
const randomRarity = () => {
    const rarities = Object.keys(ITEM_RARITY_PROBABILITIES);
    const rarityProbabilities = rarities.flatMap(rarity => Array(ITEM_RARITY_PROBABILITIES[rarity]).fill(rarity));
    const index = Math.floor(Math.random() * rarityProbabilities.length);
    return rarityProbabilities[index];
};
class KittyItemsService {
    constructor(flowService, nonFungibleTokenAddress, metadataViewsAddress, kittyItemsAddress, fungibleTokenAddress, flowTokenAddress, storefrontAddress) {
        this.flowService = flowService;
        this.nonFungibleTokenAddress = nonFungibleTokenAddress;
        this.metadataViewsAddress = metadataViewsAddress;
        this.kittyItemsAddress = kittyItemsAddress;
        this.fungibleTokenAddress = fungibleTokenAddress;
        this.flowTokenAddress = flowTokenAddress;
        this.storefrontAddress = storefrontAddress;
        this.setupAccount = async () => {
            const authorization = this.flowService.authorizeMinter();
            const transaction = fs
                .readFileSync(path.join(__dirname, `../../../cadence/transactions/kittyItems/setup_account.cdc`), "utf8")
                .replace(nonFungibleTokenPath, fcl.withPrefix(this.nonFungibleTokenAddress))
                .replace(kittyItemsPath, fcl.withPrefix(this.kittyItemsAddress));
            return this.flowService.sendTx({
                transaction,
                args: [],
                authorizations: [authorization],
                payer: authorization,
                proposer: authorization,
            });
        };
        this.mint = async (recipient) => {
            const authorization = this.flowService.authorizeMinter();
            const kind = randomKind();
            const rarity = randomRarity();
            const transaction = fs
                .readFileSync(path.join(__dirname, `../../../cadence/transactions/kittyItems/mint_kitty_item.cdc`), "utf8")
                .replace(nonFungibleTokenPath, fcl.withPrefix(this.nonFungibleTokenAddress))
                .replace(kittyItemsPath, fcl.withPrefix(this.kittyItemsAddress));
            return this.flowService.sendTx({
                transaction,
                args: [
                    fcl.arg(recipient, t.Address),
                    fcl.arg(kind, t.UInt8),
                    fcl.arg(rarity, t.UInt8),
                ],
                authorizations: [authorization],
                payer: authorization,
                proposer: authorization,
                skipSeal: true,
            });
        };
        this.mintAndList = async (recipient) => {
            const authorization = this.flowService.authorizeMinter();
            const kind = randomKind();
            const rarity = randomRarity();
            const transaction = fs
                .readFileSync(path.join(__dirname, `../../../cadence/transactions/kittyItems/mint_and_list_kitty_item.cdc`), "utf8")
                .replace(nonFungibleTokenPath, fcl.withPrefix(this.nonFungibleTokenAddress))
                .replace(kittyItemsPath, fcl.withPrefix(this.kittyItemsAddress))
                .replace(fungibleTokenPath, fcl.withPrefix(this.fungibleTokenAddress))
                .replace(flowTokenPath, fcl.withPrefix(this.flowTokenAddress))
                .replace(storefrontPath, fcl.withPrefix(this.storefrontAddress));
            return this.flowService.sendTx({
                transaction,
                args: [
                    fcl.arg(recipient, t.Address),
                    fcl.arg(kind, t.UInt8),
                    fcl.arg(rarity, t.UInt8),
                ],
                authorizations: [authorization],
                payer: authorization,
                proposer: authorization,
                skipSeal: true,
            });
        };
        this.transfer = async (recipient, itemID) => {
            const authorization = this.flowService.authorizeMinter();
            const transaction = fs
                .readFileSync(path.join(__dirname, `../../../cadence/transactions/kittyItems/transfer_kitty_item.cdc`), "utf8")
                .replace(nonFungibleTokenPath, fcl.withPrefix(this.nonFungibleTokenAddress))
                .replace(kittyItemsPath, fcl.withPrefix(this.kittyItemsAddress));
            return this.flowService.sendTx({
                transaction,
                args: [fcl.arg(recipient, t.Address), fcl.arg(itemID, t.UInt64)],
                authorizations: [authorization],
                payer: authorization,
                proposer: authorization,
            });
        };
        this.getCollectionIds = async (account) => {
            const script = fs
                .readFileSync(path.join(__dirname, `../../../cadence/scripts/kittyItems/get_collection_ids.cdc`), "utf8")
                .replace(nonFungibleTokenPath, fcl.withPrefix(this.nonFungibleTokenAddress))
                .replace(kittyItemsPath, fcl.withPrefix(this.kittyItemsAddress));
            return this.flowService.executeScript({
                script,
                args: [fcl.arg(account, t.Address)],
            });
        };
        this.getKittyItem = async (itemID, address) => {
            const script = fs
                .readFileSync(path.join(__dirname, `../../../cadence/scripts/kittyItems/get_kitty_item.cdc`), "utf8")
                .replace(nonFungibleTokenPath, fcl.withPrefix(this.nonFungibleTokenAddress))
                .replace(metadataViewsPath, fcl.withPrefix(this.metadataViewsAddress))
                .replace(kittyItemsPath, fcl.withPrefix(this.kittyItemsAddress));
            return this.flowService.executeScript({
                script,
                args: [fcl.arg(address, t.Address), fcl.arg(itemID, t.UInt64)],
            });
        };
        this.getSupply = async () => {
            const script = fs
                .readFileSync(path.join(__dirname, `../../../cadence/scripts/kittyItems/get_kitty_items_supply.cdc`), "utf8")
                .replace(kittyItemsPath, fcl.withPrefix(this.kittyItemsAddress));
            return this.flowService.executeScript({ script, args: [] });
        };
    }
}
exports.KittyItemsService = KittyItemsService;
