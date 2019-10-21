import React, { useState, useEffect } from 'react';
import '../styles/MarthaCalendar.css';

const numberOfDays = 5;
const minStartTime = 800;
const taskSizes = {
    'C': 1,
    'F': 2,
    'RC': 3,
};
const tasks = {
    'C': 'Cleaning',
    'F': 'Filling',
    'RC': 'Root Canal',
};
const days = {0: 'Monday', 1: 'Tuesday', 2: 'Wednesday', 3: 'Thursday', 4: 'Friday'}
const maxTasksPerDay = 16;
const daysArray = new Array(numberOfDays).fill([]);
const daysWithTasksArray = daysArray.map(() => new Array(maxTasksPerDay).fill({assignedTask: null, available: true }));

const MarthaCalendar = () => {
    const initialState = daysWithTasksArray;
    const [calendarState, setCalendarState] = useState(initialState);
    const [taskId, setTaskId] = useState('C');
    const taskSelected = (taskId) => () => {
        setTaskId(taskId);
        const clonedCalendarState = [...calendarState];
        const taskSize = taskSizes[taskId];
        clonedCalendarState.forEach((daySlots) => {
            for (let slot=0; slot<daySlots.length - taskSize; slot++) {
                let slotAvailable = true;
                for (let size = 0; size<taskSize; size++) {
                    if (daySlots[slot+size].assignedTask !== null) {
                        slotAvailable = false;
                        break;
                    }
                }
                daySlots[slot] = {available: slotAvailable, assignedTask: daySlots[slot].assignedTask};
            }
        });

        setCalendarState(clonedCalendarState);
    }

    const slotSelected = (dayIndex, slotIndex) => () => {
        const clonedCalendarState = [...calendarState];
        for (let slot = 0; slot < taskSizes[taskId]; slot++) {
            clonedCalendarState[dayIndex][slotIndex + slot] = {assignedTask: taskId, available: false};
        }

        setCalendarState(clonedCalendarState);
    }

    useEffect(() => {
        console.log(calendarState);
    }, [calendarState])
    const getTime = (slotIndex) => {
        const additionalTime = ((slotIndex*100)*0.5);
        const coordinatedTime = minStartTime+additionalTime;
        const actualMilitaryTime = coordinatedTime % 100 === 50 ? coordinatedTime - 20 : coordinatedTime;
        const normalTime = actualMilitaryTime > 1230 ? actualMilitaryTime - 1200 : actualMilitaryTime;
        const setTime = (normalTime/100).toFixed(2);
        const clock = actualMilitaryTime > 1159 ? ' pm' : ' am';
        const time = setTime + clock;
        return time;
    }
    return (
        <div className='container'>
            <div className='tasks' >
                {Object.keys(tasks).map((currentTaskId) => <button key={currentTaskId} className={currentTaskId === taskId ? 'selected' : ''} onClick={taskSelected(currentTaskId)}>{tasks[currentTaskId]}</button>)}
            </div>
            <div className='calendar'>
                <table className="calendar-table">
                    <tbody>
                        {daysWithTasksArray.map((dayWithTasks, dayIndex) => {
                            return(
                                <tr key={dayIndex} className="calendar-table-row">
                                    <td className="calendar-day">{days[dayIndex]}</td>
                                    <td className="calendar-slots">
                                        <ul className="calendar-slot-list">
                                            {dayWithTasks.map((task, slotIndex) => <li key={dayIndex + "-" + slotIndex} className={task.available?'available':'unavailable'} onClick={slotSelected(dayIndex, slotIndex)}>{getTime(slotIndex)}</li>)}
                                        </ul>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default MarthaCalendar;