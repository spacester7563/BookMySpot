import React from 'react'

function NavBar() {
  return (
<div>
  <div className="bg-white shadow-md py-6 flex justify-between">
    <div className='text-3xl text-blue-500 font-bold pl-4'>Book My Event</div>
    <div className="flex">
      <a href="future.js" className="text-lg px-4 hover:text-blue-500">Future Events</a>
      <a href="past.js" className="text-lg px-4 hover:text-blue-500">Past Events</a>
      <a href="./Events.js" className="text-lg px-4 hover:text-blue-500">All Events</a>
    </div>
  </div>
</div>

  )
}

export default NavBar
