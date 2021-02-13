import { LOAD_PROFILE_SUCCESS, LOAD_PROFILE_ERROR } from './actionsTypes'

export function loadProfile(username) {
	return (dispatch, getState, getFirebase) => { 
		const firebase = getFirebase()
		firebase.ref().child('users')
		.orderByChild('username').equalTo(username)
			.on('child_added', (snapshot) => {
				const data = snapshot.val()
				let photoURL
				snapshot.ref
				.child('photoURL')
				.on('child_added', (snapshot) => {
					photoURL = Object.values(snapshot.val()).toString()	
				})
				const newData = JSON.parse(
					JSON.stringify(data),
					(key, value) => key === 'photoURL' ? photoURL : value
				)
				dispatch(loadProfileDataSuccess(newData))
			}, (error) => {
				console.log('not found')
				dispatch(loadProfileDataError(error))
			})
	}
}

export function loadProfileDataSuccess(data) {
	return {
		type: LOAD_PROFILE_SUCCESS,
		username: data.username,
		blogname: data.blogname,
		photoURL: data.photoURL || null,
		desc: data.desc || null,
		followers: data.followers || null,
		following: data.following || null,
		media: data.media || null
	}
}

export function loadProfileDataError(e) {
	return {
		type: LOAD_PROFILE_ERROR,
		error: e
	}
}