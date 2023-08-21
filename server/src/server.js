const fastify = require('fastify')();

// Configuring CORS
fastify.register(require('@fastify/cors'), {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    preflightContinue: false,
    optionsSuccessStatus: 204
});

// Configuring Fastify with PostgreSQL
fastify.register(require('@fastify/postgres'), {
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost/fastifydb'
});

// User Authentication using JWT
fastify.register(require('fastify-jwt'), {
    secret: 'supersecret'
});

fastify.decorate('authenticate', async (request, reply) => {
    try {
        await request.jwtVerify();
    } catch (err) {
        reply.send(err);
    }
});

// Async/Await Endpoint Example
fastify.get('/data', async (request, reply) => {
    const client = await fastify.pg.connect();
    const { rows } = await client.query('SELECT * FROM my_table');
    client.release();
    return rows;
});

// CRUD Operations
fastify.post('/data', async (request, reply) => {
    const client = await fastify.pg.connect();
    const { name, value } = request.body;
    await client.query('INSERT INTO my_table (name, value) VALUES ($1, $2)', [name, value]);
    client.release();
    return { success: true };
});

fastify.put('/data/:id', async (request, reply) => {
    const client = await fastify.pg.connect();
    const { id } = request.params;
    const { name, value } = request.body;
    await client.query('UPDATE my_table SET name=$1, value=$2 WHERE id=$3', [name, value, id]);
    client.release();
    return { success: true };
});

fastify.get('/data/:id', async (request, reply) => {
    const client = await fastify.pg.connect();
    const { id } = request.params;
    const { rows } = await client.query('SELECT * FROM my_table WHERE id=$1', [id]);
    client.release();
    return rows[0] || {};
});

// Login
fastify.post('/login', async (request, reply) => {
    const { username, password } = request.body;
    const getUserByUsername = async (username) => {
        const client = await fastify.pg.connect();
        const { rows } = await client.query('SELECT * FROM users WHERE username=$1', [username]);
        client.release();
        return rows[0] || null;
    };

    const user = await getUserByUsername(username);

    if (user && user.password === password) {
        const token = fastify.jwt.sign({ id: user.id });
        return { token };
    } else {
        reply.code(401);
        return { error: 'Authentication failed' };
    }
});

fastify.get('/protected-route', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    return { protected: 'data' };
});

fastify.listen({ port: 8080 }, err => {
    if (err) throw err
    console.log(`server listening on ${fastify.server.address().port}`)
  })