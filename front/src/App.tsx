import React, { useEffect, useState } from 'react';
import './App.css';
import { Container, Table } from 'react-bootstrap';
import { UserDto } from './dto/UserDto';
import axios from 'axios';

function App() {
  const [users, setUsers] = useState(new Array<UserDto>());

  useEffect(() => {
    (async () => {
      const res = await axios.get(
        (process.env.REACT_APP_SERVER_URL ?? 'SERVER_URL') + '/users'
      );
      setUsers(res.data);
    })();
  }, []);

  return (
    <Container className="pt-5">
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>名前</th>
            <th>参加日</th>
            <th>離脱日</th>
            <th>コメント</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            return (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.joined_at}</td>
                <td>{user.left_at}</td>
                <td>{user.comment}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Container>
  );
}

export default App;
