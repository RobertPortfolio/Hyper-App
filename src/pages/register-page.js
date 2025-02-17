import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser, resetError } from '../redux/slices/user-slice';
import ErrorToast from '../components/error-toast';
import { Eye, EyeOff } from 'lucide-react';

const RegisterPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, user } = useSelector((state) => state.user);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);

    const [passwordError, setPasswordError] = useState(null);

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

    const validatePassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validatePassword(formData.password)) {
            setPasswordError('Пароль должен содержать минимум 8 символов, 1 цифру, 1 заглавную и 1 строчную букву.');
            return;
        }
        setPasswordError('');
        await dispatch(registerUser(formData));
        if(user || !error || !loading){
            navigate('/plan-mesocycle');
        }
    };

    return (
        <div className="register-page p-3">
            <h2>Регистрация</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group mt-4">
                    <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} className="form-control input-custom text-light text-center rounded-0" placeholder="Имя пользователя" autoComplete="username" required />
                </div>
                <div className="form-group mt-2">
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="form-control input-custom text-light text-center rounded-0" placeholder="Email" autoComplete="email" required />
                </div>
                <div className="form-group mt-2 position-relative">
                    <input type={showPassword ? 'text' : 'password'} id="password" name="password" value={formData.password} onChange={handleChange} className="form-control input-custom text-light text-center rounded-0" placeholder="Пароль" autoComplete="new-password" required />
                    <span className="position-absolute top-50 end-0 translate-middle-y me-3" onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer' }}>
                        {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                    </span>
                </div>
                {passwordError && <div className='text-danger small mt-1'>{passwordError}</div>}
                <div className='d-flex text-center my-4'>
                    <button type="submit" className="btn-main flex-grow-1" disabled={loading}>{loading ? 'Регистрация...' : 'Регистрация'}</button>
                </div>
                <div className="text-center">
                    Уже есть аккаунт? <Link to="/login" className="text-decoration-none">Войти</Link>
                </div>
                {error && (<ErrorToast message={error} onClose={handleResetError} />)}
            </form>
        </div>
    );
};

export { RegisterPage };
