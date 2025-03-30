import { MongoClient } from 'mongodb'
import { serialize } from 'cookie'

export default async function handler(req, res) {
  const client = await MongoClient.connect(process.env.MONGODB_URI)
  const db = client.db()
  
  if (req.method === 'POST') {
    // 验证密码
    if (!req.cookies.auth || req.cookies.auth !== process.env.SITE_PASSWORD) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    // 获取真实IP（适配Vercel部署）
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    
    const message = {
      text: req.body.text,
      ip: ip.split(',')[0].trim(), // 处理多级代理情况
      createdAt: new Date()
    }

    await db.collection('messages').insertOne(message)
    return res.status(201).json(message)
  }

  if (req.method === 'GET') {
    const messages = await db.collection('messages')
      .find()
      .sort({ createdAt: -1 })
      .toArray()
    
    return res.status(200).json(messages)
  }

  client.close()
        }
