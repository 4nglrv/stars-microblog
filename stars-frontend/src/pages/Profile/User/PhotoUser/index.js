import React, { useState, useEffect, useRef } from 'react'
import './PhotoUser.sass'
import { connect } from 'react-redux'
import { clearPhoto } from '../../../../redux/actions/profileActions'
import { useFirebase, useFirestore } from 'react-redux-firebase'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ViewPhoto from '../../../../components/Modal/UploadPhoto'
import WarningMsg from '../../../../components/Modal/WarningMsg'

function Photo(props) {
	const firebase = useFirebase()
	const firestore = useFirestore()
	//for show menu with buttons
	const [ showMenu, setShowMenu ] = useState(false) 
	//for update img
	const [ showModal, setShowModal ] = useState(false) 
	//warning modal
	const [ showWarning, setShowWarning ] = useState(false) 
	const [ image, setImage ] = useState({
		base64: '',
		alt: '',
		files: ''
	})
	const buttonUpdateRef = useRef()
	const inputImageRef = useRef()

	const buttonUpdateNode = buttonUpdateRef.current

	useEffect(() => {
			function beforeComponentClick(event) {
				if (event.target.className !== 'photo-user__update show') {
					setShowMenu(false)
					buttonUpdateNode.classList.remove('show')
				}
			}
			if (showMenu) {
				inputImageRef.current.addEventListener('change', changeHandler)
				document.addEventListener('click', beforeComponentClick)
				return () => {
					document.removeEventListener('click', beforeComponentClick)
				}
			}
	}, [ showMenu, buttonUpdateNode ])

	function changeHandler(event) {
		if (!event.target.files.length) {
			return
		}
		const files = Array.from(event.target.files)
		files.forEach((file) => {
			if (!file.type.match('image')) {
				return
			}
			const reader = new FileReader()
			reader.onload = (ev) => {
				setImage((prevState) => {
					return {
						...prevState,
						base64: ev.target.result,
						alt: file.name,
						files: Array.from(event.target.files)
					}
				})
			}
			reader.readAsDataURL(file)
		})
		setShowModal(true)
	}

	function clickImageHandler() {}

	function clickInputHandler() {
		if (image) {
			setImage({
				base64: '',
				alt: '',
				files: ''
			})
		}
		inputImageRef.current.click()
	}

	function updatePhotoHandler() {
		const buttonUpdateNode = buttonUpdateRef.current
		if (!showMenu) {
			setShowMenu(true)
			buttonUpdateNode.classList.add('show')
		} else {
			setShowMenu(false)
			buttonUpdateNode.classList.remove('show')
		}
	}

	function closeModalHandler() {
		setTimeout(() => {
			setShowModal(false)
			setImage({
				base64: '',
				alt: '',
				files: ''
			})
		}, 100)
	}

	function removePhoto() {
		firestore.collection('users').doc(props.uid).update({
			'photoURL': null 
		})
		const photoName = firebase.storage().refFromURL(props.photoURL).name
		firebase.deleteFile(`${props.authUser}/profilePhoto/${photoName}`)
		const user = firebase.auth().currentUser
		user.updateProfile({
			photoURL: ''
		})
		firebase.updateAuth({
			photoURL: ''
		})
		props.clearPhoto()
	}

	return (
		<div className="photo-user">
			{showWarning ? (
				<WarningMsg
					msg="Вы уверены?"
					accept="Удалить"
					onShow={() => setShowWarning(!showWarning)}
					action={() => removePhoto()}
				/>
			) : null}
			<ViewPhoto blogname={props.blogname} image={image} view={showModal} onClose={() => closeModalHandler()} />
			<div className="photo-user__img-block">
				{!props.photoURL ? (
					<img alt="" src="/img/defaultPhoto.svg" />
				) : (
					<img className="photo-user__img" alt="" src={props.photoURL} onClick={() => clickImageHandler()} />
				)}
			</div>
			{props.username === props.authUser ? (
				<button ref={buttonUpdateRef} className="photo-user__update" onClick={() => updatePhotoHandler()}>
					<FontAwesomeIcon icon="camera" />
					Обновить фото
				</button>
			) : null}
			{showMenu ? (
				<ul className="photo-user__menu">
					<li>
						<button className="photo-user__replace" onClick={() => clickInputHandler()}>
							Заменить фото
						</button>
						<input
							type="file"
							accept="image/jpeg,image/pjpeg,image/gif,image/png"
							multiple={false}
							ref={inputImageRef}
						/>
					</li>
					{props.photoURL ? (
						<li>
							<button className="photo-user__remove" onClick={() => setShowWarning(!showWarning)}>
								Удалить фото
							</button>
						</li>
					) : null}
				</ul>
			) : null}
		</div>
	)
}

function mapStateToProps(state) {
	return {
		authUser: state.firebase.auth.displayName,
		blogname: state.profile.blogname,
		uid: state.firebase.auth.uid
	}
}

function mapDispatchToProps(dispatch) {
	return {
		clearPhoto: () => dispatch(clearPhoto())
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Photo)