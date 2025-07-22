"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongodb_1 = require("mongodb");
const app = (0, express_1.default)();
const port = 3000;
const cors = require("cors");
app.use(express_1.default.json());
app.use(cors());
require("dotenv").config();
app.get('/', (req, res) => {
    res.send("hello");
});
app.listen(port, () => {
    console.log(`Connected successfully on port ${port}`);
});
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster.ia0ielx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new mongodb_1.MongoClient(uri, {
    serverApi: {
        version: mongodb_1.ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
function categorizeEvent(title, notes) {
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
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Connect the client to the server	(optional starting in v4.7)
            // Send a ping to confirm a successful connection
            const eventCollection = client.db("event-scheduler").collection('events');
            app.post('/events', (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { title, date, time, notes } = req.body;
                    console.log('Request Body:', req.body);
                    // Validate input
                    if (!title || !date || !time) {
                        return res.status(400).json({ error: 'Title, date, and time are required' });
                    }
                    const event = {
                        title,
                        date,
                        time,
                        notes,
                        category: categorizeEvent(title, notes),
                        archived: false,
                    };
                    const result = yield eventCollection.insertOne(event);
                    res.status(201).json(Object.assign(Object.assign({}, event), { _id: result.insertedId }));
                }
                catch (error) {
                    console.error('Error creating event:', error);
                    res.status(500).json({ error: 'Server error' });
                }
            }));
            app.get('/events', (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const events = yield eventCollection.find().toArray();
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
                }
                catch (error) {
                    console.error('Error fetching events:', error);
                    res.status(500).json({ error: 'Internal server error.' });
                }
            }));
            app.put('/events/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
                const { id } = req.params;
                console.log(id);
                console.log(req.body);
                try {
                    const result = yield eventCollection.updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: req.body });
                    if (result.matchedCount === 0) {
                        return res.status(404).json({ error: 'Event not found' });
                    }
                    res.json({ message: 'Event archived successfully' });
                }
                catch (error) {
                    console.error('Error updating event:', error);
                    res.status(500).json({ error: 'Internal Server Error' });
                }
            }));
            app.delete('/events/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
                const { id } = req.params;
                try {
                    const result = yield eventCollection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
                    if (result.deletedCount === 1) {
                        res.status(200).json({ message: `Event with id ${id} deleted successfully.` });
                    }
                    else {
                        res.status(404).json({ message: `Event with id ${id} not found.` });
                    }
                }
                catch (error) {
                    console.error('Error deleting event:', error);
                    res.status(500).json({ message: 'Internal server error' });
                }
            }));
            yield client.connect();
            yield client.db("admin").command({ ping: 1 });
            console.log("Pinged your deployment. You successfully connected to MongoDB!");
        }
        finally {
            // Ensures that the client will close when you finish/error
            // await client.close();
        }
    });
}
run().catch(console.dir);
