import { useState } from "react";
import axios from 'axios';
import Perks from "../Perks";
import PhotosUploader from "../PhotosUploader";
import AccountNav from "../AccountNav";
import { Navigate, useParams } from "react-router-dom";
import { useEffect } from "react";

export default function PlacesFormPage() {

    const { id } = useParams();
    console.log(id);
    const [title, setTitle] = useState("");
    const [address, setAddress] = useState("");
    const [addedPhotos, setAddedPhotos] = useState([]);
    const [description, setDescription] = useState("");
    const [perks, setPerks] = useState([]);
    const [extraInfo, setExtraInfo] = useState("");
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [maxGuests, setMaxGuests] = useState(1);
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/places/' + id).then(response => {
            const { data } = response;
            setTitle(data.title);
            setAddress(data.address);
            setAddedPhotos(data.photos);
            setDescription(data.description);
            setPerks(data.perks);
            setExtraInfo(data.extraInfo);
            setCheckIn(data.checkIn);
            setCheckOut(data.checkOut);
            setMaxGuests(data.maxGuests);
        });
    }, [id]);

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

    async function savePlace(ev) {
        ev.preventDefault();
        const placeData = {
            title, address, addedPhotos,
            description, perks, extraInfo,
            checkIn, checkOut, maxGuests
        }
        if (id) {
            // Update
            await axios.put('/places', {
                id, ...placeData
            });
            setRedirect(true);
        } else {
            // New Place
            await axios.post('/places', {
                ...placeData
            });
            setRedirect(true);
        }
    }

    if (redirect) {
        return <Navigate to={'/account/places'} />
    }

    return (
        <div className="mx-auto max-w-7xl">
            <AccountNav />
            <form onSubmit={savePlace} className="bg-white shadow-md rounded-3xl px-8 pt-6 pb-8 mb-4">
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
    );
}