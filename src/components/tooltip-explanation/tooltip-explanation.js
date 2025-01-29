import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const TooltipExplanation = ({ label, explanation }) => {
	return (
		<OverlayTrigger
			placement="bottom"
			overlay={<Tooltip id="tooltip-bottom">{explanation}</Tooltip>}
		>
			<span className="d-inline-block">
				{label}
				<i className="fa fa-question-circle ms-2"></i>
			</span>
		</OverlayTrigger>
	)
}

export default TooltipExplanation;