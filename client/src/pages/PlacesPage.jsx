import { Link } from "react-router-dom";
import AccountNav from "../AccountNav";
import { useEffect } from "react";
import axios from 'axios';
import { useState } from "react";
// import PlacesFormPage from "./PlacesFormPage";

export default function PlacesPage() {
  const [places, setPlaces] = useState([]);
  useEffect(() => {
    axios.get('/user-places').then(({ data }) => {
      setPlaces(data);
    });
  }, [])
  return (
    <div>
      <AccountNav />
      <div className="text-center">
        <Link className="inline-flex gap-2 bg-primary text-white py-2 px-6 rounded-full" to={"/account/places/new"}>
          Airbnb Setup
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </Link>
      </div>

      {/* Actual List of Places */}
      <div className="mt-4">
        {places.length > 0 && places.map(place => (
          // eslint-disable-next-line react/jsx-key
          <Link to={'/account/places/' + place._id} className="flex cursor-pointer gap-4 bg-gray-100 p-4 rounded-2xl">
            {/* Photos */}
            <div className="flex w-32 h-32 bg-gray-300 grow shrink-0 rounded-xl">
              {place.photos.length > 0 && (
                <img className="object-cover rounded-xl" src={'http://localhost:4000/uploads/' + place.photos[0]} alt="" />
              )}
            </div>
            <div className="grow-0 shrink">
              {/* Place Title */}
              <h2 className="text-xl">{place.title}</h2>
              {/* Description */}
              <p className="text-sm mt-2">{place.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
