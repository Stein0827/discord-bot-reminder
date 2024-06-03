import 'dotenv/config';
import express from 'express';
import {
    InteractionType,
    InteractionResponseType,
    InteractionResponseFlags,
    MessageComponentTypes,
    ButtonStyleTypes,
} from 'discord-interactions';
import { VerifyDiscordRequest, DiscordRequest } from './utils.js';
import { getProductAmazon } from './utils.js';
import { DatabaseClient } from './dbclass.js';


// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));
const sqlDB = new DatabaseClient();

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
// TODO implement new command to unsubscribe
app.post('/interactions', async function (req, res) {
    // Interaction type and data
    const { type, id, data, token, channel_id } = req.body;
    const userID = req.body.member.user.id;
    /**
     * Handle verification requests
     */
    if (type === InteractionType.PING) {
        return res.send({ type: InteractionResponseType.PONG });
    }

    /**
     * Handle slash command requests
     * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
     */
    if (type === InteractionType.APPLICATION_COMMAND) {
        const { name } = data;
        
        if (name == 'list' && id) {
            const productData = await sqlDB.getDataByUser(userID);
            // sends a pending message
            await DiscordRequest(`interactions/${id}/${token}/callback`, {
                method: 'POST', body: {
                    type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
                    flags: 6,
                }
            });
            
            // TODO actually design a good looking message to send
            // updates the loading message with a subsription confirmation
            // await DiscordRequest(`webhooks/${process.env.APP_ID}/${token}/messages/@original`, {
            //     method: 'PATCH', body:
            //     {
            //         content: `<@${userID}> Here are the list of your products`,
            //         components: [
            //             {
            //                 type: MessageComponentTypes.ACTION_ROW,
            //                 components: [
            //                     {
            //                         type: MessageComponentTypes.BUTTON,
            //                         style: ButtonStyleTypes.LINK,
            //                         label: 'Link to product',
            //                         url: url,
            //                     },
            //                 ],
            //             },
            //         ],
            //     },
            // });
        }

        // unsubscribe a product
        if (name == 'unsubscribe' && id) {
            // sends a pending message
            await DiscordRequest(`interactions/${id}/${token}/callback`, {
                method: 'POST', body: {
                    type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
                    flags: 6,
                }
            });
            
            // TODO add a pull down menu UI so the user can choose which product to delete
            await DiscordRequest(`webhooks/${process.env.APP_ID}/${token}/messages/@original`, {
                method: 'PATCH', body: {
                    content: 'choose to delete',
                    flag: InteractionResponseFlags.EPHEMERAL,
                }
            })

        }

        // price reminder command
        if (name == 'subscribe' && id) {
            const url = req.body.data.options[0].value;
            
            // sends a pending message
            await DiscordRequest(`interactions/${id}/${token}/callback`, {
                method: 'POST', body: {
                    type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
                    flags: 6,
                }
            });

            // scrapes the web page to get name and price of product
            const [productName, price] = await getProductAmazon(url);
            
            // inserts data into database
            sqlDB.insertData(userID, productName, url, price, channel_id);
            
            // updates the loading message with a subsription confirmation
            await DiscordRequest(`webhooks/${process.env.APP_ID}/${token}/messages/@original`, {
                method: 'PATCH', body:
                {
                    content: `<@${userID}> Subscribed to ${productName}, current product price is: ${price}`,
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
    }
});


app.listen(PORT, () => {
    console.log('Listening on port', PORT);
});