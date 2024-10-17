import React, { useState } from 'react';

const faqs = [
  {
    question: 'What are the common security challenges in Web3 development, and how can I avoid them?',
    answer: 'create solutions that can make a meaningful impact in the tech community.',
  },
  {
    question: 'What types of projects does Team Emosort focus on?',
    answer: 'web development, IoT solutions, artificial intelligence, blockchain, and mobile apps, always aiming to enhance user experiences and push the boundaries of technology.',
  },
  {
    question: 'How does Team Emosort collaborate and grow as a team?',
    answer: 'We believe in continuous learning and collaboration. We share ideas, tackle challenges together, and participate in events like hackathons.',
  },
];

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div id="faq" className="bg-gray-950 text-white py-10 px-6">

       <div className="flex justify-center items-center mb-8 mt-20">

       <div className="h-1 w-8 bg-blue-500"></div>
        <h2 className="text-blue-500 text-lg font-extrabold uppercase tracking-wide ml-2 mr-2">QUESTIONS & ANSWERS 
        </h2>
        <div className="h-1 w-8 bg-blue-500"></div>
      </div>

      <h2 className="text-center text-4xl font-extrabold mb-10">FREQUENTLY ASKED QUESTIONS</h2>
      <div className="max-w-4xl mx-auto">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-[#1c1f23] rounded-md mb-4">
            <button 
              onClick={() => toggleFAQ(index)} 
              className="w-full flex justify-between items-center p-4 text-left text-lg font-medium text-gray-300 hover:text-white">
              <span>{faq.question}</span>
              <span className="text-gray-500">{activeIndex === index ? '-' : '+'}</span>
            </button>
            {activeIndex === index && (
              <div className="px-4 pb-4 text-gray-400">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQSection;
