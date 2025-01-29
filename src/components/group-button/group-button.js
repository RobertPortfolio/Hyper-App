import React from 'react';

const GroupButton = ({ isPrimarySelected, setIsPrimarySelected }) => {
    const buttonBaseClass = 'btn border-0 rounded-1 py-2 font-size-secondary';

    return (
        <div className="bg-main p-1 rounded-2">
            <div className="d-flex">
                <button
                    className={`${buttonBaseClass} flex-grow-1 ${
                        isPrimarySelected ? 'bg-custom-secondary text-white fw-normal' : 'btn-light text-dark fw-bold'
                    }`}
                    onClick={() => setIsPrimarySelected(false)}
                    aria-pressed={!isPrimarySelected}
                >
                    Базовые
                </button>

                <button
                    className={`${buttonBaseClass} flex-grow-1 ${
                        isPrimarySelected ? 'btn-light text-dark fw-bold' : 'bg-custom-secondary text-white fw-normal'
                    }`}
                    onClick={() => setIsPrimarySelected(true)}
                    aria-pressed={isPrimarySelected}
                >
                    Пользовательские
                </button>
            </div>
        </div>
    );
};

export default GroupButton;