import { MongoClient } from 'mongodb'
import config from '../config/mongodb'

export const client = new MongoClient(config.url, { useNewUrlParser: true, useUnifiedTopology: true })
client.connect()
