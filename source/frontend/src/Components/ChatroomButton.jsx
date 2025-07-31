import { useNavigate } from 'react-router-dom';
import Button from './Button';

const ChatroomButton = () => {
  const navigate = useNavigate();
  const handleRoom = () =>{
    navigate('/chatroom');
  }

  return (
    <div>
        <button onClick={handleRoom}>Chatroom</button>
    </div>
  );
};

export default ChatroomButton;