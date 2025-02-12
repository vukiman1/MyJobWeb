import React from 'react';
import {
  Box,
  Stack,
  TextField,
  Button,
  CircularProgress,
  Card,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import InfiniteScroll from 'react-infinite-scroll-component';

import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  startAfter,
  limit,
  getDocs,
  doc,
  updateDoc,
} from 'firebase/firestore';
import db from '../../../../configs/firebase-config';
import { ChatContext } from '../../../../context/ChatProvider';
import Message from '../Message';
import { ROLES_NAME } from '../../../../configs/constants';
import {
  addDocument,
  getChatRoomById,
  updateChatRoomByPartnerId,
} from '../../../../services/firebaseService';
import ChatInfo from '../../../../components/chats/ChatInfo';
import { Empty } from 'antd';

const LIMIT = 20;
const messageCollectionRef = collection(db, 'messages');

const ChatWindow = () => {
  const { currentUserChat, selectedRoomId } = React.useContext(ChatContext);
  const inputRef = React.useRef(null);
  const messageListRef = React.useRef(null);
  const [inputValue, setInputValue] = React.useState('');

  const [selectedRoom, setSelectedRoom] = React.useState({});
  const [partnerId, setPartnerId] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasMore, setHasMore] = React.useState(true);
  const [lastDocument, setLastDocument] = React.useState(null);
  const [messages, setMessages] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [count, setCount] = React.useState(0);

  // cap nhat unreadCount
  React.useEffect(() => {
    if (selectedRoomId && currentUserChat) {
      const chatRoomDocRef = doc(db, 'chatRooms', `${selectedRoomId}`);

      const unsub = onSnapshot(chatRoomDocRef, (doc) => {
        if (!doc.exists()) return;
        
        const { recipientId, unreadCount } = doc.data();
        if (recipientId === `${currentUserChat.userId}` && unreadCount > 0) {
          updateDoc(chatRoomDocRef, {
            unreadCount: 0,
          }).catch((error) => {
            console.log('update chatRoom failed:', error);
          });
        }
      });

      return () => unsub();
    }
  }, [currentUserChat, selectedRoomId]);

  // lang nghe tong message 
  React.useEffect(() => {
    if (selectedRoomId) {
      const q = query(
        messageCollectionRef,
        where('roomId', '==', `${selectedRoomId}`)
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        setCount(querySnapshot?.size || 0);
      }, (error) => {
        console.error("Error getting message count:", error);
        setIsLoading(false);
      });

      return () => unsubscribe();
    }
  }, [selectedRoomId]);

  // danh sach messages
  React.useEffect(() => {
    if (!selectedRoomId) {
      setMessages([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      let q = query(
        messageCollectionRef,
        where('roomId', '==', `${selectedRoomId}`),
        orderBy('createdAt', 'desc'),
        limit(LIMIT)
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        try {
          const messagesData = querySnapshot.docs
            .map(doc => {
              const data = doc.data();
              return {
                ...data,
                id: doc.id,
                createdAt: data.createdAt?.toDate() // Convert Firestore Timestamp to JS Date
              };
            })
            .sort((a, b) => (a.createdAt?.getTime() || 0) - (b.createdAt?.getTime() || 0)); // Sort by timestamp

          if (querySnapshot.docs.length > 0) {
            setLastDocument(querySnapshot.docs[querySnapshot.docs.length - 1]);
          } else {
            setLastDocument(null);
          }

          setMessages(messagesData);
          setIsLoading(false);

          // Scroll to bottom for new messages
          if (messageListRef.current) {
            messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
          }
        } catch (error) {
          console.error("Error processing messages:", error);
          setIsLoading(false);
        }
      }, (error) => {
        console.error("Error getting messages:", error);
        setIsLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("Error setting up messages listener:", error);
      setIsLoading(false);
    }
  }, [selectedRoomId]);

  // tai them du lieu
  const handleLoadMore = async () => {
    if (!lastDocument || !hasMore) return;

    try {
      const q = query(
        messageCollectionRef,
        where('roomId', '==', `${selectedRoomId}`),
        orderBy('createdAt', 'desc'),
        startAfter(lastDocument),
        limit(LIMIT)
      );

      const querySnapshot = await getDocs(q);
      const messagesData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      if (querySnapshot.docs.length > 0) {
        setLastDocument(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setMessages(prev => [...prev, ...messagesData]);
        setPage(prev => prev + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more messages:", error);
      setHasMore(false);
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    if (inputValue.trim() !== '') {
      try {
        // them message
        await addDocument('messages', {
          text: inputValue,
          userId: `${currentUserChat?.userId}`,
          roomId: selectedRoomId,
        });

        // cap nhat chat room
        await updateChatRoomByPartnerId(partnerId, selectedRoomId);

        setInputValue('');
        if (inputRef?.current) {
          inputRef.current.focus();
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && event.shiftKey === false) {
      event.preventDefault();
      handleOnSubmit(event);
    }
  };

  React.useEffect(() => {
    // scroll to bottom after message changed
    if (messageListRef?.current) {
      messageListRef.current.scrollTop =
        messageListRef.current.scrollHeight + 50;
    }
  }, [messages]);

  return (
    <Stack direction="column" justifyContent="space-around">
      <Card>
        {selectedRoomId && (
          <Stack>
            {currentUserChat?.roleName === ROLES_NAME.JOB_SEEKER ? (
              <ChatInfo.HeaderChatInfo
                avatarUrl={selectedRoom?.user?.avatarUrl}
                title={selectedRoom?.user?.name}
                subTitle={selectedRoom?.user?.company?.companyName}
              />
            ) : (
              <ChatInfo.HeaderChatInfo
                avatarUrl={selectedRoom?.user?.avatarUrl}
                title={selectedRoom?.user?.name}
                subTitle={selectedRoom?.user?.email}
              />
            )}
          </Stack>
        )}
      </Card>
      <Box p={1}>
        {selectedRoomId ? (
          <Stack>
            <Box height="100%">
              {isLoading ? (
                <Stack
                  sx={{ py: 2 }}
                  justifyContent="center"
                  alignItems="center"
                  height={'72vh'}
                >
                  <CircularProgress color="secondary" sx={{ margin: 'auto' }} />
                </Stack>
              ) : messages.length === 0 ? (
                currentUserChat?.roleName === ROLES_NAME.JOB_SEEKER ? (
                  <ChatInfo
                    avatarUrl={selectedRoom?.user?.avatarUrl}
                    title={selectedRoom?.user?.name}
                    subTitle={selectedRoom?.user?.company?.companyName}
                    description={
                      selectedRoom?.createdBy !== `${currentUserChat?.userId}`
                        ? `${selectedRoom?.user?.company?.companyName} đã kết nối với bạn.`
                        : `Bạn đã kết nối đến ${selectedRoom?.user?.company?.companyName}`
                    }
                  />
                ) : (
                  <ChatInfo
                    avatarUrl={selectedRoom?.user?.avatarUrl}
                    title={selectedRoom?.user?.name}
                    subTitle={selectedRoom?.user?.email}
                    description={
                      selectedRoom?.createdBy !== `${currentUserChat?.userId}`
                        ? `${selectedRoom?.user?.name} đã kết nối với bạn.`
                        : `Bạn đã kết nối đến ${selectedRoom?.user?.name}`
                    }
                  />
                )
              ) : (
                <div
                  ref={messageListRef}
                  id="scrollableDiv"
                  style={{
                    height: '72vh',
                    overflow: 'auto',
                    display: 'flex',
                    flexDirection: 'column-reverse',
                  }}
                >
                  <InfiniteScroll
                    style={{
                      overflowY: 'auto',
                      padding: 2,
                      display: 'flex',
                      flexDirection: 'column-reverse',
                    }}
                    scrollableTarget="scrollableDiv"
                    dataLength={messages.length}
                    next={handleLoadMore}
                    hasMore={hasMore}
                    inverse={true}
                    loader={
                      <Stack sx={{ py: 2 }} justifyContent="center">
                        <CircularProgress
                          color="secondary"
                          sx={{ margin: '0 auto' }}
                        />
                      </Stack>
                    }
                  >
                    {messages.map((value) => (
                      <Message
                        key={value.id}
                        userId={value?.userId}
                        text={value?.text}
                        avatarUrl={
                          `${currentUserChat?.userId}` === `${value?.userId}`
                            ? currentUserChat?.avatarUrl
                            : selectedRoom?.user?.avatarUrl
                        }
                        createdAt={value?.createdAt}
                      />
                    ))}
                  </InfiniteScroll>
                </div>
              )}
            </Box>
            <Box
              flex={1}
              p={2}
              component="form"
              onSubmit={(e) => handleOnSubmit(e)}
            >
              <Stack direction="row" spacing={2} alignItems="flex-end">
                <Box flex={1}>
                  <TextField
                    inputRef={inputRef}
                    fullWidth
                    placeholder={'Nhập nội dung tại đây ...'}
                    defaultValue=""
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    multiline
                    maxRows={5}
                    variant="outlined"
                  />
                </Box>
                <Box>
                  <Button
                    variant="contained"
                    color="primary"
                    endIcon={<SendIcon />}
                    type="submit"
                  >
                    Gửi
                  </Button>
                </Box>
              </Stack>
            </Box>
          </Stack>
        ) : (
          <Stack justifyContent="center" alignItems="center">
            <Empty
              style={{ marginTop: 150 }}
              description="Bạn chưa chọn cuộc trò chuyện nào ..."
            />
          </Stack>
        )}
      </Box>
    </Stack>
  );
};

export default ChatWindow;
