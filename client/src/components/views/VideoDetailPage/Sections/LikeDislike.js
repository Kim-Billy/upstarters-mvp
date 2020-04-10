import React, { useEffect, useState } from 'react'
import { Tooltip, Icon } from 'antd';
import Axios from 'axios'

function LikeDislike(props) {

    const [Likes, setLikes] = useState(0)
    const [Dislikes, setDislikes] = useState(0)
    const [LikeAction, setLikeAction] = useState(null)
    const [DisLikeAction, setDisLikeAction] = useState(null)

    let variable = {}

    if (props.video) {
        variable = { videoId: props.videoId, userId: props.userId }
    } else {
        variable = { commentId: props.commentId, userId: props.userId }
    }


    useEffect(() => {

        Axios.post('api/like/getLikes', variable)
            .then(response => {
                if (response.data.success) {
                    // like를 얼마를 받았는지
                    setLikes(response.data.likes.length)
                    // 이미 like를 눌렀는지
                    response.data.likes.map(like => {
                        if (like.userId === props.userId) {
                            setLikeAction('liked')
                        }
                    })
                } else {
                    alert('Likes의 정보를 가져오지 못했습니다.')
                }
            })

        Axios.post('api/like/getDislikes', variable)
            .then(response => {
                if (response.data.success) {
                    // dislike를 얼마를 받았는지
                    setDislikes(response.data.dislikes.length)
                    // 이미 dislike를 눌렀는지
                    response.data.dislikes.map(dislikes => {
                        if (dislikes.userId === props.userId) {
                            setDisLikeAction('disliked')
                        }
                    })
                } else {
                    alert('Dislikes의 정보를 가져오지 못했습니다.')
                }
            })
    }, [])


    const onLike = () => {

        if (LikeAction === null) {
            Axios.post("/api/like/upLike", variable)
                .then(response => {
                    if (response.data.success) {
                        setLikes(Likes + 1)
                        setLikeAction('liked')

                        if (DisLikeAction !== null) {
                            setDisLikeAction(null)
                            setDislikes(Dislikes - 1)
                        }

                    } else {
                        alert('Like를 올리지 못했습니다.')
                    }
                })
        } else {

            Axios.post("/api/like/unLike", variable)
                .then(response => {
                    if (response.data.success) {
                        setDislikes(Likes - 1)
                        setLikeAction(null)

                    } else {
                        alert('Like를 내리지 못했습니다.')
                    }
                })

        }
    }

    const onDislike = () => {

        if (DisLikeAction !== null) {

            Axios.post('/api/like/unDisLike', variable)
                .then(response => {
                    if (response.data.success) {

                        setDislikes(Dislikes - 1)
                        setDisLikeAction(null)

                    } else {
                        alert('Failed to decrease dislike')
                    }
                })

        } else {

            Axios.post('/api/like/upDisLike', variable)
                .then(response => {
                    if (response.data.success) {

                        setDislikes(Dislikes + 1)
                        setDisLikeAction('disliked')

                        //If dislike button is already clicked
                        if (LikeAction !== null) {
                            setLikeAction(null)
                            setLikes(Likes - 1)
                        }
                    } else {
                        alert('Failed to increase dislike')
                    }
                })
        }
    }


    return (
        <React.Fragment>
            <span key="comment-basic-like">
                <Tooltip title="Like">
                    <Icon type="like"
                        theme={LikeAction === 'liked' ? 'filled' : 'outlined'}
                        onClick={onLike} />
                </Tooltip>
                <span style={{ paddingLeft: '8px', cursor: 'auto' }}>{Likes}</span>
            </span>&nbsp;&nbsp;
            <span key="comment-basic-dislike">
                <Tooltip title="Dislike">
                    <Icon
                        type="dislike"
                        theme={DisLikeAction === 'disliked' ? 'filled' : 'outlined'}
                        onClick={onDislike}
                    />
                </Tooltip>
                <span style={{ paddingLeft: '8px', cursor: 'auto' }}>{Dislikes}</span>
            </span>
        </React.Fragment>
    )
}

export default LikeDislike;
