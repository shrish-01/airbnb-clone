import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Perks from "../Perks";
import axios from "axios";

export default function PlacesPage() {
  const { action } = useParams();
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [photoLink, setPhotoLink] = useState("");
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);

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

  async function addPhotoByLink(ev) {
    ev.preventDefault();
    const { data: filename } = await axios.post("/upload-by-link", {
      link: photoLink,
    });
    setAddedPhotos(prev => {
      return [...prev, filename];
    });
    setPhotoLink('');
  }

  function uploadPhoto(ev) {
    const files = ev.target.files;
    // console.log({files});
    const data = new FormData();
    for(let i = 0; i < files.length; i++) {
      data.append('photos', files[i]);
    }
    axios.post('/upload', data, {
      headers: {'Content-Type': 'multipart/form-data'}
    }).then(response => {
      const {data: filenames} = response;
      setAddedPhotos(prev => {
        return [...prev, ...filenames];
      });
    });
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
          <form className="bg-white shadow-md rounded-3xl px-8 pt-6 pb-8 mb-4">
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
            <div className="flex gap-2">
              <input
                type="text"
                value={photoLink}
                onChange={(ev) => setPhotoLink(ev.target.value)}
                placeholder={"Add using a link... jpg/jpeg"}
              />
              <button
                onClick={addPhotoByLink}
                className="bg-primary text-white px-4 grow rounded-2xl"
              >
                Add&nbsp;Photo
              </button>
            </div>
            <div className="mt-2 grid gap-2 grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {addedPhotos.length > 0 && addedPhotos.map(link => (
                // eslint-disable-next-line react/jsx-key
                <div className="h-32 flex" key={link}>
                  <img className="rounded-2xl w-full object-cover" src={'http://localhost:4000/uploads/' + link} alt="" />
                </div>
              ))}
              <label className="h-32 cursor-pointer flex items-center gap-1 justify-center border bg-transparent rounded-2xl p-8 text-xl text-gray-600">
                <input type="file" multiple className="hidden" onChange={uploadPhoto} />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-7 h-7"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                  />
                </svg>
                Upload
              </label>
            </div>
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
