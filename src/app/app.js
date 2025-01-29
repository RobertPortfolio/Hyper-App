import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initializeUser } from '../redux/slices/user-slice';
import { getExercisesThunk } from '../redux/slices/exercises-slice';
import { getTemplatesThunk } from '../redux/slices/templates-slice';
import { getMesocyclesThunk } from '../redux/slices/mesocycles-slice';
import { Routes, Route } from 'react-router-dom';
import LanguageSwitch from '../components/language-switch';
import Header from '../components/header';
import Spinner from '../components/spinner';
import ProtectedRoute from '../components/protected-route';
import {
    TestPage,
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
    const { isAuthenticated, loading, user } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(initializeUser());
    }, [dispatch]);

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
            <Routes>
                <Route path="/login" element={<LoginPage />}/>
                <Route path="/register" element={<RegisterPage />}/>
                <Route element={<ProtectedRoute />}>
                    <Route path="/" element={ <div>Home</div>} />
                    <Route path="/test" element={<TestPage />} />
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
    )
}

export default App;