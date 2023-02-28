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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fcl = __importStar(require("@onflow/fcl"));
const helpers_1 = require("yargs/helpers");
const yargs_1 = __importDefault(require("yargs/yargs"));
const app_1 = __importDefault(require("./app"));
const config_1 = require("./config");
const db_1 = __importDefault(require("./db"));
const block_cursor_1 = require("./services/block-cursor");
const flow_1 = require("./services/flow");
const kitty_items_1 = require("./services/kitty-items");
const storefront_1 = require("./services/storefront");
const listing_handler_1 = require("./workers/listing-handler");
const argv = (0, yargs_1.default)((0, helpers_1.hideBin)(process.argv)).argv;
const DEV = argv.dev;
let envVars;
if (DEV) {
    const env = require("dotenv");
    const expandEnv = require("dotenv-expand");
    const config = env.config({
        path: ".env.local",
    });
    expandEnv(config);
    envVars = config.parsed;
}
async function run() {
    const config = (0, config_1.getConfig)(envVars);
    const db = (0, db_1.default)(config);
    // Make sure to disconnect from DB when exiting the process
    process.on("SIGTERM", () => {
        db.destroy().then(() => {
            process.exit(0);
        });
    });
    // Run all database migrations
    await db.migrate.latest();
    const flowService = new flow_1.FlowService(config.minterAddress, config.minterPrivateKeyHex, config.minterAccountKeyIndex);
    const storefrontService = new storefront_1.StorefrontService(flowService, config.fungibleTokenAddress, config.flowTokenAddress, config.nonFungibleTokenAddress, config.metadataViewsAddress, config.storefrontAddress, config.minterAddress);
    // Make sure we're pointing to the correct Flow Access API.
    fcl
        .config()
        .put("accessNode.api", config.accessApi)
        .put("decoder.Type", val => val.staticType)
        .put("decoder.Enum", val => Number(val.fields[0].value.value));
    const startWorker = () => {
        console.log("Starting Flow event worker ....");
        const blockCursorService = new block_cursor_1.BlockCursorService();
        const listingWorker = new listing_handler_1.ListingHandler(storefrontService, blockCursorService, flowService);
        listingWorker.run();
    };
    const startAPIServer = () => {
        console.log("Starting API server ....");
        const kittyItemsService = new kitty_items_1.KittyItemsService(flowService, config.nonFungibleTokenAddress, config.metadataViewsAddress, config.minterAddress, config.fungibleTokenAddress, config.flowTokenAddress, config.storefrontAddress);
        const app = (0, app_1.default)(kittyItemsService, storefrontService);
        app.listen(config.port, () => {
            console.log(`Listening on port ${config.port}!`);
        });
    };
    if (DEV) {
        // Run everything in one process.
        startWorker();
        startAPIServer();
    }
    else if (argv.worker) {
        // We do this so that the worker can be started in seperate process
        // for horizontal scaling in production deployments, using flag a eg:
        // $> node /api/dist/index.js (starts API server)
        // $> node /api/dist/index.js --worker (starts worker)
        startWorker();
    }
    else {
        // Accommodates the commands in the branch above.
        startAPIServer();
    }
}
const redOutput = "\x1b[31m%s\x1b[0m";
run().catch(e => {
    console.error(redOutput, e);
    process.exit(1);
});
