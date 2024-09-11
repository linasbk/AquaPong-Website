import React, { useContext } from 'react';
import  {UserContext}  from '../../../../contexts/UserContext';
import Button from '../../../button/button';



const ClanBottomBar = ({selectedClan, conversationRef}) => {
    const { userInfo } = useContext(UserContext);

    const joinClan = () => {

        if (conversationRef && conversationRef.current) {
            conversationRef.current.send(JSON.stringify({
              my_userID: userInfo?.id,
              create_or_add: "join_group",
              Group_name:selectedClan.name
            }));

            conversationRef.current.onmessage = (e) => {
              const data = JSON.parse(e.data);
                setClansData(data);

            };
            window.location.reload();
          } 
    }

    const askToJoinClan = () => {
        if (conversationRef && conversationRef.current) {
            conversationRef.current.send(JSON.stringify({
              my_userID: userInfo?.id,
              create_or_add: "join_group",
              Group_name:selectedClan.name
            }));

            conversationRef.current.onmessage = (e) => {
              const data = JSON.parse(e.data);
                setClansData(data);
            };
          }

    }


    return (
      <nav className='relative flex justify-evenly  items-center flex-row-reverse h-[50px] rounded-b-lg w-full bg-white bg-opacity-20'>
        {selectedClan?.status === 'Public' ? <Button onClick={joinClan} style='bg-aqua-pong scale-75'  value='Join' /> : <Button onClick={askToJoinClan} style='bg-aqua-pong  scale-75 ' className='text-black'  value='Ask' />}
        <p className='text-white'>{selectedClan?.status}</p>
      </nav>
    );
}

export default ClanBottomBar;