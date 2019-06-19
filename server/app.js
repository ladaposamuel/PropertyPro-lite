// app.js
import express from 'express';
import userRoutes from './routes/userRoutes';

const app = express();

app.use(express.json());

app.get('/', (req, res) => res.status(200).send({ message: 'Welcome to PropertyPro Lite API' }));
app.use('/api/v1/auth', userRoutes);
app.listen(3000);
// console.log('app running on port ', 3000);
module.exports = app;
