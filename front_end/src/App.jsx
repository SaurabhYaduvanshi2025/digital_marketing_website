import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
      fetch(`${import.meta.env.VITE_API_URL}/v1/health`)
      .then((response) => response.json())
      .then((data) => {
        setMessage(data.message);
      });
  }, []);

  return <h1>{message}</h1>;
}

export default App;