import { useContext } from 'react';
import { UserContext } from "../UserContext";
import { Navigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import PlacesPage from './PlacesPage';
import AccountNav from '../AccountNav';

export default function ProfilePage() {
  const [redirect, setRedirect] = useState(null);
  const { ready, user, setUser } = useContext(UserContext);
  let { subpage } = useParams();
  if (subpage === undefined) {
    subpage = 'profile';
  }

  async function logout() {
    await axios.post('/logout');
    setUser(null);
    setRedirect('/');
  }

  if (!ready) {
    return "Loading...";
  }

  if (ready && !user) {
    return <Navigate to={'/login'} />
  }

  if (redirect) {
    <Navigate to={redirect} />
  }

  return (
    <div>
      <AccountNav />

      {subpage === 'profile' && (
        <div className='text-center max-w-lg mx-auto'>
          Logged in as {user.firstName} ({user.email})
          <button onClick={logout} className='primary max-w-sm mt-2'>Logout</button>
        </div>
      )}

      {subpage === 'places' && (
        <PlacesPage />
      )}

    </div>
  )
}