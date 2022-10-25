import { Injectable } from '@nestjs/common';
import { AppGateway } from 'src/app.gateway';
import DbHelper from 'src/db/chatdb-helper';
import { MessageDto, TopicDto } from 'src/model/chat.dto';
import { Message, Topic } from 'src/model/chat.model';

@Injectable()
export class ChatService {

  constructor(private readonly appGateway: AppGateway) {}
  
  async getTopics(): Promise<Topic []> {
    return new Promise(async (resolve, reject) => {
      try {
        const query = `SELECT * FROM topic ORDER BY id DESC;`;
        const topics = await DbHelper.selectAll(query) as Array<TopicDto>;
        resolve(topics.map(topic => { return this.transformToTopicObject(topic)}))
      } catch (error) {
        reject('Error: Can not get topics.');
      }
    });
  }

  async getTopicByUser(userId: number): Promise<Topic []> {
    return new Promise( async (resolve, reject) => {
      if (isNaN(userId)) reject('User id must be a number.');
      try {        
        const query = `SELECT * FROM topic WHERE user_id = ${userId} ORDER BY id DESC`;
        const topics = await DbHelper.selectAll(query) as Array<TopicDto>;
        resolve(topics.map(topic => { return this.transformToTopicObject(topic)}));
      } catch (error) {
        reject('Error: Can not get topics');
      }
    });
  }

  async getTopicById(topicId: number): Promise<Topic> {
    return new Promise( async (resolve, reject) => {
      if (isNaN(topicId)) reject('Topic id must be a number.');
      try {
        const query = `SELECT * FROM topic WHERE id = ${topicId}`
        const topic = await DbHelper.getOneElement(query) as TopicDto;
        if (!topic) reject('Error: Topic not found');
        resolve(this.transformToTopicObject(topic));
      } catch (error) {
        reject('Error: Can not get topics')
      }
    });
  }

  async addTopic(topic: Topic): Promise<Topic []> {
    return new Promise(async (resolve, reject) => {
      if (!topic) reject('Invalid topic');
      try {
        const { userId, title, author } = topic;
        const createdAt = this.geTimesTamp();
        const updatedAt = createdAt;
        const query = `INSERT INTO topic (user_id, title, author, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?);`;
        const dbRes = await DbHelper.insertInto(query, [userId.toString(), title, author, createdAt, updatedAt]);
        resolve(dbRes);
      } catch (error) {
        reject('Error: Cannot create topic');
      }
    });
  }

  async updateTopic(topicId: number, topic: Topic): Promise<Topic> {
    return new Promise(async (resolve, reject) => {
      if (isNaN(topicId)) reject('Topic id must be a number.');
      try {
        const currentTopic = await this.getTopicById(topic.id);
        if (!currentTopic.id) reject('Topic not found.');

        const title = topic.title;
        const updatedAt = this.geTimesTamp();
        const query = `UPDATE topic SET title ='${title}', updatedAt = '${updatedAt}'
                      WHERE id = ${topic.id} AND author ='${topic.author}';`;
        const dbRes = await DbHelper.update(query);
        if (!dbRes) reject('Cannot update topic');
        resolve(topic);
      } catch (error) {
        reject('Cannot update topic');
      }
    });
  }

  async delteTopic(topicId: number, username): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      if (isNaN(topicId)) reject('Topic id must be a number.');
      // try {
      //   const currentTopic = await this.getTopicById(topic.id);
      //   if (!currentTopic.id) reject('Topic not found.');

      //   const topics = await this.getTopics();
      //   const index = topics.indexOf(topicToDelete);
      //   if (index < 0) reject('Topic not found');
      //   topics.splice(index, 1);
      //   const topicsString = JSON.stringify(topics);
      //   fs.writeFileSync(this.topicDb, topicsString);
      //   resolve(true);
      // } catch (error) {
      //   reject('Cannot update topic');
      // }
      // TODO Supprimer aussi les messages qui corresponds à ce topic.
    });
  }
  
  async getMessages(): Promise<Message []> {
    return new Promise(async (resolve, reject) => {
      try {
        const query = `SELECT * FROM message ORDER BY id DESC;`;
        const messages = await DbHelper.selectAll(query) as Array<Message>;
        resolve(messages)
      } catch (error) {
        reject('Error: Can not get messages.');
      }
    });
  }

  async getMessagesByTopic(topicId: number): Promise<Message []> {
    return new Promise( async (resolve, reject) => {
      if (isNaN(topicId)) reject('Topic id must be a number.');
      try {
        const query = `SELECT * FROM message WHERE topic_id=${topicId} ORDER BY id ASC;`;
        const dbMessages = await DbHelper.selectAll(query) as Array<MessageDto>;
        const messages = dbMessages.map(msg => { return this.transformToMessagesObject(msg)});
        resolve(messages)
      } catch (error) {
        reject('Error: Can not get messages.');
      }
    });
  }

  async sendMessage(message: Message): Promise<Message> {
    return new Promise(async (resolve, reject) => {  
      if (!message) reject('Invalid messge');
      try {
        const { userId, topicId,content, author} = message;
        const createdAt = this.geTimesTamp();
        const query = `INSERT INTO message (user_id, topic_id, content, author, createdAt) VALUES (?, ?, ?, ?, ?)`;
        const dbRes = await DbHelper.insertInto(query, [userId.toString(), topicId.toString(),content, author, createdAt]);
        if (!dbRes) reject('Cannot send message');

        this.appGateway.server.emit('messageToClient', message);
        resolve(message);
      } catch (error) {
        reject('Cannot send message');
      }
    });
  }

  private geTimesTamp(): string {
    try {
      return new Date().getTime().toString();
    } catch (error) {
      return ''; 
    }
  }

  transformToTopicObject(dbTopic: TopicDto): Topic {
    return {
      id: dbTopic?.id,
      title: dbTopic?.title,
      author: dbTopic?.author,
      userId: dbTopic?.user_id,
      createdAt: dbTopic?.createdAt,
      updatedAt: dbTopic?.updatedAt
    };
  }
  transformToMessagesObject(dbMessage: MessageDto): Message {
    return {
      id: dbMessage?.id,
      content: dbMessage?.content,
      author: dbMessage?.author,
      topicId: dbMessage?.topic_id,
      userId: dbMessage?.user_id,
      createdAt: dbMessage?.createdAt
    }
  }
}
