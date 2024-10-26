import React from "react";
import { Task } from "/imports/ui/Task.jsx";
import { useSubscribe, useTracker } from "meteor/react-meteor-data";
import { TasksCollection } from "/imports/api/TasksCollection";
import { TaskForm } from "/imports/ui/TaskForm";

export const App = () => {
  const tasks = useTracker(() => TasksCollection.find({}).fetch());
  const isLoading = useSubscribe("tasks");

  if (isLoading()) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome to Meteor!</h1>

      <TaskForm />

      <ul>
        {tasks.map((task) => (
          <Task key={task._id} task={task} />
        ))}
      </ul>
    </div>
  );
};
