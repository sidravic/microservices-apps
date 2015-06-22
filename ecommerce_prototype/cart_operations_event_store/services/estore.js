var es = require('eventstore')({
	type: 'mongodb',
  host: 'localhost',                          // optional
  port: 27017,                                // optional
  dbName: 'cart_operations_events_store',                       // optional
  eventsCollectionName: 'events',             // optional
  snapshotsCollectionName: 'snapshots',       // optional
  transactionsCollectionName: 'transactions', // optional
  timeout: 10000         
});
