export interface IAppDBConnection {
  dbUri: string;
  dataDBname: string;
  logDBname: string;
  dataDbConnectionName: string;
  logDbConnectionName: string;
}

export const AppDBconnection: IAppDBConnection = {
  dbUri:
    'mongodb://mrdjaney:smederevo026@localhost:27888/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false',
  dataDBname: 'spendzi-mongo-db',
  logDBname: 'spendzi-log-db',
  dataDbConnectionName: 'DATA_DB',
  logDbConnectionName: 'LOG_DB',
};
