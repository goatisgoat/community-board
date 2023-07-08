import axios from "axios";

const getComments = async () => {
  const response = await axios.get(
    `http://localhost:3001/comments?_sort=id&_order=desc`
  );
  return response;
};

const addComments = async (newUpdate) => {
  await axios.post(`http://localhost:3001/comments`, newUpdate);
};

// const patchComments = async (newUpdate) => {
//   console.log("sadsd", newUpdate);
//   await axios.patch(`http://localhost:3001/comments`, newUpdate);
// };
export { getComments, addComments };
