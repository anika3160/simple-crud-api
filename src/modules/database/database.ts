import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import { isValidName, isValidAge, isValidHobbies } from './validators.js';
import read from './read.js';
import write from './write.js';

interface IUser {
    readonly id: string,
    username: string,
    age: number,
    hobbies: string[],
}

export const getUserById = (id: string, users: any[]):IUser|undefined => users.find(user => user.id === id);

export const createOrUpdateUser = (username: any, age: any, hobbies: any, id?: any):IUser => {
    if ((!id || uuidValidate(id)) 
        && isValidName(username)
        && isValidAge(age)
        && isValidHobbies(hobbies)) {
        return ({ id: id ? id : uuidv4(), username, age, hobbies })
    }
    throw new Error('Incorrect data. Please try again with correct data.')
}

export const getListOfUsers = async () => {
    const data: string = await read();
    const users: IUser[] = JSON.parse(data).users;
    return users;
}
 
export const updateUsersData = async (users:IUser[]) => {
    await write(JSON.stringify({users}));
}