import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Login  from './Login.jsx'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />

  </React.StrictMode>,


)
// App.jsx
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Home from './Home';
// import Login from './Login';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/Login" element={<Login />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

