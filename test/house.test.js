const request = require('supertest');
const app = require('../index.js');

describe('GET /', () => {
    it('responds with status 200', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('Hello world');
    });
});

describe('GET /houses', () => {
    it('responds with status 200', async () => {
        const response = await request(app).get('/houses');
        expect(response.statusCode).toBe(200);
    });
});

describe('GET /houses', () => {
    it('responds with array Object that contains an specific house', async () => {
        const response = await request(app).get('/houses');
        const onbjecHouse = {
            "_id": "65d408532dc4cd048b3d0114",
            "address": "Calle 10E #10-14",
            "city": "Manizales",
            "state": "Caldas",
            "size": 56,
            "type": "apartment",
            "zipCode": "1700004",
            "rooms": 3,
            "bathrooms": 2,
            "parking": false,
            "price": 190000000,
            "code": "ABCD7855",
            "image": "uploads\\houses\\1708473386715-descarga (1).jpg"
        }
        expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
        expect(response.body).toContainEqual(onbjecHouse);
        expect(Array.isArray(response.body)).toBe(true);
    });
});


describe('GET /houses/:code', () => {

    it('responds with an Object that contains an specific House', async () => {
        const code = "ABCD9862";
        const response = await request(app).get('/houses/' + code);
        expect(response.statusCode).toBe(200);
        expect(typeof response.body === "object").toBe(true);
        expect(response.body).toHaveProperty('_id');
        expect(response.body).toHaveProperty('address');
        expect(response.body).toHaveProperty('city');
        expect(response.body).toHaveProperty('state');
        expect(response.body).toHaveProperty('size');
        expect(response.body).toHaveProperty('type');
        expect(response.body).toHaveProperty('price');
        expect(response.body).toHaveProperty('code');
    });

    it('responds with an Object that contains an specific House', async () => {
        const code = "ABCD98623";
        const response = await request(app).get('/houses/' + code);
        expect(response.statusCode).toBe(401);
        expect(response.body).not.toHaveProperty('address')
        expect(response.body.status).toBe('error');
    });
});


describe('GET /houses/:id', () => {
    it('responds with status 200', async () => {
        var id = '65d408532dc4cd048b3d0114';
        const response = await request(app).get('/houses/' + id);
        expect(response.statusCode).toBe(200);
    });

    it('Error  get with id ', async () => {
        var id = '65d408532dc4cd048b3d01145';
        const response = await request(app).get('/houses/' + id);
        console.log(response.body);
        expect(response.statusCode).toBe(401);
        expect(response.body.status).toBe('error');
    });
});


describe('GET /houses:id', () => {
    it('responds with array Object that contains a specific house', async () => {
        const id = "65d408532dc4cd048b3d0114";
        const response = await request(app).get('/houses/' + id);
        const onbjecHouse = {
            "_id": "65d408532dc4cd048b3d0114",
            "address": "Calle 10E #10-14",
            "city": "Manizales",
            "state": "Caldas",
            "size": 56,
            "type": "apartment",
            "zipCode": "1700004",
            "rooms": 3,
            "bathrooms": 2,
            "parking": false,
            "price": 190000000,
            "code": "ABCD7855",
            "image": "uploads\\houses\\1708473386715-descarga (1).jpg"
        }
        expect(typeof response.body === "object").toBe(true);
        expect(response.body).toStrictEqual(onbjecHouse);
    });
});

describe('PATCH /houses/:id', () => {
    it('Update a house in the DB and response', async () => {
        const id = "65d408532dc4cd048b3d0114";
        const updateHouse= {
            size: 130,
            rooms: 4,
            bathrooms: 3,
            price: 290000000,
            zipCode: "17000046",
        }
        const response = await request(app).patch('/houses/' + id).send(updateHouse);
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe('success');
    });
    it('Update ERROR a house (city) in the DB and response', async () => {
        const id = "65d408532dc4cd048b3d011";
        const updateHouse= {
            size: 130,
            rooms: 4,
            bathrooms: 3,
            price: 290000000,
            zipCode: "17000046",
            city: "Maniza"
        }
        const response = await request(app).patch('/houses/' + id).send(updateHouse);
        expect(response.statusCode).toBe(404);
        expect(response.body.status).toBe('Error actualizando el registro');
    }
});



describe('POST /houses', () => {
    it('Create a new House in the DB and response', async () => {
        const newHouse = {
            "address": "Calle 15E #10-14",
            "city": "Bogotá D.C.",
            "state": "Cundinamarca",
            "size": 56,
            "type": "apartment",
            "zipCode": "17000045",
            "rooms": 3,
            "bathrooms": 2,
            "parking": false,
            "price": 390000000,
            "code": "ABCD9862",
            "image": "uploads\\houses\\1708473386715-descarga (1).jpg"
        };        
        const response = await request(app).post('/houses').send(newHouse);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('_id');
        expect(response.body).toHaveProperty(newHouse.address);
        expect(response.body).toHaveProperty(newHouse.city);
        expect(response.body).toHaveProperty(newHouse.state);
        expect(response.body).toHaveProperty(newHouse.price);
        expect(response.body).toHaveProperty(newHouse.code);
    });
});



describe('DELETE /houses/:id', () => {
    it('Delete a house in the DB and response', async () => {
        const id = "65d408532dc4cd048b3d0114";
        const response = await request(app).delete('/houses/' + id);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('House deleted successfully');
    });

    it('Delete ERROR a house in the DB and response', async () => {
        const id = "65d408532dc4cd048b3d011";
        const response = await request(app).delete('/houses/' + id);
        expect(response.statusCode).toBe(401);
        expect(response.body.status).toBe('error');
        expect(response.body.message).toBe('Error eliminando la casa solicitada');
    });
});


