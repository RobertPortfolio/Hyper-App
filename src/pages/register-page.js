import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser, resetError } from '../redux/slices/user-slice';
import ErrorToast from '../components/error-toast';

const RegisterPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, user } = useSelector((state) => state.user);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });

    const handleResetError = () => {
        dispatch(resetError());
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await dispatch(registerUser(formData));
        if(user || !error || !loading){
            navigate('/plan-mesocycle');
        }
    };

    return (
        <div className="register-page p-3">
            <h2>Регистрация</h2>
            <form onSubmit={handleSubmit}>
                {/* Username */}
                <div className="form-group mt-4">
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="form-control input-custom text-light text-center rounded-0"
                        placeholder="Имя пользователя"
                        autoComplete="username"
                        required
                    />
                </div>

                {/* Email */}
                <div className="form-group mt-2">
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-control input-custom text-light text-center rounded-0"
                        placeholder="Email"
                        autoComplete="email" 
                        required
                    />
                </div>

                {/* Password */}
                <div className="form-group mt-2">
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="form-control input-custom text-light text-center rounded-0"
                        placeholder="Пароль"
                        autoComplete="new-password"
                        required
                    />
                </div>

                {/* Submit Button */}
                <div className='d-flex text-center my-4'>
                    <button type="submit" className="btn-main flex-grow-1" disabled={loading}>
                        {loading ? 'Регистрация...' : 'Регистрация'}
                    </button>
                </div>
                
                {/* Логин */}
                <div className="text-center">
                    Уже есть аккаунт? <Link to="/login" className="text-decoration-none">Войти</Link>
                </div>

                {/* Ошибка */}
                {error && (
                    <ErrorToast message={error} onClose={handleResetError} />
                )}
            </form>
        </div>
    );
};

export { RegisterPage };