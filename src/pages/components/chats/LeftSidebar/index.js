import React from 'react';
import { Stack, Box, CircularProgress, Typography } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import CircleIcon from '@mui/icons-material/Circle';

import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  startAfter,
  limit,
  getDocs,
} from 'firebase/firestore';
import db from '../../../../configs/firebase-config';

// import NoDataCard from '../../../../components/NoDataCard';
import { ImageSvg15 } from '../../../../configs/constants';
import { ChatContext } from '../../../../context/ChatProvider';
import MuiImageCustom from '../../../../components/MuiImageCustom';
import ChatRoomSearch from '../../../../components/chats/ChatRoomSearch';
import { useDebounce } from '../../../../hooks';
import { getUserAccount } from '../../../../services/firebaseService';

const LoadingComponentItem = () => {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Box>
        <CircularProgress variant="circular" width={54} height={54} />
      </Box>
      <Stack flex={1} spacing={1}>
        <CircularProgress variant="rounded" />
        <CircularProgress variant="rounded" />
      </Stack>
    </Stack>
  );
};

const LIMIT = 20;
const chatRoomCollectionRef = collection(db, 'chatRooms');

const LeftSidebar = () => {
  const { currentUserChat, setSelectedRoomId } = React.useContext(ChatContext);
  const [searchText, setSearchText] = React.useState('');
  const deboundedTextValue = useDebounce(searchText, 500);

  const [isLoading, setIsLoading] = React.useState(true);
  const [hasMore, setHasMore] = React.useState(true);
  const [lastDocument, setLastDocument] = React.useState(null);
  const [chatRooms, setChatRooms] = React.useState([]);
  const [page, setPage] = React.useState(0);

  const handleSelectRoom = (chatRoom) => {
    setSelectedRoomId(chatRoom?.id);
  };

  React.useEffect(() => {
    console.log('==> Bắn API Search: ', deboundedTextValue);
  }, [deboundedTextValue]);

  // lang nghe tong chat rooms
  React.useEffect(() => {
    if (currentUserChat) {
      const q = query(
        chatRoomCollectionRef,
        where('members', 'array-contains', `${currentUserChat.userId}`)
      );

      const unsubscribe = onSnapshot(q, async (querySnapshot) => {
        // setCount(querySnapshot?.size || 0);
      });

      return () => {
        unsubscribe();
      };
    }
  }, [currentUserChat]);

  // load danh sach chat rooms
  React.useEffect(() => {
    let unsubscribe = () => {};

    const loadChatRooms = async () => {
      if (!currentUserChat) return;

      try {
        setIsLoading(true);
        let q = query(
          chatRoomCollectionRef,
          where('members', 'array-contains', `${currentUserChat.userId}`),
          orderBy('updatedAt', 'desc'),
          limit(LIMIT)
        );

        unsubscribe = onSnapshot(q, async (querySnapshot) => {
          try {
            const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
            setLastDocument(lastVisible);

            const chatRoomsData = [];
            const promises = querySnapshot.docs.map(async (doc) => {
              const chatRoomData = doc.data();
              let partnerId = '';

              if (chatRoomData?.userId1 === `${currentUserChat.userId}`) {
                partnerId = chatRoomData?.userId2;
              } else {
                partnerId = chatRoomData?.userId1;
              }

              const userAccount = await getUserAccount('accounts', `${partnerId}`);
              
              chatRoomsData.push({
                ...chatRoomData,
                id: doc.id,
                user: userAccount,
              });
            });

            await Promise.all(promises);
            setChatRooms(chatRoomsData);
            setHasMore(chatRoomsData.length >= LIMIT);
            setPage(1);
          } catch (error) {
            console.error('Error processing chat rooms:', error);
          } finally {
            setIsLoading(false);
          }
        });
      } catch (error) {
        console.error('Error loading chat rooms:', error);
        setIsLoading(false);
      }
    };

    loadChatRooms();

    return () => {
      unsubscribe();
    };
  }, [currentUserChat]);

  const fetchMoreData = async () => {
    if (!lastDocument || !currentUserChat) return;

    try {
      const q = query(
        chatRoomCollectionRef,
        where('members', 'array-contains', `${currentUserChat.userId}`),
        orderBy('updatedAt', 'desc'),
        startAfter(lastDocument),
        limit(LIMIT)
      );

      const querySnapshot = await getDocs(q);
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      setLastDocument(lastVisible);

      const newChatRooms = [];
      const promises = querySnapshot.docs.map(async (doc) => {
        const chatRoomData = doc.data();
        let partnerId = '';

        if (chatRoomData?.userId1 === `${currentUserChat.userId}`) {
          partnerId = chatRoomData?.userId2;
        } else {
          partnerId = chatRoomData?.userId1;
        }

        const userAccount = await getUserAccount('accounts', `${partnerId}`);
        
        newChatRooms.push({
          ...chatRoomData,
          id: doc.id,
          user: userAccount,
        });
      });

      await Promise.all(promises);
      setChatRooms((prev) => [...prev, ...newChatRooms]);
      setHasMore(newChatRooms.length >= LIMIT);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error('Error fetching more chat rooms:', error);
    }
  };

  if (isLoading) {
    return (
      <Stack spacing={2} p={2}>
        {[...Array(5)].map((_, index) => (
          <LoadingComponentItem key={index} />
        ))}
      </Stack>
    );
  }

  return (
    <Stack height="100%">
      <Box p={2}>
        <ChatRoomSearch
          value={searchText}
          setValue={setSearchText}
          placeholder="Tên công ty, tên nhà tuyển dụng, ..."
        />
      </Box>

      {chatRooms.length === 0 ? (
        <Stack flex={1} justifyContent="center" alignItems="center" spacing={2}>
          <MuiImageCustom src={ImageSvg15} alt="No data" sx={{ width: 200 }} />
          <Typography>Không tìm thấy cuộc trò chuyện nào...</Typography>
        </Stack>
      ) : (
        <Box flex={1} overflow="auto" id="scrollableDiv">
          <InfiniteScroll
            dataLength={chatRooms.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={
              <Box textAlign="center" py={2}>
                <CircularProgress size={24} />
              </Box>
            }
            scrollableTarget="scrollableDiv"
          >
            <Stack spacing={0.5}>
              {chatRooms.map((chatRoom) => (
                <Stack
                  key={chatRoom.id}
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                  onClick={() => handleSelectRoom(chatRoom)}
                >
                  <Box position="relative">
                    <MuiImageCustom
                      src={chatRoom?.user?.avatarUrl}
                      alt={chatRoom?.user?.name}
                      sx={{
                        width: 54,
                        height: 54,
                        borderRadius: '50%',
                      }}
                    />
                    {chatRoom?.user?.isOnline && (
                      <CircleIcon
                        sx={{
                          position: 'absolute',
                          right: 0,
                          bottom: 0,
                          color: 'success.main',
                          fontSize: 14,
                        }}
                      />
                    )}
                  </Box>
                  <Stack flex={1} spacing={0.5}>
                    <Typography variant="subtitle2" noWrap>
                      {chatRoom?.user?.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {chatRoom?.user?.company?.companyName || '---'}
                    </Typography>
                  </Stack>
                  <Box>
                    {`${chatRoom?.recipientId}` ===
                      `${currentUserChat.userId}` &&
                      chatRoom?.unreadCount > 0 && (
                        <CircleIcon
                          style={{ color: '#2979ff', fontSize: 12 }}
                        />
                      )}
                  </Box>
                </Stack>
              ))}
            </Stack>
          </InfiniteScroll>
        </Box>
      )}
    </Stack>
  );
};

const EmployerSidebar = () => {
  const { currentUserChat, setSelectedRoomId } = React.useContext(ChatContext);
  const [searchText, setSearchText] = React.useState('');
  const deboundedTextValue = useDebounce(searchText, 500);

  const [isLoading, setIsLoading] = React.useState(true);
  const [hasMore, setHasMore] = React.useState(true);
  const [lastDocument, setLastDocument] = React.useState(null);
  const [chatRooms, setChatRooms] = React.useState([]);
  const [page, setPage] = React.useState(0);

  const handleSelectRoom = (chatRoom) => {
    setSelectedRoomId(chatRoom?.id);
  };

  React.useEffect(() => {
    console.log('==> Bắn API Search: ', deboundedTextValue);
  }, [deboundedTextValue]);

  // lang nghe tong chat rooms
  React.useEffect(() => {
    if (currentUserChat) {
      const q = query(
        chatRoomCollectionRef,
        where('members', 'array-contains', `${currentUserChat.userId}`)
      );

      const unsubscribe = onSnapshot(q, async (querySnapshot) => {
        // setCount(querySnapshot?.size || 0);
      });

      return () => {
        unsubscribe();
      };
    }
  }, [currentUserChat]);

  // load danh sach chat rooms
  React.useEffect(() => {
    let unsubscribe = () => {};

    const loadChatRooms = async () => {
      if (!currentUserChat) return;

      try {
        setIsLoading(true);
        let q = query(
          chatRoomCollectionRef,
          where('members', 'array-contains', `${currentUserChat.userId}`),
          orderBy('updatedAt', 'desc'),
          limit(LIMIT)
        );

        unsubscribe = onSnapshot(q, async (querySnapshot) => {
          try {
            const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
            setLastDocument(lastVisible);

            const chatRoomsData = [];
            const promises = querySnapshot.docs.map(async (doc) => {
              const chatRoomData = doc.data();
              let partnerId = '';

              if (chatRoomData?.userId1 === `${currentUserChat.userId}`) {
                partnerId = chatRoomData?.userId2;
              } else {
                partnerId = chatRoomData?.userId1;
              }

              const userAccount = await getUserAccount('accounts', `${partnerId}`);
              
              chatRoomsData.push({
                ...chatRoomData,
                id: doc.id,
                user: userAccount,
              });
            });

            await Promise.all(promises);
            setChatRooms(chatRoomsData);
            setHasMore(chatRoomsData.length >= LIMIT);
            setPage(1);
          } catch (error) {
            console.error('Error processing chat rooms:', error);
          } finally {
            setIsLoading(false);
          }
        });
      } catch (error) {
        console.error('Error loading chat rooms:', error);
        setIsLoading(false);
      }
    };

    loadChatRooms();

    return () => {
      unsubscribe();
    };
  }, [currentUserChat]);

  const fetchMoreData = async () => {
    if (!lastDocument || !currentUserChat) return;

    try {
      const q = query(
        chatRoomCollectionRef,
        where('members', 'array-contains', `${currentUserChat.userId}`),
        orderBy('updatedAt', 'desc'),
        startAfter(lastDocument),
        limit(LIMIT)
      );

      const querySnapshot = await getDocs(q);
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      setLastDocument(lastVisible);

      const newChatRooms = [];
      const promises = querySnapshot.docs.map(async (doc) => {
        const chatRoomData = doc.data();
        let partnerId = '';

        if (chatRoomData?.userId1 === `${currentUserChat.userId}`) {
          partnerId = chatRoomData?.userId2;
        } else {
          partnerId = chatRoomData?.userId1;
        }

        const userAccount = await getUserAccount('accounts', `${partnerId}`);
        
        newChatRooms.push({
          ...chatRoomData,
          id: doc.id,
          user: userAccount,
        });
      });

      await Promise.all(promises);
      setChatRooms((prev) => [...prev, ...newChatRooms]);
      setHasMore(newChatRooms.length >= LIMIT);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error('Error fetching more chat rooms:', error);
    }
  };

  if (isLoading) {
    return (
      <Stack spacing={2} p={2}>
        {[...Array(5)].map((_, index) => (
          <LoadingComponentItem key={index} />
        ))}
      </Stack>
    );
  }

  return (
    <Stack height="100%">
      <Box p={2}>
        <ChatRoomSearch
          value={searchText}
          setValue={setSearchText}
          placeholder="Họ tên ứng viên ..."
        />
      </Box>

      {chatRooms.length === 0 ? (
        <Stack flex={1} justifyContent="center" alignItems="center" spacing={2}>
          <MuiImageCustom src={ImageSvg15} alt="No data" sx={{ width: 200 }} />
          <Typography>Không tìm thấy cuộc trò chuyện nào...</Typography>
        </Stack>
      ) : (
        <Box flex={1} overflow="auto" id="scrollableDiv">
          <InfiniteScroll
            dataLength={chatRooms.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={
              <Box textAlign="center" py={2}>
                <CircularProgress size={24} />
              </Box>
            }
            scrollableTarget="scrollableDiv"
          >
            <Stack spacing={0.5}>
              {chatRooms.map((chatRoom) => (
                <Stack
                  key={chatRoom.id}
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                  onClick={() => handleSelectRoom(chatRoom)}
                >
                  <Box position="relative">
                    <MuiImageCustom
                      src={chatRoom?.user?.avatarUrl}
                      alt={chatRoom?.user?.name}
                      sx={{
                        width: 54,
                        height: 54,
                        borderRadius: '50%',
                      }}
                    />
                    {chatRoom?.user?.isOnline && (
                      <CircleIcon
                        sx={{
                          position: 'absolute',
                          right: 0,
                          bottom: 0,
                          color: 'success.main',
                          fontSize: 14,
                        }}
                      />
                    )}
                  </Box>
                  <Stack flex={1} spacing={0.5}>
                    <Typography variant="subtitle2" noWrap>
                      {chatRoom?.user?.name || '---'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {chatRoom?.user?.email || '---'}
                    </Typography>
                  </Stack>
                  <Box>
                    {`${chatRoom?.recipientId}` ===
                      `${currentUserChat.userId}` &&
                      chatRoom?.unreadCount > 0 && (
                        <CircleIcon
                          style={{ color: '#2979ff', fontSize: 12 }}
                        />
                      )}
                  </Box>
                </Stack>
              ))}
            </Stack>
          </InfiniteScroll>
        </Box>
      )}
    </Stack>
  );
};

LeftSidebar.Employer = EmployerSidebar;

export default LeftSidebar;
