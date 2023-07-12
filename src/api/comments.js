import axios from "axios";

const getComments = async () => {
  const response = await axios.get(
    `${process.env.REACT_APP_DB_URL}/comments?_sort=id&_order=desc`
    // {
    //   headers: {
    //     Authorization: `Bearer ${cookies["accessToken"]}`,
    //   },
    // }
  );
  return response;
};

const addComments = async (newUpdate) => {
  await axios.post(`${process.env.REACT_APP_DB_URL}/comments`, newUpdate);
};

// const patchComments = async (newUpdate) => {
//   console.log("sadsd", newUpdate);
//   await axios.patch(`http://localhost:3001/comments`, newUpdate);
// };
export { getComments, addComments };
