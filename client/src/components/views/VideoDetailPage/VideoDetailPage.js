import React, { useEffect, useState } from 'react'
import { Row, Col, List, Avatar } from 'antd'
import Axios from 'axios'

import SideVideo from './Sections/SideVideo'



function VideoDetailPage(props) {

    // app.js router설정한 "video/:videoId"에서 뒤에 id를 가져옴
    const videoId = props.match.params.videoId
    const variable = { videoId: videoId }

    const [VideoDetail, setVideoDetail] = useState([])

    useEffect(() => {
        Axios.post('/api/video/getVideoDetail', variable)
            .then(response => {
                if (response.data.success) {
                    setVideoDetail(response.data.videoDetail)
                } else {
                    alert('비디오 정보를 가져오는데 실패했습니다.')
                }
            })

    })

    console.log(VideoDetail);

    // videoDetail에서 하위 내용에 접근할때 랜더링이 먼저 되서 발생하는 에러 방지
    if (VideoDetail.writer) {
        return (
            // 전체 24사이즈, 메인 18, 사이드목록 6
            <Row gutter={[16, 16]}>
                <Col lg={18} xs={24}>

                    <div style={{ width: '100%', padding: '3rem 4rem' }}>
                        {/* src 커스터마이징 수정 필요함 */}
                        <video style={{ width: '100%' }} src={`http://localhost:5000/${VideoDetail.filePath}`} controls />

                        <List.Item
                            actions
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={VideoDetail.writer.image} />}
                                title={VideoDetail.title}
                                description={VideoDetail.description}
                            />

                        </List.Item>

                        {/* Comments */}

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
