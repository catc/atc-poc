import React from 'react';
import PropTypes from 'prop-types';
import { getSpecialties } from 'utils/api';
import Checkbox from 'components/checkbox';
import update from 'immutability-helper';

import map from 'lodash/map';
import every from 'lodash/every';
import findIndex from 'lodash/findIndex';
import flatMap from 'lodash/flatMap';
import get from 'lodash/get';

export default class SpecialtyAttribute extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			showDropdown: false,
			selectedItemPreview: '',
			searchText: '',
			searchRegex: null
		}

		this.toggleCategory = this.toggleCategory.bind(this)
		this.toggleSpecialty = this.toggleSpecialty.bind(this)
		
		// fetch data
		getSpecialties().then(data => {
			// copy specialties to new object
			const categories = map(data, category => {
				const specialties = map(category.specialties, specialty => {
					return {
						_id: specialty._id,
						label: specialty.strings.label,
					}
				});
				return {
					label: category.strings.label,
					_id: category._id,
					specialties
				}
			})

			// set on parent
			this.props.updateData(this.props.id, {
				categories: categories
			})
		}).catch(err => {
			console.error('Error retrieving specialties', err)
		});
	}
	componentWillReceiveProps(nextProps){
		const categories = get(nextProps, 'data.categories')
		if (categories){
			// generate preview, not completey sure what the functionality is here
			const preview = flatMap(nextProps.data.categories, c => c.specialties)
				.filter(s => s.selected)
				.slice(0, 4)
				.map(s => s.label)
				.join(', ')

			this.setState({
				selectedItemPreview: preview
			})
		}
	}
	
	toggleCategory(categoryid){
		const props = this.props
		const categoryIndex = findIndex(props.data.categories, c => c._id === categoryid)
		const specialties = props.data.categories[categoryIndex].specialties
		
		let changes;
		if (every(specialties, s => s.selected)){
			changes = {
				selected: {$set: false},
				specialties: {$set: setAll(specialties, false)}
			}
		} else {
			changes = {
				selected: {$set: true},
				specialties: {$set: setAll(specialties, true)}
			}
		}

		const updatedData = update(props.data, {
			categories: {
				[categoryIndex]: changes
			}
		})
		
		// update data on parent
		props.updateData(props.id, updatedData)

		function setAll(specialties, val){
			return specialties.map(s => {
				s.selected = val
				return s
			})
		}
	}
	toggleSpecialty(specialty, categoryid){
		const props = this.props;
		
		// get indexes for updates
		const categoryIndex = findIndex(props.data.categories, c => c._id === categoryid)
		const specialtyIndex = findIndex(props.data.categories[categoryIndex].specialties, s => s._id === specialty._id)

		// const updatedSpecialty = Object.assign({}, specialty, {selected: !specialty.selected})
		const updatedSpecialties = update(props.data.categories[categoryIndex].specialties, {
			[specialtyIndex]: {
				selected: {$set: !specialty.selected}
			}
		})

		// update selected/unselected parent checkbox
		let parentSelected;
		if (every(updatedSpecialties, s => s.selected)){
			parentSelected = true
		} else {
			parentSelected = false
		}

		const updatedData = update(props.data, {
			categories: {
				[categoryIndex]: {
					selected: {$set: parentSelected},
					specialties: {$set: updatedSpecialties}
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
		const state = this.state

		return (
			<div className="specialty-attribute">
				<span className="attribute-title">
					Specialty
					<button className="attribute-remove" onClick={() => props.remove(props.id)}>[X]</button>
				</span>
				<div className="specialty-attribute__display" onClick={() => this.setState({showDropdown: true})}>
					{state.selectedItemPreview} &nbsp;
				</div>
				{state.showDropdown && props.data.categories
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

