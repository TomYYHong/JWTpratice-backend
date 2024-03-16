// server.ts
import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;
const secretKey = 'your-secret-key';

interface User {
  id: number;
  username: string;
  password: string;
}

const users: User[] = [
  { id: 1, username: 'user1', password: 'password1' },
  { id: 2, username: 'user2', password: 'password2' }
];

app.use(cors());
app.use(bodyParser.json());

// Login endpoint
app.post('/login', (req: Request, res: Response) => {
  const { username, password } = req.body;

  // Dummy authentication 
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    const token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid username or password' });
  }
});

// Protected endpoint
app.get('/protected', authenticateToken, (req: Request, res: Response) => {
  res.json({ message: 'Protected resource accessed successfully' });
});

function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, secretKey, (err: any, user: any) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.body.user = user;
    next();
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
