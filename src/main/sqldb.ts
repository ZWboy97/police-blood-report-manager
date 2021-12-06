/* eslint-disable no-console */
import sqlite3 from 'sqlite3';
import path from 'path';
import electron from 'electron';

export default class Dao {
  dbObj: sqlite3.sqlite3;

  dataBase: sqlite3.Database;

  constructor() {
    this.dbObj = sqlite3.verbose();
    const dbPath = path.join(electron.app.getPath('appData'), 'sqldb.db');
    this.dataBase = new this.dbObj.Database(dbPath);
  }

  initDataBase = () => {
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
      'CREATE INDEX IF NOT EXISTS box_index on t_blood_record(box_id);'
    );
    this.dataBase.on('trace', (sql) => {
      console.log({ sql });
    });
  };

  insertRecord = (
    id: string,
    boxId: string,
    drawerId: string,
    callback: (res: sqlite3.RunResult, err: Error) => void
  ) => {
    const date = new Date();
    const timestamp = date.getTime().toString();
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
    this.dataBase.get(sqlstr, (err: Error, res: sqlite3.RunResult) => {
      console.log({ res }, { err });
      callback(res, err);
    });
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
}
