import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '../../redux/slices/theme-slice';

const ThemeSwitch = () => {
    const dispatch = useDispatch();
    const theme = useSelector((state) => state.theme.theme);

    // Устанавливаем тему при первой загрузке
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        dispatch(setTheme(savedTheme)); // Устанавливаем тему в Redux
        document.documentElement.setAttribute('data-theme', savedTheme); // Устанавливаем атрибут
    }, [dispatch]);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        dispatch(setTheme(newTheme));
        document.documentElement.setAttribute('data-theme', newTheme); // Устанавливаем атрибут
        localStorage.setItem('theme', newTheme); // Сохраняем тему в localStorage
    };

    return (
        <button onClick={toggleTheme}>
            Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
        </button>
    );
};

export default ThemeSwitch;