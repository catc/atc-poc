import React from 'react';
import PropTypes from 'prop-types';

export default class AttributeSelector extends React.Component {
	render(){
		const props = this.props

		return (
			<div>
				<select defaultValue="default" onChange={e => props.onSelect(e.target.value)}>
					<option value="default" disabled="true">Select an attribute</option>
					
					{props.attributes.map(attribute => {
						return <option
							key={attribute.val}
							value={attribute.val}>{attribute.name}</option>
					})}
				</select>
			</div>
		)
	}
}

AttributeSelector.propTypes = {
	attributes: PropTypes.array.isRequired,
	onSelect: PropTypes.func.isRequired,
};
