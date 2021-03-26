import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { loadProfile } from '../../redux/actions/profileActions'
import Post from '../../components/Post'
import User from './User'
import Spinner from '../../components/UI/Spinner'
import './Profile.sass'

function Profile(props) {
	const [ loadData, setLoadData ] = useState(true)
	const [ active, setActive ] = useState('posts')

	useEffect(() => {
		props.loadProfile(props.location.pathname.slice(9))
		if(props.isLoaded) {
			setLoadData(false)
		}
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.username, props.isLoaded])

	function renderPosts() {
		return props.postsList.map((post, index) => {
            return (
                <Post list={post} key={index} />
            )
        })
	}

	function activeBtn(id) {
		if (id === 'posts') { 
			setActive('posts')
		} else {
			setActive('likes')
		}
	}

	function renderProfile() {
		return (
			<div className="container">
				<div className="container__left">
					<div className="select-type">
						<button id="posts" 
							className={active === 'posts' ? 'active' : ''} 
							onClick={()=> { activeBtn('posts') }}>
							записи
						</button>
						<button id="likes" 
							className={active === 'likes' ? 'active' : ''} 
							onClick={()=> { activeBtn('likes') }}>
							нравится
						</button>
					</div>
					{ renderPosts() }
				</div>
				<div className="container__right">
					<User username={props.username} blogname={props.blogname} photoURL={props.photoURL}/>
				</div>
			</div>
		)
	}

	if (loadData) {
		return <Spinner />
	} else {
		if(props.username) {
			return renderProfile()
		} else if (props.username === '') {
			return(
				<div className="container">
					<div>Пользователь не найден</div>
				</div>
			)
		}
	}
}

function mapStateToProps(state) {
	console.log(state)
	return {
		postsList: state.posts.postsList,
		username: state.profile.username,
		blogname: state.profile.blogname,
		photoURL: state.profile.photoURL,
		desc: state.profile.desc,
		followers: state.profile.followers,
		following: state.profile.following,
		media: state.profile.media,
		isLoaded: state.firebase.profile.isLoaded
	}
}

function mapDispatchToProps(dispatch) {
	return {
		loadProfile: (username) => dispatch(loadProfile(username))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Profile))