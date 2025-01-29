
// Функции для заполнения начальных данных
export const getEmptyExercise = (id) => {
    return {
        targetMuscleGroupId: id,
        exerciseId: '',
    } 
}

export const getEmptyDay = () => {
    return {
        dayId: '',
        exercises: [],
    }
}

// Изменить основные поля
export const handleChangeTemplate = (setTemplateData, e) => {
    const { name, value } = e.target;
    setTemplateData((prevState) => {
        return {
            ...prevState,
            [name]: value,
        };
    })
}

// Изменить поля дней
export const handleChangeDays = (setTemplateData, e, index) => {
    const { name, value } = e.target;
    setTemplateData((prevState) => {
        const updatedDays = [...prevState.days];
        updatedDays[index] = {
            ...updatedDays[index],
            [name]: value,
        };

        return {
            ...prevState,
            days: updatedDays,
        };
    });
};

// Изменить поля упражнений
export const handleChangeExercise = (setTemplateData, e, dayIndex, exerciseIndex) => {
    const { name, value } = e.target;
    setTemplateData((prevState) => {
        const updatedDays = prevState.days.map((day, index) => {
            if (index === dayIndex) {
                const updatedExercises = [...day.exercises];
                updatedExercises[exerciseIndex] = {
                    ...updatedExercises[exerciseIndex],
                    [name]: value,
                };
                return {
                    
                    ...day,
                    exercises: updatedExercises,
                };
            }
            return day;
        });

        return {
            ...prevState,
            days: updatedDays,
        };
    });
};

// Добавить день
export const handleAddDay = (setTemplateData) => {
    setTemplateData((prevState) => {
        return {
            ...prevState,
            daysPerWeek: prevState.daysPerWeek + 1,
            days: [...prevState.days, getEmptyDay()],
        };
    });
}

// Удалить день
export const handleDeleteDay = (setTemplateData, index) => {
    setTemplateData((prevState) => {
        // Фильтруем массив days, исключая элемент с указанным индексом
        const updatedDays = prevState.days.filter((_, i) => i !== index);

        return {
            ...prevState,
            daysPerWeek: prevState.daysPerWeek - 1,
            days: updatedDays,
        };
    });
};

// Добавить упражнение
export const handleAddExercise = (setTemplateData, dayIndex, muscleGroupId) => {
    setTemplateData((prevState) => {
        const updatedDays = prevState.days.map((day, index) => {
            if (index === dayIndex) {
                return {
                    ...day,
                    exercises: [...day.exercises, getEmptyExercise(muscleGroupId)],
                };
            }
            return day;
        });

        return {
            ...prevState,
            days: updatedDays,
        };
    });
};

// Удалить упражнение
export const handleDeleteExercise = (setTemplateData, dayIndex, exerciseIndex) => {
    setTemplateData((prevState) => {
        const updatedDays = prevState.days.map((day, index) => {
            if (index === dayIndex) {
                return {
                    ...day,
                    exercises: day.exercises.filter((_, i) => i !== exerciseIndex),
                };
            }
            return day;
        });

        return {
            ...prevState,
            days: updatedDays,
        };
    });
};