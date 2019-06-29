import express from 'express';
import path from 'path';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import propertyRoutes from './routes/propertyRoutes';

const swaggerJSDoc = require('swagger-jsdoc');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// -- setup up swagger-jsdoc --
const swaggerDefinition = {
  info: {
    title: 'PropertyPro-Lite',
    version: '1.0.0',
    description:
      'Property Pro Lite is a platform where people can create and/or search properties for sale or rent.',
  },
  host: 'localhost:3000',
  basePath: '/',
};
const options = {
  swaggerDefinition,
  apis: ['./server/routes/*.js'],
};
const swaggerSpec = swaggerJSDoc(options);

// -- routes for docs and generated swagger spec --

app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.get('/docs', (req, res) => {
  res.sendFile(path.join(__dirname, 'redoc.html'));
});

app.get('/', (req, res) => {
  res.redirect('/docs');
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/', propertyRoutes);
app.use((req, res) => {
  res.status(404).json('Error! Route does not exist');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('server has started');
});
// console.log('app running on port ', 3000);
module.exports = app;
