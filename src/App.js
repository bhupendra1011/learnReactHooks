import React from "react";
import "./styles.css";

export default function App() {
  const initialStories = [
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

  const [searchTerm, setSearchTerm] = useSemiPersitantStorage(
    "searchItem",
    "R"
  );
  // const [stories, setStories] = React.useState([]);
  // manage state via useReducer instead of useState as addition and removal of stories is there

  const storiesReducer = (state, action) => {
    switch (action.type) {
      case "STORIES_FETCH_INIT":
        return { ...state, isLoading: true };
      case "STORIES_FETCH_SUCCESS":
        return {
          ...state,
          isLoading: false,
          isError: false,
          data: action.payload
        };
      case "STORIES_FETCH_FAILURE":
        return { ...state, isLoading: false, isError: true };
      case "REMOVE_STORY":
        return {
          ...state,
          data: state.data.filter(
            story => action.payload.objectID !== story.objectID
          )
        };
      default:
        return state;
    }
  };

  const [stories, dispatchStories] = React.useReducer(storiesReducer, {
    data: [],
    isError: false,
    isLoading: false
  });

  // 👆 having a unified state object , where data related  data-fetching /loading/error states are combined

  //async fetching remote data
  const getAsyncStories = () => {
    const dataPromise = new Promise((resolve, reject) =>
      setTimeout(() => resolve({ data: initialStories }), 3000)
    );
    // const dataPromise = Promise.resolve({ data: initialStories });
    return dataPromise;
  };

  // getting initial data on componnet mount
  React.useEffect(() => {
    // setting initial loading state
    dispatchStories({ type: "STORIES_FETCH_INIT" });
    getAsyncStories()
      .then(result => {
        dispatchStories({
          type: "STORIES_FETCH_SUCCESS",
          payload: result.data
        });
      })
      .catch(() => dispatchStories({ type: "STORIES_FETCH_FAILURE" }));
  }, []);

  const handleRemoveStory = item => {
    dispatchStories({ type: "REMOVE_STORY", payload: item });
    //const newStories =
    //setStories(newStories);
  };

  const handleChange = event => {
    setSearchTerm(event.target.value);
  };

  const filteredItems = stories.data.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // if (stories.isError) {
  //   return <p> Something went wrong... </p>;
  // }
  return (
    <div className="App">
      <h1>React Basics</h1>
      <h2> React stories</h2>
      <InputWithLabel
        id="search"
        type="text"
        value={searchTerm}
        isFocussed={true}
        OnInputChange={handleChange}
      >
        {" "}
        Search :
      </InputWithLabel>
      <hr />

      {stories.isError && (
        <p style={{ color: "red" }}> Some error occured ... </p>
      )}

      {stories.isLoading ? (
        <p> Loading... </p>
      ) : (
        <List list={filteredItems} onRemoveitem={handleRemoveStory} />
      )}
    </div>
  );
}

function InputWithLabel({
  id,
  label,
  type = "text",
  value,
  OnInputChange,
  children,
  isFocussed
}) {
  const inputRef = React.useRef();
  React.useEffect(() => {
    if (isFocussed && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocussed]);

  return (
    <>
      <label htmlFor="search">{children} </label>
      <input
        ref={inputRef}
        type={type}
        id={id}
        value={value}
        onChange={OnInputChange}
      />
    </>
  );
}

function List({ list, onRemoveitem }) {
  return list.map(item => (
    <Item key={item.objectID} item={item} onRemoveitem={onRemoveitem} />
  ));
}

function Item({ item, onRemoveitem }) {
  return (
    <div key={item.objectID}>
      <span>
        <a href={item.url}>{item.title} </a>
      </span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
      <span>
        <button type="button" onClick={() => onRemoveitem(item)}>
          Delete{" "}
        </button>
      </span>
    </div>
  );
}

// cutom hook to save in localStorage

const useSemiPersitantStorage = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  ); // lifting the stateup
  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);
  return [value, setValue];
};
