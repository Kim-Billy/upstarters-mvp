import React, { useEffect, useState } from 'react'
import { FaCode } from "react-icons/fa";
import { Card, Icon, Avatar, Col, Typography, Row } from 'antd';
import Axios from 'axios';
import moment from 'moment';

const { Title } = Typography;
const { Meta } = Card;

function LandingPage() {

    const [Videos, setVideo] = useState([])


    // dom이 로드되자마자 시작되는 함수 = componentDidMount
    useEffect(() => {

        Axios.get('/api/video/getVideos')
            .then(response => {
                if (response.data.success) {
                    //  console.log(response.data);
                    setVideo(response.data.videos)
                } else {
                    alert('비디오 가져오기를 실패 했습니다.')
                }
            })

    }, [1]) // 1번만 실행한다.



    const renderCards = Videos.map((video, index) => {

        var minutes = Math.floor(video.duration / 60);
        var seconds = Math.floor(video.duration - minutes * 60);

        // {/* 전체 24사이즈, 중간은 8사이즈, 윈도우가 가장클땐 6사이즈 */}
        return <Col lg={6} md={8} xs={24}>
            <div style={{ position: 'relative' }}>
                {/* 해당하는 페이지를 가기 위한 링크 걸어줌 */}
                <a href={`/video/${video._id}`} >
                    <img style={{ width: '100%' }} alt="thumbnail" src={`http://localhost:5000/${video.thumbnail}`} />
                    <div className=" duration"
                        style={{
                            bottom: 0, right: 0, position: 'absolute', margin: '4px',
                            color: '#fff', backgroundColor: 'rgba(17, 17, 17, 0.8)', opacity: 0.8,
                            padding: '2px 4px', borderRadius: '2px', letterSpacing: '0.5px', fontSize: '12px',
                            fontWeight: '500', lineHeight: '12px'
                        }}>
                        <span>{minutes} : {seconds}</span>
                    </div>
                </a>
            </div><br />
            
            {/* 유저 이미지 부분 */}
            <Meta
                avatar={
                    <Avatar src={video.writer.image} />
                }
                title={video.title}
            />
            <span>{video.writer.name} </span><br />
            <span style={{ marginLeft: '3rem' }}> {video.views}</span>
            - <span> {moment(video.createdAt).format("MMM Do YY")} </span>
        </Col>
    })



    return (
        <div style={{ width: '85%', margin: '3rem auto' }}>
            <Title level={2} > Recommended </Title>
            <hr />
            <Row gutter={[32, 16]}>


                {renderCards}



            </Row>
        </div>
    )
}

export default LandingPage
