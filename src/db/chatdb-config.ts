import { db } from 'src/main';

export default function initChatDataBase() {

  db.serialize(() => {
    const queryUser = `CREATE TABLE IF NOT EXISTS user (
      id INT PRIMARY KEY,
      firstname VARCHAR(100),
      lastname VARCHAR(100),
      username VARCHAR(100) NOT NULL,
      password VARCHAR(255) NOT NULL,
      token VARCHAR(255),
      PRIMARY KEY("id" AUTOINCREMENT)
    );`;
    db.run(queryUser);

    const querySession = `CREATE TABLE IF NOT EXISTS chat_session (
      id INT PRIMARY KEY,
      user_id INT NOT NULL,
      username VARCHAR(100),
      FOREIGN KEY (user_id) REFERENCES user(id),
      PRIMARY KEY("id" AUTOINCREMENT)
    );`;
    db.run(querySession);

    const queryTopic = `CREATE TABLE IF NOT EXISTS topic (
      id INT PRIMARY KEY,
      user_id INT NOT NULL,
      title VARCHAR(100) NOT NULL,
      author VARCHAR(100),
      createdAt VARCHAR(100),
      updatedAt VARCHAR(100),
      FOREIGN KEY (user_id) REFERENCES user(id),
      PRIMARY KEY("id" AUTOINCREMENT)
    );`;
    db.run(queryTopic);

    const queryMessage = `CREATE TABLE IF NOT EXISTS message (
      id INT PRIMARY KEY,
      user_id INT NOT NULL,
      topic_id INT NOT NULL,
      content VARCHAR(100) NOT NULL,
      author VARCHAR(100),
      createdAt VARCHAR(100),
      FOREIGN KEY (user_id) REFERENCES user(user_id),
      FOREIGN KEY (topic_id) REFERENCES topic(id),
      PRIMARY KEY("id" AUTOINCREMENT)
    );`;
    db.run(queryMessage);

  });
}