import React, { useState } from "react";
import { Task } from "/imports/ui/Task.jsx";
import { useSubscribe, useTracker } from "meteor/react-meteor-data";
import { TasksCollection } from "/imports/api/TasksCollection";
import { TaskForm } from "/imports/ui/TaskForm";
import { LoginForm } from "/imports/ui/LoginForm";

export const App = () => {
  const user = useTracker(() => Meteor.user());
  const [hideCompleted, setHideCompleted] = useState(false);

  const handleToggleChecked = ({ _id, isChecked }) =>
    Meteor.callAsync("tasks.toggleChecked", { _id, isChecked });

  const handleDelete = ({ _id }) => Meteor.callAsync("tasks.delete", { _id });
  const hideCompletedFilter = { isChecked: { $ne: true } };

  const pendingTasksCount = useTracker(() => {
    if (!user) {
      return 0;
    }
    TasksCollection.find(hideCompletedFilter).count();
  });

  const pendingTasksTitle = `${
    pendingTasksCount ? ` (${pendingTasksCount})` : ""
  }`;

  const tasks = useTracker(() => {
    if (!user) {
      return [];
    }

    return TasksCollection.find(hideCompleted ? hideCompletedFilter : {}, {
      sort: { createdAt: -1 },
    }).fetch();
  });

  const isLoading = useSubscribe("tasks");

  const logout = () => Meteor.logout();

  if (isLoading()) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app">
      <header>
        <div className="app-bar">
          <div className="app-header">
            <h1>📝️ To Do List {pendingTasksTitle}</h1>
          </div>
        </div>
      </header>
      <div className="main">
        {user ? (
          <>
            <div className="user" onClick={logout}>
              {user.username} 🚪
            </div>
            <TaskForm />
            <div className="filter">
              <button onClick={() => setHideCompleted(!hideCompleted)}>
                {hideCompleted ? "Show All" : "Hide Completed"}
              </button>
            </div>
            <ul className="tasks">
              {tasks.map((task) => (
                <Task
                  key={task._id}
                  task={task}
                  onCheckboxClick={handleToggleChecked}
                  onDeleteClick={handleDelete}
                />
              ))}
            </ul>
          </>
        ) : (
          <LoginForm />
        )}
      </div>
    </div>
  );
};
