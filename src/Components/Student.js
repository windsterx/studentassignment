import React, { useEffect, useState } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import {
  CardHeader,
  Dialog,
  DialogTitle,
  Card,
  TextField,
  Button,
} from "@material-ui/core";

const Students = () => {
  const [students, setStudents] = useState();
  const [student, setStudent] = useState();
  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
    setStudent();
  };
  useEffect(() => {
    getStudents();
  }, []);

  const getStudents = () => {
    fetch("http://localhost:9000/students")
      .then((res) => res.json())
      .then((res) => {
        setStudents([...res.students]);
        console.log(students);
      });
  };
  const getStudent = (id) => {
    fetch("http://localhost:9000/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id }),
    })
      .then((res) => {
        if (res.status === 200) {
          res.text().then((d) => {
            if (d !== "") {
              setStudent(JSON.parse(d));
              setOpen(true);
            } else {
              setStudent();
              setOpen(true);
            }
          });
        }
      })
      .catch((err) => {});
  };

  const StudentDetail = ({ student }) => {
    return (
      <>
        <Dialog
          onClose={handleClose}
          aria-labelledby="simple-dialog-title"
          open={open}
        >
          <DialogTitle
            id="simple-dialog-title"
            style={
              student
                ? { background: "#512da8", color: "#fff" }
                : { background: "#f44336", color: "#fff" }
            }
          >
            Student Details {student ? "" : "Not Found"}
          </DialogTitle>
          {student ? (
            <Card>
              <CardHeader
                title={
                  <span style={{ fontSize: "18px" }}>
                    Name : {student?.name}
                  </span>
                }
                subheader={
                  <div
                    style={{
                      textAlign: "start",
                    }}
                  >
                    <p>Class : {student?.class}</p>
                    <p>Age : {student?.age}</p>
                    <p>Roll Number : {student?.id}</p>
                    <p>City : {student?.city}</p>
                  </div>
                }
              />
            </Card>
          ) : (
            ""
          )}
        </Dialog>
      </>
    );
  };
  const SearchBox = () => {
    return (
      <div style={{ display: "flex", margin: "10px" }}>
        <TextField
          name="search"
          label="Search with ID"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
        <Button
          style={{ marginLeft: "10px" }}
          variant="outlined"
          size="small"
          color="primary"
          onClick={() => {
            getStudent(search);
          }}
        >
          Search
        </Button>
      </div>
    );
  };
  return (
    <div style={{ width: "50%" }}>
      <h1
        style={{
          margin: "5px",
          background: "#f50057",
          boxShadow: "2px 2px 10px #757575",
          borderRadius: "5px",
        }}
      >
        <span style={{ margin: "5px 30px" }}>Students</span>
      </h1>
      <SearchBox />

      <List
        style={{ marginLeft: "20px" }}
        component="nav"
        aria-label="main mailbox folders"
      >
        {students?.map((student) => {
          return (
            <ListItem button>
              <ListItemText
                onClick={() => {
                  getStudent(student.id);
                }}
                primary={`${student.id}. ${student.name}`}
              />
            </ListItem>
          );
        })}
      </List>
      <Button
        variant="contained"
        color="secondary"
        style={{ margin: "10px" }}
        onClick={() => getStudents()}
      >
        Refresh
      </Button>
      <StudentDetail student={student} />
    </div>
  );
};
export default Students;
