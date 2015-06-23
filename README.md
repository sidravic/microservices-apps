# microservices-apps

The app aims to define the boiler plate needed to process events via an Event Store.

# Setup

To run the apps you'll need 

1. Event Store (geteventstore.com)
2. Rabbitmq
3. Mongodb

Once you have everything setup you can simply run both services. 

# Overview of the app features.

1. The Authentication service publishes to the event store.
2. The cart service focuses on creating a cart for every user that completes authentication.
3. The cart system on initialization tries to catchup on all the events it missed.
4. Once it completes processing those it begins to subscribe to the realtime events from the eventstore.
5. Processing only involves creating a cart object in the database for the authenticated jsonWebToken.
