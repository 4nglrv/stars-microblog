import React, { useState, forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PostButtons from './PostButtons'
import Dropdown from './Dropdown'
import RestorePost from './RestorePost'
import './Post.sass'

const Post = forwardRef((props, ref) => {
	const { post } = props
	const [ notes, setNotes ] = useState(post.notes || 0)
	const [ dropdown, setDropdown ] = useState(false)
	const [ remove, setRemove ] = useState(false)

	const wordForm = (num, word) => { 
		let cases = [2, 0, 1, 1, 1, 2]
		return word[( num % 100 > 4 && num % 100 < 20 ) ? 2 : cases[( num % 10 < 5 ) ? num % 10 : 5]]
	}

	if (!remove) {
		return (
			<div ref={ref} className="post loadAnimation">
				<div className="post__left">
					<img src={ post.authorPhoto || '/img/defaultPhoto.svg' } alt="" className="ava" />
				</div>
				<div className="post__right">
					<div id={ post.userId } className="blogname">
						<Link to={`/profile/${post.username}`} className="blogname__list">
							{ post.blogname }
						</Link>
						{ post.author 
							?  (
								<div className="author-post">
									<FontAwesomeIcon icon="reply" className="reply" />
									<a href="/">{ post.author }</a>
								</div>
							) 
							: null
						}
						<button onClick={ () => setDropdown(prev => {return !prev}) }>
							<FontAwesomeIcon icon="ellipsis-h" />
						</button>
	
						<Dropdown 
							onShow={ () => setDropdown(prev => {return !prev}) }
							createdAt={ post.createdAt }
							username={ post.username }
							show={ dropdown }
							postId={ post.postId }
							remove={ () => setRemove(prev => {return !prev}) }
						/>
					</div>
					{ post.header ? (<h2>{ post.header }</h2>) : null  }
					<div className="post__images">
						{
							post.photoURL?.map((image, index) => {
								return (
									<div className="img-box" key={ index }>
										<img alt="" src={ image } />
									</div>
								)
							}) || null
						}
					</div>
					{ post.text ? (<p>{ post.text }</p>) : null}
					<div className="footer-post">
						<div className="footer-post__left">
							{ `${ notes }  ${ wordForm( notes, ['заметка', 'заметки', 'заметок']) }` }
							<div className="footer-post__tags">
								{ post.tags ? (
									post.tags.map((tag, index) => {
										return (
											<a href="/" key={ index }>
												{ '#' + tag }
											</a>
										)})
									) 
									: null
								}
							</div>
						</div>
						<PostButtons
							postId={ post.postId }
							liked={ post.liked }
							username={ post.username }
							onChangeInc={ (value) => setNotes((prev) => {return prev + value}) }
						/>
					</div>
				</div>
			</div>
		)
	} else {
		return (
			<div ref={ ref } className="post loadAnimation">
				<div className="post__left">
					<img src={ post.authorPhoto || '/img/defaultPhoto.svg' } alt="" className="ava" />
				</div>
				<RestorePost 
					restore={ () => setRemove(false) }
					postId={ post.postId }
				/>
			</div>
		)
	}

})
export default Post
