import { useQuery, gql } from "@apollo/client";
// components
import { Login } from "../components/login";

const GET_USERS = gql`
  query GetUsers {
    getUsers {
      _id
      email
      name
      password
      userName
    }
  }
`;

export const AppLayout = () => {
  const { loading, error, data } = useQuery(GET_USERS);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;
  console.log("Data: ", data);
  return (
    <div>
      <Login />
      <h1>Users</h1>
      <ul>
        {data.getUsers.map((user) => (
          <li key={user.id}>
            {user.userName} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
};
