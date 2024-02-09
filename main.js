// read database, on reçoit un string (JSON.string) du coup faut faire parse pour recup l Array normal

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
// let index = 0;
let id;
if (tasks.length > 0) {
  id = parseInt(tasks[(tasks.length-1)].id);
} else {
  id = 0;
}

function insertListItem(task) {
  // ['run', 'cook', 'clean']
  // [{id:1, description: 'run'}, {id:2, description: 'cook'}, {id:3, description: 'clean'}]
  const liContent = document.createElement("div");
  liContent.style.display = "flex";
  liContent.style.gap = "10px";

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "button-delete";
  deleteBtn.innerText = "delete";

  const liElement = document.createElement("li");
  liElement.innerHTML = task.description;
  liElement.setAttribute('task-id', task.id);

  liContent.appendChild(liElement);
  liContent.appendChild(deleteBtn);

  document.getElementById("tasks").appendChild(liContent);
  console.log({liContent});
  deleteBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const buttonClicked = e.target;
    const liElementAssociated = buttonClicked.previousSibling;
    const liElementAssociatedId = liElementAssociated.getAttribute('task-id');
    // e.target.previousSibling.getAttribute("task-id") (meme chose)

    // tasks = tasks.filter((task) => task.id != liElement.getAttribute('task-id'));
    tasks = tasks.filter((task) => {
      console.log({task, liElementAssociatedId});
      return task.id != liElementAssociatedId
    });
    // add to local storage, update aussi
    localStorage.setItem("tasks", JSON.stringify(tasks));
    // liContent.remove();
    buttonClicked.parentNode.remove();
  })
}

// insert tasks into DOM
tasks.forEach((task) => {
  insertListItem(task);
})

const form = document.querySelector("form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(e)
  // select input text
  const taskInput = document.getElementById("task-input").value;
  // verifier si input est vide
  id++;

  const task = {id: id, description: taskInput};
  if (taskInput.trim() !== "") {
    insertListItem(task);

    // iteract with li
    tasks = [];
    document.querySelectorAll("li").forEach((item) => {
      tasks.push({id: item.getAttribute('task-id') , description: item.innerHTML});
    });
    // add to local storage, update aussi
    localStorage.setItem("tasks", JSON.stringify(tasks));
    // localStorage.setItem("tasks", ["cook", "compras", "lavar roupas"]);
  }
})
