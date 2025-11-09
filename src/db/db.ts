import { v4 as uuidv4, validate as uuidValidate } from "uuid";
import { IUser } from "../types/constants.js";
import { isValidAge, isValidHobbies, isValidUsername } from "../utils/validators.js";
import { getUsersIPC, setUsersIPC } from "./ipc.js";

const db: IUser[] = [];

const isClusterWorker = typeof process.send === "function" && !process.env.JEST_WORKER_ID;

export const getUserById = (id: string, users: IUser[]): IUser | undefined =>
  users.find((user) => user.id === id);

export const createUser = (username: string, age: number, hobbies: string[]): IUser => {
  if (isValidUsername(username) && isValidAge(age) && isValidHobbies(hobbies)) {
    return { id: uuidv4(), username, age, hobbies: [...hobbies] };
  }
  throw new Error("Incorrect data. Please try again with correct data.");
};

export const updateUser = (username: string, age: number, hobbies: string[], id: string): IUser => {
  if (uuidValidate(id) && isValidUsername(username) && isValidAge(age) && isValidHobbies(hobbies)) {
    return { id, username, age, hobbies: [...hobbies] };
  }
  throw new Error("Incorrect data. Please try again with correct data.");
};

export const getUsersList = async () => {
  if (isClusterWorker) {
    return await getUsersIPC();
  }
  return db.map((user) => ({ ...user, hobbies: [...user.hobbies] }));
};

export const updateUsersData = (users: IUser[]): void => {
  if (isClusterWorker) {
    setUsersIPC(users);
    return;
  }
  db.length = 0;
  for (const user of users) {
    db.push({ ...user, hobbies: [...user.hobbies] });
  }
  return;
};
