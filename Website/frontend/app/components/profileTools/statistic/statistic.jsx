"use client";
import PropTypes from 'prop-types';
import PieChart from './pieChart';
import { useEffect, useState } from 'react';


const Statistic = ({data}) => {
    const pieData = [
        { id: "win", label: "Win", value: data.list_statistic.win, color: "#66FCF1" },
        { id: "lose", label: "Lose", value: data.list_statistic.lose, color: "#989898" },
    ];
    return (
        <div className=' relative h-full w-full flex flex-col justify-between items-center'>
            <span className='h-[20%] mb-[15px] w-full flex items-center justify-center text-2xl text-white '>Statistic</span>
            <div className='flex w-full  h-full bg-profile-bg  justify-around relative text-rfs'>
                <div className="flex h-[80%] w-[50%]  items-center justify-evenly relative text-center">
                    <PieChart data={pieData}/>
                </div>
                <div className='flex h-full  w-[50%] flex-col justify-evenly text-center '>
                    <span className='text-my-grey'>Game Palyed : {data.list_statistic.match}</span>
                    <span className='text-my-grey'>Win rate : {(data.list_statistic.statistic).toFixed(1)}%</span >
                    <span className='text-my-grey'>score of season : {data.list_statistic.score}</span >
                </div>
            </div>
        </div>
    );
};


Statistic.propTypes = {
    data: PropTypes.object.isRequired,
};


export default Statistic;
