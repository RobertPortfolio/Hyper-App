import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import OptionsMenu from '../options-menu';
import StatisticModal from './statistic-modal';
import { deleteMesocycleThunk, changeCurrentMesocycleThunk } from '../../redux/slices/mesocycles-slice';
import './mesocycles-list-item.css';

const MesocyclesListItem = ({ mesocycle }) => {

    const { user } = useSelector((state) => state.user);
 
    const dispatch = useDispatch();

    const [ statisticIsOpen, setStatisticIsOpen ] = useState(false);

    const handleDeleteMesocycle = () => {
        dispatch(deleteMesocycleThunk({ mesocycleId: mesocycle._id }))
    } 

    const changeCurrentMesocycle = () => {
        dispatch(changeCurrentMesocycleThunk({
            mesocycleId: mesocycle._id, 
            userId: user._id}
        ))
    }

    return (
        <div className="card rounded-0 bg-component">
            <div className="card-body">
                <div className="d-flex justify-content-between">
                    <div className='text-light'>
                        {mesocycle.name}
                    </div>
                    <div className='d-flex text-light'>
                        <div>
                            {mesocycle.isDone && (
                                <span className="mesocycle-status mesocycle-status-done me-1">
                                    {mesocycle.endDate}
                                    <i className='fa fa-check ms-1 font-size-secondary'/>
                                </span>
                            )}
                            {mesocycle.isCurrent && (
                                <span className="mesocycle-status mesocycle-status-current me-1">
                                    Текущий
                                </span>
                            )}
                        </div>
                        <OptionsMenu
                            options={[
                                {
                                    label: 'Посмотреть статистику',
                                    action: () => setStatisticIsOpen(true),
                                    className: 'text-light',
                                    icon: 'fa fa-chart-bar',
                                },
                                {
                                    label: 'Сделать текущим',
                                    action: changeCurrentMesocycle,
                                    className: 'text-light',
                                    icon: 'fa-solid fa-dot-circle',
                                },
                                {
                                    label: 'Удалить мезоцикл',
                                    action: handleDeleteMesocycle,
                                    className: 'text-danger',
                                    icon: 'fa fa-trash',
                                },
                            ]}
                            direction='right'
                            header='Мезоцикл'
                        />
                    </div>
                </div>
                <div className='text-secondary font-size-secondary mt-3'>
                    {mesocycle.duration} {mesocycle.duration === '5' || mesocycle.duration === '6' ? 'Недель' : 'Недели'} - Дней в неделю {mesocycle.weeks[0].days.length}
                </div>
            </div>

            <StatisticModal 
                mesocycle={mesocycle} 
                statisticIsOpen={statisticIsOpen}
                setStatisticIsOpen={setStatisticIsOpen} />
        </div>
    )
}

export default MesocyclesListItem;