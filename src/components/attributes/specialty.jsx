import React from 'react';
import PropTypes from 'prop-types';
import { getSpecialties } from 'utils/api';
import Checkbox from 'components/checkbox';
import Popup from 'components/pop-up';
import update from 'immutability-helper';

import map from 'lodash/map';
import every from 'lodash/every';
import findIndex from 'lodash/findIndex';
import flatMap from 'lodash/flatMap';
import get from 'lodash/get';
import debounce from 'lodash/debounce';

export default class SpecialtyAttribute extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			showDropdown: false,
			selectedItemPreview: '',
			searchText: '',
			searchRegex: new RegExp('')
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

		this.updateSearch = debounce(this.updateSearch.bind(this), 200)
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

	updateSearch(val){
		/*
			NOTE: would probably be easier to do searches by flattening all
			specialties into 1 giant array and filtering that way
			- specialties would need to have a reference to their parent category
		*/
		const regex = new RegExp(val, 'i')
		this.setState({
			searchRegex: regex
		})
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
		const regex = this.state.searchRegex
		return specialties.filter(s => regex.test(s.label)).map(specialty => {
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
				<div className="specialty-attribute__preview" onClick={() => this.setState({showDropdown: true, searchRegex: new RegExp('')})}>
					{state.selectedItemPreview} &nbsp;
				</div>

				{props.data.categories
					?
					<Popup
						visible={state.showDropdown}
						closeFn={() => this.setState({showDropdown: false})}
						className="anim_fade specialty-attribute__options-popup"
					>
						<div className="specialty-attribute__search">
							<input
								type="text"
								placeholder="Search specialties"
								onChange={e => this.updateSearch(e.target.value)}
								defaultValue={state.searchText}
							/>
						</div>
						<div className="specialty-attribute__categories-wrapper">
							{this.mapCategories()}
						</div>
					</Popup>
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

