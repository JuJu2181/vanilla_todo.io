// * Dom selectors
const todoInput = document.querySelector('#todo-input');
const todoButton = document.querySelector('#create-button');
const todoList = document.querySelector('.todo-list');
const categorySelect = document.querySelector('.category-select');
const clearButton = document.querySelector('.clear-btn');
const todoListTitle = document.querySelector('#todo-list-title');
// * Functions
// function to update todo title
const updateTodoTitle = (todos) => {
    todoListTitle.innerText = `todo list (${todos.length})`     
}

// function to create a todo
const createTodo = (e) => {
    // prevent default form action
    e.preventDefault();
    if (todoInput.value !== '') {
        // remove the existing text
        const todoText = document.querySelector('.empty-text');
        // console.log(todoText, typeof todoText);
        if (todoText !== null) {
            todoList.removeChild(todoText);
        }
        // create the todoDiv with the class todo
        const todoDiv = document.createElement('div');
        todoDiv.classList.add('todo');
        // adding created time
        const todoTime = document.createElement('p');
        const now = new Date();
        const hour = now.getHours();
        const minutes = now.getMinutes()>=10?now.getMinutes():`0${now.getMinutes()}`;
        todoTime.innerText = `${hour}:${minutes}`;
        todoTime.classList.add('created-time');
        todoDiv.appendChild(todoTime);
        // create the todo li with the class todo-item
        const todoItem = document.createElement('li');
        // the list will have text input as the inner text
        todoItem.innerText = todoInput.value;
        todoItem.classList.add('todo-item');
        // add the newly created todoItem inside the todo div
        todoDiv.appendChild(todoItem);
        // store the latest todo to local storage 
        saveTodoInLocal([todoTime.innerText,todoInput.value]);
        // clear the input in form after creating new todo
        todoInput.value = "";
        // creating the complete and delete buttons with respective classes and adding them to the todoDiv
        // complete button
        const completeButton = document.createElement("button");
        completeButton.classList.add('complete-btn');
        completeButton.innerHTML = '<i class="fas fa-check"></i>';
        // delete button
        const deleteButton = document.createElement("button");
        deleteButton.classList.add('delete-btn');
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>'
        // adding buttons to div
        todoDiv.appendChild(completeButton);
        todoDiv.appendChild(deleteButton);
        // add the created todoDiv to the todoList at the front
        todoList.prepend(todoDiv);
        // updateTodoTitle(todoList.childNodes);
        console.log("Todo created successfully");
    } else {
        console.log('No input given');
        alert('Please enter the todo to add it');
    }

}

// function to delete todos
const removeTodo = (e) => {
    const clickedItem = e.target;
    // console.log(clickedItem);
    // to remove the entire todo Tile when delete is pressed
    let todoTile = clickedItem.parentElement;
    // check if the clicked button is delete or edit button
    if (clickedItem.classList[0] === 'delete-btn') {
        console.log("delete button pressed");
        todoTile.classList.add("delete-animation");
        // when the delete animation completes we remove the todo Tile from the list
        todoTile.addEventListener("transitionend", e => {
            // console.log('Transition complete');
            // remove the todo from local storage 
            todoTile.remove();
        });
        console.log(`${todoTile.innerText} deleted`);
        removeTodoFromLocal(todoTile);
    }
    // check if complete button is pressed
    if (clickedItem.classList[0] === 'complete-btn') {
        todoTile.classList.toggle("complete-animation");
        console.log(todoTile.classList);
        if (todoTile.classList[1] === "complete-animation") {
            todoTile.childNodes[2].style.display = "none";
            todoTile.childNodes[3].style.display = "none";
        }
        removeTodoFromLocal(todoTile);
        console.log(`${todoTile.innerText} completed`);
    }

}

// function to filter the todos based on categories
const filterTodo = (e) => {
    // gets all the available todos
    const todos = todoList.childNodes;
    console.log(todos);
    todos.forEach(
        todo => {
            console.log(todo);
            // switching the categories with their values
            console.log(e.target.value);
            switch (e.target.value) {
                case "all":
                    // flex means default display
                    todo.style.display = "flex";
                    console.log("All category selected");
                    break;
                case "completed":
                    // we check this condition to show only those tiles with the class completed
                    if (todo.classList.contains("complete-animation")) {
                        todo.style.display = "flex";
                    } else {
                        todo.style.display = "none";
                    }
                    console.log("completed category selected");
                    break;
                case "pending":
                    // only get todos that are pending
                    if (!todo.classList.contains("complete-animation")) {
                        todo.style.display = "flex";
                    } else {
                        todo.style.display = "none";
                    }
                    console.log("Pending category selected");
                    break;
                default:
                    console.log("Error");
            }
        }
    );
}




// * Functions for local storage
// function to check if the todos exist in local storage or not
const checkLocalStorage = () => {
    let todos;
    // if no todos exist in local storage create an empty array to save todos
    if (localStorage.getItem('todos') === null) {
        todos = []
    } else {
        // if local storage consists of todos get all the todos and convert it into array from json string 
        todos = JSON.parse(localStorage.getItem('todos'));
    }
    return todos;
}

const checkForEmpty = (todos) => {
    console.log(todos.length);
    if (todos.length === 0) {
        const todoText = document.createElement('p');
        todoText.innerText = "You have 0 todos remaining. Add Items";
        todoText.classList.add('empty-text');
        todoList.prepend(todoText);
        return true;
    }
    return false;
}



// function to save in local storage 
const saveTodoInLocal = (todo) => {
    // check if local storage consists of todo or not 
    // let todos;
    let todos = checkLocalStorage();
    console.log(`Current Todo List: ${todos}`);
    // push the newly created todo into existing todos
    todos.unshift(todo);
    updateTodoTitle(todos);
    // finally convert the newly created todos array into json string and store it back in local storage by name of todos
    localStorage.setItem('todos', JSON.stringify(todos));
    console.log(`${todos} saved successfully to local storage`);
}

// function to get all the existing todos from local storage
const getTodosFromLocal = (todo) => {
    // let todos;
    let todos = checkLocalStorage();
    checkForEmpty(todos);
    updateTodoTitle(todos);
    todos.forEach(
        todo => {
            // recreate the todoDiv by using data from local storage
            // create the todoDiv with the class todo
            const todoDiv = document.createElement('div');
            todoDiv.classList.add('todo');
            // adding created time
            const todoTime = document.createElement('p');
            todoTime.innerText = todo[0];
            todoTime.classList.add('created-time');
            todoDiv.appendChild(todoTime);
            // create the todo li with the class todo-item
            const todoItem = document.createElement('li');
            // the list will have text input as the inner text
            todoItem.innerText = todo[1];
            todoItem.classList.add('todo-item');
            // add the newly created todoItem inside the todo div
            todoDiv.appendChild(todoItem);
            // complete button
            const completeButton = document.createElement("button");
            completeButton.classList.add('complete-btn');
            completeButton.innerHTML = '<i class="fas fa-check"></i>';
            // delete button
            const deleteButton = document.createElement("button");
            deleteButton.classList.add('delete-btn');
            deleteButton.innerHTML = '<i class="fas fa-trash"></i>'
            // adding buttons to div
            todoDiv.appendChild(completeButton);
            todoDiv.appendChild(deleteButton);
            // add the created todoDiv to the todoList 
            todoList.appendChild(todoDiv);
            console.log("Todo created successfully");
            }
    );
}



// function to remove todos from local storage when deleted
const removeTodoFromLocal = (todo) => {
    console.log(todo);
    let todos = checkLocalStorage();
    console.log(todos);
    console.log(typeof todos);
    // get the index of the deleted todo element and then remove it from the array 
    // console.log(todo.childNodes[0].innerText,todo.childNodes[1].innerText);
    const deletedItem = [todo.childNodes[0].innerText, todo.childNodes[1].innerText];
    console.log(deletedItem);
    console.log(todos);
    // find the index of the deleted item from the entire todos list
    // console.log(`Deleted todo index: ${todos.indexOf(deletedItem)}`);
    let deletedTodoIndex;
    todos.forEach(todoitem => {
        if (deletedItem[0] === todoitem[0] && deletedItem[1] === todoitem[1]) {
            // console.log(todos.indexOf(todoitem));
            deletedTodoIndex = todos.indexOf(todoitem);
        } 
    });
    console.log('deletedindex:',deletedTodoIndex);
    // delete the todo from todos array using the splice method 
    // arr.splice(index,no_of _items)
    todos.splice(deletedTodoIndex, 1);
    console.log("remaining todos:", todos);
    checkForEmpty(todos);
    updateTodoTitle(todos);
    // save the array back to local storage 
    localStorage.setItem("todos", JSON.stringify(todos));
}

const removeAllTodos = () => {
    let todos = checkLocalStorage();
    if (todos.length === 0) {
        alert("Todo List Is Empty!! Add some to clear");
    } else {
        console.log(todoList.childNodes);
        todoList.childNodes.forEach(
            todoItem => {
                console.log(todoItem);
                todoItem.classList.add('delete-animation');
                todoItem.addEventListener("transitionend", () => {
                    todoItem.remove();
                });
            }
        );
        localStorage.clear();
        todos = checkLocalStorage();
        checkForEmpty(todos);
        updateTodoTitle(todos);
        console.log("All Todos cleared")
    }
}


// * Event Listeners
// get all the existing todos from the local storage when all the contents are loaded
document.addEventListener('DOMContentLoaded', getTodosFromLocal);
todoButton.addEventListener("click", createTodo);
todoList.addEventListener("click", removeTodo);
categorySelect.addEventListener("click", filterTodo);
clearButton.addEventListener("click", removeAllTodos);