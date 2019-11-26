import { Document } from 'mongoose';

export interface IComment {
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
  events: Event[];
};

export interface IEvent {
  // make id optional to include new events that do not have an ID yet
  geometry: GeoJSON.Point;
  radius?: number;
  category?: string;
  title: string;
  body?: string;
  img?: string;
  // createdBy: DBUser;
  creationDate: Date;
  comments: IComment[];
};

// extend IEvent & IUser interfaces for using them in DB
export interface IEventDocument extends IEvent, Document {};
export interface IUserDocument extends IUser, Document {};
