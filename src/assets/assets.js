
export const getName = (list, Id) => {
    const item = list.find(item => item.id === Number(Id));
    return item ? item.ruName : 'Unknown';
};

export const days = [
    { name: 'Monday', id: 1, ruName: 'Понедельник', ruShortName: 'Пн' },
    { name: 'Tuesday', id: 2, ruName: 'Вторник', ruShortName: 'Вт' },
    { name: 'Wednesday', id: 3, ruName: 'Среда', ruShortName: 'Ср' },
    { name: 'Thursday', id: 4, ruName: 'Четверг', ruShortName: 'Чт' },
    { name: 'Friday', id: 5, ruName: 'Пятница', ruShortName: 'Пт' },
    { name: 'Saturday', id: 6, ruName: 'Суббота', ruShortName: 'Сб' },
    { name: 'Sunday', id: 7, ruName: 'Воскресенье', ruShortName: 'Вс' },
];

export const equipment = [
    { name: 'Barbell', id: 1, ruName: 'Штанга' },
    { name: 'Dumbbell', id: 2, ruName: 'Гантели' },
    { name: 'Machine', id: 3, ruName: 'Тренажёр' },
    { name: 'SmittMachine', id: 4, ruName: 'Смит' },
    { name: 'Cable', id: 5, ruName: 'Блок' },
    { name: 'Bodyweight', id: 6, ruName: 'Собственный вес' },
    { name: 'BodyweightLoadable', id: 7, ruName: 'Собственный вес с грузом' },
    { name: 'MachineAssisted', id: 8, ruName: 'Тренажёр с поддержкой' },
    { name: 'Freemotion', id: 9, ruName: 'Freemotion' },
];

export const muscleGroups = [
    { name: 'Chest', id: 1, ruName: 'Грудь' },
    { name: 'Back', id: 2, ruName: 'Спина' },
    { name: 'Traps', id: 3, ruName: 'Трапеции' },
    { name: 'Delts', id: 4, ruName: 'Дельты' },
    { name: 'Biceps', id: 5, ruName: 'Бицепсы' },
    { name: 'Triceps', id: 6, ruName: 'Трицепсы' },
    { name: 'Forearms', id: 7, ruName: 'Предплечья' },
    { name: 'Abs', id: 8, ruName: 'Пресс' },
    { name: 'Quads', id: 9, ruName: 'Квадрицепсы' },
    { name: 'Hamstrings', id: 10, ruName: 'Бицепсы бедра' },
    { name: 'Glutes', id: 11, ruName: 'Ягодицы' },
    { name: 'Calves', id: 12, ruName: 'Икры' },
];

