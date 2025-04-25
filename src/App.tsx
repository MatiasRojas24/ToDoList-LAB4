import { Sidebar } from "./components/screens/Sidebar/Sidebar";
import { Sprint } from "./components/screens/Sprint/Sprint";
import { Backlog } from "./components/screens/Backlog/Backlog";
import styles from "./App.module.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className={styles.containerApp}>
        <Sidebar />
        <Routes>
          <Route path="/backlog" element={<Backlog />} />
          <Route path="/sprints" element={<Sprint />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
