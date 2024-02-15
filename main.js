// read database, on reçoit un string (JSON.string) du coup faut faire parse pour recup l Array normal

let databaseTasks = JSON.parse(localStorage.getItem("tasks")) || [];
let tasks = databaseTasks.map((task) => {
  task.id = parseInt(task.id);
  return task;
});

function insertListItem(task) {
  // ['run', 'cook', 'clean'] --> [{id:1, description: 'run'}, {id:2, description: 'cook'}, {id:3, description: 'clean'}]
  const liContent = document.createElement("div");
  liContent.className = "content-list";

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = task.done;

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "button-delete";
  deleteBtn.innerText = "delete";

  const liElement = document.createElement("li");
  liElement.innerHTML = task.description;
  liElement.setAttribute("task-id", task.id);

  liContent.appendChild(checkbox);
  liContent.appendChild(liElement);
  liContent.appendChild(deleteBtn);

  if (checkbox.checked) {
    const tasksDone = document.getElementById("tasks-done");
    tasksDone.appendChild(liContent);
  } else {
    const tasksList = document.getElementById("tasks");
    tasksList.appendChild(liContent);
  }

  checkbox.addEventListener("change", (e) => {
    const clickedTaskId = parseInt(e.target.nextSibling.getAttribute("task-id"));
    if (checkbox.checked) {
      const tasksDone = document.getElementById("tasks-done");
      tasksDone.appendChild(liContent);
    } else {
      const tasksList = document.getElementById("tasks");
      tasksList.appendChild(liContent);
    }
    tasks.filter((task) => {
      if (task.id === clickedTaskId) {
        task.done = e.target.checked;
      }
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  })

  // event listener in <li> when clicked to change the text
  liElement.addEventListener("click", (e) => {
    liElement.contentEditable = true;

    // si key est cliquée -> contentEditable desactivé, on garde les infos dans la localSto
    window.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        liElement.contentEditable = false;

        const clickedTaskId = parseInt(event.target.getAttribute("task-id"));
        tasks.filter((task) => {
          if (task.id === clickedTaskId) {
            task.description = event.target.innerText;
          }
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
      }
    })
  })

  // document.getElementById("tasks").appendChild(liContent);
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
      return task.id != liElementAssociatedId;
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
  // select input text + verifier si input est vide
  let taskInput = document.getElementById("task-input").value;
  // const checkboxChecked = document.querySelector("input[type='checkbox']").checked;
  // clear the input
  document.getElementById("task-input").value = "";
  // id++;
  let id;
  if (tasks.length > 0) {
    // tasks[(tasks.length-1)].id > le dernier index de tasks, donc dernier element ajouté
    // id = parseInt(tasks[(tasks.length-1)].id);
    let lastIndexDeTasks = (tasks.length - 1);
    let idOfLastTask = tasks[lastIndexDeTasks].id;
    id = parseInt(idOfLastTask) + 1;
  } else {
    id = 0;
  }

  if (taskInput.trim() !== "") {
    taskInput = taskInput.charAt(0).toUpperCase() + taskInput.slice(1);
    const task = {id: id, description: taskInput, done: false};
    insertListItem(task);

    // iteract with li
    tasks = [];
    document.querySelectorAll("li").forEach((item) => {
      tasks.push({id: parseInt(item.getAttribute("task-id")), description: item.innerHTML, done: item.previousSibling.checked});
      // document.querySelector("li").previousSibling.checked
    });
    // sort de petit a grand pour pas que les index se melangent et cause pb
    tasks.sort((a, b) => a.id - b.id);
    // add to local storage, update aussi
    localStorage.setItem("tasks", JSON.stringify(tasks));
    // localStorage.setItem("tasks", ["cook", "compras", "lavar roupas"]);
  }
})
