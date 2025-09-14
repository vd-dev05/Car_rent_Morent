import { Store } from "../../Store";

import { useContext, useEffect } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
//
import "./style.css";

const ProviderPage = () => {
  const providerId = useParams();
  const nav = useNavigate();
  const store = useContext(Store);
  useEffect(() => {
    if (!store.currentUser) {
      nav("/");
    }
    if (store.currentUser) {
      const role = store.currentUser.role;
      if (role !== "PROVIDER") {
        nav("/");
      }
    }
    if (store.currentUser) {
      const currentId = store.currentUser._id;
      const currentRole = store.currentUser.role;
      if (providerId !== currentId) {
        if (currentRole === 'PROVIDER') {
          nav(`/provider/${currentId}`);
        } else {
          nav('/');
        }
      };
    };
  }, []);
  return (
    <div className="ProviderPageTL">
      <div className="ProviderPageTLHeader">
        <div className="section1">
          <p>Quản lý tin đăng bán và đơn hàng</p>
        </div>
        <div className="section2">
          <div className="sq sq1" onClick={() => nav("postmanage")}>
            Tin đăng bán
          </div>
          <div className="sq sq2" onClick={() => nav("mailContactManage")}>
            Đơn của khách{" "}
          </div>
          <div className="sq sq3" onClick={() => nav("/postingCar")}>
            Đăng bán xe
          </div>
        </div>
      </div>
      <div className="ProviderTLContent">
        <Outlet></Outlet>
      </div>
    </div>
  );
};

export default ProviderPage;
