import http from 'k6/http';
import { sleep } from 'k6';
import { uuidv4 } from "https://jslib.k6.io/k6-utils/1.0.0/index.js";
import { URL } from 'https://jslib.k6.io/url/1.0.0/index.js';

export let options = {
  vus: 3,
  duration: '5s',
};

const baseURL = "http://localhost:10000/todo"

export default function () {
  getAllToDo();
  sleep(1);

  if (Math.random() < 0.8) { // 80% chance to also create a new ToDo
    var newID = createNewRandomToDo();
    sleep(1);

    if (Math.random() < 0.5) { // 50% chance to delete newly created ToDo
      deleteToDoByID(newID);
      sleep(1);
    }
  }
}

function getAllToDo() {
  http.get(baseURL);
}

function createNewRandomToDo() {
  const summary = uuidv4();
  const url = new URL(baseURL);

  url.searchParams.append('summary', summary);

  console.log(`Generating new ToDo with summary: ${summary}`)
  const res = http.post(url.toString());

  var newID = res.json().ID
  console.log(`Generated new ToDo with ID ${newID}`)

  return newID
}

function deleteToDoByID(id) {
  const url = new URL(baseURL);

  url.searchParams.append('id', id);

  console.log(`Deleting ToDo with ID ${id}`)
  http.del(url.toString());
}
