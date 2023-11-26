import './App.css'
import { useState, useEffect, useRef } from "react";
import FlashcardList from "./FlashcardList";
import axios from 'axios';


function App() {

  const [flashcards, setFlashcards] = useState([])
  const [category, setCategory] = useState([])

  const categoryEle = useRef();
  const amountEle = useRef();

  useEffect(() => {
    axios.get('https://opentdb.com/api_category.php')
      .then(res => {
        // console.log(res.data);
        setCategory(res.data.trivia_categories)
      })
  }, [])

  function decodeString(str) {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = str;
    return textArea.value;
  }

  function handleSubmit(e) {
    e.preventDefault()
    axios.get("https://opentdb.com/api.php", {
      params: {
        amount: amountEle.current.value,
        category: categoryEle.current.value
      }
    })
      .then(res => {
        setFlashcards(res.data.results.map((item, index) => {
          const answer = decodeString(item.correct_answer);
          const options = [...item.incorrect_answers.map(a => decodeString(a)), answer]
          return {
            id: `${index} - ${Date.now()}`,
            question: decodeString(item.question),
            ans: answer,
            options: options.sort(() => Math.random() - .5)
          }
        }))
      })
  }

  return (
    <>
      <form className='header' onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='category'>Category</label>
          <select id="category" ref={categoryEle}>
            {
              category.map(category => {
                return <option value={category.id} key={category.id}>{category.name}</option>
              })
            }
          </select>
        </div>
        <div className="form-group">
          <label htmlFor='amount' >Number of Questions</label>
          <input type='number' id='amount' min='1' defaultValue={10} ref={amountEle}></input>
        </div>

        <div className="form-group">
          <button className='btn'>
            Generate
          </button>
        </div>
      </form>
      <div className='container'>
        <FlashcardList flashcards={flashcards} />
      </div>
    </>
  );
}

export default App;
