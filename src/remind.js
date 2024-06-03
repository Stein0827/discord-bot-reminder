import { DiscordRequest } from "./utils.js";
import {
    InteractionType,
    InteractionResponseType,
    InteractionResponseFlags,
    MessageComponentTypes,
    ButtonStyleTypes,
} from 'discord-interactions';

import axios from "axios";

import { DatabaseClient } from "./dbclass.js";
import { getProductAmazon } from "./utils.js";

// TODO finish the discord request given time interval to check prices
// TODO integrate database with this discord request message

// sends a message given the channel id
async function sendRequest(userID, channel_id, url, productName, price) {

    return await DiscordRequest(`channels/${channel_id}/messages`, {
        method: 'POST',
        body: {
            content: `<@${userID}>${productName} price have not chnaged! Current product price is: ${price}`,
            components: [
                {
                    type: MessageComponentTypes.ACTION_ROW,
                    components: [
                        {
                            type: MessageComponentTypes.BUTTON,
                            style: ButtonStyleTypes.LINK,
                            label: 'Link to product',
                            url: url,
                        },
                    ],
                },
            ],
        },
    });
}

// extract product id, might be useful later
function extractProductId(url) {
    // Regular expression to match the product ID after /dp/ and before any delimiter
    const regex = /\/dp\/([A-Z0-9]+)/;
    const match = url.match(regex);

    if (match && match[1]) {
        return match[1];
    } else {
        // Handle cases where the product ID is not found
        console.error("Product ID not found in the URL");
        return null;
    }
}