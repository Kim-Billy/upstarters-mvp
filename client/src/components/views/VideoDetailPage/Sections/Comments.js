import React, { useState } from 'react'
import Axios from 'axios'
import { useSelector } from 'react-redux'
import SingleComment from "./SingleComment"
import ReplyComment from "./ReplyComment"
import { Input, Button } from 'antd';

const { TextArea } = Input;


function Comments(props) {

    // redux에서 정보를 가져오기 위해 로드
    const user = useSelector(state => state.user)

    const [Comment, setComment] = useState("")

    const handleChange = (e) => {
        setComment(e.currentTarget.value)
    }

    const onSubmit = (e) => {
        // submit 시에 새로고침 방지
        e.preventDefault()

        const variables = {
            content: Comment,
            writier: user.userData._id,        // 위의 redux에서 가져온 user에 접근 
            postId: props.postId
        }


        Axios.post('/api/comment/saveComment', variables)
            .then(response => {
                if (response.data.success) {
                    setComment("")
                    props.refreshFunction(response.data.result)
                } else {
                    alert('Comment를 저장하지 못했습니다.')
                }
            })
    }

    return (
        <div>
            <br />
            <p>Replies</p>
            <hr />

            {/* Comment Lists */}

            {props.CommentLists && props.CommentLists.map((comment, index) => (
                // responseTo 있는 것들만 보여줌
                (!comment.responseTo &&
                    <React.Fragment>
                        <SingleComment comment={comment} postId={props.postId} refreshFunction={props.refreshFunction} />
                        <ReplyComment CommentLists={props.CommentLists} postId={props.postId} parentCommentId={comment._id} refreshFunction={props.refreshFunction} />
                    </React.Fragment>
                )
            ))}

            {/* Root Comment Form */}

            <form style={{ display: 'flex' }} onSubmit={onSubmit}>
                <TextArea
                    style={{ width: '100%', borderRadius: '5px' }}
                    onChange={handleChange}
                    value={Comment}
                    placeholder="write some comments"
                />
                <br />
                <Button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>Submit</Button>


            </form>

        </div>
    )
}

export default Comments
