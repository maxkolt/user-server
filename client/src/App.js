import React, { useState, useEffect } from "react";
import axios from "axios";


function App() {
  const [users, setUsers] = useState([]);
  const [newUserId, setNewUserId] = useState("");
  const [newName, setNewName] = useState("");
  const [newAbout, setNewAbout] = useState("");
  const [searchedUser, setSearchedUser] = useState(null);
  const [searchedUserId, setSearchedUserId] = useState("");
  const [editedUserId, setEditedUserId] = useState("");
  const [editedName, setEditedName] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);



  const axiosInstance = axios.create({
    baseURL: "http://localhost:3000",
  });

  const handleCreateUser = async () => {
    if (newUserId.trim() && newName.trim() && newAbout.trim()) {
      try {
        await axiosInstance.post("/user/create", {
          userId: newUserId,
          name: newName,
          about: newAbout,
        });
        setNewUserId("");
        setNewName("");
        setNewAbout("");
        setErrorMessage(null); // Сбрасываем ошибку после успешной операции
      } catch (error) {
        setErrorMessage(`Ошибка при создании пользователя: ${error.message}`);
        console.error("Ошибка при создании пользователя:", error);
      }
    } else {
      setErrorMessage("Заполните все поля!");
    }
  };

  const handleSearchUser = async () => {
    if (searchedUserId.trim()) {
      try {
        const response = await axiosInstance.get(`/user/${searchedUserId}`);
        setSearchedUser(response.data);
        setErrorMessage(null);
      } catch (error) {
        setErrorMessage(`Ошибка при поиске пользователя: ${error.message}`);
        console.error("Ошибка при поиске пользователя:", error);
      }
    } else {
      setErrorMessage("Введите ID пользователя для поиска.");
    }
  };

  const handleEditUser = async () => {
    if (editedUserId.trim() && editedName.trim()) {
      try {
        await axiosInstance.put(`/user/edit/${editedUserId}`, {
          name: editedName,
        });
        setEditedUserId("");
        setEditedName("");
        setErrorMessage(null);
      } catch (error) {
        setErrorMessage(`Ошибка при редактировании пользователя: ${error.message}`);
        console.error("Ошибка при редактировании пользователя:", error);
      }
    } else {
      setErrorMessage("Заполните все поля!");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Управление пользователями</h1>
      <div style={styles.section}>
        <h2 style={styles.subHeader}>Создать пользователя</h2>
        <input
          style={styles.input}
          placeholder="UserId"
          value={newUserId}
          onChange={(e) => setNewUserId(e.target.value)}
        />
        <input
          style={styles.input}
          placeholder="Name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <input
          style={styles.input}
          placeholder="About"
          value={newAbout}
          onChange={(e) => setNewAbout(e.target.value)}
        />
        <button style={{ ...styles.button, backgroundColor: "#4CAF50" }} onClick={handleCreateUser}>
          Create
        </button>
      </div>

      <div style={styles.section}>
        <h2 style={styles.subHeader}>Поиск пользователя по UserId</h2>
        <input
          style={styles.input}
          placeholder="UserId"
          value={searchedUserId}
          onChange={(e) => setSearchedUserId(e.target.value)}
        />
        <button style={{ ...styles.button, backgroundColor: "#2196F3" }} onClick={handleSearchUser}>
          Search
        </button>
        {searchedUser && (
          <div style={styles.result}>
            <p>UserId: {searchedUser.userId}</p>
            <p>Name: {searchedUser.name}</p>
            <p>About: {searchedUser.about}</p>
          </div>
        )}
      </div>

      <div style={styles.section}>
        <h2 style={styles.subHeader}>Редактировать Name пользователя</h2>
        <input
          style={styles.input}
          placeholder="UserId"
          value={editedUserId}
          onChange={(e) => setEditedUserId(e.target.value)}
        />
        <input
          style={styles.input}
          placeholder="New Name"
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
        />
        <button style={{ ...styles.button, backgroundColor: "#FF9800" }} onClick={handleEditUser}>
          Edit
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    padding: "20px",
    maxWidth: "600px",
    margin: "0 auto",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  },
  header: {
    textAlign: "center",
    color: "#333",
  },
  subHeader: {
    marginBottom: "10px",
    color: "#555",
  },
  section: {
    marginBottom: "30px",
    padding: "10px",
    borderRadius: "8px",
    backgroundColor: "#fff",
    border: "1px solid #ddd",
  },
  input: {
    display: "block",
    width: "96%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  button: {
    display: "block",
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "16px",
    border: "none",
    cursor: "pointer",
    marginTop: "10px",
  },
  error: {
    color: "red",
    marginBottom: "10px",
  },
  result: {
    marginTop: "20px",
    padding: "10px",
    backgroundColor: "#f1f1f1",
    borderRadius: "8px",
  },
};

export default App;
