import React, { useState, useEffect } from 'react';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Loading from './loading';
import FetchDataFail from './fetch-data-fail';

export default function ThrowsData(props) {
  const [throws, setThrows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchFailed, setFetchFailed] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch(`https://the-ultimate-api.herokuapp.com/api/fighters/data/throws?fighterId=${props.focusedFighter.fighterId}`, {
      method: 'GET',
      headers: {
        accept: 'application/json'
      }
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          throw Error(res.status);
        }
      })
      .then(json => {
        setThrows(json);
        setIsLoading(false);
      })
      .catch(err => {
        setFetchFailed(true);
        setIsLoading(false);
        console.error('fetch failed!', err);
      });
  }, [props.focusedFighter.fighterId]);

  function checkNull(data) {
    return data === null
      ? '--'
      : data;
  }

  if (isLoading) {
    return (
      <Loading />
    );
  }
  if (fetchFailed) {
    return (
      <FetchDataFail data={'Grabs/Throws'} />
    );
  } else {
    const allThrows = throws.map(grapple => {
      return (
        <React.Fragment key={grapple.throwId}>
          <Col className='p-3'>
            <Card className='p-2 bg-light text-dark typical-box-shadow text-capitalize'>
              <Card.Title className='text-center fw-bold'>{grapple.name}</Card.Title>
              <p className='mb-0 pt-1 border-top'>Damage: {checkNull(grapple.damage)}</p>
              <p className='mb-0 pt-1 border-top'>Active Frames: {grapple.activeFrames}</p>
              <p className='mb-0 pt-1 border-top'>Total Frames: {grapple.totalFrames}</p>
            </Card>
          </Col>
        </React.Fragment>
      );
    });
    return allThrows;
  }
}