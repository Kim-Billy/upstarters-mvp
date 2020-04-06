
import React, { useState } from 'react'
// dropzone 가져오기
import Dropzone from 'react-dropzone';
// ant design css 가져오기
import { Typography, Button, Form, message, Input, Icon } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import axios from 'axios';
// import { response } from 'express';
import { useSelector } from 'react-redux';

const PrivateOptions = [
    { value: 0, label: 'Private' },
    { value: 1, label: 'Public' }
]

const CategotyOptions = [
    { value: 0, label: 'Self-Introduction' },
    { value: 1, label: 'Idea Pitch' },
    { value: 2, label: 'Find Mates' },
    { value: 3, label: 'Share Info.' },
]


function VideoUploadPage(props) {

    // state에 있는 user의 모든 정보를 가져옴
    const user = useSelector(state => state.user);

    const [VideoTitle, setVideoTitle] = useState("")
    const [Description, setDescription] = useState("")
    const [Private, setPrivate] = useState(0) // private:0 public:1
    const [Categoty, setCategoty] = useState("Self-Introduction")
    const [FilePath, setFilePath] = useState("")
    const [Duration, setDuration] = useState("")
    const [ThumbnailPath, setThumbnailPath] = useState("")


    const onTitleChange = (e) => {
        setVideoTitle(e.currentTarget.value)
    }

    const onDescriptionChange = (e) => {
        setDescription(e.currentTarget.value)
    }

    const onPrivateChange = (e) => {
        setPrivate(e.currentTarget.value)
    }

    const onCategoryChange = (e) => {
        setCategoty(e.currentTarget.value)
    }

    const onDrop = (files) => {
        let formData = new FormData();
        const config = {
            header: { 'content-type': 'multipart/form-data' }
        }
        formData.append("file", files[0])

        axios.post('/api/video/uploadfiles', formData, config)
            .then(response => {
                if (response.data.success) {
                    // console.log(response.data);

                    // thumbnail을 위해 ffmpeg 설치 및 관련 dependency 필요
                    let variable = {
                        url: response.data.url,
                        fileName: response.data.fileName
                    }

                    setFilePath(response.data.url)


                    axios.post('/api/video/thumbnail', variable)
                        .then(response => {
                            if (response.data.success) {
                                // console.log(response.data);
                                setDuration(response.data.fileDuration);
                                setThumbnailPath(response.data.url)
                            } else {
                                alert('썸네일 생성에 실패했습니다.')
                            }
                        })

                } else {
                    alert("비디오 업로드를 실패했습니다.")
                }
            })
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const variable = {
            writer: user.userData._id,
            title: VideoTitle,
            description: Description,
            privacy: Private,
            filePath: FilePath,
            category: Categoty,
            duration: Duration,
            thumbnail: ThumbnailPath,
        }

        axios.post('/api/video/uploadVideo', variable) 
            .then(response => {
                if(response.data.success) {
                    message.success('성공적으로 업로드를 했습니다.')

                    setTimeout(() => {

                    }, 3000)

                    props.history.push('/')
                } else {
                    alert('비디오 업로드를 실패 했습니다.')

                }
            })
    }

    return (
        <div style={{ maxWidth: '700px', margin: '2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Typography level={2}></Typography>
            </div>

            <Form onSubmit={onSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>

                    {/* dropzone */}
                    <Dropzone
                        onDrop={onDrop}
                        multiple={false}  // 한번에 파일을 하나만 올리면 false
                        maxSize={1000000000}
                    >
                        {({ getRootProps, getInputProps }) => (
                            <div style={{
                                width: '300px', height: '240px', border: '1px solid lightgray', display: 'flex'
                                , alignItems: 'center', justifyContent: 'center'
                            }} {...getRootProps()}>
                                <input {...getInputProps()} />
                                <Icon type="plus" style={{ fontSize: '3rem' }} />
                            </div>
                        )}
                    </Dropzone>

                    {/*  thumbnail 있을 때에만 렌더링*/ }
                    {ThumbnailPath &&
                        <div>
                            {/* 사용하는 포트에 따라 바꿔줘야함 */}
                            <img src={`http://localhost:3000/${ThumbnailPath}`} alt={"thumbnail"} />
                        </div>
                    }
                </div>

                <br />
                <br />
                <label>Title</label>
                <Input
                    onChange={onTitleChange}
                    value={VideoTitle}
                />
                <br />
                <br />
                <label>Description</label>
                <TextArea
                    onChange={onDescriptionChange}
                    value={Description}
                />
                <br />
                <br />
                <select onChange={onPrivateChange}>
                    {PrivateOptions.map((item, index) => (
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}
                </select>
                <br />
                <br />
                <select onChange={onCategoryChange}>
                    {CategotyOptions.map((item, index) => (
                        <option key={index} value={item.value}>{item.label}</option>
                    ))}
                </select>
                <br />
                <br />
                <Button type='primary' size='large' onClick={onSubmit}>
                    Submit
                </Button>
            </Form>

        </div>
    )
}

export default VideoUploadPage


// const VideoUploadPage = (data) =>{

// }