import process from "process";
import React, { useEffect, useState } from "react";
import { Button, Modal, Result } from "antd";
import { useDispatch, useSelector } from "react-redux";

import HttpService from "../../services/httpService";
import LoginPage from "../login";
import PageLoader from "../../components/page-loader";
import SubDomainErrorPage from "../subdomain-error";
import Utils from "../../utils";
import { SetInitialData, SetMessageCount } from "../../redux/actions/init";
import { SetTenant } from "../../redux/actions/tenant";
import { toggleRoleNotifier } from "../../redux/actions/role";

const Middlewares: React.FC = props => {
  const [IsDataLoaded, setIsDataLoaded] = useState(false);
  const [IsError, setIsError] = useState(false);
  const isLoginPage =
    window.location.pathname.includes("/login") &&
    !window.location.pathname.includes("/login/auth");
  const isErrorPage = window.location.pathname === "/error";
  const [DomainValid, setDomainValid] = useState(false);
  const [SubDomainCall, setSubDomainCall] = useState(false);
  const [isAdminAuthInCall, setAdminAuthInCall] = useState(false);
  const dispatcher = useDispatch();
  let roleData: any = {};
  const INITIAL_DATA = useSelector((store: any) => store.INITIAL_DATA);
  const messageCount = useSelector((store: any) => store.MESSAGE_COUNT);

  if (INITIAL_DATA?.roles) {
    roleData = INITIAL_DATA.roles;
  }

  const store = useSelector((store: any) => store.ROLE_STORE);

  const onCloseRoleModal = () => {
    dispatcher(toggleRoleNotifier({ module: "", visible: false }));
  };
  const getSystemAdminAccessToken = (token: string, res: any) => {
    setIsDataLoaded(false);
    HttpService.get(
      `login/admin`,
      {},
      {
        token: token,
      },
    )
      .then(res => {
        window.sessionStorage.setItem("x-token", res);
        setIsDataLoaded(true);
        dispatcher(SetTenant({ id: res.id }));
        (window as any).tenant_id = res.id;
        setSubDomainCall(true);
        setDomainValid(true);
        window.location.href = "/";
      })
      .catch(err => {
        window.location.href = "/error";
      });
  };
  useEffect(() => {
    if (window.location.pathname !== "/error") {
      const res = Utils.splitHostname();

      HttpService.get(
        "login/subdomain",
        {},
        {
          domain: res.subdomain,
        },
      )
        .then(res => {
          dispatcher(SetTenant({ id: res.id }));
          (window as any).tenant_id = res.id;

          if (window.location.pathname.includes("login/auth")) {
            setIsDataLoaded(true);
            let search = window.location.search;
            let params = new URLSearchParams(search);
            let orgToken = params.get("token");

            if (orgToken) {
              setAdminAuthInCall(true);
              getSystemAdminAccessToken(orgToken, res);
            }
          }

          setSubDomainCall(true);
          setDomainValid(true);
        })
        .catch(() => {
          window.location.href = "/error";
          setDomainValid(false);
        })
        .finally(() => {
          setSubDomainCall(true);
        });
    } else {
      setSubDomainCall(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatcher]);

  useEffect(() => {
    if (DomainValid) {
      let hasTenantID = (window as any).tenant_id || "";
      if (!hasTenantID) {
        setIsError(true);
      } else {
        if (!isLoginPage && !isAdminAuthInCall) {
          let hasToken = window.sessionStorage.getItem("x-token") || null;

          if (!hasToken) {
            window.location.href = "/login";
          }
          if (!isAdminAuthInCall) {
            HttpService.get("init-setup")
              .then(res => {
                if (process.env.NODE_ENV !== "production") {
                  (window as any).store = res;
                }
                setIsDataLoaded(true);
                res.unread = res.notifications.length;
                dispatcher(SetInitialData(res));
                dispatcher(SetMessageCount(res.messages || 0));
                const title: any = document.querySelector("title");
                if (title) {
                  title.innerHTML =
                    "Datalligence AI | " + res.organization?.name;
                }
              })
              .catch(error => {
                if (error.response && error.response?.status === 403) {
                  window.location.href = "/login";
                } else {
                  setIsError(true);
                }
              });
          }
        }
      }
    }
  }, [isLoginPage, dispatcher, DomainValid, isAdminAuthInCall]);

  useEffect(() => {
    if (INITIAL_DATA?.user?.id) {
      //@ts-ignore
      window.sockets.off("user_" + INITIAL_DATA.user.id);
      //@ts-ignore
      window.sockets?.on("user_" + INITIAL_DATA.user.id, val => {
        if (val) {
          const newData: any = { ...INITIAL_DATA };
          newData.notifications.unshift(val);
          newData.unread = newData.unread + 1;
          Utils.notifyMe(val.message, val.image.toUpperCase());
          dispatcher(SetInitialData(newData));
        }
      });
      //@ts-ignore
      window.sockets.off("user_message_" + INITIAL_DATA.user.id);
      //@ts-ignore
      window.sockets?.on("user_message_" + INITIAL_DATA.user.id, val => {
        dispatcher(SetMessageCount(messageCount + 1));
        if (!window.location.href.includes("performance/checkin/")) {
          Utils.notifyMe(val.message, "New Message Received");
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [INITIAL_DATA, dispatcher]);

  const Reload = () => {
    window.location.reload();
  };

  const subTitle = (props: any) =>
    roleData?.name !== "Org Admin" ? (
      <>
        The module <strong>{props.module}</strong> is not enabled, contact your
        admin to gain access
      </>
    ) : (
      <>
        The module <strong>{props.module}</strong> is not enabled, Please
        Contact Datalligence Team
      </>
    );
  const title =
    roleData?.name !== "Org Admin"
      ? "Insufficient Permission"
      : "Module is not Enabled";
  const ButtonText =
    roleData?.name !== "Org Admin"
      ? "Notify Admin"
      : "Contact Datalligence Team";

  return (
    <>
      <Modal
        title={title}
        visible={store.visible}
        wrapClassName="logout-modal"
        onCancel={onCloseRoleModal}
        okText={ButtonText}
      >
        <p>{subTitle(store)}</p>
      </Modal>

      {IsError && !isAdminAuthInCall && (
        <>
          <p>&nbsp;</p>
          <Result
            status="500"
            title="500"
            subTitle="Sorry, something went wrong"
            extra={
              <Button onClick={Reload} type="primary">
                Reload Page
              </Button>
            }
          />
        </>
      )}
      {!IsError &&
        !IsDataLoaded &&
        !isLoginPage &&
        !SubDomainCall &&
        isAdminAuthInCall && <PageLoader />}
      {IsDataLoaded && props.children}
      {!IsError && isLoginPage && <LoginPage />}
      {SubDomainCall && isErrorPage && <SubDomainErrorPage />}
    </>
  );
};

export default Middlewares;
