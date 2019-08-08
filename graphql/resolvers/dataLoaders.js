/**
 * https://github.com/graphql/dataloader
 * DataLoader let's using request batching.
 * Loader will group similar request together and send 1 bigger request
 * reducing number of sent requests
 */

const DataLoader = require('dataloader');

const Event = require('../../models/event');
const User = require('../../models/user');

const eventLoader = new DataLoader(eventIds => {
  return Event.find({ _id: { $in: eventIds } });
});

const userLoader = new DataLoader(userIds => {
  return User.find({ _id: { $in: userIds } });
});

module.exports = {
  eventLoader,
  userLoader
};
