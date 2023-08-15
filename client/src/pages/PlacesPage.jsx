import { Link, useParams } from "react-router-dom";

export default function PlacesPage() {
  const { action } = useParams();
  return (
    <div>
      <div className="text-center">
        {action !== 'new' && (
          <Link className="inline-flex gap-2 bg-primary text-white py-2 px-6 rounded-full" to={'/account/places/new'}>
            Airbnb Setup
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </Link>
        )}
      </div>
      {action === 'new' && (
        <div>
          <form>
            <h2 className="text-xl mt-4">Title</h2>
            <p className="text-sm text-gray-500">Title for your place, should be catchy and crisp.</p>
            <input type="text" placeholder="title, for eg. My Lovely Castle" />
            <h2 className="text-xl mt-4">Address</h2>
            <p className="text-sm text-gray-500">Address to your cozy place!</p>
            <input type="text" placeholder="address" />
            <h2>Photos</h2>
            <p className="text-sm text-gray-500">More, the better!</p>
            <div className="flex gap-2">
              <input type="text" placeholder={'Add using a link... jpg/jpeg'} />
              <button className="bg-primary text-white px-4 rounded-2xl">Add&nbsp;Photo</button>
            </div>
            <div className="mt-2 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              <button className="flex gap-1 justify-center border bg-transparent rounded-2xl p-8 text-2xl text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                </svg>
                Upload
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}