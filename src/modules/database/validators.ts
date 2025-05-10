export const isValidUsername = (username: unknown): username is string => {
  return typeof username === 'string' && username.trim() !== ''
}

export const isValidAge = (age: unknown): age is number => {
  return typeof age === 'number' && Number.isInteger(age) && age > 0
}

export const isValidHobbies = (hobbies: unknown): hobbies is string[] => {
  return Array.isArray(hobbies) && hobbies.every((hobby): hobby is string => typeof hobby === 'string')
}