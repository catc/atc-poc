import React from 'react';
import PropTypes from 'prop-types';
import { getSpecialties } from 'utils/api';
import Checkbox from 'components/checkbox';
import update from 'immutability-helper';

import map from 'lodash/fp/map';
import findIndex from 'lodash/findIndex';

export default class SpecialtyAttribute extends React.Component {
	constructor(props){
		super(props)
		this.state = {}

		this.toggleCategory = this.toggleCategory.bind(this)
		this.toggleSpecialty = this.toggleSpecialty.bind(this)
		
		// fetch data
		getSpecialties().then(data => {
			// copy specialties to new object
			const categories = map(category => {
				const specialties = map(specialty => {
					return {
						_id: specialty._id,
						label: specialty.strings.label,

					}
				})(category.specialties);
				return {
					label: category.strings.label,
					_id: category._id,
					specialties
				}
			})(data)

			// set on parent
			this.props.updateData(this.props.id, {
				categories: categories
			})
		}).catch(err => {
			console.error('Error retrieving specialties', err)
		});
	}
	
	toggleCategory(categoryid){

	}
	toggleSpecialty(specialty, categoryid){
		const props = this.props;
		
		// get indexes for updates
		const categoryIndex = findIndex(props.data.categories, c => c._id === categoryid)
		const specialtyIndex = findIndex(props.data.categories[categoryIndex].specialties, s => s._id === specialty._id)

		const updatedSpecialty = Object.assign({}, specialty, {selected: !specialty.selected})
		const updatedData = update(props.data, {
			categories: {
				[categoryIndex]: {
					specialties: {
						[specialtyIndex]: {$set: updatedSpecialty}
					}
				}
			}
		})
		
		// update data on parent
		props.updateData(props.id, updatedData)
	}

	mapCategories(){
		return this.props.data.categories.map(category => {
			return (
				<div className="category-group" key={category._id}>
					<span className="category-group__item" onClick={() => this.toggleCategory(category._id)}>
						<Checkbox
							id={category._id}
							selected={category.selected}
						/>
						<span className="category-group__label">{category.label}</span>
					</span>
					<div className="category-group__sub-items">
						{this.mapSpecialties(category.specialties, category._id)}
					</div>
				</div>
			)
		})
	}
	mapSpecialties(specialties, categoryid){
		return specialties.map(specialty => {
			return (
				<div key={specialty._id} className="specialty-item" onClick={() => this.toggleSpecialty(specialty, categoryid)}>
					<Checkbox
						id={specialty._id}
						selected={specialty.selected}
					/>
					<span className="specialty-item__label">{specialty.label}</span>
				</div>
			)
		})
	}
	render(){
		const props = this.props
		// const state = this.state

		return (
			<div>
				<span className="attribute-title">
					Specialty
					<button className="attribute-remove" onClick={() => props.remove(props.id)}>[X]</button>
				</span>
				{props.data.categories
					?
					this.mapCategories()
					:
					false
				}
			</div>
		)
	}
}

SpecialtyAttribute.propTypes = {
	id: PropTypes.string.isRequired,
	data: PropTypes.shape({
		categories: PropTypes.array
	}).isRequired,
	updateData: PropTypes.func.isRequired,
	remove: PropTypes.func.isRequired
};

