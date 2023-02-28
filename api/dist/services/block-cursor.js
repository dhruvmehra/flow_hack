"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockCursorService = void 0;
/**
 * Block Cursor Service
 *
 * Service class used to query the block_cursor table to READ/INSERT/UPDATE block cursors for relative events.
 *
 */
const block_cursor_1 = require("../models/block-cursor");
const uuid_1 = require("uuid");
class BlockCursorService {
    async findOrCreateLatestBlockCursor(latestBlockHeight) {
        let blockCursor;
        // expect table to only return 1 row for latest block_cursor checked.
        let blockCursors = await block_cursor_1.BlockCursor.query();
        if (blockCursors.length < 1) {
            blockCursor = await block_cursor_1.BlockCursor.query().insertAndFetch({
                id: (0, uuid_1.v4)(),
                current_block_height: latestBlockHeight,
            });
        }
        else {
            blockCursor = blockCursors[0];
        }
        return blockCursor;
    }
    async updateBlockCursorById(id, currentBlockHeight) {
        return block_cursor_1.BlockCursor.query().updateAndFetchById(id, {
            current_block_height: currentBlockHeight,
        });
    }
}
exports.BlockCursorService = BlockCursorService;
