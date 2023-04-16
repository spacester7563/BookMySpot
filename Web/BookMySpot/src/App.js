import { useState } from "react";
import React from "react";
import { BrowserRouter } from 'react-router-dom';
import InputParameter from "./components/InputParameter";
import Past from "./components/Past";
import Events from "./components/Events";
import Future from "./components/Future";

function App() {

  const [activeTab, setActiveTab] = useState('future');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <BrowserRouter>
      <div >
        <div className="bg-gradient-to-t bg-white h-screen">
          <div>
            <div className="bg-white shadow-md py-6 flex justify-between">
              <div className='text-3xl text-blue-500 font-bold pl-4'>Book My Spot</div>
              <div className="flex">
                <a  onClick={() => handleTabClick('create')} className="text-base px-2 hover:text-blue-500">Create Event</a>
                <a  onClick={() => handleTabClick('future')} className="text-base px-2 hover:text-blue-500">Upcoming Events</a>
                <a  onClick={() => handleTabClick('past')} className="text-base px-2 hover:text-blue-500">Past Events</a>
                <a  onClick={() => handleTabClick('events')} className="text-base px-2 hover:text-blue-500">Ongoing Events</a>
               
              </div>
            </div>
          </div>
          {activeTab === 'create' && <InputParameter />}
          {activeTab === 'events' && <Events />}
          {activeTab === 'future' && <Future />}
          {activeTab === 'past' && <Past />}
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
