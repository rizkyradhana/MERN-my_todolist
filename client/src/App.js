import { useEffect, useState } from "react";
const api_base = "http://localhost:3001";

function App() {
  const [todos, setTodos] = useState([]);
  const [popupActive, setPopupActive] = useState(false);
  const [newTodo, setNewTodo] = useState("");
  const [newDate, setNewDate] = useState("");
  const [dateState, setDateState] = useState(
    new Date().toString().slice(0, 3) +
      ", " +
      new Date().toString().slice(4, 25)
  );
  useEffect(() => {
    setInterval(
      () =>
        setDateState(
          new Date().toString().slice(0, 3) +
            ", " +
            new Date().toString().slice(4, 25)
        ),
      1000
    );
  }, []);

  useEffect(() => {
    GetTodos();
  }, []);

  const GetTodos = () => {
    fetch(api_base + "/todos")
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((err) => console.error("Error: ", err));
  };

  const completeTodo = async (id) => {
    const data = await fetch(api_base + "/todo/complete/" + id).then((res) =>
      res.json()
    );

    setTodos((todos) =>
      todos.map((todo) => {
        if (todo._id === data._id) {
          todo.complete = data.complete;
        }

        return todo;
      })
    );
  };

  const addTodo = async () => {
    const data = await fetch(api_base + "/todo/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: newTodo,
        date: newDate,
      }),
    }).then((res) => res.json());

    setTodos([...todos, data]);

    setPopupActive(false);
    setNewTodo("");
    setNewDate("");
  };

  const deleteTodo = async (id) => {
    const data = await fetch(api_base + "/todo/delete/" + id, {
      method: "DELETE",
    }).then((res) => res.json());

    setTodos((todos) => todos.filter((todo) => todo._id !== data.result._id));
  };

  // const today = new Date().toString().slice(0, 15);
  return (
    <div className="App">
      <h1>My To do List</h1>
      <h2>{dateState}</h2>
      <h4>Today's Tasks</h4>

      <div className="todos">
        {todos.length > 0 ? (
          todos.map((todo) => (
            <div className={"todo " + (todo.complete ? "is-complete" : "")}>
              <div
                className="checkbox"
                key={todo._id}
                onClick={() => completeTodo(todo._id)}
              ></div>

              <div className="text">
                {todo.text +
                  " - " +
                  todo.date +
                  (parseInt(todo.date) >= 12 ? " PM" : " AM")}
              </div>

              <div className="delete-todo" onClick={() => deleteTodo(todo._id)}>
                x
              </div>
            </div>
          ))
        ) : (
          <p>You currently have no tasks</p>
        )}
      </div>

      <div className="addPopup" onClick={() => setPopupActive(true)}>
        +
      </div>

      {popupActive ? (
        <div className="popup">
          <div className="closePopup" onClick={() => setPopupActive(false)}>
            X
          </div>
          <div className="content">
            <h3>Add Task</h3>
            <input
              type="text"
              className="add-todo-input"
              onChange={(e) => setNewTodo(e.target.value)}
              value={newTodo}
            />

            <h3>Date/Time</h3>
            <input
              type="time"
              className="add-todo-input"
              onChange={(e) => setNewDate(e.target.value)}
              value={newDate}
            />
            <div className="button" onClick={addTodo}>
              Create Task
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default App;
