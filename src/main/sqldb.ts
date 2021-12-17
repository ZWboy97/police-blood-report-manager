/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import sqlite3 from 'sqlite3';
import path from 'path';
import electron from 'electron';

export default class Dao {
  dbObj: sqlite3.sqlite3;

  dataBase: sqlite3.Database;

  constructor() {
    this.dbObj = sqlite3.verbose();
    const dbPath = path.join(
      path.dirname(electron.app.getPath('exe')),
      'sqldb.db'
    );
    this.dataBase = new this.dbObj.Database(dbPath, (err: Error | null) => {
      if (err) {
        console.log('Sqlite Database creation error', { err });
      }
    });
  }

  initDataBase = () => {
    this.dataBase.serialize(() => {
      this.dataBase.run(
        'CREATE TABLE IF NOT EXISTS t_blood_record' +
          ' (' +
          'id TEXT NOT NULL PRIMARY KEY , ' +
          'box_id TEXT NOT NULL , ' +
          'drawer_id TEXT NOT NULL , ' +
          'create_time TEXT NOT NULL ' +
          ');'
      );
      this.dataBase.run(
        'CREATE TABLE IF NOT EXISTS t_sys_setting (back_up_path TEXT );'
      );
      this.dataBase.run(
        'CREATE INDEX IF NOT EXISTS box_index on t_blood_record(box_id);'
      );
      this.dataBase.on('trace', (sql) => {
        console.log({ sql });
      });
    });
  };

  insertRecord = (
    id: string,
    boxId: string,
    drawerId: string,
    callback: (res: sqlite3.RunResult, err: Error) => void
  ) => {
    const date = new Date();
    const timestamp = (date.getTime() / 1000).toString();
    this.dataBase.run(
      `INSERT INTO t_blood_record VALUES( '${id}' , '${boxId}' , '${drawerId}' , '${timestamp}' )`,
      (err: Error, res: sqlite3.RunResult) => {
        console.log({ res }, { err });
        callback(res, err);
      }
    );
  };

  queryByRecordId = (
    id: string,
    callback: (res: sqlite3.RunResult, err: Error) => void
  ) => {
    const sqlstr = `SELECT * FROM t_blood_record WHERE id = '${id}' `;
    this.dataBase.get(sqlstr, (err: Error, res: any) => {
      console.log({ res }, { err });
      if (err || res === undefined) {
        callback(res, err);
      } else {
        const querySeqSqlStr = `
        SELECT COUNT(*) AS seq FROM t_blood_record 
        WHERE box_id = '${res.box_id}' 
        AND drawer_id = '${res.drawer_id}' 
        AND create_time <= '${res.create_time}'`;
        this.dataBase.get(querySeqSqlStr, (error: Error, result: any) => {
          console.log({ result }, { error });
          if (error) {
            callback(result, error);
          } else {
            callback({ ...res, ...result }, error);
          }
        });
      }
    });
  };

  queryAllRecordInDrawer = (
    box_id: string,
    drawer_id: string,
    callback: (res: sqlite3.RunResult, err: Error) => void
  ) => {
    this.dataBase.all(
      `Select * FROM t_blood_record 
      WHERE box_id = '${box_id}' 
      AND drawer_id = '${drawer_id}' 
      ORDER BY create_time DESC`,
      (err: Error, res: sqlite3.RunResult) => {
        console.log({ res }, { err });
        callback(res, err);
      }
    );
  };

  deleteByRecordId = (
    id: string,
    callback: (res: sqlite3.RunResult, err: Error) => void
  ) => {
    this.dataBase.run(
      `DELETE FROM t_blood_record WHERE id = '${id}'`,
      (err: Error, res: sqlite3.RunResult) => {
        console.log({ res }, { err });
        callback(res, err);
      }
    );
  };

  getBackUpPathSetting = (
    callback: (res: sqlite3.RunResult, err: Error) => void
  ) => {
    this.dataBase.get(
      `SELECT back_up_path FROM t_sys_setting`,
      (err: Error, res: sqlite3.RunResult) => {
        console.log({ res }, { err });
        callback(res, err);
      }
    );
  };

  updateBackUpPathSetting = (
    newPath: string,
    callback: (res: sqlite3.RunResult, err: Error) => void
  ) => {
    this.dataBase.serialize(() => {
      this.dataBase.run(
        `DELETE FROM t_sys_setting`,
        (err: Error, res: sqlite3.RunResult) => {
          console.log({ res }, { err });
        }
      );
      this.dataBase.run(
        `INSERT INTO t_sys_setting VALUES( '${newPath}' )`,
        (err: Error, res: sqlite3.RunResult) => {
          console.log({ res }, { err });
          callback(res, err);
        }
      );
    });
  };
}
