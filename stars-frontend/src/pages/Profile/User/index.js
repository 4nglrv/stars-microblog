import React from 'react'
import './User.sass'
import PhotoUser from './PhotoUser'

function User(props) {
    function renderProfileData() {
        return (
            <div className="right-block">
                <div className="right-block__user-info">
                    <PhotoUser photoURL={props.photoURL} username={props.username} />
                    <div className="user-info">
                        {
                            props.blogname.length <= 10
                                ? <span className="blogname xl">{props.blogname}</span>
                                : <span className="blogname s">{props.blogname}</span>
                        }
                        <p>{props.desc}</p>
                    </div>
                </div>
                <div className="right-block__subs">
                    <h2>Блоги</h2>
                    <hr/>
                    <div className="subs-block">
                        <a href="/">{ props.following || 0 } в читаемых</a>
                        <a href="/">{ props.followers || 0 } читателя</a>
                    </div>
                </div>
                <div className="right-block__media">
                    <h2>Медиа</h2>
                    <hr/>
                    <div className="media-list">
                    { 
                        props.media.map((media, index) => {
                            return (
                                <a alt="" href="/" key={ index }>
                                    <img alt="" src={ media.photoURL } key={ index } />
                                </a>
                            )
                        }) 
                    }
                    </div>
                </div>
            </div>
        )
    }
	return (
		renderProfileData()
	)
}


export default User
