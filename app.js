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


const tempDB = [];
// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));


/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.post('/interactions', async function (req, res) {
  // Interaction type and data
  const { type, id, data, token, channel_id } = req.body;
  const userID = req.body.member.user.id;
  console.log(req.body);
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

    // price reminder command
    if (name == 'pricereminder' && id) {
      const url = req.body.data.options[0].value;
      await DiscordRequest(`interactions/${id}/${token}/callback`, { method: 'POST', body: {
          type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
        } 
      });

      const [productName, price] = await getProductAmazon(url);

      tempDB.push({id: id, productName: productName, price: price, url: url, user_id: userID, channel_id: channel_id});
      console.log(tempDB);

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


async function bruh() {
  await DiscordRequest(`channel/${tempDB[0].channel_id}/messages`, {
    method: 'POST', 
    body: {
      content: `${tempDB[0].productName} price have changed! Current product price is: ${tempDB[0].price}`,
      components: [
        {
            type: MessageComponentTypes.ACTION_ROW,
            components: [
                {
                    type: MessageComponentTypes.BUTTON,
                    style: ButtonStyleTypes.LINK,
                    label: 'Link to product',
                    url: tempDB[0].url,
                },
            ],
        },
      ],
    },
  });
}


app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});