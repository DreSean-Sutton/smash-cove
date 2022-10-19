import { Modal } from 'react-bootstrap'
import { Button } from 'react-bootstrap';
import { Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './CardSelectModal.css';

export default function CardSelectModal(props: any) {
  return (
    <Modal size='sm' centered show={props.modal} className='character-card-modal text-center'>
      <Modal.Header className='character-card-header d-block'>Show Details?</Modal.Header>
      <Row className='mt-3 mb-3 justify-content-center'>
        <Link className='w-25 p-0 m-0' to={`/character-details/${props.focusedFighter.fighter}`}>
          <Button className='card-modal-link'>Details</Button>
        </Link>
      </Row>

    </Modal>
  )
}
