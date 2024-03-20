'use client'

import React, { useState, useEffect } from 'react';

export default function Home() {
  const [inputValue, setInputValue] = useState('');
  const [tasks, setTasks] = useState<string[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`${process.env.API_URL}/todos/`);
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };

    fetchTasks();
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const addTask = async () => {
    if (inputValue === '') {
      alert("You must write something");
    } else {
      try {
        const response = await fetch(`${process.env.API_URL}/todos/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: inputValue }),
        });

        const newTask = await response.json();
        setTasks([...tasks, newTask]);
        setInputValue('');
      } catch (error) {
        console.error('Error adding task:', error);
      }
    }
  };

  const handleTaskClick = (index: number) => {
    setTasks((prevTasks) => {
      const updatedTasks = [...prevTasks];
      const currentTask = updatedTasks[index];
      updatedTasks[index] = currentTask.includes('✅') ? currentTask.replace('✅ ', '') : `✅ ${currentTask}`;
      return updatedTasks;
    });
  };

  const handleClearAll = () => {
    setTasks([]);
  };

  return (
    <main className="bg-gradient-to-br from-indigo-700 to-pink-700 min-h-screen">
      <div className="container mx-auto p-4">
        <div className="todo-app bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-blue-900 mb-6 text-center">To-Do List</h1>
          <div className="flex items-center mb-4">
            <input
              type="text"
              placeholder="Add new task"
              value={inputValue}
              onChange={handleInputChange}
              className="border border-gray-300 text-black font-normal text-xl rounded-lg px-4 py-2 w-full mr-2"
            />
            <button onClick={addTask} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg">
              Add
            </button>
          </div>
          <ul className="divide-y text-black font-normal font-mono text-2xl divide-gray-300">
            {tasks.map((task, index) => (
              <li
                key={index}
                onClick={() => handleTaskClick(index)}
                className={`flex items-center p-4 justify-between py-2 cursor-pointer ${task.includes('✅') ? 'line-through text-gray-500' : ''}`}
              >
                <span>{task}</span>
                <span className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center">
                  {task.includes('✅') ? '✅' : ''}
                </span>
              </li>
            ))}
          </ul>
          {tasks.length > 0 && (
            <button onClick={handleClearAll} className="mt-4 bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg block mx-auto">
              Clear All
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

