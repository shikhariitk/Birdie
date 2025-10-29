import React, { useState, useEffect } from "react";
import { Tab, Tabs, createTheme } from "@mui/material";
import useThemeContext from "../../contexts/themeContext";
import useUserContext from "../../contexts/UserContext";
import { useParams, useSearchParams } from "react-router-dom";
import usePageContext from "../../contexts/pageContext";
import Posts from "./Posts";
import Media from "./Media";
import Following from "./Following";
import { Navigate } from "react-router-dom";

const tabDarkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const Profile = () => {
  const { userId } = useParams();
  const { followUser } = usePageContext();
  const [tabFullWidth, setTabFullWidth] = useState(!(window.innerWidth < 400));
  const [profileData, setProfileData] = useState({});
  const [queryParams, setQueryParams] = useSearchParams();
  const { darkTheme } = useThemeContext();
  const handleChange = (x, value) => {
    setQueryParams({ tab: value });
  };
  const {
    axiosInstance,
    profileData: { id: curId },
  } = useUserContext();

  useEffect(() => {
    axiosInstance
      .get(`/accounts/${userId}/info/`)
      .then((response) => setProfileData(response.data));
  }, [axiosInstance, userId]);

  const {
    id,
    username,
    profile_pic,
    followers,
    following,
    date_joined,
    cover_pic,
    is_following,
  } = profileData;
  const currentTab = queryParams.get("tab") || "posts";

  useEffect(() => {
    if (!username) return;
    document.title = `ConnectU Profile | @${username}`;
    return function () {
      document.title = "ConnectU";
    };
  }, [username]);

  const handleFollowUnfollow = () => {
    const success = (response) => {
      const { followers } = response.data;
      setProfileData((prev) => ({ ...prev, followers: followers }));
    };
    const failure = () => {
      alert(
        "Could no't complete action, check internet connection and refresh"
      );
    };
    followUser(id, success, failure);
  };

  const checkWindowSize = () => {
    if (window.innerWidth < 400) {
      setTabFullWidth(false);
    } else setTabFullWidth(true);
  };

  useEffect(() => {
    window.addEventListener("resize", checkWindowSize);
    return () => {
      window.removeEventListener("resize", checkWindowSize);
    };
  }, []);

  if (curId && curId === id) {
    return <Navigate to="/profile" />;
  }
  return (
    <div className="w-[599px] max-w-[99%] mt-1 mx-auto">
      <div className="bg-gray-100 dark:bg-[#030108]">
        <div className="h-[270px] w-full relative">
          <div className="h-[200px]">
            <img
              src={cover_pic}
              alt="cover"
              className="w-full h-full object-cover"
            ></img>
          </div>
          {profile_pic ? (
            <img
              src={profile_pic}
              alt={username}
              className="rounded-full object-cover w-[136px] h-[136px] absolute top-1/2 left-2 border-4 border-purple-500"
            ></img>
          ) : (
            <div className="rounded-full w-[136px] h-[136px] flex items-center justify-center text-white text-5xl absolute top-1/2 left-2 border-4 bg-[#bdbdbd]">
              {username && username.at(0).toUpperCase()}
            </div>
          )}
          <button
            onClick={handleFollowUnfollow}
            className="float-right m-4 border-2 p-1 px-2 rounded-full text-purple-500 text-sm border-purple-500"
          >
            {is_following ? "unfollow" : "follow"}
          </button>
        </div>
        <div className="p-4 flex flex-col gap-1">
          <p className="capitalize text-black text-lg dark:text-gray-400">
            @{username}
          </p>
          <div className="capitalize text-sm text-[#5B7083]">
            joined {date_joined}
          </div>
          <div className="text-[#5b7083] text-sm flex gap-1">
            <div>
              <span className="text-black dark:text-gray-400">
                {followers}{" "}
              </span>
              {followers > 1 ? "followers" : "follower"}
            </div>
            <span className="text-black">.</span>
            <div>
              <span className="text-black dark:text-gray-400">{following}</span>{" "}
              following
            </div>
          </div>
        </div>
      </div>
      <div className="w-full sticky top-0 z-10 mt-3 bg-gray-100 border-b-4 p-3 dark:bg-[#030108] dark:border-gray-900">
        <Tabs
          value={currentTab}
          onChange={handleChange}
          variant={tabFullWidth ? "fullWidth" : "scrollable"}
          aria-label="basic tabs example"
          theme={tabDarkTheme}
          component="nav"
          style={darkTheme ? { background: "#030108" } : null}
        >
          <Tab
            label="Posts"
            value="posts"
            theme={darkTheme ? tabDarkTheme : null}
          />
          <Tab
            label="media"
            value="media"
            theme={darkTheme ? tabDarkTheme : null}
          />
          <Tab
            label="following"
            value="following"
            theme={darkTheme ? tabDarkTheme : null}
          />
        </Tabs>
      </div>
      <div className="w-full mx-auto pl-4">
        {currentTab === "posts" && <Posts />}
        {currentTab === "media" && <Media />}
        {currentTab === "following" && <Following />}
      </div>
    </div>
  );
};

export default Profile;
