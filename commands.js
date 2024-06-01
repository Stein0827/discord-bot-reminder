import 'dotenv/config';
import { InstallGlobalCommands } from './utils.js';


// Simple test command
const TEST_COMMAND = {
  name: 'test',
  description: 'Basic command',
  type: 1,
};


const PRICE_REMINDER = {
  name: 'pricereminder',
  description: 'reminds you the price of the product',
  options: [
    {
      type: 3,
      name: 'link',
      description: 'link to the product',
      required: true,
    },
  ],
  type: 1,
};


const ALL_COMMANDS = [TEST_COMMAND, PRICE_REMINDER];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);