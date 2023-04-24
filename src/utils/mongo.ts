import { MongoClient } from 'mongodb';
import config from './config';

export default async function testConnection() {
  const m = new MongoClient(config.mongo_url);
  await m.connect();
  await m.close();
}
