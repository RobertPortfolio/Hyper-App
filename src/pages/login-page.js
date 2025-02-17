import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, resetError } from '../redux/slices/user-slice';
import ErrorToast from '../components/error-toast';
import { Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, loading, error } = useSelector((state) => state.user);

    const [formData, setFormData] = useState({
        emailOrUsername: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleResetError = () => {
        dispatch(resetError());
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await dispatch(loginUser(formData));
        if(user || !error || !loading){
            navigate('/current-workout');
        }
    };

    return (
        <div className="register-page p-3">
            <h2>Вход</h2>
            <form onSubmit={handleSubmit}>
                {/* Username */}
                <div className="form-group mt-4">
                    <input
                        type="text"
                        name="emailOrUsername"
                        value={formData.emailOrUsername}
                        onChange={handleChange}
                        className="form-control input-custom text-light text-center rounded-0"
                        placeholder="Имя пользователя или email"
                        autoComplete="username" 
                        required
                    />
                </div>

                {/* Password */}
                <div className="form-group mt-2 position-relative">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="form-control input-custom text-light text-center rounded-0"
                        placeholder="Пароль"
                        autoComplete="current-password"
                        required
                    />
                    <span className="position-absolute top-50 end-0 translate-middle-y me-3" onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer' }}>
                        {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                    </span>
                </div>

                {/* Submit Button */}
                <div className="d-flex text-center my-4">
                    <button type="submit" className="btn-main flex-grow-1" disabled={loading}>
                        {loading ? 'Вход...' : 'Вход'}
                    </button>
                </div>

                {/* Регистрация */}
                <div className="text-center">
                    Нет аккаунта? <Link to="/register" className="text-decoration-none">Зарегистрироваться</Link>
                </div>

                {/* Ошибка */}
                {error && (
                    <ErrorToast message={error} onClose={handleResetError} />
                )}
            </form>
        </div>
    );
};

export { LoginPage };