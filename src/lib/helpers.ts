import { useDispatch, useSelector } from "react-redux";
import { logoutUser, User } from "../redux/slices/user.slice";
import { RootState } from "../redux/store"; // Assuming you have a RootState type defined

interface UseIsLoggedInProps {
  message: string;
}

interface UserState {
  user: User;
  access_token?: string;
  expiresIn?: number;
}

export const useIsLoggedIn = ({ message }: UseIsLoggedInProps) => {
  const user = useSelector((state: RootState) => state.user as UserState);
  const dispatch = useDispatch();

  console.log(user);

  const token = user?.access_token;
  const expiresIn = user?.expiresIn;

  if (!token) {
    return { isLoggedIn: false, message };
  }

  const isLogin = expiresIn ? Date.now() < expiresIn * 1000 : false;

  if (!isLogin || token === null) {
    dispatch(logoutUser());
    return { isLoggedIn: false, message };
  }

  return { isLoggedIn: true };
};

export const formatDate = (isoDateString: string): string => {
  const date = new Date(isoDateString);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  // Function to get the ordinal suffix for a given day
  const getOrdinalSuffix = (day: number): string => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const dayWithSuffix = `${day}${getOrdinalSuffix(day)}`;
  return `${dayWithSuffix} ${month} ${year}`;
};
