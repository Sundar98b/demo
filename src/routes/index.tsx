import React, { lazy } from "react";
import { Route, Switch } from "react-router-dom";

import HomePage from "../pages/home";
import LoginPage from "../pages/login";
import Todo from "../pages/todo";
import retry from "../utils/retry";

const Reports = lazy(() => retry(() => import("../pages/reports")));
const CFR = lazy(()=> retry(()=>import("../../src/pages/cfr")));
const Settings = lazy(() => retry(() => import("../pages/settings")));
const tasks = lazy(() => retry(() => import("../pages/tasks")));
const ProfilePage = lazy(() => retry(() => import("../pages/profile")));
const DiscussionPage = lazy(() => retry(() => import("../pages/discussion")));
const Performance = lazy(() => retry(() => import("../pages/performance")));
//const Checkin = lazy(() => retry(() => import("../pages/performance/checkin/index")));
const HelpPage = lazy(() => retry(() => import("../pages/help")));
const SubDomainErrorPage = lazy(() =>
  retry(() => import("../pages/subdomain-error")),
);
const CheckInModifier = lazy(() =>
  retry(() => import("../pages/performance/checkin/checkin-modifier")),
);
const Insights = lazy(() => retry(() => import("../pages/insights")));

const AppRoutes: React.FC = () => {
  return (
    // prettier-ignore
    <Switch>
      <Route path="/discussion" component={DiscussionPage} />
      <Route path="/login" exact={true} component={LoginPage} />
      <Route path="/performance/checkin/:role/:kr_id/" component={CheckInModifier} />
      {/* <Route path="/performance/checkin" component={Checkin} /> */}
      <Route path="/performance" component={Performance} />
      <Route path="/profile" component={ProfilePage} />
      <Route path="/reports" component={Reports} />
      <Route path="/cfr" component={CFR} />
      <Route path="/settings" component={Settings} />
      <Route path="/tasks" component={tasks} />
      <Route path="/todo" component={Todo} />
      <Route path="/help" component={HelpPage} />
      <Route path="/error" component={SubDomainErrorPage} />
      <Route path="/"  exact={true} component={Insights} />
    </Switch>
  );
};

export default AppRoutes;
