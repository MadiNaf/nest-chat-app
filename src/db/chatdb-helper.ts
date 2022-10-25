import { db } from 'src/main';

export default abstract class DbHelper {

  public static selectAll(query: string): Promise<any> {
    return new Promise((resolve, reject) => {
      db.all(query, (err, rows) =>  {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }

  public static insertInto(query: string, values: Array<string>): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        db.run(query, values);
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }

  public static update(query: string): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        db.run(query);
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }

  public static getOneElement(query: string): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        db.get(query, (error, row) => {
          if(error) reject(error);

          resolve(row);
        });
      } catch (error) {
        reject(error);
      }
    });
  }


  public static deleteElement(query: string): void {
    // TODO
  }

}