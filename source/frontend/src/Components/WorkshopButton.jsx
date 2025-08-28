import { useNavigate } from 'react-router-dom';
import Button from './Button';

const WorkshopButton = () => {
  const navigate = useNavigate();
  const handleRoom = () =>{
    navigate('/workshops');
  }

  return (
    <div>
        <button onClick={handleRoom}>Workshop</button>
    </div>
  );
};

export default WorkshopButton;