/* eslint-disable */
import http from "http";
import { validate as uuidValidate } from "uuid";
import { createUser, getUserById, getUsersList, updateUser, updateUsersData } from "../db/db.js";
import { BASE_USERS_URL, ContentType, IUser, Method } from "../types/constants.js";
import { sendResponse, readJsonData } from "../utils/helpers.js";

const createUsersServer = () =>
  http.createServer(async (req, res) => {
    let users: IUser[] = await getUsersList();
    try {
      console.log(`Server request ${req.url} ${req.method}`);

      const routesEl: string[] | undefined = req.url?.split("/");
      if (req.url === BASE_USERS_URL) {
        switch (req.method) {
          case Method.get: {
            sendResponse(res, 200, ContentType.json, users);
            break;
          }
          case Method.post: {
            readJsonData(req)
              .then((dataFromReq) => {
                try {
                  const newUser: IUser = createUser(
                    dataFromReq?.username,
                    dataFromReq?.age,
                    dataFromReq?.hobbies,
                  );
                  users.push(newUser);
                  updateUsersData([...users]);
                  sendResponse(res, 201, ContentType.json, newUser);
                } catch (error: any) {
                  sendResponse(res, 400, ContentType.text, error.message);
                }
              })
              .catch((error) => {
                sendResponse(res, 400, ContentType.text, error.message);
              });
            break;
          }
          default:
            sendResponse(res, 500, ContentType.text, "Method deprecated.");
            break;
        }
      } else if (req.url?.indexOf(BASE_USERS_URL + "/") === 0 && routesEl?.length === 4) {
        const isValidId = uuidValidate(routesEl[3]);
        const currentUser = getUserById(routesEl[3], users);

        if (isValidId) {
          if (currentUser) {
            switch (req.method) {
              case Method.get: {
                sendResponse(res, 200, ContentType.json, currentUser);
                break;
              }
              case Method.put: {
                readJsonData(req)
                  .then((dataFromReq) => {
                    try {
                      const newUserData: IUser = updateUser(
                        dataFromReq?.username,
                        dataFromReq?.age,
                        dataFromReq?.hobbies,
                        routesEl[3],
                      );
                      users = users.filter((user) => user.id !== routesEl[3]);
                      users.push(newUserData);
                      updateUsersData(users);
                      sendResponse(res, 200, ContentType.json, newUserData);
                    } catch (error: any) {
                      sendResponse(res, 400, ContentType.text, error.message);
                    }
                  })
                  .catch((error) => {
                    sendResponse(res, 400, ContentType.text, error.message);
                  });
                break;
              }
              case Method.delete: {
                users = users.filter((user) => user.id !== routesEl[3]);
                updateUsersData(users);
                sendResponse(res, 204, ContentType.text);
                break;
              }
              default:
                sendResponse(res, 500, ContentType.text, "Method deprecated.");
                break;
            }
          } else {
            sendResponse(
              res,
              404,
              ContentType.text,
              `Record with ${routesEl[3]} === userID doesn't exist`,
            );
          }
        } else {
          sendResponse(res, 400, ContentType.text, "User id is invalid (not uuid).");
        }
      } else {
        sendResponse(res, 404, ContentType.text, "Unknown URL.");
      }
    } catch (error: any) {
      sendResponse(res, 500, ContentType.text, error.message);
    }
  });

export default createUsersServer;
