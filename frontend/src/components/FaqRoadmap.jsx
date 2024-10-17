// import React from 'react';
// import PhaseSlider from './PhaseSlider';

// const FaqRoadmap = () => {
//   return (
//     <div className="bg-black text-white py-16 px-10">
//       {/* FAQ Section */}
//       <div className="md:flex justify-between mb-12 gap-6">
//         {/* Card 1 */}
//         <div className="md:w-1/3 mb-6 md:mb-0 bg-gray-800 rounded-lg p-6 shadow-lg transition duration-300 ease-in-out transform hover:bg-gray-700 hover:shadow-xl">
//           <h3 className="text-xl font-bold mb-4">What is Lorem Ipsum?</h3>
//           <p>Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.</p>
//         </div>
        
//         {/* Card 2 */}
//         <div className="md:w-1/3 mb-6 md:mb-0 bg-gray-800 rounded-lg p-6 shadow-lg transition duration-300 ease-in-out transform hover:bg-gray-700 hover:shadow-xl">
//           <h3 className="text-xl font-bold mb-4">What is Lorem Ipsum?</h3>
//           <p>Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure.</p>
//         </div>
        
//         {/* Card 3 */}
//         <div className="md:w-1/3 bg-gray-800 rounded-lg p-6 shadow-lg transition duration-300 ease-in-out transform hover:bg-gray-700 hover:shadow-xl">
//           <h3 className="text-xl font-bold mb-4">Where can I get some?</h3>
//           <p>There are many variations of passages of Lorem Ipsum available, but the majority have suffered.</p>
//         </div>
//       </div>

//       {/* Roadmap Section */}
//       <div className="mt-16">
//         <h2 className="text-blue-500 text-xl font-semibold mb-4">OUR GOALS</h2>
//         <h1 className="text-4xl font-bold mb-8">ROADMAP</h1>
//         <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABJEAAAAVCAYAAAD2IH9vAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADdSURBVHgB7d1RDYAwEAVBDhf4F4eMEgSUFcDMb7MGXprcrLWuY2Nm7t2bTqfT6XQ6nU6n0+l0Op3uP915AAAAAEAwIgEAAACQjEgAAAAAJCMSAAAAAMmIBAAAAEAyIgEAAACQ5uvRuTudTqfT6XQ6nU6n0+l0Ot3LTyQAAAAAkhEJAAAAgGREAgAAACAZkQAAAABIRiQAAAAAkhEJAAAAgDTO1ul0Op1Op9PpdDqdTqfT6arzEwkAAACAZEQCAAAAIBmRAAAAAEhGJAAAAACSEQkAAACAZEQCAAAAID0avOqBldUYowAAAABJRU5ErkJggg==" alt="" />
//         <PhaseSlider />
//       </div>
//     </div>
//   );
// };

// export default FaqRoadmap;












import React from 'react';
import PhaseSlider from './PhaseSlider';

const FaqRoadmap = () => {
  return (
    <div id="phaseslider" className="bg-black text-white py-16 px-10">
      {/* FAQ Section */}
      <div className="md:flex justify-between mb-12 gap-6">
        {/* Card 1 */}
        <div className="md:w-1/3 mb-6 md:mb-0 bg-gray-800 rounded-lg p-6 shadow-lg transition duration-300 ease-in-out transform hover:bg-gray-700 hover:shadow-xl">
          <h3 className="text-xl font-bold mb-4">What inspired the creation of Team Emosort?</h3>
          <p>create solutions that can make a meaningful impact in the tech community.</p>
        </div>
        
        {/* Card 2 */}
        <div className="md:w-1/3 mb-6 md:mb-0 bg-gray-800 rounded-lg p-6 shadow-lg transition duration-300 ease-in-out transform hover:bg-gray-700 hover:shadow-xl">
          <h3 className="text-xl font-bold mb-4">What types of projects does Team Emosort focus on?</h3>
          <p>web development, IoT solutions, artificial intelligence, blockchain, and mobile apps, always aiming to enhance user experiences and push the boundaries of technology.</p>
        </div>
        
        {/* Card 3 */}
        <div className="md:w-1/3 bg-gray-800 rounded-lg p-6 shadow-lg transition duration-300 ease-in-out transform hover:bg-gray-700 hover:shadow-xl">
          <h3 className="text-xl font-bold mb-4">How does Team Emosort collaborate and grow as a team?</h3>
          <p>We believe in continuous learning and collaboration. We share ideas, tackle challenges together, and participate in events like hackathons.</p>
        </div>
      </div>

      {/* Roadmap Section */}
      <div className="mt-16">
        <h2 className="text-blue-500 text-xl font-semibold mb-4">OUR GOALS</h2>
        <h1 className="text-4xl font-bold mb-8">ROADMAP</h1>
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABJEAAAAVCAYAAAD2IH9vAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADdSURBVHgB7d1RDYAwEAVBDhf4F4eMEgSUFcDMb7MGXprcrLWuY2Nm7t2bTqfT6XQ6nU6n0+l0Op3uP915AAAAAEAwIgEAAACQjEgAAAAAJCMSAAAAAMmIBAAAAEAyIgEAAACQ5uvRuTudTqfT6XQ6nU6n0+l0Ot3LTyQAAAAAkhEJAAAAgGREAgAAACAZkQAAAABIRiQAAAAAkhEJAAAAgDTO1ul0Op1Op9PpdDqdTqfT6arzEwkAAACAZEQCAAAAIBmRAAAAAEhGJAAAAACSEQkAAACAZEQCAAAAID0avOqBldUYowAAAABJRU5ErkJggg==" alt="" />
        <PhaseSlider />
      </div>
    </div>
  );
};

export default FaqRoadmap;
