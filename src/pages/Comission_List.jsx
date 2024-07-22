// src/components/ComissionList.js

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  __fetchComission,
  __deleteComission,
  __updateComission,
} from "../redux/slices/comissionSlice";

const ComissionList = () => {
  const dispatch = useDispatch();
  const { comissions, isLoading, error } = useSelector(
    (state) => state.comission
  );

  useEffect(() => {
    dispatch(__fetchComission());
  }, [dispatch]);

  const handleDeleteComission = (id) => {
    dispatch(__deleteComission(id));
  };

  const handleUpdateComission = (id) => {
    const updatedComission = {
      id,
      title: "Updated Comission",
      body: "Updated Body",
    };
    dispatch(__updateComission(updatedComission));
  };

  return (
    <div>
      <h1>Comission List</h1>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <ul>
        {comissions.map((comission) => (
          <li key={comission.id}>
            <h2>{comission.title}</h2>
            <p>{comission.body}</p>
            <button onClick={() => handleDeleteComission(comission.id)}>
              Delete
            </button>
            <button onClick={() => handleUpdateComission(comission.id)}>
              Update
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ComissionList;
