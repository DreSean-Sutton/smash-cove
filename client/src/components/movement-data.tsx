import React, { useState, useEffect } from 'react';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Loading from './loading';
import FetchDataFail from './fetch-data-fail';
import axios from 'axios';

interface MovementDataProps {
  currentFighter: string | undefined
}
export default function MovementData(props: MovementDataProps) {
  const [movements, setMovements] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchFailed, setFetchFailed] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    async function fetchData() {
      try {
        const res = await axios(`https://the-ultimate-api.herokuapp.com/api/fighters/data/movements?fighter=${props.currentFighter}`)
        if (res.status === 200) {
          setMovements(res.data);
        } else {
          throw Error();
        }
      } catch (e) {
        setFetchFailed(true);
        console.error('fetch failed!', e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [props.currentFighter]);

  if (isLoading) {
    return (
      <Loading />
    );
  }
  if (fetchFailed) {
    return (
      <FetchDataFail data={'Dodges/Rolls'} />
    );
  } else {

    const renderMovements = (movement: any) => {
      return (
        <React.Fragment key={movement.movementId}>
          <Col className='p-3'>
            <Card className='p-2 bg-light text-dark typical-box-shadow text-capitalize'>
              <Card.Title className='text-center fw-bold'>{movement.name}</Card.Title>
              <p className='mb-0 pt-1 border-top'>Active Frames: {movement.activeFrames}</p>
              <p className='mb-0 pt-1 border-top'>Total Frames: {movement.totalFrames}</p>
            </Card>
          </Col>
        </React.Fragment>
      );
    }
    const allMovements = movements.map(renderMovements);
    return (
      <>
        { allMovements }
      </>
    )
  }
}