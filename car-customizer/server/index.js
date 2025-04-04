import express from 'express';
import cors from 'cors';
import userRoutes from './routes/users.js'; 
import dotenv from 'dotenv';
import buildsRouter from './routes/builds.js';
dotenv.config();


const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/builds', buildsRouter);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Backend is running! 🚗');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
