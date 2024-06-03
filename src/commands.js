import 'dotenv/config';
import { InstallGlobalCommands } from './utils.js';


// Simple test command
const TEST_COMMAND = {
  name: 'test',
  description: 'Basic command',
  type: 1,
};

// subscribe command
const SUBSCRIBE_COMMAND = {
  name: 'subscribe',
  description: 'subscribe to a product for price tracking',
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


// command to list all subscription
const LIST_SUBSCRIPTION_COMMAND = {
  name: 'list',
  description: 'get a list of your subscribed products',
  type: 1,
};

// command to delete a subscription
const UNSUBSCRIBE_COMMAND = {
  name: 'unsubscribe',
  description: 'unsubscribe to a product for price tracking',
  options: [
    {
      type: 3,
      name: 'name',
      description: 'name of the product',
      required: true,
    },
  ],
  type: 1,
};



const ALL_COMMANDS = [TEST_COMMAND, SUBSCRIBE_COMMAND, UNSUBSCRIBE_COMMAND, LIST_SUBSCRIPTION_COMMAND];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);