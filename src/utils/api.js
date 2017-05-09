import ajax from 'utils/ajax';
import co from 'co';

// poor mans cache
export function getSpecialties(){
	if (!window.cache){
		window.cache = {}
	}
	const cache = window.cache
	
	return co(function*(){
		if (!cache.categories){
			try {
				const categories = yield ajax({
					url: 'https://api.figure1.com/specialtyCategories'
				})
				
				// cache data
				cache.categories = categories
				
				return categories
			} catch (err){
				throw err
			}
		}
		return cache.categories;
	})
}