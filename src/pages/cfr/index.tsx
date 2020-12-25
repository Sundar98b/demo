import Fuse from "fuse.js";
import styled from "styled-components";
import React, {
  Suspense,
  cloneElement,
  lazy,
  useEffect,
  useState,
} from "react";
import {
  MessageOutlined,
  TeamOutlined,
  SearchOutlined,
  MailOutlined 
} from "@ant-design/icons";

import { Col, Input, Row, Skeleton } from "antd";
import {
  Link,
  Route,
  RouteComponentProps,
  useLocation,
} from "react-router-dom";

import RootPage from "../root";
import Utils from "../../utils";
import retry from "../../utils/retry";

/* prettier-ignore */
const Feedback =  lazy(() =>  retry(() => import("./feedback")));
const Oneonone =  lazy(() =>  retry(() => import("./one-on-onefeed")));
const Survey = lazy(()=>retry(()=> import ("../performance/performance-management/questionnaire")))
// const Audit = lazy(() => retry(() => import("./system-audit")));
// const BillingPayments = lazy(() => retry(() => import("./billing-payments")));
// const Intergration = lazy(() => retry(() => import("./intergration")));
// const KPI = lazy(() => retry(() => import("./kpi")));
// const LineOfBusiness = lazy(() => retry(() => import("./line-of-business")));
// const Notification = lazy(() => retry(() => import("./notification")));
// const Organization = lazy(() => retry(() => import("./organization-page")));
// const ProductSettings = lazy(() => retry(() => import("./product-settings")));
// const RolesAndPermission = lazy(() => retry(() => import("./tool-privileges")));
// const Users = lazy(() => retry(() => import("./users")));
// const OrganizationSetup = lazy(() =>
//   retry(() => import("./organization-setup")),
// );
// const ImportData = lazy(() => retry(() => import("./import-data")));

const FacllBack = () => {
  return <Skeleton />;
};

const { xs } = Utils.MediaQuery;

const SettingsTitle = styled.div`
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 100;
  font-size: 12px;
  color: #718096;
  padding: 12px;
  margin-bottom: 3px;
`;

const Sidebar = styled.div`
  border: var(--light-bdr);
  color: #546e7a;
  background: #fafbfb;
  padding-bottom: 18px;
  min-height: 100%;
  overflow-y: auto;
`;
const ContentWarpper = styled.div`
  margin: 3px;
  padding-left: 12px;
  height:100%;
`;
//need to change bg
const Item = styled.div`
  line-height: 30px;
  padding: 3px;
  overflow: hidden;
  text-overflow: ellipsis;
  background: ${props => (props.active ? "#ffffff;" : "transparent")};
  border-right: ${props => (props.active ? "2px solid #9C27B0" : "none")};

  a {
    display: block;
    padding: 3px 6px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--table-color);
    color: ${props =>
      props.active ? "var(--primary-color)" : "var(--table-color)"};
    .anticon {
      margin-right: 8px;
    }
  }
`;

const SettingsItem = styled.div`
  width: 33.33333339%;
  float: left;
  height: 120px;
  padding-left: 5px;
  ${xs} {
    width: 100%;
  }
  .icons {
    display: inline-block;
    vertical-align: middle;
    width: 13%;
    color: #000;
  }
  .contents {
    display: inline-block;
    vertical-align: middle;
    padding-left: 20px;
    width: 80%;
    color: #000;
    font-weight: bolder;
    small {
      color: var(--black);
    }
  }
`;

export const SettingsList = [
//   {
//     name: "Users",
//     icon: <UserOutlined />,
//     link: "users",
//     tags: ["Users", "User Roles"],
//   },

//   {
//     name: "Tool Privilege",
//     icon: <ControlOutlined />,
//     link: "tool-privilege",
//     tags: ["Config", "Access Control Information", "roles"],
//   },

//   {
//     name: "KPI",
//     icon: <PieChartOutlined />,
//     link: "kpi",
//     tags: ["Key", "Performance", "Indicator"],
//   },

//   {
//     name: "Notification",
//     icon: <BellOutlined />,
//     link: "notification",
//     tags: ["Notification Settings", "Enable/ Disable"],
//   },
//   {
//     name: "System Audit",
//     icon: <AuditOutlined />,
//     link: "audit",
//     tags: ["Application Audit", "Audit Logs", "Application Logs"],
//   },
//   {
//     name: "Data Import",
//     icon: <UploadOutlined />,
//     link: "import-data",
//     tags: ["csv", "Excel Import", "Import Data"],
//   },
//   {
//     name: "Organization Setup",
//     icon: <DatabaseOutlined />,
//     link: "organization-setup",
//     tags: ["Band", "BU", "Cost Center", "Location", "Etc"],
//   },
//   {
//     name: "Organization Info",
//     icon: <BankOutlined />,
//     link: "organization-info",
//     tags: ["Organization Settings", "Logo", "Branding"],
//     isProductAdmin: true,
//   },
//   {
//     name: "Product Settings",
//     icon: <CrownOutlined />,
//     link: "product-settings",
//     tags: ["Year Configuration", "Frequency Configuration"],
//     isProductAdmin: true,
//   },
//   {
//     name: "Application Settings",
//     icon: <AppstoreOutlined />,
//     link: "application",
//     tags: ["Year Configuration", "Frequency Configuration"],
//     isProductAdmin: true,
//   },
//   {
//     name: "Billing & Payment",
//     icon: <DollarCircleOutlined />,
//     link: "billing-payments",
//     tags: ["Subscription", "Application Invoice"],
//     isProductAdmin: true,
//   },

//   {
//     name: "Intergration",
//     icon: <ApiOutlined />,
//     link: "intergration",
//     tags: ["Zapier", "Import Data"],
//     isProductAdmin: true,
//   },
    {
        name: "Feedback",
        icon: <MessageOutlined />,
        link: "feedback",
        tags: ["Feedback to team or manager"],
      },
      {
        name: "1-on-1 meeting",
        icon : <TeamOutlined />,
        link: "oneononefeed",
        tags: ["Meeting between one member at a time"],
      },
      {
        name: "Survey",
        icon : <SearchOutlined />,
        link: "survey",
        tags: ["Survey"],
      },
      {
        name: "KR Discussion",
        icon : <MailOutlined />,
        link: "krconversation",
        tags: ["KR Discussion"],
      },
];
const Wrapper = styled.div`
  padding: 12px;
`;

const Login: React.FC<RouteComponentProps> = ({ match }) => {
  const [active, setActive] = useState<string>("");
  const [hideSidebar, sethideSidebar] = useState(true);
  const [StList, setStList] = useState(SettingsList);

  const location = useLocation();

  useEffect(() => {
    let name = location.pathname.replace("/cfr/", "");
    name = name.replace("/new", "");
    if (name.indexOf("users/") !== -1) {
      name = "users";
    }
    if (name.indexOf("tool-privilege/") !== -1) {
      name = "tool-privilege";
    }
    setActive(name);
    if (name === "/cfr" || name === "") {
      sethideSidebar(false);
    } else {
      sethideSidebar(true);
    }
  }, [location]);

  const SearchSettings = (e: any) => {
    const q = e.target.value;

    let options = {
      shouldSort: true,
      threshold: 0.1,
      location: 0,
      distance: 100,
      minMatchCharLength: 4,
      keys: ["name", "tags"],
    };
    const fuse = new Fuse(SettingsList, options); // "list" is the item array
    const result: any = fuse.search(q);
    const finalResult: any = [];
    if (result.length) {
      result.forEach((item: any) => {
        finalResult.push(item.item);
      });
      setStList(finalResult);
    } else {
      setStList(SettingsList);
    }
  };

  return (
    <>
      <RootPage sidebar="CFR">
          <Row style={{height:"100%"}}>
            {hideSidebar && (
              <Col span={4} xs={24} md={4}>
                <Sidebar className="sidebars hidden-xs">
                  <SettingsTitle>CFR</SettingsTitle>

                  {SettingsList.map(item => (
                      <Item
                        active={active === item.link}
                        className={active === item.link ? "active" : ""}
                      >
                        <Link to={"/cfr/" + item.link}>
                          {item.icon} {item.name}
                        </Link>
                      </Item>
                  ))}
                </Sidebar>
              </Col>
            )}
            <Col
              span={hideSidebar ? 20 : 24}
              xs={24}
              md={hideSidebar ? 20 : 24}
            >
              {!hideSidebar && (
                <Wrapper>
                  <Row>
                    <Col span={8} />
                    <Col span={8} xs={24} md={8} className="tc">
                      <p>&nbsp;</p>
                      <Input.Search
                        placeholder="Search"
                        style={{ width: "100%" }}
                        autoFocus={true}
                        onChange={SearchSettings}
                      />
                    </Col>
                  </Row>
                  <p>&nbsp;</p>
                  <Row>
                    <Col span={2} className="hidden-xs"></Col>
                    <Col span={18} xs={24} md={18}>
                      {StList.map(item => (
                        
                          <Link to={"/cfr/" + item.link}>
                            <SettingsItem>
                              <div className="icons">
                                {cloneElement(item.icon, {
                                  style: { fontSize: 30 },
                                })}
                              </div>
                              <div className="contents">
                                <p>{item.name}</p>
                                <small>{item.tags.join(", ")}</small>
                              </div>
                            </SettingsItem>
                          </Link>
                      ))}
                    </Col>
                  </Row>
                </Wrapper>
              )}
              {hideSidebar && (
                <ContentWarpper>
                  {/* prettier-ignore */}
                  <Suspense fallback={<FacllBack />}>
                  <Route path="/cfr/feedback" component={Feedback} />
                  <Route path="/cfr/oneononefeed" component={Oneonone} />
                  <Route path="/cfr/survey" component={Survey} />
                  {/* <Route path="/settings/audit" component={Audit} />
                  <Route path="/settings/kpi" component={KPI} />
                  <Route path="/settings/billing-payments" component={BillingPayments} />
                  <Route path="/settings/intergration" component={Intergration} />
                  <Route path="/settings/import-data" component={ImportData} />
                  <Route path="/settings/line-of-business" component={LineOfBusiness} />
                  <Route path="/settings/notification" component={Notification} />
                  <Route path="/settings/organization-info" component={Organization} />
                  <Route path="/settings/product-settings" component={ProductSettings} />
                  <Route path="/settings/tool-privilege" exact component={RolesAndPermission} />
                  <Route path="/settings/users" component={Users} /> */}
                </Suspense>
                </ContentWarpper>
              )}
            </Col>
          </Row>
      </RootPage>
    </>
  );
};

export default Login;
