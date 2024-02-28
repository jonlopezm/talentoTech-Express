const userSchema = require('../models/User.js');
const houseSchema = require('../models/House.js');
const messageSchema = require('../models/Message.js');
const { path } = require('../index.js');



const resolvers = {
    hello: () => {
        return "Hello world!";
    },
    User: async (_,{id}) => {
        try {
            let user = await userSchema.findById(id);
            return user;
        } catch (error) {
            console.log(error);
        }
    },
    Users: async () => {
        try {
            let users = await userSchema.find();
            return users;
        } catch (error) {
            console.log(error);
        }
    },
    UserByFilter: async (_,{filter}) => {
        try {
            let query={};
            if (filter.name) {
                query.name = {$regex: filter.name, $options: 'i'}
            }
            if (filter.lastname) {
                query.lastname = {$regex: filter.lastname, $options: 'i'}
            }
            if (filter.email) {
                query.email = {$regex: filter.email, $options: 'i'}
                
            }
            let users = await userSchema.find(query);
            return users;
        } catch (error) {
            console.log(error);
        }
    },
    Message: async (_,{id}) => {
        try {
            let message = await messageSchema.findById(id)
            .populate({
                path    : 'from',
                Selection   : '-password'})
                .populate({
                path    : 'to',
                Selection   : '-password'});
            return message;
        } catch (error) {
            console.log(error);
        }
    },
    Messages: async () => {
        try {
            let messages = await messageSchema.find()
                .populate({
                path    : 'from',
                Selection   : '-password'})
                .populate({
                path    : 'to',
                Selection   : '-password'});
            return messages;
        } catch (error) {
            console.log(error);
        }
    },
    MessagesByFilter: async (_,{filter}) => {
        try {
            let query={};
            if (filter.from) {
                
                query = {from: filter.from}
            }
            if (filter.to) {
                query = {to: filter.to}
            }
            if (filter.body) {
                query.body = {$regex: filter.body, $options: 'i'}
            }

            let messages = await messageSchema.find(query)
            .populate({
                path    : 'from',
                Selection   : '-password'})
                .populate({
                path    : 'to',
                Selection   : '-password'});
            return messages;
        } catch (error) {
            console.log(error);
        }
    },
    House: async (_,{id}) => {
        try {
            let house = await houseSchema.findById(id);
            return house;
        } catch (error) {
            console.log(error);
        }
    },
    Houses: async () => {
        try {
            let houses = await houseSchema.find();
            return houses;
        } catch (error) {
            console.log(error);
        }
    },
    housesByFilter: async (_,{filter}) => {
        try {
            let query={};
            if (filter.city) {
                query.city = {$regex: filter.city, $options: 'i'}
            }
            if (filter.state) {
                query.state = {$regex: filter.state, $options: 'i'}
            }
            if (filter.type) {
                query.type = {$regex: filter.type, $options: 'i'}
            }
            let houses = await houseSchema.find(query);
            return houses;
        } catch (error) {
            console.log(error);
        }
    }
}
    

module.exports = resolvers;