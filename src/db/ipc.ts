import { IPCMessageType, IUser } from "../types/constants.js";

export function getUsersIPC(): Promise<IUser[]> {
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

export function setUsersIPC(users: IUser[]): void {
  process.send?.({ type: "setUsers", users });
}
