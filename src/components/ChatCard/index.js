import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Badge, IconButton } from "@mui/material";
import ForumIcon from "@mui/icons-material/Forum";
// // Comment out Firebase imports
/*
import {
  collection,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import db from '../../configs/firebase-config';
*/
import { ROLES_NAME } from "../../configs/constants";

// Comment out Firebase collection reference
// const chatRoomCollectionRef = collection(db, 'chatRooms');

const ChatCard = () => {
  const { currentUser } = useSelector((state) => state.user);
  const nav = useNavigate();
  const [count, setCount] = React.useState(0);

  const isEmployer = React.useMemo(() => {
    return currentUser?.roleName === ROLES_NAME.EMPLOYER;
  }, [currentUser]);

  // Thay thế useEffect có Firebase
  React.useEffect(() => {
    // Giả lập số tin nhắn chưa đọc
    setCount(0);
    return () => {};
  }, [currentUser]);

  const handleRedirect = () => {
    if (isEmployer) {
      nav("/ket-noi-voi-ung-vien");
    } else {
      nav("/ket-noi-voi-nha-tuyen-dung");
    }
  };

  return (
    <IconButton
      onClick={handleRedirect}
      size="large"
      aria-label="show new notifications"
      color="inherit"
    >
      <Badge badgeContent={count} color="error">
        <ForumIcon />
      </Badge>
    </IconButton>
  );
};

export default ChatCard;
