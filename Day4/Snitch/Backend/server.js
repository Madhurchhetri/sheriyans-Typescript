import dotenv from 'dotenv';
import app from './src/app.js';
import connectMongo from './src/config/db.js';

dotenv.config();

connectMongo();


const PORT =3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
