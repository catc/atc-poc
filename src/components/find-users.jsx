import React from 'react';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import update from 'immutability-helper';

// components
import AttributeSelector from 'components/attribute-selector';

// attributes
import SpecialtyAttribute from 'components/attributes/specialty';
import CountryAttribute from 'components/attributes/country';
import CommentCountAttribute from 'components/attributes/comment-count';

const ATTRIBUTES = [
	{val: 'specialty', name: 'Specialty', component: SpecialtyAttribute},
	{val: 'country', name: 'Country', component: CountryAttribute},
	{val: 'commentCount', name: 'Comment count', component: CommentCountAttribute},
];
let id = 0;

export default class FindUsers extends React.Component {
	constructor(props){
		super(props);

		this.addAttribute = this.addAttribute.bind(this)

		this.state = {
			showAttributes: true,
			addedAttributes: [],
			// addedAttributes: [{id: 'zz', component: SpecialtyAttribute, data: {}}] // FOR TESTING
			// addedAttributes: [{id: 'aa', component: CountryAttribute, data: {}}, {id: 'zz', component: SpecialtyAttribute, data: {}}, {id: 'yy', component: CountryAttribute, data: {}}, {id: 'xx', component: CountryAttribute, data: {}}] // FOR TESTING
		}

		this.updateAttributeData = this.updateAttributeData.bind(this)
		this.removeAttribute = this.removeAttribute.bind(this)
	}
	addAttribute(val){
		const attr = find(ATTRIBUTES, a => a.val === val)
		if (attr){
			const newAttr = {
				id: attr.val + id++,
				component: attr.component,
				data: {}
			}
			this.setState({
				addedAttributes: [...this.state.addedAttributes, newAttr]
			})
			this.setState({showAttributes: false})
		}
	}
	updateAttributeData(id, data){
		const addedAttributes = this.state.addedAttributes;
		const index = findIndex(addedAttributes, a => a.id === id)
		if (index < 0){
			throw 'Failed to find attribute'
		}
		const updated = update(addedAttributes, {
			[index]: {data: {$set: data}}
		})
		this.setState({
			addedAttributes: updated
		}, this.doSomethingElse)
	}
	doSomethingElse(){
		// NOTE: can add additional updates here, ie: serialize + save on server + update count
		const state = this.state
		console.log( 'the new state is', state )
	}
	removeAttribute(id){
		const index = findIndex(this.state.addedAttributes, a => a.id === id)
		if (index < 0){
			throw 'Failed to find attribute by id'
		}

		this.setState({
			addedAttributes: update(this.state.addedAttributes, {
				$splice: [[index, 1]]
			})
		})
	}
	render(){
		const state = this.state
		return (
			<div>
				<h1>Featured cases for Cardiac Surgeons</h1>

				<div className="attributes-wrapper">
					{state.addedAttributes.map(attr => {
						const Component = attr.component
						return <Component
							key={attr.id}
							id={attr.id}
							data={attr.data}
							updateData={this.updateAttributeData}
							remove={this.removeAttribute}
						/>
					})}
				</div>
				
				{state.showAttributes
					?
					<AttributeSelector
						attributes={ATTRIBUTES}
						onSelect={this.addAttribute}
					/>
					:
					<span className="show-attributes-select" onClick={() => this.setState({showAttributes: true})}>Add attribute</span>
				}
			</div>
		)
	}
}
