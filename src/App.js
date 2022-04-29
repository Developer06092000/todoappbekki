import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Button, Modal, Table } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import "./App.css";

const url = "https://todoappbybekki.herokuapp.com/todos/";

function App() {
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [showDel, setShowDel] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [completed, setCompleted] = useState(false);
  const [edit, setEdit] = useState(null);
  const [editKey, setEditKey] = useState(null);
  const [deleteKey, setDeleteKey] = useState(null);

  const columns = [
    {
      title: "№",
      dataIndex: "key",
      key: "key",
      width: 50,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: "20%",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Completed",
      dataIndex: "completed",
      key: "completed",
      render: (completed) => {
        return (
          <>
            {completed ? (
              <CheckOutlined style={{ color: "green" }} />
            ) : (
              <CloseOutlined style={{ color: "red" }} />
            )}
          </>
        );
      },
      width: 100,
    },
    {
      title: "Action",
      dataIndex: "key",
      key: "key",
      render: (keyId) => {
        return (
          <>
            <Button
              type="primary"
              onClick={() => editTodos(keyId - 1)}
              style={{ marginRight: 10 }}
            >
              Edit
            </Button>
            <Button type="danger" onClick={() => showDelModal(keyId - 1)}>
              Delete
            </Button>
          </>
        );
      },
      width: 180,
    },
  ];

  const showModal = () => {
    setShow(true);
  };

  const closeModal = () => {
    setShow(false);
    setEdit(null);
    setEditKey(null);
    clearTodos();
    setTitle("");
    setCompleted(false);
    setDescription("");
  };

  const showDelModal = (key) => {
    setShowDel(true);
    setDeleteKey(key);
  };

  const closeDelModal = () => {
    setShowDel(false);
    setDeleteKey(null);
  };

  const getTodos = () => {
    axios
      .get(url)
      .then((res) => {
        var data = res.data;
        for (let i = 0; i < data.length; i++) {
          data[i].key = i + 1;
        }
        setData(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const saveTodos = () => {
    if (edit === null) {
      axios
        .post(url, {
          title: title,
          description: description,
          completed: completed,
        })
        .then((res) => {
          getTodos();
          closeModal();
        })
        .catch((err) => console.log(err));
    } else {
      axios
        .patch(`${url + edit}/`, {
          title: title,
          description: description,
          completed: completed,
        })
        .then((res) => {
          getTodos();
          closeModal();
        })
        .catch((err) => console.log(err));
    }
  };

  const deleteTodos = (key) => {
    axios
      .delete(`${url + data[key].id}`)
      .then((res) => {
        getTodos();
        closeDelModal();
      })
      .catch((err) => console.log(err));
  };

  const editTodos = (key) => {
    setTitle(data[key].title);
    setDescription(data[key].description);
    setCompleted(data[key].completed);
    setEdit(data[key].id);
    setEditKey(key);
    showModal();
  };

  const clearTodos = () => {
    if (edit === null) {
      setTitle("");
      setCompleted(false);
      setDescription("");
    } else {
      setTitle(data[editKey].title);
      setDescription(data[editKey].description);
      setCompleted(data[editKey].completed);
    }
  };

  const onTitle = (e) => {
    setTitle(e.target.value);
  };

  const onDescription = (e) => {
    setDescription(e.target.value);
  };

  const onChecked = (e) => {
    setCompleted(e.target.checked);
  };

  useEffect(() => {
    getTodos();
  });

  return (
    <div className="App">
      <div style={{ padding: 50 }}>
        <Button type="primary" onClick={() => showModal()}>
          Create todos
        </Button>
        <br />
        <br />
        <Table
          style={{ width: "100%", marginRight: "auto", marginLeft: "auto" }}
          dataSource={data}
          columns={columns}
        />
        <Modal
          title="Todos"
          centered
          visible={show}
          onCancel={() => closeModal()}
          footer={false}
        >
          <Form>
            <Form.Group className="mb-3" controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Title..."
                onChange={onTitle}
                value={title}
                required={true}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Description..."
                onChange={onDescription}
                value={description}
                required={true}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="completed">
              <Form.Check
                type="checkbox"
                label="Completed"
                onChange={onChecked}
                checked={completed}
              />
            </Form.Group>

            <Button
              style={{ marginRight: 15 }}
              type="danger"
              onClick={() => clearTodos()}
            >
              Break
            </Button>
            <Button type="primary" onClick={() => saveTodos()}>
              Save
            </Button>
          </Form>
        </Modal>
        <Modal
          title="Delete information"
          centered
          visible={showDel}
          footer={false}
          onCancel={() => closeDelModal()}
        >
          <h3>Are you sure you want to delete this information?</h3>
          <br />
          <Button
            type="primary"
            onClick={() => closeDelModal()}
            style={{ marginRight: 20 }}
          >
            No
          </Button>
          <Button type="danger" onClick={() => deleteTodos(deleteKey)}>
            Yes
          </Button>
        </Modal>
      </div>
    </div>
  );
}

export default App;
