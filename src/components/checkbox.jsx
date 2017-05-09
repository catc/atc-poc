import React from 'react';
import PropTypes from 'prop-types';

const Checkbox = ({id, className, selected, onChange}) => (
	<div className={`checkbox ${className}`}>
		<input
			id={id}
			onChange={onChange}
			type="checkbox"
			checked={selected}
		/>
		<label htmlFor={id}></label>
	</div>
)

Checkbox.propTypes = {
	id: PropTypes.string.isRequired,
	className: PropTypes.string,
	selected: PropTypes.bool,
	onChange: PropTypes.func
};

export default Checkbox