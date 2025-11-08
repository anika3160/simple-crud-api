import { v4 as uuidv4, validate as uuidValidate } from "uuid";
import { IUser } from "../types/constants.js";
import { isValidAge, isValidHobbies, isValidUsername } from "../utils/validators.js";
import { getUsersIPC, setUsersIPC } from "./ipc.js";

export const db: IUser[] = [];
const isClusterWorker = !!process.send;

export const getUserById = (id: string, users: IUser[]): IUser | undefined =>
  users.find((user) => user.id === id);

export const createUser = (username: string, age: number, hobbies: string[]): IUser => {
  if (isValidUsername(username) && isValidAge(age) && isValidHobbies(hobbies)) {
    return { id: uuidv4(), username, age, hobbies };
  }
  throw new Error("Incorrect data. Please try again with correct data.");
};

export const updateUser = (username: string, age: number, hobbies: string[], id: string): IUser => {
  if (uuidValidate(id) && isValidUsername(username) && isValidAge(age) && isValidHobbies(hobbies)) {
    return { id, username, age, hobbies };
  }
  throw new Error("Incorrect data. Please try again with correct data.");
};

export const getUsersList = async () => {
  if (isClusterWorker) {
    console.log("Fetching users via IPC...");
    return await getUsersIPC();
  }
  return db;
};

export const updateUsersData = async (users: IUser[]) => {
  if (isClusterWorker) {
    setUsersIPC(users);
    return;
  }
  db.length = 0;
  db.push(...JSON.parse(JSON.stringify(users)));
  return;
};
