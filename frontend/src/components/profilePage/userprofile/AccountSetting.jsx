import { React, useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./AccountSetting.css";
import { PlusOutlined } from "@ant-design/icons";
import {
  Image,
  Upload,
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  message,
} from "antd";
import axios from "axios";
import { Store } from "../../../Store";
// import dayjs from "dayjs";
import moment from "moment";
import Loading from "../../Loading";
//store

const { Option } = Select;

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const AccountSetting = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  console.log("API_BASE_URL:", API_BASE_URL);
  const navigate = useNavigate();
  const store = useContext(Store);
  useEffect(() => {
    if (!store.currentUser) {
      navigate("/");
    }
  }, []);

  const [formData, setFormData] = useState({
    address: "",
    avatar: "",
    email: "",
    dateOfBirth: "",
    phoneNumber: "",
    username: "",
    role: "",
  });

  const [fileList, setFileList] = useState([]);
  // const [previewOpen, setPreviewOpen] = useState(false);
  // const [previewImage, setPreviewImage] = useState('');

  // const handlePreview = async (file) => {
  //   // if (!file.url && !file.preview) {
  //   //   file.preview = await getBase64(file.originFileObj);
  //   // }
  //   // setPreviewImage(file.url || file.preview);
  //   setPreviewOpen(true);
  // };

  const handleChangeFile = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const onChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  let accessToken;
  let role;
  if (store.currentUser) {
    accessToken = store.currentUser.accessToken;
    role = store.currentUser.role;
  }

  const ModifyUserData = async () => {
    if (!fileList.length) {
      message.error("Vui lòng tải lên ảnh đại diện!");
      return;
    }

    try {
      const updatedData = {
        ...formData,
        avatar: fileList[0].originFileObj,
      };

      await axios.put(
        `${API_BASE_URL}/api/v1/users/modify/${store.currentUser._id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-type": "multipart/form-data",
          },
        }
      );
      message.success("Cập nhật thông tin người dùng thành công!");
    } catch (error) {
      console.log(error.message);
      message.error("Cập nhật thông tin người dùng thất bại!");
    }
  };

  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Avatar</div>
    </button>
  );

  return (
    <div className="accountsetting">
      <Form layout="vertical">
        <Row gutter={16}>
          {role !== 'ADMIN' ?
            <Col span={24}>
              <Form.Item
                name="username"
                label="Username"
                rules={[{ required: true, message: 'Vui lòng nhập Username!' }]}
              >
              <Input
                placeholder="Vui lòng nhập Username!"
                onChange={(e) => onChange('username', e.target.value)}
              />
            </Form.Item>
            </Col> : ''
          }
          {role !== 'ADMIN' ?
            <Col span={24}>
              <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
              >
                <Input
                  placeholder="Vui lòng nhập Email!"
                  onChange={(e) => onChange('email', e.target.value)}
                />
              </Form.Item>
            </Col> : ''
          }
          <Col span={24}>
            <Form.Item

              name="fullname"
              label="Họ tên"
              rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
            >
              <Input
                placeholder="Vui lòng nhập họ tên!"
                onChange={(e) => onChange('fullname', e.target.value)}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="phoneNumber"

              label="Số điện thoại"
              rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
            >
              <Input
                placeholder="Vui lòng nhập số điện thoại!"
                onChange={(e) => onChange("phoneNumber", e.target.value)}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="address"

              label="Địa chỉ"
              rules={[{ required: true, message: 'Vui lòng nhập số địa chỉ!' }]}
            >
              <Input
                placeholder="Vui lòng nhập số địa chỉ!"
                onChange={(e) => onChange("address", e.target.value)}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="dateOfBirth"

              label="Ngày Sinh"
              rules={[{ required: true, message: 'Vui lòng nhập ngày sinh!' }]}
            >
              <DatePicker
                onChange={(date) => onChange("dateOfBirth", date)}
                disabledDate={(current) => {
                  return moment().add(-20, "years") <= current;
                }}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Upload
              className="avatar"
              listType="picture-circle"
              fileList={fileList}
              // onPreview={handlePreview}
              onChange={handleChangeFile}
              beforeUpload={() => false}
            >
              {fileList.length >= 1 ? null : uploadButton}
            </Upload>
            {/* {previewImage && 
            (
              <Image
                preview={{
                  visible: previewOpen,
                  onVisibleChange: (visible) => setPreviewOpen(visible),
                }}
                src={previewImage}
              />
            )} */}
          </Col>


          <Form.Item wrapperCol={{ offset: 2, span: 16 }}>
            <Button type="primary" onClick={ModifyUserData} >
              Xác Nhận
            </Button>
          </Form.Item>
        </Row>
      </Form>
    </div>
  );
};

export default AccountSetting;
