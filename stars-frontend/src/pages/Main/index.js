import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { loadPosts } from '../../redux/actions/actions'
import Tags from '../../components/PopularTags'
import Post from '../../components/Post'
import './Main.sass'

function Main(props) {
	useEffect(() => {
		// props.loadPosts()
	}, [props])

	function renderPosts() {
		return props.postsList.map((post, index) => {
			return <Post key={index} list={post} />
		})
	}

	return (
		<div className="container">
			<div className="container__left">{renderPosts()}</div>
			<div className="container__right">
				<Tags />
			</div>
		</div>
	)
}

function mapStateToProps(state) {
	return {
		postsList: state.post.postsList
	}
}

function mapDispatchToProps(dispatch) {
	return {
		loadPosts: () => dispatch(loadPosts())
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)