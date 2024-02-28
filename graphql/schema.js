const { GraphQLID, 
    GraphQLObjectType,
    GraphQLBoolean, 
    GraphQLString,
    GraphQLInputObjectType,
    GraphQLList,
    GraphQLSchema} = require('graphql')
const resolvers = require('./resolvers')



const User = new GraphQLObjectType({
    name: 'User',
    fields: {
        _id: { type: GraphQLString },
        name: { type: GraphQLString },
        lastname: { type: GraphQLString },
        email: { type: GraphQLString },
        avatar: { type: GraphQLString }
    }
})

const Message = new GraphQLObjectType({
    name: 'Message',
    fields: {
        _id: { type: GraphQLString },
        body: { type: GraphQLString },
        from: { type: User },
        to: { type: User },
        readed: { type: GraphQLString }
    }
})

const House = new GraphQLObjectType({
    name: 'House',
    fields: {
        _id: { type: GraphQLString },
        address: { type: GraphQLString },
        city: { type: GraphQLString },
        state: { type: GraphQLString },
        size: { type: GraphQLString },
        type: { type: GraphQLString },
        zipCode: { type: GraphQLString },
        code: { type: GraphQLString },
        rooms: { type: GraphQLString },
        bathrooms: { type: GraphQLString },
        price: { type: GraphQLString },
        image: { type: GraphQLString }
    }
})

const userFilterInput = new GraphQLInputObjectType({
    name: 'userFilterInput',
    fields: {
        name: { type: GraphQLString },
        lastname: { type: GraphQLString },
        email: { type: GraphQLString }
    }
})
const messageFilterInput = new GraphQLInputObjectType({
    name: 'messageFilterInput',
    fields: {
        from: { type: GraphQLString },
        to: { type: GraphQLString },
        body: { type: GraphQLString }
    }
})
const houseFilterInput = new GraphQLInputObjectType({
    name: 'houseFilterInput',
    fields: {
        city: { type: GraphQLString },
        state: { type: GraphQLString },
        type: { type: GraphQLString },
        zipCode: { type: GraphQLString }
    }
})


const queries = {
    hello: {
            type: GraphQLString ,
            resolve: resolvers.hello
        },
        User: {
            type: User,
            args: { id: { type: GraphQLString } },
            resolve: resolvers.User
        },
        Users: {
            type: GraphQLList(User),
            resolve: resolvers.Users
        },
        UserByFilter: {
            type: GraphQLList(User),
            args: { filter: { type: userFilterInput } },
            resolve: resolvers.UserByFilter
        },
        Message: {
            type: Message,
            args: { id: { type: GraphQLString } },
            resolve: resolvers.Message
        },
        Messages: {
            type: GraphQLList(Message),
            resolve: resolvers.Messages
        },
        MessagesByFilter: {
            type: GraphQLList(Message),
            args: { filter: { type: messageFilterInput } },
            resolve: resolvers.MessagesByFilter
        },
        House: {
            type: House,
            args: { id: { type: GraphQLString } },
            resolve: resolvers.House
        },
        Houses: {
            type: GraphQLList(House),
            resolve: resolvers.Houses
        },
        housesByFilter: {
            type: GraphQLList(House),
            args: { filter: { type: houseFilterInput } },
            resolve: resolvers.housesByFilter
        }
    }


const queryType  = new GraphQLObjectType({
    name: 'Query',
    fields: queries
})

const schema = new GraphQLSchema({
    query: queryType 
})

module.exports = schema;