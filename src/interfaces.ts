import { Document } from 'mongoose';
import { ObjectId } from 'bson';

export interface IComment {
  id?: string | object | ObjectId;
  user: IUser;
  message: string;
  postedOn: Date;
}

export interface IUser {
  email: string;
  username?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  password?: string;
  events: IEvent[] | IEventDocument[];
};

export interface IEvent {
  // make id optional to include new events that do not have an ID yet
  geometry: GeoJSON.Point;
  category?: string;
  title: string;
  body?: string;
  img?: string;
  createdBy: IUser | IUserDocument;
  creationDate: Date;
  comments: IComment[];
};

// extend IEvent & IUser interfaces for using them in DB
export interface IEventDocument extends IEvent, Document {};
export interface IUserDocument extends IUser, Document {};
