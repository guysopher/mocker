import { CanvasElement } from '@/types/canvas'
import { Component, FC, useEffect } from 'react'
import { CommentsIndicator } from '@/components/CommentsIndicator'
import * as antd from 'antd'
import { Skeleton, Tabs } from 'antd'
import * as Babel from '@babel/standalone';
import React from 'react';
import { createRoot } from 'react-dom/client';
import * as antdIcons from '@ant-design/icons';

interface DesignViewProps {
  pages: Record<string, {
    layout: string;
    components: string[];
  }>
  stylesheet: string
  onElementClick?: (id: string) => void
  activeElement?: string | null
  showProgress: string | null
  isGenerating: boolean
}
// Declare window interfaces to fix TypeScript errors
declare global {
  interface Window {
    React: typeof React;
    antd: typeof antd;
    antdIcons: typeof antdIcons;
    Component: any;
  }
}

if (typeof window !== 'undefined') {
  window.React = React;
  window.antd = antd;
  window.antdIcons = antdIcons;
}

const titleToId = (title: string) => {
  return title.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
}

const DEFAULT_CODE = `
(function() {
  var React = window.React;
  var antd = window.antd;
  var antdIcons = window.antdIcons;

  var { Input, Button, List, Checkbox } = antd;

  var TodoListApp = function() {
    var [tasks, setTasks] = React.useState([]);
    var [newTask, setNewTask] = React.useState("");

    var addTask = function() {
      if (newTask.trim() === "") return;
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask("");
    };

    var toggleTask = function(id) {
      setTasks(tasks.map(function(task) { 
        return task.id === id ? { ...task, completed: !task.completed } : task 
      }));
    };

    var deleteTask = function(id) {
      setTasks(tasks.filter(function(task) { 
        return task.id !== id 
      }));
    };

    return React.createElement(
      'div',
      { 
        style: { 
          maxWidth: "400px", 
          margin: "auto", 
          padding: "20px", 
          background: "#fff", 
          borderRadius: "8px", 
          boxShadow: "0px 4px 6px rgba(0,0,0,0.1)" 
        } 
      },
      [
        React.createElement('h2', { 
          style: { textAlign: "center" }, 
          key: 'title' 
        }, 'Todo List'),
        React.createElement(
          'div',
          { 
            style: { 
              display: "flex", 
              gap: "8px", 
              marginBottom: "16px" 
            },
            key: 'input-container'
          },
          [
            React.createElement(Input, {
              value: newTask,
              onChange: function(e) { setNewTask(e.target.value) },
              placeholder: "Add a new task",
              key: 'input'
            }),
            React.createElement(Button, {
              type: "primary",
              onClick: addTask,
              key: 'add-button'
            }, 'Add')
          ]
        ),
        React.createElement(List, {
          bordered: true,
          dataSource: tasks,
          key: 'list',
          renderItem: function(task) {
            return React.createElement(List.Item, {
              key: task.id,
              actions: [
                React.createElement(Checkbox, {
                  checked: task.completed,
                  onChange: function() { toggleTask(task.id) },
                  key: 'checkbox-' + task.id
                }),
                React.createElement(Button, {
                  danger: true,
                  onClick: function() { deleteTask(task.id) },
                  key: 'delete-' + task.id
                }, 'Delete')
              ]
            }, React.createElement('span', {
              style: { 
                textDecoration: task.completed ? "line-through" : "none" 
              }
            }, task.text))
          }
        })
      ]
    );
  };

  return TodoListApp;
})()`;

export const DesignView: FC<DesignViewProps> = ({
  pages = {},
  stylesheet = { classes: [], stylesheet: '' },
  onElementClick,
  activeElement,
  showProgress,
  isGenerating
}) => {

  const compileAndRenderComponent = async (code: string, elementId: string) => {
    try {
      const response = await fetch('/api/bundler', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code,
          options: {
            minify: false,
          },
        }),
      });

      const { bundledCode } = await response.json();

      // Create a script element to evaluate the bundled code
      const scriptElement = document.createElement('script');
      scriptElement.textContent = `
        try {
          window.Component = (function() {
            ${bundledCode}
            // Return the default export or the module itself
            return typeof exports.default !== 'undefined' ? exports.default : exports;
          })();
        } catch (e) {
          console.error("Error in bundled code:", e);
        }
      `;
      document.head.appendChild(scriptElement);

      // Now the Component should be available as a global variable
      const PageComponent = window?.Component?.default || window?.Component;

      // Get the root element
      const rootElement = document.getElementById(elementId);
      if (rootElement) {
        // Clear any existing content
        rootElement.innerHTML = '';
        // Create a container div for the component
        const container = document.createElement('div');
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.display = 'flex';
        container.style.justifyContent = 'center';
        container.style.alignItems = 'center';
        rootElement.appendChild(container);

        // Create root and render
        const root = createRoot(container);

        if (PageComponent) {
          // Render the actual component
          root.render(React.createElement(PageComponent));
        } else {
          // Fallback if component is not found
          root.render(React.createElement('div', {}, 'Component not found'));
          console.error("Component not found in the bundled code");
        }
      }
    } catch (error) {
      console.error("Error rendering component:", error);
      const rootElement = document.getElementById(elementId);
      if (rootElement) {
        rootElement.innerHTML = `<div style="color: red; padding: 20px;">Error rendering component: ${error instanceof Error ? error.message : String(error)}</div>`;
      }
    }
  };

  function renderComponent(code: string, elementId: string) {
    try {
      // The issue is here - the code doesn't define a 'Page' variable
      // Let's modify this to use the component returned by the function
      const Component = eval(`
        (function() {
          var React = window.React;
          var antd = window.antd;
          var antdIcons = window.antdIcons;
          ${code}
          // Return the component directly instead of looking for 'Page'
          return Component;
        })()`);

      const rootElement = document.getElementById(elementId);
      if (rootElement) {
        // Clear any existing content
        rootElement.innerHTML = '';
        // Create a container div for the component
        const container = document.createElement('div');
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.display = 'flex';
        container.style.justifyContent = 'center';
        container.style.alignItems = 'center';
        rootElement.appendChild(container);

        // Create root and render
        const root = createRoot(container);
        root.render(React.createElement(Component));
      }
    } catch (error) {
      console.error("Error rendering component:", error);
    }
  }

  const RENDER_TEST = false;
  useEffect(() => {
    if (!RENDER_TEST) {
      return;
    }
    const fetchAndRenderComponent = async () => {
      const REACT_CODE = `
import React, { useState } from 'react';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  const addTodo = () => {
    if (input.trim() !== '') {
      setTodos([...todos, { id: Date.now(), text: input, completed: false }]);
      setInput('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">Todo App</h1>

      <div className="flex mb-4">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a new todo..."
          className="flex-grow p-2 border rounded-l"
        />
        <button
          onClick={addTodo}
          className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
        >
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {todos.map(todo => (
          <li
            key={todo.id}
            className="flex items-center justify-between p-2 border rounded bg-gray-50"
          >
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="mr-2"
              />
              <span className={todo.completed ? 'line-through text-gray-400' : ''}>
                {todo.text}
              </span>
            </div>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {todos.length > 0 && (
        <div className="mt-4 text-sm text-gray-500">
          {todos.filter(todo => todo.completed).length} of {todos.length} tasks completed
        </div>
      )}
    </div>
  );
};

export default TodoApp;
      `;

      const response = await fetch('/api/bundler', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: REACT_CODE,
          options: {
            minify: false,
          },
        }),
      });

      const { bundledCode } = await response.json();

      // Create a script element to evaluate the bundled code
      debugger;
      const scriptElement = document.createElement('script');
      scriptElement.textContent = bundledCode;
      document.head.appendChild(scriptElement);

      // Now the Component should be available as a global variable
      const PageComponent = window?.Component?.default || window?.Component;

      // Get the root element
      const rootElement = document.getElementById('render-page-todo-app');
      if (rootElement) {
        // Clear any existing content
        rootElement.innerHTML = '';
        // Create a container div for the component
        const container = document.createElement('div');
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.display = 'flex';
        container.style.justifyContent = 'center';
        container.style.alignItems = 'center';
        rootElement.appendChild(container);

        // Create root and render
        const root = createRoot(container);
        
        // Render the actual component
        root.render(React.createElement(PageComponent));
      }
    };

    debugger;
    fetchAndRenderComponent();
  }, []);

  const items = Object.keys(pages).map(page => ({
    label: page,
    key: (page),
    children: (
      <div
        id={'render-page-' + titleToId(page)}
        className="w-full h-full relative"
        style={{
          border: '0px solid #111',
          borderRadius: 10,
          boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)',
          height: 765,
          width: 1105,
          margin: '0 auto',
          // display: 'grid',
          // gridTemplateColumns: 'repeat(16, 1fr)', /* 16 equal columns */
          // gridTemplateRows: 'repeat(9, 1fr)', /* 9 equal rows */
          // gap: 10, /* Adjust spacing */
          overflow: 'hidden',
          boxSizing: 'border-box'
        }}>
        {/* <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/antd@5.20.0/dist/reset.css" /> */}
        {/* <style dangerouslySetInnerHTML={{ __html: stylesheet }} /> */}
        {/* {pages[page].components?.map((component: any) => {
          const isActive = component.html === activeElement
          if (isActive) {
            return <>
              {compileAndRenderComponent(component)}
              {/* <div key={component}
                  onClick={() => onElementClick?.(component)}
                >
                  {showProgress === component && (
                    <CommentsIndicator />
                  )}
                </div> }
            </>
          } else {
            renderComponent(DEFUALT_CODE, page)
          }
        })} */}
      </div>
    )
  }));

  return (
    <div className='w-full h-full'>
      {RENDER_TEST ? (
        <div>
            TODO IS HERE
            <div id='render-page-todo-app'>
            <h1>Todo App</h1>
            <p>This is a todo app</p>
          </div>
        </div>
      ) : (
        isGenerating ? (
          <div className="w-full h-full flex items-center justify-center">
            <Skeleton active paragraph={{ rows: 8 }} className="w-full max-w-4xl" />
          </div>
      ) : (
        <Tabs items={items} onChange={(key) => {
          if (pages[key] && pages[key].components && pages[key].components.length > 0) {
            compileAndRenderComponent(pages[key].components[0], 'render-page-' + titleToId(key));
          }
        }}
        onTabClick={(key) => {
          if (pages[key] && pages[key].components && pages[key].components.length > 0) {
            compileAndRenderComponent(pages[key].components[0], 'render-page-' + titleToId(key));
          }
        }}
        defaultActiveKey={Object.keys(pages)[0] || ''}
        />
      ))}
    </div>
  )
} 