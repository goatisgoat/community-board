import axios from "axios";

const addAuth = async (newUpdate) => {
  await axios.post(`http://localhost:3001/register`, newUpdate);
};

export { addAuth };
