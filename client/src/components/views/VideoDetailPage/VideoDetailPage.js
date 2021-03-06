import React, { useEffect, useState } from 'react'
import { Row, Col, List, Avatar } from 'antd'
import Axios from 'axios'

import SideVideo from './Sections/SideVideo'
import Comment from './Sections/Comments'
import LikeDislikes from './Sections/LikeDislike'


function VideoDetailPage(props) {

    // app.js router설정한 "video/:videoId"에서 뒤에 id를 가져옴
    const videoId = props.match.params.videoId
    const [VideoDetail, setVideoDetail] = useState([])
    const [CommentLists, setCommentLists] = useState([])
    
    const variable = { videoId: videoId }

    useEffect(() => {
        Axios.post('/api/video/getVideoDetail', variable)
            .then(response => {
                if (response.data.success) {
                    setVideoDetail(response.data.videoDetail)
                } else {
                    alert('비디오 정보를 가져오는데 실패했습니다.')
                }
            })

        Axios.post('/api/comment/getComments', variable)
            .then(response => {
                if (response.data.success) {
                    setCommentLists(response.data.comments)
                } else {
                    alert('코멘트 정보를 가져오는 것을 실패 하였습니다.')
                }
            })
    })

    // 업데이트 된 코멘트 내용 추가하기
    const refreshFunction = (newComment) => {
        setCommentLists(CommentLists.concat(newComment))
    }

    // console.log(VideoDetail);

    // videoDetail에서 하위 내용에 접근할때 랜더링이 먼저 되서 발생하는 에러 방지
    if (VideoDetail.writer) {
        return (
            // 전체 24사이즈, 메인 18, 사이드목록 6
            <Row >
                <Col lg={18} xs={24}>

                <div className="postPage" style={{ width: '100%', padding: '3rem 4em' }}>
                        {/* src 커스터마이징 수정 필요함 */}
                        <video style={{ width: '100%' }} src={`http://localhost:5000/${VideoDetail.filePath}`} controls></video>
                        <List.Item
                            actions={[<LikeDislikes video videoId={videoId} userId={localStorage.getItem('userId')}/>]}
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={VideoDetail.writer.image} />}
                                title={VideoDetail.title}
                                description={VideoDetail.description}
                            />

                        </List.Item>

                        {/* Comments */}
                        <Comment CommentLists={CommentLists} postId={videoId} refreshFunction={refreshFunction}/>

                    </div>
                </Col>
                <Col lg={6} xs={24}>
                    Side Video
                </Col>

                {/* side video */}
                <Col lg={6} xs={24}>
                    <SideVideo/>
                </Col>

            </Row>
        )
    } else {
        return (
            <div>...loading</div>
        )
    }
}

export default VideoDetailPage
