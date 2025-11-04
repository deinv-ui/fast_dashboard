import axios from "axios";

//define a interface for object
//Any object of type Random User must have these properties
export interface User {
  name: { first: string; last: string };
  phone: string;
  gender: string;
  email:  string;
  login: { uuid: string };
  picture: { thumbnail: string, large: string };
  location: { country: string };
}
// async function fetchUsers() : Promise<RandomUser[]>
// this async function will return an array of user object
export async function fetchUsers(count = 1000): Promise<User[]> {
    const { data } = await axios.get(`https://randomuser.me/api/?results=1000`);
    return data.results;
}
