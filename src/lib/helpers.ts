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


export const  formatDateOption = (dateString: string | number | Date) => {
  const date = new Date(dateString);

  const day = date.getUTCDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getUTCFullYear();

  const getOrdinalSuffix = (day: number) => {
    if (day > 3 && day < 21) return 'th'; 
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  return `${day}${getOrdinalSuffix(day)} ${month}, ${year}`;
}

export const formatTo12Hour = (isoString: string): string => {
  const date = new Date(isoString);

  let hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const isAM = hours < 12;

  // Convert to 12-hour format
  hours = hours % 12 || 12; 

  // Format minutes to always be two digits
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  // Combine the formatted time with AM/PM
  const ampm = isAM ? 'am' : 'pm';
  
  return `${hours}:${formattedMinutes}${ampm}`;
};


