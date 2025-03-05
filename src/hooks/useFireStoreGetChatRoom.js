import React from 'react';
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';
import db from '../configs/firebase-config';

import { getUserAccount } from '../services/firebaseService';

const useFireStoreGetChatRoom = (
  condition,
  userId,
  sort = 'desc',
  limitNum = null
) => {
  const [docs, setDocs] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let unsubscribe = () => {};

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const collectionRef = collection(db, 'chatRooms');
        let q = query(
          collectionRef,
          orderBy('createdAt', sort),
          limitNum && limit(limitNum)
        );

        if (condition) {
          if (!condition.compareValue) {
            setDocs([]);
            setIsLoading(false);
            return;
          }

          q = query(
            collectionRef,
            where(condition.fieldName, condition.operator, condition.compareValue),
            orderBy('createdAt', sort),
            limitNum && limit(limitNum)
          );
        }

        unsubscribe = onSnapshot(q, async (querySnapshot) => {
          try {
            const chatRoomsData = [];
            const promises = querySnapshot.docs.map(async (doc) => {
              let partnerId = '';
              const chatRoomData = doc.data();

              if (chatRoomData?.userId1 === `${userId}`) {
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
            setDocs(chatRoomsData);
          } catch (error) {
            console.error('Error processing chat room data:', error);
          } finally {
            setIsLoading(false);
          }
        }, (error) => {
          console.error('Error getting chat rooms:', error);
          setIsLoading(false);
        });
      } catch (error) {
        console.error('Error setting up chat room listener:', error);
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      unsubscribe();
    };
  }, [condition, userId, sort, limitNum]);

  return { docs, isLoading };
};

export default useFireStoreGetChatRoom;
