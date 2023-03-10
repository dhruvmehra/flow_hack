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
exports.BaseEventHandler = void 0;
/**
 * Base Event Handler
 *
 * This will iterate through a range of block_heights and then run a callback to process any events we
 * are interested in. It also keeps a cursor in the database so we can resume from where we left off at any time.
 *
 */
const fcl = __importStar(require("@onflow/fcl"));
class BaseEventHandler {
    constructor(blockCursorService, flowService, eventNames) {
        this.blockCursorService = blockCursorService;
        this.flowService = flowService;
        this.eventNames = eventNames;
        this.stepTimeMs = 1000;
        this.stepSize = 200;
    }
    async run() {
        console.log("start event polling");
        const poll = async () => {
            let lastestBlockHeight = await this.flowService.getLatestBlockHeight();
            // if blockCursor does not exist in DB (1st instantiation of application), create one with lastest block height
            let blockCursor = await this.blockCursorService.findOrCreateLatestBlockCursor(lastestBlockHeight);
            if (!blockCursor || !blockCursor.id) {
                throw new Error("Could not get block cursor due to database error.");
            }
            // currentBlockHeight in the DB will equal the toBlock of the previous blockrange fcl query.
            // increment fromBlock by 1 for next window.
            let fromBlock = blockCursor.currentBlockHeight + 1;
            let toBlock = await this.flowService.getLatestBlockHeight();
            // on 1st iteration, fromBlock will be greater than toBlock due to newly inserted row.
            if (fromBlock > toBlock) {
                fromBlock = toBlock;
            }
            // getEventsAtBlockHeightRange() has a block limit of 250 blocks.
            // If the range exceeds the limit of 200 then hard cap the block search range
            if (fromBlock + this.stepSize < toBlock) {
                toBlock = fromBlock + this.stepSize;
            }
            console.log(`Checking block range: fromBlock=${fromBlock} toBlock=${toBlock}`);
            // iterate over eventNames and fetch events for block range
            let events = [];
            for (const eventName of this.eventNames) {
                try {
                    const result = await fcl.send([
                        fcl.getEventsAtBlockHeightRange(eventName, fromBlock, toBlock)
                    ]);
                    const decoded = await fcl.decode(result);
                    if (decoded.length > 0) {
                        events.push(...decoded);
                    }
                }
                catch (e) {
                    console.error(`Error retrieving events for block range fromBlock=${fromBlock} toBlock=${toBlock}`, e);
                }
            }
            if (events.length > 0) {
                console.log(`Found ${events.length} events in block range`);
                events.sort((event1, event2) => {
                    // order events by block height ascending
                    if (event1.blockHeight > event2.blockHeight) {
                        return 1;
                    }
                    else if (event1.blockHeight < event2.blockHeight) {
                        return -1;
                    }
                    // if events are on the same block, order by transaction index
                    if (event1.transactionIndex > event2.transactionIndex) {
                        return 1;
                    }
                    else if (event1.transactionIndex < event2.transactionIndex) {
                        return -1;
                    }
                    // if events are on the same transaction, order by event index
                    if (event1.eventIndex > event2.eventIndex) {
                        return 1;
                    }
                    else if (event1.eventIndex < event2.eventIndex) {
                        return -1;
                    }
                    return 0;
                });
                // update database in order of events
                for (const event of events) {
                    try {
                        await this.onEvent(event);
                    }
                    catch (e) {
                        console.error(`Encountered Error processing event: ${JSON.stringify(event)}`, e);
                    }
                }
            }
            // Record the last block queried
            blockCursor = await this.blockCursorService.updateBlockCursorById(blockCursor.id, toBlock);
            // recursively call self to continue polling
            setTimeout(poll, this.stepTimeMs);
        };
        // execute polling method.
        poll();
    }
    ;
}
exports.BaseEventHandler = BaseEventHandler;
