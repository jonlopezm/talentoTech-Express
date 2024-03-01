const request = require('supertest');
const app = require('../index.js');

describe('GET /', () => {
    it('responds with status 200',  async () =>{
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('Hello world');
    });
});

describe('GET /user', () => {
    it('responds with status 200',  async () =>{
        const response = await request(app).get('/user');
        expect(response.statusCode).toBe(200);        
    });
});

describe('GET /user', () => {
    it('responds with array Object that cibtains an specific user',  async () =>{
        const response = await request(app).get('/user');
        const onbjecUser = {
                "_id": "65cffed7dc44d13697533a85",
                "id": 545454558,
                "name": "prueba",
                "lastname": "Martinez",
                "email": "prueba@hotmail.com",
                "password": "$2b$10$olOn1J5WgVz6o29R11wRX.VakaMQ5JkEg7oSaMJhv.VH6X7UXTB.G",
                "__v": 0,
                "avatar": "uploads\\1708390545609-2410.PNG"
        }
        expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
        expect(response.body).toContainEqual(onbjecUser);
        expect(Array.isArray(response.body)).toBe(true);
    });
});

describe('GET /user/:id', () => {
    it('responds with status 200',  async () =>{
        var id = '65cffed7dc44d13697533a85';
        const response = await request(app).get('/user/'+id);
        expect(response.statusCode).toBe(200);        
    });
});

describe('GET /user:id', () => {
    it('responds with array Object that contains a specific user',  async () =>{
        const id = "65cffed7dc44d13697533a85";
        const response = await request(app).get('/user/'+id);
        const onbjecUser = {
                "_id": "65cffed7dc44d13697533a85",
                "id": 545454558,
                "name": "prueba",
                "lastname": "Martinez",
                "email": "prueba@hotmail.com",
                "password": "$2b$10$olOn1J5WgVz6o29R11wRX.VakaMQ5JkEg7oSaMJhv.VH6X7UXTB.G",
                "__v": 0,
                "avatar": "uploads\\1708390545609-2410.PNG"
        }
        expect(typeof response.body === "object").toBe(true);
        expect(response.body).toStrictEqual(onbjecUser);
    });
});

describe('POST /user', () => {
    it('Create a new user in the DB and response',  async () =>{
        const newUser = {
            "id": 545454559,
            "name": "Sebastian",
            "lastname": "Lopez",
            "email": "sebaslopez@hotmail.com",
            "password": "UsuarioDePrueba",
            "avatar" : "uploads\\1708390545609-2410.PNG"
        }
        const response = await request(app).post('/user').send(newUser);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('_id');
        expect(response.body).toHaveProperty(newUser.name);
        expect(response.body).toHaveProperty(newUser.lastname);
        expect(response.body).toHaveProperty(newUser.email);
    });
});

describe('POST /user/login', () => {
    it('Login with a user and response', async () => {
        const user = {
            "email": "prueba12@hotmail.com",
            "password": "UsuarioDePrueba"
        }
        const response = await request(app).post('/user/login').send(user);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('token');
        expect(response.body.status).toBe('success');
    });
    it('Error login with email and password', async () => {
        const user = {
            "email": "prueba144@hotmail.com",
            "password": "UsuarioDePrueba12345"
        }
        const response = await request(app).post('/user/login').send(user);
        console.log(response.body);
        expect(response.statusCode).toBe(401);
        expect(response.body).not.toHaveProperty('token')
        expect(response.body.status).toBe('error');

    });
});

describe('DELETE /user/:id', () => {

    it('Delete a user from the DB', async () => {
        const id = "65e13142918d58ffe91cf39e";
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZTEzMTQyOTE4ZDU4ZmZlOTFjZjM5ZSIsImVtYWlsIjoicHJ1ZWJhMTJAaG90bWFpbC5jb20iLCJpYXQiOjE3MDkyNTg2OTUsImV4cCI6MTcwOTI2MjI5NX0.bm7QhN33i5skXMFbU9CaDVQXolPszBJ8gV6a5Mr6aoM";
        const response = await request(app).delete('/user/' + id).set('Authorization','Bearer '+ token);
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe('success');

    });
});

