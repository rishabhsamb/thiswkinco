import React from 'react'
import './App.css';
import CssBaseline from '@material-ui/core/CssBaseline'
import Papers from './Papers'

const PAPERS_API_URL = 'http://localhost:3001/papers'

const fetchPapers = async (updateCb) => {
  const res = await fetch(PAPERS_API_URL)
  const json = await res.json()

  updateCb(json)
}

function App() {

  const [paperList, updatePapers] = React.useState([])  

  React.useEffect(() => {
    fetchPapers(updatePapers);
  }, [])

  return (
    <div>
        <CssBaseline />
        <Papers papers={paperList}/>
    </div>
  );
}

export default App;
