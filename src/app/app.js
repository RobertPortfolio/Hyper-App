import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initializeUser } from '../redux/slices/user-slice';
import { getExercisesThunk } from '../redux/slices/exercises-slice';
import { getTemplatesThunk } from '../redux/slices/templates-slice';
import { getMesocyclesThunk } from '../redux/slices/mesocycles-slice';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Header, Sidebar } from '../components/header';
import Spinner from '../components/spinner';
import ProtectedRoute from '../components/protected-route';
import {
    CustomExercisesPage,
    RegisterPage,
    LoginPage,
    LogoutPage,
    TemplatesPage,
    CreateCustomTemplatePage,
    CreateMesocyclePage,
    MesocyclesPage,
    CurrentWorkoutPage,
    PlanNewMesocyclePage,
} from '../pages';

const App = () => {

    const dispatch = useDispatch();
    const location = useLocation();
    const fullWidthPages = ["/templates/create-custom-template", "/create-mesocycle/"];
    const isFullWidth = fullWidthPages.some((path) => location.pathname.startsWith(path));

    const { isAuthenticated, loading, user } = useSelector((state) => state.user);

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(initializeUser());
        }
    }, [dispatch, isAuthenticated]);

    useEffect(() => {
        if (user && user._id) {
            dispatch(getExercisesThunk(user._id));
            dispatch(getTemplatesThunk(user._id));
            dispatch(getMesocyclesThunk(user._id));
        }
    }, [user, dispatch]);

    if (loading) {
        return <Spinner />;
    }

    return (
        <div>
            <Header />
            <Sidebar />
            <div className='layout'>
                <div className={`content ${isFullWidth ? "full-width" : "limited-width"}`}>
                    <Routes>
                        <Route path="/login" element={<LoginPage />}/>
                        <Route path="/register" element={<RegisterPage />}/>
                        <Route element={<ProtectedRoute />}>
                            <Route path="/" element={<div>Homepage</div>} />
                            <Route path="/custom-exercises" element={<CustomExercisesPage />} />
                            <Route path="/templates" element={<TemplatesPage />} />
                            <Route path="/mesocycles" element={<MesocyclesPage />} />
                            <Route path="/current-workout" element={<CurrentWorkoutPage />} />
                            <Route path="/templates/create-custom-template" element={<CreateCustomTemplatePage />} />
                            <Route path="/create-mesocycle/:id" element={<CreateMesocyclePage />} />
                            <Route path="/plan-mesocycle" element={<PlanNewMesocyclePage />} />
                            <Route path="/logout" element={<LogoutPage />}/>
                        </Route>
                    </Routes>
                </div>
            </div>
            
        </div>
    )
}

export default App;