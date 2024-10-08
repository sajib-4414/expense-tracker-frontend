import  { useEffect } from "react";
import { LoggedInUser } from "../../models/user.models";
import { useAppSelector } from "../../store/store";
import { router } from "../../router";
const GuardedHOC = (OriginalComponent:any) => {
  function NewComponent(props:any) {
  //render OriginalComponent and pass on its props.
    
  const loggedInUser: LoggedInUser|null = useAppSelector(
    (state) => state.userSlice.loggedInUser,
  );
  useEffect(()=>{
    if (!loggedInUser) {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          router.navigate("/login");
        }
    }
  },[loggedInUser])
    return loggedInUser ? <OriginalComponent {...props} /> : null;
  }
  return NewComponent;
};
export default GuardedHOC;


