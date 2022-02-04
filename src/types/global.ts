import { Document } from "mongoose";

export enum ActivationStatus {
  Active = "ACTIVE",
  DELETED = "DELETED",
}

export interface Dictionary<T = any> {
  [key: string]: T;
}

export enum UserTypes {
  Employee = "EMPLOYEE",
  Manager = "MANAGER",
}

export type EntityDocument<T> = T & Document;
