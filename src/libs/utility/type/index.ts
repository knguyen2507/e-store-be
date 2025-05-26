import { Readable } from 'stream';
import { LogLevelEnum } from '../enum';

export type FileUpload = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  stream: Readable;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
};

export type LogType = {
  id: string;
  messageId: string;
  level: LogLevelEnum;
  timeStamp: Date;
  eventName: string;
  message: string;
  data: any;
};

export type PIC = {
  id: string;
  username: string;
  at: Date;
};
