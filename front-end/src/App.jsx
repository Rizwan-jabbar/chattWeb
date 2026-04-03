import { Routes, Route } from "react-router-dom";
import Login from "./components/login/login";
import Register from "./components/register/register";
import ProtectedRoutes from "./protectedRoutes";
import Layout from "./components/layout/layout";
import FriendChat from "./components/friends/friendChat";
import Friends from "./components/friends/friends";
import Conversations from "./components/conversations/conversations";
import ReceivedRequests from "./components/friendRequests/receivedRequests";
import SendRequests from "./components/friendRequests/sendRequests";
import Settings from "./components/settings/settings";
import ForgetPasword from "./components/forgetPassword/forgetPassword";




function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgetPassword" element={<ForgetPasword />} />

      <Route element={<ProtectedRoutes />}>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <div
                className="flex h-full min-h-[420px] items-center justify-center rounded-[1.5rem] border border-dashed p-6 text-center sm:rounded-[2rem]"
                style={{
                  borderColor: "var(--panel-border)",
                  background: "var(--panel-bg)",
                }}
              >
                <div className="text-center">
                  <p className="text-base font-semibold sm:text-lg" style={{ color: "var(--app-text)" }}>
                    Select a section from the sidebar
                  </p>
                  <p className="mt-2 text-sm" style={{ color: "var(--muted-text)" }}>
                    Received and sent requests will appear here.
                  </p>
                </div>
              </div>
            }
          />
          <Route path="conversations" element={<Conversations />} />
          <Route path="friends" element={<Friends />} />
          <Route path="friends/:friendId" element={<FriendChat />} />
          <Route path="received-requests" element={<ReceivedRequests />} />
          <Route path="sent-requests" element={<SendRequests />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
