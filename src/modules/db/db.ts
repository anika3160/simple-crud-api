import { v4 as uuidv4, validate as uuidValidate } from "uuid";
import { IPCMessageType, IUser } from "../../types/constants.js";
import { isValidAge, isValidHobbies, isValidUsername } from "./validators.js";

export const db: IUser[] = [];
const isClusterWorker = !!process.send;

function getUsersIPC(): Promise<IUser[]> {
  return new Promise((resolve) => {
    process.send?.({ type: IPCMessageType.GetUsers });
    const handler = (msg: any) => {
      if (msg.type === IPCMessageType.SetUsers) {
        process.off("message", handler);
        resolve(msg.users);
      }
    };
    process.on("message", handler);
  });
}

function setUsersIPC(users: IUser[]): void {
  process.send?.({ type: "setUsers", users });
}

export const getUserById = (id: string, users: IUser[]): IUser | undefined =>
  users.find((user) => user.id === id);

export const createOrUpdateUser = (
  username: string,
  age: number,
  hobbies: string[],
  id?: string,
): IUser => {
  if (
    (!id || uuidValidate(id)) &&
    isValidUsername(username) &&
    isValidAge(age) &&
    isValidHobbies(hobbies)
  ) {
    return { id: id ?? uuidv4(), username, age, hobbies };
  }
  throw new Error("Incorrect data. Please try again with correct data.");
};

export const getListOfUsers = async () => {
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
