import React from 'react';
import PropTypes from 'prop-types';

class Popup extends React.Component {
	constructor(props){
		super(props)
		this.clickHandler = e => {
			const contains = this.wrapper.contains(e.target)
			if (!contains){
				props.closeFn()
			}
		}
	}
	componentWillReceiveProps(nextProps){
		if (nextProps.visible === true){
			this.initClickHandler()
		} else {
			this.removeClickHandler()
		}
	}

	initClickHandler(){
		this.removeClickHandler()
		document.addEventListener('click', this.clickHandler, false)
	}
	removeClickHandler(){
		document.removeEventListener('click', this.clickHandler, false)
	}

	render(){
		const props = this.props;
		if (!props.visible){
			return false;
		}
		return (
			<div className={`popup ${props.className}`} ref={el => this.wrapper = el}>
				{props.children}
			</div>
		)
	}

	componentWillUnmount(){
		this.removeClickHandler()
	}
}

Popup.propTypes = {
	className: PropTypes.string,
	visible: PropTypes.bool.isRequired,
	closeFn: PropTypes.func.isRequired,
	children: PropTypes.node
}

export default Popup