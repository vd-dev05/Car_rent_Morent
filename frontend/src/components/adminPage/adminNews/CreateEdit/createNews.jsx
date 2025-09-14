import { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { message } from "antd";
// Store
import { Store } from '../../../../Store';
// imgs
import AddImg from '/public/imgs/addImg.png'
//
import Loading from "../../../Loading";
import './style.css';

const CreateNews = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);
    const navigate = useNavigate();
    const store = useContext(Store);
    let accessToken;
    if (store.currentUser) {
        accessToken = store.currentUser.accessToken
    };
    // react-quill
    const quillRef = useRef(null);
    const modules = {
        toolbar: [
          [{ header: [1, 2, 3, 4, 5, false] }],
          ['bold', 'italic', 'underline'],
          ['link', 'image', 'code-block'],
        ]
    };
    // state cập nhật nội dung khi thay đổi (change)
    const [title, setTitle] = useState('');
    const [isCategory, setIsCategory] = useState('');
    const [isStatus, setIsStatus] = useState('');
    const [addImg, setAddImg] = useState(AddImg);
    const [file, setFile] = useState('');
    const [value, setValue] = useState('');
    const split1 = value.split('</strong></p><p><br></p>');
    const split2 = split1[0].split('<strong>');
    const content = split1[1];
    const subTitle = split2[1];
    // console.log(value);
    // console.log(subTitle);
    // console.log(content);
    const handleFileChange = (e) => {
        setFile(e.target.files[0])
        setAddImg(URL.createObjectURL(e.target.files[0]));
    };
    // submit
    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        const payloadFormData = new FormData();
        payloadFormData.append('title', title);
        payloadFormData.append('file', file);
        {subTitle ?
            payloadFormData.append('subTitle', subTitle) :
            payloadFormData.append('subTitle', '')
        };
        {content ?
            payloadFormData.append('content', content) :
            payloadFormData.append('content', value)
        };
        payloadFormData.append('isCategory', isCategory);
        payloadFormData.append('isStatus', isStatus);
        try {
            const response = await axios.post(`${API_BASE_URL}/api/v1/news/create-news`, payloadFormData,
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        "Content-type": "multipart/form-data",
                    },
                }
            );
            if (isStatus === 'published') {
                message.loading('Đang xuất bản!', 1)
                .then(() => {
                    message.success((response.data.message), 2);
                    setLoading(false);
                    navigate('/admin/news/all');
                });
            };
            if (isStatus === 'draft') {
                message.loading('Đang lưu nháp!', 1)
                .then(() => {
                    message.success((response.data.message), 2);
                    setLoading(false);
                    navigate('/admin/news/all');
                });
            };
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                switch (error.response.data.message) {
                    case 'jwt expired': {
                        message.error(('Token đã hết hạn, vui lòng đăng nhập lại!'))
                        .then(() => {
                            store.setCurrentUser(null);
                            navigate('/login');
                        })
                        return
                    };
                    default:
                    return message.error((error.response.data.message));
                }
            } else {
                message.error('Lỗi không xác định');
            }
            setLoading(false);
        }
    };
    return (
        <div className='CreateEdit'>
            <h3>Tạo bài viết mới</h3>
            <div className='formCreateEdit'>
                <div className='left'>
                    <div className='section1'>
                        <div className='grImg'>
                            <input type="file" id='file' onChange={handleFileChange}/>
                            <label htmlFor="file"><img src={addImg} alt="" /></label>
                        </div>
                        <div className='titleAndCategory'>
                            <div className='col'>
                                <label htmlFor="title">Tiêu đề</label>
                                <input type="text" id='title' placeholder='Thêm tiêu đề'
                                name='title' value={title} onChange={(e) => setTitle(e.target.value)} />
                            </div>
                            <div className='col'>
                                <label htmlFor="isCategory">Danh mục</label>
                                <select name="isCategory" id="isCategory" value={isCategory} onChange={(e) => setIsCategory(e.target.value)}>
                                    <option value="" disabled>---------- Chọn danh mục ----------</option>
                                    <option value="carNews" >Tin xe</option>
                                    <option value="marketNews" >Tin thị trường</option>
                                    <option value="explore" >Khám phá</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className='section2'>
                        <ReactQuill
                            theme="snow"
                            value={value}
                            onChange={(newValue) => setValue(newValue)}
                            ref={quillRef}
                            modules={modules}
                        />
                    </div>
                </div>
                <div className='right'>
                    <h5>Xuất bản</h5>
                    <div className='grButton'>
                        <button type='submit' onMouseEnter={() => setIsStatus('published')} onClick={handleSubmit}>Xuất bản</button>
                        <button type='submit' onMouseEnter={() => setIsStatus('draft')} onClick={handleSubmit}>Lưu nháp</button>
                    </div>
                </div>
            </div>
            {loading && <Loading></Loading>}
        </div>
    )
}

export default CreateNews