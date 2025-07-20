import express, { Application, Request, Response } from 'express';

const app: Application = express();
const port: number = 3000;
const cors = require("cors");
require("dotenv").config();
app.use(express.json());
app.use(cors());
app.get('/', (req: Request, res: Response) => {
  res.send("hello");
});

app.listen(port, () => {
  console.log(`Connected successfully on port ${port}`);
});



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster.ia0ielx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

interface Event {
  title: string;
  date: string;
  time: string;
  notes?: string;
  category: 'Work' | 'Personal' | 'Other';
  archived: boolean;
}


function categorizeEvent(title: string, notes?: string): 'Work' | 'Personal' | 'Other' {
  const text = `${title} ${notes || ''}`.toLowerCase();
  const workKeywords = ['meeting', 'project', 'client', 'work', 'deadline'];
  const personalKeywords = ['birthday', 'family', 'party', 'vacation', 'friend'];
  if (workKeywords.some(keyword => text.includes(keyword))) {
    return 'Work';
  }
  if (personalKeywords.some(keyword => text.includes(keyword))) {
    return 'Personal';
  }
  return 'Other';
}


async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    const eventCollection = client.db("event-scheduler").collection('events')


    app.post('/events', async (req: Request, res: Response) => {
      try {
        const { title, date, time, notes } = req.body;

        // Validate input
        if (!title || !date || !time) {
          return res.status(400).json({ error: 'Title, date, and time are required' });
        }
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
          return res.status(400).json({ error: 'Invalid date format (YYYY-MM-DD)' });
        }
        if (!/^\d{1,2}:\d{2} (AM|PM)$/i.test(time)) {
  return res.status(400).json({ error: 'Invalid time format (h:mm AM/PM)' });
}


        const event: Event = {
          title,
          date,
          time,
          notes,
          category: categorizeEvent(title, notes),
          archived: false,
        };

        const result = await eventCollection.insertOne(event);
        res.status(201).json({ ...event, _id: result.insertedId });
      } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ error: 'Server error' });
      }
    });



    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
