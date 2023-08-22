import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import Perks from "../Perks";
import axios from "axios";
import PhotosUploader from "../PhotosUploader";

export default function PlacesPage() {
  const { action } = useParams();
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  // const [photoLink, setPhotoLink] = useState("");
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  const [redirect, setRedirect] = useState('');

  function inputHeader(text) {
    return <h2 className="text-xl mt-4">{text}</h2>;
  }

  function inputDescription(text) {
    return <p className="text-sm text-gray-500">{text}</p>;
  }

  function preInput(header, description) {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  }

  async function addNewPlace(ev) {
    ev.preventDefault();
    await axios.post('/places', {
      title, address, addedPhotos, 
      description, perks, extraInfo, 
      checkIn, checkOut, maxGuests
    });
    setRedirect('/account/places');
  }

  if(redirect) {
    return <Navigate to={redirect} />
  }

  return (
    <div>
      <div className="text-center">
        {action !== "new" && (
          <Link
            className="inline-flex gap-2 bg-primary text-white py-2 px-6 rounded-full"
            to={"/account/places/new"}
          >
            Airbnb Setup
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </Link> 
        )}
      </div>
      {action === "new" && (
        // className="max-w-5xl mx-auto"
        <div className="mx-auto max-w-7xl">
          <form onSubmit={addNewPlace} className="bg-white shadow-md rounded-3xl px-8 pt-6 pb-8 mb-4">
            {/* Title */}
            {preInput(
              "Title",
              "Title for your place, should be catchy and crisp."
            )}
            <input
              type="text"
              value={title}
              onChange={(ev) => setTitle(ev.target.value)}
              placeholder="title, for eg. My Lovely Castle"
            />
            {/* Address */}
            {preInput("Address", "Address to your cozy place!")}
            <input
              type="text"
              value={address}
              onChange={(ev) => setAddress(ev.target.value)}
              placeholder="address"
            />
            {/* Photos */}
            {preInput("Photos", "More, the better!")}
            <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />

            {/* Description */}
            {preInput(
              "Description",
              "Describe your place. (Pro Tip?, Make it sound magnificent"
            )}
            <textarea
              value={description}
              onChange={(ev) => setDescription(ev.target.value)}
            />
            {/* Perks */}
            {preInput("Perks", "Check all that apply!")}
            <div className="grid gap-2 grid-cols-2 md:grid-cols-4 lg:grid-cols-6 mt-1">
              {/* File below you can find in the src folder itself, you can click control & click on the link to go on that page*/}
              <Perks selected={perks} onchange={setPerks} />
            </div>
            {/* Extra Info */}
            {preInput("Extra Info", "Whatever more you can think off!")}
            <textarea
              value={extraInfo}
              onChange={(ev) => setExtraInfo(ev.target.value)}
            />
            {/* CheckIN & CheckOUT & MAX-GUESTS */}
            {preInput("Check-in & out.", "User, should not miss!")}
            <div className="grid gap-2 sm:grid-cols-3">
              <div>
                <h3 className="mt-2 -mb-1">Check-in time</h3>
                <input
                  value={checkIn}
                  onChange={(ev) => setCheckIn(ev.target.value)}
                  type="text"
                  placeholder="10:00 AM (Format)"
                />
              </div>
              <div>
                <h3 className="mt-2 -mb-1">Check-out time</h3>
                <input
                  value={checkOut}
                  onChange={(ev) => setCheckOut(ev.target.value)}
                  type="text"
                  placeholder="10:00 AM (Format)"
                />
              </div>
              <div>
                <h3 className="mt-2 -mb-1">Total guests</h3>
                <input
                  value={maxGuests}
                  onChange={(ev) => setMaxGuests(ev.target.value)}
                  type="text"
                  placeholder="7"
                />
              </div>
            </div>

            {/* Button */}
            <div>
              <button className="primary my-4">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
