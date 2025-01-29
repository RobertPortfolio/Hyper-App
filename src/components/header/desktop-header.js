import React from 'react';
import { Link } from 'react-router-dom';

const DesktopHeader = () => {
    return (
        <div>
            <ul>
                <li>
                    <Link to="/current-workout">Current Workout</Link>
                </li>
                <li>
                    <Link to="/mesocycles">Mesocycles</Link>
                </li>
                <li>
                    <Link to="/custom-exercises">Custom Exercises</Link>
                </li>
                <li>
                    <Link to="/templates">Templates</Link>
                </li>
            </ul>
        </div>
    )
}

export default DesktopHeader;