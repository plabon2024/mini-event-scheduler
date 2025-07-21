import express, { Application, Request, response, Response } from 'express';

import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
const app: Application = express();
const port: number = 3000;
const cors = require("cors");
app.use(express.json());
app.use(cors());
require("dotenv").config();
app.get('/', (req: Request, res: Response) => {
  res.send("hello");
});

app.listen(port, () => {
  console.log(`Connected successfully on port ${port}`);
});



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
    // Send a ping to confirm a successful connection
    const eventCollection = client.db("event-scheduler").collection('events')


    app.post('/events', async (req: Request, res: Response) => {
      try {
        const { title, date, time, notes } = req.body;
        console.log('Request Body:', req.body);
        // Validate input
        if (!title || !date || !time) {
          return res.status(400).json({ error: 'Title, date, and time are required' });
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


    app.get('/events', async (req: Request, res: Response) => {
      try {
        const events = await eventCollection.find({ archived: false }).toArray();

        if (!events || events.length === 0) {
          return res.status(404).json({ message: 'No events found.' });
        }

        events.sort((a, b) => {
          const dateA = new Date(`${a.date}T${a.time}:00`);
          const dateB = new Date(`${b.date}T${b.time}:00`);
          return dateA.getTime() - dateB.getTime();
        });

        res.status(200).json({
          message: 'Events fetched successfully.',
          data: events
        });

      } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Internal server error.' });
      }
    });

    app.put('/events/:id', async (req: Request, res: Response) => {
      const { id } = req.params;
      console.log(id)
      console.log(req.body)
    

      try {
        const result = await eventCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set:req.body }
        );

        if (result.matchedCount === 0) {
          return res.status(404).json({ error: 'Event not found' });
        }

        res.json({ message: 'Event archived successfully' });
      } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

