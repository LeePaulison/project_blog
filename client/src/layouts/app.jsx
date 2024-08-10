import { useQuery, gql } from "@apollo/client";
// components
import { Login } from "../components/login";
import { FirebaseAuth } from "../firebase/firebaseAuth";

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      userName
      email
    }
  }
`;

export const AppLayout = () => {
  const { loading, error, data } = useQuery(GET_USERS);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;
  console.log(data.users);
  return (
    <div>
      <Login />
      <FirebaseAuth />
      <h1>Users</h1>
      <ul>
        {data.users.map((user) => (
          <li key={user.id}>
            {user.userName} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
};
