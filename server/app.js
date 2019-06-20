import express from 'express';
import path from 'path';
import userRoutes from './routes/userRoutes';

const swaggerJSDoc = require('swagger-jsdoc');

const app = express();

app.use(express.json());

// -- setup up swagger-jsdoc --
const swaggerDefinition = {
  info: {
    title: 'PropertyPro-Lite',
    version: '1.0.0',
    description: 'Property Pro Lite is a platform where people can create and/or search properties for sale or rent.',
  },
  host: 'localhost:3000',
  basePath: '/',
};
const options = {
  swaggerDefinition,
  apis: [path.resolve(__dirname, '/routes/*.js')],
};
const swaggerSpec = swaggerJSDoc(options);

// -- routes for docs and generated swagger spec --

app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.get('/', (req, res) => {
  res.redirect('/docs');
});

app.use('/api/v1/auth', userRoutes);
app.listen(3000);
// console.log('app running on port ', 3000);
module.exports = app;
