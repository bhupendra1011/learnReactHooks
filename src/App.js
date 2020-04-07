import React from "react";
import "./styles.css";

export default function App() {
  const stories = [
    {
      title: "React",
      url: "https://reactjs.org/",
      author: "Jordan Walke",
      num_comments: 3,
      points: 4,
      objectID: 0
    },
    {
      title: "Redux",
      url: "https://redux.js.org/",
      author: "Dan Abramov, Andrew Clark",
      num_comments: 2,
      points: 5,
      objectID: 1
    }
  ];

  const [searchTerm, setSearchTerm] = React.useState("eact"); // lifting the stateup
  const handleChange = event => {
    setSearchTerm(event.target.value);
  };
  const filteredItems = stories.filter(item => item.title.includes(searchTerm));

  return (
    <div className="App">
      <h1>React Basics</h1>
      <h2> React stories</h2>
      <Search value={searchTerm} change={handleChange} />
      <hr />
      <List list={filteredItems} />
    </div>
  );
}

function Search(props) {
  return (
    <>
      <label htmlFor="search">Search: </label>
      <input
        type="text"
        id="search"
        value={props.value}
        onChange={props.change}
      />
    </>
  );
}

function List(props) {
  return props.list.map(item => (
    <div key={item.objectID}>
      <span>
        <a href={item.url}>{item.title} </a>
      </span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
    </div>
  ));
}
