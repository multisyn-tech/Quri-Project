import React, { useState,useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaPaperPlane } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import {  fetchPeopleByTableID } from '../../../features/billSplit/billSlice';

const SharingPayCode = () => {
    const [selectedPeople, setSelectedPeople] = useState([]);
    const [isBtnSelect, setisBtnSelect] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const order = useSelector((state) => state.orders.order.order);
    const tableID = order ? order.TableID : null;
    // Fetch the people data from the backend using Redux
    const people = useSelector((state) => state.BillSplit.people);
   
    
    const loading = useSelector((state) => state.BillSplit.loading);


    useEffect(() => {
        if (tableID) {
            dispatch(fetchPeopleByTableID(tableID));
        }
    }, [dispatch, tableID]);



    const handlePersonClick = (person) => {
        setSelectedPeople(prevSelected => {
            if (prevSelected.includes(person)) {
                return prevSelected.filter(p => p !== person);
            } else {
                return [...prevSelected, person];
            }
        });
    };

    const handleEditClick = () => {
        setisBtnSelect(true);
        setTimeout(() => {
            setisBtnSelect(false);
            // Navigate back without triggering unintended state changes
            navigate('/quri/home/bill', { state: { showModal: true, avoidAutoIncrement: true } });
        }, 300);
    };

    const sharingCode = () => {
        console.log("share code");
    };

    return (
        <div className="flex flex-col items-center space-y-4 p-4">
            <button className={`w-full py-2 bg-white text-black rounded-xl mt-2 font-bold border border-gray-300 transition-transform ease-out duration-300 ${isBtnSelect ? 'transform scale-105 opacity-90' : ''}`}
                onClick={handleEditClick}
            >
                Edit Split
            </button>
            
            {loading ? (
                <div>Loading...</div>
            ) : people.length > 0 ? (
                people.map((person, index) => (
                    <div key={person.Id || index} className="flex items-center space-x-4 w-full">
                        {person.Name ? (
                            <>
                                <button
                                    className={`flex justify-center items-center py-2 px-4 rounded-lg w-full text-lg transition ease-out duration-300 ${
                                        selectedPeople.includes(person.Name)
                                            ? 'bg-gradient-to-r from-orange-500 to-yellow-400 text-white shadow-[0px_7px_21px_0px_rgba(0,0,0,0.14)]'
                                            : 'bg-white text-black border border-orange-500'
                                    }`}
                                    onClick={() => handlePersonClick(person.Name)}
                                >
                                    PAY FOR {person.Name.toUpperCase()}
                                </button>
                                {!selectedPeople.includes(person.Name) && (
                                    <button onClick={sharingCode}><FaPaperPlane className="text-orange-500 text-2xl" /></button>
                                )}
                            </>
                        ) : (
                            <div>No name available</div>
                        )}
                    </div>
                ))
            ) : (
                <div>No people found for this table.</div>
            )}
        </div>
    );
};

export default SharingPayCode;