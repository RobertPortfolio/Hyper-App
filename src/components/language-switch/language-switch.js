import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLanguage } from '../../redux/slices/language-slice';

const LanguageSwitch = () => {

    const dispatch = useDispatch();
    const language = useSelector(state => state.language.language);
    
	return (
		<div className="btn-group">
		  <button 
		  	className={language==='en'?'btn btn-dark':'btn btn-outline-dark'}
		  	onClick={()=>dispatch(setLanguage('en'))}>
		  	en
		  </button>
		  <button 
		  	className={language==='ua'?'btn btn-dark':'btn btn-outline-dark'}
		  	onClick={()=>dispatch(setLanguage('ua'))}>
		  	ua
		  </button>
		</div>
	)
};

export default LanguageSwitch;