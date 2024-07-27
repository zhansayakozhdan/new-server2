"use client"
import EventSearch from '@/components/shared/EventSearch';
import React from 'react';


const SearchPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="mx-auto">
                {/* <h5 className="text-3sm text-center mb-2">ИИ будет использовать эти данные для подбора подходящих для вас <span className='font-bold'>IT мероприятий</span></h5> */}
                <EventSearch />
            </div>
        </div>
    );
};

export default SearchPage;











// import React, { useState } from 'react'
// import axios from 'axios'

// const Search = () => {
//     const [input, setInput] = useState('');
//     const [output, setOutput] = useState('');
//     const [endPoint, setEndpoint] = useState('openai')

//     const handleSubmit = async (e) => {
//         e.preventDefault()
//         axios.post('http://localhost:5000/api/v1/embeddings/query-embedding', {query: input}).then((resp) => {
//             // setOutput(
//             //     // <p>
//             //     //     {res.data.response}
//             //     // </p>
//             // )
//         })
//     }
//   return (
//     <div>
      
//     </div>
//   )
// }

// export default Search
