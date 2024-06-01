import { DiscordRequest } from "./utils.js";
import {
    InteractionType,
    InteractionResponseType,
    InteractionResponseFlags,
    MessageComponentTypes,
    ButtonStyleTypes,
  } from 'discord-interactions';

// TODO finish the discord request given time interval to check prices
// TODO integrate database with this discord request message
await DiscordRequest(`channels/1245920549239128176/messages`, {
    method: 'POST', 
    body: {
      content: `<@185425130195910656>Google Fitbit Ace LTE price have changed! Current product price is: 25`,
      components: [
        {
            type: MessageComponentTypes.ACTION_ROW,
            components: [
                {
                    type: MessageComponentTypes.BUTTON,
                    style: ButtonStyleTypes.LINK,
                    label: 'Link to product',
                    url: 'https://www.amazon.com/Google-Fitbit-Ace-LTE-Activity-Based/dp/B0CV5VPX3T/ref=pd_ci_mcx_mh_mcx_views_0?pd_rd_w=4mjIC&content-id=amzn1.sym.8b590b55-908d-4829-9f90-4c8752768e8b%3Aamzn1.symc.40e6a10e-cbc4-4fa5-81e3-4435ff64d03b&pf_rd_p=8b590b55-908d-4829-9f90-4c8752768e8b&pf_rd_r=3B1XQWEYAAKA789V1F6J&pd_rd_wg=7Gqu2&pd_rd_r=97699de6-e3f8-4fae-beec-fbfda463e8ee&pd_rd_i=B0CV5VPX3T',
                },
            ],
        },
      ],
    },
});   